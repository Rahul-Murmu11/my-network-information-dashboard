import React, { useState } from 'react';
import { NetworkInfo } from '../types';
import { measurePing, measureDownloadSpeed, measureUploadSpeed } from '../utils/network';
import { Zap, Activity, ArrowDownCircle, ArrowUpCircle, X, RotateCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpeedTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateInfo: (updated: Partial<NetworkInfo>) => void;
}

export const SpeedTestModal: React.FC<SpeedTestModalProps> = ({
  isOpen,
  onClose,
  onUpdateInfo,
}) => {
  const [testing, setTesting] = useState(false);
  const [step, setStep] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);

  const [pingResult, setPingResult] = useState<number | null>(null);
  const [downloadResult, setDownloadResult] = useState<number | null>(null);
  const [uploadResult, setUploadResult] = useState<number | null>(null);

  if (!isOpen) return null;

  const runFullSpeedTest = async () => {
    setTesting(true);
    setProgress(10);

    // 1. Ping
    setStep('ping');
    const ping = await measurePing();
    setPingResult(ping);
    setProgress(35);

    // 2. Download
    setStep('download');
    const dl = await measureDownloadSpeed();
    setDownloadResult(dl);
    setProgress(70);

    // 3. Upload
    setStep('upload');
    const ul = await measureUploadSpeed();
    setUploadResult(ul);
    setProgress(100);

    setStep('complete');
    setTesting(false);

    onUpdateInfo({
      ping: ping,
      downloadSpeed: dl,
      uploadSpeed: ul,
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-card rounded-3xl p-6 md:p-8 border border-cyan-500/30 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">Live Network Speed Test</h3>
            <p className="text-xs text-slate-400">Measure ping latency, download throughput &amp; upload bandwidth</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-6 border border-slate-700">
          <div
            className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Diagnostic Results Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <Activity className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ping</span>
            <div className="text-lg font-bold text-purple-300 font-mono mt-1">
              {pingResult !== null ? `${pingResult} ms` : step === 'ping' ? '...' : '--'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <ArrowDownCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Download</span>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
              {downloadResult !== null ? `${downloadResult} Mbps` : step === 'download' ? '...' : '--'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <ArrowUpCircle className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Upload</span>
            <div className="text-lg font-bold text-blue-400 font-mono mt-1">
              {uploadResult !== null ? `${uploadResult} Mbps` : step === 'upload' ? '...' : '--'}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Close
          </button>

          <button
            onClick={runFullSpeedTest}
            disabled={testing}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50 transition-all"
          >
            {testing ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Testing ({step})...</span>
              </>
            ) : step === 'complete' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Retest Speed</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Start Speed Test</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
