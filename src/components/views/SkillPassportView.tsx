import React, { useState } from 'react';
import { 
  Sparkles, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  QrCode, 
  ExternalLink, 
  Code, 
  Award, 
  Download, 
  FolderGit2, 
  Layers,
  Check
} from 'lucide-react';
import { ActiveTab, UserProfile, SkillNode, EvidenceItem } from '../../types';
import { soundEffects } from '../effects/SoundFeedback';
import { SpotlightCard } from '../effects/SpotlightCard';
import { VariableProximity } from '../effects/VariableProximity';
import { SplitText } from '../effects/SplitText';
import { ShinyText } from '../effects/ShinyText';

interface SkillPassportViewProps {
  user: UserProfile;
  skills: SkillNode[];
  evidence: EvidenceItem[];
  onNavigate: (tab: ActiveTab) => void;
}

export const SkillPassportView: React.FC<SkillPassportViewProps> = ({
  user,
  skills,
  evidence,
  onNavigate
}) => {
  const [copied, setCopied] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const passportUrl = `https://skillmesh.network/passport/${user.name.toLowerCase().replace(/\s+/g, '-')}`;

  const handleShare = () => {
    soundEffects.playSuccess();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(passportUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const topSkills = ['Python', 'Machine Learning', 'React'];

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 space-y-8 animate-fade-in pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#0058bc] bg-[#0058bc]/10 px-2.5 py-1 rounded-full">
            VERIFIED CREDENTIAL
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1b1b1d] font-heading tracking-tight mt-2">
            <SplitText text="Skill Passport" delay={30} className="font-black" />
          </h1>
          <p className="text-sm text-[#555a64] font-semibold mt-0.5">
            Your tamper-proof digital passport proving what you can build.
          </p>
        </div>

        <button
          onClick={handleShare}
          className="self-start sm:self-auto px-5 py-2.5 rounded-2xl bg-[#0058bc] hover:bg-[#004493] text-white text-xs font-black flex items-center gap-2 shadow-md shadow-[#0058bc]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer font-heading"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Link Copied!' : 'Share my passport'}</span>
        </button>
      </div>

      {/* THE OFFICIAL PASSPORT CARD */}
      <div className="relative rounded-3xl p-1 bg-gradient-to-br from-[#0058bc] via-[#4a47d2] to-emerald-500 shadow-2xl">
        <div className="bg-white rounded-[22px] p-6 sm:p-8 space-y-6">
          
          {/* Card Top: Brand + Verification Badge */}
          <div className="flex items-center justify-between pb-4 border-b border-black/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0058bc] text-white flex items-center justify-center font-black text-xs shadow-sm font-tech">
                SM
              </div>
              <span className="text-xs font-black tracking-wider text-[#1b1b1d] font-heading">
                SKILLMESH OFFICIAL PASSPORT
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-tech text-[11px] font-bold">Cryptographically Verified</span>
            </div>
          </div>

          {/* User Profile Overview */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0058bc] to-[#6462ec] text-white font-black text-2xl flex items-center justify-center shadow-md font-heading">
                {user.name.charAt(0)}
              </div>
              <div>
                <VariableProximity
                  label={user.name}
                  className="text-2xl sm:text-3xl font-black text-[#1b1b1d] font-heading tracking-tight cursor-default"
                  radius={110}
                  minWeight={700}
                  maxWeight={900}
                  minScale={1.0}
                  maxScale={1.08}
                />
                <div className="text-sm font-black text-[#0058bc] mt-0.5 font-heading">
                  Future {user.targetRole || 'AI Engineer'}
                </div>
                <div className="text-xs text-[#717786] font-tech font-semibold mt-0.5">
                  ID: SMP-{user.name.toLowerCase().replace(/\s+/g, '-')}-2026-9481
                </div>
              </div>
            </div>

            {/* Career Readiness Badge */}
            <div className="p-4 rounded-2xl bg-[#f8fafd] border border-black/5 text-left sm:text-right">
              <div className="text-[11px] font-black text-[#717786] uppercase tracking-wider font-heading">
                Career Readiness
              </div>
              <div className="text-3xl font-black text-[#0058bc] font-tech">
                {user.skillFitScore}%
              </div>
              <div className="text-xs font-bold text-emerald-600">
                Verified Ready
              </div>
            </div>
          </div>

          {/* 3 Core Metric Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            
            {/* Top Skills */}
            <div className="p-4 rounded-2xl bg-[#f8fafd] border border-black/5 space-y-2">
              <div className="text-[11px] font-bold text-[#717786] uppercase tracking-wider">
                Top Skills
              </div>
              <div className="space-y-1">
                {topSkills.map((skillName, idx) => (
                  <div key={idx} className="text-sm font-bold text-[#1b1b1d] flex items-center justify-between">
                    <span>{skillName}</span>
                    <span className="text-xs text-[#0058bc] font-black">
                      {skillName === 'Python' ? '86%' : skillName === 'React' ? '74%' : '55%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="p-4 rounded-2xl bg-[#f8fafd] border border-black/5 flex flex-col justify-between">
              <div className="text-[11px] font-bold text-[#717786] uppercase tracking-wider">
                Real Projects
              </div>
              <div>
                <div className="text-3xl font-black text-[#1b1b1d]">6</div>
                <div className="text-xs text-[#555a64] font-medium mt-0.5">
                  Working apps with code
                </div>
              </div>
              <div className="text-[11px] text-[#0058bc] font-bold">
                100% test-verified
              </div>
            </div>

            {/* Verified Evidence */}
            <div className="p-4 rounded-2xl bg-[#f8fafd] border border-black/5 flex flex-col justify-between">
              <div className="text-[11px] font-bold text-[#717786] uppercase tracking-wider">
                Verified Evidence
              </div>
              <div>
                <div className="text-3xl font-black text-emerald-600">14</div>
                <div className="text-xs text-[#555a64] font-medium mt-0.5">
                  AST commits & quizzes
                </div>
              </div>
              <div className="text-[11px] text-emerald-700 font-bold">
                0 unverified claims
              </div>
            </div>

          </div>

          {/* Proof of Your Skills Section */}
          <div className="pt-3 border-t border-black/5 space-y-3">
            <div className="text-xs font-black uppercase tracking-wider text-[#717786]">
              PROOF OF YOUR SKILLS
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-black/5 flex items-center justify-between">
                <span className="font-bold text-[#1b1b1d]">Python</span>
                <span className="text-[#555a64]">✓ 4 Projects • 2 Quizzes</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-black/5 flex items-center justify-between">
                <span className="font-bold text-[#1b1b1d]">Machine Learning</span>
                <span className="text-[#555a64]">✓ 2 Models • 1 Challenge</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-black/5 flex items-center justify-between">
                <span className="font-bold text-[#1b1b1d]">React</span>
                <span className="text-[#555a64]">✓ 3 Live Web Apps</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-black/5 flex items-center justify-between">
                <span className="font-bold text-[#1b1b1d]">GitHub Activity</span>
                <span className="text-[#555a64]">✓ Active this week</span>
              </div>
            </div>

            <p className="text-xs text-[#717786] italic pt-1">
              These verified artifacts help SkillMesh prove your true ability to employers and universities without relying on resume claims.
            </p>
          </div>

          {/* Card Footer */}
          <div className="pt-4 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-[#717786] font-mono text-[11px]">
              SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsQRModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#f0f4fd] border border-black/5 font-bold text-[#1b1b1d] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Show QR Code</span>
              </button>
              <button
                onClick={handleShare}
                className="px-3 py-1.5 rounded-xl bg-[#0058bc] text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy URL</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* QR MODAL */}
      {isQRModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-black/10 relative text-center space-y-4">
            <h3 className="text-base font-black text-[#1b1b1d]">
              Scan to view {user.name}'s Passport
            </h3>
            
            <div className="w-48 h-48 mx-auto bg-[#f8fafd] rounded-2xl border border-black/10 flex items-center justify-center p-4 shadow-inner">
              {/* Clean SVG QR Code Representation */}
              <div className="w-full h-full bg-[#1b1b1d] rounded-xl flex items-center justify-center text-white font-mono text-[10px] p-2 text-center">
                [SKILLMESH-QR-VERIFY: {user.name}]
              </div>
            </div>

            <p className="text-xs text-[#717786]">
              Point any smartphone camera to inspect verified code artifacts and project repositories.
            </p>

            <button
              onClick={() => setIsQRModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#0058bc] text-white text-xs font-bold hover:bg-[#004493] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
