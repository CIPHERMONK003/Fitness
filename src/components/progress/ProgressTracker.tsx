import React, { useState } from 'react';
import { 
  TrendingUp, 
  Flame, 
  Dumbbell, 
  Scale, 
  Calendar, 
  Plus, 
  Clock, 
  Activity, 
  Zap
} from 'lucide-react';
import { MemberUser, ProgressLog } from '../../types/fitness';
import { AddProgressModal } from './AddProgressModal';

interface ProgressTrackerProps {
  member: MemberUser;
  logs: ProgressLog[];
  onAddLog: (log: Omit<ProgressLog, 'id'>) => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  member,
  logs,
  onAddLog,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Derived calculations
  const totalWorkouts = logs.length;
  const totalCalories = logs.reduce((acc, l) => acc + l.caloriesBurned, 0);
  const totalMinutes = logs.reduce((acc, l) => acc + l.durationMinutes, 0);
  const avgDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;

  // BMI Calculation matching Java Member.calculateBMI()
  const heightM = member.heightCm / 100;
  const bmi = heightM > 0 ? Math.round((member.currentWeightKg / (heightM * heightM)) * 10) / 10 : 0;
  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-cyan-700' };
    if (val < 25) return { label: 'Normal / Athletic', color: 'text-emerald-700' };
    if (val < 30) return { label: 'Overweight', color: 'text-amber-700' };
    return { label: 'Obese', color: 'text-rose-700' };
  };
  const bmiInfo = getBmiCategory(bmi);

  // Weight differential towards target
  const weightDiff = Math.round((member.currentWeightKg - member.targetWeightKg) * 10) / 10;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Log CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-700 uppercase tracking-wider mb-1.5">
            <Activity className="w-4 h-4 text-cyan-600" /> Trainee Performance Telemetry
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {member.name}'s Kinetic Trajectory
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 font-mono">
            Goal: <span className="text-cyan-700 font-bold">{member.fitnessGoal.replace('_', ' ')}</span> • Supervised by <span className="text-slate-900 font-bold">{member.assignedCoachName || 'Unassigned'}</span>
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 bg-gradient-to-r from-cyan-600 via-sky-600 to-teal-600 hover:brightness-105 text-white rounded-2xl text-xs font-bold shadow-md shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all self-start sm:self-auto hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Record Workout or Weigh-In</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Sessions */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Completed Sessions</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-700">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
            {totalWorkouts}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Avg Duration: <strong className="text-slate-800">{avgDuration} mins</strong>
          </p>
        </div>

        {/* Calories Burned */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Total Caloric Burn</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-amber-700 font-mono tracking-tight">
            {totalCalories.toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">kcal</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Polymorphic metabolic sum
          </p>
        </div>

        {/* Current Body Weight */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Current Weight</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-700">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
            {member.currentWeightKg} <span className="text-xs font-normal text-slate-500 font-sans">kg</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
            Target: <span className="text-cyan-700 font-bold">{member.targetWeightKg} kg</span>
            <span className="text-slate-400">({weightDiff > 0 ? `+${weightDiff}` : weightDiff} kg)</span>
          </p>
        </div>

        {/* Calculated BMI */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Calculated BMI</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
            {bmi}
          </div>
          <p className={`text-[11px] font-bold font-mono ${bmiInfo.color}`}>
            {bmiInfo.label} Range
          </p>
        </div>

      </div>

      {/* Visual Progress Bar Chart: Calorie Burn per Session */}
      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-600" />
              Session Energy Expenditure Breakdown
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Chronological workout logs with TreeSort indexing</p>
          </div>
          <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">Unit: kcal</span>
        </div>

        <div className="space-y-4 pt-2">
          {logs.slice(0, 5).map((log) => {
            const maxKcal = 600;
            const pct = Math.min(100, Math.round((log.caloriesBurned / maxKcal) * 100));

            return (
              <div key={log.id} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px] font-semibold">{log.date}</span>
                    <span className="font-bold text-slate-800 font-sans">{log.workoutTitle}</span>
                  </div>
                  <div className="font-bold text-amber-700">
                    {log.caloriesBurned} kcal <span className="text-slate-400 font-normal">({log.durationMinutes}m)</span>
                  </div>
                </div>
                
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="bg-gradient-to-r from-cyan-500 via-sky-500 to-amber-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Workout History Timeline */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-base">Verified Training Logs & Personal Bests</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">Synced with JDBC ProgressDAO & relational tables</p>
          </div>
          <span className="text-xs text-cyan-800 bg-cyan-100 px-3 py-1 rounded-full border border-cyan-200 font-mono font-bold">
            {logs.length} Logged Sessions
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {logs.map((log) => (
            <div key={log.id} className="p-6 space-y-3 hover:bg-slate-50 transition-colors">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{log.workoutTitle}</span>
                    {log.weightKg && (
                      <span className="text-xs font-mono bg-cyan-100 text-cyan-800 px-2.5 py-0.5 rounded-full border border-cyan-200 font-bold">
                        {log.weightKg} kg check-in
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3 font-mono">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-cyan-600" /> {log.date}
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-sky-600" /> {log.durationMinutes} mins
                    </span>
                    <span className="flex items-center gap-1 text-amber-700 font-bold">
                      <Flame className="w-3.5 h-3.5 text-amber-600" /> {log.caloriesBurned} kcal
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono">Perceived RPE:</span>
                  <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 font-mono">
                    {log.perceivedEffort} / 10
                  </span>
                </div>
              </div>

              {/* Exercises completed in this session */}
              {log.exercisesCompleted && log.exercisesCompleted.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                  {log.exercisesCompleted.map((ex, i) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                      <div className="font-bold text-slate-900 truncate">{ex.exerciseName}</div>
                      <div className="text-slate-500 text-[11px] font-mono mt-1 flex items-center justify-between">
                        <span>{ex.setsCompleted} sets × {ex.repsCompleted} reps</span>
                        {ex.topWeightKg && (
                          <span className="text-cyan-800 font-bold bg-cyan-100 px-2 py-0.5 rounded border border-cyan-200">
                            {ex.topWeightKg}kg PR
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Log Notes */}
              {log.notes && (
                <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  "{log.notes}"
                </p>
              )}

            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AddProgressModal
          memberId={member.id}
          currentWeightKg={member.currentWeightKg}
          onClose={() => setIsModalOpen(false)}
          onAddLog={(newLog) => {
            onAddLog(newLog);
            setIsModalOpen(false);
          }}
        />
      )}

    </div>
  );
};
