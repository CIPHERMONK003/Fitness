import React, { useState } from 'react';
import { 
  Award, 
  Code2, 
  Cpu, 
  Database, 
  Globe
} from 'lucide-react';
import { RubricItem, JavaSourceFile, SimulatedThread, SimulatedConnection } from '../../types/javaArchitecture';
import { RubricScorecard } from './RubricScorecard';
import { CodeViewer } from './CodeViewer';
import { ThreadVisualizer } from './ThreadVisualizer';
import { JdbcSimulator } from './JdbcSimulator';
import { ServletFlowVisualizer } from './ServletFlowVisualizer';

interface JavaRubricHubProps {
  rubricItems: RubricItem[];
  sourceFiles: JavaSourceFile[];
  threads: SimulatedThread[];
  connections: SimulatedConnection[];
  onDispatchTask: (desc: string) => void;
  onSimulateLockContention: () => void;
  onReleaseLocks: () => void;
  onBorrowConnection: (id: number) => void;
  onReleaseConnection: (id: number) => void;
}

export const JavaRubricHub: React.FC<JavaRubricHubProps> = ({
  rubricItems,
  sourceFiles,
  threads,
  connections,
  onDispatchTask,
  onSimulateLockContention,
  onReleaseLocks,
  onBorrowConnection,
  onReleaseConnection,
}) => {
  const [activeTab, setActiveTab] = useState<'SCORECARD' | 'CODE' | 'THREADS' | 'JDBC' | 'SERVLETS'>('SCORECARD');
  const [inspectedFilename, setInspectedFilename] = useState<string>(sourceFiles[0]?.filename || 'User.java');

  const handleSelectClass = (className: string) => {
    // If user clicks a class from rubric, find matching file and switch to CODE tab
    const matched = sourceFiles.find(
      (f) => f.filename === className || f.filename.includes(className)
    );
    if (matched) {
      setInspectedFilename(matched.filename);
    }
    setActiveTab('CODE');
  };

  return (
    <div className="space-y-6">
      
      {/* Sub Tabs Navigation */}
      <div className="flex border-b border-slate-200 space-x-2 sm:space-x-4 overflow-x-auto text-xs pb-1">
        <button
          onClick={() => setActiveTab('SCORECARD')}
          className={`pb-3 px-2 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'SCORECARD'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Rubric Evaluation (100/100)</span>
        </button>

        <button
          onClick={() => setActiveTab('CODE')}
          className={`pb-3 px-2 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'CODE'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Java Code Explorer ({sourceFiles.length} Classes)</span>
        </button>

        <button
          onClick={() => setActiveTab('THREADS')}
          className={`pb-3 px-2 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'THREADS'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>JVM Concurrency & Locks</span>
        </button>

        <button
          onClick={() => setActiveTab('JDBC')}
          className={`pb-3 px-2 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'JDBC'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>JDBC & ACID Transactions</span>
        </button>

        <button
          onClick={() => setActiveTab('SERVLETS')}
          className={`pb-3 px-2 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'SERVLETS'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Servlet & Filter Pipeline</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'SCORECARD' && (
        <RubricScorecard
          rubricItems={rubricItems}
          onSelectClassForInspection={handleSelectClass}
        />
      )}

      {activeTab === 'CODE' && (
        <CodeViewer
          files={sourceFiles}
          selectedFilename={inspectedFilename}
          onSelectFile={(f) => setInspectedFilename(f.filename)}
        />
      )}

      {activeTab === 'THREADS' && (
        <ThreadVisualizer
          threads={threads}
          onDispatchTask={onDispatchTask}
          onSimulateLockContention={onSimulateLockContention}
          onReleaseLocks={onReleaseLocks}
        />
      )}

      {activeTab === 'JDBC' && (
        <JdbcSimulator
          connections={connections}
          onBorrowConnection={onBorrowConnection}
          onReleaseConnection={onReleaseConnection}
        />
      )}

      {activeTab === 'SERVLETS' && (
        <ServletFlowVisualizer />
      )}

    </div>
  );
};
