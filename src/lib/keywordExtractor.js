// src/lib/keywordExtractor.js
import rake from "node-rake-v2";

// Custom stopwords to prevent the package from trying to read stopWords.txt
const MY_STOPWORDS = [
  "a",
  "about",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "com",
  "de",
  "en",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "it",
  "la",
  "of",
  "on",
  "or",
  "that",
  "the",
  "this",
  "to",
  "was",
  "what",
  "when",
  "where",
  "who",
  "will",
  "with",
  "und",
  "the",
  "www",
  "course",
  "student",
  "students",
  "university",
];

export function extractKeywords(text, maxKeywords = 10) {
  if (!text || text.trim().length === 0) return [];

  // Pass custom stopwords to avoid the ENOENT file reading error
  const rawKeywords = rake.generate(text, { stopwords: MY_STOPWORDS });

  // Generate a frequency dictionary for scoring
  const wordFreq = {};
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];

  words.forEach((w) => {
    wordFreq[w] = (wordFreq[w] || 0) + 1;
  });

  // Score keywords (including multi-word phrases)
  const scored = rawKeywords.map((kw) => {
    // Split phrase into individual words to calculate the total score
    const phraseWords = kw.toLowerCase().split(/\s+/);
    let score = 0;
    phraseWords.forEach((w) => {
      score += wordFreq[w] || 0;
    });

    return {
      keyword: kw,
      score: score || 1, // Fallback to 1 if score is 0
    };
  });

  // Sort descending by score and limit
  return scored.sort((a, b) => b.score - a.score).slice(0, maxKeywords);
}
