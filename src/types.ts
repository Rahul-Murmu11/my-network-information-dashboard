export interface NetworkInfo {
  publicIp: string;
  privateIp: string;
  ipv6: string;
  hostName: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet' | 'Unknown';
  os: string;
  browser: string;
  isp: string;
  organization: string;
  asn: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  region: string;
  city: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  timeZone: string;
  localTime: string;
  language: string;
  screenResolution: string;
  networkType: string;
  isOnline: boolean;
  downloadSpeed: number | null; // in Mbps
  uploadSpeed: number | null;   // in Mbps
  ping: number | null;          // in ms
  connectionSecurity?: {
    isVpnOrProxy: boolean;
    isTor: boolean;
  };
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}
