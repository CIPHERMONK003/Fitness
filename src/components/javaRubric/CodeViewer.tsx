import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download
} from 'lucide-react';
import { JavaSourceFile } from '../../types/javaArchitecture';

interface CodeViewerProps {
  files: JavaSourceFile[];
  selectedFilename?: string;
  onSelectFile: (file: JavaSourceFile) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  files,
  selectedFilename,
  onSelectFile,
}) => {
  const [selectedLayer, setSelectedLayer] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);

  // Active file determination
  const activeFile = selectedFilename
    ? files.find((f) => f.filename === selectedFilename) || files[0]
    : files[0];

  const filteredFiles = files.filter(
    (f) => selectedLayer === 'ALL' || f.layer === selectedLayer
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeFile.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const layers = ['ALL', 'Model', 'DAO', 'Service', 'Concurrency', 'Servlet', 'Exception', 'Database Schema'];

  return (
    <div className="space-y-4">
      
      {/* Layer Filters */}
      <div className="flex flex-wrap items-center gap-1.5 bg-white p-2.5 rounded-2xl border border-slate-200 text-xs shadow-sm">
        <span className="text-slate-500 font-semibold px-2 font-mono">Architectural Layer:</span>
        {layers.map((layer) => (
          <button
            key={layer}
            onClick={() => setSelectedLayer(layer)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedLayer === layer
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {layer}
          </button>
        ))}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[750px]">
        
        {/* Left Column: File Tree */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-indigo-600" />
              Java Source Files
            </span>
            <span className="text-[10px] font-mono text-slate-500">{filteredFiles.length} files</span>
          </div>

          <div className="p-2 overflow-y-auto space-y-1 flex-1 text-xs font-mono">
            {filteredFiles.map((f) => {
              const isCurrent = f.id === activeFile.id;
              return (
                <button
                  key={f.id}
                  onClick={() => onSelectFile(f)}
                  className={`w-full text-left p-2.5 rounded-2xl transition-all flex flex-col gap-0.5 border ${
                    isCurrent
                      ? 'bg-indigo-50 text-indigo-900 border-indigo-200 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold truncate text-[11px]">{f.filename}</span>
                    <span className="text-[9px] uppercase font-sans font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {f.layer}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 truncate font-sans">
                    {f.packageName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Display */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col shadow-sm">
          
          {/* File Header Details */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-700">
                  {activeFile.packageName}.{activeFile.filename}
                </span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-sans font-bold border border-indigo-200">
                  {activeFile.layer} Layer
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-sans">{activeFile.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                title="Copy code to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs transition-all shadow-sm"
                title="Download Java File"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* OOP Badges Bar */}
          <div className="px-4 py-2 bg-slate-50/60 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] text-slate-500 font-semibold font-mono">OOP / Core Java Tags:</span>
            {activeFile.oopConcepts.map((concept) => (
              <span
                key={concept}
                className="text-[10px] bg-white text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full font-semibold shadow-xs"
              >
                {concept}
              </span>
            ))}
          </div>

          {/* Code Body with Line Numbers */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-800 bg-[#fbfcfd] leading-relaxed">
            <pre className="table w-full">
              {activeFile.code.split('\n').map((line, idx) => (
                <div key={idx} className="table-row hover:bg-slate-100/60">
                  <span className="table-cell select-none text-slate-400 text-right pr-4 pl-1 text-[11px] opacity-70">
                    {idx + 1}
                  </span>
                  <span className="table-cell whitespace-pre text-slate-800">
                    {line}
                  </span>
                </div>
              ))}
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
};
