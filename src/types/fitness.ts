export type UserRole = 'MEMBER' | 'COACH' | 'ADMIN';
export type AccentTheme = 'AZURE' | 'SOLAR' | 'VIOLET' | 'VOLT';

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  createdAt: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
}

export interface MemberUser extends BaseUser {
  role: 'MEMBER';
  fitnessGoal: 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'ENDURANCE' | 'ATHLETIC_PERFORMANCE' | 'FLEXIBILITY';
  currentWeightKg: number;
  targetWeightKg: number;
  heightCm: number;
  assignedCoachId?: string;
  assignedCoachName?: string;
  enrolledPlanIds: string[];
  activePlanId?: string;
}

export interface CoachUser extends BaseUser {
  role: 'COACH';
  specialties: string[];
  bio: string;
  certification: string;
  rating: number;
  reviewCount: number;
  activeClientCount: number;
  hourlyRate: number;
  availableDays: string[];
}

export interface AdminUser extends BaseUser {
  role: 'ADMIN';
  permissions: string[];
  department: string;
}

export type AppUser = MemberUser | CoachUser | AdminUser;

export type WorkoutCategory = 'STRENGTH' | 'CARDIO' | 'HIIT' | 'CALISTHENICS' | 'MOBILITY';
export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: number | string;
  restSec: number;
  durationSec?: number;
  instructions: string;
  videoThumb?: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  category: WorkoutCategory;
  difficulty: DifficultyLevel;
  durationWeeks: number;
  estimatedCaloriesBurn: number;
  daysPerWeek: number;
  coachId: string;
  coachName: string;
  isApproved: boolean;
  enrolledCount: number;
  tags: string[];
  exercises: Exercise[];
  polymorphicRule: string; // Specific calculation logic representation
}

export interface ProgressLog {
  id: string;
  memberId: string;
  date: string;
  workoutPlanId?: string;
  workoutTitle: string;
  durationMinutes: number;
  caloriesBurned: number;
  weightKg?: number;
  notes: string;
  perceivedEffort: number; // 1-10
  exercisesCompleted: {
    exerciseName: string;
    setsCompleted: number;
    topWeightKg?: number;
    repsCompleted: number;
  }[];
}

export interface CoachMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  timestamp: string;
  content: string;
  type: 'CHAT' | 'FEEDBACK' | 'PLAN_RECOMMENDATION';
  read: boolean;
}

export interface ConsultationSession {
  id: string;
  memberId: string;
  memberName: string;
  coachId: string;
  coachName: string;
  date: string;
  time: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  focusArea: string;
}

export interface TimeSlot {
  id: string;
  startTime: string; // e.g. "08:00 AM"
  endTime: string;   // e.g. "08:45 AM"
  startHour: number; // 24-hr representation for calculations
  startMinute: number;
  coachId: string;
  coachName: string;
  coachAvatar: string;
  title: string;
  category: WorkoutCategory;
  durationMinutes: number;
  capacity: number;
  bookedCount: number;
  location: string;
  exercises: Exercise[];
}

export interface BookedSession {
  id: string;
  slotId: string;
  memberId: string;
  memberName: string;
  coachId: string;
  coachName: string;
  coachAvatar: string;
  title: string;
  category: WorkoutCategory;
  date: string; // "YYYY-MM-DD"
  timeSlot: string; // "09:00 AM - 09:45 AM"
  startDateTimeIso: string;
  durationMinutes: number;
  status: 'UPCOMING' | 'LIVE_NOW' | 'COMPLETED' | 'CANCELLED';
  bookingReference: string;
  exercises: Exercise[];
  notes?: string;
}

export interface AdminAuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface SystemMetrics {
  activeSessions: number;
  jvmMemoryUsedMb: number;
  jvmMemoryMaxMb: number;
  dbPoolActive: number;
  dbPoolIdle: number;
  totalWorkoutsCompleted: number;
  totalActiveMembers: number;
}
