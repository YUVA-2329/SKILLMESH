import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Target, 
  CheckCircle2, 
  ArrowRight, 
  DollarSign, 
  Clock, 
  Award, 
  Zap 
} from 'lucide-react';
import { SkillNode, UserProfile } from '../../types';

interface CareerSimulatorViewProps {
  skills: SkillNode[];
  user: UserProfile;
}

export const CareerSimulatorView: React.FC<CareerSimulatorViewProps> = ({
  skills,
  user
}) => {
  const [selectedTrajectory, setSelectedTrajectory] = useState<'ai_engineer' | 'founder' | 'researcher'>('ai_engineer');

  const trajectories = {
    ai_engineer: {
      title: 'Senior AI Platform Engineer',
      tagline: 'Leading enterprise RAG, distributed vLLM inference, and high-throughput agent systems.',
      fitScore: 82,
      timeToMastery: '6 - 8 Weeks',
      salaryRange: '$180,000 - $250,000 + Equity',
      probabilityOfSuccess: 94,
      criticalMilestones: [
        { title: 'Deploy Production RAG Cluster with pgvector', status: 'In Progress' },
        { title: 'Publish Triton / TensorRT-LLM Latency Whitepaper', status: 'Next Up' },
        { title: 'Merge Upstream PR in LangChain / LlamaIndex', status: 'Completed' }
      ],
      marketDemand: 'Extreme (+48% YoY)'
    },
    founder: {
      title: 'Technical AI Founder / CTO',
      tagline: 'Building a venture-backed enterprise AI workflow platform with Sequoia / Conviction backing.',
      fitScore: 76,
      timeToMastery: '10 - 14 Weeks',
      salaryRange: '$500k - $2.5M Seed Capital',
      probabilityOfSuccess: 78,
      criticalMilestones: [
        { title: 'Publish Interactive Technical Demo on Product Hunt', status: 'Pending' },
        { title: 'Partner with B2B Growth / Sales Cofounder (Elena Rostova)', status: 'Matched' },
        { title: 'Sign 3 Design Partners with Letters of Intent (LOI)', status: 'Pending' }
      ],
      marketDemand: 'High Founder Capital Inflow'
    },
    researcher: {
      title: 'Staff AI Research Scientist',
      tagline: 'Advancing novel context compression algorithms and multi-agent coordination architectures.',
      fitScore: 69,
      timeToMastery: '16 - 24 Weeks',
      salaryRange: '$220,000 - $310,000',
      probabilityOfSuccess: 71,
      criticalMilestones: [
        { title: 'Publish ArXiv Preprint on Sub-10ms Graph Search', status: 'Pending' },
        { title: 'Contribute to PyTorch Core Kernel Optimization', status: 'Pending' },
        { title: 'Deliver Keynote at NeurIPS / ICLR Workshop', status: 'Projected' }
      ],
      marketDemand: 'High Research Scarcity'
    }
  };

  const current = trajectories[selectedTrajectory];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="text-xs font-bold text-[#0058bc] uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4" />
          Multi-Path Career Simulator
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1b1b1d] tracking-tight">
          3-Way Branching Trajectory Simulator
        </h1>
        <p className="text-xs text-[#717786] mt-1">
          Simulate timeline, compensation, and required proof artifacts across distinct career futures.
        </p>
      </div>

      {/* Trajectory Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setSelectedTrajectory('ai_engineer')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedTrajectory === 'ai_engineer'
              ? 'glass-pearl border-[#0058bc] ring-2 ring-[#0058bc]/20 shadow-md'
              : 'glass-liquid border-white/70 hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#0058bc]">PATHWAY A</span>
            <span className="text-xs font-bold text-emerald-600">82% Fit</span>
          </div>
          <div className="font-extrabold text-sm text-[#1b1b1d] mt-1">AI Systems Engineer</div>
          <div className="text-[11px] text-[#717786] mt-0.5">Highest credential velocity</div>
        </button>

        <button
          onClick={() => setSelectedTrajectory('founder')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedTrajectory === 'founder'
              ? 'glass-pearl border-[#0058bc] ring-2 ring-[#0058bc]/20 shadow-md'
              : 'glass-liquid border-white/70 hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-600">PATHWAY B</span>
            <span className="text-xs font-bold text-purple-700">76% Fit</span>
          </div>
          <div className="font-extrabold text-sm text-[#1b1b1d] mt-1">Tech Founder / CTO</div>
          <div className="text-[11px] text-[#717786] mt-0.5">Venture capital & scale</div>
        </button>

        <button
          onClick={() => setSelectedTrajectory('researcher')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedTrajectory === 'researcher'
              ? 'glass-pearl border-[#0058bc] ring-2 ring-[#0058bc]/20 shadow-md'
              : 'glass-liquid border-white/70 hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-amber-600">PATHWAY C</span>
            <span className="text-xs font-bold text-amber-700">69% Fit</span>
          </div>
          <div className="font-extrabold text-sm text-[#1b1b1d] mt-1">AI Research Scientist</div>
          <div className="text-[11px] text-[#717786] mt-0.5">Publications & algorithms</div>
        </button>
      </div>

      {/* Trajectory Deep-Dive Card */}
      <section className="glass-pearl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5">
          <div>
            <span className="text-[10px] font-extrabold uppercase bg-[#0058bc]/10 text-[#0058bc] px-2.5 py-0.5 rounded-full">
              Simulated Forecast
            </span>
            <h2 className="text-2xl font-extrabold text-[#1b1b1d] mt-1">{current.title}</h2>
            <p className="text-xs text-[#44474e] mt-1">{current.tagline}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center bg-white p-3 rounded-2xl border border-black/5 shadow-2xs">
              <div className="text-2xl font-extrabold text-emerald-600">{current.probabilityOfSuccess}%</div>
              <div className="text-[9px] text-[#717786] font-bold uppercase">Success Probability</div>
            </div>
            <div className="text-center bg-white p-3 rounded-2xl border border-black/5 shadow-2xs">
              <div className="text-lg font-extrabold text-[#0058bc]">{current.timeToMastery}</div>
              <div className="text-[9px] text-[#717786] font-bold uppercase">Estimated Timeline</div>
            </div>
          </div>
        </div>

        {/* Financial & Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#fbf8fb] border border-black/5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#717786] uppercase">Projected Compensation / Capital</div>
              <div className="text-base font-extrabold text-[#1b1b1d]">{current.salaryRange}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#fbf8fb] border border-black/5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0058bc]/10 text-[#0058bc]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#717786] uppercase">Market Scarcity & Growth</div>
              <div className="text-base font-extrabold text-[#1b1b1d]">{current.marketDemand}</div>
            </div>
          </div>
        </div>

        {/* Critical Milestones Needed */}
        <div>
          <h3 className="text-xs font-bold text-[#717786] uppercase tracking-wider mb-3">
            Required Proof Milestones to Unlock Trajectory
          </h3>
          <div className="space-y-2">
            {current.criticalMilestones.map((ms, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white border border-black/5 shadow-2xs flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#0058bc]" />
                  <span className="font-semibold text-[#1b1b1d]">{ms.title}</span>
                </div>
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md bg-[#0058bc]/10 text-[#0058bc]">
                  {ms.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
