import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Laptop, 
  TrendingUp, 
  Activity, 
  PlusCircle, 
  RefreshCw,
  BarChart2, 
  Code, 
  Terminal, 
  Layers, 
  Cloud, 
  CloudLightning,
  AlertTriangle, 
  MemoryStick, // Lucide icon for memory is Cpu or MemoryStick
  CheckCircle2, 
  ChevronRight,
  Info,
  X,
  FileSpreadsheet,
  AlertOctagon,
  Cpu
} from 'lucide-react';
import { Device, ActivityLog, IdeUsage } from '../types';
import { staticIdes } from '../data';

interface DashboardViewProps {
  devices: Device[];
  alerts: ActivityLog[];
  setAlerts: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  onNavigateToInventory: () => void;
  onNavigateToDevice: (deviceId: string) => void;
  onAddDevice: (newDevice: Device) => void;
  ideUsageList: IdeUsage[];
  setIdeUsageList: React.Dispatch<React.SetStateAction<IdeUsage[]>>;
  projectSyncState: boolean;
  setProjectSyncState: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DashboardView({
  devices,
  alerts,
  setAlerts,
  onNavigateToInventory,
  onNavigateToDevice,
  onAddDevice,
  ideUsageList,
  setIdeUsageList,
  projectSyncState,
  setProjectSyncState,
}: DashboardViewProps) {
  // Add Device Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newModel, setNewModel] = useState('MacBook Pro M3 Max');
  const [newCpu, setNewCpu] = useState('Apple M3 Max (14-Core)');
  const [newRam, setNewRam] = useState('32GB Unified Memory');
  const [newOs, setNewOs] = useState('macOS Sequoia 15.1');
  const [newStatus, setNewStatus] = useState<'Online' | 'Offline'>('Online');
  const [newCategory, setNewCategory] = useState<'MacBook Pro' | 'ThinkPad' | 'Dell XPS' | 'Chromebook' | 'Other'>('MacBook Pro');

  // Trigger Bulk Update Simulation
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [currentUpdatingItem, setCurrentUpdatingItem] = useState('');

  // Reports Modal State
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Alert Detail State
  const [selectedAlert, setSelectedAlert] = useState<ActivityLog | null>(null);

  // Dynamic calculations:
  const onlineCount = devices.filter(d => d.status === 'Online').length;
  const offlineCount = devices.filter(d => d.status === 'Offline').length;
  
  // Total laptops base 1279 plus dynamic cataloged length
  const totalLaptopsCount = 1279 + devices.length;
  // Active laptops base 937 plus current online devices count
  const activeDevicesCount = 937 + onlineCount;

  // Handle addition of a custom device
  const handleSubmitDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const baseIP = '192.168.1.' + Math.floor(Math.random() * 200 + 50);
    const mockSerialNumber = `${newCategory.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 90000 + 10000)}-${newStatus === 'Online' ? 'Y' : 'N'}`;
    const mockMac = Array.from({length: 6}, () => Math.floor(Math.random()*256).toString(16).toUpperCase().padStart(2, '0')).join(':');

    const deviceObj: Device = {
      id: String(devices.length + 1),
      name: newName.toUpperCase(),
      model: `${newModel} · ${newRam}`,
      cpu: newCpu,
      ram: `${newRam} @ DDR5 Speed`,
      os: newOs,
      serialNumber: mockSerialNumber,
      status: newStatus,
      ip: baseIP,
      lastSeen: newStatus === 'Online' ? 'Active' : 'Just added',
      memoryUsage: '8.0 GB / 16 GB',
      memoryPercent: 50,
      ssdCapacity: '256 GB / 512 GB',
      ssdPercent: 50,
      batteryHealth: Math.floor(Math.random() * 15 + 85),
      macAddress: mockMac,
      assetTag: `#INV-${Math.floor(Math.random() * 90000 + 10000)}-DL`,
      category: newCategory
    };

    onAddDevice(deviceObj);
    setIsAddOpen(false);
    setNewName('');
  };

  // Launch simulated software patch
  const handleBulkUpdate = () => {
    if (isUpdating) return;
    setIsUpdating(true);
    setUpdateProgress(0);

    const updateSteps = [
      { prg: 20, msg: 'Querying node registry connections...' },
      { prg: 45, msg: 'Deploying security package v12.4.9...' },
      { prg: 70, msg: 'Hot-patching active CPU thread descriptors...' },
      { prg: 90, msg: 'Writing memory segment registers...' },
      { prg: 100, msg: 'Patch deployed successfully!' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < updateSteps.length) {
        setUpdateProgress(updateSteps[currentStep].prg);
        setCurrentUpdatingItem(updateSteps[currentStep].msg);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsUpdating(false);
          // Auto add a healthy success log
          const successLog: ActivityLog = {
            id: 'success-' + Date.now(),
            title: 'Bulk Update Successfully Deployed',
            subtitle: 'Applied patch v12.4.9 to all online nodes',
            type: 'HEALTHY',
            timestamp: 'Just now',
            deviceSN: 'ALL-SYSTEMS'
          };
          setAlerts(prev => [successLog, ...prev]);
        }, 1000);
      }
    }, 700);
  };

  // Resolve or clear an alert
  const handleDismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    setSelectedAlert(null);
  };

  return (
    <div className="space-y-lg">
      
      {/* Overview Stats Bento Grid */}
      <section className="grid grid-cols-2 gap-xs">
        {/* Total Laptops */}
        <div 
          onClick={onNavigateToInventory}
          className="col-span-2 bg-[#0A0A0A] border border-[#1A1A1A] p-md rounded-lg flex flex-col justify-between h-40 relative overflow-hidden cursor-pointer group hover:border-[#00daf3]/40 transition-colors"
        >
          <div className="absolute top-0 right-0 p-sm opacity-10 text-cyan-400 group-hover:scale-110 transition-transform">
            <span className="text-[80px]">
              <Laptop className="w-20 h-20" />
            </span>
          </div>
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">TOTAL LAPTOPS</p>
            <h2 className="font-display-lg text-[48px] leading-none text-white mt-base tracking-tight">{totalLaptopsCount}</h2>
          </div>
          <div className="flex items-center gap-xs">
            <TrendingUp className="text-brand-cyan w-4 h-4" />
            <p className="font-data-mono text-data-mono text-brand-cyan">+12% from last month</p>
          </div>
        </div>

        {/* Active Devices */}
        <div 
          onClick={onNavigateToInventory}
          className="bg-[#0A0A0A] border border-[#1A1A1A] p-sm rounded-lg cursor-pointer hover:border-[#00daf3]/30 transition-colors"
        >
          <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">ACTIVE DEVICES</p>
          <div className="flex items-baseline gap-xs mt-base">
            <h3 className="font-headline-md text-headline-md text-white font-bold">{activeDevicesCount}</h3>
            <span className="font-data-mono text-[10px] text-on-surface-variant">/ {totalLaptopsCount}</span>
          </div>
          <div className="mt-sm h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div 
              className="bg-[#00daf3] h-full transition-all duration-500" 
              style={{ width: `${(activeDevicesCount / totalLaptopsCount) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-sm rounded-lg">
          <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">SYSTEM HEALTH</p>
          <div className="flex items-center gap-xs mt-base">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00daf3] animate-pulse"></div>
            <h3 className="font-headline-md text-headline-md text-white font-bold">
              {alerts.some(a => a.type === 'CRITICAL') ? 'Attention Required' : 'Optimal'}
            </h3>
          </div>
          <p className="font-data-mono text-[11px] text-[#00daf3] mt-sm uppercase tracking-widest font-semibold">99.9% UPTIME</p>
        </div>
      </section>

      {/* Quick Actions horizontal scroll list */}
      <section>
        <h4 className="font-label-caps text-label-caps text-on-surface-variant opacity-60 mb-sm">QUICK ACTIONS</h4>
        <div className="flex gap-xs overflow-x-auto hide-scrollbar pb-xs">
          <button 
            onClick={() => setIsAddOpen(true)}
            id="action-add-device"
            className="flex-none flex items-center gap-xs bg-brand-cyan text-black px-md py-sm rounded-lg font-bold text-body-lg active:scale-95 transition-transform"
          >
            <PlusCircle className="w-5 h-5 text-black" />
            <span>Add Device</span>
          </button>

          <button 
            onClick={handleBulkUpdate}
            id="action-update-all"
            className="flex-none flex items-center gap-xs bg-[#0A0A0A] border border-[#1A1A1A] text-white px-md py-sm rounded-lg font-headline-sm text-body-lg active:scale-95 transition-transform hover:border-[#00daf3] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin text-brand-cyan' : ''}`} />
            <span>Update All</span>
          </button>

          <button 
            onClick={() => setIsReportOpen(true)}
            id="action-reports"
            className="flex-none flex items-center gap-xs bg-[#0A0A0A] border border-[#1A1A1A] text-white px-md py-sm rounded-lg font-headline-sm text-body-lg active:scale-95 transition-transform hover:border-brand-cyan transition-colors"
          >
            <BarChart2 className="w-4 h-4 text-brand-cyan" />
            <span>Reports</span>
          </button>
        </div>
      </section>

      {/* Programming Activity Info Section */}
      <section>
        <h4 className="font-label-caps text-label-caps text-on-surface-variant opacity-60 mb-sm">PROGRAMMING ACTIVITY</h4>
        <div className="grid grid-cols-1 gap-xs">
          {/* Active Dev Environments Card */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-sm rounded-lg flex items-center justify-between">
            <div>
              <p className="font-label-caps text-[10px] text-on-surface-variant opacity-60">ACTIVE DEV ENVIRONMENTS</p>
              <h3 className="font-headline-md text-headline-md text-white mt-base font-bold">8 Active</h3>
            </div>
            <div className="flex items-center gap-xs bg-cyan-950/40 px-2 py-1 rounded border border-cyan-900/30">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00daf3] animate-pulse"></div>
              <p className="font-data-mono text-[11px] text-[#00daf3] uppercase tracking-widest font-semibold">SYNCED</p>
            </div>
          </div>

          {/* Resource Intensive IDEs List */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-sm rounded-lg">
            <p className="font-label-caps text-[10px] text-on-surface-variant opacity-60 mb-sm">RESOURCE INTENSIVE IDEs</p>
            <div className="space-y-sm">
              {ideUsageList.map((ide, idx) => (
                <div key={idx} className="flex items-center justify-between group hover:bg-[#121212] p-1.5 rounded transition-all">
                  <div className="flex items-center gap-sm">
                    {ide.icon === 'code' && <Code className="w-4 h-4 text-brand-cyan" />}
                    {ide.icon === 'terminal' && <Terminal className="w-4 h-4 text-brand-cyan" />}
                    {ide.icon === 'layers' && <Layers className="w-4 h-4 text-rose-400" />}
                    <span className="font-body-lg text-body-sm text-white font-medium">{ide.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-data-mono text-[11px] ${ide.type === 'CPU' ? 'text-rose-400 font-semibold' : 'text-on-surface-variant'}`}>{ide.metric}</span>
                    <button 
                      onClick={() => {
                        const updated = [...ideUsageList];
                        if (ide.type === 'RAM') {
                          const val = parseFloat(ide.metric) + (Math.random() > 0.5 ? 0.2 : -0.1);
                          updated[idx].metric = `${val.toFixed(1)}GB RAM`;
                        } else {
                          const val = parseInt(ide.metric) + (Math.random() > 0.5 ? 2 : -1);
                          updated[idx].metric = `${val}% CPU`;
                        }
                        setIdeUsageList(updated);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-neutral-800 rounded text-brand-cyan transition-opacity text-[10px]"
                    >
                      <RefreshCw className="w-3 h-3 animate-pulse" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Project Sync Card */}
          <div 
            onClick={() => setProjectSyncState(!projectSyncState)}
            className="bg-[#0A0A0A] border border-[#1A1A1A] p-sm rounded-lg flex items-center justify-between cursor-pointer hover:border-brand-cyan/20 transition-all"
          >
            <div className="flex items-center gap-sm">
              <Cloud className={`w-5 h-5 ${projectSyncState ? 'text-brand-cyan' : 'text-gray-600 animate-bounce'}`} />
              <div>
                <p className="font-body-lg text-body-sm text-white font-semibold">Student Project Sync</p>
                <p className="font-data-mono text-[10px] text-on-surface-variant opacity-60">
                  {projectSyncState ? 'All local repos backed up to cloud' : 'Sync idle. Tab to reconnect pipeline'}
                </p>
              </div>
            </div>
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${projectSyncState ? 'bg-cyan-950 text-[#00daf3]' : 'bg-zinc-800 text-zinc-500'}`}>
              {projectSyncState ? 'STABLE' : 'IDLE'}
            </div>
          </div>
        </div>
      </section>

      {/* PENDING ALERTS */}
      <section>
        <div className="flex justify-between items-end mb-sm">
          <h4 className="font-label-caps text-label-caps text-on-surface-variant opacity-60">PENDING ALERTS</h4>
          <button 
            onClick={onNavigateToInventory}
            className="font-data-mono text-[12px] text-[#00daf3] underline hover:text-cyan-300 transition-colors"
          >
            View All
          </button>
        </div>
        
        {alerts.length === 0 ? (
          <div className="bg-[#0A0A0A] border border-dashed border-neutral-900 rounded-lg p-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-[#00daf3] mx-auto mb-2" />
            <p className="text-sm font-medium text-white">No pending alerts</p>
            <p className="text-xs text-on-surface-variant mt-1">Supervisory controllers report all systems operating optimally.</p>
          </div>
        ) : (
          <div className="space-y-base">
            <AnimatePresence mode="popLayout">
              {alerts.map((alert) => (
                <motion.div 
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  onClick={() => setSelectedAlert(alert)}
                  className="bg-[#0A0A0A] border border-[#1A1A1A] p-sm rounded-lg flex items-center justify-between group hover:border-[#00daf3] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-lg bg-[#141414] flex items-center justify-center border border-[#222]">
                      {alert.type === 'CRITICAL' && <AlertOctagon className="w-5 h-5 text-red-500 animate-pulse" />}
                      {alert.type === 'WARNING' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                      {alert.type === 'HEALTHY' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    </div>
                    <div>
                      <p className="font-body-lg text-body-lg text-white font-medium">{alert.title}</p>
                      <p className="font-data-mono text-body-sm text-on-surface-variant opacity-60">SN: {alert.deviceSN}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`border text-[10px] px-xs py-[2px] font-bold rounded tracking-wider ${
                      alert.type === 'CRITICAL' ? 'border-red-600 text-red-500' :
                      alert.type === 'WARNING' ? 'border-amber-600 text-amber-500' :
                      'border-emerald-600 text-emerald-500'
                    }`}>
                      {alert.type}
                    </span>
                    <p className="font-data-mono text-[11px] text-on-surface-variant mt-base">{alert.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Dynamic Overlay Bulk Update Simulation */}
      <AnimatePresence>
        {isUpdating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col justify-center items-center p-8 select-none"
          >
            <div className="w-full max-w-sm space-y-md text-center">
              <span className="material-symbols-outlined text-[64px] text-brand-cyan animate-spin inline-block">
                <RefreshCw className="w-12 h-12 text-brand-cyan animate-spin mx-auto" />
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">Active Supervisory Bulk Patch</h3>
              <p className="text-xs text-brand-cyan font-mono tracking-widest uppercase">{currentUpdatingItem}</p>
              
              <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden mt-sm">
                <div 
                  className="bg-brand-cyan h-full transition-all duration-300"
                  style={{ width: `${updateProgress}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-on-surface-variant font-mono uppercase">
                Progress: {updateProgress}% (Pipeline Secure)
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Device Modal Dialog */}
      <AnimatePresence>
        {isAddOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0A0A0A] border border-[#222] rounded-xl w-full max-w-md overflow-hidden"
            >
              {/* Head */}
              <div className="bg-[#121212] px-sm py-md border-b border-[#222] flex justify-between items-center">
                <h3 className="text-body-lg text-white font-bold flex items-center gap-xs">
                  <Laptop className="w-5 h-5 text-brand-cyan" />
                  Add New Device
                </h3>
                <button 
                  onClick={() => setIsAddOpen(false)} 
                  className="p-1 text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitDevice} className="p-sm space-y-sm">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Device Hostname ID (e.g. LD-MAC-099)</label>
                  <input 
                    type="text" 
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. LD-MAC-049"
                    className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-white focus:border-brand-cyan focus:outline-none focus:ring-0 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Category & Make</label>
                    <select
                      value={newCategory}
                      onChange={e => {
                        const val = e.target.value as any;
                        setNewCategory(val);
                        if (val === 'MacBook Pro') {
                          setNewModel('MacBook Pro M3 Max');
                          setNewCpu('Apple M3 Max (16-Core)');
                          setNewRam('64GB Unified RAM');
                          setNewOs('macOS Sequoia 15.1');
                        } else if (val === 'ThinkPad') {
                          setNewModel('Lenovo ThinkPad X1');
                          setNewCpu('Intel Core i7-1355U vPro');
                          setNewRam('32GB LPDDR5');
                          setNewOs('Windows 11 Enterprise LTSC');
                        } else if (val === 'Dell XPS') {
                          setNewModel('Dell XPS 15');
                          setNewCpu('Intel Core i9-12900HK');
                          setNewRam('32GB DDR5 @ 4800MHz');
                          setNewOs('Microsoft Windows 11 Pro');
                        } else if (val === 'Chromebook') {
                          setNewModel('HP Chromebook 14');
                          setNewCpu('Intel Celeron N4500');
                          setNewRam('8GB LPDDR4x');
                          setNewOs('ChromeOS Canary Channel');
                        }
                      }}
                      className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-white text-sm"
                    >
                      <option value="MacBook Pro">MacBook Pro</option>
                      <option value="ThinkPad">ThinkPad</option>
                      <option value="Dell XPS">Dell XPS</option>
                      <option value="Chromebook">Chromebook</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">State Status</label>
                    <select
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value as any)}
                      className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-white text-sm"
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Model Spec Details</label>
                  <input 
                    type="text"
                    value={newModel}
                    onChange={e => setNewModel(e.target.value)}
                    placeholder="e.g. MacBook Pro M3 Max"
                    className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Microprocessor Specs</label>
                  <input 
                    type="text"
                    value={newCpu}
                    onChange={e => setNewCpu(e.target.value)}
                    placeholder="e.g. Apple M3 Max (16-Core)"
                    className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">RAM Capacity</label>
                    <input 
                      type="text"
                      value={newRam}
                      onChange={e => setNewRam(e.target.value)}
                      placeholder="e.g. 64GB LPDDR5"
                      className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Host OS Platform</label>
                    <input 
                      type="text"
                      value={newOs}
                      onChange={e => setNewOs(e.target.value)}
                      placeholder="e.g. macOS Sequoia"
                      className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#222] flex justify-end gap-xs">
                  <button 
                    type="button" 
                    onClick={() => setIsAddOpen(false)}
                    className="bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white font-bold px-4 py-2 rounded text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-brand-cyan text-black hover:bg-cyan-400 font-bold px-5 py-2 rounded text-xs transition-transform active:scale-95"
                  >
                    Catalog Device
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reports Summary Modal dialog */}
      <AnimatePresence>
        {isReportOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0A0A0A] border border-[#222] rounded-xl w-full max-w-lg overflow-hidden text-white"
            >
              {/* Head */}
              <div className="bg-[#121212] px-sm py-md border-b border-[#222] flex justify-between items-center">
                <h3 className="text-body-lg text-white font-bold flex items-center gap-xs">
                  <BarChart2 className="w-5 h-5 text-[#00daf3]" />
                  Active Infrastructure Census Report
                </h3>
                <button 
                  onClick={() => setIsReportOpen(false)} 
                  className="p-1 text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Data Content */}
              <div className="p-sm space-y-md font-sans">
                <div className="grid grid-cols-2 gap-sm text-center">
                  <div className="p-sm bg-black border border-[#1e1e19] rounded-lg">
                    <p className="text-[10px] uppercase text-gray-500 font-bold">Online Ratio</p>
                    <p className="text-2xl font-bold text-brand-cyan mt-1">
                      {((onlineCount / (devices.length || 1)) * 100).toFixed(0)}%
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">{onlineCount} connected / {devices.length} registered</p>
                  </div>
                  <div className="p-sm bg-black border border-[#1e1e19] rounded-lg">
                    <p className="text-[10px] uppercase text-gray-500 font-bold">Primary Specs Model</p>
                    <p className="text-lg font-bold text-emerald-400 mt-1 leading-snug">Apple M3 Series</p>
                    <p className="text-[10px] text-gray-400 mt-1">Dominated category in cluster</p>
                  </div>
                </div>

                {/* Specs Metrics list */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Category Distribution</h4>
                  
                  <div className="space-y-sm bg-black p-sm border border-[#151515] rounded">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Apple MacBooks</span>
                        <span className="font-bold">{devices.filter(d => d.category === 'MacBook Pro').length} Nodes</span>
                      </div>
                      <div className="h-1 bg-neutral-900 rounded-full overflow-hidden">
                        <div 
                          className="bg-brand-cyan h-full" 
                          style={{ width: `${(devices.filter(d => d.category === 'MacBook Pro').length / devices.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Lenovo ThinkPads</span>
                        <span className="font-bold">{devices.filter(d => d.category === 'ThinkPad').length} Nodes</span>
                      </div>
                      <div className="h-1 bg-neutral-900 rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-400 h-full" 
                          style={{ width: `${(devices.filter(d => d.category === 'ThinkPad').length / devices.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Dell Workstations</span>
                        <span className="font-bold">{devices.filter(d => d.category === 'Dell XPS').length} Nodes</span>
                      </div>
                      <div className="h-1 bg-neutral-900 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-400 h-full" 
                          style={{ width: `${(devices.filter(d => d.category === 'Dell XPS').length / devices.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated action print */}
                <div className="flex justify-end gap-2 text-xs pt-sm border-t border-[#222]">
                  <button 
                    onClick={() => setIsReportOpen(false)}
                    className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-bold px-4 py-2 rounded"
                  >
                    Done
                  </button>
                  <button 
                    onClick={() => {
                      alert('Simulating PDF/CSV census document creation... Report exported to administrative server pipeline.');
                      setIsReportOpen(false);
                    }}
                    className="bg-[#00daf3] text-black font-semibold hover:bg-cyan-400 px-4 py-2 rounded flex items-center gap-1 font-bold"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-black" />
                    Export CSV
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alert Detail Inspect Modal Dialog */}
      <AnimatePresence>
        {selectedAlert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0A0A0A] border border-[#222] rounded-xl w-full max-w-sm overflow-hidden text-white"
            >
              <div className="bg-[#121212] px-sm py-md border-b border-[#222] flex justify-between items-center">
                <span className="text-[10px] font-bold tracking-widest text-[#00daf3] uppercase">ALERT TELEMETRY LOG</span>
                <button onClick={() => setSelectedAlert(null)} className="p-0.5 hover:text-white text-gray-500">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-sm space-y-md">
                <div className="flex items-center gap-sm">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-black font-bold uppercase select-none ${
                    selectedAlert.type === 'CRITICAL' ? 'bg-red-500' :
                    selectedAlert.type === 'WARNING' ? 'bg-yellow-500' :
                    'bg-emerald-500'
                  }`}>
                    {selectedAlert.type[0]}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{selectedAlert.title}</h4>
                    <p className="text-xs text-on-surface-variant font-mono mt-0.5">Device SN: {selectedAlert.deviceSN}</p>
                  </div>
                </div>

                <div className="bg-black/50 p-sm border border-neutral-900 rounded font-mono text-xs text-cyan-200 leading-relaxed scrollbar-none overflow-y-auto max-h-32">
                  <p className="font-semibold text-[#00daf3] uppercase text-[10px] tracking-wider mb-base">System message logs:</p>
                  <p>{selectedAlert.subtitle}</p>
                  <p className="text-gray-500 text-[10px] mt-md">Timestamp: {selectedAlert.timestamp} | Code: ERR-SYS-SIG8</p>
                </div>

                <div className="pt-sm border-t border-[#222] flex justify-end gap-2">
                  <button 
                    onClick={() => setSelectedAlert(null)}
                    className="bg-neutral-900 hover:bg-neutral-800 border border-[#222] text-xs px-4 py-2 rounded font-bold"
                  >
                    Close Log
                  </button>
                  <button 
                    onClick={() => handleDismissAlert(selectedAlert.id)}
                    className="bg-red-950 text-red-200 border border-red-900 hover:bg-red-900 hover:text-white text-xs px-4 py-2 rounded font-bold"
                  >
                    Acknowledge & Clear
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
