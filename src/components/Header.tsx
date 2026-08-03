import React, { useState, useEffect } from 'react';
import { 
  RotateCw, 
  Copy, 
  FileText, 
  Download, 
  Sun, 
  Moon, 
  Globe, 
  Wifi, 
  WifiOff, 
  Clock,
  Check
} from 'lucide-react';
import { NetworkInfo } from '../types';

interface HeaderProps {
  info: NetworkInfo | null;
  loading: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onRefresh: () => void;
  onCopyIp: () => void;
  onCopyAll: () => void;
  onExportPdf: () => void;
  onExportTxt: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  info,
  loading,
  isDarkMode,
  onToggleDarkMode,
  onRefresh,
  onCopyIp,
  onCopyAll,
  onExportPdf,
  onExportTxt,
}) => {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [ipCopied, setIpCopied] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyIpClick = () => {
    onCopyIp();
    setIpCopied(true);
    setTimeout(() => setIpCopied(false), 2000);
  };

  return (
    <header className="relative z-20 w-full mb-8">
      {/* Top Utility Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-6 rounded-2xl glass-card">
        {/* Live Status & Clock */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 dark:bg-slate-900/80 border border-slate-700/50">
            {info?.isOnline ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 radar-pulse" />
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5" /> ONLINE
                </span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <WifiOff className="w-3.5 h-3.5" /> OFFLINE
                </span>
              </>
            )}
          </div>

          {/* Live Clock */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 dark:bg-slate-900/80 border border-slate-700/50 text-slate-300 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-cyan-300 font-mono font-semibold">{time}</span>
            <span className="text-slate-400 hidden sm:inline">| {date}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap ml-auto">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Refresh Information"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Copy Public IP */}
          <button
            onClick={handleCopyIpClick}
            title="Copy Public IP"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-all active:scale-95"
          >
            {ipCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{ipCopied ? 'Copied!' : 'Copy IP'}</span>
          </button>

          {/* Copy All Info */}
          <button
            onClick={onCopyAll}
            title="Copy All Information"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 transition-all active:scale-95"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Copy All</span>
          </button>

          {/* Export PDF */}
          <button
            onClick={onExportPdf}
            title="Download PDF Report"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">PDF</span>
          </button>

          {/* Export TXT */}
          <button
            onClick={onExportTxt}
            title="Download TXT Report"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all active:scale-95"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">TXT</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2.5 rounded-xl bg-slate-800/80 text-cyan-400 border border-slate-700/60 hover:border-cyan-400/50 transition-all active:scale-95"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-400" />}
          </button>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="text-center md:text-left p-6 md:p-8 rounded-3xl glass-card relative overflow-hidden border border-cyan-500/20 shadow-2xl">
        {/* Background Accent Glow */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-3">
              <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '12s' }} />
              Cybersecurity Intelligence Hub
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 mb-2">
              🌐 My Network Information Dashboard
            </h1>

            <p className="text-sm sm:text-base text-slate-300 dark:text-slate-400 font-normal">
              &quot;View your network and internet details instantly&quot;
            </p>
          </div>

          {/* Primary Quick IP Badge */}
          {info && (
            <div className="self-start md:self-auto p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-right shadow-lg">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Your Public IP
              </span>
              <div className="text-lg sm:text-2xl font-mono font-bold text-cyan-400 neon-text-cyan flex items-center gap-2 justify-end">
                <span>{info.publicIp}</span>
                <span className="text-xl">{info.countryFlag}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
