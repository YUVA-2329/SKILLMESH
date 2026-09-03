import React, { useState } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  MapPin, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  Award, 
  DollarSign,
  X,
  Copy,
  Check
} from 'lucide-react';
import { OpportunityItem, OpportunityType } from '../../types';
import { soundEffects } from '../effects/SoundFeedback';

interface OpportunitiesViewProps {
  opportunities: OpportunityItem[];
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  opportunities
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<OpportunityItem | null>(null);
  const [isCopiedPitch, setIsCopiedPitch] = useState(false);

  const filterTypes = ['All', 'Job', 'Hackathon', 'Grant', 'Accelerator', 'Research'];

  const filteredOpportunities = activeFilter === 'All'
    ? opportunities
    : opportunities.filter(o => o.type === activeFilter);

  const toggleSave = (id: string) => {
    soundEffects.playClick(600);
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleCopyPitch = (pitch: string) => {
    soundEffects.playClick(800);
    navigator.clipboard?.writeText(pitch);
    setIsCopiedPitch(true);
    setTimeout(() => setIsCopiedPitch(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-[#0058bc] uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-4 h-4" />
            Deterministic Match Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1b1b1d] tracking-tight">
            High-Alignment Opportunities
          </h1>
          <p className="text-xs text-[#717786] mt-1">
            Matched directly against your verified code evidence, not generic keyword algorithms.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-frost border border-white/70 shadow-2xs overflow-x-auto">
          {filterTypes.map((type) => (
            <button
              key={type}
              onClick={() => {
                soundEffects.playClick(500);
                setActiveFilter(type);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === type
                  ? 'bg-[#0058bc] text-white shadow-xs'
                  : 'text-[#44474e] hover:bg-white/60'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunity Cards Grid */}
      {filteredOpportunities.length === 0 ? (
        <div className="glass-pearl rounded-3xl p-12 text-center border border-white/80 shadow-md space-y-4 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-[#0058bc]/10 text-[#0058bc] mx-auto flex items-center justify-center">
            <Briefcase className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-[#1b1b1d]">No opportunities found</h3>
            <p className="text-xs text-[#717786] max-w-sm mx-auto">
              No matching {activeFilter.toLowerCase()} opportunities match your current filter. Try selecting "All" to browse all verified listings.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setActiveFilter('All')}
              className="px-4 py-2 rounded-xl bg-[#0058bc] text-white text-xs font-bold transition-all cursor-pointer hover:bg-[#004899]"
            >
              Reset Filter
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOpportunities.map((opp) => {
            const isSaved = savedIds.includes(opp.id);

            return (
              <div
                key={opp.id}
                className="glass-pearl p-6 rounded-3xl border border-white/80 shadow-md flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-200"
              >
                <div>
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#0058bc]/10 text-[#0058bc]">
                        {opp.type}
                      </span>
                      <h3 className="text-lg font-extrabold text-[#1b1b1d] mt-1.5 leading-snug">
                        {opp.title}
                      </h3>
                      <div className="text-xs font-semibold text-[#44474e] flex items-center gap-2 mt-0.5">
                        <span>{opp.organization}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#717786]">
                          <MapPin className="w-3 h-3" />
                          {opp.location}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                        {opp.matchScore}%
                      </span>
                      <div className="text-[10px] text-[#717786] mt-1">Skill Alignment</div>
                    </div>
                  </div>

                  {/* AI Matching Explanation */}
                  <div className="mt-3.5 p-3 rounded-2xl bg-[#fbf8fb] border border-black/5 text-xs text-[#44474e] leading-relaxed">
                    <strong className="text-[#0058bc] flex items-center gap-1 mb-0.5">
                      <Sparkles className="w-3 h-3" />
                      Why SkillMesh matched this:
                    </strong>
                    {opp.whyItMatches}
                  </div>

                  {/* Matching vs Missing Skills */}
                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">Matching Verified Skills:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {opp.matchingSkills.map((sk, idx) => (
                          <span key={idx} className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {opp.missingSkills.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-rose-700 uppercase">Missing Gap:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {opp.missingSkills.map((sk, idx) => (
                            <span key={idx} className="text-[10px] bg-rose-50 text-rose-800 font-semibold px-2 py-0.5 rounded-md border border-rose-200">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Metadata & Actions */}
                <div className="mt-5 pt-3 border-t border-black/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-extrabold text-[#1b1b1d]">{opp.compensationOrPrize}</div>
                    <div className="text-[10px] text-[#717786]">{opp.deadline} • {opp.freshness}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSave(opp.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                        isSaved 
                          ? 'bg-neutral-900 text-white border-neutral-900' 
                          : 'bg-white text-[#44474e] border-black/10 hover:bg-neutral-50'
                      }`}
                    >
                      {isSaved ? 'Saved' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        soundEffects.playClick(680);
                        setSelectedOpp(opp);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-[#0058bc] hover:bg-[#004899] text-white font-bold flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                    >
                      <span>Review & Pitch</span>
                      <Sparkles className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* OPPORTUNITY DETAILS & TAILORED PITCH MODAL */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-black/10 relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-black/5">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#0058bc]/10 text-[#0058bc]">
                  {selectedOpp.type}
                </span>
                <h2 className="text-xl font-black text-[#1b1b1d] mt-1">
                  {selectedOpp.title}
                </h2>
                <div className="text-xs text-[#717786] font-medium mt-0.5">
                  {selectedOpp.organization} • {selectedOpp.location}
                </div>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                className="p-1.5 rounded-xl text-[#717786] hover:bg-black/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Compensation & Match */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f8fafd] border border-black/5 text-xs">
              <div>
                <div className="text-[10px] text-[#717786] uppercase font-bold">Offer / Reward</div>
                <div className="text-base font-extrabold text-[#1b1b1d]">{selectedOpp.compensationOrPrize}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#717786] uppercase font-bold">Skill Alignment</div>
                <div className="text-base font-extrabold text-emerald-600">{selectedOpp.matchScore}% Verified Fit</div>
              </div>
            </div>

            {/* Verified Strengths vs Gap */}
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-emerald-700 uppercase text-[10px]">Your Verified Match:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedOpp.matchingSkills.map((s, idx) => (
                    <span key={idx} className="bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {selectedOpp.missingSkills.length > 0 && (
                <div>
                  <span className="font-bold text-rose-700 uppercase text-[10px]">Recommended Gap to Target:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedOpp.missingSkills.map((s, idx) => (
                      <span key={idx} className="bg-rose-50 text-rose-800 font-semibold px-2.5 py-1 rounded-lg border border-rose-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI-Generated Application Pitch */}
            <div className="p-4 rounded-2xl bg-[#fbf8fb] border border-black/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-[#0058bc] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  SkillMesh Evidence-Backed Pitch
                </span>
                <button
                  onClick={() => {
                    const pitchText = `Hi ${selectedOpp.organization} team, I am applying for the ${selectedOpp.title} position. With verified code artifacts across ${selectedOpp.matchingSkills.join(', ')} and demonstrable production repositories, I can immediately contribute to your product initiatives. My complete cryptographic Skill Passport is available at SkillMesh.`;
                    handleCopyPitch(pitchText);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-black/5 text-[11px] font-bold text-[#0058bc] border border-black/5 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  {isCopiedPitch ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopiedPitch ? 'Copied Pitch!' : 'Copy Pitch'}</span>
                </button>
              </div>
              <p className="text-xs text-[#44474e] leading-relaxed italic bg-white p-3 rounded-xl border border-black/5">
                "Hi {selectedOpp.organization} team, I am applying for the {selectedOpp.title} role. With verified code artifacts across {selectedOpp.matchingSkills.join(', ')} and demonstrable production repositories, I can immediately contribute to your product initiatives. My complete cryptographic Skill Passport is available at SkillMesh."
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedOpp(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#555a64] hover:bg-black/5 transition-colors cursor-pointer"
              >
                Close
              </button>
              <a
                href={selectedOpp.url || 'https://google.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-xl bg-[#0058bc] hover:bg-[#004899] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>Visit Application Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
