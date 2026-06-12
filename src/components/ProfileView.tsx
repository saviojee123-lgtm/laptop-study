import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Settings, 
  RotateCcw, 
  Sliders, 
  Clock, 
  Cloud,
  Check,
  Cpu,
  Tv
} from 'lucide-react';

interface ProfileViewProps {
  onResetDatabase: () => void;
  pinkPingFrequency: number;
  setPinkPingFrequency: React.Dispatch<React.SetStateAction<number>>;
  backupInterval: number;
  setBackupInterval: React.Dispatch<React.SetStateAction<number>>;
}

export default function ProfileView({
  onResetDatabase,
  pinkPingFrequency,
  setPinkPingFrequency,
  backupInterval,
  setBackupInterval,
}: ProfileViewProps) {
  const [isSaved, setIsSaved] = useState(false);

  // Admin Info
  const adminEmail = 'saviojee123@gmail.com';
  const roleName = 'SYSTEMS CENSUS DIRECTOR';
  const accessPrivilege = 'Global Administrator Level 5';

  const handleSavePreferences = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-lg font-sans">
      
      {/* Profile Card Header */}
      <section className="bg-[#0A0A0A] border border-[#1A1A1A] p-md rounded-lg flex flex-col items-center text-center space-y-sm relative overflow-hidden select-none">
        {/* Glow blur background */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#00daf3]/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-cyan-500/5 rounded-full blur-xl pointer-events-none"></div>

        {/* Profile Avatar Hotlink */}
        <div className="w-24 h-24 rounded-full border-2 border-brand-cyan overflow-hidden shadow-lg shadow-cyan-950/40">
          <img 
            alt="Director avatar profile" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCg61E03yQQW_BJy75BCW9BDaJSJ9C0daqa_Gki-cv6-885BrNclOUCNbgI1OV1TJ9mEnqvixzJ3l0xnPLMz52U-fZ2_QMmz24jP9zGxnJdU4WDMaLq2EiZMin1tdVj5Hjwzqm_2jmdXpBldJKdPJXZKZ2A9yr0DNdVn2Cv08HG9zX4g5Eq4kIQH_Pz0FNP_lvdkSSAUy05MXkc0vXI7qrQW35RvTt0r9I01P9uaFCyD5eCbgk33TxEgFZ0fGvRrUJvh2A_ym3KZ5XM"
            className="w-full h-full object-cover select-none pointer-events-none"
          />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center justify-center gap-1.5Packed">
            saviojee
            <ShieldCheck className="w-4.5 h-4.5 text-brand-cyan fill-cyan-950/40" />
          </h2>
          <p className="font-mono text-[10px] text-brand-cyan uppercase tracking-widest font-semibold">{roleName}</p>
          <p className="text-xs text-on-surface-variant flex items-center gap-1 justify-center mt-xs">
            <Mail className="w-3.5 h-3.5" />
            <span>{adminEmail}</span>
          </p>
        </div>
      </section>

      {/* Access privileges and tokens info details */}
      <section className="bg-[#0A0A0A] border border-[#1A1A1A] p-sm rounded-lg space-y-sm">
        <h3 className="font-label-caps text-label-caps text-on-surface-variant opacity-60 uppercase tracking-wider font-bold">Credential Access</h3>
        <div className="grid grid-cols-2 gap-sm text-[11px] font-mono leading-relaxed text-zinc-400">
          <div>
            <span className="text-gray-500 uppercase text-[9px] block">SECURITY LEVEL</span>
            <span className="text-white text-xs font-semibold">{accessPrivilege}</span>
          </div>
          <div>
            <span className="text-gray-500 uppercase text-[9px] block">CONSOLE SCHEME</span>
            <span className="text-brand-cyan text-xs font-semibold">RSA_4096_ENCRYPTED</span>
          </div>
        </div>
      </section>

      {/* Supervisory parameters controllers sliders */}
      <section className="bg-[#0A0A0A] border border-[#1A1A1A] p-md rounded-lg space-y-md">
        <div className="flex items-center gap-xs border-b border-neutral-900 pb-sm">
          <Sliders className="w-4.5 h-4.5 text-brand-cyan" />
          <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-bold">Registry Preferences</h3>
        </div>

        {/* Controller 1: ping frequency */}
        <div className="space-y-xs">
          <div className="flex justify-between items-center text-xs">
            <span className="text-on-surface font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-neutral-400" /> Ping Diagnostics Rate (sec)
            </span>
            <span className="font-mono text-brand-cyan text-xs font-bold">{pinkPingFrequency}s</span>
          </div>
          <input 
            type="range" 
            min="2" 
            max="30"
            value={pinkPingFrequency}
            onChange={e => setPinkPingFrequency(Number(e.target.value))}
            className="w-full accent-[#00daf3] cursor-pointer bg-neutral-900 h-1.5 rounded-full"
          />
          <p className="text-[10px] text-zinc-500 italic">Determines latency update frequency for terminal logs.</p>
        </div>

        {/* Controller 2: cloud sync frequency */}
        <div className="space-y-xs">
          <div className="flex justify-between items-center text-xs">
            <span className="text-on-surface font-semibold flex items-center gap-1">
              <Cloud className="w-3.5 h-3.5 text-neutral-400" /> Cloud Sync Interval (min)
            </span>
            <span className="font-mono text-brand-cyan text-xs font-bold">{backupInterval}m</span>
          </div>
          <input 
            type="range" 
            min="5" 
            max="120"
            value={backupInterval}
            onChange={e => setBackupInterval(Number(e.target.value))}
            className="w-full accent-[#00daf3] cursor-pointer bg-neutral-900 h-1.5 rounded-full"
          />
          <p className="text-[10px] text-zinc-500 italic font-mono">Student project backup synchronization trigger.</p>
        </div>

        {/* Save button */}
        <div className="pt-2 flex justify-end">
          <button 
            type="button"
            onClick={handleSavePreferences}
            className="bg-brand-cyan text-black hover:bg-cyan-400 font-bold px-4 py-2 rounded text-xs transition-transform active:scale-95 flex items-center gap-1 font-bold"
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-black" /> : null}
            {isSaved ? 'Preferences Saved' : 'Save Parameters'}
          </button>
        </div>
      </section>

      {/* Disaster recovery restore seeds database button */}
      <section className="bg-rose-950/20 border border-rose-900/30 p-md rounded-lg space-y-sm">
        <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest">Administrative Actions</h4>
        <p className="text-slate-400 text-xs">
          Should local state descriptors fail synchronization or look empty, you can restore initial system specs. This clears cataloged devices and restores the default laptops seed data.
        </p>
        <div>
          <button 
            onClick={() => {
              if (confirm('Verify: Reset state to original seed nodes? Any custom registered laptops will be removed.')) {
                onResetDatabase();
                alert('Primary catalog successfully rollbacked to default seed devices!');
              }
            }}
            className="border border-rose-800 text-rose-400 hover:bg-rose-900 hover:text-white px-md py-sm rounded text-xs font-bold font-mono transition-colors"
          >
            RESTORE DEFAULT DATA
          </button>
        </div>
      </section>

    </div>
  );
}
