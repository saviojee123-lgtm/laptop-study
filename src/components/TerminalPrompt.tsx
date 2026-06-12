import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Play, CornerDownLeft, RefreshCw, Sparkles } from 'lucide-react';
import { Device } from '../types';

interface TerminalPromptProps {
  device: Device;
}

interface CommandHistory {
  input: string;
  output: string;
  timestamp: string;
}

export default function TerminalPrompt({ device }: TerminalPromptProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      input: 'ssh admin@' + device.ip,
      output: `Connecting to ${device.name} [IP: ${device.ip}]...\nEstablished secure connection using RSA 4096 signature.\nLast login: Fri Jun 12 01:22:45 from server-central.\nRunning: ${device.os}\nCPU Specs: ${device.cpu}\n\nType 'help' to see list of automated terminal triggers.`,
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading]);

  const runCommand = (cmdText: string) => {
    if (!cmdText.trim()) return;

    setIsLoading(true);
    const cleanedCmd = cmdText.toLowerCase().trim();

    setTimeout(() => {
      let output = '';
      const timestamp = new Date().toLocaleTimeString();

      switch (cleanedCmd) {
        case 'help':
          output = `Available command macros:\n  help              - Shows this administration guidelines sheet\n  ping              - Measure connection round-trip latency to device\n  get-diagnostics   - Fetch real-time hardware, temperature and active thread pools\n  docker ps         - Query executing micro-containers\n  optimize-ram      - Trigger garbage collectors and wipe idle process buffers\n  clear             - Flush terminal memory cache`;
          break;
        case 'ping':
          output = `PING ${device.ip} (${device.ip}): 56 data bytes\n64 bytes from ${device.ip}: icmp_seq=0 ttl=64 time=4.32 ms\n64 bytes from ${device.ip}: icmp_seq=1 ttl=64 time=3.81 ms\n64 bytes from ${device.ip}: icmp_seq=2 ttl=64 time=4.09 ms\n\n--- ${device.ip} ping statistics ---\n3 packets transmitted, 3 packets received, 0.0% packet loss\nrtt min/avg/max/mdev = 3.812/4.074/4.321/0.208 ms`;
          break;
        case 'get-diagnostics':
          output = `[HARDWARE DIAGNOSTICS - STATED AS HEALTHY]\n------------------------------------------\nCPU Idle Time: 88.4%\nThermal Junction Specs: Core 0: 42°C, Core 1: 44°C, Core 2: 41°C\nFan RPM Duty Cycle: 2,400 RPM (Quiet Profile)\nVirtualization Extension: Active (vTx Enabled)\nSSD Wear Out Indicator: 99.2% Remaining Life Cycle\nPrimary Port Health: USB-C Hub Controller Online, HDMI Sync Stable.`;
          break;
        case 'docker ps':
          output = `CONTAINER ID   IMAGE                 COMMAND                  CREATED         STATUS         PORTS\n9b12a83cf821   node:20-alpine        "docker-entrypoint.s…"   2 hours ago     Up 2 hours     3000/tcp\n2c22f001421a   postgres:16-alpine    "docker-entrypoint.s…"   4 hours ago     Up 4 hours     5432/tcp\nbf332da11234   redis:7-alpine        "docker-entrypoint.s…"   1 day ago       Up 1 day       6379/tcp`;
          break;
        case 'optimize-ram': {
          output = `[RAM OPTIMIZATION ROUTINE EXECUTING]\n-------------------------------------\n1. Flushing V8 / Core Engine cached heaps...\n2. Defragmenting page descriptors in physical segments...\n3. Reclaiming leaked swap handles.\n\nMemory Optimised! Freed up 4.12 GB of swap allocations.\nNew Active Buffer footprint reduced by 18.5%.`;
          device.memoryPercent = Math.max(15, device.memoryPercent - 12);
          break;
        }
        case 'clear':
          setHistory([]);
          setIsLoading(false);
          setInput('');
          return;
        default:
          output = `sh: command not found: '${cmdText}'. Type 'help' to examine available admin commands.`;
      }

      setHistory(prev => [...prev, { input: cmdText, output, timestamp }]);
      setIsLoading(false);
      setInput('');
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input);
    }
  };

  return (
    <div id="terminal-pane" className="bg-[#050607] border border-[#1a2228] rounded-xl overflow-hidden flex flex-col h-80 font-mono text-xs text-brand-cyan/95">
      {/* Terminal Title Bar */}
      <div className="bg-[#0b0f12] px-4 py-2 border-b border-[#1a2228] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] tracking-wider text-cyan-400 font-bold uppercase">SSH REMOTE SHELL</span>
        </div>
        <div className="flex items-center gap-1.5Packed">
          <span className="w-2 h-2 rounded-full bg-red-500 opacity-70"></span>
          <span className="w-2 h-2 rounded-full bg-yellow-500 opacity-70"></span>
          <span className="w-2 h-2 rounded-full bg-green-500 opacity-70"></span>
        </div>
      </div>

      {/* Terminal History Logs */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono selection:bg-cyan-500/30">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center text-gray-500 gap-1 select-none">
              <span className="text-cyan-400">admin@{device.name.toLowerCase()}</span>
              <span>$</span>
              <span className="text-white ml-1 font-medium">{item.input}</span>
              <span className="text-[9px] ml-auto font-sans opacity-50">{item.timestamp}</span>
            </div>
            <pre className="text-cyan-200/90 whitespace-pre-wrap pl-4 leading-relaxed font-mono">
              {item.output}
            </pre>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-cyan-400 font-mono animate-pulse pl-4">
            <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
            <span>Connecting stream & calculating telemetry diagnostic metrics...</span>
          </div>
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Quick Macros suggestions */}
      <div className="bg-[#080b0d] border-t border-[#1a2228] p-2 flex flex-wrap gap-1.5 select-none scrollbar-none overflow-x-auto">
        <span className="text-[9px] text-gray-500 uppercase flex items-center px-1 font-sans font-bold">Macros:</span>
        <button 
          onClick={() => runCommand('ping')}
          className="bg-[#0e141a] hover:bg-cyan-950 hover:text-white border border-cyan-900/40 text-cyan-400 rounded px-2 py-0.5 text-[10px] transition-all"
        >
          ping
        </button>
        <button 
          onClick={() => runCommand('get-diagnostics')}
          className="bg-[#0e141a] hover:bg-cyan-950 hover:text-white border border-cyan-900/40 text-cyan-400 rounded px-2 py-0.5 text-[10px] transition-all"
        >
          get-diagnostics
        </button>
        <button 
          onClick={() => runCommand('docker ps')}
          className="bg-[#0e141a] hover:bg-cyan-950 hover:text-white border border-cyan-900/40 text-cyan-400 rounded px-2 py-0.5 text-[10px] transition-all"
        >
          docker ps
        </button>
        <button 
          onClick={() => runCommand('optimize-ram')}
          className="bg-[#0e141a] hover:bg-cyan-950 hover:text-white border border-cyan-900/40 text-cyan-300 rounded px-2 py-0.5 text-[10px] transition-all flex items-center gap-1"
        >
          <Sparkles className="w-2.5 h-2.5" /> optimize-ram
        </button>
        <button 
          onClick={() => runCommand('clear')}
          className="bg-[#0e141a] hover:bg-red-950 hover:text-rose-200 border border-rose-950 text-rose-400 rounded px-2 py-0.5 text-[10px] transition-all ml-auto"
        >
          clear
        </button>
      </div>

      {/* Terminal Input Row */}
      <div className="bg-[#07090b] px-4 py-2 border-t border-[#1a2228] flex items-center gap-2 select-none">
        <span className="text-cyan-400 font-bold">admin@{device.name.toLowerCase()}:$</span>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type diagnostic command here (e.g. help)..."
          className="flex-1 bg-transparent border-none text-white focus:outline-none focus:ring-0 font-mono text-xs placeholder:text-gray-600"
          id="terminal-sys-input"
        />
        <button
          onClick={() => runCommand(input)}
          className="p-1 hover:bg-cyan-950/50 rounded text-cyan-400 border border-cyan-900/20 active:scale-95 transition-all"
          id="terminal-submit"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
