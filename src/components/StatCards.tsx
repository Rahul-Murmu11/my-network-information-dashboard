import React from 'react';
import { NetworkInfo } from '../types';
import { 
  Globe, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Activity, 
  MapPin, 
  ShieldCheck, 
  Wifi
} from 'lucide-react';

interface StatCardsProps {
  info: NetworkInfo | null;
  loading: boolean;
  onRunSpeedTest: () => void;
  speedTesting: boolean;
}

export const StatCards: React.FC<StatCardsProps> = ({
  info,
  loading,
  onRunSpeedTest,
  speedTesting,
}) => {
  if (loading || !info) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-32 rounded-2xl glass-card animate-pulse bg-slate-800/40 p-4 flex flex-col justify-between">
            <div className="h-4 w-20 bg-slate-700/50 rounded" />
            <div className="h-8 w-28 bg-slate-700/80 rounded my-2" />
            <div className="h-3 w-16 bg-slate-700/40 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Determine Ping Status Color
  let pingBadge = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  let pingText = 'Excellent';
  if (info.ping) {
    if (info.ping > 120) {
      pingBadge = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      pingText = 'High Latency';
    } else if (info.ping > 60) {
      pingBadge = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      pingText = 'Moderate';
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {/* 1. Public IP Card */}
      <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Public IP</span>
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
            <Globe className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-bold font-mono text-cyan-300 truncate" title={info.publicIp}>
          {info.publicIp}
        </div>
        <p className="text-xs text-slate-400 mt-2 truncate font-medium">
          ISP: {info.isp}
        </p>
      </div>

      {/* 2. Download Speed */}
      <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Download</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
            <ArrowDownCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-emerald-400 font-mono">
          {info.downloadSpeed ? `${info.downloadSpeed} Mbps` : '--'}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-slate-400">Speed Est.</span>
          <button
            onClick={onRunSpeedTest}
            disabled={speedTesting}
            className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 hover:underline disabled:opacity-50"
          >
            {speedTesting ? 'Testing...' : 'Test Speed'}
          </button>
        </div>
      </div>

      {/* 3. Upload Speed */}
      <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Upload</span>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
            <ArrowUpCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-blue-400 font-mono">
          {info.uploadSpeed ? `${info.uploadSpeed} Mbps` : '--'}
        </div>
        <p className="text-xs text-slate-400 mt-2 font-medium">
          Bandwidth Throughput
        </p>
      </div>

      {/* 4. Ping / Latency */}
      <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Ping</span>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-purple-300 font-mono">
          {info.ping ? `${info.ping} ms` : '--'}
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${pingBadge}`}>
            {pingText}
          </span>
        </div>
      </div>

      {/* 5. Location Card */}
      <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Location</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
            <MapPin className="w-4 h-4" />
          </div>
        </div>
        <div className="text-base font-bold text-slate-100 truncate flex items-center gap-2">
          <span>{info.city}</span>
          <span className="text-xl">{info.countryFlag}</span>
        </div>
        <p className="text-xs text-slate-400 mt-2 truncate font-medium">
          {info.region}, {info.country}
        </p>
      </div>

      {/* 6. Security & Status */}
      <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Security</span>
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="text-base font-bold text-teal-300 flex items-center gap-1.5">
          <Wifi className="w-4 h-4 text-emerald-400" />
          <span>Active & Secure</span>
        </div>
        <p className="text-xs text-slate-400 mt-2 font-medium">
          Standard Web Connection
        </p>
      </div>
    </div>
  );
};
