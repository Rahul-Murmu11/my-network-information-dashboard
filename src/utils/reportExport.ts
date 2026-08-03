import { jsPDF } from 'jspdf';
import { NetworkInfo } from '../types';

// Generate and trigger download of TXT Report
export function downloadReportAsTXT(info: NetworkInfo) {
  const dateStr = new Date().toLocaleString();
  const content = `================================================================
🌐 MY NETWORK INFORMATION DASHBOARD - OFFICIAL DIAGNOSTIC REPORT
================================================================
Generated On: ${dateStr}
System Host:  ${info.hostName}

----------------------------------------------------------------
1. NETWORK & IP DETAILS
----------------------------------------------------------------
Public IP Address:    ${info.publicIp}
Private IP Address:   ${info.privateIp}
IPv6 Address:         ${info.ipv6}
ISP:                  ${info.isp}
Organization:         ${info.organization}
ASN:                  ${info.asn}
Network Type:         ${info.networkType}
Online Status:        ${info.isOnline ? 'Online (Active Connection)' : 'Offline'}

----------------------------------------------------------------
2. GEOLOCATION & LOCATION
----------------------------------------------------------------
Country:              ${info.country} (${info.countryCode}) ${info.countryFlag}
State / Region:       ${info.region}
City:                 ${info.city}
ZIP Code:             ${info.zipCode}
Latitude:             ${info.latitude}
Longitude:            ${info.longitude}
Time Zone:            ${info.timeZone}
Local System Time:    ${info.localTime}

----------------------------------------------------------------
3. DEVICE & BROWSER DIAGNOSTICS
----------------------------------------------------------------
Device Type:          ${info.deviceType}
Operating System:     ${info.os}
Browser:              ${info.browser}
Language:             ${info.language}
Screen Resolution:    ${info.screenResolution}

----------------------------------------------------------------
4. NETWORK PERFORMANCE ESTIMATES
----------------------------------------------------------------
Ping Latency:         ${info.ping ? `${info.ping} ms` : 'N/A'}
Download Speed:       ${info.downloadSpeed ? `${info.downloadSpeed} Mbps` : 'N/A'}
Upload Speed:         ${info.uploadSpeed ? `${info.uploadSpeed} Mbps` : 'N/A'}

================================================================
© 2026 My Network Information Dashboard
Designed & Developed by Rahul Murmu | All Rights Reserved
================================================================
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Network_Report_${info.publicIp.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate and trigger download of PDF Report using jsPDF
export function downloadReportAsPDF(info: NetworkInfo) {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = '#06b6d4'; // Cyan
  const darkBg = '#0b0f19';
  const textColor = '#1e293b';

  // Title Header Box
  doc.setFillColor(11, 15, 25);
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(6, 182, 212);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('NETWORK INFORMATION DASHBOARD REPORT', 14, 16);

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()} | Host: ${info.hostName}`, 14, 24);

  let y = 42;

  const addSectionHeader = (title: string) => {
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y, 182, 8, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(title, 18, y + 5.5);
    y += 12;
  };

  const addRow = (label: string, value: string) => {
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(label, 18, y);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value || 'N/A'), 75, y);
    y += 6;
  };

  // 1. IP & Network Section
  addSectionHeader('1. NETWORK & IP ADDRESS DETAILS');
  addRow('Public IP Address:', info.publicIp);
  addRow('Private IP Address:', info.privateIp);
  addRow('IPv6 Address:', info.ipv6);
  addRow('ISP:', info.isp);
  addRow('Organization:', info.organization);
  addRow('ASN:', info.asn);
  addRow('Network Type:', info.networkType);
  addRow('Online Status:', info.isOnline ? 'Online (Active)' : 'Offline');
  y += 4;

  // 2. Geolocation Section
  addSectionHeader('2. GEOLOCATION & TIME Details');
  addRow('Country:', `${info.country} (${info.countryCode})`);
  addRow('State / Region:', info.region);
  addRow('City:', info.city);
  addRow('ZIP / Postal Code:', info.zipCode);
  addRow('Latitude & Longitude:', `${info.latitude}, ${info.longitude}`);
  addRow('Time Zone:', info.timeZone);
  addRow('Local System Time:', info.localTime);
  y += 4;

  // 3. Device Section
  addSectionHeader('3. DEVICE & BROWSER DIAGNOSTICS');
  addRow('Device Type:', info.deviceType);
  addRow('Operating System:', info.os);
  addRow('Browser Name & Version:', info.browser);
  addRow('Language:', info.language);
  addRow('Screen Resolution:', info.screenResolution);
  y += 4;

  // 4. Performance Metrics
  addSectionHeader('4. PERFORMANCE SPECS');
  addRow('Ping Latency:', info.ping ? `${info.ping} ms` : 'N/A');
  addRow('Download Speed:', info.downloadSpeed ? `${info.downloadSpeed} Mbps` : 'N/A');
  addRow('Upload Speed:', info.uploadSpeed ? `${info.uploadSpeed} Mbps` : 'N/A');

  // Footer on PDF
  doc.setFillColor(3, 7, 18);
  doc.rect(0, 277, 210, 20, 'F');
  doc.setTextColor(6, 182, 212);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('© 2026 My Network Information Dashboard', 105, 285, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Designed & Developed by Rahul Murmu | All Rights Reserved.', 105, 290, { align: 'center' });

  doc.save(`Network_Report_${info.publicIp.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`);
}
