import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Target, 
  ShieldCheck, 
  Layers, 
  FolderGit2, 
  Zap, 
  TrendingUp, 
  Award, 
  AlertCircle,
  Play,
  Share2,
  ExternalLink
} from 'lucide-react';
import { 
  ActiveTab, 
  CareerGoal, 
  DailyMission, 
  SkillNode, 
  UserProfile, 
  CareerProject,
  EvidenceItem 
} from '../../types';

interface CommandCenterDashboardProps {
  user: UserProfile;
  careerGoal: CareerGoal;
  dailyMission?: DailyMission;
  skills: SkillNode[];
  projects: CareerProject[];
  evidence: EvidenceItem[];
  opportunities?: any[];
  people?: any[];
  team?: any;
  onNavigate: (tab: ActiveTab) => void;
  onSelectSkill: (skill: SkillNode) => void;
  onAskAI?: (prompt: string) => void;
}

export const CommandCenterDashboard: React.FC<CommandCenterDashboardProps> = ({
  user,
  careerGoal,
  dailyMission = {
    id: 'mission-react-hooks',
    title: 'Master React Hooks & Context',
    description: 'Complete the advanced context API module to reinforce your frontend node connections and state propagation.',
    category: 'Frontend Nodes',
    targetSkill: 'React & TypeScript',
    timeRemaining: '12:45 LEFT',
    durationMinutes: 25,
    isCompleted: false,
    xpReward: 150
  },
  skills = [],
  projects = [],
  evidence = [],
  opportunities = [],
  people = [],
  team,
  onNavigate,
  onSelectSkill,
  onAskAI
}) => {
  const activeProject = projects.find(p => p.status === 'in_progress') || projects[0] || {
    title: 'Production RAG Knowledge Assistant',
    status: 'in_progress'
  };
  const strongEvidenceCount = evidence.filter(e => e.category === 'STRONG').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 pb-16 animate-in fade-in duration-300">
      {/* Top Banner Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="text-xs font-bold text-[#0058bc] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Active Session • Level {user.intelligenceLevel} Mesh
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1b1b1d] tracking-tight">
            Good morning, {user.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('skills')}
            className="px-3.5 py-2 rounded-xl glass-pearl hover:bg-white text-xs font-bold text-[#1b1b1d] border border-white/80 shadow-2xs flex items-center gap-1.5 transition-all"
          >
            <Award className="w-3.5 h-3.5 text-[#0058bc]" />
            <span>My Skills</span>
          </button>
          <button
            onClick={() => onNavigate('resume')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-50 text-xs font-semibold text-[#44474e] border border-black/5 flex items-center gap-1.5 transition-all"
          >
            <span>Update Credentials</span>
          </button>
        </div>
      </div>

      {/* Hero "WHAT SHOULD I DO NEXT?" Card */}
      <section className="glass-pearl rounded-3xl p-6 sm:p-7 border border-white/80 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#0058bc]/10 via-[#4a47d2]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#0058bc] text-white">
              Primary AI Recommendation
            </span>
            <span className="text-xs text-[#717786] font-medium">Updated 3 mins ago</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1b1b1d] tracking-tight">
            WHAT SHOULD I DO NEXT?
          </h2>

          <p className="mt-2 text-sm text-[#44474e] max-w-2xl leading-relaxed">
            Completing <strong className="text-[#1b1b1d]">"{activeProject?.title}"</strong> bridges your only remaining critical gap in MLOps container deployment, boosting your verified fit for <strong className="text-[#0058bc]">{user.targetRole}</strong> to 94%.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              id="dashboard-resume-project-btn"
              onClick={() => onNavigate('projects')}
              className="magnetic-btn px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0058bc] to-[#4a47d2] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#0058bc]/25"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Resume Active Project
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('pathway')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-50 text-xs font-bold text-[#1b1b1d] border border-black/5 flex items-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              View Adaptive Pathway
            </button>
          </div>
        </div>
      </section>

      {/* Core Metrics Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="glass-liquid p-4 sm:p-5 rounded-2xl border border-white/70 shadow-xs">
          <div className="flex items-center justify-between text-[#717786] text-xs font-semibold">
            <span>Skill Fit Score</span>
            <Target className="w-4 h-4 text-[#0058bc]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#1b1b1d]">{careerGoal.fitScore}%</span>
            <span className="text-xs text-emerald-600 font-bold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +6%
            </span>
          </div>
          <div className="text-[11px] text-[#717786] mt-1 font-medium">Target: {user.targetRole}</div>
        </div>

        <div className="glass-liquid p-4 sm:p-5 rounded-2xl border border-white/70 shadow-xs">
          <div className="flex items-center justify-between text-[#717786] text-xs font-semibold">
            <span>Verified Proofs</span>
            <ShieldCheck className="w-4 h-4 text-[#4a47d2]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#1b1b1d]">{evidence.length}</span>
            <span className="text-xs text-[#0058bc] font-bold">{strongEvidenceCount} Strong</span>
          </div>
          <div className="text-[11px] text-[#717786] mt-1 font-medium">0 unverified claims</div>
        </div>

        <div className="glass-liquid p-4 sm:p-5 rounded-2xl border border-white/70 shadow-xs">
          <div className="flex items-center justify-between text-[#717786] text-xs font-semibold">
            <span>Active Missions</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#1b1b1d]">{user.activeMissionsCount}</span>
            <span className="text-xs text-amber-600 font-bold">+150 XP</span>
          </div>
          <div className="text-[11px] text-[#717786] mt-1 font-medium">1 due today</div>
        </div>

        <div className="glass-liquid p-4 sm:p-5 rounded-2xl border border-white/70 shadow-xs">
          <div className="flex items-center justify-between text-[#717786] text-xs font-semibold">
            <span>Target Salary</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-extrabold text-[#1b1b1d]">$175k-$240k</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">{careerGoal.demandTrend}</div>
        </div>
      </section>

      {/* Main Grid: Adaptive Pathway Timeline + Daily Mission Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Adaptive Pathway Timeline */}
        <section className="lg:col-span-2 glass-pearl rounded-3xl p-6 border border-white/80 shadow-md">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-xs font-bold text-[#0058bc] uppercase tracking-wider">
                ADAPTIVE PATHWAY TIMELINE
              </div>
              <h3 className="text-lg font-bold text-[#1b1b1d]">Shortest Sequence to Career Goal</h3>
            </div>
            <button
              onClick={() => onNavigate('pathway')}
              className="text-xs font-bold text-[#0058bc] hover:underline flex items-center gap-1"
            >
              Full analysis →
            </button>
          </div>

          <div className="space-y-4">
            {careerGoal.roadmapSteps.map((step, idx) => {
              const isCompleted = step.status === 'completed';
              const isActive = step.status === 'active';

              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#0058bc]/5 via-white to-transparent border-[#0058bc]/30 shadow-xs' 
                      : isCompleted 
                        ? 'bg-white/40 border-black/5 opacity-80' 
                        : 'bg-white/30 border-black/5 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        isCompleted 
                          ? 'bg-emerald-500 text-white' 
                          : isActive 
                            ? 'bg-[#0058bc] text-white shadow-xs' 
                            : 'bg-neutral-200 text-[#717786]'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#1b1b1d]">{step.title}</h4>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                            isCompleted 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : isActive 
                                ? 'bg-[#0058bc]/10 text-[#0058bc]' 
                                : 'bg-neutral-100 text-[#717786]'
                          }`}>
                            {step.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#44474e] mt-1 leading-relaxed">{step.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                          {step.skills.map((sk, skIdx) => (
                            <span 
                              key={skIdx}
                              className="text-[10px] bg-white text-[#44474e] font-semibold px-2 py-0.5 rounded-md border border-black/5"
                            >
                              {sk}
                            </span>
                          ))}
                          <span className="text-[10px] text-[#717786] ml-2">Est. {step.effort}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right 1 Col: Active Daily Mission Card */}
        <section className="glass-pearl rounded-3xl p-6 border border-white/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {dailyMission.timeRemaining}
              </span>
              <span className="text-xs font-bold text-[#0058bc]">+{dailyMission.xpReward} XP</span>
            </div>

            <h3 className="text-lg font-bold text-[#1b1b1d] leading-snug">{dailyMission.title}</h3>
            <p className="text-xs text-[#44474e] mt-2 leading-relaxed">{dailyMission.description}</p>

            {/* Mini SVG Node Graph Preview (Matches Image 9) */}
            <div className="mt-5 p-4 rounded-2xl bg-white/70 border border-black/5 flex items-center justify-center relative overflow-hidden">
              <svg className="w-full h-24" viewBox="0 0 200 80">
                {/* Neural connections */}
                <line x1="40" y1="40" x2="100" y2="25" stroke="#0058bc" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
                <line x1="100" y1="25" x2="160" y2="40" stroke="#4a47d2" strokeWidth="2" opacity="0.6" />
                <line x1="100" y1="25" x2="100" y2="65" stroke="#6462ec" strokeWidth="2" opacity="0.5" />
                
                {/* Node Circles */}
                <circle cx="40" cy="40" r="14" fill="#ffffff" stroke="#0058bc" strokeWidth="2" />
                <text x="40" y="43" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#0058bc">State</text>

                <circle cx="100" cy="25" r="18" fill="#0058bc" />
                <text x="100" y="28" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#ffffff">Hooks</text>

                <circle cx="160" cy="40" r="14" fill="#ffffff" stroke="#4a47d2" strokeWidth="2" />
                <text x="160" y="43" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#4a47d2">Effect</text>

                <circle cx="100" cy="65" r="10" fill="#ffffff" stroke="#717786" strokeWidth="1.5" />
                <text x="100" y="68" fontSize="7" textAnchor="middle" fill="#717786">Ref</text>
              </svg>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <button
              onClick={() => onNavigate('skills')}
              className="w-full py-2.5 rounded-xl bg-[#0058bc] hover:bg-[#004899] text-white text-xs font-bold transition-colors shadow-xs"
            >
              Start Mission Verification
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className="w-full py-2 rounded-xl bg-white hover:bg-neutral-50 text-xs font-semibold text-[#44474e] border border-black/5"
            >
              Skip / Select Another
            </button>
          </div>
        </section>
      </div>

      {/* Quick Launch Cards Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('skills')}
          className="glass-liquid p-4 rounded-2xl border border-white/80 hover:bg-white cursor-pointer transition-all shadow-xs group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0058bc]/10 text-[#0058bc] group-hover:scale-105 transition-transform">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1b1b1d]">Verified Skills Ledger</h4>
              <p className="text-[11px] text-[#717786]">Interactive capability list</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('evidence')}
          className="glass-liquid p-4 rounded-2xl border border-white/80 hover:bg-white cursor-pointer transition-all shadow-xs group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#4a47d2]/10 text-[#4a47d2] group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1b1b1d]">Evidence Vault</h4>
              <p className="text-[11px] text-[#717786]">{strongEvidenceCount} strong proofs</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('github')}
          className="glass-liquid p-4 rounded-2xl border border-white/80 hover:bg-white cursor-pointer transition-all shadow-xs group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neutral-900/10 text-[#1b1b1d] group-hover:scale-105 transition-transform">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1b1b1d]">GitHub Deep AI</h4>
              <p className="text-[11px] text-[#717786]">Codebase analysis</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('people')}
          className="glass-liquid p-4 rounded-2xl border border-white/80 hover:bg-white cursor-pointer transition-all shadow-xs group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1b1b1d]">Matched Investors</h4>
              <p className="text-[11px] text-[#717786]">Sequoia & Conviction</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
