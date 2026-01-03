
import React, { useState, useEffect } from 'react';
import { AppView, Theme, ScanResult, ApiKey } from './types';
import { ICONS } from './constants';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import ScanHistory from './components/ScanHistory';
import ApiConfig from './components/ApiConfig';

const SidebarLink: React.FC<{ 
  view: AppView; 
  activeView: AppView; 
  setView: (v: AppView) => void;
  icon: keyof typeof ICONS;
  label: string;
}> = ({ view, activeView, setView, icon, label }) => {
  const isActive = activeView === view;
  return (
    <button
      onClick={() => setView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
          : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
      }`}
    >
      <div className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>
        {React.createElement(ICONS[icon])}
      </div>
      <span className="text-sm font-medium">{label}</span>
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
      )}
    </button>
  );
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('DASHBOARD');
  const [theme, setTheme] = useState<Theme>('dark');
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const addToHistory = (result: ScanResult) => {
    setHistory(prev => [result, ...prev]);
  };

  const generateApiKey = (name: string) => {
    const newKey: ApiKey = {
      id: Math.random().toString(36).substr(2, 9),
      key: `sk_live_${Math.random().toString(36).substr(2, 32)}`,
      name,
      created: new Date().toLocaleDateString(),
      lastUsed: 'Never'
    };
    setApiKeys(prev => [newKey, ...prev]);
  };

  const revokeApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-300 selection:bg-indigo-500/30 ${
      theme === 'dark' ? 'bg-[#020617] text-slate-200' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Sidebar */}
      <aside className={`w-64 border-r flex flex-col sticky top-0 h-screen hidden lg:flex ${
        theme === 'dark' ? 'bg-[#020617] border-slate-800/60' : 'bg-white border-slate-200'
      }`}>
        <div className="p-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-lg shadow-indigo-600/30">
              FS
            </div>
            <span className={`font-black text-xl tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              FRAUD<span className="text-indigo-500">SCAN</span>
            </span>
          </div>

          <nav className="space-y-2">
            <SidebarLink view="DASHBOARD" activeView={activeView} setView={setActiveView} icon="Dashboard" label="Intelligence" />
            <SidebarLink view="SCANNER" activeView={activeView} setView={setActiveView} icon="Scan" label="URL Forensic" />
            <SidebarLink view="HISTORY" activeView={activeView} setView={setActiveView} icon="History" label="Audit History" />
            <SidebarLink view="COMPLIANCE" activeView={activeView} setView={setActiveView} icon="Compliance" label="Regulation Sync" />
            <SidebarLink view="API_CONFIG" activeView={activeView} setView={setActiveView} icon="Settings" label="API & Webhooks" />
            <SidebarLink view="BILLING" activeView={activeView} setView={setActiveView} icon="Wallet" label="Subscription" />
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <button 
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg border transition-all ${
              theme === 'dark' 
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' 
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {theme === 'dark' ? <ICONS.Sun /> : <ICONS.Moon />}
            <span className="text-xs font-bold uppercase tracking-widest">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <div className={`${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100 border-slate-200'} rounded-xl p-4 border`}>
             <div className="flex justify-between items-center mb-2">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Enterprise Plan</span>
               <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
             </div>
             <p className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Unlimited scans, Priority API enabled.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 lg:px-12 py-8 relative">
        <header className="flex justify-between items-center mb-10 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-[10px] font-black italic">FS</div>
              <span className={`font-black text-lg tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                FRAUD<span className="text-indigo-500">SCAN</span>
              </span>
            </div>
            <button className="text-slate-400" onClick={toggleTheme}>
               {theme === 'dark' ? <ICONS.Sun /> : <ICONS.Moon />}
            </button>
        </header>

        {activeView === 'DASHBOARD' && <Dashboard />}
        {activeView === 'SCANNER' && <Scanner onScanComplete={addToHistory} />}
        {activeView === 'HISTORY' && <ScanHistory history={history} />}
        {activeView === 'API_CONFIG' && <ApiConfig apiKeys={apiKeys} onGenerate={generateApiKey} onRevoke={revokeApiKey} />}
        
        {['COMPLIANCE', 'BILLING'].includes(activeView) && (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <div className="p-6 bg-indigo-500/10 rounded-full text-indigo-500">
               {React.createElement(ICONS[activeView as keyof typeof ICONS])}
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tighter">{activeView} MODULE</h2>
            <p className="text-slate-500 max-w-sm text-center">
              Module available for Enterprise deployments only. Contact support for direct integration.
            </p>
            <button 
              onClick={() => setActiveView('DASHBOARD')}
              className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-sm font-semibold"
            >
              Back to Intel
            </button>
          </div>
        )}
      </main>

      {/* Floating Status */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className={`glass px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl border ${
          theme === 'dark' ? 'border-white/10' : 'border-slate-200'
        }`}>
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-6 h-6 rounded-full border-2 overflow-hidden ${theme === 'dark' ? 'border-[#020617] bg-slate-800' : 'border-white bg-slate-200'}`}>
                <img src={`https://picsum.photos/id/${i+10}/50/50`} alt="" />
              </div>
            ))}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Live Analysts</span>
            <span className="text-xs font-bold text-emerald-500">12 Connected</span>
          </div>
          <div className="w-px h-6 bg-slate-400/20"></div>
          <button className="text-xs font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-400 transition-colors">
            Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
