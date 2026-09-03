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
  DollarSign 
} from 'lucide-react';
import { OpportunityItem, OpportunityType } from '../../types';

interface OpportunitiesViewProps {
  opportunities: OpportunityItem[];
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  opportunities
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const filterTypes = ['All', 'Job', 'Hackathon', 'Grant', 'Accelerator', 'Research'];

  const filteredOpportunities = activeFilter === 'All'
    ? opportunities
    : opportunities.filter(o => o.type === activeFilter);

  const toggleSave = (id: string) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
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
              onClick={() => setActiveFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
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
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                      isSaved 
                        ? 'bg-neutral-900 text-white border-neutral-900' 
                        : 'bg-white text-[#44474e] border-black/10 hover:bg-neutral-50'
                    }`}
                  >
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={() => window.open(opp.url || 'https://google.com', '_blank')}
                    className="px-4 py-1.5 rounded-xl bg-[#0058bc] hover:bg-[#004899] text-white font-bold flex items-center gap-1 transition-colors shadow-xs"
                  >
                    <span>Apply / View</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
