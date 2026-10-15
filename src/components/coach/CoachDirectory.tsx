import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  Calendar, 
  Award, 
  Users, 
  CheckCircle, 
  Sparkles,
  ArrowRight,
  Zap,
  Check
} from 'lucide-react';
import { CoachUser, AppUser, ConsultationSession, CoachMessage } from '../../types/fitness';
import { CoachChatModal } from './CoachChatModal';

interface CoachDirectoryProps {
  coaches: CoachUser[];
  currentUser: AppUser;
  messages: CoachMessage[];
  consultations: ConsultationSession[];
  onSendMessage: (coachId: string, content: string) => void;
  onBookConsultation: (coachId: string, coachName: string, date: string, topic: string) => void;
  onAssignCoach: (coachId: string, coachName: string) => void;
}

export const CoachDirectory: React.FC<CoachDirectoryProps> = ({
  coaches,
  currentUser,
  messages,
  consultations,
  onSendMessage,
  onBookConsultation,
  onAssignCoach,
}) => {
  const [activeChatCoach, setActiveChatCoach] = useState<CoachUser | null>(null);
  const [bookingCoach, setBookingCoach] = useState<CoachUser | null>(null);
  const [consultTopic, setConsultTopic] = useState('Biomechanics Video Review & Periodization Block');
  const [consultDate, setConsultDate] = useState('2026-10-18');

  const assignedCoachId = currentUser.role === 'MEMBER' ? currentUser.assignedCoachId : undefined;

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingCoach) return;
    onBookConsultation(bookingCoach.id, bookingCoach.name, consultDate, consultTopic);
    setBookingCoach(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-800 text-xs font-mono font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-cyan-600" />
            <span>ACCREDITED NSCA & DPT SPECIALISTS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            THRYVE Master Coaching Network
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Collaborate directly with Olympic strength coaches and doctors of physical therapy. Receive video form critiques, periodized block modifications, and 1-on-1 consultations.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2.5 rounded-2xl border border-slate-200 font-mono text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 animate-pulse" />
          <span className="text-slate-900 font-bold">{coaches.length} Master Trainers Active</span>
        </div>
      </div>

      {/* Coach Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map((coach) => {
          const isAssigned = assignedCoachId === coach.id;

          return (
            <div
              key={coach.id}
              className={`bg-white border rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                isAssigned 
                  ? 'border-cyan-500 ring-2 ring-cyan-500/20' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="p-6 space-y-4">
                
                {/* Header with Avatar and Rating */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={coach.avatar}
                      alt={coach.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-cyan-500 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base leading-snug">
                      {coach.name}
                    </h3>
                    <div className="text-[11px] text-cyan-700 font-mono font-semibold">
                      {coach.certification}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1.5 text-xs">
                      <div className="flex items-center text-amber-500 font-bold font-mono">
                        <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                        {coach.rating}
                      </div>
                      <span className="text-slate-500 text-[11px] font-mono">({coach.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {coach.bio}
                </p>

                {/* Specialties */}
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 font-mono">
                    Coaching Domains:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {coach.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="text-[10px] bg-cyan-50 text-cyan-800 border border-cyan-200 px-2.5 py-0.5 rounded-full font-mono font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Roster & Rate */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-xs flex justify-between items-center font-mono">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>{coach.activeClientCount} Trainees</span>
                  </div>
                  <div className="font-black text-slate-900">
                    ${coach.hourlyRate}<span className="text-[10px] text-slate-500 font-normal">/hr</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
                <button
                  onClick={() => setActiveChatCoach(coach)}
                  className="flex-1 py-2.5 px-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:brightness-105 text-white rounded-2xl text-xs font-black transition-all shadow-md shadow-cyan-600/20 flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat & Feedback</span>
                </button>

                <button
                  onClick={() => setBookingCoach(coach)}
                  className="py-2.5 px-3.5 bg-white hover:bg-slate-100 text-slate-700 rounded-2xl text-xs font-bold transition-all border border-slate-200 shadow-sm"
                  title="Schedule 1-on-1 Consultation"
                >
                  <Calendar className="w-3.5 h-3.5" />
                </button>

                {currentUser.role === 'MEMBER' && !isAssigned && (
                  <button
                    onClick={() => onAssignCoach(coach.id, coach.name)}
                    className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-600 hover:text-cyan-700 rounded-2xl text-xs font-semibold transition-all border border-slate-200"
                    title="Select as Primary Mentor"
                  >
                    Select
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Active Consultations List */}
      {consultations.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden mt-6 shadow-sm">
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-600" />
              Scheduled Video Consultations & Movement Reviews
            </h3>
            <span className="text-xs text-slate-500 font-mono font-bold">{consultations.length} Scheduled</span>
          </div>

          <div className="divide-y divide-slate-200">
            {consultations.map((c) => (
              <div key={c.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-black text-slate-900 text-sm">{c.focusArea}</div>
                  <div className="text-slate-500 mt-1 font-mono">
                    Lead: <strong className="text-slate-900">{c.coachName}</strong> • Trainee: <strong className="text-slate-900">{c.memberName}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-cyan-800 bg-cyan-100 px-3 py-1 rounded-xl border border-cyan-200">
                    {c.date} ({c.time})
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-150 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl">
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {activeChatCoach && (
        <CoachChatModal
          coach={activeChatCoach}
          currentUser={currentUser}
          messages={messages}
          onClose={() => setActiveChatCoach(null)}
          onSendMessage={(content) => {
            onSendMessage(activeChatCoach.id, content);
          }}
        />
      )}

      {/* Booking Modal */}
      {bookingCoach && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">
              Schedule Consultation with {bookingCoach.name}
            </h3>

            <form onSubmit={handleConfirmBooking} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-600 font-mono font-bold block mb-1">Target Consultation Date:</label>
                <input
                  type="date"
                  required
                  value={consultDate}
                  onChange={(e) => setConsultDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-slate-600 font-mono font-bold block mb-1">Session Agenda & Focus Area:</label>
                <input
                  type="text"
                  required
                  value={consultTopic}
                  onChange={(e) => setConsultTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setBookingCoach(null)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-600 hover:text-slate-900 rounded-2xl hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:brightness-105 text-white font-black rounded-2xl shadow-md shadow-cyan-600/20"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
