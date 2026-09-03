import React, { useState } from 'react';
import { 
  Github, 
  Sparkles, 
  CheckCircle2, 
  FileCode, 
  Terminal, 
  ShieldCheck, 
  Layers, 
  Play, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';
import { GitHubRepoAnalysis, SkillNode } from '../../types';
import confetti from 'canvas-confetti';

interface GitHubAnalyzerViewProps {
  onAddSkillsFromGitHub: (detected: { skill: string; evidenceStrength: any; reason: string }[]) => void;
}

export const GitHubAnalyzerView: React.FC<GitHubAnalyzerViewProps> = ({
  onAddSkillsFromGitHub
}) => {
  const [repoUrl, setRepoUrl] = useState('https://github.com/skillmesh/data-pipeline-v2');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<GitHubRepoAnalysis | null>({
    repoName: 'skillmesh/data-pipeline-v2',
    description: 'High-throughput asynchronous ETL data pipeline processing real-time telemetry streams.',
    stars: 142,
    forks: 28,
    primaryLanguage: 'Python',
    languages: [
      { name: 'Python', percentage: 84 },
      { name: 'TypeScript', percentage: 11 },
      { name: 'Dockerfile', percentage: 5 }
    ],
    frameworks: ['FastAPI', 'pytest-asyncio', 'Pydantic v2', 'Redis', 'Docker'],
    architectureSummary: 'Clean Hexagonal / Ports & Adapters architecture with strict separation between storage adapters, messaging queues, and domain logic.',
    testCoverageEstimate: '94% branch coverage',
    ciCdDetected: true,
    codeQualityRating: 'A+',
    detectedSkills: [
      { skill: 'Python', evidenceStrength: 'STRONG', reason: '18,400+ lines of typed Python 3.12 with async workers and zero-copy buffers.' },
      { skill: 'FastAPI', evidenceStrength: 'STRONG', reason: 'Async REST gateway with automated OpenAPI documentation and validation middleware.' },
      { skill: 'Docker & Containers', evidenceStrength: 'MEDIUM', reason: 'Multi-stage distroless production container definitions.' }
    ]
  });

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/gemini/github-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl,
          repoName: repoUrl.replace('https://github.com/', '')
        })
      });

      const json = await res.json();
      if (json.success && json.analysis) {
        setAnalysisResult(json.analysis);
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImportEvidence = () => {
    if (!analysisResult) return;
    onAddSkillsFromGitHub(analysisResult.detectedSkills);
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="text-xs font-bold text-[#0058bc] uppercase tracking-wider flex items-center gap-1.5">
          <Github className="w-4 h-4" />
          Deep AST & Code Evidence Analyzer
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1b1b1d] tracking-tight">
          GitHub Code Intelligence
        </h1>
        <p className="text-xs text-[#717786] mt-1">
          Inspect any public or connected repository. Extract AST complexity, test coverage, and verifiable capability proofs.
        </p>
      </div>

      {/* Search / URL Ingestion Bar */}
      <section className="glass-pearl rounded-3xl p-5 border border-white/80 shadow-md">
        <form onSubmit={handleRunAnalysis} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full flex items-center gap-2 bg-white rounded-2xl px-4 py-3 border border-black/10 focus-within:border-[#0058bc]">
            <Github className="w-5 h-5 text-[#1b1b1d]" />
            <input
              type="text"
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-[#1b1b1d] placeholder:text-[#717786]"
            />
          </div>

          <button
            type="submit"
            disabled={isAnalyzing || !repoUrl.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#0058bc] hover:bg-[#004899] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Parsing AST & Tests...
              </>
            ) : (
              <>
                <Terminal className="w-4 h-4" />
                Run AI Repository Analysis
              </>
            )}
          </button>
        </form>
      </section>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Main Inspection Summary */}
          <div className="glass-pearl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-[#0058bc]/10 text-[#0058bc] px-2.5 py-0.5 rounded-full">
                  Verified GitHub Repository
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1b1b1d] mt-1.5 flex items-center gap-2">
                  {analysisResult.repoName}
                  <a href={`https://github.com/${analysisResult.repoName}`} target="_blank" rel="noreferrer" className="text-[#717786] hover:text-[#0058bc]">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </h2>
                <p className="text-xs text-[#44474e] mt-1">{analysisResult.description}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-center bg-white p-3 rounded-2xl border border-black/5 shadow-2xs">
                  <div className="text-2xl font-extrabold text-emerald-600">{analysisResult.codeQualityRating}</div>
                  <div className="text-[9px] text-[#717786] font-bold uppercase">Code Quality</div>
                </div>
                <div className="text-center bg-white p-3 rounded-2xl border border-black/5 shadow-2xs">
                  <div className="text-lg font-extrabold text-[#0058bc]">{analysisResult.testCoverageEstimate}</div>
                  <div className="text-[9px] text-[#717786] font-bold uppercase">Test Coverage</div>
                </div>
              </div>
            </div>

            {/* Architecture Diagnostics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#fbf8fb] border border-black/5">
                <div className="text-xs font-bold text-[#1b1b1d] mb-1">Architecture Summary</div>
                <p className="text-xs text-[#44474e] leading-relaxed">{analysisResult.architectureSummary}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#fbf8fb] border border-black/5 space-y-2">
                <div className="text-xs font-bold text-[#1b1b1d]">Frameworks & Tooling Detected</div>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.frameworks.map((fw, idx) => (
                    <span key={idx} className="text-xs font-semibold bg-white text-[#1b1b1d] px-2.5 py-1 rounded-lg border border-black/5 shadow-2xs">
                      {fw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Language Breakdown */}
            <div>
              <div className="text-xs font-bold text-[#717786] uppercase tracking-wider mb-2">
                Language Distribution
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-neutral-100">
                {analysisResult.languages.map((lang, idx) => (
                  <div
                    key={idx}
                    className={`h-full ${idx === 0 ? 'bg-[#0058bc]' : idx === 1 ? 'bg-[#4a47d2]' : 'bg-[#6462ec]'}`}
                    style={{ width: `${lang.percentage}%` }}
                    title={`${lang.name}: ${lang.percentage}%`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-xs text-[#44474e]">
                {analysisResult.languages.map((lang, idx) => (
                  <span key={idx} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#0058bc]' : idx === 1 ? 'bg-[#4a47d2]' : 'bg-[#6462ec]'}`} />
                    {lang.name} ({lang.percentage}%)
                  </span>
                ))}
              </div>
            </div>

            {/* Detected Skills & Proofs */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold text-[#1b1b1d] uppercase tracking-wider">
                  Extracted Skill Proofs ({analysisResult.detectedSkills.length})
                </div>
                <button
                  onClick={handleImportEvidence}
                  className="px-4 py-2 rounded-xl bg-[#0058bc] hover:bg-[#004899] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Merge Proofs into SkillMesh Graph
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {analysisResult.detectedSkills.map((ds, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-black/5 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#0058bc]">{ds.skill}</span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {ds.evidenceStrength}
                        </span>
                      </div>
                      <p className="text-xs text-[#44474e] leading-relaxed">{ds.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
