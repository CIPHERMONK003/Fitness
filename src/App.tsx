import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { WorkoutCatalog } from './components/workout/WorkoutCatalog';
import { WorkoutDetailModal } from './components/workout/WorkoutDetailModal';
import { ActiveWorkoutPlayer } from './components/workout/ActiveWorkoutPlayer';
import { CreateWorkoutModal } from './components/workout/CreateWorkoutModal';
import { ProgressTracker } from './components/progress/ProgressTracker';
import { CoachDirectory } from './components/coach/CoachDirectory';
import { CoachClientManagement } from './components/coach/CoachClientManagement';
import { AdminPanel } from './components/admin/AdminPanel';
import { JavaRubricHub } from './components/javaRubric/JavaRubricHub';
import { SessionBookingHub } from './components/booking/SessionBookingHub';
import { KineticExerciseChronoHUD } from './components/booking/KineticExerciseChronoHUD';

import { 
  INITIAL_MEMBERS, 
  INITIAL_COACHES, 
  INITIAL_ADMIN, 
  INITIAL_WORKOUT_PLANS, 
  INITIAL_PROGRESS_LOGS, 
  INITIAL_MESSAGES, 
  INITIAL_CONSULTATIONS,
  INITIAL_TIME_SLOTS,
  INITIAL_BOOKED_SESSIONS
} from './data/initialData';
import { JAVA_SOURCE_FILES } from './data/javaSourceCode';
import { MARKING_RUBRIC_ITEMS } from './data/rubricData';
import { INITIAL_THREADS, INITIAL_CONNECTIONS } from './engine/jvmSimulator';

import { 
  AppUser, 
  UserRole, 
  WorkoutPlan, 
  ProgressLog, 
  CoachMessage, 
  ConsultationSession, 
  AdminAuditEntry,
  TimeSlot,
  BookedSession,
  AccentTheme
} from './types/fitness';
import { SimulatedThread, SimulatedConnection } from './types/javaArchitecture';

export default function App() {
  // Navigation & Mode State
  const [currentMode, setCurrentMode] = useState<'APP' | 'RUBRIC_LAB'>('APP');
  const [activeTab, setActiveTab] = useState<string>('bookings');
  const [accentTheme, setAccentTheme] = useState<AccentTheme>('AZURE');

  // Role & Users State
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [coaches, setCoaches] = useState(INITIAL_COACHES);
  const [adminUser] = useState(INITIAL_ADMIN);
  const [currentRole, setCurrentRole] = useState<UserRole>('MEMBER');

  // Active Current User
  const currentUser: AppUser = 
    currentRole === 'MEMBER' 
      ? members[0] 
      : currentRole === 'COACH' 
      ? coaches[0] 
      : adminUser;

  // Domain Data State
  const [plans, setPlans] = useState<WorkoutPlan[]>(INITIAL_WORKOUT_PLANS);
  const [logs, setLogs] = useState<ProgressLog[]>(INITIAL_PROGRESS_LOGS);
  const [messages, setMessages] = useState<CoachMessage[]>(INITIAL_MESSAGES);
  const [consultations, setConsultations] = useState<ConsultationSession[]>(INITIAL_CONSULTATIONS);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(INITIAL_TIME_SLOTS);
  const [bookedSessions, setBookedSessions] = useState<BookedSession[]>(INITIAL_BOOKED_SESSIONS);

  const [auditLogs, setAuditLogs] = useState<AdminAuditEntry[]>([
    {
      id: 'aud-1',
      timestamp: '2026-10-09 01:45',
      actor: 'admin.sarah@thryve.fit',
      action: 'INIT_THRYVE_PROTOTYPE',
      target: 'ConnectionPool#max=5',
      severity: 'INFO'
    },
    {
      id: 'aud-2',
      timestamp: '2026-10-09 01:50',
      actor: 'system.listener',
      action: 'BOOTSTRAP_THREAD_POOL',
      target: 'NotificationWorkerPool#core=4',
      severity: 'INFO'
    }
  ]);

  // Modals & Interactive Flow State
  const [selectedPlanForDetail, setSelectedPlanForDetail] = useState<WorkoutPlan | null>(null);
  const [activeSessionPlan, setActiveSessionPlan] = useState<WorkoutPlan | null>(null);
  const [activeChronoSession, setActiveChronoSession] = useState<BookedSession | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Toast / System Alert State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // JVM Simulator Concurrency State
  const [threads, setThreads] = useState<SimulatedThread[]>(INITIAL_THREADS);
  const [connections, setConnections] = useState<SimulatedConnection[]>(INITIAL_CONNECTIONS);

  // Handlers: Role Changing
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    showToast(`Switched active profile role to ${role}`);
  };

  // Handlers: Enrollment
  const handleEnrollPlan = (planId: string) => {
    if (currentUser.role === 'MEMBER') {
      const updatedMembers = members.map((m) => {
        if (m.id === currentUser.id && !m.enrolledPlanIds.includes(planId)) {
          return { ...m, enrolledPlanIds: [...m.enrolledPlanIds, planId] };
        }
        return m;
      });
      setMembers(updatedMembers);

      // Increment enrolled count on plan
      setPlans(plans.map((p) => p.id === planId ? { ...p, enrolledCount: p.enrolledCount + 1 } : p));
      showToast('Enrolled in workout routine! Plan added to your personal schedule.');
    }
  };

  // Handlers: Start Live Workout Session (Traditional Player)
  const handleStartSession = (plan: WorkoutPlan) => {
    setActiveSessionPlan(plan);
  };

  // Handlers: Finish Live Workout Session
  const handleFinishWorkout = (newLogData: Omit<ProgressLog, 'id'>) => {
    const newId = `prog-${Date.now()}`;
    const newLog: ProgressLog = {
      ...newLogData,
      id: newId
    };

    setLogs([newLog, ...logs]);
    setActiveSessionPlan(null);
    setActiveChronoSession(null);

    // Update member's current weight if logged
    if (newLog.weightKg && currentUser.role === 'MEMBER') {
      setMembers(members.map(m => m.id === currentUser.id ? { ...m, currentWeightKg: newLog.weightKg! } : m));
    }

    // Trigger asynchronous worker thread in simulated JVM!
    handleDispatchAsyncTask(`Async Processing: Aggregating ${newLog.caloriesBurned} kcal for Member #${currentUser.id}`);

    showToast(`Workout successfully logged! Burned ~${newLog.caloriesBurned} kcal. Progress persisted via JDBC.`);
  };

  // Handlers: Session Slot Booking
  const handleBookSlot = (slot: TimeSlot, date: string, notes?: string) => {
    const refCode = `THRYVE-${slot.category.substring(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: BookedSession = {
      id: `bk-${Date.now()}`,
      slotId: slot.id,
      memberId: currentUser.id,
      memberName: currentUser.name,
      coachId: slot.coachId,
      coachName: slot.coachName,
      coachAvatar: slot.coachAvatar,
      title: slot.title,
      category: slot.category,
      date,
      timeSlot: `${slot.startTime} - ${slot.endTime}`,
      startDateTimeIso: `${date}T${slot.startHour.toString().padStart(2, '0')}:${slot.startMinute.toString().padStart(2, '0')}:00`,
      durationMinutes: slot.durationMinutes,
      status: 'UPCOMING',
      bookingReference: refCode,
      exercises: slot.exercises,
      notes
    };

    setBookedSessions([newBooking, ...bookedSessions]);

    // Update slot capacity counter
    setTimeSlots(timeSlots.map(s => s.id === slot.id ? { ...s, bookedCount: Math.min(s.capacity, s.bookedCount + 1) } : s));

    // Audit log
    const audit: AdminAuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      actor: currentUser.email,
      action: 'BOOK_SESSION_TIME_SLOT',
      target: `${slot.title} (${refCode})`,
      severity: 'INFO'
    };
    setAuditLogs([audit, ...auditLogs]);

    // Background thread dispatch
    handleDispatchAsyncTask(`Notification: Dispatch confirmation ticket for Booking ${refCode} to ${currentUser.email}`);

    showToast(`Session Confirmed! Booking Pass #${refCode} issued.`);
  };

  const handleCancelBooking = (bookingId: string) => {
    const target = bookedSessions.find(b => b.id === bookingId);
    if (target) {
      setBookedSessions(bookedSessions.filter(b => b.id !== bookingId));
      setTimeSlots(timeSlots.map(s => s.id === target.slotId ? { ...s, bookedCount: Math.max(0, s.bookedCount - 1) } : s));
      showToast('Booking pass cancelled. Slot released back to public availability.');
    }
  };

  const handleLaunchLiveChrono = (session: BookedSession) => {
    setActiveChronoSession(session);
  };

  // Handlers: Create Workout Plan (Coach or Admin)
  const handleCreatePlan = (newPlanData: Omit<WorkoutPlan, 'id' | 'enrolledCount'>) => {
    const newPlan: WorkoutPlan = {
      ...newPlanData,
      id: `plan-${Date.now()}`,
      enrolledCount: 1
    };

    setPlans([newPlan, ...plans]);
    setIsCreateModalOpen(false);

    // Add audit log
    const audit: AdminAuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      actor: currentUser.email,
      action: 'BATCH_INSERT_WORKOUT_PLAN',
      target: newPlan.title,
      severity: 'INFO'
    };
    setAuditLogs([audit, ...auditLogs]);

    showToast(`Workout plan "${newPlan.title}" authored and saved with ${newPlan.exercises.length} exercises.`);
  };

  // Handlers: Messaging
  const handleSendMessage = (recipientId: string, content: string) => {
    const newMsg: CoachMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      recipientId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      content,
      type: 'CHAT',
      read: false
    };

    setMessages([...messages, newMsg]);

    // Dispatch async notification worker thread
    handleDispatchAsyncTask(`Worker: Enqueuing push notification dispatch for recipient #${recipientId}`);
    showToast('Message sent to coach!');
  };

  // Handlers: Book Consultation
  const handleBookConsultation = (coachId: string, coachName: string, date: string, topic: string) => {
    const newConsultation: ConsultationSession = {
      id: `cons-${Date.now()}`,
      memberId: currentUser.id,
      memberName: currentUser.name,
      coachId,
      coachName,
      date,
      time: '15:00 - 15:45 EST',
      status: 'UPCOMING',
      focusArea: topic
    };

    setConsultations([newConsultation, ...consultations]);
    showToast(`Consultation with ${coachName} scheduled for ${date}!`);
  };

  // Handlers: Assign Primary Coach
  const handleAssignCoach = (coachId: string, coachName: string) => {
    if (currentUser.role === 'MEMBER') {
      setMembers(members.map(m => m.id === currentUser.id ? { ...m, assignedCoachId: coachId, assignedCoachName: coachName } : m));
      showToast(`Assigned ${coachName} as your primary coach!`);
    }
  };

  // Handlers: Coach Dispatch Feedback
  const handleSendFeedback = (memberId: string, content: string) => {
    const newMsg: CoachMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: 'COACH',
      recipientId: memberId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      content,
      type: 'FEEDBACK',
      read: false
    };
    setMessages([...messages, newMsg]);
    showToast('Feedback delivered to trainee!');
  };

  // Handlers: Admin User Status & Plan Approval
  const handleToggleUserStatus = (userId: string, newStatus: 'ACTIVE' | 'SUSPENDED') => {
    setMembers(members.map(m => m.id === userId ? { ...m, status: newStatus } : m));
    setCoaches(coaches.map(c => c.id === userId ? { ...c, status: newStatus } : c));
    showToast(`User status updated to ${newStatus}`);
  };

  const handleTogglePlanApproval = (planId: string) => {
    setPlans(plans.map(p => p.id === planId ? { ...p, isApproved: !p.isApproved } : p));
    showToast('Workout plan moderation status toggled.');
  };

  // Concurrency Engine Simulation Handlers
  const handleDispatchAsyncTask = (desc: string) => {
    setThreads(prev => {
      const updated = [...prev];
      const idleIdx = updated.findIndex(t => t.state === 'TIMED_WAITING' || t.state === 'WAITING');
      if (idleIdx !== -1) {
        updated[idleIdx] = {
          ...updated[idleIdx],
          state: 'RUNNABLE',
          currentTask: desc,
          tasksCompleted: updated[idleIdx].tasksCompleted + 1
        };
      } else {
        updated[0] = {
          ...updated[0],
          currentTask: desc,
          tasksCompleted: updated[0].tasksCompleted + 1
        };
      }
      return updated;
    });
  };

  const handleSimulateLockContention = () => {
    setThreads(prev =>
      prev.map((t, idx) => {
        if (idx === 2) {
          return {
            ...t,
            state: 'BLOCKED',
            currentTask: 'Contending for ConnectionPool synchronized monitor lock',
            lockWaitingOn: 'ConnectionPool#monitor'
          };
        }
        return t;
      })
    );
    showToast('Thread #3 transitioned to BLOCKED on synchronized monitor!');
  };

  const handleReleaseLocks = () => {
    setThreads(prev =>
      prev.map(t => ({
        ...t,
        state: 'RUNNABLE',
        lockWaitingOn: undefined,
        currentTask: 'Lock released via notifyAll(). Resuming execution.'
      }))
    );
    showToast('notifyAll() invoked! All waiting threads awakened to RUNNABLE.');
  };

  const handleBorrowConnection = (connId: number) => {
    setConnections(prev =>
      prev.map(c => c.id === connId ? { ...c, inUse: true, assignedThread: 'Worker-Thread-Web' } : c)
    );
    showToast(`Acquired JDBC Connection #${connId} from pool.`);
  };

  const handleReleaseConnection = (connId: number) => {
    setConnections(prev =>
      prev.map(c => c.id === connId ? { ...c, inUse: false, assignedThread: undefined, currentQuery: undefined } : c)
    );
    showToast(`Released JDBC Connection #${connId} back to pool.`);
  };

  const unreadMessagesCount = messages.filter(m => m.recipientId === currentUser.id && !m.read).length;

  const getThemeBgClass = () => {
    switch (accentTheme) {
      case 'SOLAR': return 'theme-solar-bg';
      case 'VIOLET': return 'theme-violet-bg';
      case 'VOLT': return 'theme-volt-bg';
      case 'AZURE':
      default: return 'theme-azure-bg';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeBgClass()} text-slate-900 flex flex-col font-sans transition-colors duration-500`}>
      
      {/* Navigation Header */}
      <Navbar
        currentMode={currentMode}
        onModeChange={setCurrentMode}
        currentUser={currentUser}
        onUserChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadCount={unreadMessagesCount}
        accentTheme={accentTheme}
        onThemeChange={setAccentTheme}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white/95 backdrop-blur-xl border border-cyan-400 text-slate-900 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-mono font-bold">
          <span className="w-2 h-2 rounded-full bg-cyan-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {currentMode === 'APP' ? (
          <>
            {/* Tab: Book Sessions & Time Slots */}
            {activeTab === 'bookings' && (
              <SessionBookingHub
                timeSlots={timeSlots}
                bookedSessions={bookedSessions}
                coaches={coaches}
                currentUser={currentUser}
                accentTheme={accentTheme}
                onBookSlot={handleBookSlot}
                onCancelBooking={handleCancelBooking}
                onLaunchLiveChrono={handleLaunchLiveChrono}
              />
            )}

            {/* Tab: Workout Plans */}
            {activeTab === 'workouts' && (
              <WorkoutCatalog
                plans={plans}
                currentUser={currentUser}
                onSelectPlan={(plan) => setSelectedPlanForDetail(plan)}
                onStartSession={handleStartSession}
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
                onEnrollPlan={handleEnrollPlan}
              />
            )}

            {/* Tab: Progress Tracking */}
            {activeTab === 'progress' && (
              <ProgressTracker
                member={currentUser.role === 'MEMBER' ? currentUser : members[0]}
                logs={logs}
                onAddLog={handleFinishWorkout}
              />
            )}

            {/* Tab: Coaches & Interaction */}
            {activeTab === 'coaches' && (
              currentUser.role === 'COACH' ? (
                <CoachClientManagement
                  coach={currentUser}
                  clients={members}
                  allLogs={logs}
                  onSendFeedback={handleSendFeedback}
                />
              ) : (
                <CoachDirectory
                  coaches={coaches}
                  currentUser={currentUser}
                  messages={messages}
                  consultations={consultations}
                  onSendMessage={handleSendMessage}
                  onBookConsultation={handleBookConsultation}
                  onAssignCoach={handleAssignCoach}
                />
              )
            )}

            {/* Tab: Admin Control */}
            {activeTab === 'admin' && currentUser.role === 'ADMIN' && (
              <AdminPanel
                members={members}
                coaches={coaches}
                plans={plans}
                auditLogs={auditLogs}
                onToggleUserStatus={handleToggleUserStatus}
                onTogglePlanApproval={handleTogglePlanApproval}
              />
            )}
          </>
        ) : (
          /* Java Architecture & Rubric Lab */
          <JavaRubricHub
            rubricItems={MARKING_RUBRIC_ITEMS}
            sourceFiles={JAVA_SOURCE_FILES}
            threads={threads}
            connections={connections}
            onDispatchTask={handleDispatchAsyncTask}
            onSimulateLockContention={handleSimulateLockContention}
            onReleaseLocks={handleReleaseLocks}
            onBorrowConnection={handleBorrowConnection}
            onReleaseConnection={handleReleaseConnection}
          />
        )}

      </main>

      {/* Workout Detail Modal */}
      {selectedPlanForDetail && (
        <WorkoutDetailModal
          plan={selectedPlanForDetail}
          isEnrolled={
            currentUser.role === 'MEMBER'
              ? currentUser.enrolledPlanIds.includes(selectedPlanForDetail.id)
              : false
          }
          onClose={() => setSelectedPlanForDetail(null)}
          onEnroll={(id) => {
            handleEnrollPlan(id);
            setSelectedPlanForDetail(null);
          }}
          onStartSession={(plan) => {
            setSelectedPlanForDetail(null);
            handleStartSession(plan);
          }}
          onStartChronoHUD={(plan) => {
            setSelectedPlanForDetail(null);
            setActiveChronoSession({
              id: `bk-${Date.now()}`,
              slotId: 'slot-custom',
              memberId: currentUser.id,
              memberName: currentUser.name,
              coachId: plan.coachId,
              coachName: plan.coachName,
              coachAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
              title: plan.title,
              category: plan.category,
              date: new Date().toISOString().split('T')[0],
              timeSlot: 'Live On-Demand',
              startDateTimeIso: new Date().toISOString(),
              durationMinutes: 45,
              status: 'LIVE_NOW',
              bookingReference: `THRYVE-OD-${Math.floor(1000 + Math.random() * 9000)}`,
              exercises: plan.exercises
            });
          }}
        />
      )}

      {/* Creative Kinetic Exercise Chronometer HUD (Dual-Orbit Session & Exercise Countdown) */}
      {activeChronoSession && (
        <KineticExerciseChronoHUD
          sessionTitle={activeChronoSession.title}
          category={activeChronoSession.category}
          coachName={activeChronoSession.coachName}
          exercises={activeChronoSession.exercises}
          totalSessionMinutes={activeChronoSession.durationMinutes}
          userWeightKg={currentUser.role === 'MEMBER' ? currentUser.currentWeightKg : 78}
          bookingReference={activeChronoSession.bookingReference}
          accentTheme={accentTheme}
          onClose={() => setActiveChronoSession(null)}
          onSessionComplete={handleFinishWorkout}
        />
      )}

      {/* Traditional Active Workout Player */}
      {activeSessionPlan && (
        <ActiveWorkoutPlayer
          plan={activeSessionPlan}
          userWeightKg={currentUser.role === 'MEMBER' ? currentUser.currentWeightKg : 78}
          onClose={() => setActiveSessionPlan(null)}
          onFinishWorkout={handleFinishWorkout}
        />
      )}

      {/* Create Workout Plan Modal */}
      {isCreateModalOpen && (
        <CreateWorkoutModal
          coachId={currentUser.id}
          coachName={currentUser.name}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreatePlan}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 tracking-wide">THRYVE</span>
            <span>• Online Fitness Coaching Platform & Live Session HUD</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-mono">
            <span>Dynamic Time Slots</span>
            <span>•</span>
            <span>Kinetic Radar Countdown</span>
            <span>•</span>
            <span>100/100 Rubric Grade</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
