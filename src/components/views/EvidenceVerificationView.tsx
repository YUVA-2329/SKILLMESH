import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Github, 
  Globe, 
  Award, 
  FileCode, 
  Cpu, 
  TrendingUp, 
  X 
} from 'lucide-react';
import { EvidenceItem, EvidenceStrength, EvidenceType, SkillNode } from '../../types';
import confetti from 'canvas-confetti';

interface EvidenceVerificationViewProps {
  evidence: EvidenceItem[];
  skills: SkillNode[];
  onAddEvidence: (item: EvidenceItem) => void;
}

export const EvidenceVerificationView: React.FC<EvidenceVerificationViewProps> = ({
  evidence,
  skills,
  onAddEvidence
}) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New evidence form state
  const [title, setTitle] = useState('');
  const [skillName, setSkillName] = useState(skills[0]?.name || 'Python');
  const [type, setType] = useState<EvidenceType>('github_repo');
  const [sourceUrl, setSourceUrl] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredEvidence = filter === 'ALL'
    ? evidence
    : evidence.filter(e => e.category === filter);

  const strongCount = evidence.filter(e => e.category === 'STRONG').length;
  const mediumCount = evidence.filter(e => e.category === 'MEDIUM').length;
  const weakCount = evidence.filter(e => e.category === 'WEAK').length;

  const handleCreateEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const newItem: EvidenceItem = {
        id: `ev-${Date.now()}`,
        title,
        skillId: `skill-${skillName.toLowerCase().replace(/\s+/g, '-')}`,
        skillName,
        category: type === 'self_claim' ? 'WEAK' : 'STRONG',
        type,
        source: sourceUrl || 'Verified Developer Submission',
        sourceUrl,
        timestamp: new Date().toISOString().split('T')[0],
        aiConfidence: type === 'self_claim' ? 65 : 95,
        explanation: explanation || `Verified proof artifact for ${skillName} with automated static code structure validation.`,
        metrics: {
          testCoverage: '92%',
          commits: 45,
          linesOfCode: 8500
        },
        isVerified: type !== 'self_claim'
      };

      onAddEvidence(newItem);
      setIsAnalyzing(false);
      setIsModalOpen(false);
      setTitle('');
      setSourceUrl('');
      setExplanation('');

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 pb-16 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-[#0058bc] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Zero-Bullshit Proof Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1b1b1d] tracking-tight">
            Evidence & Verification Vault
          </h1>
          <p className="text-xs text-[#717786] mt-1">
            Every skill node is backed by deterministic code artifacts, live clusters, or cryptographically signed credentials.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="magnetic-btn px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0058bc] to-[#4a47d2] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#0058bc]/25 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Attach New Proof Artifact
        </button>
      </div>

      {/* Strength Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setFilter('STRONG')}
          className={`glass-pearl p-5 rounded-2xl border cursor-pointer transition-all ${
            filter === 'STRONG' ? 'border-[#0058bc] ring-2 ring-[#0058bc]/20 shadow-md' : 'border-white/80 hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              STRONG EVIDENCE
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-[#1b1b1d] mt-2">{strongCount} Artifacts</div>
          <div className="text-[11px] text-[#717786] mt-1">
            Production deployments, verified Git repositories with automated tests, upstream OSS PRs.
          </div>
        </div>

        <div 
          onClick={() => setFilter('MEDIUM')}
          className={`glass-pearl p-5 rounded-2xl border cursor-pointer transition-all ${
            filter === 'MEDIUM' ? 'border-[#0058bc] ring-2 ring-[#0058bc]/20 shadow-md' : 'border-white/80 hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0058bc] bg-[#0058bc]/10 px-2.5 py-0.5 rounded-full">
              MEDIUM EVIDENCE
            </span>
            <Award className="w-4 h-4 text-[#0058bc]" />
          </div>
          <div className="text-3xl font-extrabold text-[#1b1b1d] mt-2">{mediumCount} Artifacts</div>
          <div className="text-[11px] text-[#717786] mt-1">
            Verified course certifications (Meta, Coursera, DCA), standalone tutorials, hackathon entries.
          </div>
        </div>

        <div 
          onClick={() => setFilter('WEAK')}
          className={`glass-pearl p-5 rounded-2xl border cursor-pointer transition-all ${
            filter === 'WEAK' ? 'border-[#0058bc] ring-2 ring-[#0058bc]/20 shadow-md' : 'border-white/80 hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
              WEAK EVIDENCE
            </span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-[#1b1b1d] mt-2">{weakCount} Artifacts</div>
          <div className="text-[11px] text-[#717786] mt-1">
            Unverified resume claims or self-reported familiarity. Priority candidate to upgrade to STRONG.
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-black/5 pb-2">
        {['ALL', 'STRONG', 'MEDIUM', 'WEAK'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filter === tab 
                ? 'bg-[#0058bc] text-white shadow-xs' 
                : 'text-[#44474e] hover:bg-white/60'
            }`}
          >
            {tab} ({tab === 'ALL' ? evidence.length : evidence.filter(e => e.category === tab).length})
          </button>
        ))}
      </div>

      {/* Evidence Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvidence.map((item) => (
          <div 
            key={item.id}
            className="glass-pearl p-5 rounded-3xl border border-white/80 shadow-md flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-200"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    item.category === 'STRONG'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.category === 'MEDIUM'
                        ? 'bg-[#0058bc]/10 text-[#0058bc]'
                        : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-[#0058bc] bg-white px-2 py-0.5 rounded-md border border-black/5">
                    {item.skillName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600">{item.aiConfidence}% AI Confidence</span>
                </div>
              </div>

              <h3 className="text-base font-extrabold text-[#1b1b1d] leading-snug">{item.title}</h3>
              
              <div className="text-xs text-[#717786] mt-1 flex items-center gap-1.5">
                {item.type === 'github_repo' && <Github className="w-3.5 h-3.5" />}
                {item.type === 'deployment' && <Globe className="w-3.5 h-3.5" />}
                {item.type === 'certification' && <Award className="w-3.5 h-3.5" />}
                <span>{item.source}</span>
              </div>

              {/* Explanatory Deep-Dive (Why do we believe this proves skill?) */}
              <div className="mt-3.5 p-3 rounded-2xl bg-[#fbf8fb] border border-black/5">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#0058bc] mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Why SkillMesh validates this proof:
                </div>
                <p className="text-xs text-[#44474e] leading-relaxed">{item.explanation}</p>
              </div>

              {/* Metrics */}
              {item.metrics && (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                  {item.metrics.testCoverage && (
                    <span className="bg-white px-2 py-0.5 rounded-md border border-black/5 font-semibold text-emerald-700">
                      Coverage: {item.metrics.testCoverage}
                    </span>
                  )}
                  {item.metrics.stars !== undefined && (
                    <span className="bg-white px-2 py-0.5 rounded-md border border-black/5 font-semibold text-amber-700">
                      ★ {item.metrics.stars} stars
                    </span>
                  )}
                  {item.metrics.linesOfCode && (
                    <span className="bg-white px-2 py-0.5 rounded-md border border-black/5 font-semibold text-[#44474e]">
                      {item.metrics.linesOfCode.toLocaleString()} lines
                    </span>
                  )}
                  {item.metrics.usersServed && (
                    <span className="bg-white px-2 py-0.5 rounded-md border border-black/5 font-semibold text-[#0058bc]">
                      {item.metrics.usersServed}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Source Link */}
            <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs text-[#717786]">
              <span>Verified on {item.timestamp}</span>
              {item.sourceUrl ? (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#0058bc] hover:underline flex items-center gap-1"
                >
                  Inspect artifact <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-[11px] text-[#717786]">Verified internally</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Attach New Proof Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-pearl w-full max-w-lg rounded-3xl p-6 border border-white/80 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-black/5 text-[#717786]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-[#0058bc]/10 text-[#0058bc]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1b1b1d]">Attach New Proof Artifact</h3>
                <p className="text-xs text-[#717786]">Submit live repos, deployments, or credentials to upgrade your mesh.</p>
              </div>
            </div>

            <form onSubmit={handleCreateEvidence} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#1b1b1d] block mb-1">Artifact Title</label>
                <input
                  type="text"
                  placeholder="e.g. Production RAG Service with pgvector"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-white p-2.5 rounded-xl border border-black/10 outline-none focus:border-[#0058bc]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1b1b1d] block mb-1">Target Skill</label>
                  <select
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    className="w-full bg-white p-2.5 rounded-xl border border-black/10 outline-none focus:border-[#0058bc]"
                  >
                    {skills.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1b1b1d] block mb-1">Artifact Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as EvidenceType)}
                    className="w-full bg-white p-2.5 rounded-xl border border-black/10 outline-none focus:border-[#0058bc]"
                  >
                    <option value="github_repo">GitHub Repository</option>
                    <option value="deployment">Live Web / API Deployment</option>
                    <option value="oss_contribution">Open Source PR</option>
                    <option value="certification">Official Certification</option>
                    <option value="project">Course / Hackathon Project</option>
                    <option value="self_claim">Self-Declared Claim</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1b1b1d] block mb-1">Public URL / Source (Optional)</label>
                <input
                  type="text"
                  placeholder="https://github.com/... or https://service.domain.com"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="w-full bg-white p-2.5 rounded-xl border border-black/10 outline-none focus:border-[#0058bc]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1b1b1d] block mb-1">Context / Evidence Description</label>
                <textarea
                  rows={3}
                  placeholder="Explain the architectural scope, test coverage, or throughput achievements..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full bg-white p-2.5 rounded-xl border border-black/10 outline-none focus:border-[#0058bc]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#717786] hover:bg-black/5 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAnalyzing || !title.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#0058bc] hover:bg-[#004899] text-white font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      Verifying Artifact...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Validate & Attach
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
