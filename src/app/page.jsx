import Link from "next/link";
import { ArrowRight, BarChart3, FileText, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
      {/* Hero Section */}
      <div className="space-y-6 max-w-3xl">
        <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-2">
          Final Year Project Showcase
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
          Unlock Insights with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Domain-Specific</span> Keyword Analysis
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Upload educational documents, syllabi, or research abstracts. Our RAKE-powered engine instantly extracts the most relevant pedagogical keywords and visualizes your data.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            href="/upload"
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 bg-white text-gray-800 border-2 border-gray-200 px-8 py-3 rounded-xl font-semibold hover:border-indigo-600 hover:text-indigo-600 transition-all"
          >
            View Analytics
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-12 pt-12 border-t border-gray-200">
        <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold mb-2">Smart Upload</h3>
          <p className="text-gray-500 text-sm text-center">Easily paste course outlines, abstracts, and syllabus content.</p>
        </div>
        <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl mb-4">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold mb-2">RAKE Extraction</h3>
          <p className="text-gray-500 text-sm text-center">Lightning-fast extraction of multi-word phrases and single keywords.</p>
        </div>
        <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl mb-4">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold mb-2">Data Analytics</h3>
          <p className="text-gray-500 text-sm text-center">Visualize the most frequent terms across your entire document library.</p>
        </div>
      </div>
    </div>
  );
}
