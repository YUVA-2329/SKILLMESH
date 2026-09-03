import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  ArrowRight, 
  User, 
  Bot, 
  Lightbulb, 
  CheckCircle2, 
  Code,
  Compass,
  Trash2,
  Loader2
} from 'lucide-react';
import { ActiveTab, UserProfile, SkillNode } from '../../types';
import { soundEffects } from '../effects/SoundFeedback';

interface AICopilotViewProps {
  user: UserProfile;
  skills: SkillNode[];
  onNavigate: (tab: ActiveTab) => void;
  initialPrompt?: string;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  action?: {
    label: string;
    tab: ActiveTab;
  };
}

export const AICopilotView: React.FC<AICopilotViewProps> = ({
  user,
  skills,
  onNavigate,
  initialPrompt
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hey ${user.name}! 👋 I'm your SkillMesh guide. I keep track of what you build, what skills you've mastered, and what's next on your journey to becoming an ${user.targetRole || 'AI Engineer'}.\n\nAsk me anything! No question is too simple.`,
      timestamp: 'Just now'
    }
  ]);

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What should I learn next?",
    "What should I build?",
    "What am I good at?",
    "What am I missing?",
    `Am I ready for an ${user.targetRole || 'AI Engineer'} job?`
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  function generateFriendlyAIResponse(query: string, u: UserProfile): string {
    const q = query.toLowerCase();
    if (q.includes('learn')) {
      return `Right now, the best thing to learn is Docker!\n\nYou're already strong at writing Python and training machine learning models. But employers want to see that you can put your models on the internet so other people can use them.\n\nLearning Docker will help you package your model into a neat container and deploy it in under 20 minutes!`;
    }
    if (q.includes('build')) {
      return `I recommend you build a Computer Vision project, like an AI Image Classifier!\n\nIt will connect 3 of the skills you need: Python, Machine Learning, and image processing. Plus, having a working computer vision app in your portfolio makes you stand out immediately.`;
    }
    if (q.includes('good at') || q.includes('strong')) {
      return `You have really solid superpowers in Python (86%) and SQL (80%)! You also have great React skills (74%).\n\nThat means you already know how to write clean code, manipulate data, and build web interfaces. That's a huge head start!`;
    }
    if (q.includes('missing') || q.includes('gap')) {
      return `You're missing just two main puzzle pieces:\n\n1. Computer Vision (learning how to teach computers to see pictures)\n2. Deployment (putting your code on a server using Docker)\n\nYou know how to build the model. Now let's learn how to put it online!`;
    }
    if (q.includes('ready')) {
      return `You're 62% ready for your goal as an ${u.targetRole || 'AI Engineer'}! That's awesome progress.\n\nYou have strong core fundamentals. Once you complete 1 computer vision project and 1 deployment project, your readiness will jump above 85% and you'll be ready for internships and junior roles!`;
    }
    return `That's a great question! Based on what you've built so far, focus on building 1 project at a time and putting the code on GitHub. Every project you finish adds verified proof to your Skill Passport!`;
  }

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isThinking) return;

    soundEffects.playClick(720);
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/gemini/ask-skillmesh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          userProfile: user,
          skills: skills.map(s => ({ name: s.name, masteryPercentage: s.masteryPercentage })),
          currentCareerGoal: user.targetRole
        })
      });

      if (res.ok) {
        const data = await res.json();
        const primaryAction = data.actionSuggestions?.[0];
        let targetTab: ActiveTab = 'skills';
        if (primaryAction?.payload && typeof primaryAction.payload === 'string') {
          targetTab = primaryAction.payload as ActiveTab;
        } else if (query.toLowerCase().includes('build') || query.toLowerCase().includes('project')) {
          targetTab = 'projects';
        } else if (query.toLowerCase().includes('learn')) {
          targetTab = 'learn';
        } else if (query.toLowerCase().includes('job') || query.toLowerCase().includes('opportunity')) {
          targetTab = 'opportunities';
        }

        const aiMsg: Message = {
          id: `ai-${Date.now() + 1}`,
          sender: 'ai',
          text: data.text || generateFriendlyAIResponse(query, user),
          timestamp: 'Just now',
          action: primaryAction ? {
            label: primaryAction.label || 'Take Action',
            tab: targetTab
          } : undefined
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error('Fallback to deterministic AI');
      }
    } catch {
      const aiReplyText = generateFriendlyAIResponse(query, user);
      const aiMsg: Message = {
        id: `ai-${Date.now() + 1}`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: 'Just now',
        action: query.toLowerCase().includes('build') 
          ? { label: 'Start Project', tab: 'projects' }
          : query.toLowerCase().includes('learn')
          ? { label: 'Go to Learning', tab: 'learn' }
          : undefined
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleClearChat = () => {
    soundEffects.playClick(500);
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: `Chat reset. What would you like to explore or practice next, ${user.name}?`,
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 space-y-6 animate-fade-in pb-28">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0058bc]/10 text-[#0058bc] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            AI MENTOR
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1b1b1d] tracking-tight mt-1.5">
            Ask me anything about your future.
          </h1>
          <p className="text-sm text-[#555a64] font-medium mt-0.5">
            Friendly advice explained simply, with zero technical fluff.
          </p>
        </div>

        <button
          onClick={handleClearChat}
          title="Reset Conversation"
          className="p-2 rounded-xl text-[#717786] hover:bg-black/5 hover:text-[#1b1b1d] transition-all cursor-pointer flex items-center gap-1 text-xs"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Suggested Questions Quick Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#717786]">Try asking:</span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#f0f4fd] border border-black/5 hover:border-[#0058bc]/40 text-xs font-bold text-[#1b1b1d] hover:text-[#0058bc] transition-all cursor-pointer shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="glass-pearl rounded-3xl p-5 sm:p-6 border border-white/80 shadow-md space-y-4 min-h-[380px] max-h-[500px] overflow-y-auto">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-xl bg-[#0058bc] text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-lg p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isAI
                    ? 'bg-white border border-black/5 text-[#1b1b1d] shadow-2xs'
                    : 'bg-[#0058bc] text-white font-medium shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {msg.action && (
                  <div className="mt-3 pt-2 border-t border-black/5">
                    <button
                      onClick={() => onNavigate(msg.action!.tab)}
                      className="px-3 py-1.5 rounded-lg bg-[#0058bc] text-white text-xs font-bold hover:bg-[#004493] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{msg.action.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {!isAI && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0058bc] to-[#6462ec] text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-start gap-3 justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-xl bg-[#0058bc] text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-black/5 text-[#717786] text-xs p-3.5 rounded-2xl shadow-2xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0058bc] animate-pulse" />
              <span>SkillMesh AI is analyzing your skill graph & code evidence...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <div className="glass-pearl p-2 rounded-2xl border border-white/80 shadow-sm flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask anything... e.g. What project should I build next?"
          value={input}
          disabled={isThinking}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          className="flex-1 bg-white px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#1b1b1d] border border-black/5 focus:outline-none focus:border-[#0058bc] disabled:opacity-60"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={isThinking || !input.trim()}
          className="p-2.5 rounded-xl bg-[#0058bc] hover:bg-[#004493] text-white shadow-sm transition-all cursor-pointer flex items-center justify-center disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
