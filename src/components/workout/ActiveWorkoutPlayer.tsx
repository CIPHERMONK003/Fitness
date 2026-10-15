import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  Flame, 
  Clock, 
  Dumbbell, 
  X, 
  ArrowRight
} from 'lucide-react';
import { WorkoutPlan, ProgressLog } from '../../types/fitness';

interface ActiveWorkoutPlayerProps {
  plan: WorkoutPlan;
  userWeightKg: number;
  onClose: () => void;
  onFinishWorkout: (log: Omit<ProgressLog, 'id'>) => void;
}

export const ActiveWorkoutPlayer: React.FC<ActiveWorkoutPlayerProps> = ({
  plan,
  userWeightKg,
  onClose,
  onFinishWorkout,
}) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<number, number[]>>({}); // exerciseIndex -> array of set numbers completed
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Rest Timer
  const currentExercise = plan.exercises[currentExerciseIndex] || plan.exercises[0];
  const [restSecondsLeft, setRestSecondsLeft] = useState(0);
  const [isResting, setIsResting] = useState(false);

  // User input tracking
  const [weightsLifted, setWeightsLifted] = useState<Record<string, number>>({});
  const [perceivedEffort, setPerceivedEffort] = useState(8);
  const [sessionNotes, setSessionNotes] = useState('');

  // Main session stopwatch
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Rest timer countdown
  useEffect(() => {
    let restInterval: any;
    if (isResting && restSecondsLeft > 0) {
      restInterval = setInterval(() => {
        setRestSecondsLeft((prev) => {
          if (prev <= 1) {
            playBeep();
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(restInterval);
  }, [isResting, restSecondsLeft]);

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Audio fallback
    }
  };

  const handleCompleteSet = (setNumber: number) => {
    const prevDone = completedSets[currentExerciseIndex] || [];
    let updated: number[];
    if (prevDone.includes(setNumber)) {
      updated = prevDone.filter((s) => s !== setNumber);
    } else {
      updated = [...prevDone, setNumber];
      // Trigger rest timer
      setRestSecondsLeft(currentExercise.restSec || 60);
      setIsResting(true);
      playBeep();
    }
    setCompletedSets({
      ...completedSets,
      [currentExerciseIndex]: updated,
    });
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < plan.exercises.length - 1) {
      setIsResting(false);
      setCurrentExerciseIndex((prev) => prev + 1);
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setIsResting(false);
      setCurrentExerciseIndex((prev) => prev - 1);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const calculateEstimatedCalories = () => {
    const mins = Math.max(1, Math.round(elapsedSeconds / 60));
    return Math.round((5.0 * 3.5 * userWeightKg / 200.0) * mins);
  };

  const handleFinish = () => {
    const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    const caloriesBurned = calculateEstimatedCalories();

    const exercisesCompleted = plan.exercises.map((ex, idx) => {
      const setsCount = (completedSets[idx] || []).length;
      return {
        exerciseName: ex.name,
        setsCompleted: setsCount,
        topWeightKg: weightsLifted[ex.id] || undefined,
        repsCompleted: typeof ex.reps === 'number' ? ex.reps : parseInt(String(ex.reps).split('-')[0]) || 10,
      };
    });

    onFinishWorkout({
      memberId: 'usr-101',
      date: new Date().toISOString().split('T')[0],
      workoutPlanId: plan.id,
      workoutTitle: plan.title,
      durationMinutes,
      caloriesBurned,
      notes: sessionNotes || `Completed ${plan.exercises.length} exercises from ${plan.title}. Solid execution.`,
      perceivedEffort,
      exercisesCompleted,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-cyan-600 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">{plan.title}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-200 font-mono font-bold">
                  {plan.category}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Exercise {currentExerciseIndex + 1} of {plan.exercises.length}: <strong className="text-slate-800">{currentExercise.name}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Session Stopwatch */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-mono font-bold text-cyan-700 shadow-sm">
              <Clock className="w-4 h-4 text-cyan-600" />
              <span>{formatTime(elapsedSeconds)}</span>
              <button 
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="text-slate-400 hover:text-slate-700 ml-1"
                title={isTimerRunning ? 'Pause Session' : 'Resume Session'}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto flex-1 bg-white">
          
          {/* Main Exercise Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 font-mono">
                    Target Muscle: {currentExercise.muscleGroup}
                  </span>
                  <h4 className="text-xl font-black text-slate-900 mt-1">
                    {currentExercise.name}
                  </h4>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-800 font-mono">
                    {currentExercise.sets} Sets × {currentExercise.reps} Reps
                  </div>
                  <div className="text-xs text-slate-500">Rest: {currentExercise.restSec}s</div>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                <strong className="text-slate-900">Execution Cue: </strong>
                {currentExercise.instructions}
              </p>

              {/* Set Checkboxes */}
              <div className="mt-5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Completed Working Sets
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: currentExercise.sets }).map((_, i) => {
                    const setNum = i + 1;
                    const isDone = (completedSets[currentExerciseIndex] || []).includes(setNum);
                    return (
                      <button
                        key={setNum}
                        onClick={() => handleCompleteSet(setNum)}
                        className={`py-3 rounded-2xl font-bold text-sm flex flex-col items-center justify-center transition-all border ${
                          isDone
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                            : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100 shadow-sm'
                        }`}
                      >
                        <span className={`text-[10px] font-mono ${isDone ? 'text-emerald-100' : 'text-slate-400'}`}>SET {setNum}</span>
                        <span className="text-base font-extrabold flex items-center gap-1">
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : `${currentExercise.reps}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Top Weight Lifted Input */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-slate-600 font-bold">Load / Weight Lifted (kg):</label>
                  <input
                    type="number"
                    placeholder="e.g. 80"
                    value={weightsLifted[currentExercise.id] || ''}
                    onChange={(e) => setWeightsLifted({
                      ...weightsLifted,
                      [currentExercise.id]: parseFloat(e.target.value) || 0
                    })}
                    className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-cyan-500 shadow-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-slate-600 font-bold">Rest Target:</label>
                  <div className="mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 font-mono shadow-sm">
                    {currentExercise.restSec} seconds
                  </div>
                </div>
              </div>
            </div>

            {/* Rest Timer Visual Box */}
            {isResting && (
              <div className="bg-cyan-50 p-4 rounded-2xl border border-cyan-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-cyan-600" />
                  <div>
                    <div className="text-xs font-bold text-cyan-800 uppercase tracking-wider">
                      Rest Interval in Progress
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                      {restSecondsLeft}s remaining
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRestSecondsLeft((prev) => prev + 30)}
                    className="text-xs bg-cyan-100 text-cyan-800 px-3 py-1.5 rounded-xl hover:bg-cyan-200 border border-cyan-300 font-bold"
                  >
                    +30s
                  </button>
                  <button
                    onClick={() => setIsResting(false)}
                    className="text-xs bg-white text-slate-700 px-3 py-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 font-bold"
                  >
                    Skip Rest
                  </button>
                </div>
              </div>
            )}

            {/* Exercise Navigation */}
            <div className="flex justify-between items-center pt-2">
              <button
                disabled={currentExerciseIndex === 0}
                onClick={handlePrevExercise}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200"
              >
                Previous Exercise
              </button>
              
              <div className="flex gap-1.5">
                {plan.exercises.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentExerciseIndex
                        ? 'bg-cyan-600 w-6'
                        : (completedSets[idx] || []).length > 0
                        ? 'bg-emerald-500'
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              <button
                disabled={currentExerciseIndex === plan.exercises.length - 1}
                onClick={handleNextExercise}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
              >
                <span>Next Exercise</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Sidebar: Session Stats & Completion */}
          <div className="space-y-4">
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600" />
                Live Metabolic Expenditure
              </h5>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Polymorphic Formula:</span>
                  <span className="text-cyan-700 font-mono font-bold">{plan.category}Plan</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Estimated Caloric Burn:</span>
                  <span className="text-lg font-black text-amber-700 font-mono">
                    ~{calculateEstimatedCalories()} kcal
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">User Body Weight:</span>
                  <span className="text-slate-800 font-mono font-bold">{userWeightKg} kg</span>
                </div>
              </div>
            </div>

            {/* Workout Routine Order (LinkedList representation) */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-cyan-600" />
                Routine Sequence (LinkedList)
              </h5>
              <div className="space-y-1.5 text-xs">
                {plan.exercises.map((ex, idx) => {
                  const isCurrent = idx === currentExerciseIndex;
                  const setsCount = (completedSets[idx] || []).length;
                  return (
                    <div
                      key={ex.id}
                      onClick={() => {
                        setIsResting(false);
                        setCurrentExerciseIndex(idx);
                      }}
                      className={`p-2 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'bg-cyan-100 border border-cyan-300 text-cyan-900 font-bold'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      <div className="truncate max-w-[170px]">
                        <span className="font-mono text-[10px] mr-1.5 text-slate-400">#{idx + 1}</span>
                        <span className="font-medium text-slate-800">{ex.name}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {setsCount}/{ex.sets}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Perceived Effort (RPE) */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-bold">Perceived Effort (RPE 1-10):</span>
                <span className="font-bold text-cyan-700">{perceivedEffort} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={perceivedEffort}
                onChange={(e) => setPerceivedEffort(parseInt(e.target.value))}
                className="w-full accent-cyan-600"
              />
              <div className="text-[10px] text-slate-400 mt-1 flex justify-between font-mono">
                <span>Light (1)</span>
                <span>Moderate (5)</span>
                <span>Max (10)</span>
              </div>

              {/* Notes */}
              <div className="mt-3">
                <label className="text-xs text-slate-600 font-bold">Session Notes / Personal Records:</label>
                <textarea
                  rows={2}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="e.g. Set new PR on RDL! Good tempo on negative reps."
                  className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 resize-none shadow-sm"
                />
              </div>
            </div>

            {/* Complete Workout CTA */}
            <button
              onClick={handleFinish}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Log Workout & Persist</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
