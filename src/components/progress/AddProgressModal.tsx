import React, { useState } from 'react';
import { X, Activity, Scale, Clock, Flame, CheckCircle2 } from 'lucide-react';
import { ProgressLog } from '../../types/fitness';

interface AddProgressModalProps {
  memberId: string;
  currentWeightKg: number;
  onClose: () => void;
  onAddLog: (log: Omit<ProgressLog, 'id'>) => void;
}

export const AddProgressModal: React.FC<AddProgressModalProps> = ({
  memberId,
  currentWeightKg,
  onClose,
  onAddLog,
}) => {
  const [workoutTitle, setWorkoutTitle] = useState('Custom Strength & Conditioning Session');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [caloriesBurned, setCaloriesBurned] = useState(420);
  const [weightKg, setWeightKg] = useState<number>(currentWeightKg);
  const [perceivedEffort, setPerceivedEffort] = useState(7);
  const [notes, setNotes] = useState('');
  const [exerciseName, setExerciseName] = useState('Barbell Squat');
  const [topWeight, setTopWeight] = useState(100);
  const [reps, setReps] = useState(8);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLog({
      memberId,
      date: new Date().toISOString().split('T')[0],
      workoutTitle,
      durationMinutes,
      caloriesBurned,
      weightKg: weightKg || undefined,
      notes: notes || 'Logged custom training session and updated biometrics.',
      perceivedEffort,
      exercisesCompleted: [
        {
          exerciseName,
          setsCompleted: 4,
          topWeightKg: topWeight,
          repsCompleted: reps,
        }
      ]
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-600" />
            <h3 className="font-bold text-slate-900 text-base">Record Workout Session & Body Weight</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          <div>
            <label className="text-slate-700 font-semibold block mb-1">Session / Routine Title</label>
            <input
              type="text"
              required
              value={workoutTitle}
              onChange={(e) => setWorkoutTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 block mb-1 font-medium">Duration (Minutes)</label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min="5"
                  max="240"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-8 pr-2 text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-medium">Energy Burned (kcal)</label>
              <div className="relative">
                <Flame className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-500" />
                <input
                  type="number"
                  value={caloriesBurned}
                  onChange={(e) => setCaloriesBurned(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-8 pr-2 text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 block mb-1 font-medium">Current Body Weight (kg)</label>
              <div className="relative">
                <Scale className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-cyan-600" />
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-8 pr-2 text-slate-900 font-mono focus:outline-none focus:border-cyan-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-medium">Perceived Effort (RPE 1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={perceivedEffort}
                onChange={(e) => setPerceivedEffort(parseInt(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-mono focus:outline-none focus:border-cyan-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Highlight Lift */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block font-mono">
              Highlight Lift / Personal Record (PR)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Exercise"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl p-1.5 text-slate-900"
              />
              <input
                type="number"
                placeholder="Top Load (kg)"
                value={topWeight}
                onChange={(e) => setTopWeight(parseFloat(e.target.value))}
                className="bg-white border border-slate-200 rounded-xl p-1.5 text-slate-900 font-mono"
              />
              <input
                type="number"
                placeholder="Reps"
                value={reps}
                onChange={(e) => setReps(parseInt(e.target.value))}
                className="bg-white border border-slate-200 rounded-xl p-1.5 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">Check-in Notes / Coach Reflection</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Energy levels were great, hydration on point..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 resize-none focus:outline-none focus:border-cyan-500 focus:bg-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:brightness-105 text-white rounded-xl font-bold shadow-md shadow-cyan-600/20 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save to Database</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
