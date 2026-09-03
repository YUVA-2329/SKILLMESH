import React, { useState } from 'react';
import { 
  GitBranch, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Target, 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  FolderGit2, 
  Layers 
} from 'lucide-react';
import { ActiveTab, CareerGoal, SkillNode, UserProfile } from '../../types';

interface AdaptivePathwayViewProps {
  careerGoal: CareerGoal;
  skills: SkillNode[];
  user: UserProfile;
  onNavigate: (tab: ActiveTab) => void;
  onUpdateTargetRole: (newRole: string) => void;
}

export const AdaptivePathwayView: React.FC<AdaptivePathwayViewProps> = ({
  careerGoal,
  skills,
  user,
  onNavigate,
  onUpdateTargetRole
}) => {
  const [selectedRole, setSelectedRole] = useState(user.targetRole || 'AI Engineer');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customRoadmap, setCustomRoadmap] = useState(careerGoal.roadmapSteps);
  const [strategicAdvice, setStrategicAdvice] = useState(
    "You are currently in the 82nd percentile of verified AI Engineers. Your immediate leverage point is completing a containerized MLOps RAG pipeline with public latency benchmarks."
  );

  const availableRoles = [
    'AI Engineer',
    'Tech Founder / CTO',
    'AI Research Scientist',
    'Staff Distributed Systems Engineer'
  ];

  const handleRoleChange = async (newRole: string) => {
    setSelectedRole(newRole);
    onUpdateTargetRole(newRole);
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/gemini/career-gap-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSkills: skills.map(s => ({ name: s.name, mastery: s.masteryPercentage })),
          targetRole: newRole
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.roadmap) {
          setCustomRoadmap(json.data.roadmap.map((r: any, idx: number) => ({
            title: r.title,
            description: r.description,
            skills: r.skillsToAcquire || [],
            timeline: idx === 0 ? 'ACTIVE FOCUS • NEXT 3 WEEKS' : 'PROJECTED • Q4 2026',
            status: idx === 0 ? 'active' : 'projected',
            reason: r.reasoning,
            effort: `${r.effortHours || 20} hrs`
          })));
        }
        if (json.data.strategicAdvice) {
          setStrategicAdvice(json.data.strategicAdvice);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 pb-16 animate-in fade-in duration-300">
      {/* Header with Role Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-[#0058bc] uppercase tracking-wider flex items-center gap-1.5">
            <GitBranch className="w-4 h-4" />
            Deterministic Gap Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1b1b1d] tracking-tight">
            Adaptive Shortest Pathway
          </h1>
          <p className="text-xs text-[#717786] mt-1">
            Mathematically calculated minimal effort sequence to reach top-percentile market fit.
          </p>
        </div>

        {/* Target Role Selector */}
        <div className="flex items-center gap-2 bg-white/80 p-1.5 rounded-2xl border border-black/5 shadow-2xs">
          <span className="text-xs font-bold text-[#717786] pl-2 hidden sm:inline">Target:</span>
          <select
            value={selectedRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            disabled={isAnalyzing}
            className="bg-transparent text-xs font-bold text-[#0058bc] outline-none cursor-pointer py-1 pr-2"
          >
            {availableRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Strategic Advice Card */}
      <section className="glass-pearl rounded-3xl p-6 border border-white/80 shadow-md relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#0058bc] to-[#4a47d2] text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-[#0058bc]">
              AI Strategic Assessment ({selectedRole})
            </div>
            <p className="text-sm font-medium text-[#1b1b1d] leading-relaxed">
              {strategicAdvice}
            </p>
          </div>
        </div>
      </section>

      {/* Gap Analysis 3-Column Diagnostic */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Verified Strengths */}
        <div className="glass-liquid p-5 rounded-2xl border border-white/70 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Verified Strengths (82%)
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xs text-[#717786] mb-3">Nodes with verified STRONG evidence artifacts:</p>
          <div className="flex flex-wrap gap-1.5">
            {careerGoal.currentSkills.map((sk, idx) => (
              <span key={idx} className="text-xs bg-white text-[#1b1b1d] font-semibold px-2.5 py-1 rounded-lg border border-black/5 shadow-2xs">
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Weak / Developing */}
        <div className="glass-liquid p-5 rounded-2xl border border-white/70 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-[#0058bc] bg-[#0058bc]/10 px-2.5 py-0.5 rounded-full">
              Developing Nodes
            </span>
            <Zap className="w-4 h-4 text-[#0058bc]" />
          </div>
          <p className="text-xs text-[#717786] mb-3">Skills that require upgraded evidence:</p>
          <div className="flex flex-wrap gap-1.5">
            {careerGoal.weakSkills.map((sk, idx) => (
              <span key={idx} className="text-xs bg-white text-[#0058bc] font-semibold px-2.5 py-1 rounded-lg border border-black/5 shadow-2xs">
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Critical Gaps */}
        <div className="glass-liquid p-5 rounded-2xl border border-white/70 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
              Critical Missing Gaps
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xs text-[#717786] mb-3">Zero evidence found in candidate graph:</p>
          <div className="flex flex-wrap gap-1.5">
            {careerGoal.missingSkills.map((sk, idx) => (
              <span key={idx} className="text-xs bg-white text-rose-700 font-semibold px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs">
                {sk}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Roadmap Steps */}
      <section className="glass-pearl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#1b1b1d]">Calculated Shortest Path Execution Plan</h3>
            <p className="text-xs text-[#717786]">Sequential milestones designed to maximize credential velocity.</p>
          </div>
          <span className="text-xs font-bold text-[#0058bc] bg-[#0058bc]/10 px-3 py-1 rounded-full">
            Est. Time: 4-6 Weeks
          </span>
        </div>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-gradient-to-b before:from-[#0058bc] before:via-[#4a47d2] before:to-transparent before:-z-0">
          {customRoadmap.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'active';

            return (
              <div key={idx} className="relative z-10 pl-14">
                {/* Step Marker */}
                <div className={`absolute left-3 -translate-x-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                  isCompleted 
                    ? 'bg-emerald-500 text-white' 
                    : isActive 
                      ? 'bg-[#0058bc] text-white ring-4 ring-[#0058bc]/20' 
                      : 'bg-white text-[#717786] border border-black/10'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>

                <div className={`p-5 rounded-2xl border transition-all ${
                  isActive 
                    ? 'bg-white border-[#0058bc]/40 shadow-lg' 
                    : 'bg-white/60 border-black/5'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-[#1b1b1d]">{step.title}</h4>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                        isCompleted ? 'bg-emerald-100 text-emerald-800' : isActive ? 'bg-[#0058bc] text-white' : 'bg-neutral-100 text-[#717786]'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                    <span className="text-xs text-[#717786] font-medium">{step.timeline}</span>
                  </div>

                  <p className="text-xs text-[#44474e] leading-relaxed mb-3">{step.description}</p>

                  <div className="p-3 rounded-xl bg-[#fbf8fb] border border-black/5 text-xs text-[#44474e] mb-3">
                    <strong className="text-[#0058bc]">Why this step: </strong>
                    {step.reason}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-black/5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {step.skills.map((sk, sIdx) => (
                        <span key={sIdx} className="text-[11px] bg-white text-[#1b1b1d] font-semibold px-2.5 py-0.5 rounded-md border border-black/5">
                          {sk}
                        </span>
                      ))}
                      <span className="text-xs text-[#717786] ml-2">Effort: {step.effort}</span>
                    </div>

                    {isActive && (
                      <button
                        onClick={() => onNavigate('projects')}
                        className="px-4 py-1.5 rounded-xl bg-[#0058bc] hover:bg-[#004899] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <FolderGit2 className="w-3.5 h-3.5" />
                        Launch Bridge Project
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
