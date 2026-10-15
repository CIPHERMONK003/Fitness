import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Dumbbell, 
  Activity, 
  Database, 
  Server, 
  Cpu, 
  Clock, 
  Search
} from 'lucide-react';
import { MemberUser, CoachUser, WorkoutPlan, AdminAuditEntry } from '../../types/fitness';

interface AdminPanelProps {
  members: MemberUser[];
  coaches: CoachUser[];
  plans: WorkoutPlan[];
  auditLogs: AdminAuditEntry[];
  onToggleUserStatus: (userId: string, newStatus: 'ACTIVE' | 'SUSPENDED') => void;
  onTogglePlanApproval: (planId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  members,
  coaches,
  plans,
  auditLogs,
  onToggleUserStatus,
  onTogglePlanApproval,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'USERS' | 'CONTENT' | 'TELEMETRY' | 'AUDIT'>('USERS');
  const [userSearch, setUserSearch] = useState('');

  const allUsers = [...members, ...coaches];
  const filteredUsers = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1 font-mono">
            <ShieldAlert className="w-4 h-4 text-rose-500" /> Root Administrative Control
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            THRYVE Platform Governance
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Oversee user accounts, exercise curriculum compliance, security authorizations, and database connectivity.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-700 font-mono font-medium">DB Connection Pool: Healthy</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('USERS')}
          className={`pb-3 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'USERS'
              ? 'border-rose-600 text-rose-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" /> User Account Directory ({allUsers.length})
        </button>

        <button
          onClick={() => setActiveSubTab('CONTENT')}
          className={`pb-3 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'CONTENT'
              ? 'border-rose-600 text-rose-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Dumbbell className="w-4 h-4" /> Curriculum Moderation ({plans.length})
        </button>

        <button
          onClick={() => setActiveSubTab('TELEMETRY')}
          className={`pb-3 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'TELEMETRY'
              ? 'border-rose-600 text-rose-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Server className="w-4 h-4" /> System Telemetry & JVM Health
        </button>

        <button
          onClick={() => setActiveSubTab('AUDIT')}
          className={`pb-3 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'AUDIT'
              ? 'border-rose-600 text-rose-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" /> Security Audit Log
        </button>
      </div>

      {/* Sub Tab: Users */}
      {activeSubTab === 'USERS' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden space-y-4 shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search users by name, email or role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Total Managed Users: {allUsers.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 uppercase font-mono text-[10px] text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{user.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                        user.role === 'COACH'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-slate-500">
                      {user.createdAt}
                    </td>

                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                        user.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {user.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      {user.status === 'ACTIVE' ? (
                        <button
                          onClick={() => onToggleUserStatus(user.id, 'SUSPENDED')}
                          className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-all"
                        >
                          Suspend Account
                        </button>
                      ) : (
                        <button
                          onClick={() => onToggleUserStatus(user.id, 'ACTIVE')}
                          className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold transition-all"
                        >
                          Reactivate Account
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub Tab: Content Moderation */}
      {activeSubTab === 'CONTENT' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Curriculum & Workout Approval Pipeline</h3>
            <span className="text-xs text-slate-500 font-mono">Total Plans: {plans.length}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {plans.map((plan) => (
              <div key={plan.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{plan.title}</span>
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {plan.category}
                    </span>
                    <span className="text-slate-500">• {plan.difficulty}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-1">{plan.description}</p>
                  <div className="text-[11px] text-slate-500">
                    Author: <span className="text-slate-800 font-semibold">{plan.coachName}</span> • {plan.exercises.length} Exercises included
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                    plan.isApproved
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {plan.isApproved ? 'APPROVED & PUBLISHED' : 'PENDING REVIEW'}
                  </span>

                  <button
                    onClick={() => onTogglePlanApproval(plan.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                      plan.isApproved
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 text-white shadow-md shadow-emerald-600/20'
                    }`}
                  >
                    {plan.isApproved ? 'Revoke Approval' : 'Approve & Publish'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab: Telemetry */}
      {activeSubTab === 'TELEMETRY' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-slate-500 font-mono">JVM Heap Memory</span>
              <Cpu className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">184 MB / 512 MB</div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full w-[36%]" />
            </div>
            <p className="text-[11px] text-slate-500">Garbage Collector: G1GC (Normal Overhead)</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-slate-500 font-mono">JDBC Connection Pool</span>
              <Database className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 font-mono">1 Active / 4 Idle</div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full w-[20%]" />
            </div>
            <p className="text-[11px] text-slate-500">Max Capacity: 5 Connections (Timeout: 5000ms)</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-slate-500 font-mono">Worker Thread Pool</span>
              <Activity className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-700 font-mono">4 Core / 8 Max</div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full w-[50%]" />
            </div>
            <p className="text-[11px] text-slate-500">Work Queue Depth: 0 tasks (ArrayBlockingQueue)</p>
          </div>
        </div>
      )}

      {/* Sub Tab: Audit Log */}
      {activeSubTab === 'AUDIT' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Security & System Audit Log</h3>
            <span className="text-xs text-slate-500 font-mono">AuthFilter / Servlet Events</span>
          </div>

          <div className="divide-y divide-slate-100 font-mono text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.severity === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : log.severity === 'WARNING'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {log.severity}
                  </span>
                  <div>
                    <span className="text-slate-900 font-bold">{log.action}</span>
                    <span className="text-slate-500 ml-2">by {log.actor} on {log.target}</span>
                  </div>
                </div>

                <div className="text-slate-400 text-[11px]">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
