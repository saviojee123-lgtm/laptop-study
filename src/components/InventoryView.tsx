import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Laptop, 
  Cpu, 
  CheckCircle, 
  XOctagon, 
  AlertCircle, 
  ChevronRight,
  Sparkles,
  Zap,
  Activity,
  ScanLine,
  Camera,
  X,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { Device } from '../types';

interface InventoryViewProps {
  devices: Device[];
  onNavigateToDevice: (deviceId: string) => void;
  onNavigateToDashboard: () => void;
  onModifyDeviceStatus: (deviceId: string, status: 'Online' | 'Offline') => void;
  onRemoveDevice: (deviceId: string) => void;
  networkLoad: number;
  setNetworkLoad: React.Dispatch<React.SetStateAction<number>>;
  activeNodesOffset: number;
}

export default function InventoryView({
  devices,
  onNavigateToDevice,
  onNavigateToDashboard,
  onModifyDeviceStatus,
  onRemoveDevice,
  networkLoad,
  setNetworkLoad,
  activeNodesOffset,
}: InventoryViewProps) {
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChip, setActiveChip] = useState<string>('All Units');

  // Scanner modal FAB state
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [scannedTag, setScannedTag] = useState('');

  // Dropdown controls for specific card settings
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Filter categorization logic
  const filteredDevices = devices.filter(device => {
    // 1. Text search
    const matchText = 
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      device.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
      device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      device.ip.includes(searchTerm);

    // 2. Chip filters
    if (activeChip === 'All Units') return matchText;
    if (activeChip === 'MacBook Pro') return matchText && device.category === 'MacBook Pro';
    if (activeChip === 'ThinkPad') return matchText && device.category === 'ThinkPad';
    if (activeChip === 'Dell XPS') return matchText && device.category === 'Dell XPS';

    return matchText;
  });

  // Hot dynamic telemetry counts matching listed nodes:
  const onlineInView = filteredDevices.filter(d => d.status === 'Online').length;
  const activeNodesCountValue = activeNodesOffset + onlineInView;

  // Render a barcode asset scanner simulation
  const handleStartScan = () => {
    setScanStatus('scanning');
    setScannedTag('Locating asset laser focus overlay...');
    setTimeout(() => {
      // Pick a random device SN
      const randomIdx = Math.floor(Math.random() * devices.length);
      const pickedDevice = devices[randomIdx];
      setScannedTag(`DETECTION SUCCESS!\n\nID: ${pickedDevice.name}\nTag: ${pickedDevice.assetTag}\nSerial: ${pickedDevice.serialNumber}\nIP Node: ${pickedDevice.ip}`);
      setScanStatus('success');
    }, 1800);
  };

  return (
    <div className="space-y-lg relative">

      {/* Search & Filter Area */}
      <section className="space-y-sm">
        {/* Search input ghost style */}
        <div className="relative group border-b border-neutral-900 focus-within:border-brand-cyan transition-all">
          <Search className="absolute left-0 bottom-2 text-on-surface-variant text-sm w-4 h-4 text-cyan-400" />
          <input 
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-6 py-2 bg-transparent text-body-lg text-on-surface placeholder:text-zinc-600 border-none focus:outline-none focus:ring-0 text-sm md:text-base"
            placeholder="Search devices by name or serial..."
            id="device-search-ghost"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-0 bottom-2 text-[10px] uppercase font-mono text-cyan-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Categories Chips scrolling */}
        <div className="flex gap-xs overflow-x-auto pb-base hide-scrollbar">
          {['All Units', 'MacBook Pro', 'ThinkPad', 'Dell XPS'].map((chip) => {
            const isActive = activeChip === chip;
            return (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                className={`px-sm py-xs text-label-caps font-bold font-mono tracking-wider transition-all duration-200 rounded-lg whitespace-nowrap active:scale-95 ${
                  isActive 
                    ? 'bg-[#00e5ff] text-[#001f24] font-semibold' 
                    : 'bg-[#121414] border border-neutral-900 text-on-surface-variant hover:bg-neutral-800'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </section>

      {/* Inventory list */}
      <section className="space-y-xs">
        {/* Registry list layout headers */}
        <div className="flex justify-between items-center px-sm select-none">
          <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Device Registry</span>
          <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Status</span>
        </div>

        <div className="space-y-xs" id="device-list">
          {filteredDevices.length === 0 ? (
            <div className="text-center py-12 bg-[#0A0A0A] border border-dashed border-neutral-900 rounded-lg">
              <AlertCircle className="w-8 h-8 text-cyan-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-white">No laptops cataloged matching "{searchTerm}"</p>
              <button 
                onClick={() => { setSearchTerm(''); setActiveChip('All Units'); }}
                className="mt-2 text-xs text-brand-cyan underline font-mono"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            filteredDevices.map((device) => {
              const isOnline = device.status === 'Online';
              return (
                <div 
                  key={device.id}
                  className="bg-[#0A0A0A] border border-[#121415] rounded-lg p-sm flex justify-between items-center group cursor-pointer hover:border-brand-cyan/20 active:border-[#00daf3] transition-all relative overflow-hidden"
                  onMouseEnter={() => setHoveredCardId(device.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                >
                  {/* Laptop left info */}
                  <div 
                    onClick={() => onNavigateToDevice(device.id)}
                    className="flex items-center gap-md flex-1"
                  >
                    <div className={isOnline ? 'text-brand-cyan' : 'text-zinc-600'}>
                      <Laptop className="w-10 h-10 stroke-[1.2px]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-headline-sm text-on-surface hover:text-[#00daf3] transition-colors flex items-center gap-1.5Packed">
                        {device.name}
                        {isOnline ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                        )}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                        <span>{device.model}</span>
                      </p>
                    </div>
                  </div>

                  {/* Device Status Right Column */}
                  <div className="flex items-center gap-2">
                    {/* Status Chip */}
                    <div 
                      onClick={() => onNavigateToDevice(device.id)}
                      className="flex flex-col items-end gap-1"
                    >
                      <div className={`px-2 py-[2px] rounded-lg border text-[9px] font-mono uppercase tracking-widest font-bold ${
                        isOnline 
                          ? 'border-brand-cyan/30 bg-cyan-950/20 text-[#00daf3]' 
                          : 'border-zinc-800 bg-zinc-950/20 text-zinc-500'
                      }`}>
                        {device.status}
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500 font-medium">
                        {isOnline ? `IP: ${device.ip}` : device.lastSeen}
                      </span>
                    </div>

                    {/* Interactive Dropdown for fast modify */}
                    {hoveredCardId === device.id && (
                      <div className="flex gap-1 bg-[#121415] border border-neutral-800 rounded px-1.5 py-1 z-10 transition-opacity">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onModifyDeviceStatus(device.id, isOnline ? 'Offline' : 'Online');
                          }}
                          title="Toggle Network Connection"
                          className="p-1 hover:bg-[#1a1c1d] rounded text-[#00daf3] transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Acknowledge: Are you sure you want to decomission and wipe metadata for device ${device.name}?`)) {
                              onRemoveDevice(device.id);
                            }
                          }}
                          title="Decommission & Delete Device"
                          className="p-1 hover:bg-rose-950 rounded text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Telemetry stats overview footer */}
      <section className="grid grid-cols-2 gap-xs select-none pt-md">
        {/* Network Load */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-sm space-y-base rounded-lg group">
          <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60 uppercase tracking-widest">Network Load</p>
          <div className="flex items-baseline gap-base">
            <span className="font-display-lg text-display-lg text-[#00daf3] font-bold tracking-tight">{networkLoad.toFixed(1)}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">Gbps</span>
          </div>
          <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-cyan transition-all duration-300" 
              style={{ width: `${(networkLoad / 5) * 100}%` }}
            ></div>
          </div>
          <button 
            onClick={() => setNetworkLoad(prev => Math.min(4.8, Math.max(0.4, prev + (Math.random() * 0.8 - 0.4))))}
            className="text-[9px] text-[#00daf3] opacity-0 group-hover:opacity-150 transition-opacity font-mono underline"
          >
            Update Load metrics
          </button>
        </div>

        {/* Active Nodes */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-sm space-y-base rounded-lg transition-colors">
          <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60 uppercase tracking-widest">Active Nodes</p>
          <div className="flex items-baseline gap-base">
            <span className="font-display-lg text-display-lg text-[#00daf3] font-bold tracking-tight">{activeNodesCountValue}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">/ 140</span>
          </div>
          <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-cyan transition-all duration-300" 
              style={{ width: `${(activeNodesCountValue / 140) * 100}%` }}
            ></div>
          </div>
          <div className="text-[9px] text-zinc-500 font-mono">
            {onlineInView} of catalog mapped
          </div>
        </div>
      </section>

      {/* Floating Action Bar - Barcode laser scanner simulation */}
      <button 
        onClick={() => {
          setIsScanOpen(true);
          setScanStatus('idle');
        }}
        id="fab-asset-scanner"
        className="fixed right-6 bottom-[88px] w-14 h-14 bg-[#00daf3] text-black hover:bg-cyan-400 rounded-xl shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-40 cursor-pointer"
        title="Diagnostic Asset laser scanner"
      >
        <ScanLine className="w-6 h-6 stroke-[2.5px] text-black" />
      </button>

      {/* Laser Focus Barcode Simulator overlay panel */}
      <AnimatePresence>
        {isScanOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xs z-50 flex items-center justify-center p-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#0A0A0A] border border-[#222] rounded-xl w-full max-w-sm overflow-hidden text-white"
            >
              {/* Head */}
              <div className="bg-[#121212] px-sm py-md border-b border-[#222] flex justify-between items-center">
                <span className="text-[10px] tracking-widest text-[#00daf3] uppercase font-bold flex items-center gap-xs">
                  <ScanLine className="w-4 h-4 text-brand-cyan" />
                  INFRASTRUCTURE ASSURING SYSTEM
                </span>
                <button onClick={() => setIsScanOpen(false)} className="p-0.5 hover:text-white text-gray-500">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Action content scanner */}
              <div className="p-sm text-center space-y-md">
                <div className="relative w-48 h-48 mx-auto border-2 border-dashed border-[#1a1a1a] rounded flex flex-col justify-center items-center bg-black overflow-hidden group">
                  
                  {/* Laser line effect */}
                  {scanStatus === 'scanning' && (
                    <motion.div 
                      animate={{ y: [0, 180, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                      className="absolute top-0 left-0 right-0 h-0.5 bg-red-500 shadow-lg shadow-red-500/50 z-10"
                    />
                  )}

                  <Camera className={`w-10 h-10 ${scanStatus === 'scanning' ? 'text-red-500 animate-pulse' : 'text-zinc-600'}`} />
                  <p className="text-[10px] text-zinc-500 font-mono mt-xs select-none">LASER SCAN TARGET CHANNEL</p>
                </div>

                <div className="space-y-xs">
                  {scanStatus === 'idle' && (
                    <button 
                      onClick={handleStartScan}
                      className="bg-brand-cyan text-black font-semibold hover:bg-cyan-400 font-mono text-xs px-md py-sm rounded tracking-wide font-bold transition-transform active:scale-95"
                    >
                      ACTIVATE OPTICAL LASER
                    </button>
                  )}

                  {scanStatus === 'scanning' && (
                    <div className="flex items-center justify-center gap-xs text-[#00daf3] font-mono text-xs animate-pulse">
                      <RefreshCw className="w-4 h-4 animate-spin text-brand-cyan" />
                      <span>Reading secure cryptographic memory sectors...</span>
                    </div>
                  )}

                  {scanStatus === 'success' && (
                    <div className="space-y-sm">
                      <pre className="text-left bg-[#0c0f10] border border-neutral-900 rounded p-sm text-cyan-200 font-mono text-[11px] leading-relaxed select-text whitespace-pre-wrap">
                        {scannedTag}
                      </pre>
                      <button 
                        onClick={handleStartScan}
                        className="bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs px-md py-sm rounded select-none"
                      >
                        SCAN COMPANION TARGET
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
