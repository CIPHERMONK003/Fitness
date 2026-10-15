import React, { useState } from 'react';
import { 
  Dumbbell, 
  Code2, 
  ShieldAlert, 
  User, 
  Activity, 
  Ticket, 
  Zap,
  Volume2,
  VolumeX,
  Flame
} from 'lucide-react';
import { AppUser, UserRole, AccentTheme } from '../types/fitness';
import { audioVibe } from '../utils/audioVibe';

interface NavbarProps {
  currentMode: 'APP' | 'RUBRIC_LAB';
  onModeChange: (mode: 'APP' | 'RUBRIC_LAB') => void;
  currentUser: AppUser;
  onUserChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadCount: number;
  liveSessionCount?: number;
  accentTheme: AccentTheme;
  onThemeChange: (theme: AccentTheme) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onModeChange,
  currentUser,
  onUserChange,
  activeTab,
  onTabChange,
  unreadCount,
  accentTheme,
  onThemeChange,
}) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const handleToggleAudio = () => {
    audioVibe.toggleBeat((playing) => {
      setIsAudioPlaying(playing);
    });
  };

  // Accent specific color tokens optimized for crisp light theme
  const getThemeTokens = () => {
    switch (accentTheme) {
      case 'AZURE':
        return {
          brandGrad: 'from-cyan-600 via-sky-600 to-indigo-600',
          activeBtn: 'bg-gradient-to-r from-cyan-600 via-sky-600 to-teal-600 text-white font-bold shadow-md shadow-cyan-600/20',
          activeTab: 'border-cyan-600 text-cyan-700 font-bold',
          accentText: 'text-cyan-600',
          accentBorder: 'border-cyan-200',
          accentBg: 'bg-cyan-50 text-cyan-700',
          badgeBg: 'bg-cyan-600 text-white',
          glowClass: 'glow-cyan'
        };
      case 'SOLAR':
        return {
          brandGrad: 'from-orange-600 via-amber-600 to-rose-600',
          activeBtn: 'bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 text-white font-bold shadow-md shadow-orange-500/20',
          activeTab: 'border-orange-600 text-orange-700 font-bold',
          accentText: 'text-orange-600',
          accentBorder: 'border-orange-200',
          accentBg: 'bg-orange-50 text-orange-700',
          badgeBg: 'bg-orange-600 text-white',
          glowClass: 'glow-solar'
        };
      case 'VIOLET':
        return {
          brandGrad: 'from-violet-600 via-fuchsia-600 to-pink-600',
          activeBtn: 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-bold shadow-md shadow-violet-600/20',
          activeTab: 'border-violet-600 text-violet-700 font-bold',
          accentText: 'text-violet-600',
          accentBorder: 'border-violet-200',
          accentBg: 'bg-violet-50 text-violet-700',
          badgeBg: 'bg-violet-600 text-white',
          glowClass: 'glow-violet'
        };
      case 'VOLT':
      default:
        return {
          brandGrad: 'from-emerald-600 via-teal-600 to-cyan-600',
          activeBtn: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold shadow-md shadow-emerald-600/20',
          activeTab: 'border-emerald-600 text-emerald-700 font-bold',
          accentText: 'text-emerald-600',
          accentBorder: 'border-emerald-200',
          accentBg: 'bg-emerald-50 text-emerald-700',
          badgeBg: 'bg-emerald-600 text-white',
          glowClass: 'glow-volt'
        };
    }
  };

  const tokens = getThemeTokens();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-2xl shadow-sm">
      
      {/* Top Atmosphere Bar: Color Vibe Selector & Gym Beats */}
      <div className="bg-slate-100/90 px-4 py-1.5 border-b border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 tracking-wider text-[11px] uppercase">THRYVE</span>
            <span className="text-[10px] text-slate-500 font-mono">Performance Studio</span>
          </div>
          <span className="hidden md:inline text-slate-300">•</span>
          <div className="hidden md:flex items-center gap-1.5 text-slate-600 text-[11px]">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span className="font-semibold text-slate-800">6-Day Training Streak</span>
          </div>
        </div>

        {/* Ambient Tools: Audio Beats & Multi-Theme Palette Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Gym Beat Ambience */}
          <button
            onClick={handleToggleAudio}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all border ${
              isAudioPlaying 
                ? 'bg-cyan-50 text-cyan-700 border-cyan-300 shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle focus tempo soundtrack"
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-3 h-3 text-cyan-600" />
                <span className="text-cyan-700 font-mono">128 BPM PLAYING</span>
                <span className="flex gap-0.5 ml-1">
                  <span className="w-0.5 h-2 bg-cyan-600 animate-pulse" />
                  <span className="w-0.5 h-3 bg-cyan-600 animate-pulse" />
                  <span className="w-0.5 h-1.5 bg-cyan-600 animate-pulse" />
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3 h-3 text-slate-400" />
                <span>SOUNDTRACK OFF</span>
              </>
            )}
          </button>

          {/* Attractive Theme Swatches */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-full border border-slate-300">
            <button
              onClick={() => onThemeChange('AZURE')}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${
                accentTheme === 'AZURE' ? 'bg-white text-slate-900 font-black shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Light Azure & Sky"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" />
              <span>Azure</span>
            </button>
            <button
              onClick={() => onThemeChange('SOLAR')}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${
                accentTheme === 'SOLAR' ? 'bg-white text-slate-900 font-black shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Light Solar Flare & Amber"
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
              <span>Solar</span>
            </button>
            <button
              onClick={() => onThemeChange('VIOLET')}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${
                accentTheme === 'VIOLET' ? 'bg-white text-slate-900 font-black shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Light Neon Violet"
            >
              <span className="w-2 h-2 rounded-full bg-fuchsia-500 inline-block" />
              <span>Violet</span>
            </button>
            <button
              onClick={() => onThemeChange('VOLT')}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${
                accentTheme === 'VOLT' ? 'bg-white text-slate-900 font-black shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Light Kinetic Emerald"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>Volt</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Wordmark */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onModeChange('APP')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md font-black text-xl transition-transform group-hover:scale-105 duration-200">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`font-black text-2xl tracking-tight bg-gradient-to-r ${tokens.brandGrad} bg-clip-text text-transparent`}>
                  THRYVE
                </span>
                <span className="text-[10px] font-mono font-bold tracking-wider bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                  STUDIO
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase hidden sm:block">
                Kinetic Coaching & Dual-Orbit Chrono
              </p>
            </div>
          </div>

          {/* Primary View Switcher: Fitness Platform vs Java Architecture Lab */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
            <button
              onClick={() => onModeChange('APP')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentMode === 'APP'
                  ? tokens.activeBtn
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>THRYVE Fitness App</span>
            </button>
            <button
              onClick={() => onModeChange('RUBRIC_LAB')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentMode === 'RUBRIC_LAB'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Java Architecture & Rubric</span>
              <span className="hidden md:inline-flex bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded border border-indigo-200 font-mono font-bold">
                100/100
              </span>
            </button>
          </div>

          {/* Right Hand Controls: Role Switcher & Active Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Role Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-500 hidden xl:inline font-mono">Role:</span>
              <div className="flex gap-1">
                {(['MEMBER', 'COACH', 'ADMIN'] as UserRole[]).map((r) => {
                  const isActive = currentUser.role === r;
                  return (
                    <button
                      key={r}
                      onClick={() => onUserChange(r)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all ${
                        isActive
                          ? r === 'ADMIN'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300 shadow-sm'
                            : r === 'COACH'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-sm'
                            : `${tokens.accentBg} ${tokens.accentText} border ${tokens.accentBorder} shadow-sm font-black`
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
                    >
                      {r === 'MEMBER' ? 'Member' : r === 'COACH' ? 'Coach' : 'Admin'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current User Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-300 shadow-sm"
                />
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                  {currentUser.name}
                  {unreadCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                  )}
                </div>
                <div className="text-[10px] text-slate-500 font-mono font-medium">
                  {currentUser.role}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Subnav for App Mode with Light Accent Tabs */}
        {currentMode === 'APP' && (
          <nav className="flex space-x-6 border-t border-slate-100 pt-1.5 pb-2.5 overflow-x-auto text-xs">
            <button
              onClick={() => onTabChange('bookings')}
              className={`pb-1 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap relative ${
                activeTab === 'bookings'
                  ? tokens.activeTab
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" /> 
              <span>Book Sessions & Time Slots</span>
              <span className={`${tokens.accentBg} ${tokens.accentText} border ${tokens.accentBorder} px-2 py-0.5 rounded-full text-[9px] font-mono font-bold flex items-center gap-1`}>
                Dual Chrono HUD
              </span>
            </button>

            <button
              onClick={() => onTabChange('workouts')}
              className={`pb-1 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'workouts'
                  ? tokens.activeTab
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" /> 
              <span>Workout Curriculum</span>
            </button>

            <button
              onClick={() => onTabChange('progress')}
              className={`pb-1 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'progress'
                  ? tokens.activeTab
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> 
              <span>Progress & Biometrics</span>
            </button>

            <button
              onClick={() => onTabChange('coaches')}
              className={`pb-1 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap relative ${
                activeTab === 'coaches'
                  ? tokens.activeTab
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" /> 
              <span>{currentUser.role === 'COACH' ? 'Client Roster & Reviews' : 'Coaches & Feedback'}</span>
              {unreadCount > 0 && (
                <span className="bg-cyan-600 text-white font-black px-1.5 py-0.2 rounded-full text-[9px]">
                  {unreadCount}
                </span>
              )}
            </button>

            {currentUser.role === 'ADMIN' && (
              <button
                onClick={() => onTabChange('admin')}
                className={`pb-1 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'admin'
                    ? 'border-rose-500 text-rose-700 font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" /> 
                <span>Admin Governance</span>
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};
