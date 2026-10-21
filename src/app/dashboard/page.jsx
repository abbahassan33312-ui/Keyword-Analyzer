"use client";

import { useState, useEffect, useMemo } from "react";
import KeywordTable from "@/components/KeywordTable";
import { FileText, Tags, Loader2, BarChart3, ChevronRight, Filter } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function DashboardPage() {
  const [documents, setDocuments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  const [domainFilter, setDomainFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    fetch("/api/documents")
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data);
        if (data.length > 0) setSelected(data[0]);
      });
  }, []);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Added .trim() to prevent mismatch issues
      const matchDomain = domainFilter === "All" || doc.domain?.trim() === domainFilter;
      const matchType = typeFilter === "All" || doc.sourceType?.trim() === typeFilter;
      return matchDomain && matchType;
    });
  }, [documents, domainFilter, typeFilter]);

  const chartData = useMemo(() => {
    if (!selected || !selected.keywords || selected.keywords.length === 0) return [];
    return [...selected.keywords]
      .sort((a, b) => b.score - a.score)
      .slice(0, 7)
      .map((kw) => ({ name: kw.keyword, score: kw.score }));
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
      const updatedDocs = documents.map((d) => d._id === docId ? { ...d, keywords: data.keywords } : d);
      setDocuments(updatedDocs);
      setSelected((prev) => prev && prev._id === docId ? { ...prev, keywords: data.keywords } : prev);
    }
    setAnalyzing(false);
  }

  const totalDocs = documents.length;
  const selectedKeywordsCount = selected?.keywords?.length || 0;
  const topKeyword = chartData.length > 0 ? chartData[0].name : "N/A";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your analyzed educational content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl"><FileText className="w-8 h-8" /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Documents (Loaded)</p>
            <p className="text-3xl font-bold text-gray-900">{totalDocs}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl"><Tags className="w-8 h-8" /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Keywords in Selected Doc</p>
            <p className="text-3xl font-bold text-gray-900">{selectedKeywordsCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            <p className="text-sm font-medium text-gray-500">Top Keyword</p>
          </div>
          <p className="text-xl font-bold text-gray-900 truncate" title={topKeyword}>{topKeyword}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Keyword Analysis: <span className="text-indigo-600">{selected ? selected.title : "Select a Document"}</span>
        </h2>
        {chartData.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="score" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            {selected ? "No keywords extracted yet. Click 'Extract Keywords'." : "Select a document."}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[650px]">
          
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 space-y-3">
            <h2 className="font-bold text-gray-800 flex items-center gap-2"><Filter className="w-4 h-4"/> Filter Library</h2>
            <div className="flex gap-2">
              <select value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)} className="w-full text-xs p-2 border rounded-lg bg-white">
                <option value="All">All Domains</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Systems">Information Systems</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Education & EdTech">Education & EdTech</option>
              </select>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full text-xs p-2 border rounded-lg bg-white">
                <option value="All">All Types</option>
                <option value="Course Syllabus">Course Syllabus</option>
                <option value="Scholarly Abstract">Scholarly Abstract</option>
                <option value="Search Query Log">Search Query Log</option>
              </select>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {filteredDocuments.length === 0 && (
              <p className="text-sm text-gray-500 p-4 text-center">No documents match filters.</p>
            )}
            {filteredDocuments.map((doc) => (
              <button
                key={doc._id}
                onClick={() => setSelected(doc)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex flex-col group ${selected?._id === doc._id ? "bg-indigo-50 border border-indigo-100" : "hover:bg-gray-50 border border-transparent"}`}
              >
                <span className={`truncate w-full text-sm ${selected?._id === doc._id ? "text-indigo-700 font-semibold" : "text-gray-700"}`}>{doc.title}</span>
                <span className="text-[10px] text-gray-400 uppercase mt-1">{doc.domain || "Uncategorized"} • {doc.sourceType || "No Type"}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {selected ? (
            <>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selected.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{selected.domain} • {selected.sourceType}</p>
                  </div>
                  <button onClick={() => analyze(selected._id)} disabled={analyzing} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-70 transition-all shadow-md">
                    {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Tags className="w-5 h-5" />}
                    {analyzing ? "Analyzing..." : "Extract Keywords"}
                  </button>
                </div>
                <div className="prose prose-sm md:prose-base max-w-none text-gray-600 bg-gray-50 p-6 rounded-xl border border-gray-100 whitespace-pre-line max-h-[300px] overflow-y-auto">
                  {selected.content}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Extracted Keywords</h3>
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
