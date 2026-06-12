import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Laptop, 
  User, 
  Search, 
  RefreshCw, 
  PlusCircle, 
  Settings,
  ChevronRight,
  ShieldCheck,
  Bot
} from 'lucide-react';

import { Device, ActivityLog, IdeUsage } from './types';
import { initialDevices, initialAlerts, staticIdes } from './data';
import DashboardView from './components/DashboardView';
import InventoryView from './components/InventoryView';
import DeviceDetailsView from './components/DeviceDetailsView';
import ProfileView from './components/ProfileView';

export default function App() {
  // Navigation State
  // 'dashboard' | 'inventory' | 'profile' | 'details'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'profile' | 'details'>('dashboard');
  
  // Persistent State Catalog for Devices & Alerts
  const [devices, setDevices] = useState<Device[]>(() => {
    const local = localStorage.getItem('sys_devices');
    return local ? JSON.parse(local) : initialDevices;
  });

  const [alerts, setAlerts] = useState<ActivityLog[]>(() => {
    const local = localStorage.getItem('sys_alerts');
    return local ? JSON.parse(local) : initialAlerts;
  });

  // Track selected device for detail panel
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('2'); // default matches XPS model

  // Parameter controllers
  const [ideUsageList, setIdeUsageList] = useState<IdeUsage[]>(staticIdes);
  const [projectSyncState, setProjectSyncState] = useState<boolean>(true);
  const [pinkPingFrequency, setPinkPingFrequency] = useState<number>(3);
  const [backupInterval, setBackupInterval] = useState<number>(30);
  const [networkLoad, setNetworkLoad] = useState<number>(1.2);

  // Sync state changes to local client storage
  useEffect(() => {
    localStorage.setItem('sys_devices', JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem('sys_alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Simulated live telemetry loop - slightly modifies Network Load and RAM metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Modify network load by custom offset
      setNetworkLoad(prev => {
        const offset = (Math.random() * 0.4 - 0.2);
        const nextVal = prev + offset;
        return nextVal < 0.2 ? 0.3 : nextVal > 4.5 ? 4.1 : nextVal;
      });

      // Randomized micro increments for CPU/RAM metrics on IDE list
      setIdeUsageList(prevList => {
        return prevList.map(ide => {
          if (ide.type === 'RAM') {
            const current = parseFloat(ide.metric);
            const delta = (Math.random() * 0.2 - 0.1);
            return { ...ide, metric: `${Math.min(8.0, Math.max(0.5, current + delta)).toFixed(1)}GB RAM` };
          } else {
            const current = parseInt(ide.metric);
            const delta = Math.floor(Math.random() * 4 - 2);
            return { ...ide, metric: `${Math.min(99, Math.max(2, current + delta))}% CPU` };
          }
        });
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Registry modifications
  const handleAddDevice = (device: Device) => {
    setDevices(prev => [...prev, device]);
  };

  const handleModifyDeviceStatus = (deviceId: string, status: 'Online' | 'Offline') => {
    setDevices(prev => prev.map(d => {
      if (d.id === deviceId) {
        return {
          ...d,
          status,
          lastSeen: status === 'Online' ? 'Active' : '1m ago',
          // Randomize diagnostic values on connection change
          memoryPercent: status === 'Online' ? Math.floor(Math.random() * 40 + 20) : d.memoryPercent,
          ssdPercent: status === 'Online' ? Math.floor(Math.random() * 20 + 30) : d.ssdPercent,
        };
      }
      return d;
    }));
  };

  const handleRemoveDevice = (deviceId: string) => {
    setDevices(prev => prev.filter(d => d.id !== deviceId));
    // Clear alerts matching this device identifier if decommissioned
    const targetDevice = devices.find(d => d.id === deviceId);
    if (targetDevice) {
      setAlerts(prev => prev.filter(a => a.deviceSN !== targetDevice.serialNumber));
    }
  };

  const handleResetDatabase = () => {
    setDevices(initialDevices);
    setAlerts(initialAlerts);
    setIdeUsageList(staticIdes);
  };

  // Find currently active detailed laptop specs
  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || devices[0] || initialDevices[0];

  return (
    <div className="flex flex-col min-h-screen text-[#e2e2e2] bg-black select-none selection:bg-[#00daf3]/25 scrollbar-none pb-24">
      
      {/* TopAppBar Navigation Header */}
      <header className="bg-black/90 w-full top-0 sticky z-45 border-b border-neutral-900 flex justify-between items-center px-6 py-3 select-none backdrop-blur-md">
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Avatar Profile image with Hotlink */}
          <div className="w-10 h-10 rounded-full bg-[#1e2020] flex items-center justify-center overflow-hidden border border-neutral-800 active:scale-95 transition-transform">
            <img 
              alt="Director Profile thumbnail" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCg61E03yQQW_BJy75BCW9BDaJSJ9C0daqa_Gki-cv6-885BrNclOUCNbgI1OV1TJ9mEnqvixzJ3l0xnPLMz52U-fZ2_QMmz24jP9zGxnJdU4WDMaLq2EiZMin1tdVj5Hjwzqm_2jmdXpBldJKdPJXZKZ2A9yr0DNdVn2Cv08HG9zX4g5Eq4kIQH_Pz0FNP_lvdkSSAUy05MXkc0vXI7qrQW35RvTt0r9I01P9uaFCyD5eCbgk33TxEgFZ0fGvRrUJvh2A_ym3KZ5XM"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </div>
          <h1 className="font-display-lg text-xl font-bold text-[#00daf3] tracking-tighter group-hover:text-cyan-300 transition-colors">
            System Inventory
          </h1>
        </div>
        
        {/* Top-Right Info Action Toggle */}
        <div className="flex items-center gap-2">
          {activeTab !== 'profile' && (
            <button 
              onClick={() => setActiveTab('profile')}
              className="hover:bg-neutral-900 transition-colors p-2 rounded-lg text-[#00daf3]"
              title="Global Administration Panel"
            >
              <Settings className="w-5 h-5 text-brand-cyan animate-spin-slow" />
            </button>
          )}
          {activeTab === 'profile' && (
            <span className="text-[10px] bg-cyan-950 font-bold border border-cyan-800/30 font-mono text-[#00daf3] px-2 py-1 rounded">
              ROOT USER
            </span>
          )}
        </div>
      </header>

      {/* Primary view-switching center panel */}
      <main className="flex-1 px-6 py-6 max-w-[640px] mx-auto w-full select-none">
        
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
            >
              <DashboardView 
                devices={devices}
                alerts={alerts}
                setAlerts={setAlerts}
                onNavigateToInventory={() => setActiveTab('inventory')}
                onNavigateToDevice={(id) => {
                  setSelectedDeviceId(id);
                  setActiveTab('details');
                }}
                onAddDevice={handleAddDevice}
                ideUsageList={ideUsageList}
                setIdeUsageList={setIdeUsageList}
                projectSyncState={projectSyncState}
                setProjectSyncState={setProjectSyncState}
              />
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div
              key="inventory-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
            >
              <InventoryView 
                devices={devices}
                onNavigateToDevice={(id) => {
                  setSelectedDeviceId(id);
                  setActiveTab('details');
                }}
                onNavigateToDashboard={() => setActiveTab('dashboard')}
                onModifyDeviceStatus={handleModifyDeviceStatus}
                onRemoveDevice={handleRemoveDevice}
                networkLoad={networkLoad}
                setNetworkLoad={setNetworkLoad}
                activeNodesOffset={120} // matches 124 / 140 offsets
              />
            </motion.div>
          )}

          {activeTab === 'details' && (
            <motion.div
              key="details-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              <DeviceDetailsView 
                device={selectedDevice}
                onBack={() => setActiveTab('inventory')}
                onModifyDeviceStatus={handleModifyDeviceStatus}
              />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
            >
              <ProfileView 
                onResetDatabase={handleResetDatabase}
                pinkPingFrequency={pinkPingFrequency}
                setPinkPingFrequency={setPinkPingFrequency}
                backupInterval={backupInterval}
                setBackupInterval={setBackupInterval}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Fixed Bottom Navigation HUD Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#07090a]/95 border-t border-neutral-900 flex justify-around items-center h-16 px-4 backdrop-blur-md">
        
        {/* Dashboard */}
        <button 
          onClick={() => setActiveTab('dashboard')}
          id="nav-tab-dashboard"
          className={`flex flex-col items-center justify-center w-20 transition-all active:scale-95 ${
            activeTab === 'dashboard' 
              ? 'text-[#00daf3] font-bold scale-105' 
              : 'text-zinc-600 opacity-70 hover:text-cyan-400'
          }`}
        >
          <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
          <span className="font-mono text-[9px] uppercase tracking-wider">Dashboard</span>
        </button>

        {/* Inventory */}
        <button 
          onClick={() => setActiveTab('inventory')}
          id="nav-tab-inventory"
          className={`flex flex-col items-center justify-center w-20 transition-all active:scale-95 ${
            activeTab === 'inventory' || activeTab === 'details'
              ? 'text-[#00daf3] font-bold scale-105' 
              : 'text-zinc-600 opacity-70 hover:text-cyan-400'
          }`}
        >
          <Laptop className="w-5 h-5 mb-0.5" />
          <span className="font-mono text-[9px] uppercase tracking-wider">Inventory</span>
        </button>

        {/* Profile */}
        <button 
          onClick={() => setActiveTab('profile')}
          id="nav-tab-profile"
          className={`flex flex-col items-center justify-center w-20 transition-all active:scale-95 ${
            activeTab === 'profile' 
              ? 'text-[#00daf3] font-bold scale-105' 
              : 'text-zinc-600 opacity-70 hover:text-cyan-400'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="font-mono text-[9px] uppercase tracking-wider">Profile</span>
        </button>

      </nav>

    </div>
  );
}
