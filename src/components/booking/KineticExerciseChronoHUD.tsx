import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Clock, 
  Dumbbell, 
  CheckCircle2, 
  X, 
  Maximize2, 
  Minimize2, 
  Zap, 
  Plus
} from 'lucide-react';
import { Exercise, ProgressLog, AccentTheme } from '../../types/fitness';

interface KineticExerciseChronoHUDProps {
  sessionTitle: string;
  category: string;
  coachName: string;
  exercises: Exercise[];
  totalSessionMinutes: number;
  userWeightKg?: number;
  bookingReference?: string;
  accentTheme?: AccentTheme;
  onClose: () => void;
  onSessionComplete: (log: Omit<ProgressLog, 'id'>) => void;
}

export const KineticExerciseChronoHUD: React.FC<KineticExerciseChronoHUDProps> = ({
  sessionTitle,
  category,
  coachName,
  exercises,
  totalSessionMinutes,
  userWeightKg = 78,
  bookingReference,
  accentTheme = 'AZURE',
  onClose,
  onSessionComplete,
}) => {
  // Session Timers
  const totalSessionSeconds = totalSessionMinutes * 60;
  const [sessionSecondsRemaining, setSessionSecondsRemaining] = useState(totalSessionSeconds);
  const [isSessionRunning, setIsSessionRunning] = useState(true);

  // Exercise and Interval States
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const currentExercise = exercises[currentExerciseIndex] || exercises[0];

  const totalSetsForCurrent = currentExercise.sets || 3;
  const [currentSetNumber, setCurrentSetNumber] = useState(1);
  const [completedSetsCount, setCompletedSetsCount] = useState(0);

  // Interval phase: 'WORK' or 'REST'
  const [intervalPhase, setIntervalPhase] = useState<'WORK' | 'REST'>('WORK');
  
  // Work and rest duration
  const workDurationSeconds = currentExercise.durationSec || 45;
  const restDurationSeconds = currentExercise.restSec || 60;

  const [intervalSecondsRemaining, setIntervalSecondsRemaining] = useState(workDurationSeconds);
  const [isIntervalRunning, setIsIntervalRunning] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Creative Metronome Cadence Phase: 'DOWN', 'HOLD', 'UP'
  const [tempoPhase, setTempoPhase] = useState<'DOWN' | 'HOLD' | 'UP'>('DOWN');
  const [tempoSeconds, setTempoSeconds] = useState(0);

  // Stats calculation: Workload and Remaining Matrix
  const totalSetsInEntireSession = exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const setsRemaining = Math.max(0, totalSetsInEntireSession - completedSetsCount);
  const exercisesRemaining = Math.max(0, exercises.length - (currentExerciseIndex + 1));
  
  // Reps remaining across whole workout
  const totalRepsEstimated = exercises.reduce((acc, ex) => {
    const r = typeof ex.reps === 'number' ? ex.reps : 10;
    return acc + (ex.sets * r);
  }, 0);
  const repsCompletedSoFar = Math.round((completedSetsCount / Math.max(1, totalSetsInEntireSession)) * totalRepsEstimated);
  const repsRemaining = Math.max(0, totalRepsEstimated - repsCompletedSoFar);

  // Dynamic Theme Styling for Light Mode
  const getThemeColors = () => {
    switch (accentTheme) {
      case 'SOLAR':
        return {
          primaryRing: '#ea580c',
          secondaryRing: '#d97706',
          accentGrad: 'from-orange-500 via-amber-500 to-rose-500',
          accentText: 'text-orange-700',
          accentBg: 'bg-orange-50 text-orange-800 border-orange-200',
          btnGrad: 'bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 text-white',
          glow: 'glow-solar'
        };
      case 'VIOLET':
        return {
          primaryRing: '#7c3aed',
          secondaryRing: '#db2777',
          accentGrad: 'from-violet-500 via-fuchsia-500 to-pink-500',
          accentText: 'text-violet-700',
          accentBg: 'bg-violet-50 text-violet-800 border-violet-200',
          btnGrad: 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white',
          glow: 'glow-violet'
        };
      case 'VOLT':
        return {
          primaryRing: '#059669',
          secondaryRing: '#16a34a',
          accentGrad: 'from-emerald-500 via-teal-500 to-cyan-500',
          accentText: 'text-emerald-700',
          accentBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          btnGrad: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
          glow: 'glow-volt'
        };
      case 'AZURE':
      default:
        return {
          primaryRing: '#0284c7',
          secondaryRing: '#0d9488',
          accentGrad: 'from-cyan-500 via-sky-500 to-teal-500',
          accentText: 'text-cyan-700',
          accentBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
          btnGrad: 'bg-gradient-to-r from-cyan-600 via-sky-600 to-teal-600 text-white',
          glow: 'glow-cyan'
        };
    }
  };

  const themeTokens = getThemeColors();

  // Audio Context for synthetic creative metronome ticks
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTone = (freq: number, durationSec: number = 0.15) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + durationSec);
      osc.start();
      osc.stop(ctx.currentTime + durationSec);
    } catch (e) {
      // Audio fallback
    }
  };

  // Main countdown tick
  useEffect(() => {
    let timer: any;
    if (isSessionRunning && sessionSecondsRemaining > 0) {
      timer = setInterval(() => {
        setSessionSecondsRemaining((prev) => Math.max(0, prev - 1));

        // Advance cadence metronome
        setTempoSeconds((s) => {
          const next = (s + 1) % 6;
          if (next === 0 || next === 1) setTempoPhase('DOWN');
          else if (next === 2) setTempoPhase('HOLD');
          else setTempoPhase('UP');
          return next;
        });

        if (isIntervalRunning) {
          setIntervalSecondsRemaining((prev) => {
            if (prev <= 1) {
              if (intervalPhase === 'WORK') {
                playTone(880, 0.35);
                setIntervalPhase('REST');
                return restDurationSeconds;
              } else {
                playTone(1100, 0.45);
                setIntervalPhase('WORK');
                if (currentSetNumber < totalSetsForCurrent) {
                  setCurrentSetNumber((s) => s + 1);
                } else if (currentExerciseIndex < exercises.length - 1) {
                  setCurrentExerciseIndex((i) => i + 1);
                  setCurrentSetNumber(1);
                }
                setCompletedSetsCount((c) => c + 1);
                return workDurationSeconds;
              }
            }

            if (prev <= 4 && prev > 1) {
              playTone(prev === 2 ? 750 : 600, 0.1);
            }

            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSessionRunning, isIntervalRunning, intervalPhase, currentSetNumber, currentExerciseIndex, exercises.length, totalSetsForCurrent, workDurationSeconds, restDurationSeconds]);

  // Handle Manual Set Completion
  const handleMarkSetCompleted = () => {
    setCompletedSetsCount((c) => c + 1);
    playTone(1024, 0.25);

    if (currentSetNumber < totalSetsForCurrent) {
      setIntervalPhase('REST');
      setIntervalSecondsRemaining(restDurationSeconds);
    } else if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((idx) => idx + 1);
      setCurrentSetNumber(1);
      setIntervalPhase('REST');
      setIntervalSecondsRemaining(restDurationSeconds);
    } else {
      handleFinishSession();
    }
  };

  const handleFinishSession = () => {
    const elapsedMinutes = Math.max(1, Math.round((totalSessionSeconds - sessionSecondsRemaining) / 60));
    const estimatedKcal = Math.round((7.5 * 3.5 * userWeightKg / 200.0) * elapsedMinutes * 1.15);

    onSessionComplete({
      memberId: 'usr-101',
      date: new Date().toISOString().split('T')[0],
      workoutTitle: sessionTitle,
      durationMinutes: elapsedMinutes,
      caloriesBurned: estimatedKcal,
      notes: `Live kinetic chrono session completed under supervision of ${coachName}. Remaining sets cleared with target cadence.`,
      perceivedEffort: 8,
      exercisesCompleted: exercises.map((ex) => ({
        exerciseName: ex.name,
        setsCompleted: ex.sets,
        repsCompleted: typeof ex.reps === 'number' ? ex.reps : 10
      }))
    });
  };

  // Format Helper
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Percentage Calculations for dual-ring HUD
  const sessionElapsed = totalSessionSeconds - sessionSecondsRemaining;
  const sessionPercent = Math.min(100, Math.round((sessionElapsed / totalSessionSeconds) * 100));

  const intervalMax = intervalPhase === 'WORK' ? workDurationSeconds : restDurationSeconds;
  const intervalPercent = Math.min(100, Math.round(((intervalMax - intervalSecondsRemaining) / intervalMax) * 100));

  // Dynamic SVG circle geometry
  const outerRadius = 110;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const outerStrokeDash = outerCircumference - (sessionPercent / 100) * outerCircumference;

  const innerRadius = 80;
  const innerCircumference = 2 * Math.PI * innerRadius;
  const innerStrokeDash = innerCircumference - (intervalPercent / 100) * innerCircumference;

  // Metabolic estimation
  const kcalBurnedSoFar = Math.round((7.0 * 3.5 * userWeightKg / 200.0) * (sessionElapsed / 60));
  const targetKcal = Math.round((7.0 * 3.5 * userWeightKg / 200.0) * totalSessionMinutes);
  const kcalRemaining = Math.max(0, targetKcal - kcalBurnedSoFar);

  return (
    <div className={`fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto ${
      isFullscreen ? 'p-0' : ''
    }`}>
      <div className={`bg-white border border-slate-200 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col ${
        isFullscreen ? 'h-full rounded-none max-w-none border-none' : 'max-h-[96vh]'
      }`}>
        
        {/* Top Creative HUD Bar */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-700 shadow-sm">
              <Zap className="w-5 h-5 text-cyan-600 fill-cyan-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-base tracking-tight">{sessionTitle}</span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
                  {category}
                </span>
                {bookingReference && (
                  <span className="hidden sm:inline text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Ref: {bookingReference}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-mono">
                <span>Coach: <strong className="text-slate-800">{coachName}</strong></span>
                <span>•</span>
                <span className="text-cyan-700 font-bold flex items-center gap-1">
                  DUAL-ORBIT CHRONO ACTIVE
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-2xl text-xs transition-all border ${
                soundEnabled 
                  ? 'bg-cyan-50 text-cyan-700 border-cyan-200 shadow-sm' 
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
              title={soundEnabled ? 'Mute Audio Beeps' : 'Enable Audio Beeps'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-600" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs transition-all hover:bg-slate-200"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Kinetic Cockpit */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-50/50">
          
          {/* Left Column: Live Dual-Orbit Radar Chrono */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-slate-200 relative overflow-hidden shadow-sm">
            
            {/* SVG Dual-Ring Radar */}
            <div className="relative w-76 h-76 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 260 260">
                {/* Outer Ring Track */}
                <circle
                  cx="130"
                  cy="130"
                  r={outerRadius}
                  className="stroke-slate-200"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Outer Ring Progress (Session Remaining Progress) */}
                <circle
                  cx="130"
                  cy="130"
                  r={outerRadius}
                  stroke={themeTokens.primaryRing}
                  className="transition-all duration-500 ease-linear"
                  strokeWidth="8"
                  strokeDasharray={outerCircumference}
                  strokeDashoffset={outerStrokeDash}
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Inner Ring Track */}
                <circle
                  cx="130"
                  cy="130"
                  r={innerRadius}
                  className="stroke-slate-100"
                  strokeWidth="11"
                  fill="none"
                />
                {/* Inner Ring Progress (Interval Countdown) */}
                <circle
                  cx="130"
                  cy="130"
                  r={innerRadius}
                  stroke={intervalPhase === 'WORK' ? (intervalSecondsRemaining <= 5 ? '#e11d48' : themeTokens.secondaryRing) : '#059669'}
                  className="transition-all duration-500 ease-linear"
                  strokeWidth="11"
                  strokeDasharray={innerCircumference}
                  strokeDashoffset={innerStrokeDash}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              {/* Central Chrono Readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full mb-1 font-mono border shadow-sm ${
                  intervalPhase === 'WORK'
                    ? 'bg-cyan-100 text-cyan-800 border-cyan-300 font-extrabold'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {intervalPhase === 'WORK' ? '⚡ WORK INTERVAL' : '🧘 RECOVERY REST'}
                </span>

                <div className="text-5xl sm:text-6xl font-black text-slate-900 font-mono tracking-tight tabular-nums">
                  {formatTime(intervalSecondsRemaining)}
                </div>

                <div className="text-[11px] text-slate-500 font-mono mt-1 font-semibold">
                  Interval Left of {intervalPhase === 'WORK' ? workDurationSeconds : restDurationSeconds}s
                </div>

                {/* Clear time left on entire session */}
                <div className="mt-2 text-xs font-bold text-cyan-800 font-mono flex items-center gap-1.5 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
                  <Clock className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Session Left: {formatTime(sessionSecondsRemaining)}</span>
                </div>
              </div>
            </div>

            {/* Creative Rep Cadence / Metronome Guidance */}
            <div className="w-full mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  tempoPhase === 'DOWN' ? 'bg-cyan-500 animate-pulse' : tempoPhase === 'HOLD' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <span className="text-slate-500 text-[11px]">Movement Tempo:</span>
              </div>
              <div className="font-extrabold text-slate-800 text-[11px]">
                {tempoPhase === 'DOWN' ? 'LOWER (2s)' : tempoPhase === 'HOLD' ? 'HOLD (1s)' : 'DRIVE UP (2s)'}
              </div>
            </div>

            {/* Interval Play / Pause / Quick Modifiers */}
            <div className="flex items-center gap-2 mt-4 z-10 w-full justify-center flex-wrap">
              <button
                onClick={() => setIsIntervalRunning(!isIntervalRunning)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white flex items-center gap-1.5 shadow-sm hover:bg-slate-800 transition-all"
              >
                {isIntervalRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isIntervalRunning ? 'Pause' : 'Resume'}</span>
              </button>

              <button
                onClick={() => setIntervalSecondsRemaining((prev) => prev + 15)}
                className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1"
                title="Add 15 seconds"
              >
                <Plus className="w-3 h-3" />
                <span>15s</span>
              </button>

              <button
                onClick={() => setIntervalSecondsRemaining(intervalPhase === 'WORK' ? workDurationSeconds : restDurationSeconds)}
                className="p-2 rounded-xl text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
                title="Restart Interval"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  const nextPhase = intervalPhase === 'WORK' ? 'REST' : 'WORK';
                  setIntervalPhase(nextPhase);
                  setIntervalSecondsRemaining(nextPhase === 'WORK' ? workDurationSeconds : restDurationSeconds);
                }}
                className="px-3 py-2 rounded-xl text-[11px] font-mono font-bold bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200"
              >
                Skip to {intervalPhase === 'WORK' ? 'Rest' : 'Work'}
              </button>
            </div>

            {/* Dual Ring Legend */}
            <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono mt-4 pt-3 border-t border-slate-100 w-full justify-center">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
                <span className="text-slate-700 font-bold">Inner: Interval</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                <span className="text-slate-700 font-bold">Outer: Session ({sessionPercent}%)</span>
              </div>
            </div>

          </div>

          {/* Right Column: Active Exercise Focus & Deficit Matrix */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Active Exercise Detail Card */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-700 uppercase tracking-wider">
                      Exercise {currentExerciseIndex + 1} of {exercises.length}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-mono font-bold border border-slate-200">
                      {currentExercise.muscleGroup}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mt-1.5">
                    {currentExercise.name}
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-base font-mono font-bold text-amber-700">
                    Set {currentSetNumber} of {totalSetsForCurrent}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    Target: {currentExercise.reps} reps
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 leading-relaxed">
                <strong className="text-slate-900">Form Execution: </strong>
                {currentExercise.instructions}
              </p>

              {/* Set Progression Interactive Tracker */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>Sets Progression for Current Exercise</span>
                  <span className="text-cyan-700 font-bold">{currentSetNumber}/{totalSetsForCurrent} active</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: totalSetsForCurrent }).map((_, i) => {
                    const setNum = i + 1;
                    const isDone = setNum < currentSetNumber;
                    const isCurrent = setNum === currentSetNumber;

                    return (
                      <div
                        key={setNum}
                        className={`p-3 rounded-2xl text-center border font-mono text-xs transition-all ${
                          isDone
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm'
                            : isCurrent
                            ? 'bg-cyan-50 text-cyan-900 border-cyan-400 ring-2 ring-cyan-200 font-black'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        <div className="text-[10px] text-slate-500">SET #{setNum}</div>
                        <div className="font-extrabold flex items-center justify-center gap-1 mt-0.5">
                          {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : `${currentExercise.reps}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA to complete current set */}
              <button
                onClick={handleMarkSetCompleted}
                className={`w-full py-3.5 ${themeTokens.btnGrad} font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm hover:brightness-105`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Complete Set #{currentSetNumber} & Trigger Rest Interval</span>
              </button>
            </div>

            {/* Creative Exercise Deficit & Workload Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              
              {/* Exercises Remaining */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Exercises Left</span>
                <div className="text-2xl font-black text-slate-900">{exercisesRemaining}</div>
                <span className="text-[10px] text-slate-500 font-sans">{exercises.length} total in routine</span>
              </div>

              {/* Sets Remaining */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Sets Remaining</span>
                <div className="text-2xl font-black text-cyan-700">{setsRemaining}</div>
                <span className="text-[10px] text-slate-500 font-sans">Across whole session</span>
              </div>

              {/* Reps Remaining */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Reps Remaining</span>
                <div className="text-2xl font-black text-amber-700">{repsRemaining}</div>
                <span className="text-[10px] text-slate-500 font-sans">~{repsCompletedSoFar} reps done</span>
              </div>

              {/* Caloric Deficit / Target Left */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Kcal Burn Left</span>
                <div className="text-2xl font-black text-rose-700">{kcalRemaining}</div>
                <span className="text-[10px] text-slate-500 font-sans">{kcalBurnedSoFar} burned so far</span>
              </div>
            </div>

            {/* Upcoming Exercises Sequence Preview */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-mono">
                Routine Sequence & Remaining Workload
              </span>
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {exercises.map((ex, idx) => {
                  const isCurrent = idx === currentExerciseIndex;
                  const isDone = idx < currentExerciseIndex;

                  return (
                    <div
                      key={ex.id}
                      onClick={() => {
                        setCurrentExerciseIndex(idx);
                        setCurrentSetNumber(1);
                        setIntervalPhase('WORK');
                        setIntervalSecondsRemaining(ex.durationSec || 45);
                      }}
                      className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between text-xs transition-all ${
                        isCurrent
                          ? 'bg-cyan-50 border border-cyan-300 text-cyan-900 font-bold'
                          : isDone
                          ? 'bg-slate-50 text-slate-400 line-through'
                          : 'bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-slate-400 text-[10px]">#{idx + 1}</span>
                        <span className="font-semibold truncate">{ex.name}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 shrink-0">
                        <span>{ex.sets} sets × {ex.reps}</span>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Finish session CTA */}
            <div className="flex justify-end pt-1">
              <button
                onClick={handleFinishSession}
                className="px-5 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-bold rounded-2xl border border-slate-200 transition-all"
              >
                End Session Early & Log Results
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
