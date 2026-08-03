import React, { useState } from 'react';
import { NetworkInfo } from '../types';
import {
  Globe,
  Wifi,
  Monitor,
  MapPin,
  Clock,
  Server,
  Layers,
  Shield,
  Smartphone,
  Cpu,
  Compass,
  Maximize2,
  Languages,
  Check,
  Copy,
  Activity,
  Zap
} from 'lucide-react';

interface NetworkDetailsGridProps {
  info: NetworkInfo | null;
  loading: boolean;
  onCopyField: (label: string, value: string) => void;
}

export const NetworkDetailsGrid: React.FC<NetworkDetailsGridProps> = ({
  info,
  loading,
  onCopyField,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, label: string, value: string) => {
    onCopyField(label, value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  if (loading || !info) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="glass-card rounded-3xl p-6 h-80 animate-pulse bg-slate-800/30 flex flex-col justify-between">
            <div className="h-6 w-40 bg-slate-700/60 rounded" />
            <div className="space-y-3 my-4">
              {[1, 2, 3, 4, 5].map((r) => (
                <div key={r} className="h-4 w-full bg-slate-700/40 rounded" />
              ))}
            </div>
            <div className="h-4 w-24 bg-slate-700/50 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const renderItem = (
    key: string,
    icon: React.ReactNode,
    label: string,
    value: string | number | React.ReactNode,
    rawValue?: string
  ) => {
    const isCopied = copiedKey === key;
    const stringVal = rawValue || String(value || 'N/A');

    return (
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/40 dark:bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all group">
        <div className="flex items-center gap-3 min-w-0 pr-2">
          <div className="p-2 rounded-lg bg-slate-800/80 text-cyan-400 group-hover:text-cyan-300 group-hover:bg-cyan-500/10 transition-colors flex-shrink-0">
            {icon}
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              {label}
            </span>
            <div className="text-sm font-semibold text-slate-100 font-mono truncate">
              {value}
            </div>
          </div>
        </div>

        <button
          onClick={() => handleCopy(key, label, stringVal)}
          title={`Copy ${label}`}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors flex-shrink-0 active:scale-95"
        >
          {isCopied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* CARD 1: 🌐 NETWORK & IP DETAILS */}
      <div className="glass-card glass-card-hover rounded-3xl p-6 border border-cyan-500/20 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              Network & IP Details
            </h2>
            <p className="text-xs text-slate-400">Public, private, IPv6 & ISP routing information</p>
          </div>
        </div>

        <div className="space-y-3">
          {renderItem('pub_ip', <Globe className="w-4 h-4" />, 'Public IP Address', info.publicIp)}
          {renderItem('priv_ip', <Wifi className="w-4 h-4 text-emerald-400" />, 'Private IP Address', info.privateIp)}
          {renderItem('v6_ip', <Layers className="w-4 h-4 text-purple-400" />, 'IPv6 Address', info.ipv6)}
          {renderItem('host_name', <Server className="w-4 h-4 text-blue-400" />, 'Host Name', info.hostName)}
          {renderItem('isp', <Zap className="w-4 h-4 text-amber-400" />, 'Internet Service Provider (ISP)', info.isp)}
          {renderItem('org', <Shield className="w-4 h-4 text-teal-400" />, 'Organization', info.organization)}
          {renderItem('asn', <Activity className="w-4 h-4 text-indigo-400" />, 'Autonomous System Number (ASN)', info.asn)}
        </div>
      </div>

      {/* CARD 2: 📍 GEOLOCATION & LOCATION */}
      <div className="glass-card glass-card-hover rounded-3xl p-6 border border-blue-500/20 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              Geolocation & Location
            </h2>
            <p className="text-xs text-slate-400">Geographic position, timezone & local clock</p>
          </div>
        </div>

        <div className="space-y-3">
          {renderItem(
            'country',
            <span className="text-base">{info.countryFlag}</span>,
            'Country',
            <span className="flex items-center gap-2">
              {info.country} <span className="text-xs text-slate-400">({info.countryCode})</span>
            </span>,
            `${info.country} (${info.countryCode})`
          )}
          {renderItem('country_flag', <Compass className="w-4 h-4 text-cyan-400" />, 'Country Flag', `${info.countryFlag} (${info.countryCode})`)}
          {renderItem('state', <MapPin className="w-4 h-4 text-rose-400" />, 'State / Region', info.region)}
          {renderItem('city', <MapPin className="w-4 h-4 text-amber-400" />, 'City', info.city)}
          {renderItem('zip', <Compass className="w-4 h-4 text-teal-400" />, 'ZIP / Postal Code', info.zipCode)}
          {renderItem('lat_long', <Compass className="w-4 h-4 text-indigo-400" />, 'Latitude & Longitude', `${info.latitude}, ${info.longitude}`)}
          {renderItem('timezone', <Clock className="w-4 h-4 text-purple-400" />, 'Time Zone', info.timeZone)}
          {renderItem('localtime', <Clock className="w-4 h-4 text-emerald-400" />, 'Local Time', info.localTime)}
        </div>
      </div>

      {/* CARD 3: 💻 DEVICE & BROWSER DIAGNOSTICS */}
      <div className="glass-card glass-card-hover rounded-3xl p-6 border border-purple-500/20 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              Device & Browser Diagnostics
            </h2>
            <p className="text-xs text-slate-400">Hardware spec, OS, browser version & display</p>
          </div>
        </div>

        <div className="space-y-3">
          {renderItem('dev_type', <Smartphone className="w-4 h-4 text-cyan-400" />, 'Device Type', info.deviceType)}
          {renderItem('os', <Cpu className="w-4 h-4 text-blue-400" />, 'Operating System', info.os)}
          {renderItem('browser', <Monitor className="w-4 h-4 text-purple-400" />, 'Browser Name & Version', info.browser)}
          {renderItem('language', <Languages className="w-4 h-4 text-amber-400" />, 'Language', info.language)}
          {renderItem('screen_res', <Maximize2 className="w-4 h-4 text-emerald-400" />, 'Screen Resolution', info.screenResolution)}
        </div>
      </div>

      {/* CARD 4: ⚡ CONNECTION & PERFORMANCE SPECS */}
      <div className="glass-card glass-card-hover rounded-3xl p-6 border border-emerald-500/20 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              Connection & Performance
            </h2>
            <p className="text-xs text-slate-400">Active status, network medium & speed latency</p>
          </div>
        </div>

        <div className="space-y-3">
          {renderItem('net_type', <Wifi className="w-4 h-4 text-cyan-400" />, 'Network Type', info.networkType)}
          {renderItem(
            'online_status',
            <Activity className="w-4 h-4 text-emerald-400" />,
            'Online / Offline Status',
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${info.isOnline ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
              {info.isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>,
            info.isOnline ? 'ONLINE' : 'OFFLINE'
          )}
          {renderItem('dl_speed', <Zap className="w-4 h-4 text-emerald-400" />, 'Download Speed (estimate)', info.downloadSpeed ? `${info.downloadSpeed} Mbps` : 'Testing...')}
          {renderItem('ul_speed', <Zap className="w-4 h-4 text-blue-400" />, 'Upload Speed (estimate)', info.uploadSpeed ? `${info.uploadSpeed} Mbps` : 'Testing...')}
          {renderItem('ping_ms', <Activity className="w-4 h-4 text-purple-400" />, 'Ping / Latency', info.ping ? `${info.ping} ms` : 'Testing...')}
        </div>
      </div>
    </div>
  );
};
