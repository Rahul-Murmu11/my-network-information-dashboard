import React from 'react';
import { Info, Shield, Wifi, Globe, Lock, Cpu } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section className="glass-card rounded-3xl p-6 md:p-8 border border-purple-500/20 shadow-xl mb-12 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            About Network Information & Diagnostics
          </h2>
          <p className="text-xs text-slate-400">
            Understanding your digital footprint, IP address routing, and device diagnostics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        {/* Concept 1 */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-2">
            <Globe className="w-4 h-4" />
            <span>Public vs Private IP</span>
          </div>
          <p className="text-slate-300 dark:text-slate-400 text-xs leading-relaxed">
            Your <strong>Public IP Address</strong> is a unique numeric identifier assigned by your Internet Service Provider (ISP) visible to websites you visit. Your <strong>Private IP Address</strong> identifies your device inside your local Wi-Fi router network.
          </p>
        </div>

        {/* Concept 2 */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-blue-500/30 transition-all">
          <div className="flex items-center gap-2 text-blue-400 font-semibold mb-2">
            <Shield className="w-4 h-4" />
            <span>ISP & Geolocation</span>
          </div>
          <p className="text-slate-300 dark:text-slate-400 text-xs leading-relaxed">
            IP Geolocation maps your IP address to a physical region, city, and Autonomous System Number (ASN). This helps websites deliver localized content, determine time zone defaults, and enforce security policies.
          </p>
        </div>

        {/* Concept 3 */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-purple-500/30 transition-all">
          <div className="flex items-center gap-2 text-purple-400 font-semibold mb-2">
            <Wifi className="w-4 h-4" />
            <span>Bandwidth & Ping</span>
          </div>
          <p className="text-slate-300 dark:text-slate-400 text-xs leading-relaxed">
            <strong>Ping (Latency)</strong> measures how quickly data packets travel from your device to the server and back (measured in milliseconds). <strong>Download/Upload speeds</strong> estimate your available network throughput in Megabits per second (Mbps).
          </p>
        </div>
      </div>

      {/* Security note */}
      <div className="mt-6 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 flex items-start gap-3 text-xs text-cyan-200">
        <Lock className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-cyan-300">Privacy & Transparency Notice:</strong> All data displayed on this dashboard is retrieved directly from your browser and client request headers. No personal network credentials or local files are collected or stored on external servers.
        </div>
      </div>
    </section>
  );
};
