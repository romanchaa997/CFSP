
import React, { useState } from 'react';
import { ApiKey } from '../types';

interface ApiConfigProps {
  apiKeys: ApiKey[];
  onGenerate: (name: string) => void;
  onRevoke: (id: string) => void;
}

const ApiConfig: React.FC<ApiConfigProps> = ({ apiKeys, onGenerate, onRevoke }) => {
  const [newKeyName, setNewKeyName] = useState('');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;
    onGenerate(newKeyName);
    setNewKeyName('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">API & Webhooks</h1>
        <p className="text-slate-400">Integrate Casino Fraud Scanner into your custom workflow.</p>
      </div>

      <div className="glass rounded-2xl p-6 border border-slate-800">
        <h2 className="text-xl font-bold mb-6">Manage API Keys</h2>
        
        <form onSubmit={handleGenerate} className="flex gap-4 mb-8">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key Name (e.g., Production API)"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500 text-white"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-all"
          >
            Generate New Key
          </button>
        </form>

        <div className="space-y-4">
          {apiKeys.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">No active API keys found.</div>
          ) : (
            apiKeys.map(key => (
              <div key={key.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800 group">
                <div className="space-y-1">
                  <div className="font-bold text-white">{key.name}</div>
                  <div className="flex gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-black">
                    <span>Created: {key.created}</span>
                    <span>Last Used: {key.lastUsed}</span>
                  </div>
                  <div className="text-xs text-slate-400 mono mt-2 select-all bg-black/30 p-2 rounded border border-slate-700">
                    {key.key}
                  </div>
                </div>
                <button
                  onClick={() => onRevoke(key.id)}
                  className="px-3 py-1 text-[10px] font-black uppercase text-rose-500 border border-rose-500/20 hover:bg-rose-500/10 rounded transition-all opacity-0 group-hover:opacity-100"
                >
                  Revoke
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="glass rounded-2xl p-6 border border-slate-800">
        <h2 className="text-xl font-bold mb-4">Webhook Endpoints</h2>
        <div className="p-4 bg-slate-900/30 rounded-lg border border-dashed border-slate-700 text-center text-sm text-slate-500">
          Advanced webhook configuration is available for Enterprise clients.
          <br />
          <button className="text-indigo-400 font-bold mt-2 hover:underline">Request Access</button>
        </div>
      </div>
    </div>
  );
};

export default ApiConfig;
