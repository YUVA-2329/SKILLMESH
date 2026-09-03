import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  Code, 
  Zap, 
  ChevronRight, 
  Target, 
  TrendingUp, 
  Layers,
  HelpCircle,
  Lightbulb,
  X
} from 'lucide-react';
import { ActiveTab, SkillNode, UserProfile } from '../../types';
import { soundEffects } from '../effects/SoundFeedback';
import { SpotlightCard } from '../effects/SpotlightCard';
import { DecryptedText } from '../effects/DecryptedText';
import { VariableProximity } from '../effects/VariableProximity';
import { SplitText } from '../effects/SplitText';
import { BlurText } from '../effects/BlurText';
import { ShinyText } from '../effects/ShinyText';
import { TrueFocus } from '../effects/TrueFocus';

interface HomeSimpleViewProps {
  user: UserProfile;
  skills: SkillNode[];
  onNavigate: (tab: ActiveTab) => void;
  onOpenAskAI: (initialPrompt?: string) => void;
  onUpdateGoal: (newGoal: string) => void;
}

const AVAILABLE_GOALS = [
  {
    title: 'AI Engineer',
    description: 'Build neural models, computer vision systems, and intelligent tools.',
    readiness: 62,
    topSkills: ['Python', 'SQL', 'React', 'Machine Learning'],
    missing: 'Computer Vision & Docker',
    recommendedProject: 'Build a Computer Vision project',
    recommendedReason: 'It will improve 3 skills you need for AI Engineering.'
  },
  {
    title: 'Full-Stack Developer',
    description: 'Create fast web applications from frontend interfaces to databases.',
    readiness: 78,
    topSkills: ['React', 'Python', 'SQL', 'FastAPI'],
    missing: 'System Architecture',
    recommendedProject: 'Build a Real-Time Collaborative Canvas',
    recommendedReason: 'Connects your strong React and FastAPI skills with WebSockets.'
  },
  {
    title: 'Data Scientist',
    description: 'Turn complex numbers into visual stories and predictive insights.',
    readiness: 69,
    topSkills: ['Python', 'SQL', 'Machine Learning', 'Data Pipelines'],
    missing: 'Statistical Modeling',
    recommendedProject: 'Analyze Climate Sensor Datasets',
    recommendedReason: 'Proves your SQL and Python data cleaning in real-world scenarios.'
  },
  {
    title: 'Game Developer',
    description: 'Design interactive worlds, physics mechanics, and immersive gameplay.',
    readiness: 45,
    topSkills: ['Python', 'React', 'Logic & Algorithms'],
    missing: '3D Graphics & Game Engines',
    recommendedProject: 'Build a 2D Physics Puzzle Game',
    recommendedReason: 'Introduces frame loops, collision detection, and player controls.'
  },
  {
    title: 'Cybersecurity Specialist',
    description: 'Protect systems, find vulnerabilities, and secure data networks.',
    readiness: 50,
    topSkills: ['Python', 'SQL', 'Linux Basics'],
    missing: 'Network Defense & Cryptography',
    recommendedProject: 'Build a Network Packet Analyzer',
    recommendedReason: 'Demonstrates understanding of protocols and safe data handling.'
  }
];

export const HomeSimpleView: React.FC<HomeSimpleViewProps> = ({
  user,
  skills,
  onNavigate,
  onOpenAskAI,
  onUpdateGoal
}) => {
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // Current goal details
  const currentGoalData = AVAILABLE_GOALS.find(g => g.title === user.targetRole) || AVAILABLE_GOALS[0];

  // Top 4 skills for Alex
  const topSkillNames = ['Python', 'React', 'SQL', 'Machine Learning'];
  const topSkills = topSkillNames.map(name => {
    const found = skills.find(s => s.name.toLowerCase().includes(name.toLowerCase()));
    if (found) return found;
    return {
      id: `skill-${name.toLowerCase()}`,
      name,
      masteryPercentage: name === 'Python' ? 86 : name === 'React' ? 74 : name === 'SQL' ? 80 : 55,
      level: 'Advanced',
      status: 'mastered'
    } as SkillNode;
  });

  const handleSelectGoal = (goalTitle: string) => {
    soundEffects.playClick(600);
    onUpdateGoal(goalTitle);
    setIsGoalModalOpen(false);
  };

  const handleStartNextMove = () => {
    soundEffects.playChime();
    onNavigate('projects');
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-8 animate-fade-in pb-28">
      
      {/* 1. GREETING - Bold, interactive, dynamic typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#555a64] font-heading">
              Hey
            </span>
            <VariableProximity
              label={user.name}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b1b1d] tracking-tight cursor-default"
              radius={130}
              minWeight={700}
              maxWeight={900}
              minScale={1.0}
              maxScale={1.12}
            />
            <span className="text-3xl sm:text-4xl inline-block hover:rotate-12 transition-transform cursor-pointer">
              👋
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <BlurText
              text="Let's build your future with verified intelligence."
              className="text-base sm:text-lg text-[#555a64] font-semibold"
              delay={35}
            />
          </div>
        </div>

        {/* Quick Question Trigger Pill */}
        <button
          onClick={() => onOpenAskAI("What should I learn next?")}
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-white hover:bg-[#f0f4fd] border border-[#0058bc]/20 shadow-sm text-xs font-bold text-[#0058bc] flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.03] active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-[#0058bc]" />
          <ShinyText text="Need help? Ask AI" speed={3} className="font-bold text-xs" />
        </button>
      </div>

      {/* CORE 3-QUESTION CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 2. YOUR GOAL (Where am I?) */}
        <div className="glass-pearl rounded-3xl p-6 border border-white/80 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#0058bc] bg-[#0058bc]/10 px-2.5 py-0.5 rounded-md">
                YOU WANT TO BECOME
              </span>
              <button
                onClick={() => {
                  soundEffects.playClick(620);
                  setIsGoalModalOpen(true);
                }}
                className="text-xs font-bold text-[#0058bc] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Change goal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-[#0058bc]/10 text-[#0058bc] flex items-center justify-center font-bold text-2xl shadow-inner flex-shrink-0">
                🎯
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1b1b1d] font-heading tracking-tight">
                  <SplitText 
                    text={user.targetRole || 'AI Engineer'} 
                    delay={30}
                    className="font-black"
                  />
                </h2>
                <p className="text-xs sm:text-sm text-[#555a64] font-medium mt-1 line-clamp-2 leading-relaxed">
                  {currentGoalData.description}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between text-xs text-[#555a64]">
            <span className="font-bold text-[#1b1b1d]">Goal Path: <span className="text-emerald-700 font-extrabold">Ready to practice</span></span>
            <button
              onClick={() => onNavigate('learn')}
              className="text-[#0058bc] font-extrabold hover:underline cursor-pointer flex items-center gap-1 group"
            >
              <span>See learning plan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 3. YOUR PROGRESS (How am I doing?) */}
        <div className="glass-pearl rounded-3xl p-6 border border-white/80 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#4a47d2] bg-[#4a47d2]/10 px-2.5 py-0.5 rounded-md">
                YOUR PROGRESS
              </span>
              <button
                onClick={() => onNavigate('passport')}
                className="text-xs font-bold text-[#0058bc] hover:underline cursor-pointer"
              >
                View Passport
              </button>
            </div>

            <div className="mt-4 flex items-center gap-5">
              {/* Simple Clean Progress Gauge */}
              <div className="relative w-18 h-18 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#e2e8f0]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#0058bc] transition-all duration-1000 ease-out"
                    strokeDasharray={`${user.skillFitScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-base font-black text-[#1b1b1d] font-tech">
                  {user.skillFitScore}%
                </span>
              </div>

              <div>
                <div className="text-xs font-extrabold text-[#717786] uppercase tracking-wider">
                  Target Trajectory
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#0058bc] font-tech mt-0.5">
                  {user.skillFitScore}% Ready
                </div>
                <div className="text-xs font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified capability index is advancing.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-black/5 text-xs text-[#555a64] flex items-center justify-between">
            <span className="font-semibold">Strong in Python & SQL</span>
            <button
              onClick={() => onNavigate('skills')}
              className="text-[#0058bc] font-extrabold hover:underline cursor-pointer flex items-center gap-1 group"
            >
              <span>Why this score?</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. WHAT SHOULD I DO NEXT? (The Main Feature of Home Page) */}
      <SpotlightCard
        spotlightColor="rgba(0, 88, 188, 0.16)"
        className="glass-pearl rounded-3xl p-6 sm:p-8 border-2 border-[#0058bc]/25 shadow-xl relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0058bc]/10 text-[#0058bc] text-xs font-black tracking-wider uppercase">
              <Zap className="w-3.5 h-3.5" />
              YOUR NEXT MOVE
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-[#1b1b1d] font-heading tracking-tight">
              <SplitText
                text={currentGoalData.recommendedProject}
                delay={20}
                className="font-black"
              />
            </h3>

            <div className="text-sm font-medium text-[#44474e] flex items-start gap-2 pt-1">
              <span className="font-extrabold text-[#1b1b1d] flex-shrink-0 bg-black/5 px-2 py-0.5 rounded text-xs">WHY</span>
              <span className="leading-relaxed">{currentGoalData.recommendedReason}</span>
            </div>

            {/* Practice Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold text-[#717786]">You'll practice:</span>
              <span className="px-3 py-1 rounded-lg bg-white text-[#1b1b1d] text-xs font-extrabold border border-black/5 shadow-2xs hover:scale-105 transition-transform cursor-default">
                Python
              </span>
              <span className="px-3 py-1 rounded-lg bg-white text-[#1b1b1d] text-xs font-extrabold border border-black/5 shadow-2xs hover:scale-105 transition-transform cursor-default">
                Machine Learning
              </span>
              <span className="px-3 py-1 rounded-lg bg-white text-[#1b1b1d] text-xs font-extrabold border border-black/5 shadow-2xs hover:scale-105 transition-transform cursor-default">
                Computer Vision
              </span>
              <span className="px-3 py-1 rounded-lg bg-white text-[#1b1b1d] text-xs font-extrabold border border-black/5 shadow-2xs hover:scale-105 transition-transform cursor-default">
                Deployment
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2.5 flex-shrink-0">
            <button
              onClick={handleStartNextMove}
              className="px-8 py-3.5 rounded-2xl bg-[#0058bc] hover:bg-[#004493] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0058bc]/25 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer font-heading"
            >
              <span>Start Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenAskAI(`How should I start this project: "${currentGoalData.recommendedProject}"?`)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#555a64] hover:text-[#0058bc] hover:bg-white/80 text-center transition-colors cursor-pointer"
            >
              Ask AI how to start
            </button>
          </div>
        </div>
      </SpotlightCard>

      {/* 4. YOUR SKILLS (Show top 4 with clean visual bars) */}
      <div className="glass-pearl rounded-3xl p-6 sm:p-7 border border-white/80 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-black/5">
          <div>
            <h3 className="text-base font-black text-[#1b1b1d] tracking-tight uppercase font-heading">
              YOUR TOP SKILLS
            </h3>
            <p className="text-xs text-[#717786] font-medium">The verified capabilities you use the most</p>
          </div>
          <button
            onClick={() => {
              soundEffects.playClick(680);
              onNavigate('skills');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#f0f4fd] border border-black/5 text-xs font-bold text-[#0058bc] transition-all cursor-pointer flex items-center gap-1"
          >
            <span>See all skills</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topSkills.map((skill) => (
            <div
              key={skill.id}
              onClick={() => onNavigate('skills')}
              className="p-4 rounded-2xl bg-white/80 hover:bg-white border border-black/5 shadow-2xs hover:border-[#0058bc]/40 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-sm text-[#1b1b1d] font-heading group-hover:text-[#0058bc] transition-colors">
                  {skill.name}
                </span>
                <span className="text-base font-black text-[#0058bc] font-tech">
                  {skill.masteryPercentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-[#f0f2f6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0058bc] to-[#4a47d2] rounded-full transition-all duration-500"
                  style={{ width: `${skill.masteryPercentage}%` }}
                />
              </div>

              <div className="mt-2 text-[11px] text-[#717786] font-medium flex items-center justify-between">
                <span>Verified with projects</span>
                <span className="text-[#0058bc] font-bold group-hover:underline">View proof</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. RECENT PROGRESS (Latest 2-3 activities) */}
      <div className="glass-pearl rounded-3xl p-6 border border-white/80 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-black/5">
          <h3 className="text-base font-extrabold text-[#1b1b1d] tracking-tight uppercase">
            RECENT PROGRESS
          </h3>
          <button
            onClick={() => onNavigate('evidence')}
            className="text-xs font-bold text-[#0058bc] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>See activity</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/70 border border-black/5">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <span className="text-sm font-bold text-[#1b1b1d]">Added Python project</span>
            </div>
            <span className="text-xs text-[#717786] font-medium">2 days ago</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/70 border border-black/5">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <span className="text-sm font-bold text-[#1b1b1d]">Completed ML assessment</span>
            </div>
            <span className="text-xs text-[#717786] font-medium">5 days ago</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/70 border border-black/5">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <span className="text-sm font-bold text-[#1b1b1d]">Earned GitHub evidence</span>
            </div>
            <span className="text-xs text-[#717786] font-medium">1 week ago</span>
          </div>
        </div>
      </div>

      {/* 7. SIMPLE AI QUESTIONS CARD */}
      <div className="glass-pearl rounded-3xl p-6 sm:p-7 border border-[#0058bc]/20 shadow-md bg-gradient-to-br from-[#0058bc]/5 via-white/50 to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0058bc] text-white flex items-center justify-center shadow-md shadow-[#0058bc]/25 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <TrueFocus 
                sentence="Ask SkillMesh AI Intelligence"
                manualMode={false}
                blurAmount={2.5}
                borderColor="#0058bc"
                glowColor="rgba(0, 88, 188, 0.25)"
                className="text-lg font-black text-[#1b1b1d] font-heading tracking-tight"
              />
              <p className="text-xs text-[#555a64] font-medium mt-0.5">Get instant, deterministic advice about your trajectory</p>
            </div>
          </div>
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0058bc]/10 text-[#0058bc] text-xs font-black">
            <ShinyText text="SERVER POWERED" speed={2.5} className="font-tech text-[10px] tracking-wider font-extrabold" />
          </div>
        </div>

        {/* 4 Suggested Question Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
          {[
            { prompt: "What should I learn next?", label: "“What should I learn next?”" },
            { prompt: "What should I build next to improve my portfolio?", label: "“What should I build next?”" },
            { prompt: `Am I ready for an entry-level ${user.targetRole || 'AI Engineer'} job?`, label: "“Am I ready for this role?”" },
            { prompt: `What skills am I missing to become an ${user.targetRole || 'AI Engineer'}?`, label: "“What skills am I missing?”" }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundEffects.playClick(720);
                onOpenAskAI(item.prompt);
              }}
              className="p-3.5 rounded-2xl bg-white hover:bg-[#f0f4fd] border border-black/5 hover:border-[#0058bc]/40 text-left text-xs font-bold text-[#1b1b1d] hover:text-[#0058bc] transition-all flex items-center justify-between cursor-pointer group shadow-2xs hover:shadow-xs"
            >
              <span className="font-heading font-extrabold">{item.label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#717786] group-hover:text-[#0058bc] group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>

      {/* CHANGE GOAL MODAL */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-black/10 relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div>
                <h3 className="text-lg font-black text-[#1b1b1d]">Choose your goal</h3>
                <p className="text-xs text-[#717786]">SkillMesh adapts your learning and projects to this path.</p>
              </div>
              <button
                onClick={() => setIsGoalModalOpen(false)}
                className="p-2 rounded-xl text-[#717786] hover:bg-black/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {AVAILABLE_GOALS.map((goal) => {
                const isSelected = goal.title === user.targetRole;
                return (
                  <div
                    key={goal.title}
                    onClick={() => handleSelectGoal(goal.title)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#0058bc]/10 border-[#0058bc] shadow-xs'
                        : 'bg-white hover:bg-[#f8fafd] border-black/5'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#1b1b1d]">
                          {goal.title}
                        </span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-md bg-[#0058bc] text-white text-[10px] font-extrabold uppercase">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#555a64]">{goal.description}</p>
                      <div className="text-[11px] text-[#0058bc] font-bold">
                        Next: {goal.recommendedProject}
                      </div>
                    </div>

                    <div className="text-right pl-3 flex-shrink-0">
                      <div className="text-sm font-black text-[#0058bc]">
                        {goal.readiness}%
                      </div>
                      <div className="text-[10px] text-[#717786] font-medium">
                        Ready
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-center">
              <p className="text-xs text-[#717786]">
                You can change your goal anytime without losing any of your skills or projects.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
