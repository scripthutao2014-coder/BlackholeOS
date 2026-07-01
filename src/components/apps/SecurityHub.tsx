import { useState } from 'react';
import { 
  ShieldCheck, EyeOff, Trash2, Key, RefreshCw, 
  Lock, ArrowRight, Server, ShieldAlert 
} from 'lucide-react';

interface SecurityHubProps {
  onClearSession: () => void;
  onLockSystem: () => void;
}

export default function SecurityHub({ onClearSession, onLockSystem }: SecurityHubProps) {
  const [activeTab, setActiveTab] = useState<'e2ee' | 'protection' | 'clearing'>('e2ee');
  const [sessionProtectionEnabled, setSessionProtectionEnabled] = useState(true);
  const [encryptionStandard, setEncryptionStandard] = useState<'AES-256-GCM' | 'ChaCha20-Poly1305'>('AES-250-GCM');
  const [isRefreshingKeys, setIsRefreshingKeys] = useState(false);
  const [publicKey, setPublicKey] = useState('0xBD59A3...7E1A2');
  const [privateKey, setPrivateKey] = useState('0x4002C9...88F11');

  const handleRotateKeys = () => {
    setIsRefreshingKeys(true);
    setTimeout(() => {
      const hexChars = '0123456789ABCDEF';
      let pub = '0x';
      let priv = '0x';
      for (let i = 0; i < 6; i++) {
        pub += hexChars[Math.floor(Math.random() * 16)];
        priv += hexChars[Math.floor(Math.random() * 16)];
      }
      pub += '...';
      priv += '...';
      for (let i = 0; i < 5; i++) {
        pub += hexChars[Math.floor(Math.random() * 16)];
        priv += hexChars[Math.floor(Math.random() * 16)];
      }
      setPublicKey(pub);
      setPrivateKey(priv);
      setIsRefreshingKeys(false);
    }, 1200);
  };

  const handleClearCache = () => {
    const doubleCheck = confirm('Warning: This will securely purge all BlackholeOS session storage parameters, virtual files, and reset appearance preferences. Proceed?');
    if (doubleCheck) {
      onClearSession();
    }
  };

  return (
    <div className="h-full w-full bg-slate-950/40 flex font-sans select-none overflow-hidden text-slate-300">
      {/* Sidebar Navigation */}
      <div className="w-48 bg-slate-900 border-r border-slate-800/85 p-3 flex flex-col gap-1.5 shrink-0">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-2.5">
          Security Core
        </span>

        <button
          onClick={() => setActiveTab('e2ee')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
            activeTab === 'e2ee' 
              ? 'bg-blue-600/15 text-blue-400 font-medium' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>E2E Concept Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('protection')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
            activeTab === 'protection' 
              ? 'bg-blue-600/15 text-blue-400 font-medium' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Session Shield</span>
        </button>

        <button
          onClick={() => setActiveTab('clearing')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
            activeTab === 'clearing' 
              ? 'bg-blue-600/15 text-blue-400 font-medium' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          <span>Purge & Lock</span>
        </button>
      </div>

      {/* Main Settings Panel */}
      <div className="flex-1 overflow-y-auto p-5 bg-[#060810] select-text">
        {activeTab === 'e2ee' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold font-display text-white">End-to-End Encryption (E2EE) Concept</h2>
              <p className="text-xs text-slate-400 mt-1">
                Visualizing how BlackholeOS packages, seals, and routes packet payloads securely to ExtinctionIBT communications.
              </p>
            </div>

            {/* Interactive flow chart */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl space-y-4">
              <span className="text-xs font-semibold text-white uppercase block tracking-wider text-center">
                Cryptographic Pipeline Node flow
              </span>

              <div className="grid grid-cols-5 items-center text-center gap-1.5 py-4 font-mono select-none">
                <div className="p-2 bg-slate-950 border border-slate-850 rounded-lg flex flex-col items-center">
                  <span className="text-[10px] text-blue-400">Node A</span>
                  <span className="text-[10px] text-white font-bold mt-1">SENDER</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">Plaintext</span>
                </div>

                <div className="flex justify-center text-blue-500">
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                </div>

                <div className="p-2 bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-500/30 rounded-lg flex flex-col items-center">
                  <span className="text-[10px] text-indigo-400">ENCRYPT</span>
                  <span className="text-[10px] text-white font-bold mt-1">CIPHERED</span>
                  <span className="text-[9px] text-emerald-400 mt-0.5">Hash Key</span>
                </div>

                <div className="flex justify-center text-blue-500">
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                </div>

                <div className="p-2 bg-slate-950 border border-slate-850 rounded-lg flex flex-col items-center">
                  <span className="text-[10px] text-blue-400">Node B</span>
                  <span className="text-[10px] text-white font-bold mt-1">RECEIVER</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">Decrypted</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pt-2">
                Under the ExtinctionIBT handshake, packets are wrapped in dynamic cryptographic layers before leaving your browser thread. This means that even if network lines are intercepted, the raw payload remains indistinguishable from static cosmic noise.
              </p>
            </div>

            {/* Keys generator */}
            <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-white">Local Crypto Keys (Derivation)</span>
                <button
                  onClick={handleRotateKeys}
                  disabled={isRefreshingKeys}
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 disabled:opacity-45"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingKeys ? 'animate-spin' : ''}`} />
                  Rotate Seed
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="bg-slate-950 p-2.5 rounded border border-slate-850">
                  <span className="text-slate-500 block text-[9px] uppercase">Quantum Public Key</span>
                  <span className="text-slate-300">{publicKey}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-850">
                  <span className="text-slate-500 block text-[9px] uppercase">Isolated Private Key</span>
                  <span className="text-slate-300">{privateKey}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'protection' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold font-display text-white">Session Shield Parameters</h2>
              <p className="text-xs text-slate-400 mt-1">Configure automated active protection rules for your ExtinctionIBT workspace.</p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-xl space-y-4">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Active Sandbox Leak Protection</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Mask input entries and disable third-party telemetry.</span>
                </div>
                <button
                  onClick={() => setSessionProtectionEnabled(!sessionProtectionEnabled)}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                    sessionProtectionEnabled ? 'bg-blue-600' : 'bg-slate-800'
                  }`}
                >
                  <div className={`w-4.5 h-4.5 bg-white rounded-full transition-transform ${
                    sessionProtectionEnabled ? 'translate-x-4.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="h-px bg-slate-800/60" />

              {/* Toggle 2 */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-white block">Symmetric Encryption Algorithm</span>
                <p className="text-[10px] text-slate-500 mb-2">Select the derivation layer applied to virtual notepad logs.</p>
                
                <div className="flex gap-3">
                  {['AES-256-GCM', 'ChaCha20-Poly1305'].map((std) => (
                    <button
                      key={std}
                      onClick={() => setEncryptionStandard(std as any)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        encryptionStandard === std
                          ? 'border-emerald-500 bg-emerald-500/10 text-white font-medium'
                          : 'border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      {std}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Shield warning */}
            <div className="p-4 rounded-xl border border-blue-500/15 bg-blue-500/5 flex gap-3">
              <Server className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <span className="font-bold text-white block mb-0.5">Hypervisor Isolation Guard</span>
                BlackholeOS intercepts frame communication events to prevent external CSS injections. Your local filesystem memory footprint is protected by strict web sandbox bounds.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clearing' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold font-display text-white">System Purge & Lock Controls</h2>
              <p className="text-xs text-slate-400 mt-1">Hard reset operations designed to erase trace caching instantly from host hardware.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Purge Card */}
              <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-400" />
                    Purge Local Sandbox
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                    Instantly wipes all system directories, virtual documents, modified usernames, and appearance configurations from browser memory storage.
                  </p>
                </div>
                <button
                  onClick={handleClearCache}
                  className="w-full mt-3 py-2 bg-red-600/15 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  Secure Purge Memory
                </button>
              </div>

              {/* Lock Card */}
              <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-400" />
                    Lock Session Immediately
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                    Instantly suspends the desktop environment, locks system folders, and forces a logout redirect back to the ExtinctionIBT Account Login portal.
                  </p>
                </div>
                <button
                  onClick={onLockSystem}
                  className="w-full mt-3 py-2 bg-blue-600/15 hover:bg-blue-600 border border-blue-500/30 text-blue-400 hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  Force Account Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
