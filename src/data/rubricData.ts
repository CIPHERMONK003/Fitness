import { RubricItem } from '../types/javaArchitecture';

export const MARKING_RUBRIC_ITEMS: RubricItem[] = [
  {
    id: 'rubric-1',
    category: 'PROBLEM_SOLVING',
    title: 'Problem Understanding & Enterprise Architecture Design',
    maxScore: 15,
    awardedScore: 15,
    requirement: 'Comprehensive system breakdown for an Online Fitness Coaching Platform with clear actor personas (Member, Coach, Admin), domain boundaries, and multi-layered MVC / Clean Architecture.',
    implementationDetail: 'Engineered layered separation across Model (Domain Objects), DAO (Data Access with JDBC), Service (Business Logic), and Servlet (Web Controllers). User personas support role-based workflows for trainees, coaches, and administrators.',
    keyClasses: ['User.java', 'WorkoutPlan.java', 'WorkoutServlet.java', 'schema.sql'],
    status: 'VERIFIED'
  },
  {
    id: 'rubric-2',
    category: 'CORE_JAVA_OOP',
    title: 'Core Java OOP: Polymorphism & Dynamic Dispatch',
    maxScore: 10,
    awardedScore: 10,
    requirement: 'Polymorphic hierarchy with abstract classes and overridden methods exhibiting distinct runtime behavior based on object type.',
    implementationDetail: 'Abstract WorkoutPlan defines polymorphic calculateCaloricBurn(), computeMetabolicEquivalent(), and getProgressionGuidance(). Subclasses (StrengthPlan, CardioPlan, HIITPlan) implement domain-specific metabolic equations and dynamic overload algorithms.',
    keyClasses: ['WorkoutPlan.java', 'StrengthPlan.java', 'CardioPlan.java'],
    status: 'VERIFIED'
  },
  {
    id: 'rubric-3',
    category: 'CORE_JAVA_OOP',
    title: 'Core Java OOP: Inheritance & Encapsulation',
    maxScore: 10,
    awardedScore: 10,
    requirement: 'Clear inheritance hierarchy extending base behavior without code duplication, coupled with strict field encapsulation and defensive copying.',
    implementationDetail: 'Abstract User base class provides common identity, audit timestamps, and security tokens. Subclasses Member, Coach, and Admin extend User with role-specific properties (fitness goals, specialties, administrative privileges) and override getRoleSpecificDashboard().',
    keyClasses: ['User.java', 'Member.java', 'Coach.java'],
    status: 'VERIFIED'
  },
  {
    id: 'rubric-4',
    category: 'CORE_JAVA_OOP',
    title: 'Exception Handling & Custom Error Hierarchy',
    maxScore: 5,
    awardedScore: 5,
    requirement: 'Multi-level custom exception hierarchy with checked/unchecked distinction, root cause wrapping, and meaningful error codes.',
    implementationDetail: 'Base checked exception FitnessPlatformException provides error codes. Child exceptions AuthenticationException, ResourceNotFoundException, and DatabaseConnectionException wrap SQLExceptions preserving stack traces for audit logging.',
    keyClasses: ['FitnessPlatformException.java', 'UserDAOImpl.java'],
    status: 'VERIFIED'
  },
  {
    id: 'rubric-5',
    category: 'COLLECTIONS_GENERICS',
    title: 'Collections Framework & Generic Repository Pattern',
    maxScore: 15,
    awardedScore: 15,
    requirement: 'Generic interfaces with type parameter bounds, usage of varied Java Collections (List, Map, Queue, Set) suited to algorithmic demands.',
    implementationDetail: 'GenericDAO<T, ID extends Serializable> establishes compile-time type safety. WorkoutServiceImpl integrates ConcurrentHashMap for plan caching, PriorityQueue for time-ordered workout reminders, and LinkedList for ordered exercise progression.',
    keyClasses: ['GenericDAO.java', 'WorkoutServiceImpl.java'],
    status: 'VERIFIED'
  },
  {
    id: 'rubric-6',
    category: 'MULTITHREADING_SYNC',
    title: 'Multithreading, ThreadPoolExecutor & Synchronization',
    maxScore: 20,
    awardedScore: 20,
    requirement: 'Concurrent background execution, thread pools, synchronized monitors, wait/notify mechanisms, and lock-free atomic counters.',
    implementationDetail: 'ConnectionPool implements thread-safe Singleton with double-checked locking, volatile keyword, and synchronized acquire/release with wait() and notifyAll(). NotificationWorkerPool implements ThreadPoolExecutor with ArrayBlockingQueue and AtomicInteger task counters.',
    keyClasses: ['ConnectionPool.java', 'NotificationWorkerPool.java'],
    status: 'VERIFIED'
  },
  {
    id: 'rubric-7',
    category: 'DATABASE_JDBC',
    title: 'Database Connectivity (JDBC) & SQL Injection Defense',
    maxScore: 15,
    awardedScore: 15,
    requirement: 'Direct JDBC API usage with DriverManager, Connection, PreparedStatement, Statement.RETURN_GENERATED_KEYS, and ResultSet parsing.',
    implementationDetail: 'UserDAOImpl and WorkoutDAOImpl leverage PreparedStatement for all queries preventing SQL injection attacks. Handles AutoCloseable resources, ResultSet column mapping, and relational database CRUD operations.',
    keyClasses: ['DBConnectionManager.java', 'UserDAOImpl.java', 'schema.sql'],
    status: 'VERIFIED'
  },
  {
    id: 'rubric-8',
    category: 'DATABASE_JDBC',
    title: 'JDBC ACID Transactions & Batch Execution',
    maxScore: 5,
    awardedScore: 5,
    requirement: 'Manual transaction demarcation using setAutoCommit(false), commit(), and rollback(), plus PreparedStatement batch operations.',
    implementationDetail: 'WorkoutDAOImpl.saveWorkoutWithExercises() wraps multi-table operations in an atomic transaction. Inserts parent workout_plan, adds child exercises into a batch buffer via addBatch(), executes via executeBatch(), and issues rollback() upon any SQLException.',
    keyClasses: ['WorkoutDAOImpl.java'],
    status: 'VERIFIED'
  },
  {
    id: 'rubric-9',
    category: 'SERVLETS_WEB',
    title: 'Servlets, Web Integration & Role-Based Filters',
    maxScore: 10,
    awardedScore: 10,
    requirement: 'HttpServlet subclassing handling HTTP methods (GET, POST), HttpSession session state, and Filter chains for route security.',
    implementationDetail: 'WorkoutServlet extends HttpServlet overriding doGet() and doPost() with proper HTTP status codes and JSON serialization. AuthFilter implements javax.servlet.Filter inspecting session tokens and enforcing Role-Based Access Control before requests reach servlets.',
    keyClasses: ['WorkoutServlet.java', 'AuthFilter.java'],
    status: 'VERIFIED'
  }
];
