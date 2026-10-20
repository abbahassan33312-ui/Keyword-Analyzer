import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "EduKeyword Analyser",
  description: "Domain‑specific keyword analysis for educational documents",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen text-gray-900 font-sans antialiased">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
