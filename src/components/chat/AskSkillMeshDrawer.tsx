import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Layers, 
  ArrowRight, 
  Bot, 
  User as UserIcon,
  HelpCircle
} from 'lucide-react';
import { ActiveTab, ChatMessage, SkillNode, UserProfile } from '../../types';

interface AskSkillMeshDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: ActiveTab) => void;
  user: UserProfile;
  skills: SkillNode[];
  careerGoal?: any;
  initialPrompt?: string;
}

export const AskSkillMeshDrawer: React.FC<AskSkillMeshDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate = (_tab: ActiveTab) => {},
  user,
  skills,
  careerGoal,
  initialPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'assistant',
      text: `Hello ${user.name}! I am your SkillMesh Living Intelligence Co-pilot. I analyze your 14 verified evidence artifacts across your 3D Skill Graph to help you navigate your progression to ${user.targetRole}. How can I assist your career evolution today?`,
      timestamp: 'Just now',
      actionSuggestions: [
        { label: 'Analyze my primary skill gaps', actionType: 'navigate_tab', payload: 'pathway' },
        { label: 'Generate a gap-closing project', actionType: 'navigate_tab', payload: 'projects' },
        { label: 'Find high-matching investors & roles', actionType: 'navigate_tab', payload: 'opportunities' }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen && initialPrompt) {
      handleSend(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/ask-skillmesh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          userProfile: user,
          skills
        })
      });

      const json = await res.json();
      if (json.success && json.reply) {
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: json.reply.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionSuggestions: json.reply.actionSuggestions
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error('No reply generated');
      }
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `Based on your current 82% fit for ${user.targetRole}, your Python (87%) and React (90%) nodes are exceptionally strong. Your primary leverage point is acquiring tangible proof in MLOps & TensorRT-LLM container deployments.`,
        timestamp: 'Just now',
        actionSuggestions: [
          { label: 'View My Skills', actionType: 'navigate_tab', payload: 'skills' },
          { label: 'Open Gap Roadmap', actionType: 'navigate_tab', payload: 'pathway' }
        ]
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (suggestion: { label: string; actionType: string; payload?: any }) => {
    if (suggestion.actionType === 'navigate_tab' && suggestion.payload) {
      onNavigate(suggestion.payload as ActiveTab);
      onClose();
    } else {
      handleSend(suggestion.label);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] glass-pearl border-l border-white/80 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 border-b border-black/5 flex items-center justify-between bg-white/70">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0058bc] to-[#4a47d2] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-[#1b1b1d] flex items-center gap-1.5">
              Ask SkillMesh AI
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-[10px] text-[#717786]">Contextual Career Intelligence Co-pilot</div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-xl hover:bg-black/5 text-[#717786]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div 
              key={msg.id} 
              className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-[10px] ${
                isUser ? 'bg-[#1b1b1d]' : 'bg-gradient-to-tr from-[#0058bc] to-[#4a47d2]'
              }`}>
                {isUser ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div className={`max-w-[85%] space-y-2`}>
                <div className={`p-3.5 rounded-2xl ${
                  isUser 
                    ? 'bg-[#0058bc] text-white rounded-tr-xs' 
                    : 'bg-white text-[#1b1b1d] border border-black/5 rounded-tl-xs shadow-2xs'
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
                
                {/* Action Suggestions */}
                {msg.actionSuggestions && msg.actionSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.actionSuggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleAction(sug)}
                        className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#0058bc]/10 border border-black/5 text-[#0058bc] font-semibold text-[11px] flex items-center gap-1 transition-colors shadow-2xs group"
                      >
                        <span>{sug.label}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                )}
                
                <span className="text-[9px] text-[#717786] block px-1">{msg.timestamp}</span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-xs text-[#717786] p-2 bg-white/50 rounded-xl border border-black/5">
            <Sparkles className="w-4 h-4 text-[#0058bc] animate-spin" />
            <span>Analyzing neural skill mesh & synthesizing guidance...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-white/40 border-t border-black/5 flex gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
        <button
          onClick={() => handleSend("What is the fastest pathway to 95% AI Engineer match?")}
          className="px-2.5 py-1 rounded-full bg-white hover:bg-[#0058bc]/10 border border-black/5 text-[#44474e] whitespace-nowrap font-medium"
        >
          ⚡ Fastest path to 95%
        </button>
        <button
          onClick={() => handleSend("Which investors match my RAG knowledge engine project?")}
          className="px-2.5 py-1 rounded-full bg-white hover:bg-[#0058bc]/10 border border-black/5 text-[#44474e] whitespace-nowrap font-medium"
        >
          🤝 Match investors
        </button>
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-black/5 bg-white/80">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-[#f4f2f7] rounded-xl px-3 py-2 border border-black/5 focus-within:border-[#0058bc] transition-colors"
        >
          <input
            type="text"
            placeholder="Ask about skills, gaps, proofs, career path..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-transparent border-none outline-none text-xs text-[#1b1b1d] placeholder:text-[#717786]"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-1.5 rounded-lg bg-[#0058bc] hover:bg-[#004899] disabled:opacity-40 text-white transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
