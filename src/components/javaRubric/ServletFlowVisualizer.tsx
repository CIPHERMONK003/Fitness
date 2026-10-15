import React, { useState } from 'react';
import { 
  Globe, 
  CheckCircle2, 
  Play
} from 'lucide-react';
import { ServletPipelineStep } from '../../types/javaArchitecture';

export const ServletFlowVisualizer: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'GET_WORKOUT' | 'POST_WORKOUT' | 'GET_PROGRESS'>('GET_WORKOUT');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const pipelineSteps: ServletPipelineStep[] = [
    {
      id: 'step-1',
      title: '1. HTTP Request Arrival',
      type: 'CLIENT',
      description: selectedEndpoint === 'GET_WORKOUT'
        ? 'GET /api/workouts/plan-01 HTTP/1.1 (Accept: application/json)'
        : selectedEndpoint === 'POST_WORKOUT'
        ? 'POST /api/workouts HTTP/1.1 (Body: JSON Payload, Session: JSESSIONID=9F2A)'
        : 'GET /api/progress?memberId=101 HTTP/1.1 (Session: JSESSIONID=9F2A)',
      active: true,
      durationMs: 1.2
    },
    {
      id: 'step-2',
      title: '2. AuthFilter (javax.servlet.Filter)',
      type: 'FILTER',
      description: 'Intercepts URI pattern. Inspects req.getSession(false). Verifies user has authorized role permission.',
      active: true,
      durationMs: 2.1
    },
    {
      id: 'step-3',
      title: '3. WorkoutServlet (HttpServlet)',
      type: 'SERVLET',
      description: selectedEndpoint === 'POST_WORKOUT'
        ? 'WorkoutServlet.doPost() invoked. Parses JSON body into WorkoutPlan DTO.'
        : 'WorkoutServlet.doGet() invoked. Parses path parameter: planId = 1L.',
      active: true,
      durationMs: 3.4
    },
    {
      id: 'step-4',
      title: '4. Service Layer (Collections & Cache)',
      type: 'SERVICE',
      description: 'WorkoutServiceImpl checks planFastCache (ConcurrentHashMap). On cache-miss, delegates to DAO.',
      active: true,
      durationMs: 1.8
    },
    {
      id: 'step-5',
      title: '5. DAO Layer & Connection Pool',
      type: 'JDBC_POOL',
      description: 'WorkoutDAOImpl calls ConnectionPool.getConnection(). Thread synchronizes on monitor lock and acquires slot.',
      active: true,
      durationMs: 4.5
    },
    {
      id: 'step-6',
      title: '6. PostgreSQL Database Engine',
      type: 'DATABASE',
      description: 'Executes PreparedStatement query with parameterized binding. Returns ResultSet rows.',
      active: true,
      durationMs: 6.2
    },
    {
      id: 'step-7',
      title: '7. HttpServletResponse Serialization',
      type: 'SERVLET',
      description: 'res.setStatus(200 OK); res.setContentType("application/json"); Serializes Java entity to HTTP payload stream.',
      active: true,
      durationMs: 2.0
    }
  ];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setActiveStepIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= pipelineSteps.length) {
        clearInterval(interval);
        setIsSimulating(false);
      } else {
        setActiveStepIndex(current);
      }
    }, 450);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1 font-mono">
            <Globe className="w-4 h-4 text-sky-600" /> Java Web & Servlet Container Pipeline
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            HttpServlet Request Dispatcher & Filter Chain
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
            Visual breakdown of an incoming HTTP request traversing <code className="text-indigo-700 font-bold font-mono">AuthFilter</code>, <code className="text-indigo-700 font-bold font-mono">WorkoutServlet.doGet() / doPost()</code>, the business service layer, and JDBC pools.
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="px-5 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:brightness-105 disabled:opacity-50 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-sky-600/20 flex items-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{isSimulating ? 'Processing Request...' : 'Trigger Simulated HTTP Request'}</span>
        </button>
      </div>

      {/* Endpoint Selector */}
      <div className="flex flex-wrap gap-2 bg-white p-2.5 rounded-2xl border border-slate-200 text-xs shadow-sm">
        <span className="text-slate-500 font-semibold px-2 py-1 font-mono">Simulated HTTP Route:</span>
        <button
          onClick={() => setSelectedEndpoint('GET_WORKOUT')}
          className={`px-3 py-1.5 rounded-xl font-mono font-bold transition-all ${
            selectedEndpoint === 'GET_WORKOUT'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          GET /api/workouts/1
        </button>
        <button
          onClick={() => setSelectedEndpoint('POST_WORKOUT')}
          className={`px-3 py-1.5 rounded-xl font-mono font-bold transition-all ${
            selectedEndpoint === 'POST_WORKOUT'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          POST /api/workouts (Coach Authorized)
        </button>
        <button
          onClick={() => setSelectedEndpoint('GET_PROGRESS')}
          className={`px-3 py-1.5 rounded-xl font-mono font-bold transition-all ${
            selectedEndpoint === 'GET_PROGRESS'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          GET /api/progress
        </button>
      </div>

      {/* Pipeline Steps Sequence */}
      <div className="space-y-3">
        {pipelineSteps.map((step, idx) => {
          const isCurrent = idx === activeStepIndex;
          const isDone = idx < activeStepIndex;

          return (
            <div
              key={step.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs ${
                isCurrent
                  ? 'bg-sky-50 border-sky-400 text-slate-900 ring-2 ring-sky-400/20 shadow-md'
                  : isDone
                  ? 'bg-white border-emerald-200 text-slate-900'
                  : 'bg-slate-50/70 border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                  isCurrent
                    ? 'bg-sky-600 text-white animate-pulse'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : idx + 1}
                </span>

                <div>
                  <h4 className={`font-bold text-sm ${isCurrent ? 'text-sky-900' : isDone ? 'text-slate-900' : 'text-slate-500'}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-auto font-mono text-xs">
                <span className="text-slate-400">{step.durationMs} ms</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isCurrent ? 'bg-sky-100 text-sky-800 border border-sky-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {step.type}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Response Preview Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 font-mono text-xs shadow-sm">
        <div className="flex justify-between items-center text-slate-500 text-[11px] mb-2 font-mono">
          <span>Final Servlet Response Payload:</span>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">HTTP/1.1 200 OK</span>
        </div>
        <pre className="bg-[#f8fafc] p-4 rounded-2xl border border-slate-200 text-slate-800 overflow-x-auto leading-relaxed">
{selectedEndpoint === 'GET_WORKOUT' ? `{
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "title": "Hypertrophy Forge: Upper/Lower Split",
    "category": "STRENGTH",
    "durationWeeks": 8,
    "coach": "Marcus Vance, CSCS",
    "exerciseRoutine": [
      { "name": "Barbell Romanian Deadlift", "sets": 4, "reps": "8-10", "restSec": 90 },
      { "name": "Incline Dumbbell Chest Press", "sets": 4, "reps": "10-12", "restSec": 75 }
    ]
  }
}` : selectedEndpoint === 'POST_WORKOUT' ? `{
  "status": "CREATED",
  "message": "Workout plan successfully enrolled and batch persisted into database.",
  "generatedId": 42
}` : `{
  "status": "SUCCESS",
  "memberId": 101,
  "weeklyCompleted": 4,
  "totalKcal": 1895,
  "bmi": 24.2
}`}
        </pre>
      </div>

    </div>
  );
};
