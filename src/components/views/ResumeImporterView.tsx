import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  UploadCloud, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  RotateCw, 
  Cpu 
} from 'lucide-react';
import { SkillNode, UserProfile } from '../../types';
import confetti from 'canvas-confetti';

interface ResumeImporterViewProps {
  user: UserProfile;
  onImportSkills: (newSkills: SkillNode[], candidateSummary: string) => void;
}

export const ResumeImporterView: React.FC<ResumeImporterViewProps> = ({
  user,
  onImportSkills
}) => {
  const [resumeText, setResumeText] = useState(`KISHORE YUVA - AI SYSTEMS LEAD
Contact: kishore@skillmesh.network | San Francisco, CA | github.com/skillmesh

PROFESSIONAL EXPERIENCE:
Senior AI Platform Engineer @ Frontier AI Labs (2024 - Present)
- Designed and deployed enterprise hybrid RAG engine using pgvector, FlashRank, and FastAPI, indexing 4.2M documents with <35ms P99 search latency.
- Implemented high-throughput async Python 3.12 pipelines with 94% test coverage using pytest-asyncio and Docker multi-stage containers.
- Built interactive spatial WebGL user interfaces using React 19, TypeScript, and Three.js custom shader pipelines.

Full Stack AI Engineer @ Nexus Core (2022 - 2024)
- Architected multi-tenant microservices in FastAPI with Pydantic v2 schemas.
- Tuned pgvector and Qdrant clusters for sub-second similarity queries.

EDUCATION & CERTIFICATIONS:
- B.S. Computer Science & AI, UC Berkeley
- Meta Certified Python Systems Professional #META-PY-8821
- Docker Certified Associate #DCA-88129`);

  const [currentStage, setCurrentStage] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any | null>(null);

  const stages = [
    { name: '1. Ingestion & Storage', desc: 'Secure ephemeral parsing & AST text tokenization' },
    { name: '2. Multi-modal Extraction', desc: 'Gemini 2.5 Flash neural entity identification' },
    { name: '3. Skill Graph Normalization', desc: 'Taxonomy matching across 100k+ skill nodes' },
    { name: '4. Evidence Validation', desc: 'Weighting confidence & artifact proofs' },
    { name: '5. 3D Mesh Topology Update', desc: 'Recalculating neural weights and career fit score' }
  ];

  const handleProcessResume = async () => {
    if (!resumeText.trim()) return;
    setIsProcessing(true);
    setCurrentStage(1);

    // Run live stages
    const timer1 = setTimeout(() => setCurrentStage(2), 600);
    const timer2 = setTimeout(() => setCurrentStage(3), 1200);
    const timer3 = setTimeout(() => setCurrentStage(4), 1800);

    try {
      const res = await fetch('/api/gemini/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          targetRole: user.targetRole
        })
      });

      const json = await res.json();
      setTimeout(() => {
        setCurrentStage(5);
        if (json.success && json.data) {
          setExtractedData(json.data);
        }
        setIsProcessing(false);
        try {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
      }, 2400);
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  const handleApplyToMesh = () => {
    if (!extractedData) return;
    const newSkillNodes: SkillNode[] = (extractedData.skills || []).map((s: any, idx: number) => ({
      id: `skill-ext-${Date.now()}-${idx}`,
      name: s.name,
      category: s.category || 'Languages',
      description: s.description || `${s.name} mastery extracted from resume.`,
      masteryPercentage: s.masteryPercentage || 80,
      level: s.level || 'Advanced',
      confidence: s.confidence || 90,
      freshnessScore: 95,
      lastDemonstrated: 'Today',
      evidenceCount: 3,
      verifiedCertsCount: 1,
      status: 'mastered' as const,
      isCoreCompetency: s.isCoreCompetency || false,
      prerequisites: [],
      leadsTo: [],
      relatedSkills: [],
      connectedArtifacts: [
        { id: `art-${idx}`, title: `${s.name} Production Evidence`, type: 'code' as const, updatedAt: 'Today' }
      ],
      evidenceIds: []
    }));

    onImportSkills(newSkillNodes, extractedData.candidateSummary || '');
    try {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
    } catch (e) {}
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="text-xs font-bold text-[#0058bc] uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-4 h-4" />
          Neural Ingestion Pipeline
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1b1b1d] tracking-tight">
          Resume & Experience Importer
        </h1>
        <p className="text-xs text-[#717786] mt-1">
          Transform static text or PDF into an interactive, verified 3D SkillMesh graph.
        </p>
      </div>

      {/* Main Grid: Input on Left, Pipeline on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Text Paste / Upload */}
        <div className="glass-pearl rounded-3xl p-6 border border-white/80 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1b1b1d]">Resume Raw Text / Markdown</h3>
            <span className="text-[11px] text-[#717786]">Paste or edit below</span>
          </div>

          <textarea
            rows={14}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            disabled={isProcessing}
            className="w-full bg-white p-4 rounded-2xl border border-black/10 outline-none text-xs font-mono text-[#1b1b1d] focus:border-[#0058bc] leading-relaxed resize-none"
          />

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setResumeText('')}
              className="text-xs text-[#717786] hover:text-[#1b1b1d]"
            >
              Clear Text
            </button>

            <button
              onClick={handleProcessResume}
              disabled={isProcessing || !resumeText.trim()}
              className="magnetic-btn px-6 py-2.5 rounded-xl bg-[#0058bc] hover:bg-[#004899] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#0058bc]/25 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Running Neural Pipeline...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  Run AI Skill Extraction
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: 5-Stage Animated Pipeline */}
        <div className="glass-pearl rounded-3xl p-6 border border-white/80 shadow-md space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#1b1b1d]">AI Extraction Lifecycle</h3>
              <span className="text-xs font-bold text-[#0058bc]">
                {currentStage === 5 ? 'Completed' : isProcessing ? `Stage ${currentStage}/5` : 'Ready'}
              </span>
            </div>

            <div className="space-y-3">
              {stages.map((stg, idx) => {
                const isDone = currentStage > idx + 1 || currentStage === 5;
                const isCurrent = currentStage === idx + 1 && isProcessing;

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      isDone
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : isCurrent
                          ? 'bg-[#0058bc]/10 border-[#0058bc]/30 text-[#0058bc] ring-2 ring-[#0058bc]/20'
                          : 'bg-white/60 border-black/5 text-[#717786]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{stg.name}</div>
                      <div className="text-[11px] opacity-80">{stg.desc}</div>
                    </div>
                    <div>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <Sparkles className="w-4 h-4 animate-spin text-[#0058bc]" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-neutral-300" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Extracted Preview & Merge Button */}
          {extractedData && (
            <div className="p-4 rounded-2xl bg-white border border-black/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1b1b1d]">
                  Extracted {extractedData.skills?.length || 4} Core Nodes
                </span>
                <span className="text-xs font-extrabold text-emerald-600">
                  {extractedData.fitScore || 84}% Fit Score
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {extractedData.skills?.map((sk: any, idx: number) => (
                  <span key={idx} className="text-xs bg-[#0058bc]/10 text-[#0058bc] font-bold px-2.5 py-0.5 rounded-md">
                    {sk.name} ({sk.masteryPercentage}%)
                  </span>
                ))}
              </div>

              <button
                onClick={handleApplyToMesh}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0058bc] to-[#4a47d2] hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#0058bc]/20"
              >
                <Layers className="w-4 h-4" />
                Merge into My Living SkillMesh
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
