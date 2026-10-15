import { MemberUser, CoachUser, AdminUser, WorkoutPlan, ProgressLog, CoachMessage, ConsultationSession, TimeSlot, BookedSession } from '../types/fitness';

export const INITIAL_MEMBERS: MemberUser[] = [
  {
    id: 'usr-101',
    name: 'Alex Rivera',
    email: 'alex.rivera@fitpulse.io',
    role: 'MEMBER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-12',
    status: 'ACTIVE',
    fitnessGoal: 'MUSCLE_GAIN',
    currentWeightKg: 78.4,
    targetWeightKg: 82.0,
    heightCm: 180,
    assignedCoachId: 'coach-201',
    assignedCoachName: 'Marcus Vance, CSCS',
    enrolledPlanIds: ['plan-01', 'plan-03'],
    activePlanId: 'plan-01',
  },
  {
    id: 'usr-102',
    name: 'Elena Rostova',
    email: 'elena.rostova@fitpulse.io',
    role: 'MEMBER',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-09-01',
    status: 'ACTIVE',
    fitnessGoal: 'ENDURANCE',
    currentWeightKg: 62.1,
    targetWeightKg: 60.0,
    heightCm: 168,
    assignedCoachId: 'coach-202',
    assignedCoachName: 'Dr. Chloe Lin, DPT',
    enrolledPlanIds: ['plan-02'],
    activePlanId: 'plan-02',
  },
  {
    id: 'usr-103',
    name: 'Devon Miller',
    email: 'devon.miller@fitpulse.io',
    role: 'MEMBER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-09-18',
    status: 'ACTIVE',
    fitnessGoal: 'WEIGHT_LOSS',
    currentWeightKg: 94.5,
    targetWeightKg: 85.0,
    heightCm: 175,
    assignedCoachId: 'coach-201',
    assignedCoachName: 'Marcus Vance, CSCS',
    enrolledPlanIds: ['plan-04'],
    activePlanId: 'plan-04',
  }
];

export const INITIAL_COACHES: CoachUser[] = [
  {
    id: 'coach-201',
    name: 'Marcus Vance, CSCS',
    email: 'marcus.vance@fitpulse.io',
    role: 'COACH',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15',
    status: 'ACTIVE',
    specialties: ['Hypertrophy', 'Olympic Weightlifting', 'Nutritional Periodization'],
    bio: 'Former collegiate strength coach with 11+ years guiding 400+ athletes. Specializes in progressive overload and science-based muscle hypertrophy.',
    certification: 'NSCA Certified Strength & Conditioning Specialist (CSCS)',
    rating: 4.94,
    reviewCount: 128,
    activeClientCount: 14,
    hourlyRate: 85,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Sat']
  },
  {
    id: 'coach-202',
    name: 'Dr. Chloe Lin, DPT',
    email: 'chloe.lin@fitpulse.io',
    role: 'COACH',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-10',
    status: 'ACTIVE',
    specialties: ['Functional Movement', 'Cardiovascular Endurance', 'Injury Prevention'],
    bio: 'Doctor of Physical Therapy and ultra-endurance athlete. Blends bio-mechanics analysis with high-efficiency metabolic conditioning.',
    certification: 'Doctor of Physical Therapy (DPT), ACSM-EP',
    rating: 4.98,
    reviewCount: 94,
    activeClientCount: 9,
    hourlyRate: 110,
    availableDays: ['Tue', 'Wed', 'Fri', 'Sun']
  },
  {
    id: 'coach-203',
    name: 'Tariq Al-Mansoor',
    email: 'tariq.mansoor@fitpulse.io',
    role: 'COACH',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-04-05',
    status: 'ACTIVE',
    specialties: ['HIIT & MetCon', 'Calisthenics', 'Fat Oxidation'],
    bio: 'Gymnast turned HIIT specialist. Focused on functional power, explosive core stability, and high caloric expenditure per session.',
    certification: 'NASM Master Trainer & FMS Certified',
    rating: 4.89,
    reviewCount: 76,
    activeClientCount: 11,
    hourlyRate: 75,
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat']
  }
];

export const INITIAL_ADMIN: AdminUser = {
  id: 'admin-001',
  name: 'Sarah Connor',
  email: 'admin.sarah@fitpulse.io',
  role: 'ADMIN',
  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  createdAt: '2026-01-01',
  status: 'ACTIVE',
  permissions: ['MANAGE_USERS', 'APPROVE_WORKOUTS', 'SYSTEM_AUDIT', 'DB_POOL_OVERRIDE'],
  department: 'System Architecture & Quality Engineering'
};

export const INITIAL_WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'plan-01',
    title: 'Hypertrophy Forge: Upper/Lower Split',
    description: 'A 4-day periodized resistance training regimen designed for maximal mechanical tension and muscle fiber recruitment.',
    category: 'STRENGTH',
    difficulty: 'INTERMEDIATE',
    durationWeeks: 8,
    estimatedCaloriesBurn: 460,
    daysPerWeek: 4,
    coachId: 'coach-201',
    coachName: 'Marcus Vance, CSCS',
    isApproved: true,
    enrolledCount: 142,
    tags: ['Barbell', 'Hypertrophy', 'Progressive Overload', 'Upper/Lower'],
    polymorphicRule: 'StrengthPlan.calculateCaloricBurn() uses Basal Metabolic Multiplier + (VolumeLoad * 0.045 kcal)',
    exercises: [
      {
        id: 'ex-1',
        name: 'Barbell Romanian Deadlift',
        muscleGroup: 'Hamstrings & Glutes',
        sets: 4,
        reps: '8-10',
        restSec: 90,
        instructions: 'Hinge at hips with neutral spine. Feel hamstring tension at knee pass, then thrust hips forward with glute squeeze.'
      },
      {
        id: 'ex-2',
        name: 'Incline Dumbbell Chest Press',
        muscleGroup: 'Upper Pectorals',
        sets: 4,
        reps: '10-12',
        restSec: 75,
        instructions: 'Set bench to 30 degrees. Retract scapula, lower dumbbells with elbows at 45 degrees, explode upward.'
      },
      {
        id: 'ex-3',
        name: 'Chest-Supported T-Bar Row',
        muscleGroup: 'Latissimus Dorsi & Rhomboids',
        sets: 3,
        reps: '10-12',
        restSec: 60,
        instructions: 'Drive with elbows back, squeeze shoulder blades together at peak contraction for 1 second.'
      },
      {
        id: 'ex-4',
        name: 'Bulgarian Split Squats',
        muscleGroup: 'Quadriceps & Glute Medius',
        sets: 3,
        reps: '10 each',
        restSec: 75,
        instructions: 'Rear foot elevated on bench. Lower hips vertically until front thigh is parallel with floor.'
      },
      {
        id: 'ex-5',
        name: 'Cable Triceps Rope Pushdown',
        muscleGroup: 'Triceps Lateral Head',
        sets: 3,
        reps: '12-15',
        restSec: 45,
        instructions: 'Lock elbows to ribs, fully extend downward and spread rope outwards at bottom lock.'
      }
    ]
  },
  {
    id: 'plan-02',
    title: 'Aerobic Threshold & V02 Max Surge',
    description: 'Evidence-backed cardiovascular conditioning protocol combining Zone 2 aerobic base building with high-intensity interval thresholds.',
    category: 'CARDIO',
    difficulty: 'ADVANCED',
    durationWeeks: 6,
    estimatedCaloriesBurn: 580,
    daysPerWeek: 5,
    coachId: 'coach-202',
    coachName: 'Dr. Chloe Lin, DPT',
    isApproved: true,
    enrolledCount: 88,
    tags: ['Endurance', 'VO2 Max', 'Zone 2', 'Running', 'Rowing'],
    polymorphicRule: 'CardioPlan.calculateCaloricBurn() integrates MET values * Weight * HeartRateReserve Factor',
    exercises: [
      {
        id: 'ex-6',
        name: 'Zone 2 Steady State Concept2 Row',
        muscleGroup: 'Cardiovascular & Full Body',
        sets: 1,
        reps: '30 mins',
        durationSec: 1800,
        restSec: 120,
        instructions: 'Maintain 65-75% maximum heart rate. Focus on smooth leg drive then arm stroke cadence.'
      },
      {
        id: 'ex-7',
        name: 'Incline Treadmill Strides (VO2 Max Intervals)',
        muscleGroup: 'Lower Extremities & Heart',
        sets: 6,
        reps: '3 mins on / 2 mins off',
        durationSec: 180,
        restSec: 120,
        instructions: 'Sprint at 10-12 km/h at 4% incline reaching 90% peak heart rate.'
      },
      {
        id: 'ex-8',
        name: 'Assault Bike Tabata Blast',
        muscleGroup: 'Full Body Conditioning',
        sets: 8,
        reps: '20s max / 10s rest',
        durationSec: 20,
        restSec: 10,
        instructions: 'Full effort sprint on assault air bike, pushing both handles and pedals continuously.'
      }
    ]
  },
  {
    id: 'plan-03',
    title: 'Metabolic Inferno: 30-Min High Intensity',
    description: 'Compound circuit designed to elevate EPOC (Excess Post-Exercise Oxygen Consumption) and shred body fat with rapid transitions.',
    category: 'HIIT',
    difficulty: 'INTERMEDIATE',
    durationWeeks: 4,
    estimatedCaloriesBurn: 510,
    daysPerWeek: 3,
    coachId: 'coach-203',
    coachName: 'Tariq Al-Mansoor',
    isApproved: true,
    enrolledCount: 215,
    tags: ['HIIT', 'Kettlebell', 'Fat Loss', 'Quick Workout'],
    polymorphicRule: 'HIITPlan.calculateCaloricBurn() applies High EPOC multiplier (1.35x baseline energy expenditure)',
    exercises: [
      {
        id: 'ex-9',
        name: 'Kettlebell Swing to Clean',
        muscleGroup: 'Posterior Chain',
        sets: 4,
        reps: '15 reps',
        restSec: 30,
        instructions: 'Explosive hip snap. Keep bell tucked close to torso during clean transition.'
      },
      {
        id: 'ex-10',
        name: 'Dumbbell Devil Press',
        muscleGroup: 'Chest, Shoulders & Core',
        sets: 4,
        reps: '10 reps',
        restSec: 40,
        instructions: 'Burpee with dumbbells on ground, jump up and swing dumbbells overhead in one continuous motion.'
      },
      {
        id: 'ex-11',
        name: 'Plyometric Box Jumps',
        muscleGroup: 'Quads & Calves',
        sets: 4,
        reps: '12 reps',
        restSec: 30,
        instructions: 'Explode from quarter squat, land softly on 24-inch plyo box with knees softly bent.'
      },
      {
        id: 'ex-12',
        name: 'Battle Ropes Alternating Waves',
        muscleGroup: 'Deltoids, Forearms & Core',
        sets: 4,
        reps: '45 seconds',
        durationSec: 45,
        restSec: 30,
        instructions: 'Stay in athletic stance, snap wrists rapidly creating tight waves to the anchor point.'
      }
    ]
  },
  {
    id: 'plan-04',
    title: 'Bodyweight Mastery & Kinetic Calisthenics',
    description: 'Master your own body mass through fundamental gymnastics strength, bar work, and scapular control.',
    category: 'CALISTHENICS',
    difficulty: 'BEGINNER',
    durationWeeks: 6,
    estimatedCaloriesBurn: 380,
    daysPerWeek: 3,
    coachId: 'coach-203',
    coachName: 'Tariq Al-Mansoor',
    isApproved: true,
    enrolledCount: 67,
    tags: ['Bodyweight', 'No Equipment', 'Core Strength', 'Mobility'],
    polymorphicRule: 'CalisthenicsPlan.calculateCaloricBurn() weighs relative body mass and leverages leverage difficulty coef.',
    exercises: [
      {
        id: 'ex-13',
        name: 'Strict Hollow Body Pull-Ups',
        muscleGroup: 'Lats & Core',
        sets: 4,
        reps: '6-8',
        restSec: 90,
        instructions: 'Toes pointed forward, posterior pelvic tilt. Pull chest to bar with zero kipping.'
      },
      {
        id: 'ex-14',
        name: 'Parallel Bar Dips',
        muscleGroup: 'Chest & Triceps',
        sets: 3,
        reps: '10-12',
        restSec: 75,
        instructions: 'Slight forward lean, descend until elbows hit 90 degrees, press up with locked triceps.'
      },
      {
        id: 'ex-15',
        name: 'Hanging Leg Raises to 90°',
        muscleGroup: 'Rectus Abdominis & Hip Flexors',
        sets: 3,
        reps: '12-15',
        restSec: 60,
        instructions: 'Dead hang from bar, contract abs to lift legs horizontally without swinging.'
      }
    ]
  }
];

export const INITIAL_PROGRESS_LOGS: ProgressLog[] = [
  {
    id: 'prog-01',
    memberId: 'usr-101',
    date: '2026-10-08',
    workoutPlanId: 'plan-01',
    workoutTitle: 'Hypertrophy Forge: Upper/Lower Split',
    durationMinutes: 52,
    caloriesBurned: 475,
    weightKg: 78.4,
    notes: 'Felt strong on Romanian Deadlifts! Hit new PR with 110kg x 8 reps.',
    perceivedEffort: 8,
    exercisesCompleted: [
      { exerciseName: 'Barbell Romanian Deadlift', setsCompleted: 4, topWeightKg: 110, repsCompleted: 8 },
      { exerciseName: 'Incline Dumbbell Chest Press', setsCompleted: 4, topWeightKg: 32, repsCompleted: 10 },
      { exerciseName: 'Chest-Supported T-Bar Row', setsCompleted: 3, topWeightKg: 45, repsCompleted: 12 },
      { exerciseName: 'Bulgarian Split Squats', setsCompleted: 3, topWeightKg: 20, repsCompleted: 10 }
    ]
  },
  {
    id: 'prog-02',
    memberId: 'usr-101',
    date: '2026-10-06',
    workoutPlanId: 'plan-01',
    workoutTitle: 'Hypertrophy Forge: Upper/Lower Split',
    durationMinutes: 48,
    caloriesBurned: 440,
    weightKg: 78.2,
    notes: 'Good upper body pump. Shoulder felt 100% stable on the incline presses.',
    perceivedEffort: 7,
    exercisesCompleted: [
      { exerciseName: 'Incline Dumbbell Chest Press', setsCompleted: 4, topWeightKg: 30, repsCompleted: 10 },
      { exerciseName: 'Chest-Supported T-Bar Row', setsCompleted: 3, topWeightKg: 40, repsCompleted: 12 },
      { exerciseName: 'Cable Triceps Rope Pushdown', setsCompleted: 3, topWeightKg: 25, repsCompleted: 14 }
    ]
  },
  {
    id: 'prog-03',
    memberId: 'usr-101',
    date: '2026-10-04',
    workoutPlanId: 'plan-03',
    workoutTitle: 'Metabolic Inferno: 30-Min High Intensity',
    durationMinutes: 32,
    caloriesBurned: 520,
    weightKg: 78.0,
    notes: 'Grueling circuit! Devil presses pushed my anaerobic capacity to the limit.',
    perceivedEffort: 9,
    exercisesCompleted: [
      { exerciseName: 'Kettlebell Swing to Clean', setsCompleted: 4, topWeightKg: 24, repsCompleted: 15 },
      { exerciseName: 'Dumbbell Devil Press', setsCompleted: 4, topWeightKg: 16, repsCompleted: 10 },
      { exerciseName: 'Plyometric Box Jumps', setsCompleted: 4, repsCompleted: 12 }
    ]
  },
  {
    id: 'prog-04',
    memberId: 'usr-101',
    date: '2026-10-01',
    workoutPlanId: 'plan-01',
    workoutTitle: 'Hypertrophy Forge: Upper/Lower Split',
    durationMinutes: 50,
    caloriesBurned: 460,
    weightKg: 77.8,
    notes: 'Baseline session after Coach Marcus revised my sets.',
    perceivedEffort: 7,
    exercisesCompleted: [
      { exerciseName: 'Barbell Romanian Deadlift', setsCompleted: 4, topWeightKg: 105, repsCompleted: 8 }
    ]
  }
];

export const INITIAL_MESSAGES: CoachMessage[] = [
  {
    id: 'msg-01',
    senderId: 'coach-201',
    senderName: 'Marcus Vance, CSCS',
    senderRole: 'COACH',
    recipientId: 'usr-101',
    timestamp: '2026-10-08 17:30',
    content: 'Awesome job on the RDL 110kg set today, Alex! Keep that hip hinge locked in and dont let the thoracic spine round on rep 8.',
    type: 'FEEDBACK',
    read: true
  },
  {
    id: 'msg-02',
    senderId: 'usr-101',
    senderName: 'Alex Rivera',
    senderRole: 'MEMBER',
    recipientId: 'coach-201',
    timestamp: '2026-10-08 18:15',
    content: 'Thanks Marcus! The cue about pushing the floor away really helped my balance. Should I bump the incline dumbbell press to 34kg next week?',
    type: 'CHAT',
    read: true
  },
  {
    id: 'msg-03',
    senderId: 'coach-201',
    senderName: 'Marcus Vance, CSCS',
    senderRole: 'COACH',
    recipientId: 'usr-101',
    timestamp: '2026-10-08 18:45',
    content: 'Yes, if you can hit 10 reps on your first two sets with 32kg, bump the first working set to 34kg for 6-8 reps. Quality over momentum.',
    type: 'CHAT',
    read: false
  }
];

export const INITIAL_CONSULTATIONS: ConsultationSession[] = [
  {
    id: 'cons-01',
    memberId: 'usr-101',
    memberName: 'Alex Rivera',
    coachId: 'coach-201',
    coachName: 'Marcus Vance, CSCS',
    date: '2026-10-14',
    time: '14:00 - 14:45 EST',
    status: 'UPCOMING',
    focusArea: 'Biomechanics Video Review & Periodization Block 2'
  },
  {
    id: 'cons-02',
    memberId: 'usr-102',
    memberName: 'Elena Rostova',
    coachId: 'coach-202',
    coachName: 'Dr. Chloe Lin, DPT',
    date: '2026-10-15',
    time: '10:30 - 11:15 EST',
    status: 'UPCOMING',
    focusArea: 'Lactate Threshold Testing & Half-Marathon Prep'
  }
];

export const INITIAL_TIME_SLOTS: TimeSlot[] = [
  {
    id: 'slot-101',
    startTime: '08:00 AM',
    endTime: '08:45 AM',
    startHour: 8,
    startMinute: 0,
    coachId: 'coach-201',
    coachName: 'Marcus Vance, CSCS',
    coachAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
    title: 'Morning Hypertrophy Heavy Split & Deadlift Mechanics',
    category: 'STRENGTH',
    durationMinutes: 45,
    capacity: 6,
    bookedCount: 4,
    location: 'THRYVE Iron Lab • Platform A',
    exercises: [
      {
        id: 'ex-slot-1',
        name: 'Trap Bar Deadlift (High Hex)',
        muscleGroup: 'Posterior Chain & Quads',
        sets: 4,
        reps: '6-8',
        restSec: 90,
        instructions: 'Hip hinge drive, engage lats, press floor away with neutral neck.'
      },
      {
        id: 'ex-slot-2',
        name: 'Incline Neutral-Grip Dumbbell Press',
        muscleGroup: 'Upper Chest & Front Delts',
        sets: 4,
        reps: '10-12',
        restSec: 75,
        instructions: 'Controlled eccentric 3-second tempo, explosive concentric press.'
      },
      {
        id: 'ex-slot-3',
        name: 'Bulgarian Split Squats (Dumbbells)',
        muscleGroup: 'Quads & Glute Medius',
        sets: 3,
        reps: '10 each',
        restSec: 60,
        instructions: 'Drive front heel into ground, maintain vertical torso.'
      }
    ]
  },
  {
    id: 'slot-102',
    startTime: '10:30 AM',
    endTime: '11:15 AM',
    startHour: 10,
    startMinute: 30,
    coachId: 'coach-202',
    coachName: 'Dr. Chloe Lin, DPT',
    coachAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'VO2 Max Threshold & Lactate Clearance Surge',
    category: 'CARDIO',
    durationMinutes: 45,
    capacity: 8,
    bookedCount: 7,
    location: 'THRYVE Bio-Kinetic Cardio Deck',
    exercises: [
      {
        id: 'ex-slot-4',
        name: 'Zone 2 Precision Concept2 Rowing',
        muscleGroup: 'Aerobic Base & Full Body',
        sets: 3,
        reps: '8 mins steady',
        durationSec: 480,
        restSec: 90,
        instructions: 'Keep stroke rate 20-22 spm with 70% max heart rate.'
      },
      {
        id: 'ex-slot-5',
        name: 'Assault Bike Anaerobic Micro-Bursts',
        muscleGroup: 'Cardiovascular Power',
        sets: 6,
        reps: '30s on / 30s off',
        durationSec: 30,
        restSec: 30,
        instructions: 'Maximum RPM push for 30 seconds followed by 30 second active spin.'
      }
    ]
  },
  {
    id: 'slot-103',
    startTime: '01:00 PM',
    endTime: '01:35 PM',
    startHour: 13,
    startMinute: 0,
    coachId: 'coach-203',
    coachName: 'Tariq Al-Mansoor',
    coachAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Midday Metabolic Inferno & Kettlebell Flow',
    category: 'HIIT',
    durationMinutes: 35,
    capacity: 10,
    bookedCount: 5,
    location: 'THRYVE Arena • Functional Zone',
    exercises: [
      {
        id: 'ex-slot-6',
        name: 'Double Kettlebell Clean & Push Press',
        muscleGroup: 'Full Body Explosive',
        sets: 4,
        reps: '12 reps',
        restSec: 45,
        instructions: 'Snap hips, clean bells into rack position, dip and drive overhead.'
      },
      {
        id: 'ex-slot-7',
        name: 'Plyometric Lateral Bound with Stick',
        muscleGroup: 'Lower Body Reactive Agility',
        sets: 4,
        reps: '10 each side',
        restSec: 30,
        instructions: 'Explode laterally off single leg, decelerate softly on landing.'
      },
      {
        id: 'ex-slot-8',
        name: 'Hanging Core Windshield Wipers',
        muscleGroup: 'Obliques & Core Stability',
        sets: 3,
        reps: '12 total',
        restSec: 45,
        instructions: 'Hang from pull-up bar, raise toes to bar and rotate side-to-side.'
      }
    ]
  },
  {
    id: 'slot-104',
    startTime: '04:30 PM',
    endTime: '05:15 PM',
    startHour: 16,
    startMinute: 30,
    coachId: 'coach-201',
    coachName: 'Marcus Vance, CSCS',
    coachAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
    title: 'Afternoon Upper Body Hypertrophy Forge',
    category: 'STRENGTH',
    durationMinutes: 45,
    capacity: 6,
    bookedCount: 2,
    location: 'THRYVE Iron Lab • Platform B',
    exercises: [
      {
        id: 'ex-slot-9',
        name: 'Barbell Overhead Strict Press',
        muscleGroup: 'Shoulders & Triceps',
        sets: 4,
        reps: '8 reps',
        restSec: 90,
        instructions: 'Squeeze glutes, press in straight vertical bar path.'
      },
      {
        id: 'ex-slot-10',
        name: 'Weighted Neutral Pull-Ups',
        muscleGroup: 'Lats & Biceps',
        sets: 4,
        reps: '6-8 reps',
        restSec: 90,
        instructions: 'Full dead hang to chin over bar without swinging.'
      }
    ]
  },
  {
    id: 'slot-105',
    startTime: '06:00 PM',
    endTime: '06:45 PM',
    startHour: 18,
    startMinute: 0,
    coachId: 'coach-203',
    coachName: 'Tariq Al-Mansoor',
    coachAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Evening Calisthenics Mastery & Muscle-Up Progressions',
    category: 'CALISTHENICS',
    durationMinutes: 45,
    capacity: 8,
    bookedCount: 8,
    location: 'THRYVE Gymnastic Rig',
    exercises: [
      {
        id: 'ex-slot-11',
        name: 'Strict Bar Muscle-Up Transition Drill',
        muscleGroup: 'Lats, Chest & Core',
        sets: 4,
        reps: '5 reps',
        restSec: 90,
        instructions: 'Explosive high pull to chest, rapid wrist roll transition.'
      },
      {
        id: 'ex-slot-12',
        name: 'Ring Dips with External Rotation',
        muscleGroup: 'Chest & Triceps Stabilizers',
        sets: 3,
        reps: '10 reps',
        restSec: 75,
        instructions: 'Turn rings out 45 degrees at top of lockout.'
      }
    ]
  }
];

export const INITIAL_BOOKED_SESSIONS: BookedSession[] = [
  {
    id: 'bk-901',
    slotId: 'slot-101',
    memberId: 'usr-101',
    memberName: 'Alex Rivera',
    coachId: 'coach-201',
    coachName: 'Marcus Vance, CSCS',
    coachAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
    title: 'Morning Hypertrophy Heavy Split & Deadlift Mechanics',
    category: 'STRENGTH',
    date: '2026-10-09',
    timeSlot: '08:00 AM - 08:45 AM',
    startDateTimeIso: '2026-10-09T08:00:00',
    durationMinutes: 45,
    status: 'LIVE_NOW',
    bookingReference: 'THRYVE-TRX-8821',
    exercises: [
      {
        id: 'ex-slot-1',
        name: 'Trap Bar Deadlift (High Hex)',
        muscleGroup: 'Posterior Chain & Quads',
        sets: 4,
        reps: '6-8',
        restSec: 90,
        instructions: 'Hip hinge drive, engage lats, press floor away with neutral neck.'
      },
      {
        id: 'ex-slot-2',
        name: 'Incline Neutral-Grip Dumbbell Press',
        muscleGroup: 'Upper Chest & Front Delts',
        sets: 4,
        reps: '10-12',
        restSec: 75,
        instructions: 'Controlled eccentric 3-second tempo, explosive concentric press.'
      },
      {
        id: 'ex-slot-3',
        name: 'Bulgarian Split Squats (Dumbbells)',
        muscleGroup: 'Quads & Glute Medius',
        sets: 3,
        reps: '10 each',
        restSec: 60,
        instructions: 'Drive front heel into ground, maintain vertical torso.'
      }
    ],
    notes: 'Focus on keeping lat tension locked on rep 5-6.'
  },
  {
    id: 'bk-902',
    slotId: 'slot-102',
    memberId: 'usr-101',
    memberName: 'Alex Rivera',
    coachId: 'coach-202',
    coachName: 'Dr. Chloe Lin, DPT',
    coachAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'VO2 Max Threshold & Lactate Clearance Surge',
    category: 'CARDIO',
    date: '2026-10-10',
    timeSlot: '10:30 AM - 11:15 AM',
    startDateTimeIso: '2026-10-10T10:30:00',
    durationMinutes: 45,
    status: 'UPCOMING',
    bookingReference: 'THRYVE-BIO-4419',
    exercises: [
      {
        id: 'ex-slot-4',
        name: 'Zone 2 Precision Concept2 Rowing',
        muscleGroup: 'Aerobic Base & Full Body',
        sets: 3,
        reps: '8 mins steady',
        durationSec: 480,
        restSec: 90,
        instructions: 'Keep stroke rate 20-22 spm with 70% max heart rate.'
      },
      {
        id: 'ex-slot-5',
        name: 'Assault Bike Anaerobic Micro-Bursts',
        muscleGroup: 'Cardiovascular Power',
        sets: 6,
        reps: '30s on / 30s off',
        durationSec: 30,
        restSec: 30,
        instructions: 'Maximum RPM push for 30 seconds followed by 30 second active spin.'
      }
    ]
  }
];
