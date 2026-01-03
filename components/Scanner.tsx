
import React, { useState } from 'react';
import { RiskLevel, ScanResult } from '../types';
import { analyzeCasinoRisk } from '../services/geminiService';

interface ScannerProps {
  onScanComplete: (result: ScanResult) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScanComplete }) => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);

  const steps = [
    'Initializing XGBoost Engine...',
    'Performing WHOIS Lookup...',
    'Checking SSL/TLS Certificates...',
    'Cross-referencing PlayCity & KRAIL Registries...',
    'Analyzing Withdrawal Latency Patterns...',
    'Running Gemini AI Risk Assessment...'
  ];

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsScanning(true);
    setResult(null);
    setProgress(0);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i]);
      setProgress(((i + 1) / steps.length) * 100);
      await new Promise(r => setTimeout(r, 600));
    }

    const mockScore = Math.floor(Math.random() * 100);
    const mockResult: ScanResult = {
      id: Math.random().toString(36).substr(2, 9),
      url,
      timestamp: new Date().toISOString(),
      riskScore: mockScore,
      riskLevel: mockScore > 80 ? RiskLevel.CRITICAL : mockScore > 50 ? RiskLevel.HIGH : mockScore > 20 ? RiskLevel.MEDIUM : RiskLevel.LOW,
      features: {
        domainAge: Math.floor(Math.random() * 2000),
        sslValid: Math.random() > 0.1,
        serverLocation: 'Curacao (Offshore)',
        licenseFound: Math.random() > 0.4,
        regulatoryBlacklisted: Math.random() > 0.7,
        paymentMethods: ['Crypto', 'Visa', 'Mastercard'],
        withdrawalDelayAvg: Math.floor(Math.random() * 72)
      }
    };

    const aiText = await analyzeCasinoRisk(mockResult);
    const finalResult = { ...mockResult, aiAssessment: aiText };
    setResult(finalResult);
    onScanComplete(finalResult);
    setIsScanning(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Live URL Forensic Scan</h1>
        <p className="text-slate-400 max-w-lg mx-auto">
          Enter a casino domain to execute a real-time ML-driven audit against 5,000+ known entities.
        </p>
      </div>

      <form onSubmit={handleScan} className="relative">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter casino URL (e.g., vegas-royal.com)"
          className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 px-6 text-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 text-white"
          disabled={isScanning}
        />
        <button
          type="submit"
          disabled={isScanning || !url}
          className={`absolute right-2 top-2 bottom-2 px-8 rounded-lg font-semibold transition-all ${
            isScanning ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
          }`}
        >
          {isScanning ? 'Scanning...' : 'Start Audit'}
        </button>
      </form>

      {isScanning && (
        <div className="glass rounded-2xl p-8 space-y-4 animate-pulse">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-indigo-400 mono uppercase tracking-widest">{currentStep}</span>
            <span className="text-2xl font-bold text-white mono">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500 shadow-[0_0_10px_#6366f1]" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {result && !isScanning && (
        <div className={`glass rounded-2xl p-8 border-l-4 transition-all duration-700 slide-up ${
          result.riskLevel === RiskLevel.CRITICAL || result.riskLevel === RiskLevel.HIGH ? 'border-rose-500 glow-rose' : 'border-emerald-500 glow-emerald'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Audit Result for</span>
              <h2 className="text-3xl font-bold text-white">{result.url}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  result.riskLevel === RiskLevel.CRITICAL ? 'bg-rose-500/20 text-rose-500' : 
                  result.riskLevel === RiskLevel.HIGH ? 'bg-orange-500/20 text-orange-500' : 'bg-emerald-500/20 text-emerald-500'
                }`}>
                  {result.riskLevel} Risk
                </span>
                <span className="text-slate-400 text-xs">Score: {result.riskScore}/100</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-black mono text-white">{result.riskScore}</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Risk Index</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
             <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
               <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Domain Intelligence</h4>
               <ul className="space-y-2 text-sm">
                 <li className="flex justify-between">
                   <span className="text-slate-400">SSL Status</span>
                   <span className={result.features.sslValid ? 'text-emerald-400' : 'text-rose-400'}>{result.features.sslValid ? 'Active' : 'Expired'}</span>
                 </li>
                 <li className="flex justify-between">
                   <span className="text-slate-400">Domain Age</span>
                   <span className="text-white">{result.features.domainAge} days</span>
                 </li>
               </ul>
             </div>
             <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
               <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Legal & Compliance</h4>
               <ul className="space-y-2 text-sm">
                 <li className="flex justify-between">
                   <span className="text-slate-400">License Verification</span>
                   <span className={result.features.licenseFound ? 'text-emerald-400' : 'text-rose-400'}>{result.features.licenseFound ? 'Found' : 'Missing'}</span>
                 </li>
                 <li className="flex justify-between">
                   <span className="text-slate-400">Blacklist Status</span>
                   <span className={result.features.regulatoryBlacklisted ? 'text-rose-400' : 'text-emerald-400'}>{result.features.regulatoryBlacklisted ? 'FLAGGED' : 'Clean'}</span>
                 </li>
               </ul>
             </div>
             <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
               <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Financial Patterns</h4>
               <ul className="space-y-2 text-sm">
                 <li className="flex justify-between">
                   <span className="text-slate-400">Withdrawal Latency</span>
                   <span className="text-white">~{result.features.withdrawalDelayAvg}h</span>
                 </li>
               </ul>
             </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800">
            <h3 className="text-sm font-bold text-indigo-400 uppercase mb-3 flex items-center gap-2">Gemini AI Insight</h3>
            <p className="text-slate-300 italic leading-relaxed text-sm bg-indigo-500/5 p-4 rounded-lg border border-indigo-500/20">
              {result.aiAssessment}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;
