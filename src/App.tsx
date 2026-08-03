import { useState, useEffect, useCallback } from 'react';
import { NetworkInfo, ToastMessage } from './types';
import { fetchNetworkInfo } from './utils/network';
import { downloadReportAsPDF, downloadReportAsTXT } from './utils/reportExport';
import { Header } from './components/Header';
import { StatCards } from './components/StatCards';
import { NetworkDetailsGrid } from './components/NetworkDetailsGrid';
import { MapSection } from './components/MapSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { SpeedTestModal } from './components/SpeedTestModal';

export default function App() {
  const [info, setInfo] = useState<NetworkInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSpeedModalOpen, setIsSpeedModalOpen] = useState<boolean>(false);
  const [isSpeedTesting, setIsSpeedTesting] = useState<boolean>(false);

  // Add Toast Notification
  const addToast = useCallback((type: ToastMessage['type'], title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch Network Data
  const loadNetworkData = useCallback(async (isRefresh = false) => {
    setLoading(true);
    try {
      const data = await fetchNetworkInfo();
      setInfo(data);
      if (isRefresh) {
        addToast('success', 'Information Refreshed', 'Your network details have been updated successfully.');
      }
    } catch (e) {
      console.error('Failed to load network information', e);
      addToast('error', 'Network Fetch Warning', 'Unable to retrieve full IP geolocation data.');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Handle Online/Offline Status Events
  useEffect(() => {
    const handleOnline = () => {
      setInfo((prev) => prev ? { ...prev, isOnline: true } : prev);
      addToast('success', 'Connection Restored', 'Your internet connection is active.');
    };
    const handleOffline = () => {
      setInfo((prev) => prev ? { ...prev, isOnline: false } : prev);
      addToast('warning', 'Connection Lost', 'You are currently offline.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addToast]);

  // Initial Load
  useEffect(() => {
    loadNetworkData();
  }, [loadNetworkData]);

  // Toggle Dark/Light Mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.body.className = 'cyber-bg-dark text-slate-100 font-["Poppins",sans-serif] antialiased min-h-screen flex flex-col justify-between';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.body.className = 'cyber-bg-light text-slate-900 font-["Poppins",sans-serif] antialiased min-h-screen flex flex-col justify-between';
      }
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.className = 'cyber-bg-dark text-slate-100 font-["Poppins",sans-serif] antialiased min-h-screen flex flex-col justify-between';
  }, []);

  // Copy Public IP
  const handleCopyIp = () => {
    if (!info?.publicIp) return;
    navigator.clipboard.writeText(info.publicIp);
    addToast('success', 'IP Copied', `Public IP (${info.publicIp}) copied to clipboard.`);
  };

  // Copy All Information as Text
  const handleCopyAll = () => {
    if (!info) return;
    const textData = `
🌐 MY NETWORK INFORMATION DASHBOARD
------------------------------------
Public IP: ${info.publicIp}
Private IP: ${info.privateIp}
IPv6: ${info.ipv6}
Host Name: ${info.hostName}
ISP: ${info.isp}
Organization: ${info.organization}
ASN: ${info.asn}
Country: ${info.country} (${info.countryCode}) ${info.countryFlag}
State/Region: ${info.region}
City: ${info.city}
ZIP Code: ${info.zipCode}
Coordinates: ${info.latitude}, ${info.longitude}
Time Zone: ${info.timeZone}
Local Time: ${info.localTime}
Device Type: ${info.deviceType}
OS: ${info.os}
Browser: ${info.browser}
Language: ${info.language}
Screen Resolution: ${info.screenResolution}
Network Type: ${info.networkType}
Online Status: ${info.isOnline ? 'Online' : 'Offline'}
Ping: ${info.ping ? `${info.ping} ms` : 'N/A'}
Download Speed: ${info.downloadSpeed ? `${info.downloadSpeed} Mbps` : 'N/A'}
Upload Speed: ${info.uploadSpeed ? `${info.uploadSpeed} Mbps` : 'N/A'}
    `.trim();

    navigator.clipboard.writeText(textData);
    addToast('success', 'All Details Copied', 'Complete network report copied to clipboard.');
  };

  // Copy Single Field
  const handleCopyField = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    addToast('info', 'Field Copied', `${label}: ${value}`);
  };

  // Export PDF Report
  const handleExportPdf = () => {
    if (!info) return;
    downloadReportAsPDF(info);
    addToast('success', 'PDF Exported', 'Network diagnostic PDF report downloaded.');
  };

  // Export TXT Report
  const handleExportTxt = () => {
    if (!info) return;
    downloadReportAsTXT(info);
    addToast('success', 'TXT Exported', 'Network diagnostic text report downloaded.');
  };

  // Speed Test Modal Update
  const handleSpeedUpdate = (updatedPartial: Partial<NetworkInfo>) => {
    setInfo((prev) => (prev ? { ...prev, ...updatedPartial } : prev));
    addToast('success', 'Speed Test Completed', 'Speed metrics updated on dashboard.');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main App Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <Header
          info={info}
          loading={loading}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onRefresh={() => loadNetworkData(true)}
          onCopyIp={handleCopyIp}
          onCopyAll={handleCopyAll}
          onExportPdf={handleExportPdf}
          onExportTxt={handleExportTxt}
        />

        {/* Quick Stat Cards */}
        <StatCards
          info={info}
          loading={loading}
          onRunSpeedTest={() => setIsSpeedModalOpen(true)}
          speedTesting={isSpeedTesting}
        />

        {/* Detailed Diagnostics Grid */}
        <NetworkDetailsGrid
          info={info}
          loading={loading}
          onCopyField={handleCopyField}
        />

        {/* Interactive Map */}
        <MapSection
          info={info}
          loading={loading}
          isDarkMode={isDarkMode}
        />

        {/* About Section */}
        <AboutSection />
      </main>

      {/* Speed Test Modal */}
      <SpeedTestModal
        isOpen={isSpeedModalOpen}
        onClose={() => setIsSpeedModalOpen(false)}
        onUpdateInfo={handleSpeedUpdate}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Persistent Required Footer */}
      <Footer />
    </div>
  );
}
