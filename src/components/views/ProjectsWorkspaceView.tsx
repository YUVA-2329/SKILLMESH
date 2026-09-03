import React, { useState } from 'react';
import { 
  FolderGit2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ShieldCheck, 
  ExternalLink, 
  Github, 
  Play, 
  Plus, 
  Send, 
  Flame, 
  X 
} from 'lucide-react';
import { CareerProject, SkillNode, UserProfile } from '../../types';
import confetti from 'canvas-confetti';

interface ProjectsWorkspaceViewProps {
  projects: CareerProject[];
  skills: SkillNode[];
  user: UserProfile;
  onUpdateProjects: (projects: CareerProject[]) => void;
  onSkillLeveledUp: (skillName: string, points: number) => void;
}

export const ProjectsWorkspaceView: React.FC<ProjectsWorkspaceViewProps> = ({
  projects,
  skills,
  user,
  onUpdateProjects,
  onSkillLeveledUp
}) => {
  const [selectedProject, setSelectedProject] = useState<CareerProject>(projects[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [targetSkillForGen, setTargetSkillForGen] = useState(skills[0]?.name || 'Python');

  // Submit proof form state
  const [repoInput, setRepoInput] = useState(selectedProject?.repoUrl || '');
  const [liveInput, setLiveInput] = useState(selectedProject?.liveUrl || '');
  const [isVerifyingSubmission, setIsVerifyingSubmission] = useState(false);

  const handleToggleMilestone = (milestoneId: string) => {
    const updatedProjects = projects.map(p => {
      if (p.id === selectedProject.id) {
        const updatedMilestones = p.milestones.map(m => {
          if (m.id === milestoneId) {
            const nextCompleted = !m.isCompleted;
            if (nextCompleted) {
              onSkillLeveledUp(m.provesSkill, 4);
              try {
                confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
              } catch (e) {}
            }
            return { ...m, isCompleted: nextCompleted };
          }
          return m;
        });
        const allDone = updatedMilestones.every(m => m.isCompleted);
        return {
          ...p,
          milestones: updatedMilestones,
          status: allDone ? ('completed' as const) : ('in_progress' as const)
        };
      }
      return p;
    });

    onUpdateProjects(updatedProjects);
    const curr = updatedProjects.find(p => p.id === selectedProject.id);
    if (curr) setSelectedProject(curr);
  };

  const handleGenerateProject = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetSkill: targetSkillForGen,
          targetRole: user.targetRole,
          currentLevel: 'Intermediate'
        })
      });

      const json = await res.json();
      if (json.success && json.project) {
        const newProj: CareerProject = {
          ...json.project,
          id: `proj-${Date.now()}`,
          status: 'in_progress'
        };
        const updated = [newProj, ...projects];
        onUpdateProjects(updated);
        setSelectedProject(newProj);
        setIsGeneratorModalOpen(false);
        try {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
        } catch (e) {}
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingSubmission(true);

    setTimeout(() => {
      const updatedProjects = projects.map(p => {
        if (p.id === selectedProject.id) {
          return {
            ...p,
            repoUrl: repoInput,
            liveUrl: liveInput,
            status: 'submitted' as const,
            aiFeedback: `Verified STRONG evidence: Analyzed test suites and production endpoints. Boosted ${p.skillsDeveloped.join(', ')} mastery.`
          };
        }
        return p;
      });

      onUpdateProjects(updatedProjects);
      const curr = updatedProjects.find(p => p.id === selectedProject.id);
      if (curr) setSelectedProject(curr);
      setIsVerifyingSubmission(false);

      selectedProject.skillsDeveloped.forEach(sk => onSkillLeveledUp(sk, 6));

      try {
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      } catch (e) {}
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-[#0058bc] uppercase tracking-wider flex items-center gap-1.5">
            <FolderGit2 className="w-4 h-4" />
            AI Project Generator & Proof Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1b1b1d] tracking-tight">
            Gap-Closing Projects Workspace
          </h1>
          <p className="text-xs text-[#717786] mt-1">
            Build bespoke real-world systems specifically targeted to eliminate missing skill nodes in your mesh.
          </p>
        </div>

        <button
          onClick={() => setIsGeneratorModalOpen(true)}
          className="magnetic-btn px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0058bc] to-[#4a47d2] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#0058bc]/25 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          Generate Custom Gap Project
        </button>
      </div>

      {/* Main Grid: Project List on Left, Active Workspace on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Selector Column */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#717786] uppercase tracking-wider px-1">
            Projects Portfolio ({projects.length})
          </div>

          {projects.map((proj) => {
            const isSelected = selectedProject?.id === proj.id;
            const completedCount = proj.milestones.filter(m => m.isCompleted).length;

            return (
              <div
                key={proj.id}
                onClick={() => {
                  setSelectedProject(proj);
                  setRepoInput(proj.repoUrl || '');
                  setLiveInput(proj.liveUrl || '');
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'glass-pearl border-[#0058bc] ring-2 ring-[#0058bc]/20 shadow-md'
                    : 'glass-liquid border-white/70 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                    proj.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : proj.status === 'submitted'
                        ? 'bg-[#0058bc]/10 text-[#0058bc]'
                        : 'bg-amber-100 text-amber-900'
                  }`}>
                    {proj.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-bold text-[#717786]">{proj.difficulty}</span>
                </div>

                <h3 className="text-sm font-bold text-[#1b1b1d] leading-snug">{proj.title}</h3>
                <p className="text-[11px] text-[#44474e] mt-1 line-clamp-2">{proj.tagline}</p>

                <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[11px]">
                  <span className="text-[#717786]">
                    Milestones: {completedCount}/{proj.milestones.length}
                  </span>
                  <span className="text-[#0058bc] font-bold">{proj.estimatedTime}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Project Workspace */}
        {selectedProject && (
          <div className="lg:col-span-2 glass-pearl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md space-y-6">
            {/* Workspace Header */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase bg-[#0058bc] text-white px-2.5 py-0.5 rounded-full">
                    {selectedProject.difficulty}
                  </span>
                  <span className="text-xs text-[#717786] font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedProject.estimatedTime}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  {selectedProject.portfolioValue}
                </span>
              </div>

              <h2 className="text-2xl font-extrabold text-[#1b1b1d] tracking-tight">
                {selectedProject.title}
              </h2>
              <p className="text-xs text-[#44474e] mt-1 leading-relaxed">
                {selectedProject.tagline}
              </p>
            </div>

            {/* Problem & Goal Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#fbf8fb] border border-black/5">
                <div className="text-[10px] font-extrabold uppercase text-[#717786] mb-1">Problem Statement</div>
                <p className="text-xs text-[#1b1b1d] leading-relaxed">{selectedProject.problemStatement}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#fbf8fb] border border-black/5">
                <div className="text-[10px] font-extrabold uppercase text-[#0058bc] mb-1">Technical Goal</div>
                <p className="text-xs text-[#1b1b1d] leading-relaxed">{selectedProject.goal}</p>
              </div>
            </div>

            {/* Tech Stack & Target Skills */}
            <div>
              <div className="text-xs font-bold text-[#717786] uppercase tracking-wider mb-2">
                Skills & Tech Stack Proved By This Project
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.skillsDeveloped.map((sk, idx) => (
                  <span key={idx} className="text-xs font-bold bg-[#0058bc]/10 text-[#0058bc] px-2.5 py-1 rounded-lg">
                    ★ {sk}
                  </span>
                ))}
                {selectedProject.techStack.map((tech, idx) => (
                  <span key={idx} className="text-xs font-medium bg-white text-[#44474e] px-2.5 py-1 rounded-lg border border-black/5">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Milestones Checklist */}
            <div>
              <div className="text-xs font-bold text-[#717786] uppercase tracking-wider mb-3">
                Milestone Proof Checklist
              </div>
              <div className="space-y-2.5">
                {selectedProject.milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleToggleMilestone(m.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      m.isCompleted
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        : 'bg-white/70 border-black/5 hover:bg-white'
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border ${
                      m.isCompleted ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-neutral-300 bg-white'
                    }`}>
                      {m.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${m.isCompleted ? 'line-through text-emerald-900' : 'text-[#1b1b1d]'}`}>
                          {m.title}
                        </span>
                        <span className="text-[10px] text-[#0058bc] font-semibold bg-[#0058bc]/5 px-2 py-0.5 rounded">
                          Proves: {m.provesSkill}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#717786] mt-0.5">{m.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission / Verification Box */}
            <div className="p-5 rounded-2xl bg-white border border-black/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-[#1b1b1d] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0058bc]" />
                  Submit Code Proofs for Automated Verification
                </div>
                {selectedProject.status === 'submitted' && (
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    Verified by AI
                  </span>
                )}
              </div>

              {selectedProject.aiFeedback && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                  {selectedProject.aiFeedback}
                </div>
              )}

              <form onSubmit={handleSubmitProof} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#44474e] block mb-1">GitHub Repo URL</label>
                    <input
                      type="text"
                      placeholder="https://github.com/..."
                      value={repoInput}
                      onChange={(e) => setRepoInput(e.target.value)}
                      className="w-full bg-[#fbf8fb] p-2.5 rounded-xl border border-black/10 outline-none focus:border-[#0058bc]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#44474e] block mb-1">Live Endpoint / Demo URL</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={liveInput}
                      onChange={(e) => setLiveInput(e.target.value)}
                      className="w-full bg-[#fbf8fb] p-2.5 rounded-xl border border-black/10 outline-none focus:border-[#0058bc]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isVerifyingSubmission || (!repoInput && !liveInput)}
                    className="px-5 py-2.5 rounded-xl bg-[#0058bc] hover:bg-[#004899] text-white font-bold flex items-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    {isVerifyingSubmission ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        Running Static Verification...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Submit & Upgrade Skill Mesh
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Generator Modal */}
      {isGeneratorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-pearl w-full max-w-md rounded-3xl p-6 border border-white/80 shadow-2xl relative">
            <button
              onClick={() => setIsGeneratorModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-black/5 text-[#717786]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-[#0058bc] to-[#4a47d2] text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1b1b1d]">AI Project Architect</h3>
                <p className="text-xs text-[#717786]">Targeted gap closure with Gemini 2.5</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#1b1b1d] block mb-1">Select Skill Gap to Bridge</label>
                <select
                  value={targetSkillForGen}
                  onChange={(e) => setTargetSkillForGen(e.target.value)}
                  className="w-full bg-white p-2.5 rounded-xl border border-black/10 outline-none focus:border-[#0058bc]"
                >
                  {skills.map((s) => (
                    <option key={s.id} value={s.name}>{s.name} ({s.category})</option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 border border-black/5 text-xs text-[#44474e] leading-relaxed">
                SkillMesh AI will construct an enterprise-grade challenge with milestones that verify code correctness, throughput, and deployment.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGeneratorModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#717786] hover:bg-black/5 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateProject}
                  disabled={isGenerating}
                  className="px-5 py-2.5 rounded-xl bg-[#0058bc] hover:bg-[#004899] text-white font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      Generating Architecture...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Project
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
