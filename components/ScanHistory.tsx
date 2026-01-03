
import React, { useState, useMemo } from 'react';
import { ScanResult, RiskLevel } from '../types';

interface ScanHistoryProps {
  history: ScanResult[];
}

type SortKey = 'url' | 'riskScore' | 'timestamp';
type SortOrder = 'asc' | 'desc';

const ScanHistory: React.FC<ScanHistoryProps> = ({ history }) => {
  const [filter, setFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    return history
      .filter(item => {
        const matchesSearch = item.url.toLowerCase().includes(filter.toLowerCase());
        const matchesRisk = riskFilter === 'ALL' || item.riskLevel === riskFilter;
        return matchesSearch && matchesRisk;
      })
      .sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];

        if (sortKey === 'timestamp') {
          valA = new Date(a.timestamp).getTime();
          valB = new Date(b.timestamp).getTime();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [history, filter, riskFilter, sortKey, sortOrder]);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span className="ml-1 opacity-20">⇅</span>;
    return <span className="ml-1 text-indigo-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="space-y-6 py-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Archive</h1>
          <p className="text-slate-400">Comprehensive repository of ML forensic results and AI assessments.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="text"
              placeholder="Search domain..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm outline-none cursor-pointer focus:border-indigo-500 transition-all"
          >
            <option value="ALL">All Risk Levels</option>
            <option value={RiskLevel.CRITICAL}>Critical Only</option>
            <option value={RiskLevel.HIGH}>High Only</option>
            <option value={RiskLevel.MEDIUM}>Medium Only</option>
            <option value={RiskLevel.LOW}>Low Only</option>
          </select>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-slate-800/50 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b border-slate-800">
                <th className="px-6 py-4 cursor-pointer hover:text-slate-300 transition-colors" onClick={() => toggleSort('url')}>
                  Domain <SortIcon col="url" />
                </th>
                <th className="px-6 py-4">Risk Rating</th>
                <th className="px-6 py-4 text-center cursor-pointer hover:text-slate-300 transition-colors" onClick={() => toggleSort('riskScore')}>
                  Score <SortIcon col="riskScore" />
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-slate-300 transition-colors" onClick={() => toggleSort('timestamp')}>
                  Scan Date <SortIcon col="timestamp" />
                </th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
                      <p className="text-sm italic">No records found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map(item => (
                  <React.Fragment key={item.id}>
                    <tr 
                      className={`hover:bg-white/[0.02] transition-colors cursor-pointer group ${expandedId === item.id ? 'bg-indigo-500/5' : ''}`}
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className={`w-2 h-2 rounded-full ${
                             item.riskLevel === RiskLevel.CRITICAL || item.riskLevel === RiskLevel.HIGH ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                           }`} />
                           <span className="font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">{item.url}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
                          item.riskLevel === RiskLevel.CRITICAL ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 
                          item.riskLevel === RiskLevel.HIGH ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 
                          item.riskLevel === RiskLevel.MEDIUM ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        }`}>
                          {item.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-block px-2 py-1 bg-slate-800 rounded text-xs font-bold mono">
                          {item.riskScore}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                        {new Date(item.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex justify-end gap-2">
                            <button className="p-1.5 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-white">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                            </button>
                            <svg 
                              className={`text-slate-600 transition-transform duration-300 ${expandedId === item.id ? 'rotate-180' : ''}`} 
                              xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            >
                              <path d="m6 9 6 6 6-6"/>
                            </svg>
                         </div>
                      </td>
                    </tr>
                    {expandedId === item.id && (
                      <tr>
                        <td colSpan={5} className="px-8 py-6 bg-slate-950/40 border-y border-slate-800/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="space-y-4">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Forensic Assessment</h4>
                              <p className="text-sm text-slate-300 leading-relaxed italic bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10">
                                "{item.aiAssessment || "Manual analysis recommended. No AI summary available for this snapshot."}"
                              </p>
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Technical Artifacts</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                                  <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Domain Age</div>
                                  <div className="text-sm font-semibold text-white">{item.features.domainAge} days</div>
                                </div>
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                                  <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">SSL Validation</div>
                                  <div className={`text-sm font-semibold ${item.features.sslValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {item.features.sslValid ? 'Certified' : 'Missing/Revoked'}
                                  </div>
                                </div>
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                                  <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">KRAIL Status</div>
                                  <div className={`text-sm font-semibold ${item.features.regulatoryBlacklisted ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {item.features.regulatoryBlacklisted ? 'BLACKLISTED' : 'AUTHORIZED'}
                                  </div>
                                </div>
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                                  <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Financial Latency</div>
                                  <div className="text-sm font-semibold text-white">~{item.features.withdrawalDelayAvg}h avg</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScanHistory;
