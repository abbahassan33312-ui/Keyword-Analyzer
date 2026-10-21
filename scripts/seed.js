// scripts/seed.js
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");

// Hardcoded local MongoDB connection string
const MONGODB_URI = "mongodb://127.0.0.1:27017/keyword_analyzer";

const DocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    domain: { type: String },
    sourceType: { type: String },
    sourceId: { type: String },
    keywords: [{ keyword: String, score: Number }],
    analyzedAt: Date,
  },
  { timestamps: true }
);

const Document = mongoose.models.Document || mongoose.model("Document", DocumentSchema);

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB.");

    await Document.deleteMany({});
    console.log("🧹 Cleared existing documents.");

    const csvPath = path.join(__dirname, "../educational_dataset_3500.csv");

    if (!fs.existsSync(csvPath)) {
      console.error("❌ Could not find educational_dataset_3500.csv in the root folder.");
      process.exit(1);
    }

    console.log("Reading CSV file...");
    const results = [];

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (data) => {
        results.push({
          sourceId: data.source_id?.trim(),
          sourceType: data.source_type?.trim(),
          domain: data.domain?.trim(),
          title: data.display_name?.trim(),
          content: data.content?.trim(),
        });
      })
      .on("end", async () => {
        try {
          await Document.insertMany(results);
          console.log(`🎉 Successfully seeded ${results.length} documents!`);
          mongoose.disconnect();
        } catch (error) {
          console.error("❌ Error inserting documents:", error);
          mongoose.disconnect();
        }
      });
  } catch (error) {
    console.error("❌ Error connecting to DB:", error);
  }
}

seedDatabase();