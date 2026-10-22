"use client";

import { useState, useEffect, useMemo } from "react";
import KeywordTable from "@/components/KeywordTable";
import { FileText, Tags, Loader2, BarChart3, Filter } from "lucide-react";
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
    <div className="relative min-h-screen bg-[#00008B] overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Analytics Dashboard</h1>
          <p className="text-blue-200 mt-1">Overview of your analyzed educational content.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#05052e]/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-blue-500/30 flex items-center gap-4">
            <div className="p-4 bg-blue-900/50 text-yellow-400 rounded-xl"><FileText className="w-8 h-8" /></div>
            <div>
              <p className="text-sm font-medium text-blue-300">Total Documents (Loaded)</p>
              <p className="text-3xl font-bold text-white">{totalDocs}</p>
            </div>
          </div>
          <div className="bg-[#05052e]/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-blue-500/30 flex items-center gap-4">
            <div className="p-4 bg-blue-900/50 text-yellow-400 rounded-xl"><Tags className="w-8 h-8" /></div>
            <div>
              <p className="text-sm font-medium text-blue-300">Keywords in Selected Doc</p>
              <p className="text-3xl font-bold text-white">{selectedKeywordsCount}</p>
            </div>
          </div>
          <div className="bg-[#05052e]/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-blue-500/30 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-yellow-400" />
              <p className="text-sm font-medium text-blue-300">Top Keyword</p>
            </div>
            <p className="text-xl font-bold text-white truncate" title={topKeyword}>{topKeyword}</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-[#05052e]/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-blue-500/30">
          <h2 className="text-lg font-bold text-white mb-6">
            Keyword Analysis: <span className="text-yellow-400">{selected ? selected.title : "Select a Document"}</span>
          </h2>
          {chartData.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e3a8a" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: '#93c5fd' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#93c5fd' }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: '#1e3a8a' }}
                    contentStyle={{ borderRadius: '8px', backgroundColor: '#02021c', border: '1px solid #3b82f6', color: '#fff' }}
                  />
                  <Bar dataKey="score" fill="#FACC15" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-blue-300 bg-[#02021c] rounded-xl border border-dashed border-blue-500/50">
              {selected ? "No keywords extracted yet. Click 'Extract Keywords'." : "Select a document."}
            </div>
          )}
        </div>

        {/* Main Split Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Document Sidebar */}
          <div className="lg:col-span-4 bg-[#05052e]/90 backdrop-blur-md rounded-2xl shadow-lg border border-blue-500/30 overflow-hidden flex flex-col h-[650px]">

            <div className="p-4 border-b border-blue-500/30 bg-[#02021c] space-y-3">
              <h2 className="font-bold text-white flex items-center gap-2"><Filter className="w-4 h-4 text-yellow-400" /> Filter Library</h2>
              <div className="flex gap-2">
                <select
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                  className="w-full text-xs p-2 border border-blue-500/50 rounded-lg bg-[#05052e] text-white focus:border-yellow-400 focus:outline-none"
                >
                  <option value="All">All Domains</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Systems">Information Systems</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="Education & EdTech">Education & EdTech</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full text-xs p-2 border border-blue-500/50 rounded-lg bg-[#05052e] text-white focus:border-yellow-400 focus:outline-none"
                >
                  <option value="All">All Types</option>
                  <option value="Course Syllabus">Course Syllabus</option>
                  <option value="Scholarly Abstract">Scholarly Abstract</option>
                  <option value="Search Query Log">Search Query Log</option>
                </select>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-1">
              {filteredDocuments.length === 0 && (
                <p className="text-sm text-blue-300 p-4 text-center">No documents match filters.</p>
              )}
              {filteredDocuments.map((doc) => (
                <button
                  key={doc._id}
                  onClick={() => setSelected(doc)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all flex flex-col group ${selected?._id === doc._id
                      ? "bg-blue-900/50 border border-yellow-400/50"
                      : "hover:bg-blue-900/30 border border-transparent"
                    }`}
                >
                  <span className={`truncate w-full text-sm ${selected?._id === doc._id ? "text-white font-semibold" : "text-blue-100"}`}>
                    {doc.title}
                  </span>
                  <span className={`text-[10px] uppercase mt-1 ${selected?._id === doc._id ? "text-yellow-400" : "text-blue-400"}`}>
                    {doc.domain || "Uncategorized"} • {doc.sourceType || "No Type"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-8 space-y-6">
            {selected ? (
              <>
                <div className="bg-[#05052e]/90 backdrop-blur-md rounded-2xl shadow-lg border border-blue-500/30 p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selected.title}</h2>
                      <p className="text-sm text-blue-300 mt-1">{selected.domain} • {selected.sourceType}</p>
                    </div>
                    <button
                      onClick={() => analyze(selected._id)}
                      disabled={analyzing}
                      className="flex items-center gap-2 bg-[#FACC15] text-[#00008B] px-5 py-2.5 rounded-xl font-bold hover:bg-yellow-300 disabled:opacity-70 transition-all shadow-md"
                    >
                      {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Tags className="w-5 h-5" />}
                      {analyzing ? "Analyzing..." : "Extract Keywords"}
                    </button>
                  </div>
                  <div className="prose prose-sm md:prose-base max-w-none text-blue-100 bg-[#02021c] p-6 rounded-xl border border-blue-500/30 whitespace-pre-line max-h-[300px] overflow-y-auto">
                    {selected.content}
                  </div>
                </div>

                <div className="bg-[#05052e]/90 backdrop-blur-md rounded-2xl shadow-lg border border-blue-500/30 p-8">
                  <h3 className="text-xl font-bold text-white mb-6">Extracted Keywords</h3>
                  <KeywordTable keywords={selected.keywords} />
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center bg-[#05052e]/90 backdrop-blur-md rounded-2xl border border-dashed border-blue-500/50 p-12 text-center">
                <p className="text-blue-300">Select a document from the library to view details and run analysis.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
