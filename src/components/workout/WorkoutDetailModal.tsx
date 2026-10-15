import React from 'react';
import { 
  X, 
  Flame, 
  Calendar, 
  User, 
  CheckCircle, 
  Play, 
  Sparkles, 
  Activity,
  Code
} from 'lucide-react';
import { WorkoutPlan } from '../../types/fitness';

interface WorkoutDetailModalProps {
  plan: WorkoutPlan;
  isEnrolled: boolean;
  onClose: () => void;
  onEnroll: (planId: string) => void;
  onStartSession: (plan: WorkoutPlan) => void;
  onStartChronoHUD?: (plan: WorkoutPlan) => void;
}

export const WorkoutDetailModal: React.FC<WorkoutDetailModalProps> = ({
  plan,
  isEnrolled,
  onClose,
  onEnroll,
  onStartSession,
  onStartChronoHUD,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                plan.category === 'STRENGTH'
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : plan.category === 'CARDIO'
                  ? 'bg-cyan-100 text-cyan-800 border-cyan-200'
                  : plan.category === 'HIIT'
                  ? 'bg-rose-100 text-rose-800 border-rose-200'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}>
                {plan.category}
              </span>
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                Level: {plan.difficulty}
              </span>
              <span className="text-[11px] text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded flex items-center gap-1 font-mono font-bold">
                <Code className="w-3 h-3 text-cyan-600" /> Java Polymorphic Plan
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">{plan.title}</h2>
            
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-cyan-600" />
              Authored by <span className="text-slate-800 font-bold">{plan.coachName}</span>
              <span>•</span>
              <span className="text-slate-500">{plan.enrolledCount} Trainees Enrolled</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm bg-white">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
              <Flame className="w-5 h-5 text-amber-600" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Est. Burn / Session</div>
                <div className="text-base font-black text-slate-900 font-mono">~{plan.estimatedCaloriesBurn} kcal</div>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Cycle Duration</div>
                <div className="text-base font-black text-slate-900 font-mono">{plan.durationWeeks} Weeks</div>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
              <Activity className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Frequency</div>
                <div className="text-base font-black text-slate-900 font-mono">{plan.daysPerWeek} Days/Week</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Program Methodology & Overview
            </h4>
            <p className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              {plan.description}
            </p>
          </div>

          {/* Polymorphic Rule Code Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-cyan-200">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-800 mb-1 font-mono">
              <Code className="w-4 h-4 text-cyan-600" />
              Java Polymorphic Algorithm Implementation:
            </div>
            <p className="text-xs text-slate-800 font-mono bg-white p-2.5 rounded-xl border border-slate-200">
              {plan.polymorphicRule}
            </p>
          </div>

          {/* Exercises Breakdown */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Prescribed Routine Sequence ({plan.exercises.length} Exercises)
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">LinkedList Order Preserved</span>
            </div>

            <div className="space-y-2.5">
              {plan.exercises.map((ex, index) => (
                <div
                  key={ex.id}
                  className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">{ex.name}</h5>
                      <span className="text-xs text-cyan-700 font-medium">{ex.muscleGroup}</span>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{ex.instructions}</p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end gap-1 font-mono text-xs text-right shrink-0">
                    <div className="font-bold text-slate-800">
                      {ex.sets} Sets × {ex.reps}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Rest: {ex.restSec}s
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {plan.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {!isEnrolled ? (
            <button
              onClick={() => onEnroll(plan.id)}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold transition-all border border-slate-300 shadow-sm"
            >
              Enroll in Routine
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Active on your schedule
            </span>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all"
            >
              Close
            </button>
            {onStartChronoHUD && (
              <button
                onClick={() => {
                  onClose();
                  onStartChronoHUD(plan);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:brightness-105 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                title="Launch full kinetic dual-orbit exercise countdown HUD"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span>Kinetic Chrono HUD</span>
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                onStartSession(plan);
              }}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Standard Player</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
