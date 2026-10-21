"use client";

export default function KeywordTable({ keywords }) {
    if (!keywords || keywords.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">No keywords extracted yet. Click "Extract Keywords" to analyze.</p>
            </div>
        );
    }

    const maxScore = Math.max(...keywords.map(k => k.score));

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Keyword</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Relevance Score</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {keywords.map((kw, idx) => {
                        const percentage = Math.round((kw.score / maxScore) * 100);
                        return (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{kw.keyword}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    <div className="flex items-center gap-3">
                                        <div className="w-full bg-gray-100 rounded-full h-2.5 max-w-[150px]">
                                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <span className="font-semibold text-gray-700 w-8">{kw.score}</span>
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