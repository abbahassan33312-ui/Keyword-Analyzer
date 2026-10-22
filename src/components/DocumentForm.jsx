"use client";

import { useState } from "react";
import { Loader2, Save, UploadCloud, FileText } from "lucide-react";

export default function DocumentForm({ onSaved }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [domain, setDomain] = useState("Computer Science");
    const [sourceType, setSourceType] = useState("Course Syllabus");
    const [loading, setLoading] = useState(false);
    const [extracting, setExtracting] = useState(false);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Please upload a valid PDF file.");
            return;
        }

        setExtracting(true);
        try {
            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item) => item.str).join(" ");
                fullText += pageText + "\n\n";
            }

            setContent(fullText.trim());
            if (!title) setTitle(file.name.replace(".pdf", ""));
        } catch (error) {
            console.error("Error extracting PDF:", error);
            alert("Failed to extract text from PDF. The file might be image-based or corrupted.");
        } finally {
            setExtracting(false);
            e.target.value = null;
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/documents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content, domain, sourceType }),
        });

        if (res.ok) {
            const newDoc = await res.json();
            setTitle("");
            setContent("");
            if (onSaved) onSaved(newDoc);
        }
        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="bg-[#05052e]/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-blue-500/30 space-y-6">

            {/* PDF Upload Section */}
            <div className="bg-blue-900/30 border-2 border-dashed border-blue-400/50 rounded-xl p-6 text-center hover:bg-blue-800/40 transition-colors">
                <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" id="pdf-upload" disabled={extracting} />
                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    {extracting ? <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" /> : <UploadCloud className="w-8 h-8 text-yellow-400" />}
                    <span className="text-sm font-semibold text-white">{extracting ? "Extracting text from PDF..." : "Click to upload a PDF"}</span>
                    <span className="text-xs text-blue-300">We will automatically extract the text for you</span>
                </label>
            </div>

            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-blue-500/30"></div>
                <span className="flex-shrink-0 mx-4 text-blue-300 text-xs font-bold tracking-wider uppercase">Or paste manually</span>
                <div className="flex-grow border-t border-blue-500/30"></div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-blue-100 mb-2">Document Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g., Introduction to Data Science"
                    className="block w-full rounded-xl border border-blue-500/50 focus:border-yellow-400 focus:ring-yellow-400 px-4 py-3 bg-[#02021c] text-white placeholder-blue-500/70 transition-colors"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-blue-100 mb-2">Domain</label>
                    <select
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="block w-full rounded-xl border border-blue-500/50 focus:border-yellow-400 focus:ring-yellow-400 px-4 py-3 bg-[#02021c] text-white transition-colors"
                    >
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Systems">Information Systems</option>
                        <option value="Data Analytics">Data Analytics</option>
                        <option value="Education & EdTech">Education & EdTech</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-blue-100 mb-2">Source Type</label>
                    <select
                        value={sourceType}
                        onChange={(e) => setSourceType(e.target.value)}
                        className="block w-full rounded-xl border border-blue-500/50 focus:border-yellow-400 focus:ring-yellow-400 px-4 py-3 bg-[#02021c] text-white transition-colors"
                    >
                        <option value="Course Syllabus">Course Syllabus</option>
                        <option value="Scholarly Abstract">Scholarly Abstract</option>
                        <option value="Search Query Log">Search Query Log</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-blue-100 mb-2 flex items-center justify-between">
                    <span>Educational Content</span>
                    {content && <span className="text-xs text-green-400 flex items-center gap-1"><FileText className="w-3 h-3" /> Text Loaded</span>}
                </label>
                <textarea
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    placeholder="Paste syllabus, abstract, or course description here..."
                    className="block w-full rounded-xl border border-blue-500/50 focus:border-yellow-400 focus:ring-yellow-400 px-4 py-3 bg-[#02021c] text-white placeholder-blue-500/70 transition-colors resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={loading || extracting}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-[#FACC15] px-4 py-3 text-[#00008B] font-bold text-lg hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 focus:ring-offset-[#05052e] disabled:opacity-70 transition-all shadow-lg"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {loading ? "Saving..." : "Save Document"}
            </button>
        </form>
    );
}
