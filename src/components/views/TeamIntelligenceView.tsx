import React from 'react';
import { 
  Users, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Plus 
} from 'lucide-react';
import { TeamMesh, UserProfile } from '../../types';

interface TeamIntelligenceViewProps {
  team: TeamMesh;
  user: UserProfile;
}

export const TeamIntelligenceView: React.FC<TeamIntelligenceViewProps> = ({
  team,
  user
}) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="text-xs font-bold text-[#0058bc] uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          Aggregate Team Skill Topology
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1b1b1d] tracking-tight">
          Team Intelligence Mesh
        </h1>
        <p className="text-xs text-[#717786] mt-1">
          Combine multi-member skill graphs into a unified capability matrix to diagnose team vulnerabilities.
        </p>
      </div>

      {/* Team Profile Banner */}
      <section className="glass-pearl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5">
          <div>
            <span className="text-[10px] font-extrabold uppercase bg-[#0058bc]/10 text-[#0058bc] px-2.5 py-0.5 rounded-full">
              Team Mesh
            </span>
            <h2 className="text-2xl font-extrabold text-[#1b1b1d] mt-1">{team.name}</h2>
            <p className="text-xs text-[#44474e] mt-1">{team.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {team.members.map((m) => (
                <img
                  key={m.id}
                  src={m.avatar}
                  alt={m.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                />
              ))}
            </div>
            <span className="text-xs font-bold text-[#717786] pl-2">{team.members.length} Members</span>
          </div>
        </div>

        {/* AI Team Diagnosis Assessment */}
        <div className="p-4 rounded-2xl bg-[#0058bc]/5 border border-[#0058bc]/10 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#0058bc] text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase text-[#0058bc]">AI Capability Audit</div>
            <p className="text-xs text-[#1b1b1d] leading-relaxed">{team.aiRecommendation}</p>
          </div>
        </div>

        {/* Aggregate Skill Coverage Bars */}
        <div>
          <h3 className="text-xs font-bold text-[#717786] uppercase tracking-wider mb-3">
            Domain Coverage Matrix
          </h3>
          <div className="space-y-3">
            {team.aggregateSkills.map((agg, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-white border border-black/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1b1b1d]">{agg.skill}</span>
                  <span className="font-extrabold text-[#0058bc]">{agg.coverage}% Coverage</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      agg.coverage > 70 ? 'bg-gradient-to-r from-[#0058bc] to-[#4a47d2]' : 'bg-amber-500'
                    }`}
                    style={{ width: `${agg.coverage}%` }}
                  />
                </div>
                <div className="text-[10px] text-[#717786]">
                  Key Contributors: {agg.memberNames.length > 0 ? agg.memberNames.join(', ') : 'None (Critical Gap)'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Capabilities & Recommendations */}
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-800 mb-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            Vulnerabilities & Missing Capabilities
          </div>
          <div className="flex flex-wrap gap-1.5">
            {team.missingCapabilities.map((cap, idx) => (
              <span key={idx} className="text-xs bg-white text-rose-800 font-semibold px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs">
                Missing: {cap}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
