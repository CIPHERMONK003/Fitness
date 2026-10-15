import React, { useState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { CoachUser, CoachMessage, AppUser } from '../../types/fitness';

interface CoachChatModalProps {
  coach: CoachUser;
  currentUser: AppUser;
  messages: CoachMessage[];
  onClose: () => void;
  onSendMessage: (content: string, type?: 'CHAT' | 'FEEDBACK' | 'PLAN_RECOMMENDATION') => void;
}

export const CoachChatModal: React.FC<CoachChatModalProps> = ({
  coach,
  currentUser,
  messages,
  onClose,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');

  // Filter messages between current user and this coach
  const relevantMessages = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.recipientId === coach.id) ||
      (m.senderId === coach.id && m.recipientId === currentUser.id)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[650px] max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={coach.avatar}
              alt={coach.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">{coach.name}</h3>
                <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 font-mono font-bold">
                  ★ {coach.rating}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{coach.certification}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          {relevantMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <MessageSquare className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">Start the conversation with Coach {coach.name.split(' ')[0]}</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Ask about exercise execution cues, periodization blocks, or nutrition guidance.
              </p>
            </div>
          ) : (
            relevantMessages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-500 font-mono">
                    <span className="font-bold text-slate-700">{msg.senderName}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    {msg.type === 'FEEDBACK' && (
                      <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-[10px] border border-amber-200 font-semibold">
                        Technique Feedback
                      </span>
                    )}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                      isMine
                        ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your coaching message or technique question..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-cyan-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>

      </div>
    </div>
  );
};
