import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Zap, 
  ShieldCheck, 
  ExternalLink, 
  Maximize2, 
  Compass, 
  FolderGit2, 
  ChevronRight, 
  Activity, 
  CheckCircle2, 
  Sliders, 
  Filter, 
  RotateCcw 
} from 'lucide-react';
import { ActiveTab, SkillNode, UserProfile } from '../../types';
import { SkillMeshUniverse3D } from '../canvas/SkillMeshUniverse3D';

interface SkillMeshUniverseViewProps {
  skills: SkillNode[];
  selectedSkill: SkillNode | null;
  onSelectSkill: (skill: SkillNode) => void;
  onNavigate: (tab: ActiveTab) => void;
  user: UserProfile;
}

export const SkillMeshUniverseView: React.FC<SkillMeshUniverseViewProps> = ({
  skills,
  selectedSkill,
  onSelectSkill,
  onNavigate,
  user
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'default' | 'focus' | 'isolate' | 'compare'>('default');

  const categories = ['All', 'AI & ML', 'Languages', 'Backend', 'Frontend', 'Cloud & DevOps', 'Data & Vector'];

  const filteredSkills = activeCategory === 'All' 
    ? skills 
    : skills.filter(s => s.category === activeCategory);

  const activeNode = selectedSkill || skills[0];

  return (
    <div className="relative w-full h-[calc(100vh-100px)] min-h-[640px] rounded-3xl overflow-hidden glass-pearl border border-white/80 shadow-2xl animate-in fade-in duration-300">
      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <SkillMeshUniverse3D
          skills={filteredSkills}
          selectedSkill={activeNode}
          onSelectSkill={onSelectSkill}
          mode={viewMode}
          className="w-full h-full"
        />
      </div>

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left Category Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-frost border border-white/70 shadow-sm pointer-events-auto overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[#0058bc] text-white shadow-xs'
                  : 'text-[#44474e] hover:text-[#1b1b1d] hover:bg-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right View Modes */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-frost border border-white/70 shadow-sm pointer-events-auto">
          <button
            onClick={() => setViewMode('default')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'default' ? 'bg-[#0058bc] text-white shadow-xs' : 'text-[#44474e] hover:bg-white/60'
            }`}
          >
            Galaxy View
          </button>
          <button
            onClick={() => setViewMode('isolate')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'isolate' ? 'bg-[#0058bc] text-white shadow-xs' : 'text-[#44474e] hover:bg-white/60'
            }`}
          >
            Isolate Sub-mesh
          </button>
          <button
            onClick={() => setViewMode('compare')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'compare' ? 'bg-[#4a47d2] text-white shadow-xs' : 'text-[#44474e] hover:bg-white/60'
            }`}
          >
            Compare ({user.targetRole})
          </button>
        </div>
      </div>

      {/* Floating Bottom Left Helper Badge */}
      <div className="absolute bottom-4 left-4 z-20 glass-frost px-3.5 py-2 rounded-2xl border border-white/70 shadow-sm text-xs text-[#44474e] flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Click any 3D node to inspect verified proofs • Drag to rotate space</span>
      </div>

      {/* Floating Skill Detail Inspector Panel (Matches Image 5) */}
      {activeNode && (
        <div className="absolute top-20 sm:top-18 right-4 bottom-4 z-20 w-full sm:w-96 glass-pearl rounded-3xl p-5 border border-white/90 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right-4 duration-200">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0058bc] bg-[#0058bc]/10 px-2 py-0.5 rounded-md">
                  {activeNode.category}
                </span>
                <h3 className="text-2xl font-extrabold text-[#1b1b1d] mt-1">{activeNode.name}</h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-[#0058bc]">{activeNode.masteryPercentage}%</span>
                <div className="text-[10px] text-emerald-600 font-bold uppercase">{activeNode.level}</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-[#44474e] leading-relaxed">
              {activeNode.description}
            </p>

            {/* Mastery & Freshness Gauges */}
            <div className="p-3 rounded-2xl bg-white/70 border border-black/5 space-y-2.5">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-[#1b1b1d] mb-1">
                  <span>Mastery Level</span>
                  <span>{activeNode.masteryPercentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#0058bc] to-[#4a47d2] rounded-full transition-all duration-500"
                    style={{ width: `${activeNode.masteryPercentage}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#717786]">
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-[#0058bc]" />
                  Freshness: {activeNode.freshnessScore}%
                </span>
                <span>Active {activeNode.lastDemonstrated}</span>
              </div>
            </div>

            {/* Connected Artifacts */}
            <div>
              <div className="text-[11px] font-bold text-[#717786] uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Connected Artifacts ({activeNode.connectedArtifacts?.length || 0})</span>
                <span className="text-emerald-600 font-semibold">{activeNode.evidenceCount} proofs</span>
              </div>

              <div className="space-y-1.5">
                {activeNode.connectedArtifacts?.map((art) => (
                  <div 
                    key={art.id}
                    className="p-2.5 rounded-xl bg-white/80 border border-black/5 hover:bg-white flex items-center justify-between transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#0058bc]" />
                      <div>
                        <div className="text-xs font-bold text-[#1b1b1d]">{art.title}</div>
                        <div className="text-[10px] text-[#717786] capitalize">{art.type} • Updated {art.updatedAt}</div>
                      </div>
                    </div>
                    {art.url && (
                      <a 
                        href={art.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-1 text-[#717786] hover:text-[#0058bc]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisite & Leads To Graph Links */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/60 border border-black/5">
                <div className="text-[10px] font-bold text-[#717786] uppercase mb-1">Prerequisites</div>
                <div className="flex flex-wrap gap-1">
                  {activeNode.prerequisites?.map((pr, pIdx) => (
                    <span key={pIdx} className="text-[10px] bg-neutral-100 text-[#44474e] font-medium px-1.5 py-0.5 rounded">
                      {pr}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/60 border border-black/5">
                <div className="text-[10px] font-bold text-[#0058bc] uppercase mb-1">Leads To</div>
                <div className="flex flex-wrap gap-1">
                  {activeNode.leadsTo?.map((lt, lIdx) => (
                    <span key={lIdx} className="text-[10px] bg-[#0058bc]/10 text-[#0058bc] font-medium px-1.5 py-0.5 rounded">
                      {lt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-black/5 space-y-2">
            <button
              onClick={() => onNavigate('evidence')}
              className="w-full py-2.5 rounded-xl bg-[#0058bc] hover:bg-[#004899] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              Verify & Add Proof Artifacts
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className="w-full py-2 rounded-xl bg-white hover:bg-neutral-50 text-xs font-bold text-[#1b1b1d] border border-black/5 flex items-center justify-center gap-1.5 transition-colors"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-emerald-600" />
              Build Gap-Closing Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
