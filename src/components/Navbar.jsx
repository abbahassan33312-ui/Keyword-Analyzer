import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-[#00008B]/90 backdrop-blur-md border-b border-blue-500/30 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-yellow-400 transition-colors">
                        <BookOpen className="w-6 h-6 text-yellow-400" />
                        <span>EduKeyword Analyser</span>
                    </Link>
                    <div className="flex space-x-6 items-center">
                        <Link href="/" className="text-sm font-medium text-blue-100 hover:text-white transition-colors">
                            Home
                        </Link>
                        <Link href="/upload" className="text-sm font-medium text-blue-100 hover:text-white transition-colors">
                            Upload
                        </Link>
                        <Link href="/dashboard" className="text-sm font-bold bg-[#FACC15] text-[#00008B] px-5 py-2 rounded-full hover:bg-yellow-300 transition-colors shadow-sm">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
