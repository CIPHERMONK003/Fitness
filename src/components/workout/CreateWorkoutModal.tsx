import React, { useState } from 'react';
import { X, Plus, Trash2, Dumbbell, CheckCircle2 } from 'lucide-react';
import { WorkoutPlan, WorkoutCategory, DifficultyLevel, Exercise } from '../../types/fitness';

interface CreateWorkoutModalProps {
  coachId: string;
  coachName: string;
  onClose: () => void;
  onCreate: (plan: Omit<WorkoutPlan, 'id' | 'enrolledCount'>) => void;
}

export const CreateWorkoutModal: React.FC<CreateWorkoutModalProps> = ({
  coachId,
  coachName,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<WorkoutCategory>('STRENGTH');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('INTERMEDIATE');
  const [durationWeeks, setDurationWeeks] = useState(6);
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [estimatedCaloriesBurn, setEstimatedCaloriesBurn] = useState(450);
  const [tagsInput, setTagsInput] = useState('Compound, Progressive Overload, Power');

  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: 'ex-new-1',
      name: 'Barbell Back Squat',
      muscleGroup: 'Quadriceps & Core',
      sets: 4,
      reps: '6-8',
      restSec: 90,
      instructions: 'Descend to parallel with upright chest. Drive through midfoot.'
    },
    {
      id: 'ex-new-2',
      name: 'Standing Overhead Barbell Press',
      muscleGroup: 'Anterior Deltoids & Triceps',
      sets: 3,
      reps: '8-10',
      restSec: 75,
      instructions: 'Brace glutes and core, press vertical overhead locking elbows.'
    }
  ]);

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      {
        id: `ex-new-${Date.now()}`,
        name: 'Dumbbell Walking Lunges',
        muscleGroup: 'Legs & Stabilizers',
        sets: 3,
        reps: '12 per leg',
        restSec: 60,
        instructions: 'Long step forward, lower back knee just above floor.'
      }
    ]);
  };

  const handleRemoveExercise = (index: number) => {
    if (exercises.length <= 1) return;
    setExercises(exercises.filter((_, idx) => idx !== index));
  };

  const handleUpdateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || exercises.length === 0) return;

    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    let polymorphicRule = 'Standard execution protocol';
    if (category === 'STRENGTH') {
      polymorphicRule = 'StrengthPlan#calculateCaloricExpenditure: Weight load formula with 1.35x hypertrophy multiplier';
    } else if (category === 'CARDIO') {
      polymorphicRule = 'CardioPlan#calculateCaloricExpenditure: Heart rate zone MET calculation with 1.1x volume multiplier';
    } else if (category === 'HIIT') {
      polymorphicRule = 'HIITPlan#calculateCaloricExpenditure: EPOC metabolic boost with 1.5x anaerobic multiplier';
    }

    onCreate({
      title,
      description,
      category,
      difficulty,
      durationWeeks,
      daysPerWeek,
      coachId,
      coachName,
      isApproved: true,
      tags,
      estimatedCaloriesBurn,
      exercises,
      polymorphicRule
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-cyan-600" />
              Create & Publish Workout Plan
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorship assigned to <span className="text-cyan-700 font-bold">{coachName}</span> (DAO Batch Insert)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Workout Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Upper Body Hypertrophy & Power"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Discipline Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WorkoutCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white"
              >
                <option value="STRENGTH">Strength & Hypertrophy (StrengthPlan)</option>
                <option value="CARDIO">Cardiovascular Endurance (CardioPlan)</option>
                <option value="HIIT">High-Intensity Interval (HIITPlan)</option>
                <option value="CALISTHENICS">Calisthenics & Bodyweight</option>
                <option value="MOBILITY">Functional Mobility</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">Plan Description & Training Logic</label>
            <textarea
              rows={2}
              required
              placeholder="Outline the training stimulus, rep cadence, and progression rules..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white resize-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-slate-500 block mb-1 font-medium">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="ELITE">Elite</option>
              </select>
            </div>

            <div>
              <label className="text-slate-500 block mb-1 font-medium">Duration (Weeks)</label>
              <input
                type="number"
                min="1"
                max="52"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(parseInt(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1 font-medium">Days / Week</label>
              <input
                type="number"
                min="1"
                max="7"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1 font-medium">Est. Kcal / Session</label>
              <input
                type="number"
                value={estimatedCaloriesBurn}
                onChange={(e) => setEstimatedCaloriesBurn(parseInt(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">Tags (Comma-Separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900"
            />
          </div>

          {/* Exercises Sequence Builder */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-800 font-bold uppercase tracking-wider text-[11px] font-mono">
                Exercise Routine Builder ({exercises.length} Exercises)
              </label>
              <button
                type="button"
                onClick={handleAddExercise}
                className="text-cyan-700 hover:text-cyan-800 flex items-center gap-1 font-bold text-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Exercise
              </button>
            </div>

            <div className="space-y-3">
              {exercises.map((ex, idx) => (
                <div key={ex.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-700 font-bold">#{idx + 1}</span>
                    <button
                      type="button"
                      disabled={exercises.length <= 1}
                      onClick={() => handleRemoveExercise(idx)}
                      className="text-slate-400 hover:text-rose-600 disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="Exercise Name"
                      value={ex.name}
                      onChange={(e) => handleUpdateExercise(idx, 'name', e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl p-2 text-slate-900 col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="Muscle Group"
                      value={ex.muscleGroup}
                      onChange={(e) => handleUpdateExercise(idx, 'muscleGroup', e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl p-2 text-slate-900 col-span-2"
                    />
                    <input
                      type="number"
                      placeholder="Sets"
                      value={ex.sets}
                      onChange={(e) => handleUpdateExercise(idx, 'sets', parseInt(e.target.value))}
                      className="bg-white border border-slate-200 rounded-xl p-2 text-slate-900 font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Reps (e.g. 8-10)"
                      value={ex.reps}
                      onChange={(e) => handleUpdateExercise(idx, 'reps', e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl p-2 text-slate-900 font-mono"
                    />
                    <input
                      type="number"
                      placeholder="Rest (sec)"
                      value={ex.restSec}
                      onChange={(e) => handleUpdateExercise(idx, 'restSec', parseInt(e.target.value))}
                      className="bg-white border border-slate-200 rounded-xl p-2 text-slate-900 font-mono col-span-2"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Instructions / Form Cues..."
                    value={ex.instructions}
                    onChange={(e) => handleUpdateExercise(idx, 'instructions', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-900 text-[11px]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
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
              <span>Publish Workout Plan</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
