import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Mail, Lock, ShieldCheck, Check, ArrowRight, 
  ChevronDown, ShieldAlert, Sparkles, AlertCircle 
} from 'lucide-react';

interface OOBESetupProps {
  key?: string;
  onComplete: (setupData: {
    country: string;
    email: string;
    username: string;
    passwordInput: string;
  }) => void;
}

const COUNTRIES = [
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
];

const TOS_CLAUSES = [
  { title: "1. Gravitational Memory Compression Protocol", content: "By utilizing BlackholeOS, you consent to our automated singularity compression engine. Unused RAM footprint is crushed into high-density virtual packets to sustain operation on low-end hardware without memory leaks." },
  { title: "2. Event Horizon Data Boundary Restriction", content: "Any files saved within the virtual workspace (S: drive) are locked within the sandbox isolation. Due to strong gravitational forces, this data cannot be emitted to the physical host without explicit download operations." },
  { title: "3. Black Anomaly Duck (B.A.D) Mascot Adherence", content: "The Black Anomaly Duck is the official mascot and supreme protector of BlackholeOS. Users must respect the quack. Mockery of the mascot's small dimensions or high density is strictly prohibited in all chat frequencies." },
  { title: "4. Quantum-Entangled Communication Consent", content: "The Secure ChatApp establishes a remote terminal handshake with ExtinctionIBT communication relays. This connection is end-to-end encrypted; however, the user accepts risks associated with deep-space interstellar noise and electromagnetic interference." },
  { title: "5. Time Dilation & Chronological Waiver", content: "We are not responsible for time dilation occurring during intensive CPU calculations. Operating near the BlackholeOS desktop environment may lead to perceived delays in real-world time progression." },
  { title: "6. Vacuum Decay Security Standards", content: "The Security Hub application is authorized to trigger absolute storage purges upon detection of suspicious hypervisor tampering. The user holds zero liability claims for spaghettified user directories." },
  { title: "7. Dark Energy Grid Interoperability", content: "The user agrees that background canvas animations will render at high frame rates utilizing local GPU cycles. This process leverages system dark energy resources to maintain smooth window drag performance." },
  { title: "8. Multiverse Data Residency Agreement", content: "Your sandbox profile may be synchronized through quantum state entanglement across multiple alternate timelines. Data remains strictly localized within your active browser instance unless cosmic alignment fails." },
  { title: "9. Antimatter Power-Grid Disruption", content: "Should the user environment experience sudden antimatter battery decay or power blackout, BlackholeOS attempts auto-restoration of the S: directory using volatile cached memories. Complete recovery is not guaranteed." },
  { title: "10. Wormhole Routing Liability", content: "The holeBrowser routes outbound web traffic through secure quantum-entangled proxy tunnels. We are not responsible if traffic takes a detour through a wormhole in the Andromeda Galaxy." },
  { title: "11. Cosmic Background Noise Waiver", content: "Minor rendering artifacts may occur during periods of high solar flare activity. The user agrees not to complain about pixel scintillation in the outer desktop padding." },
  { title: "12. Supernova Force Majeure", content: "In the event of a nearby stellar explosion, all service level agreements are instantly voided. Our cloud run containers will attempt emergency thruster escape." },
  { title: "13. Singularity Integrity Guarantee", content: "We guarantee that the central singularity of our wallpaper canvas background will remain stable and will not expand to consume your physical screen or browser tab." },
  { title: "14. Dyson Sphere Power Allocations", content: "Your browser allocation is powered by virtual Dyson Sphere nodes. Sharing power credits with non-compliant host operating systems is classified as an infraction of galactic workspace rules." },
  { title: "15. Planetary Orbit Synchronization", content: "System clock updates are synchronized with atomic clocks on Earth as well as Martian exploration relay nodes. Discrepancies of up to 4 milliseconds are within acceptable orbital tolerances." },
  { title: "16. Teleportation of Volatile Storage", content: "Should the user execute an 'Emergency Exit' command, all secure directories are instantly teletransported into the black hole core, making them completely unrecoverable across all universal vectors." }
];

export default function OOBESetup({ onComplete }: OOBESetupProps) {
  const [step, setStep] = useState<'welcome' | 'country' | 'email' | 'password' | 'tos' | 'complete'>('welcome');
  
  // Setup fields state
  const [selectedCountry, setSelectedCountry] = useState('Indonesia');
  const [emailInput, setEmailInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('ibt_guest');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  
  // Validation errors
  const [error, setError] = useState('');
  
  // ToS scroll state
  const [hasReadToS, setHasReadToS] = useState(false);
  const [tosChecked, setTosChecked] = useState(false);

  const handleNext = () => {
    setError('');
    
    if (step === 'welcome') {
      setStep('country');
    } else if (step === 'country') {
      setStep('email');
    } else if (step === 'email') {
      const trimmedEmail = emailInput.trim();
      const trimmedUsername = usernameInput.trim();
      if (!trimmedEmail) {
        setError('Email address is required!');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
        setError('Please enter a valid email address!');
        return;
      }
      if (!trimmedUsername) {
        setError('Username ID is required!');
        return;
      }
      setStep('password');
    } else if (step === 'password') {
      if (passwordInput.length < 6) {
        setError('Kata sandi harus minimal 6 karakter!');
        return;
      }
      if (passwordInput !== confirmPasswordInput) {
        setError('Konfirmasi kata sandi tidak cocok!');
        return;
      }
      setStep('tos');
    } else if (step === 'tos') {
      if (!tosChecked) {
        setError('Anda harus menyetujui syarat & ketentuan untuk melanjutkan!');
        return;
      }
      setStep('complete');
    } else if (step === 'complete') {
      onComplete({
        country: selectedCountry,
        email: emailInput,
        username: usernameInput,
        passwordInput: passwordInput,
      });
    }
  };

  const handleBack = () => {
    setError('');
    if (step === 'country') setStep('welcome');
    else if (step === 'email') setStep('country');
    else if (step === 'password') setStep('email');
    else if (step === 'tos') setStep('password');
  };

  const handleTosScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 40) {
      setHasReadToS(true);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#010103] z-[100] select-text overflow-hidden">
      {/* Dynamic background styling */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-radial from-emerald-950/20 via-transparent to-transparent pointer-events-none filter blur-3xl animate-pulse" />
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-radial from-blue-950/15 via-transparent to-transparent pointer-events-none filter blur-3xl" />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 w-full max-w-lg mx-4 bg-slate-950/85 border border-slate-850/90 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Top Progress indicator */}
          {step !== 'welcome' && step !== 'complete' && (
            <div className="flex gap-1.5 w-full justify-center mb-6">
              {['country', 'email', 'password', 'tos'].map((s, idx) => {
                const steps = ['country', 'email', 'password', 'tos'];
                const activeIdx = steps.indexOf(step);
                return (
                  <div 
                    key={s} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx <= activeIdx ? 'bg-emerald-500 w-8' : 'bg-slate-800 w-4'
                    }`} 
                  />
                );
              })}
            </div>
          )}

          {/* Error alert wrapper */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3.5 bg-red-950/55 border border-red-500/20 rounded-xl text-xs text-red-400 font-mono flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* STEP 1: WELCOME SCREEN */}
          {step === 'welcome' && (
            <div className="text-center space-y-6 py-6">
              {/* Spinning singularity loader */}
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-dashed border-t-emerald-400 border-b-blue-500 rounded-full animate-spin duration-3000" />
                <div className="absolute inset-2 border border-emerald-500/10 border-l-emerald-400 rounded-full animate-spin duration-1000" />
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold font-display text-white uppercase tracking-wider">
                  BlackholeOS Setup
                </h1>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  Selamat datang di sub-system sandbox node. Mari konfigurasikan akun aman Anda terlebih dahulu sebelum memulai.
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/60 border border-slate-850 rounded-2xl text-[11px] font-mono text-slate-500 max-w-xs mx-auto text-center space-y-1">
                <div>Model: BlackholeOS Kernel v1.0.0</div>
                <div>Isolation Mode: Secured & Insulated</div>
              </div>

              <button
                onClick={handleNext}
                className="w-full max-w-xs mx-auto py-3.5 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-semibold rounded-2xl text-xs tracking-wider uppercase shadow-xl shadow-emerald-950/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: COUNTRY SETTING */}
          {step === 'country' && (
            <div className="space-y-5 flex-1 flex flex-col overflow-hidden">
              <div className="text-left space-y-1.5">
                <h2 className="text-lg font-bold font-display text-white">Pilih Negara / Wilayah</h2>
                <p className="text-xs text-slate-400">Konfigurasikan setelan regional sub-system Anda.</p>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[45vh] scrollbar-thin">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setSelectedCountry(c.name)}
                    className={`w-full p-4 rounded-2xl flex items-center justify-between border transition-all text-left cursor-pointer ${
                      selectedCountry === c.name 
                        ? 'bg-emerald-950/30 border-emerald-500/55 text-white shadow-lg shadow-emerald-950/10' 
                        : 'bg-slate-900/30 border-slate-850 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-xl">{c.flag}</span>
                      <span className="text-xs font-semibold">{c.name}</span>
                    </div>
                    {selectedCountry === c.name && (
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-slate-950 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t border-slate-900 shrink-0">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 border border-slate-800 text-slate-400 hover:bg-slate-900 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center"
                >
                  Kembali
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <span>Lanjut</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: EMAIL & USERNAME INPUT */}
          {step === 'email' && (
            <div className="space-y-6 flex-1 flex flex-col shrink-0">
              <div className="text-left space-y-1.5">
                <h2 className="text-lg font-bold font-display text-white">Akun & Kredensial</h2>
                <p className="text-xs text-slate-400">Masukkan alamat email aktif dan tentukan Username ID Anda.</p>
              </div>

              <div className="space-y-4">
                {/* Email Address */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Alamat Email (Tanpa verifikasi OTP)
                  </label>
                  <div className="bg-slate-950/80 border border-slate-850 focus-within:border-emerald-500/40 rounded-xl px-4 py-3 flex items-center gap-3 transition-all">
                    <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="nama_anda@domain.com"
                      className="bg-transparent text-xs text-slate-200 outline-none w-full font-mono placeholder-slate-700"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Username ID */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Username ID (Node Name)
                  </label>
                  <div className="bg-slate-950/80 border border-slate-850 focus-within:border-emerald-500/40 rounded-xl px-4 py-3 flex items-center gap-3 transition-all">
                    <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="ibt_guest"
                      className="bg-transparent text-xs text-slate-200 outline-none w-full font-mono placeholder-slate-700"
                    />
                  </div>
                  <span className="text-[9px] text-slate-600 font-mono block pl-1">ID ini akan digunakan untuk sesi komunikasi ChatApp.</span>
                </div>
              </div>

              <div className="flex gap-3 mt-auto pt-4 border-t border-slate-900 shrink-0">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 border border-slate-800 text-slate-400 hover:bg-slate-900 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Lanjut</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PASSWORD SETUP */}
          {step === 'password' && (
            <div className="space-y-6 flex-1 flex flex-col shrink-0">
              <div className="text-left space-y-1.5">
                <h2 className="text-lg font-bold font-display text-white">Atur Kata Sandi</h2>
                <p className="text-xs text-slate-400">Proteksi sandi enkripsi lokal untuk mengunci sub-system Anda.</p>
              </div>

              <div className="space-y-4">
                {/* New Password */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Kata Sandi Baru
                  </label>
                  <div className="bg-slate-950/80 border border-slate-850 focus-within:border-emerald-500/40 rounded-xl px-4 py-3 flex items-center gap-3 transition-all">
                    <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="bg-transparent text-xs text-slate-200 outline-none w-full font-mono placeholder-slate-700"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Konfirmasi Kata Sandi
                  </label>
                  <div className="bg-slate-950/80 border border-slate-850 focus-within:border-emerald-500/40 rounded-xl px-4 py-3 flex items-center gap-3 transition-all">
                    <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      type="password"
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      placeholder="Ulangi kata sandi"
                      className="bg-transparent text-xs text-slate-200 outline-none w-full font-mono placeholder-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-auto pt-4 border-t border-slate-900 shrink-0">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 border border-slate-800 text-slate-400 hover:bg-slate-900 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Lanjut</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: TERMS OF SERVICE (BANYAK BANGET ToS) */}
          {step === 'tos' && (
            <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
              <div className="text-left space-y-1 shrink-0">
                <h2 className="text-lg font-bold font-display text-white">Syarat & Ketentuan Layanan (ToS)</h2>
                <p className="text-xs text-slate-400">Silakan scroll ke bawah untuk membaca seluruh kesepakatan.</p>
              </div>

              {/* Scrollable massive ToS text area */}
              <div 
                onScroll={handleTosScroll}
                className="flex-1 overflow-y-auto bg-slate-950 border border-slate-900 rounded-2xl p-4 space-y-5 text-[11px] font-sans leading-relaxed text-slate-400 max-h-[36vh] scrollbar-thin"
              >
                <div className="border-b border-slate-900 pb-3 mb-2 text-center text-[10px] font-mono text-emerald-500 uppercase tracking-widest">
                  *** AMANAH PROTOKOL SINGULARITAS BLACKHOLEOS ***
                </div>

                {TOS_CLAUSES.map((clause, idx) => (
                  <div key={idx} className="space-y-1">
                    <h4 className="font-semibold text-slate-200 font-mono text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {clause.title}
                    </h4>
                    <p className="pl-3 text-slate-400">{clause.content}</p>
                  </div>
                ))}
                
                <div className="text-center pt-4 text-slate-600 font-mono text-[9px]">
                  --- END OF DOCUMENT (VERSION 1.0.0 COMPLIANT) ---
                </div>
              </div>

              {/* ToS checkbox */}
              <div className="pt-2 shrink-0">
                <label 
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                    tosChecked 
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300' 
                      : 'bg-slate-900/20 border-slate-900 text-slate-500 hover:border-slate-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={tosChecked}
                    onChange={(e) => setTosChecked(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-850 mt-0.5 cursor-pointer"
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-slate-300 block">Saya Menyetujui Seluruh Syarat & Ketentuan</span>
                    <span className="text-[10px] font-mono text-slate-500 block">Saya telah membaca seluruh 16 klausul Singularitas OS secara detail.</span>
                  </div>
                </label>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-900 shrink-0">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 border border-slate-800 text-slate-400 hover:bg-slate-900 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Lanjut</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: COMPLETE SCREEN */}
          {step === 'complete' && (
            <div className="text-center space-y-6 py-6 shrink-0">
              {/* Spinning singularity success loader */}
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin duration-1500" />
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold font-display text-white uppercase tracking-wider">
                  Setup Selesai!
                </h2>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Akun sub-system aman Anda telah berhasil dibuat. Anda sekarang siap masuk ke BlackholeOS Sandbox Isolation Hypervisor.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl max-w-sm mx-auto space-y-2 text-left font-mono text-[10.5px]">
                <div className="flex justify-between border-b border-slate-900/60 pb-1.5">
                  <span className="text-slate-500">USERNAME ID:</span>
                  <span className="text-emerald-400 font-bold">{usernameInput}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900/60 pb-1.5">
                  <span className="text-slate-500">COUNTRY ADAPTER:</span>
                  <span className="text-slate-300">{selectedCountry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">EMAIL REGISTERED:</span>
                  <span className="text-slate-300 truncate max-w-[180px]">{emailInput}</span>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full max-w-xs mx-auto py-3.5 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-semibold rounded-2xl text-xs tracking-wider uppercase shadow-xl shadow-emerald-950/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Masuk ke Desktop</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
