export type DeviceStatus = 'Online' | 'Offline';

export interface Device {
  id: string;
  name: string; // e.g. "LD-MAC-042"
  model: string; // e.g. "MacBook Pro M3 Max"
  cpu: string; // e.g. "Intel Core i9-12900HK"
  ram: string; // e.g. "64GB DDR5 @ 4800MHz"
  os: string; // e.g. "Microsoft Windows 11 Pro"
  serialNumber: string; // e.g. "CN-0GH12-8821-X99"
  status: DeviceStatus;
  ip: string;
  lastSeen: string; // e.g. "2h ago" or "Active"
  memoryUsage: string; // e.g. "12.4 GB / 32 GB"
  memoryPercent: number; // e.g. 38
  ssdCapacity: string; // e.g. "412 GB / 1024 GB"
  ssdPercent: number; // e.g. 40
  batteryHealth: number; // e.g. 94
  macAddress: string;
  assetTag: string;
  category: 'MacBook Pro' | 'ThinkPad' | 'Dell XPS' | 'Chromebook' | 'Other';
}

export interface ActivityLog {
  id: string;
  title: string;
  subtitle: string;
  type: 'CRITICAL' | 'HEALTHY' | 'WARNING';
  timestamp: string;
  deviceSN: string;
}

export interface IdeUsage {
  name: string;
  metric: string;
  type: 'RAM' | 'CPU';
  icon: string;
}
