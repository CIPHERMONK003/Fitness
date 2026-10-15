import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Dumbbell, 
  CheckCircle2, 
  Send,
  Award
} from 'lucide-react';
import { CoachUser, MemberUser, ProgressLog } from '../../types/fitness';

interface CoachClientManagementProps {
  coach: CoachUser;
  clients: MemberUser[];
  allLogs: ProgressLog[];
  onSendFeedback: (memberId: string, content: string) => void;
}

export const CoachClientManagement: React.FC<CoachClientManagementProps> = ({
  coach,
  clients,
  allLogs,
  onSendFeedback,
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || 'usr-101');
  const [feedbackNote, setFeedbackNote] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];
  const clientLogs = allLogs.filter((l) => l.memberId === selectedClientId);

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackNote.trim() || !selectedClient) return;

    onSendFeedback(selectedClient.id, feedbackNote);
    setFeedbackNote('');
    setStatusMessage(`Technique feedback dispatched to ${selectedClient.name}`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700 uppercase tracking-wider mb-1 font-mono">
            <Award className="w-4 h-4 text-cyan-600" /> Coach Portal & Trainee Supervision
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Welcome Coach {coach.name}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Managing <span className="text-cyan-700 font-bold">{clients.length} Active Trainees</span> • {coach.certification}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-xs">
          <span className="text-slate-500">Coach Rating:</span>
          <span className="font-bold text-amber-500 font-mono text-sm">★ {coach.rating}</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">{coach.reviewCount} Reviews</span>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Grid: Client Selector and Client Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Client Roster Selector */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden h-fit shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-600" />
              Assigned Client Roster
            </h3>
            <span className="text-xs font-mono text-slate-500">{clients.length} Clients</span>
          </div>

          <div className="divide-y divide-slate-100">
            {clients.map((client) => {
              const isSelected = client.id === selectedClientId;
              return (
                <div
                  key={client.id}
                  onClick={() => setSelectedClientId(client.id)}
                  className={`p-4 cursor-pointer transition-all flex items-center gap-3 ${
                    isSelected ? 'bg-cyan-50/60 border-l-4 border-cyan-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <img
                    src={client.avatar}
                    alt={client.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 text-xs truncate">{client.name}</div>
                    <div className="text-[11px] text-cyan-700 font-mono">{client.fitnessGoal.replace('_', ' ')}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {client.currentWeightKg} kg (Target: {client.targetWeightKg} kg)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Client Profile, Recent Sessions & Feedback Box */}
        <div className="lg:col-span-2 space-y-6">
          {selectedClient && (
            <>
              {/* Selected Trainee Banner */}
              <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedClient.avatar}
                      alt={selectedClient.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm"
                    />
                    <div>
                      <h3 className="font-black text-slate-900 text-base">{selectedClient.name}</h3>
                      <p className="text-xs text-slate-500">{selectedClient.email}</p>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <span className="font-bold text-cyan-800 font-mono bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                      {selectedClient.fitnessGoal.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-xs text-center font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Current Weight</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedClient.currentWeightKg} kg</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Target Weight</span>
                    <span className="font-bold text-cyan-700 text-sm">{selectedClient.targetWeightKg} kg</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Height</span>
                    <span className="font-bold text-slate-700 text-sm">{selectedClient.heightCm} cm</span>
                  </div>
                </div>
              </div>

              {/* Provide Feedback Form */}
              <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-3 shadow-sm">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-600" />
                  Dispatch Coaching Feedback & Programming Notes
                </h4>
                
                <form onSubmit={handleSendNote} className="space-y-3 text-xs">
                  <textarea
                    rows={3}
                    required
                    value={feedbackNote}
                    onChange={(e) => setFeedbackNote(e.target.value)}
                    placeholder={`Write tailored coaching advice for ${selectedClient.name.split(' ')[0]} regarding recent form, load progression, or recovery...`}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white resize-none transition-colors"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:brightness-105 text-white font-bold rounded-2xl flex items-center gap-1.5 shadow-md shadow-cyan-600/20 text-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Feedback</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Recent Trainee Sessions */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-cyan-600" />
                    Verified Training Submissions ({clientLogs.length})
                  </h4>
                </div>

                <div className="divide-y divide-slate-100">
                  {clientLogs.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No workout sessions logged yet by this client.
                    </div>
                  ) : (
                    clientLogs.map((log) => (
                      <div key={log.id} className="p-4 space-y-2 text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-slate-900">{log.workoutTitle}</span>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {log.date} • {log.durationMinutes} mins • <span className="text-amber-600 font-mono font-bold">{log.caloriesBurned} kcal</span>
                            </div>
                          </div>
                          <span className="bg-slate-100 text-cyan-800 border border-slate-200 px-2 py-0.5 rounded font-mono font-bold">
                            RPE: {log.perceivedEffort}/10
                          </span>
                        </div>

                        {log.notes && (
                          <p className="text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                            Client note: "{log.notes}"
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
};
