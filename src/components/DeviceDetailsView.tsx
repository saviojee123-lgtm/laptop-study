import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  Terminal as TermIcon, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Battery, 
  Wifi, 
  Globe,
  Settings,
  CircleDot,
  Bot, // fallback for scan
  RefreshCw,
  X,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { Device } from '../types';
import TerminalPrompt from './TerminalPrompt';

interface DeviceDetailsViewProps {
  device: Device;
  onBack: () => void;
  onModifyDeviceStatus: (deviceId: string, status: 'Online' | 'Offline') => void;
}

export default function DeviceDetailsView({
  device,
  onBack,
  onModifyDeviceStatus,
}: DeviceDetailsViewProps) {
  // Remote terminal overlay state
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // Simulated software local package install state
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatePhase, setUpdatePhase] = useState<'idle' | 'checking' | 'downloading' | 'applying' | 'finished'>('idle');
  const [patchProgress, setPatchProgress] = useState(0);

  // Dynamic status check
  const isOnline = device.status === 'Online';

  // Triggering simulated software patches
  const handleStartUpdate = () => {
    if (isUpdating) return;
    setIsUpdating(true);
    setUpdatePhase('checking');
    setPatchProgress(15);

    setTimeout(() => {
      setUpdatePhase('downloading');
      setPatchProgress(45);
      
      const interval = setInterval(() => {
        setPatchProgress(prev => {
          if (prev < 90) {
            return prev + 15;
          } else {
            clearInterval(interval);
            setUpdatePhase('applying');
            setTimeout(() => {
              setUpdatePhase('finished');
              setPatchProgress(100);
              // Set battery and RAM to peak healthy values post optimization
              device.batteryHealth = Math.min(100, device.batteryHealth + 1);
            }, 1000);
            return 90;
          }
        });
      }, 350);
    }, 1200);
  };

  const closeUpdateModal = () => {
    setIsUpdating(false);
    setUpdatePhase('idle');
    setPatchProgress(0);
  };

  return (
    <div className="space-y-lg select-none pb-12">
      
      {/* Top Header with custom items */}
      <div className="flex justify-between items-center bg-surface border-b border-outline-variant py-base">
        <button 
          onClick={onBack}
          className="flex items-center gap-xs text-on-surface-variant hover:text-[#00daf3] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-cyan-400" />
          <span className="font-headline-sm text-headline-sm font-semibold text-white">System Inventory</span>
        </button>
      </div>

      {/* Hero Section: Device showcase with high contrast background layout */}
      <section>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-outline-variant bg-surface-container-lowest mb-md">
          <img 
            alt="Device Showcase representation"
            className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700 select-none pointer-events-none" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZaVDRlsWlxfgdo1Ty-5PBS86wuzKh0xx6YOAYLh9nQ7hxMgasqmRMVoVcjqQVa-Y0Xmh2dzuSAXr3zy8kJMR3QCTkW8Q7Y3uGrJKzMayfkH7-ymIMGKw-NJIiTAwjAIJi6UfR84DRcCDHyhvD0v7m2siOZ2x4_TQQOc2qBG8JKV5nT33XM4ogDWvqdvHzRyxPpgQ6YOpMhtDXDM-78RVuRIyc4j2690FgRbDE8KnT7N5K0WGJKbPLYqjoSanL-z1Qeb4D6Epth1Ow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          
          <div className="absolute bottom-md left-md strike-none">
            <span className={`inline-flex items-center px-xs py-base rounded-lg border text-label-caps font-bold mb-xs select-none ${
              isOnline 
                ? 'border-brand-cyan text-brand-cyan' 
                : 'border-zinc-800 text-zinc-500'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-xs select-none ${
                isOnline ? 'bg-brand-cyan animate-pulse' : 'bg-zinc-650'
              }`}></span>
              SYSTEM {isOnline ? 'HEALTHY' : 'OFFLINE'}
            </span>
            <h2 className="font-display-lg text-display-lg text-white font-bold leading-none tracking-tight">{device.name}</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Asset Tag: {device.assetTag}</p>
          </div>

          <div className="absolute top-md right-md">
            <button 
              onClick={() => onModifyDeviceStatus(device.id, isOnline ? 'Offline' : 'Online')}
              className={`p-1.5 rounded border text-xs font-mono select-none ${
                isOnline 
                  ? 'bg-cyan-950/40 text-brand-cyan border-cyan-800/20 hover:bg-cyan-900/30' 
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              {isOnline ? 'DISCONNECT' : 'RECONNECT'}
            </button>
          </div>
        </div>

        {/* Quick Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-gutter mb-lg select-none">
          {/* SSH shell */}
          <button 
            onClick={() => {
              if (isOnline) {
                setIsTerminalOpen(true);
              } else {
                alert(`Authentication failure: Node ${device.name} is currently offline. You must toggle the network flag to RECONNECT before opening the remote management console.`);
              }
            }}
            id="action-remote-management"
            className="bg-brand-cyan text-black font-semibold text-label-caps py-sm flex items-center justify-center gap-xs rounded-lg active:scale-95 transition-transform"
          >
            <TermIcon className="w-4 h-4 text-black stroke-[3px]" />
            <span>REMOTE MANAGEMENT</span>
          </button>

          {/* Software patches */}
          <button 
            onClick={handleStartUpdate}
            id="action-software-update"
            className="border border-outline-variant text-on-surface font-semibold text-label-caps py-sm flex items-center justify-center gap-xs rounded-lg active:scale-95 transition-transform hover:bg-surface-bright transition-colors text-[#00daf3]"
          >
            <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
            <span>SOFTWARE UPDATE</span>
          </button>
        </div>
      </section>

      {/* Technical specification grid boards */}
      <section className="px-base">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {/* Core Specs specs cards */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-md rounded-lg">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant opacity-60 mb-md uppercase tracking-wider font-bold">Core Architecture</h3>
            <div className="space-y-base text-sm font-sans">
              <div className="flex justify-between items-center py-2 border-b border-neutral-900/40">
                <span className="text-on-surface-variant text-xs">Processor</span>
                <span className="font-mono text-xs text-white text-right">{device.cpu}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-900/40">
                <span className="text-on-surface-variant text-xs">RAM Channel</span>
                <span className="font-mono text-xs text-white text-right">{device.ram}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-900/40">
                <span className="text-on-surface-variant text-xs">System OS</span>
                <span className="font-mono text-xs text-white text-right">{device.os}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-on-surface-variant text-xs">Serial No:</span>
                <span className="font-mono text-xs text-white text-right select-text">{device.serialNumber}</span>
              </div>
            </div>
          </div>

          {/* Live Performance Diagnostic details */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-md rounded-lg space-y-md">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant opacity-60 mb-xs uppercase tracking-wider font-bold">Real-time Performance</h3>
            
            {/* Memory card info */}
            <div>
              <div className="flex justify-between items-end mb-xs">
                <span className="text-body-sm text-on-surface font-medium flex items-center gap-1 text-xs">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Memory Usage
                </span>
                <span className="font-mono text-xs text-[#00daf3]">{device.memoryUsage}</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-cyan transition-all duration-500" 
                  style={{ width: `${device.memoryPercent}%` }}
                ></div>
              </div>
            </div>

            {/* SSD info card */}
            <div>
              <div className="flex justify-between items-end mb-xs">
                <span className="text-body-sm text-on-surface font-medium flex items-center gap-1 text-xs">
                  <HardDrive className="w-3.5 h-3.5 text-cyan-400" /> SSD Capacity
                </span>
                <span className="font-mono text-xs text-[#00daf3]">{device.ssdCapacity}</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-cyan transition-all duration-500" 
                  style={{ width: `${device.ssdPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Battery Health card info */}
            <div>
              <div className="flex justify-between items-end mb-xs">
                <span className="text-body-sm text-on-surface font-medium flex items-center gap-1 text-xs">
                  <Battery className="w-3.5 h-3.5 text-cyan-400" /> Battery Health
                </span>
                <span className="font-mono text-xs text-[#00daf3]">{device.batteryHealth}%</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-cyan transition-all duration-500" 
                  style={{ width: `${device.batteryHealth}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Network Details Card bottom */}
        <div className="mt-gutter bg-[#0A0A0A] border border-[#1A1A1A] p-md rounded-lg font-sans">
          <div className="flex items-center gap-xs mb-sm">
            <Wifi className="text-[#00daf3] w-4 h-4" />
            <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-bold">Network Configuration</h3>
          </div>
          <div className="grid grid-cols-2 gap-sm text-[11px] md:text-sm">
            <div>
              <label className="font-mono text-[9px] text-on-surface-variant opacity-60 uppercase block mb-1">IPv4 Address</label>
              <span className="font-mono text-xs text-white font-medium select-text">{device.ip}</span>
            </div>
            <div>
              <label className="font-mono text-[9px] text-on-surface-variant opacity-60 uppercase block mb-1">MAC Address</label>
              <span className="font-mono text-xs text-white font-medium select-text">{device.macAddress}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Terminal emulator overlay view drawer */}
      <AnimatePresence>
        {isTerminalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-xs md:p-md select-text"
          >
            <motion.div 
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              className="w-full max-w-2xl bg-black border border-neutral-800 rounded-xl overflow-hidden shadow-2xl"
            >
              <div className="bg-[#121415] px-sm py-2 border-b border-neutral-950 flex items-center justify-between">
                <div className="flex items-center gap-xs select-none">
                  <TermIcon className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-[10px] uppercase text-[#00daf3] tracking-widest font-bold">
                    SECURE CONSOLE LINK: {device.name}
                  </span>
                </div>
                <button 
                  onClick={() => setIsTerminalOpen(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-500 hover:text-white" />
                </button>
              </div>

              {/* Terminal Container */}
              <div className="p-sm">
                <TerminalPrompt device={device} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Software Package Download Simulated Dialog */}
      <AnimatePresence>
        {isUpdating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#0F1113] border border-neutral-800 rounded-xl p-md max-w-sm w-full text-center space-y-md text-white font-sans"
            >
              <RefreshCw className={`w-12 h-12 text-[#00daf3] mx-auto ${updatePhase !== 'finished' ? 'animate-spin' : ''}`} />
              
              <div className="space-y-sm">
                <h4 className="text-base font-bold tracking-tight">Active Software Package Deploy</h4>
                
                {updatePhase === 'checking' && (
                  <p className="text-xs text-brand-cyan animate-pulse">Checking remote repository for newer firmware build signatures...</p>
                )}
                {updatePhase === 'downloading' && (
                  <p className="text-xs text-brand-cyan">Downloading payload signature: <span className="font-mono">patch_v9.9.52_amd64.deb</span></p>
                )}
                {updatePhase === 'applying' && (
                  <p className="text-xs text-amber-400 font-semibold animate-pulse">Writing update headers directly to kernel storage block...</p>
                )}
                {updatePhase === 'finished' && (
                  <div className="space-y-xs">
                    <p className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> Device hot patch successfully synced!
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono">Telemetry reported all memory caches cleared.</p>
                  </div>
                )}
              </div>

              {/* Progress visual */}
              <div className="w-full bg-[#1A1A1A] h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-[#00daf3] h-full transition-all duration-300"
                  style={{ width: `${patchProgress}%` }}
                ></div>
              </div>

              <div className="pt-2 flex justify-center">
                <button 
                  onClick={closeUpdateModal}
                  disabled={updatePhase !== 'finished'}
                  className={`px-sm py-1.5 text-xs font-mono rounded ${
                    updatePhase === 'finished' 
                      ? 'bg-brand-cyan text-black hover:bg-cyan-400 cursor-pointer font-bold' 
                      : 'bg-zinc-850 text-zinc-650 cursor-not-allowed'
                  }`}
                >
                  {updatePhase === 'finished' ? 'Acknowledge Update' : 'Applying Patch...'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
