"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";

export default function DocumentForm({ onSaved }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/documents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }),
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
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6"
        >
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Document Title
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g., Introduction to Data Science"
                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 bg-gray-50 border transition-colors"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Educational Content
                </label>
                <textarea
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    placeholder="Paste syllabus, abstract, or course description here..."
                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 bg-gray-50 border transition-colors resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-all shadow-lg"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {loading ? "Saving..." : "Save Document"}
            </button>
        </form>
    );
}
