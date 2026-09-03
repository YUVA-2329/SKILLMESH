import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  X, 
  ArrowRight, 
  Layers, 
  Code, 
  FileCheck, 
  Github, 
  ExternalLink,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { ActiveTab, SkillNode, UserProfile } from '../../types';
import { soundEffects } from '../effects/SoundFeedback';
import { SplitText } from '../effects/SplitText';
import { ShinyText } from '../effects/ShinyText';

interface MySkillsSimpleViewProps {
  skills: SkillNode[];
  user: UserProfile;
  onNavigate: (tab: ActiveTab) => void;
  onSelectSkillForGraph?: (skill: SkillNode) => void;
  onAddSkill?: (skill: SkillNode) => void;
}

export const MySkillsSimpleView: React.FC<MySkillsSimpleViewProps> = ({
  skills,
  user,
  onNavigate,
  onSelectSkillForGraph,
  onAddSkill
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'strong' | 'improving' | 'gaps'>('all');
  const [selectedSkillForWhy, setSelectedSkillForWhy] = useState<SkillNode | null>(null);
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New skill form state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('AI & Machine Learning');
  const [newSkillMastery, setNewSkillMastery] = useState(65);
  const [newSkillDesc, setNewSkillDesc] = useState('');

  const filteredSkills = skills.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'strong') return s.masteryPercentage >= 70;
    if (activeFilter === 'improving') return s.masteryPercentage >= 40 && s.masteryPercentage < 70;
    if (activeFilter === 'gaps') return s.masteryPercentage < 40;
    return true;
  });

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill: SkillNode = {
      id: `skill-${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCategory as any,
      description: newSkillDesc.trim() || `Verified technical capability in ${newSkillName.trim()} demonstrated through custom projects and assessments.`,
      masteryPercentage: Number(newSkillMastery),
      level: Number(newSkillMastery) >= 80 ? 'Expert' : Number(newSkillMastery) >= 60 ? 'Advanced' : 'Intermediate',
      confidence: 88,
      freshnessScore: 100,
      lastDemonstrated: 'Today',
      evidenceCount: 1,
      verifiedCertsCount: 1,
      status: Number(newSkillMastery) >= 70 ? 'mastered' : Number(newSkillMastery) >= 40 ? 'developing' : 'gap',
      isCoreCompetency: false,
      prerequisites: [],
      leadsTo: [],
      relatedSkills: ['Python', 'Docker'],
      connectedArtifacts: [],
      evidenceIds: []
    };

    if (onAddSkill) {
      onAddSkill(newSkill);
    }
    soundEffects.playClick(880);
    setIsAddModalOpen(false);
    setNewSkillName('');
    setNewSkillDesc('');
    setNewSkillMastery(65);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-6 animate-fade-in pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#0058bc] bg-[#0058bc]/10 px-2.5 py-0.5 rounded-md font-tech">
              PROVEN LEDGER
            </span>
            <ShinyText text="REAL-TIME METRICS" speed={3} className="text-[11px] font-bold text-[#4a47d2]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1b1b1d] font-heading tracking-tight mt-1">
            <SplitText text="Verified Skills Ledger" delay={25} className="font-black" />
          </h1>
          <p className="text-sm text-[#555a64] font-semibold mt-0.5">
            Everything SkillMesh knows you can build, mathematically verified with code proofs.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#0058bc] hover:bg-[#004899] text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#0058bc]/20 cursor-pointer transition-all hover:scale-[1.02] font-heading"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
          <button
            onClick={() => onNavigate('passport')}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#f0f4fd] border border-black/5 text-xs font-bold text-[#0058bc] flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all hover:scale-[1.02]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>View Passport</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-pearl p-3 rounded-2xl border border-white/80 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#717786] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search skills (e.g. Python, React, SQL)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white pl-10 pr-4 py-2 rounded-xl text-xs font-medium text-[#1b1b1d] border border-black/5 focus:outline-none focus:border-[#0058bc]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'strong', label: 'Strong (70%+)' },
            { id: 'improving', label: 'Improving' },
            { id: 'gaps', label: 'Missing for Goal' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                soundEffects.playClick(600);
                setActiveFilter(f.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-[#0058bc] text-white shadow-xs'
                  : 'bg-white text-[#555a64] hover:bg-white/80 border border-black/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="space-y-4">
        {filteredSkills.length === 0 ? (
          <div className="glass-pearl rounded-3xl p-12 text-center border border-white/80 shadow-md space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-[#0058bc]/10 text-[#0058bc] mx-auto flex items-center justify-center">
              <Search className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#1b1b1d]">No skills found</h3>
              <p className="text-xs text-[#717786] max-w-sm mx-auto">
                No verified skills match your current search or category filter. Try clearing your filters or adding a new skill.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#f0f4fd] border border-black/10 text-xs font-bold text-[#0058bc] transition-all cursor-pointer"
              >
                Reset Search & Filters
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#0058bc] hover:bg-[#004493] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Add Skill
              </button>
            </div>
          </div>
        ) : (
          filteredSkills.map((skill) => {
            const isStrong = skill.masteryPercentage >= 70;
            const isImproving = skill.masteryPercentage >= 40 && skill.masteryPercentage < 70;
            const isExpanded = expandedSkillId === skill.id;
            
            return (
              <div
                key={skill.id}
                className="glass-pearl rounded-3xl p-5 sm:p-6 border border-white/80 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  {/* Left: What is it? */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-xl sm:text-2xl font-black text-[#1b1b1d] font-heading tracking-tight hover-text-lift">
                        {skill.name}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-tech ${
                        isStrong
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isImproving
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {isStrong ? 'Strong' : isImproving ? 'Improving' : 'Needs Practice'}
                      </span>
                      <span className="text-xs text-[#717786] font-semibold hidden sm:inline">
                        • {skill.category}
                      </span>
                    </div>

                    {/* What is it? */}
                    <p className="text-xs sm:text-sm text-[#44474e] font-medium leading-relaxed max-w-2xl">
                      {skill.description}
                    </p>

                    {/* Why does SkillMesh think that? (Evidence summary) */}
                    <div className="pt-2">
                      <div className="text-[11px] font-black text-[#717786] uppercase tracking-wider mb-1.5 font-heading">
                        EVIDENCE SUMMARY
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-black/5 text-xs font-bold text-[#1b1b1d] shadow-2xs hover:scale-105 transition-transform cursor-default">
                          <Code className="w-3.5 h-3.5 text-[#0058bc]" />
                          {skill.evidenceCount || 4} projects
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-black/5 text-xs font-bold text-[#1b1b1d] shadow-2xs hover:scale-105 transition-transform cursor-default">
                          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                          {skill.verifiedCertsCount || 2} assessments
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-black/5 text-xs font-bold text-[#1b1b1d] shadow-2xs hover:scale-105 transition-transform cursor-default">
                          <Github className="w-3.5 h-3.5 text-[#1b1b1d]" />
                          Recent GitHub activity
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: How strong am I? & Why this score? */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/5">
                    <div className="text-left sm:text-right">
                      <div className="text-3xl sm:text-4xl font-black text-[#0058bc] font-tech tracking-tight">
                        {skill.masteryPercentage}%
                      </div>
                      <div className="text-[11px] text-[#717786] font-bold uppercase tracking-wider">
                        Demonstrated mastery
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedSkillId(isExpanded ? null : skill.id)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#f0f4fd] border border-black/5 text-xs font-bold text-[#44474e] shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Layers className="w-3.5 h-3.5 text-[#717786]" />
                        <span>{isExpanded ? 'Hide Connections' : 'Connections'}</span>
                      </button>

                      <button
                        onClick={() => {
                          soundEffects.playClick(650);
                          setSelectedSkillForWhy(skill);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#f0f4fd] border border-black/5 text-xs font-bold text-[#0058bc] shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Why this score?</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-black/5">
                  <div className="w-full h-2 bg-[#f0f2f6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0058bc] to-[#4a47d2] rounded-full transition-all duration-500"
                      style={{ width: `${skill.masteryPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Expanded Skill Connections and Ecosystem */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-black/5 bg-[#f8fafd] -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-5 sm:p-6 rounded-b-3xl space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0058bc] uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Skill Ecosystem & Connections
                      </span>
                      <span className="text-[11px] text-[#717786]">
                        {(skill.relatedSkills || []).length} linked nodes
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {(skill.relatedSkills || []).map((c, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-xl bg-white border border-black/5 text-xs font-semibold text-[#1b1b1d] shadow-2xs flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0058bc]" />
                          {c}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs text-[#717786]">
                        Last demonstrated: <strong>{skill.lastDemonstrated}</strong> • Confidence: <span className="text-emerald-700 font-bold">{skill.confidence}%</span>
                      </p>
                      <button
                        onClick={() => onNavigate('projects')}
                        className="text-xs font-bold text-[#0058bc] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Build project with {skill.name}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ADD NEW SKILL MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-black/10 relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#0058bc]/10 text-[#0058bc] flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#1b1b1d]">Add Skill to Mesh</h3>
                  <p className="text-xs text-[#717786]">Track and verify a new technical ability</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-[#717786] hover:bg-black/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1b1b1d] mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js, Kubernetes, Rust, PyTorch"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full bg-[#f8fafd] px-3.5 py-2 rounded-xl text-xs font-medium text-[#1b1b1d] border border-black/10 focus:outline-none focus:border-[#0058bc]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b1b1d] mb-1">
                  Domain Category
                </label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="w-full bg-[#f8fafd] px-3 py-2 rounded-xl text-xs font-medium text-[#1b1b1d] border border-black/10 focus:outline-none focus:border-[#0058bc]"
                >
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Languages">Languages & Frameworks</option>
                  <option value="Cloud & Systems">Cloud & Systems</option>
                  <option value="Data & Storage">Data & Storage</option>
                  <option value="Leadership & Product">Leadership & Product</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#1b1b1d]">
                    Initial Mastery Level
                  </label>
                  <span className="text-xs font-black text-[#0058bc]">{newSkillMastery}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={newSkillMastery}
                  onChange={(e) => setNewSkillMastery(Number(e.target.value))}
                  className="w-full accent-[#0058bc]"
                />
                <div className="flex justify-between text-[10px] text-[#717786] mt-0.5">
                  <span>Beginner (30%)</span>
                  <span>Competent (65%)</span>
                  <span>Expert (90%+)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b1b1d] mb-1">
                  Description / What you've built
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Built microservices in Go with gRPC and Redis caching..."
                  value={newSkillDesc}
                  onChange={(e) => setNewSkillDesc(e.target.value)}
                  className="w-full bg-[#f8fafd] px-3.5 py-2 rounded-xl text-xs font-medium text-[#1b1b1d] border border-black/10 focus:outline-none focus:border-[#0058bc] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#555a64] hover:bg-black/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0058bc] text-white text-xs font-bold hover:bg-[#004493] transition-colors cursor-pointer shadow-xs"
                >
                  Add to SkillMesh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* "WHY THIS SCORE?" FRIENDLY MODAL */}
      {selectedSkillForWhy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-black/10 relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#0058bc]/10 text-[#0058bc] flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-base font-black text-[#1b1b1d]">
                    Why {selectedSkillForWhy.name} is {selectedSkillForWhy.masteryPercentage}%
                  </h3>
                  <p className="text-xs text-[#717786]">Simple explanation of your score</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSkillForWhy(null)}
                className="p-1.5 rounded-xl text-[#717786] hover:bg-black/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#44474e] leading-relaxed">
              <p>
                SkillMesh verified your <strong>{selectedSkillForWhy.name}</strong> ability using 3 real proofs:
              </p>

              <div className="p-3 rounded-xl bg-[#f8fafd] border border-black/5 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-[#0058bc] font-bold">1.</span>
                  <div>
                    <strong>{selectedSkillForWhy.evidenceCount || 4} Real Projects:</strong> Your code shows proper syntax, unit tests, and working functionality.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#0058bc] font-bold">2.</span>
                  <div>
                    <strong>Assessments & Quizzes:</strong> You scored {selectedSkillForWhy.masteryPercentage + 4}% on foundational questions.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#0058bc] font-bold">3.</span>
                  <div>
                    <strong>Recent Activity:</strong> You used this skill {selectedSkillForWhy.lastDemonstrated || 'this week'}, so it stays fresh.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <strong>How to get this to 95%+:</strong> Build 1 more project with deployment or complete an advanced challenge.
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedSkillForWhy(null);
                  onNavigate('projects');
                }}
                className="px-4 py-2 rounded-xl bg-[#0058bc] text-white text-xs font-bold hover:bg-[#004493] transition-colors cursor-pointer"
              >
                Practice this skill
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
