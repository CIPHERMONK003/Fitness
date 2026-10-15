export type RubricCategory = 
  | 'PROBLEM_SOLVING'
  | 'CORE_JAVA_OOP'
  | 'COLLECTIONS_GENERICS'
  | 'MULTITHREADING_SYNC'
  | 'DATABASE_JDBC'
  | 'SERVLETS_WEB';

export interface RubricItem {
  id: string;
  category: RubricCategory;
  title: string;
  maxScore: number;
  awardedScore: number;
  requirement: string;
  implementationDetail: string;
  keyClasses: string[];
  status: 'IMPLEMENTED' | 'VERIFIED';
}

export interface JavaSourceFile {
  id: string;
  filename: string;
  packageName: string;
  layer: 'Model' | 'DAO' | 'Service' | 'Concurrency' | 'Servlet' | 'Exception' | 'Database Schema';
  oopConcepts: string[];
  description: string;
  code: string;
}

export type JVMThreadState = 'NEW' | 'RUNNABLE' | 'BLOCKED' | 'WAITING' | 'TIMED_WAITING' | 'TERMINATED';

export interface SimulatedThread {
  id: number;
  name: string;
  state: JVMThreadState;
  currentTask: string;
  lockHeld?: string;
  lockWaitingOn?: string;
  priority: number;
  tasksCompleted: number;
}

export interface SimulatedConnection {
  id: number;
  url: string;
  inUse: boolean;
  activeTransaction: boolean;
  isolationLevel: 'TRANSACTION_READ_COMMITTED' | 'TRANSACTION_SERIALIZABLE';
  currentQuery?: string;
  assignedThread?: string;
}

export interface ServletPipelineStep {
  id: string;
  title: string;
  type: 'CLIENT' | 'FILTER' | 'SERVLET' | 'SERVICE' | 'DAO' | 'JDBC_POOL' | 'DATABASE';
  description: string;
  active: boolean;
  durationMs: number;
  payload?: string;
}

export interface SqlQueryResult {
  query: string;
  executionTimeMs: number;
  rowsAffected?: number;
  columns?: string[];
  rows?: Record<string, any>[];
  transactionState: 'COMMITTED' | 'ROLLBACK' | 'AUTOCOMMIT';
  plan: string;
}
