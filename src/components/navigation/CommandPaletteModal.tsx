import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Layers, 
  ShieldCheck, 
  FolderGit2, 
  Briefcase, 
  Users, 
  Github, 
  Sparkles, 
  FileText, 
  Award,
  X 
} from 'lucide-react';
import { ActiveTab, SkillNode, OpportunityItem, PersonProfile } from '../../types';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab) => void;
  skills: SkillNode[];
  opportunities?: OpportunityItem[];
  people?: PersonProfile[];
  onSelectSkill: (skill: SkillNode) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  skills = [],
  opportunities = [],
  people = [],
  onSelectSkill
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredSkills = skills.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));
  const filteredOpportunities = opportunities.filter(o => o.title.toLowerCase().includes(query.toLowerCase()) || o.organization.toLowerCase().includes(query.toLowerCase()));
  const filteredPeople = people.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.organization.toLowerCase().includes(query.toLowerCase()));

  const quickActions: { label: string; tab: ActiveTab; icon: React.ReactNode; desc: string }[] = [
    { label: 'My Verified Skills', tab: 'skills', icon: <Award className="w-4 h-4 text-[#0058bc]" />, desc: 'Review current strength, decay rates, and verified proofs' },
    { label: 'Evidence & Verification Vault', tab: 'evidence', icon: <ShieldCheck className="w-4 h-4 text-[#4a47d2]" />, desc: 'Review STRONG code proofs and certificates' },
    { label: 'AI Gap-Closing Projects', tab: 'projects', icon: <FolderGit2 className="w-4 h-4 text-emerald-600" />, desc: 'Build and prove target skills' },
    { label: 'High-Match Opportunities', tab: 'opportunities', icon: <Briefcase className="w-4 h-4 text-amber-600" />, desc: 'Matched jobs, grants, and hackathons' },
    { label: 'Investors & Cofounders', tab: 'people', icon: <Users className="w-4 h-4 text-purple-600" />, desc: 'Discover verified venture theses and partners' },
    { label: 'GitHub Deep Repository AI', tab: 'github', icon: <Github className="w-4 h-4 text-[#1b1b1d]" />, desc: 'Inspect repo architecture and extract evidence' },
    { label: 'Import Resume & Evolve Mesh', tab: 'resume', icon: <FileText className="w-4 h-4 text-indigo-600" />, desc: 'AI extraction pipeline from PDF or text' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-pearl w-full max-w-2xl rounded-2xl shadow-2xl border border-white/80 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-black/5 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#0058bc]" />
          <input
            type="text"
            placeholder="Search skills, verified proofs, opportunities, investors, or commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-sm text-[#1b1b1d] placeholder:text-[#717786]"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-black/5 text-[#717786]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Navigations */}
          {!query && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold text-[#717786] uppercase tracking-wider">
                Platform Navigation
              </div>
              <div className="space-y-1 mt-1">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onNavigate(action.tab);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-[#0058bc]/5 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-white shadow-2xs group-hover:scale-105 transition-transform">
                        {action.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-[#1b1b1d]">{action.label}</div>
                        <div className="text-[11px] text-[#717786]">{action.desc}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#0058bc] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Jump →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Skills matches */}
          {filteredSkills.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold text-[#717786] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#0058bc]" />
                Skills in Mesh ({filteredSkills.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {filteredSkills.slice(0, 6).map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => {
                      onNavigate('skills');
                      onSelectSkill(skill);
                      onClose();
                    }}
                    className="text-left p-2.5 rounded-xl bg-white/70 hover:bg-[#0058bc]/10 border border-black/5 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-[#1b1b1d]">{skill.name}</div>
                      <div className="text-[10px] text-[#717786]">{skill.category} • {skill.level}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#0058bc]">{skill.masteryPercentage}%</div>
                      <div className="text-[9px] text-emerald-600 font-medium">{skill.evidenceCount} proofs</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Opportunities matches */}
          {filteredOpportunities.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold text-[#717786] uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                Opportunities ({filteredOpportunities.length})
              </div>
              <div className="space-y-1.5 mt-1">
                {filteredOpportunities.slice(0, 3).map((opp) => (
                  <button
                    key={opp.id}
                    onClick={() => {
                      onNavigate('opportunities');
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-white/70 hover:bg-amber-500/10 border border-black/5 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-[#1b1b1d]">{opp.title}</div>
                      <div className="text-[10px] text-[#717786]">{opp.organization} • {opp.location}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">{opp.matchScore}% match</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* People matches */}
          {filteredPeople.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold text-[#717786] uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                Investors & Network ({filteredPeople.length})
              </div>
              <div className="space-y-1.5 mt-1">
                {filteredPeople.slice(0, 3).map((person) => (
                  <button
                    key={person.id}
                    onClick={() => {
                      onNavigate('people');
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-white/70 hover:bg-purple-500/10 border border-black/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={person.avatar} alt={person.name} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-[#1b1b1d]">{person.name}</div>
                        <div className="text-[10px] text-[#717786]">{person.title}, {person.organization}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">{person.role.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#fbf8fb] border-t border-black/5 flex items-center justify-between text-[11px] text-[#717786]">
          <span>Tip: Type any skill name (e.g. "RAG") to focus 3D galaxy</span>
          <div className="flex items-center gap-2">
            <span>Esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
