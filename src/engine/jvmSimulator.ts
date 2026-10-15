import { SimulatedThread, SimulatedConnection, SqlQueryResult, ServletPipelineStep } from '../types/javaArchitecture';

export interface JvmEngineState {
  threads: SimulatedThread[];
  connections: SimulatedConnection[];
  activeLocks: string[];
  totalTasksProcessed: number;
  dbPoolCapacity: number;
}

export const INITIAL_THREADS: SimulatedThread[] = [
  {
    id: 1,
    name: 'THRYVE-Worker-1',
    state: 'RUNNABLE',
    currentTask: 'Processing Asynchronous Calorie Aggregation',
    priority: 5,
    tasksCompleted: 42
  },
  {
    id: 2,
    name: 'THRYVE-Worker-2',
    state: 'TIMED_WAITING',
    currentTask: 'Awaiting Next Push Notification Task (poll 500ms)',
    priority: 5,
    tasksCompleted: 38
  },
  {
    id: 3,
    name: 'THRYVE-Worker-3',
    state: 'WAITING',
    currentTask: 'Awaiting ConnectionPool.getConnection() monitor lock',
    lockWaitingOn: 'ConnectionPool#monitor',
    priority: 5,
    tasksCompleted: 29
  },
  {
    id: 4,
    name: 'THRYVE-Worker-4',
    state: 'RUNNABLE',
    currentTask: 'Executing WorkoutDAO.saveWorkoutWithExercises()',
    lockHeld: 'ConnectionPool#slot2',
    priority: 5,
    tasksCompleted: 51
  }
];

export const INITIAL_CONNECTIONS: SimulatedConnection[] = [
  {
    id: 1,
    url: 'jdbc:postgresql://localhost:5432/thryve_db',
    inUse: false,
    activeTransaction: false,
    isolationLevel: 'TRANSACTION_READ_COMMITTED'
  },
  {
    id: 2,
    url: 'jdbc:postgresql://localhost:5432/thryve_db',
    inUse: true,
    activeTransaction: true,
    isolationLevel: 'TRANSACTION_READ_COMMITTED',
    currentQuery: 'INSERT INTO exercises (plan_id, name, muscle_group, sets, reps) VALUES (?, ?, ?, ?, ?)',
    assignedThread: 'THRYVE-Worker-4'
  },
  {
    id: 3,
    url: 'jdbc:postgresql://localhost:5432/thryve_db',
    inUse: false,
    activeTransaction: false,
    isolationLevel: 'TRANSACTION_READ_COMMITTED'
  },
  {
    id: 4,
    url: 'jdbc:postgresql://localhost:5432/thryve_db',
    inUse: false,
    activeTransaction: false,
    isolationLevel: 'TRANSACTION_READ_COMMITTED'
  },
  {
    id: 5,
    url: 'jdbc:postgresql://localhost:5432/thryve_db',
    inUse: false,
    activeTransaction: false,
    isolationLevel: 'TRANSACTION_READ_COMMITTED'
  }
];

export function executeSimulatedQuery(
  queryType: 'SELECT_USER' | 'INSERT_WORKOUT_TX_COMMIT' | 'INSERT_WORKOUT_TX_ROLLBACK' | 'BATCH_EXERCISES' | 'AGGREGATE_CALORIES'
): SqlQueryResult {
  switch (queryType) {
    case 'SELECT_USER':
      return {
        query: `PreparedStatement pstmt = conn.prepareStatement("SELECT u.id, u.name, u.email, u.role FROM users u WHERE u.id = ?");\npstmt.setLong(1, 101L);\nResultSet rs = pstmt.executeQuery();`,
        executionTimeMs: 4.2,
        transactionState: 'AUTOCOMMIT',
        plan: `Index Scan using idx_users_pkey on users  (cost=0.15..8.17 rows=1 width=84)\n  Index Cond: (id = 101)`,
        columns: ['id', 'name', 'email', 'role', 'status'],
        rows: [
          { id: 101, name: 'Alex Rivera', email: 'alex.rivera@fitpulse.io', role: 'MEMBER', status: 'ACTIVE' }
        ]
      };

    case 'INSERT_WORKOUT_TX_COMMIT':
      return {
        query: `conn.setAutoCommit(false);\ntry {\n  pstmtPlan.executeUpdate(); // Insert workout plan\n  pstmtEx.executeBatch();    // Batch insert 5 exercises\n  conn.commit();             // ACID Commit persisted\n}`,
        executionTimeMs: 14.8,
        rowsAffected: 6,
        transactionState: 'COMMITTED',
        plan: `Transaction committed successfully. WAL log synced with LSN 0/19F42B0. All 5 child exercises atomically linked to plan_id #42.`,
        columns: ['table', 'operation', 'rows_affected', 'status'],
        rows: [
          { table: 'workout_plans', operation: 'INSERT', rows_affected: 1, status: 'COMMITTED' },
          { table: 'exercises', operation: 'BATCH_INSERT', rows_affected: 5, status: 'COMMITTED' }
        ]
      };

    case 'INSERT_WORKOUT_TX_ROLLBACK':
      return {
        query: `conn.setAutoCommit(false);\ntry {\n  pstmtPlan.executeUpdate();\n  throw new SQLException("Deadlock / Foreign Key violation on exercise #3");\n} catch (SQLException ex) {\n  conn.rollback(); // Manual Rollback triggered!\n}`,
        executionTimeMs: 9.1,
        rowsAffected: 0,
        transactionState: 'ROLLBACK',
        plan: `Transaction rolled back. Rollback segment restored table state. 0 rows persisted to ensure database consistency.`,
        columns: ['action', 'isolation', 'undone_mutations', 'status'],
        rows: [
          { action: 'ROLLBACK', isolation: 'READ_COMMITTED', undone_mutations: 1, status: 'RESTORED_PRE_TX_STATE' }
        ]
      };

    case 'BATCH_EXERCISES':
      return {
        query: `PreparedStatement batchStmt = conn.prepareStatement("INSERT INTO exercises (...) VALUES (?, ?, ...)");\nfor (Exercise ex : routine) {\n  batchStmt.setString(1, ...);\n  batchStmt.addBatch();\n}\nint[] results = batchStmt.executeBatch();`,
        executionTimeMs: 6.7,
        rowsAffected: 5,
        transactionState: 'COMMITTED',
        plan: `Batch execution executed in 1 network round-trip. Array of affected row counts: [1, 1, 1, 1, 1].`,
        columns: ['batch_index', 'exercise_name', 'status_code'],
        rows: [
          { batch_index: 1, exercise_name: 'Barbell Romanian Deadlift', status_code: '1 (SUCCESS)' },
          { batch_index: 2, exercise_name: 'Incline Dumbbell Chest Press', status_code: '1 (SUCCESS)' },
          { batch_index: 3, exercise_name: 'Chest-Supported T-Bar Row', status_code: '1 (SUCCESS)' },
          { batch_index: 4, exercise_name: 'Bulgarian Split Squats', status_code: '1 (SUCCESS)' },
          { batch_index: 5, exercise_name: 'Cable Triceps Rope Pushdown', status_code: '1 (SUCCESS)' }
        ]
      };

    case 'AGGREGATE_CALORIES':
      return {
        query: `SELECT p.member_id, SUM(p.calories_burned) as total_kcal, COUNT(*) as sessions\nFROM progress_logs p\nWHERE p.logged_at >= NOW() - INTERVAL '7 DAYS'\nGROUP BY p.member_id ORDER BY total_kcal DESC;`,
        executionTimeMs: 8.5,
        transactionState: 'AUTOCOMMIT',
        plan: `HashAggregate (cost=14.20..15.80 rows=10 width=20)\n  Group Key: member_id\n  -> Seq Scan on progress_logs p (cost=0.00..12.50 rows=100 width=16)`,
        columns: ['member_id', 'total_kcal', 'sessions', 'weekly_goal_met'],
        rows: [
          { member_id: 101, total_kcal: 1895, sessions: 4, weekly_goal_met: 'YES (105%)' },
          { member_id: 102, total_kcal: 1740, sessions: 3, weekly_goal_met: 'YES (96%)' },
          { member_id: 103, total_kcal: 1520, sessions: 3, weekly_goal_met: 'YES (84%)' }
        ]
      };
  }
}
