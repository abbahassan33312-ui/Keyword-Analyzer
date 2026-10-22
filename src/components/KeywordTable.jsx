"use client";

export default function KeywordTable({ keywords }) {
    if (!keywords || keywords.length === 0) {
        return (
            <div className="text-center p-8 bg-[#05052e] rounded-xl border border-dashed border-blue-500/50">
                <p className="text-blue-300 text-sm">No keywords extracted yet. Click "Extract Keywords" to analyze.</p>
            </div>
        );
    }

    const maxScore = Math.max(...keywords.map(k => k.score));

    return (
        <div className="overflow-hidden rounded-xl border border-blue-500/30">
            <table className="min-w-full divide-y divide-blue-500/30">
                <thead className="bg-[#02021c]">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">
                            Keyword
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">
                            Relevance Score
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-[#05052e] divide-y divide-blue-500/30">
                    {keywords.map((kw, idx) => {
                        const percentage = Math.round((kw.score / maxScore) * 100);
                        return (
                            <tr key={idx} className="hover:bg-blue-900/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                    {kw.keyword}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-full bg-blue-950 rounded-full h-2.5 max-w-[150px]">
                                            <div
                                                className="bg-yellow-400 h-2.5 rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="font-bold text-white w-8">{kw.score}</span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
