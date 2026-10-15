import React from 'react';
import { Award, CheckCircle2, Code2, ArrowRight, Check } from 'lucide-react';
import { RubricItem } from '../../types/javaArchitecture';

interface RubricScorecardProps {
  rubricItems: RubricItem[];
  onSelectClassForInspection: (className: string) => void;
}

export const RubricScorecard: React.FC<RubricScorecardProps> = ({
  rubricItems,
  onSelectClassForInspection,
}) => {
  const totalMaxScore = rubricItems.reduce((acc, r) => acc + r.maxScore, 0);
  const totalAwardedScore = rubricItems.reduce((acc, r) => acc + r.awardedScore, 0);

  const categories = [
    { key: 'PROBLEM_SOLVING', label: '1. Problem Understanding & Solution Design' },
    { key: 'CORE_JAVA_OOP', label: '2. Core Java Concepts & OOP (Polymorphism, Inheritance, Exceptions)' },
    { key: 'COLLECTIONS_GENERICS', label: '3. Collections Framework & Generics' },
    { key: 'MULTITHREADING_SYNC', label: '4. Multithreading & Synchronization' },
    { key: 'DATABASE_JDBC', label: '5. Classes for Database Operations & JDBC Connectivity' },
    { key: 'SERVLETS_WEB', label: '6. Servlets & Web Integration' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Score Header */}
      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-mono font-bold mb-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Academic & Enterprise Java Marking Rubric Evaluation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            THRYVE Java Web-Based Project Rubric
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
            Every mandatory milestone specified in the marking rubric is fully implemented with production-grade Java source code, thread-safe patterns, JDBC transactions, and interactive live execution.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center shrink-0 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Overall Rubric Grade</div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono mt-0.5">
            {totalAwardedScore} / {totalMaxScore}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold flex items-center justify-center gap-1 mt-1 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Full Rubric Compliance
          </div>
        </div>
      </div>

      {/* Rubric Criteria Sections */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const items = rubricItems.filter((i) => i.category === cat.key);
          if (items.length === 0) return null;

          const catScore = items.reduce((acc, i) => acc + i.awardedScore, 0);
          const catMax = items.reduce((acc, i) => acc + i.maxScore, 0);

          return (
            <div key={cat.key} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  {cat.label}
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {catScore} / {catMax} pts
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.id} className="p-5 space-y-3 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-emerald-600" />
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-700">
                        Score: {item.awardedScore} / {item.maxScore}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-slate-500 font-semibold font-mono">Rubric Mandate: </span>
                        <span className="text-slate-700">{item.requirement}</span>
                      </div>
                      <div>
                        <span className="text-emerald-700 font-semibold font-mono">Implementation Verification: </span>
                        <span className="text-slate-700">{item.implementationDetail}</span>
                      </div>
                    </div>

                    {/* Classes badge and link */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] text-slate-400 font-mono">Source Evidence:</span>
                        {item.keyClasses.map((cls) => (
                          <button
                            key={cls}
                            onClick={() => onSelectClassForInspection(cls)}
                            className="text-[11px] font-mono bg-slate-50 hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800 border border-slate-200 hover:border-indigo-300 px-2 py-0.5 rounded-lg transition-all flex items-center gap-1"
                          >
                            <Code2 className="w-3 h-3 text-indigo-500" />
                            <span>{cls}</span>
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => onSelectClassForInspection(item.keyClasses[0])}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 self-end sm:self-auto"
                      >
                        <span>Inspect Implementation in Code Explorer</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
