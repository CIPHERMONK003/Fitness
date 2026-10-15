import React, { useState } from 'react';
import { 
  Search, 
  Flame, 
  Play, 
  Plus, 
  CheckCircle, 
  Sparkles
} from 'lucide-react';
import { WorkoutPlan, DifficultyLevel, AppUser } from '../../types/fitness';

interface WorkoutCatalogProps {
  plans: WorkoutPlan[];
  currentUser: AppUser;
  onSelectPlan: (plan: WorkoutPlan) => void;
  onStartSession: (plan: WorkoutPlan) => void;
  onOpenCreateModal: () => void;
  onEnrollPlan: (planId: string) => void;
}

export const WorkoutCatalog: React.FC<WorkoutCatalogProps> = ({
  plans,
  currentUser,
  onSelectPlan,
  onStartSession,
  onOpenCreateModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch = 
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'ALL' || plan.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'ALL' || plan.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const isEnrolled = (planId: string) => {
    if (currentUser.role === 'MEMBER') {
      return currentUser.enrolledPlanIds.includes(planId);
    }
    return false;
  };

  const getDifficultyScore = (diff: DifficultyLevel) => {
    switch (diff) {
      case 'BEGINNER': return 1;
      case 'INTERMEDIATE': return 2;
      case 'ADVANCED': return 3;
      case 'ELITE': return 4;
      default: return 2;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* High-Voltage Athletic Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-slate-50 to-cyan-50/40 border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-mono font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>PERIODIZED CURRICULUM • DYNAMIC METABOLIC FORMULAS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            High-Performance Training Curriculum
          </h1>
          <p className="text-sm text-slate-600 mt-2.5 leading-relaxed font-normal">
            Science-backed resistance splits, cardiovascular endurance protocols, and explosive HIIT circuits engineered by accredited strength coaches.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            {(currentUser.role === 'COACH' || currentUser.role === 'ADMIN') && (
              <button
                onClick={onOpenCreateModal}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:brightness-105 text-white rounded-2xl text-xs font-bold shadow-md shadow-cyan-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Author New Workout Plan</span>
              </button>
            )}
            
            <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <span>Showing</span>
              <span className="text-cyan-700 font-black">{filteredPlans.length}</span>
              <span>curated routines</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search plans, muscle groups, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-all font-medium"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'STRENGTH', 'CARDIO', 'HIIT', 'CALISTHENICS'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm font-black'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Disciplines' : cat}
              </button>
            ))}
          </div>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>

      </div>

      {/* Workout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => {
          const enrolled = isEnrolled(plan.id);
          const diffScore = getDifficultyScore(plan.difficulty);

          return (
            <div
              key={plan.id}
              className="group bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-slate-300 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Category Strip */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${
                plan.category === 'STRENGTH'
                  ? 'from-amber-400 to-orange-500'
                  : plan.category === 'CARDIO'
                  ? 'from-cyan-400 to-blue-500'
                  : plan.category === 'HIIT'
                  ? 'from-rose-500 to-amber-500'
                  : 'from-emerald-400 to-teal-400'
              }`} />

              <div className="p-6 space-y-4">
                
                {/* Top Badges */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                    plan.category === 'STRENGTH'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : plan.category === 'CARDIO'
                      ? 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                      : plan.category === 'HIIT'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {plan.category}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Difficulty Meter */}
                    <div className="flex items-center gap-1" title={`Difficulty: ${plan.difficulty}`}>
                      {[1, 2, 3, 4].map((step) => (
                        <span
                          key={step}
                          className={`w-1.5 h-3 rounded-full ${
                            step <= diffScore ? 'bg-cyan-600' : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    {enrolled && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 font-mono">
                        <CheckCircle className="w-3 h-3 text-emerald-600" /> ENROLLED
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 
                    onClick={() => onSelectPlan(plan)}
                    className="text-lg font-black text-slate-900 group-hover:text-cyan-700 transition-colors cursor-pointer leading-snug"
                  >
                    {plan.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Plan Metrics Pills */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-xs font-mono">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 uppercase font-bold">Duration</span>
                    <span className="font-bold text-slate-900 text-xs">{plan.durationWeeks} wks</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 uppercase font-bold">Days/Wk</span>
                    <span className="font-bold text-slate-900 text-xs">{plan.daysPerWeek} days</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 uppercase font-bold">Est. Burn</span>
                    <span className="font-bold text-amber-700 text-xs flex items-center gap-0.5">
                      <Flame className="w-3 h-3 text-amber-600" />
                      {plan.estimatedCaloriesBurn}k
                    </span>
                  </div>
                </div>

                {/* Exercises Preview */}
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono flex justify-between">
                    <span>Routine Sequence</span>
                    <span className="text-cyan-700">{plan.exercises.length} Movements</span>
                  </div>
                  <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    {plan.exercises.slice(0, 3).map((ex, idx) => (
                      <div key={ex.id} className="text-xs text-slate-700 flex items-center justify-between">
                        <span className="truncate max-w-[200px] flex items-center gap-1.5 font-medium">
                          <span className="text-slate-400 font-mono text-[10px]">#{idx + 1}</span>
                          {ex.name}
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">{ex.sets} sets</span>
                      </div>
                    ))}
                    {plan.exercises.length > 3 && (
                      <div className="text-[10px] text-cyan-700 font-mono font-bold pt-0.5">
                        +{plan.exercises.length - 3} more movements in routine
                      </div>
                    )}
                  </div>
                </div>

                {/* Coach info */}
                <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between font-mono">
                  <span className="truncate max-w-[180px]">Lead: <strong className="text-slate-900 font-bold">{plan.coachName}</strong></span>
                  <span className="text-[10px] text-slate-500">{plan.enrolledCount} enrolled</span>
                </div>

              </div>

              {/* Bottom Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
                <button
                  onClick={() => onSelectPlan(plan)}
                  className="flex-1 py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-2xl border border-slate-200 transition-all shadow-sm"
                >
                  View Details & Routine
                </button>
                <button
                  onClick={() => onStartSession(plan)}
                  className="py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:brightness-105 text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-cyan-600/20 flex items-center gap-1.5 shrink-0"
                  title="Launch live workout session player"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
