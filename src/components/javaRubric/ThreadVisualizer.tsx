import React, { useState } from 'react';
import { 
  Activity, 
  Lock, 
  Cpu, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Info
} from 'lucide-react';
import { SimulatedThread } from '../../types/javaArchitecture';

interface ThreadVisualizerProps {
  threads: SimulatedThread[];
  onDispatchTask: (taskDescription: string) => void;
  onSimulateLockContention: () => void;
  onReleaseLocks: () => void;
}

export const ThreadVisualizer: React.FC<ThreadVisualizerProps> = ({
  threads,
  onDispatchTask,
  onSimulateLockContention,
  onReleaseLocks,
}) => {
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);

  const handleDispatch = () => {
    onDispatchTask('Asynchronous Coach Check-in Push Notification');
    setNotificationStatus('Task enqueued to ThreadPoolExecutor work queue! Worker awakened.');
    setTimeout(() => setNotificationStatus(null), 3000);
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'RUNNABLE':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'TIMED_WAITING':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'WAITING':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'BLOCKED':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const totalTasks = threads.reduce((acc, t) => acc + t.tasksCompleted, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1 font-mono">
            <Cpu className="w-4 h-4 text-emerald-600" /> Multithreading & Synchronization Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            JVM ThreadPool & Monitor Lock Inspector
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
            Live simulation of <code className="text-indigo-700 font-bold font-mono">java.util.concurrent.ThreadPoolExecutor</code>, synchronized blocks with wait()/notifyAll(), and thread-safe collections.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDispatch}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4" />
            <span>Dispatch Async Worker Task</span>
          </button>

          <button
            onClick={onSimulateLockContention}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-amber-800 rounded-2xl text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5"
          >
            <Lock className="w-4 h-4 text-amber-600" />
            <span>Simulate Lock Contention</span>
          </button>

          <button
            onClick={onReleaseLocks}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4 text-slate-600" />
            <span>notifyAll() Release</span>
          </button>
        </div>
      </div>

      {notificationStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notificationStatus}</span>
        </div>
      )}

      {/* Thread Architecture Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500">Core Pool Size</span>
          <div className="text-xl font-black text-slate-900">4 Threads</div>
          <span className="text-[11px] text-slate-500">Pre-started daemons</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500">Max Pool Size</span>
          <div className="text-xl font-black text-indigo-700">8 Threads</div>
          <span className="text-[11px] text-slate-500">Auto-scaling ceiling</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500">Queue Capacity</span>
          <div className="text-xl font-black text-amber-700">200 Tasks</div>
          <span className="text-[11px] text-slate-500">ArrayBlockingQueue</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500">Total Tasks Processed</span>
          <div className="text-xl font-black text-emerald-700">{totalTasks}</div>
          <span className="text-[11px] text-slate-500">AtomicInteger increment</span>
        </div>
      </div>

      {/* Live Thread Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            Live JVM Thread Registry
          </h3>
          <span className="text-xs font-mono text-slate-500">Synchronized Monitors Active</span>
        </div>

        <div className="divide-y divide-slate-100">
          {threads.map((thread) => (
            <div key={thread.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono font-bold text-slate-900 text-sm">{thread.name}</span>
                  <span className="text-slate-500 font-mono text-xs">TID #{thread.id}</span>
                  <span className="text-slate-500 font-mono text-xs">• Priority: {thread.priority}</span>
                </div>

                <div className="text-xs text-slate-600">
                  <span className="text-slate-500 font-semibold font-mono">Active Execution: </span>
                  {thread.currentTask}
                </div>

                {thread.lockHeld && (
                  <div className="text-[11px] text-emerald-700 font-mono flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Holds monitor lock: {thread.lockHeld}</span>
                  </div>
                )}

                {thread.lockWaitingOn && (
                  <div className="text-[11px] text-rose-700 font-mono flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Blocked waiting on monitor: {thread.lockWaitingOn}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right font-mono text-xs hidden sm:block">
                  <div className="text-slate-400 text-[10px] uppercase">Completed</div>
                  <div className="font-bold text-slate-700">{thread.tasksCompleted} tasks</div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${getStateColor(thread.state)}`}>
                  {thread.state}
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Code Snippet Reference Box */}
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 font-mono">
          <Info className="w-4 h-4 text-indigo-600" />
          Java Concurrency Rubric Pattern Implementation:
        </div>
        <p className="text-xs text-slate-800 leading-relaxed font-mono bg-white p-3.5 rounded-2xl border border-slate-200">
          Double-Checked Locking Singleton with <code className="text-indigo-700 font-bold">volatile</code>:
          <br/>
          <span className="text-slate-500">public static ConnectionPool getInstance() &#123;</span>
          <br/>
          &nbsp;&nbsp;<span className="text-slate-700">if (instance == null) &#123;</span>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-indigo-700 font-bold">synchronized (ConnectionPool.class)</span> &#123;
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-700">if (instance == null) instance = new ConnectionPool();</span>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&#125;
          <br/>
          &nbsp;&nbsp;&#125;
          <br/>
          &nbsp;&nbsp;<span className="text-emerald-700 font-bold">return instance;</span>
          <br/>
          <span className="text-slate-500">&#125;</span>
        </p>
      </div>

    </div>
  );
};
