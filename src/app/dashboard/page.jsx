// src/app/dashboard/page.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import KeywordTable from "@/components/KeywordTable";
import { FileText, Tags, Loader2, BarChart3, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function DashboardPage() {
    const [documents, setDocuments] = useState([]);
    const [selected, setSelected] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    // Fetch documents on mount
    useEffect(() => {
        fetch("/api/documents")
            .then((res) => res.json())
            .then((data) => {
                setDocuments(data);
                if (data.length > 0) setSelected(data[0]); // Select first by default
            });
    }, []);

    // Recalculate chart data whenever the selected document changes
    const chartData = useMemo(() => {
        if (!selected || !selected.keywords || selected.keywords.length === 0) return [];

        // Sort by score descending and take the top 7
        return [...selected.keywords]
            .sort((a, b) => b.score - a.score)
            .slice(0, 7)
            .map((kw) => ({
                name: kw.keyword,
                score: kw.score,
            }));
    }, [selected]);

    async function analyze(docId) {
        setAnalyzing(true);
        const res = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ documentId: docId }),
        });

        if (res.ok) {
            const data = await res.json();
            const updatedDocs = documents.map((d) =>
                d._id === docId ? { ...d, keywords: data.keywords } : d
            );

            setDocuments(updatedDocs);
            setSelected((prev) => prev && prev._id === docId ? { ...prev, keywords: data.keywords } : prev);
        }
        setAnalyzing(false);
    }

    // Stat calculations
    const totalDocs = documents.length;
    const selectedKeywordsCount = selected?.keywords?.length || 0;
    const topKeyword = chartData.length > 0 ? chartData[0].name : "N/A";

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics Dashboard</h1>
                <p className="text-gray-500 mt-1">Overview of your analyzed educational content.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
                        <FileText className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Documents</p>
                        <p className="text-3xl font-bold text-gray-900">{totalDocs}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Tags className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Keywords in Selected Doc</p>
                        <p className="text-3xl font-bold text-gray-900">{selectedKeywordsCount}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-5 h-5 text-gray-400" />
                        <p className="text-sm font-medium text-gray-500">Top Keyword (Selected)</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900 truncate" title={topKeyword}>
                        {topKeyword}
                    </p>
                </div>
            </div>

            {/* Dynamic Chart based on Selected Document */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-900">
                        Keyword Analysis: <span className="text-indigo-600">{selected ? selected.title : "Select a Document"}</span>
                    </h2>
                </div>

                {chartData.length > 0 ? (
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    // Truncate very long multi-word phrases
                                    tickFormatter={(value) => value.length > 18 ? value.substring(0, 18) + '...' : value}
                                    angle={-15}
                                    textAnchor="end"
                                />
                                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="score" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-72 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        {selected ? "No keywords extracted yet. Click 'Extract Keywords'." : "Select a document to view analytics."}
                    </div>
                )}
            </div>

            {/* Main Split Pane */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Document Sidebar */}
                <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="font-bold text-gray-800">Your Library</h2>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-1">
                        {documents.map((doc) => (
                            <button
                                key={doc._id}
                                onClick={() => setSelected(doc)}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${selected?._id === doc._id
                                        ? "bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100"
                                        : "hover:bg-gray-50 text-gray-700 border border-transparent"
                                    }`}
                            >
                                <span className="truncate pr-2">{doc.title}</span>
                                <ChevronRight className={`w-4 h-4 ${selected?._id === doc._id ? "text-indigo-500" : "text-gray-300 group-hover:text-gray-400"}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Detail Panel */}
                <div className="lg:col-span-8 space-y-6">
                    {selected ? (
                        <>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900">{selected.title}</h2>
                                    <button
                                        onClick={() => analyze(selected._id)}
                                        disabled={analyzing}
                                        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-70 transition-all shadow-md"
                                    >
                                        {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Tags className="w-5 h-5" />}
                                        {analyzing ? "Analyzing..." : "Extract Keywords"}
                                    </button>
                                </div>
                                <div className="prose prose-sm md:prose-base max-w-none text-gray-600 bg-gray-50 p-6 rounded-xl border border-gray-100 whitespace-pre-line max-h-[300px] overflow-y-auto">
                                    {selected.content}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">
                                    Extracted Keywords
                                </h3>
                                <KeywordTable keywords={selected.keywords} />
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                            <p className="text-gray-500">Select a document from the library to view details and run analysis.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
