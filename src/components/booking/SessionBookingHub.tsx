import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Play, 
  Zap, 
  Ticket, 
  Dumbbell, 
  Check, 
  Timer,
  X
} from 'lucide-react';
import { TimeSlot, BookedSession, CoachUser, AppUser, AccentTheme } from '../../types/fitness';

interface SessionBookingHubProps {
  timeSlots: TimeSlot[];
  bookedSessions: BookedSession[];
  coaches: CoachUser[];
  currentUser: AppUser;
  accentTheme: AccentTheme;
  onBookSlot: (slot: TimeSlot, date: string, notes?: string) => void;
  onCancelBooking: (bookingId: string) => void;
  onLaunchLiveChrono: (session: BookedSession) => void;
}

export const SessionBookingHub: React.FC<SessionBookingHubProps> = ({
  timeSlots,
  bookedSessions,
  coaches,
  currentUser,
  accentTheme,
  onBookSlot,
  onCancelBooking,
  onLaunchLiveChrono,
}) => {
  const [activeSubView, setActiveSubView] = useState<'EXPLORE_SLOTS' | 'MY_PASSES'>('EXPLORE_SLOTS');
  
  // Date selection state
  const dates = [
    { label: 'Today (Fri, Oct 9)', value: '2026-10-09', tag: 'HIGH ENERGY' },
    { label: 'Tomorrow (Sat, Oct 10)', value: '2026-10-10', tag: 'WEEKEND BLAST' },
    { label: 'Sun, Oct 11', value: '2026-10-11', tag: 'ACTIVE RECOVERY' },
    { label: 'Mon, Oct 12', value: '2026-10-12', tag: 'POWER BUILD' },
    { label: 'Tue, Oct 13', value: '2026-10-13', tag: 'METCON CORE' }
  ];
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-09');

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [coachFilter, setCoachFilter] = useState<string>('ALL');

  // Selected slot for confirmation modal
  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState<TimeSlot | null>(null);
  const [bookingNotes, setBookingNotes] = useState('');

  // Live countdown clock state for upcoming slots
  const [secondsUntilNextSession, setSecondsUntilNextSession] = useState(1124); // ~18m 44s
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilNextSession((prev) => (prev > 0 ? prev - 1 : 1800));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Color tokens based on accentTheme for light mode
  const getThemeStyles = () => {
    switch (accentTheme) {
      case 'AZURE':
        return {
          primaryGrad: 'from-cyan-500 via-sky-500 to-teal-500',
          accentText: 'text-cyan-700',
          accentBorder: 'border-cyan-200',
          accentBg: 'bg-cyan-50 text-cyan-800',
          btnPrimary: 'bg-gradient-to-r from-cyan-600 via-sky-600 to-teal-600 text-white hover:brightness-105 shadow-md shadow-cyan-600/20',
          badge: 'bg-cyan-50 text-cyan-800 border-cyan-200',
          glow: 'glow-cyan',
          barGrad: 'from-cyan-500 to-teal-500'
        };
      case 'SOLAR':
        return {
          primaryGrad: 'from-orange-500 via-amber-500 to-rose-500',
          accentText: 'text-orange-700',
          accentBorder: 'border-orange-200',
          accentBg: 'bg-orange-50 text-orange-800',
          btnPrimary: 'bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 text-white hover:brightness-105 shadow-md shadow-orange-500/20',
          badge: 'bg-orange-50 text-orange-800 border-orange-200',
          glow: 'glow-solar',
          barGrad: 'from-orange-500 to-rose-500'
        };
      case 'VIOLET':
        return {
          primaryGrad: 'from-violet-500 via-fuchsia-500 to-pink-500',
          accentText: 'text-violet-700',
          accentBorder: 'border-violet-200',
          accentBg: 'bg-violet-50 text-violet-800',
          btnPrimary: 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:brightness-105 shadow-md shadow-violet-600/20',
          badge: 'bg-violet-50 text-violet-800 border-violet-200',
          glow: 'glow-violet',
          barGrad: 'from-violet-500 to-fuchsia-500'
        };
      case 'VOLT':
      default:
        return {
          primaryGrad: 'from-emerald-500 via-teal-500 to-cyan-500',
          accentText: 'text-emerald-700',
          accentBorder: 'border-emerald-200',
          accentBg: 'bg-emerald-50 text-emerald-800',
          btnPrimary: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-105 shadow-md shadow-emerald-600/20',
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          glow: 'glow-volt',
          barGrad: 'from-emerald-500 to-teal-500'
        };
    }
  };

  const theme = getThemeStyles();

  // Filtered Slots
  const filteredSlots = timeSlots.filter((slot) => {
    const matchesCat = categoryFilter === 'ALL' || slot.category === categoryFilter;
    const matchesCoach = coachFilter === 'ALL' || slot.coachId === coachFilter;
    return matchesCat && matchesCoach;
  });

  // Check if member already booked a slot for the selected date
  const isSlotBookedByMember = (slotId: string) => {
    return bookedSessions.some(
      (b) => b.slotId === slotId && b.date === selectedDate && b.memberId === currentUser.id
    );
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotForBooking) return;
    onBookSlot(selectedSlotForBooking, selectedDate, bookingNotes);
    setSelectedSlotForBooking(null);
    setBookingNotes('');
    setActiveSubView('MY_PASSES');
  };

  // User's own bookings
  const myBookings = bookedSessions.filter((b) => b.memberId === currentUser.id);

  return (
    <div className="space-y-6">
      
      {/* Dynamic Light Hero Banner with Live Studio Clock */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-slate-50 to-cyan-50/40 border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-8 space-y-3">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme.accentBg} border ${theme.accentBorder} ${theme.accentText} text-xs font-mono font-bold`}>
              <Zap className="w-3.5 h-3.5" />
              <span>THRYVE KINETIC STUDIO RESERVATIONS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Reserve Studio Sessions & Live Exercise HUD
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed font-normal max-w-2xl">
              Select your personalized coaching time slot. Every booking unlocks the interactive <strong className="text-slate-900">Dual-Orbit Exercise Chrono</strong> with real-time countdown of time left, remaining sets, and exercise workload.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveSubView('EXPLORE_SLOTS')}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                  activeSubView === 'EXPLORE_SLOTS'
                    ? `${theme.btnPrimary}`
                    : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Available Slots ({filteredSlots.length})</span>
              </button>

              <button
                onClick={() => setActiveSubView('MY_PASSES')}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                  activeSubView === 'MY_PASSES'
                    ? `${theme.btnPrimary}`
                    : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>My Confirmed Passes ({myBookings.length})</span>
              </button>
            </div>
          </div>

          {/* Next Session Live Countdown Widget */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-slate-200 shadow-md flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-cyan-600" />
                <span>Live Studio Countdown</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200 font-bold">
                ACTIVE
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-500 font-medium">Next Live Slot Starts In:</div>
              <div className="text-3xl font-black text-slate-900 font-mono tracking-tight mt-0.5">
                {formatCountdown(secondsUntilNextSession)}
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                Curriculum: <strong className="text-slate-800">Spartan Athletic Engine</strong>
              </div>
            </div>

            {/* Instant Launcher for the live demo HUD */}
            <button
              onClick={() => {
                if (myBookings.length > 0) {
                  onLaunchLiveChrono(myBookings[0]);
                } else if (timeSlots.length > 0) {
                  const first = timeSlots[0];
                  onLaunchLiveChrono({
                    id: `ses-demo-${Date.now()}`,
                    slotId: first.id,
                    memberId: currentUser.id,
                    memberName: currentUser.name,
                    coachId: first.coachId,
                    coachName: first.coachName,
                    coachAvatar: first.coachAvatar,
                    title: first.title,
                    category: first.category,
                    date: selectedDate,
                    timeSlot: `${first.startTime} - ${first.endTime}`,
                    startDateTimeIso: new Date().toISOString(),
                    durationMinutes: first.durationMinutes,
                    status: 'LIVE_NOW',
                    bookingReference: 'THRYVE-LIVE-DEMO',
                    exercises: first.exercises
                  });
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:brightness-105 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Live Chrono HUD</span>
            </button>
          </div>

        </div>
      </div>

      {activeSubView === 'EXPLORE_SLOTS' ? (
        <div className="space-y-6">
          
          {/* Day Selector Ribbon */}
          <div className="bg-white p-3 rounded-3xl border border-slate-200 flex items-center gap-2 overflow-x-auto text-xs shadow-sm">
            <span className="text-slate-500 font-bold px-3 py-1 shrink-0 flex items-center gap-1.5 font-mono text-[11px]">
              <Calendar className="w-4 h-4 text-cyan-600" /> Select Date:
            </span>
            <div className="flex gap-2">
              {dates.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDate(d.value)}
                  className={`px-4 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap flex flex-col items-start border ${
                    selectedDate === d.value
                      ? `${theme.btnPrimary} font-bold shadow-sm`
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs">{d.label}</span>
                  <span className={`text-[9px] font-mono tracking-wider uppercase mt-0.5 ${
                    selectedDate === d.value ? 'text-cyan-100' : 'text-slate-400'
                  }`}>
                    {d.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Filter Bar with Discipline and Coach Pickers */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs shadow-sm">
            
            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider font-mono">Discipline:</span>
              {['ALL', 'STRENGTH', 'CARDIO', 'HIIT', 'CALISTHENICS'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    categoryFilter === cat
                      ? 'bg-slate-900 text-white shadow-sm font-bold'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {cat === 'ALL' ? 'All Disciplines' : cat}
                </button>
              ))}
            </div>

            {/* Coach Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider font-mono">Coach:</span>
              <select
                value={coachFilter}
                onChange={(e) => setCoachFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Master Coaches</option>
                {coaches.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Time Slots Grid: VIP Studio Pass Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSlots.map((slot, index) => {
              const alreadyBooked = isSlotBookedByMember(slot.id);
              const spotsLeft = Math.max(0, slot.capacity - slot.bookedCount);
              const isFull = spotsLeft === 0;
              const isLive = selectedDate === '2026-10-09' && index === 0;

              return (
                <div
                  key={slot.id}
                  className={`relative rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between border ${
                    alreadyBooked
                      ? `bg-cyan-50/30 ${theme.accentBorder} shadow-md ring-1 ${theme.accentBorder}`
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md shadow-sm'
                  }`}
                >
                  {/* Decorative glowing accent notch */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${theme.primaryGrad}`} />

                  <div className="p-6 space-y-4">
                    
                    {/* Header: Time Slot Pill & Live Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-100 text-slate-900 font-mono font-bold text-xs px-3.5 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
                          <Clock className={`w-3.5 h-3.5 ${theme.accentText}`} />
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono font-semibold">
                          {slot.durationMinutes}m
                        </span>
                      </div>

                      {isLive ? (
                        <span className="bg-cyan-100 text-cyan-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-cyan-300 flex items-center gap-1.5 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                          LIVE STUDIO
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-slate-200 font-mono">
                          {slot.category}
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug mt-1">
                        {slot.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{slot.location}</span>
                      </p>
                    </div>

                    {/* Coach Profile Card */}
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                      <img
                        src={slot.coachAvatar}
                        alt={slot.coachName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 text-xs truncate">{slot.coachName}</div>
                        <div className={`text-[10px] ${theme.accentText} font-mono font-semibold`}>Master Session Lead</div>
                      </div>
                    </div>

                    {/* Exercise Routine Sneak Peek */}
                    <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs font-mono">
                      <div className="text-[10px] text-slate-500 uppercase font-bold flex justify-between tracking-wider">
                        <span>Curriculum Movements</span>
                        <span className={theme.accentText}>{slot.exercises.length} Exercises</span>
                      </div>
                      <div className="space-y-1 text-slate-700">
                        {slot.exercises.slice(0, 2).map((ex) => (
                          <div key={ex.id} className="flex items-center justify-between text-[11px]">
                            <span className="truncate max-w-[190px] font-medium text-slate-800">• {ex.name}</span>
                            <span className="text-slate-500">{ex.sets} sets</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Capacity Indicator with sleek progress bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{spotsLeft} spot{spotsLeft === 1 ? '' : 's'} available</span>
                        </div>
                        <span className={`text-[11px] font-bold ${
                          spotsLeft <= 2 ? 'text-amber-600' : theme.accentText
                        }`}>
                          {slot.bookedCount}/{slot.capacity} Booked
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${theme.barGrad} transition-all duration-500`}
                          style={{ width: `${(slot.bookedCount / slot.capacity) * 100}%` }}
                        />
                      </div>
                    </div>

                  </div>

                  {/* Action Footer */}
                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
                    {alreadyBooked ? (
                      <div className="w-full flex gap-2">
                        <button
                          disabled
                          className={`flex-1 py-2.5 px-3 ${theme.accentBg} ${theme.accentText} border ${theme.accentBorder} text-xs font-bold rounded-xl flex items-center justify-center gap-1.5`}
                        >
                          <Check className="w-4 h-4" />
                          <span>PASS CONFIRMED</span>
                        </button>
                        <button
                          onClick={() => {
                            const match = bookedSessions.find(
                              (b) => b.slotId === slot.id && b.date === selectedDate
                            );
                            if (match) onLaunchLiveChrono(match);
                          }}
                          className={`py-2.5 px-4 ${theme.btnPrimary} text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5`}
                          title="Open Live Kinetic Chrono HUD"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Launch HUD</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        disabled={isFull}
                        onClick={() => setSelectedSlotForBooking(slot)}
                        className={`w-full py-2.5 px-4 text-xs font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 ${
                          isFull
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            : `${theme.btnPrimary} hover:scale-[1.01]`
                        }`}
                      >
                        <Ticket className="w-4 h-4" />
                        <span>{isFull ? 'Session Fully Booked' : 'Reserve Session Pass'}</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* MY CONFIRMED PASSES VIEW - VIP TICKET LOOK */
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
                  <Ticket className="w-5 h-5 text-cyan-600" />
                  Your Active THRYVE Studio Passes
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Verified reservation passes linked to live exercise tracking and coach feedback.
                </p>
              </div>
              <span className={`text-xs font-mono font-bold ${theme.accentText} ${theme.accentBg} px-3 py-1 rounded-full border ${theme.accentBorder}`}>
                {myBookings.length} Passes Active
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {myBookings.length === 0 ? (
                <div className="p-16 text-center text-slate-500 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                    <Ticket className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800">No active session passes</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      Choose an available time slot on the schedule to reserve your spot with our certified coaches.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveSubView('EXPLORE_SLOTS')}
                    className={`px-5 py-2.5 ${theme.btnPrimary} rounded-2xl text-xs font-bold transition-all shadow-sm`}
                  >
                    Browse Available Slots
                  </button>
                </div>
              ) : (
                myBookings.map((session) => (
                  <div key={session.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50 transition-colors">
                    
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs bg-cyan-100 text-cyan-800 px-3 py-1 rounded-xl border border-cyan-200 font-bold">
                          {session.bookingReference}
                        </span>
                        <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold border border-slate-200">
                          {session.category}
                        </span>
                        {session.status === 'LIVE_NOW' ? (
                          <span className="text-[10px] font-bold text-cyan-800 bg-cyan-100 px-3 py-0.5 rounded-full border border-cyan-300 font-mono flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                            LIVE NOW ON FLOOR
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 font-mono">
                            UPCOMING
                          </span>
                        )}
                      </div>

                      <h4 className="text-xl font-black text-slate-900">
                        {session.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-mono">
                        <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                          <Calendar className={`w-3.5 h-3.5 ${theme.accentText}`} />
                          {session.date}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-cyan-600" />
                          {session.timeSlot} ({session.durationMinutes} mins)
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <User className="w-3.5 h-3.5 text-amber-600" />
                          Coach: <strong className="text-slate-900">{session.coachName}</strong>
                        </span>
                      </div>

                      {/* Routine summary */}
                      <div className="text-xs text-slate-500 flex items-center gap-2 font-mono">
                        <Dumbbell className="w-3.5 h-3.5 text-slate-400" />
                        <span>Curriculum: {session.exercises.length} Exercises ({session.exercises.map(e => e.name).slice(0, 2).join(', ')}...)</span>
                      </div>
                    </div>

                    {/* Right side CTAs */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                      <button
                        onClick={() => onLaunchLiveChrono(session)}
                        className={`py-3 px-6 ${theme.btnPrimary} text-xs font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]`}
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>ENTER KINETIC CHRONO HUD</span>
                      </button>

                      <button
                        onClick={() => onCancelBooking(session.id)}
                        className="py-3 px-4 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-bold rounded-2xl border border-slate-200 hover:border-rose-300 transition-all"
                      >
                        Cancel Pass
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Confirmation Dialog */}
      {selectedSlotForBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Ticket className={`w-5 h-5 ${theme.accentText}`} />
                <h3 className="font-black text-slate-900 text-base">Confirm Studio Pass Reservation</h3>
              </div>
              <button
                onClick={() => setSelectedSlotForBooking(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm">{selectedSlotForBooking.title}</div>
                <div className="text-slate-600 flex items-center justify-between font-mono">
                  <span>Date: <strong className={theme.accentText}>{selectedDate}</strong></span>
                  <span>Time: <strong className="text-cyan-700">{selectedSlotForBooking.startTime} - {selectedSlotForBooking.endTime}</strong></span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  Supervised by: <strong className="text-slate-800">{selectedSlotForBooking.coachName}</strong>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  Session Focus & Personal Objectives (Optional):
                </label>
                <textarea
                  rows={2}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="e.g. Focus on deadlift lockout cues, or pushing VO2 max interval cadence..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 focus:outline-none focus:border-cyan-500 resize-none text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedSlotForBooking(null)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-2xl hover:bg-slate-200 font-bold text-xs"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className={`px-6 py-2.5 ${theme.btnPrimary} rounded-2xl font-bold text-xs shadow-md flex items-center gap-1.5`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Issue Confirmed Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
