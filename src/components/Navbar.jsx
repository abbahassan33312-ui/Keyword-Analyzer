import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
                        <BookOpen className="w-6 h-6" />
                        <span>EduKeyword Analyser</span>
                    </Link>
                    <div className="flex space-x-6 items-center">
                        <Link href="/" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                            Home
                        </Link>
                        <Link href="/upload" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                            Upload
                        </Link>
                        <Link href="/dashboard" className="text-sm font-medium bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full hover:bg-indigo-100 transition-colors">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
