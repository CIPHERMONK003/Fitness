import React, { useState } from 'react';
import { 
  Database, 
  Layers, 
  Code2, 
  Clock
} from 'lucide-react';
import { SimulatedConnection, SqlQueryResult } from '../../types/javaArchitecture';
import { executeSimulatedQuery } from '../../engine/jvmSimulator';

interface JdbcSimulatorProps {
  connections: SimulatedConnection[];
  onBorrowConnection: (connId: number) => void;
  onReleaseConnection: (connId: number) => void;
}

export const JdbcSimulator: React.FC<JdbcSimulatorProps> = ({
  connections,
  onBorrowConnection,
  onReleaseConnection,
}) => {
  const [queryResult, setQueryResult] = useState<SqlQueryResult>(
    executeSimulatedQuery('SELECT_USER')
  );
  const [activeQueryKey, setActiveQueryKey] = useState<string>('SELECT_USER');

  const handleRunQuery = (
    key: 'SELECT_USER' | 'INSERT_WORKOUT_TX_COMMIT' | 'INSERT_WORKOUT_TX_ROLLBACK' | 'BATCH_EXERCISES' | 'AGGREGATE_CALORIES'
  ) => {
    setActiveQueryKey(key);
    const result = executeSimulatedQuery(key);
    setQueryResult(result);
  };

  const busyCount = connections.filter((c) => c.inUse).length;
  const idleCount = connections.length - busyCount;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1 font-mono">
            <Database className="w-4 h-4 text-emerald-600" /> Relational JDBC Engine & Connection Pool
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            JDBC Operations & ACID Transaction Console
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
            Live simulation of <code className="text-indigo-700 font-bold font-mono">java.sql.PreparedStatement</code>, SQL injection prevention, manual transaction rollback/commit, and connection pooling.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs font-mono shadow-sm">
          <div>
            <span className="text-slate-500 uppercase block text-[10px]">Active</span>
            <span className="font-bold text-amber-700">{busyCount} in use</span>
          </div>
          <div className="border-l border-slate-200 pl-3">
            <span className="text-slate-500 uppercase block text-[10px]">Idle</span>
            <span className="font-bold text-emerald-700">{idleCount} ready</span>
          </div>
          <div className="border-l border-slate-200 pl-3">
            <span className="text-slate-500 uppercase block text-[10px]">Capacity</span>
            <span className="font-bold text-slate-900">5 connections</span>
          </div>
        </div>
      </div>

      {/* Visual Connection Pool Slots */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-sm">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-mono">
            <Layers className="w-4 h-4 text-emerald-600" />
            Synchronized ConnectionPool Slots
          </span>
          <span className="text-slate-500 font-mono text-[11px]">jdbc:postgresql://localhost:5432/fitpulse_db</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {connections.map((conn) => (
            <div
              key={conn.id}
              className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
                conn.inUse
                  ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="font-bold text-slate-900">Conn #{conn.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  conn.inUse ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}>
                  {conn.inUse ? 'BUSY' : 'IDLE'}
                </span>
              </div>

              <div className="text-[10px] space-y-1 font-mono">
                <div>Isolation: <span className="text-slate-600">READ_COMMITTED</span></div>
                {conn.inUse && (
                  <div className="text-amber-800 truncate font-semibold">
                    Assigned: {conn.assignedThread || 'Worker'}
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/80 flex justify-between items-center text-[10px]">
                {conn.inUse ? (
                  <button
                    onClick={() => onReleaseConnection(conn.id)}
                    className="text-amber-700 hover:text-amber-900 underline font-bold"
                  >
                    releaseConnection()
                  </button>
                ) : (
                  <button
                    onClick={() => onBorrowConnection(conn.id)}
                    className="text-emerald-700 hover:text-emerald-900 underline font-bold"
                  >
                    getConnection()
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive SQL & JDBC Execution Console */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden space-y-4 shadow-sm">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-600" />
            Execute JDBC Operations & Transactions
          </h3>
          <span className="text-xs text-slate-500 font-mono">PreparedStatement & Batching Active</span>
        </div>

        {/* Action Buttons */}
        <div className="p-4 flex flex-wrap gap-2 pt-0">
          <button
            onClick={() => handleRunQuery('SELECT_USER')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeQueryKey === 'SELECT_USER'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            SELECT User (PreparedStatement)
          </button>

          <button
            onClick={() => handleRunQuery('INSERT_WORKOUT_TX_COMMIT')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeQueryKey === 'INSERT_WORKOUT_TX_COMMIT'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Transaction: Insert Plan + Exercises (COMMIT)
          </button>

          <button
            onClick={() => handleRunQuery('INSERT_WORKOUT_TX_ROLLBACK')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeQueryKey === 'INSERT_WORKOUT_TX_ROLLBACK'
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Transaction with Failure (ROLLBACK)
          </button>

          <button
            onClick={() => handleRunQuery('BATCH_EXERCISES')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeQueryKey === 'BATCH_EXERCISES'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Batch Insert (executeBatch)
          </button>

          <button
            onClick={() => handleRunQuery('AGGREGATE_CALORIES')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeQueryKey === 'AGGREGATE_CALORIES'
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Analytics Query (SUM/GROUP BY)
          </button>
        </div>

        {/* Code & Execution Details */}
        <div className="p-4 pt-0 space-y-4">
          
          {/* Java PreparedStatement Snippet */}
          <div className="bg-[#f8fafc] p-3.5 rounded-2xl border border-slate-200 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-500 text-[11px] mb-1.5">
              <span>Executed Java JDBC PreparedStatement:</span>
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <Clock className="w-3 h-3" /> {queryResult.executionTimeMs} ms
              </span>
            </div>
            <pre className="text-emerald-800 whitespace-pre-wrap font-bold">{queryResult.query}</pre>
          </div>

          {/* Transaction State & Execution Plan */}
          <div className="bg-[#f8fafc] p-3.5 rounded-2xl border border-slate-200 font-mono text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-[11px]">Database Execution Plan:</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                queryResult.transactionState === 'COMMITTED'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : queryResult.transactionState === 'ROLLBACK'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                TX STATE: {queryResult.transactionState}
              </span>
            </div>
            <p className="text-slate-700 text-[11px] whitespace-pre-wrap leading-relaxed">{queryResult.plan}</p>
          </div>

          {/* Result Table if rows present */}
          {queryResult.rows && queryResult.rows.length > 0 && queryResult.columns && (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs font-mono text-slate-700">
                <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 border-b border-slate-200">
                  <tr>
                    {queryResult.columns.map((col) => (
                      <th key={col} className="p-3">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {queryResult.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      {queryResult.columns?.map((col) => (
                        <td key={col} className="p-3 text-slate-800">{String(row[col])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
