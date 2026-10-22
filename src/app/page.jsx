import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#00008B] overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="relative z-10 w-full max-w-4xl text-center space-y-6 pt-12 pb-24">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-200">
          Domain-specific
        </h2>

        <h1 className="text-7xl sm:text-8xl md:text-[140px] font-extrabold text-white leading-[0.85] tracking-tighter">
          KEYWORD<br />ANALYSIS
        </h1>

        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto pt-6 leading-relaxed">
          Upload a syllabus, educational document or research abstract. Our RAKE-powered engine pulls out the <span className="border-b-[3px] border-yellow-400 font-bold text-white pb-0.5">pedagogical keywords</span> and visualizes your data.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 w-full max-w-md mx-auto">
          <Link
            href="/upload"
            className="flex items-center justify-center gap-2 bg-[#FACC15] text-[#00008B] px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all w-full shadow-lg"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-all w-full"
          >
            View Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}
