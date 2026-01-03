
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ICONS, MOCK_HISTORY } from '../constants';

const INITIAL_DASHBOARD_DATA = [
  { name: 'Mon', scans: 450, fraud: 12 },
  { name: 'Tue', scans: 520, fraud: 18 },
  { name: 'Wed', scans: 610, fraud: 14 },
  { name: 'Thu', scans: 890, fraud: 32 },
  { name: 'Fri', scans: 1200, fraud: 45 },
  { name: 'Sat', scans: 1100, fraud: 38 },
  { name: 'Sun', scans: 950, fraud: 29 },
];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState([
    { label: 'Total Scans (24h)', value: 1429, change: '+12%', icon: 'Scan' },
    { label: 'Avg ML Accuracy', value: 93.4, change: '+0.2%', icon: 'Dashboard', suffix: '%' },
    { label: 'High-Risk Hits', value: 158, change: '-4%', icon: 'Compliance' },
    { label: 'System Uptime', value: 99.99, change: 'Stable', icon: 'Settings', suffix: '%' },
  ]);

  const [liveActivity, setLiveActivity] = useState(MOCK_HISTORY);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update primary stats slightly for "live" feel
      setStats(prev => prev.map(s => {
        if (s.label === 'Total Scans (24h)') return { ...s, value: s.value + Math.floor(Math.random() * 3) };
        return s;
      }));

      // Occasionally add new random activity
      if (Math.random() > 0.7) {
        const domains = ['spin-gold.io', 'luxury-casino.com', 'scam-bets.net', 'fair-play.uk'];
        const newEntry = {
          id: Date.now().toString(),
          url: domains[Math.floor(Math.random() * domains.length)],
          level: Math.random() > 0.5 ? 'LOW' : 'HIGH',
          score: Math.floor(Math.random() * 100),
          date: 'Just now'
        };
        setLiveActivity(prev => [newEntry, ...prev.slice(0, 3)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold transition-colors">System Intelligence Overview</h1>
          <p className="text-slate-400">Monitoring 12,482 active endpoints with XGBoost v2.1</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full border border-emerald-500/20">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold uppercase tracking-tighter">Live Regulator Sync: Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-5 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</span>
              <div className="text-indigo-400 group-hover:scale-110 transition-transform">
                {React.createElement(ICONS[stat.icon as keyof typeof ICONS])}
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold transition-colors mono">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                {stat.suffix}
              </span>
              <span className={`text-[10px] font-bold mb-1 ${stat.change.startsWith('+') ? 'text-emerald-500' : stat.change === 'Stable' ? 'text-slate-500' : 'text-rose-500'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6 h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold">Scan Volatility & Detection Yield</h3>
            <select className="bg-slate-800 border-none text-xs text-white rounded px-3 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={INITIAL_DASHBOARD_DATA}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="scans" stroke="#6366f1" fillOpacity={1} fill="url(#colorScans)" />
                <Area type="monotone" dataKey="fraud" stroke="#f43f5e" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 flex flex-col">
           <h3 className="font-bold mb-6">Real-time Traffic Origin</h3>
           <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'API', val: 840 },
                { name: 'Mobile', val: 320 },
                { name: 'Web', val: 510 },
                { name: 'Bot', val: 90 },
              ]}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                <Bar dataKey="val" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
           </div>
           <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total API Overhead</span>
                <span className="mono">2.4 TB/mo</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Active Webhooks</span>
                <span className="mono">842</span>
              </div>
           </div>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold">Recent Live Feed</h3>
          <span className="text-[10px] text-emerald-500 font-bold uppercase animate-pulse">Live</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                <th className="px-6 py-4">Entity Domain</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4">XGBoost Score</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {liveActivity.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-indigo-400 text-xs font-bold">
                        {item.url.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium">{item.url}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      item.level === 'CRITICAL' || item.level === 'HIGH' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {item.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400 mono">{item.score}/100</td>
                  <td className="px-6 py-4 text-xs text-slate-500">{item.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-bold text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                      View Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
