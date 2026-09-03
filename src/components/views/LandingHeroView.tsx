import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Terminal, 
  CheckCircle2, 
  Compass, 
  Users, 
  GitBranch, 
  FolderGit2, 
  Briefcase, 
  Github, 
  FileText, 
  TrendingUp, 
  Shield, 
  ExternalLink, 
  Code, 
  Activity, 
  Sliders, 
  Check,
  Cpu,
  Zap,
  Flame,
  Award,
  CircleDot,
  Radio,
  BarChart3
} from 'lucide-react';
import { ActiveTab, SkillNode, UserProfile } from '../../types';
import { SpotlightCard } from '../effects/SpotlightCard';
import { DecryptedText } from '../effects/DecryptedText';
import { ShinyText } from '../effects/ShinyText';
import { CountUpNumber } from '../effects/CountUpNumber';
import { Magnet } from '../effects/Magnet';
import { TiltedCard } from '../effects/TiltedCard';
import { LiquidBorderBadge } from '../effects/LiquidBorderBadge';
import { InteractiveParticleConstellation } from '../effects/InteractiveParticleConstellation';
import { soundEffects } from '../effects/SoundFeedback';

interface LandingHeroViewProps {
  onNavigate: (tab: ActiveTab) => void;
  skills: SkillNode[];
  user: UserProfile;
}

export const LandingHeroView: React.FC<LandingHeroViewProps> = ({
  onNavigate,
  skills,
  user
}) => {
  const [selectedPreviewSkill, setSelectedPreviewSkill] = useState<string>('Python & PyTorch');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'ALL' | 'CORE' | 'AI' | 'SYSTEMS' | 'GROWTH'>('ALL');

  const handleAction = (tab: ActiveTab) => {
    soundEffects.playClick(800);
    onNavigate(tab);
  };

  // Evolution of Evidence Bento Steps
  const pipelineStages = [
    {
      step: '01',
      title: 'Profile & Code Ingestion',
      subtitle: 'Ingest raw history',
      desc: 'Deep multi-modal parsing of GitHub commits, ASTs, pull requests, test suites, and resume PDFs with semantic capability extraction.',
      icon: <Terminal className="w-5 h-5 text-[#0058bc]" />,
      badge: 'Multi-Modal Parser',
      glow: 'rgba(0, 88, 188, 0.15)'
    },
    {
      step: '02',
      title: 'Living 3D Skill Mesh',
      subtitle: 'Visualize connections',
      desc: 'Dynamic real-time mapping into an interactive 3D living spatial topology with decay rates, sub-mesh isolation, and neural links.',
      icon: <Layers className="w-5 h-5 text-[#4a47d2]" />,
      badge: 'WebGL Spatial Graph',
      glow: 'rgba(74, 71, 210, 0.15)'
    },
    {
      step: '03',
      title: 'Cryptographic Proof Link',
      subtitle: 'Prove capability',
      desc: 'Automated evidence weighting classifying artifacts into STRONG, MEDIUM, and WEAK tiers backed by actual repository commits.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      badge: 'Deterministic Proofs',
      glow: 'rgba(16, 185, 129, 0.15)'
    },
    {
      step: '04',
      title: 'Opportunity & Venture Map',
      subtitle: 'Discover next steps',
      desc: 'Autonomous deterministic matching against verified venture capital funds, complementary cofounders, and market roles.',
      icon: <Sparkles className="w-5 h-5 text-amber-600" />,
      badge: 'AI Role Matching',
      glow: 'rgba(245, 158, 11, 0.15)'
    }
  ];

  // All 11 Product Engines & Modules Showcase
  const appModules: {
    id: ActiveTab;
    title: string;
    tagline: string;
    category: 'CORE' | 'AI' | 'SYSTEMS' | 'GROWTH';
    icon: React.ReactNode;
    color: string;
    description: string;
    keyFeatures: string[];
    metrics: string;
  }[] = [
    {
      id: 'command',
      title: 'Command Center Cockpit',
      tagline: 'Your Daily Career Operating System',
      category: 'CORE',
      icon: <Compass className="w-5 h-5 text-[#0058bc]" />,
      color: 'from-[#0058bc]/10 to-[#0058bc]/5 text-[#0058bc]',
      description: 'Answers "Where am I?", "Where am I going?", and "What should I do next?" with live role fit metrics and daily missions.',
      keyFeatures: ['94% Skill Fit Score', 'Daily Micro-Mission', 'Next Step Priority Generator'],
      metrics: 'Active Cockpit'
    },
    {
      id: 'universe',
      title: '3D Living Skill Universe',
      tagline: 'Spatial Interactive Capability Topology',
      category: 'CORE',
      icon: <Layers className="w-5 h-5 text-[#4a47d2]" />,
      color: 'from-[#4a47d2]/10 to-[#4a47d2]/5 text-[#4a47d2]',
      description: 'Explore your entire technical stack in a 3D WebGL universe with orbital controls, node decay rates, and connected artifact inspectors.',
      keyFeatures: ['3D WebGL Raycasting', 'Sub-Mesh Isolation', 'Decay & Recency Indicators'],
      metrics: '18 Nodes Mapped'
    },
    {
      id: 'pathway',
      title: 'Adaptive Shortest Pathway',
      tagline: 'Mathematical Career Gap Closure',
      category: 'AI',
      icon: <GitBranch className="w-5 h-5 text-emerald-600" />,
      color: 'from-emerald-600/10 to-emerald-600/5 text-emerald-600',
      description: 'Computes the fastest verified route from your current profile to target roles like AI Engineer, Research Scientist, or Tech Founder.',
      keyFeatures: ['Skill Gap Dissection', 'Target Role Trajectories', 'Estimated Time-to-Mastery'],
      metrics: '2 Milestones Left'
    },
    {
      id: 'evidence',
      title: 'Evidence & Verification Vault',
      tagline: 'Zero-Fluff Cryptographic Capability',
      category: 'SYSTEMS',
      icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
      color: 'from-purple-600/10 to-purple-600/5 text-purple-600',
      description: 'Every claim is audited into STRONG, MEDIUM, or WEAK tiers with code references, test coverage numbers, and production proofs.',
      keyFeatures: ['Automated AI Confidence', 'GitHub Commit Verification', 'Credibility Grade'],
      metrics: '8 Strong Proofs'
    },
    {
      id: 'projects',
      title: 'AI Gap-Closing Projects',
      tagline: 'Generative Proof Builder Workspace',
      category: 'AI',
      icon: <FolderGit2 className="w-5 h-5 text-indigo-600" />,
      color: 'from-indigo-600/10 to-indigo-600/5 text-indigo-600',
      description: 'Generate high-impact engineering projects designed specifically to close your skill gaps using server-side Gemini 2.5 intelligence.',
      keyFeatures: ['Dynamic Spec Generator', 'Automated Proof Checklist', 'Instant Mesh Level-Up'],
      metrics: '3 Active Projects'
    },
    {
      id: 'opportunities',
      title: 'Venture & Market Opportunities',
      tagline: 'Deterministic Role & Bounty Radar',
      category: 'GROWTH',
      icon: <Briefcase className="w-5 h-5 text-amber-600" />,
      color: 'from-amber-600/10 to-amber-600/5 text-amber-600',
      description: 'Browse curated venture-backed roles and engineering bounties tailored to your verified technical strengths and target trajectory.',
      keyFeatures: ['Role Match Percentages', 'Missing Skill Highlighting', 'One-Click Proof Pitch'],
      metrics: '12 Live Matches'
    },
    {
      id: 'people',
      title: 'Investors & Co-Founders Network',
      tagline: 'Venture Capital & Talent Intelligence',
      category: 'GROWTH',
      icon: <Users className="w-5 h-5 text-pink-600" />,
      color: 'from-pink-600/10 to-pink-600/5 text-pink-600',
      description: 'Match directly with VC theses (Conviction, Sequoia, a16z) and discover cofounders with complementary technical skill topologies.',
      keyFeatures: ['Thesis Synergy Matching', 'Cofounder Skill Gap Fill', 'AI Tailored Pitch Drafter'],
      metrics: '8 Investors & Peers'
    },
    {
      id: 'github',
      title: 'GitHub Neural Code Ingestion',
      tagline: 'Deep AST & Repository Analyzer',
      category: 'SYSTEMS',
      icon: <Github className="w-5 h-5 text-slate-800" />,
      color: 'from-slate-800/10 to-slate-800/5 text-slate-800',
      description: 'Connect your public or private repositories to automatically extract languages, frameworks, test suites, and commit cadences.',
      keyFeatures: ['AST Code Pattern Parsing', 'Test Suite Coverage Audit', 'Instant Skill Extractor'],
      metrics: '4 Repos Analyzed'
    },
    {
      id: 'resume',
      title: 'Neural Resume Extractor',
      tagline: 'Transform Static Text to Graph Nodes',
      category: 'SYSTEMS',
      icon: <FileText className="w-5 h-5 text-teal-600" />,
      color: 'from-teal-600/10 to-teal-600/5 text-teal-600',
      description: 'Upload your PDF resume to extract verifiable work milestones, project achievements, and convert bullet points into vector nodes.',
      keyFeatures: ['Multi-Page PDF Parsing', 'Auto-Tagging to Mesh', 'Zero-Loss Fact Retention'],
      metrics: 'Instant Extraction'
    },
    {
      id: 'simulator',
      title: 'Career Topology Simulator',
      tagline: 'What-If Trajectory Simulation Engine',
      category: 'AI',
      icon: <TrendingUp className="w-5 h-5 text-cyan-600" />,
      color: 'from-cyan-600/10 to-cyan-600/5 text-cyan-600',
      description: 'Simulate the market value, hiring probability, and skill fit score impact of learning new technologies over 3, 6, and 12 months.',
      keyFeatures: ['What-If Scenario Modeling', 'Market Demand Multipliers', 'Projected Skill Topologies'],
      metrics: 'Live Simulation'
    },
    {
      id: 'team',
      title: 'Team Intelligence Mesh',
      tagline: 'Multi-Engineer Skill Topology',
      category: 'GROWTH',
      icon: <Users className="w-5 h-5 text-blue-600" />,
      color: 'from-blue-600/10 to-blue-600/5 text-blue-600',
      description: 'Overlay skill graphs across multiple team members to detect technical blindspots, single points of failure, and optimal pairings.',
      keyFeatures: ['Organizational Topology', 'Single-Point-of-Failure Alert', 'Synergy Scoring'],
      metrics: 'Team Analysis'
    },
    {
      id: 'settings',
      title: 'Data Sovereignty & Privacy',
      tagline: 'Zero-Knowledge Proofs & Portability',
      category: 'SYSTEMS',
      icon: <Shield className="w-5 h-5 text-emerald-700" />,
      color: 'from-emerald-700/10 to-emerald-700/5 text-emerald-700',
      description: 'Full control over your skill mesh visibility, public verification keys, and one-click cryptographic JSON exports.',
      keyFeatures: ['Granular Visibility Controls', 'Cryptographic Proof Export', 'Zero-Knowledge Verification'],
      metrics: '100% Owned'
    }
  ];

  const filteredModules = activeCategoryFilter === 'ALL' 
    ? appModules 
    : appModules.filter(m => m.category === activeCategoryFilter);

  // Sample Interactive Demo Skill Data
  const demoSkills = [
    {
      name: 'Python & PyTorch',
      mastery: 92,
      category: 'AI / ML Core',
      verifiedProofs: 14,
      confidence: 96,
      artifacts: ['NLP Classifier v3', 'Distributed PyTorch Pipeline', 'Transformer Inference Engine'],
      decayStatus: 'Optimal (Active 2d ago)',
      roleImpact: '+18% Fit for AI Engineer'
    },
    {
      name: 'Distributed Systems & Go',
      mastery: 84,
      category: 'Infrastructure',
      verifiedProofs: 9,
      confidence: 91,
      artifacts: ['Raft Consensus Engine', 'gRPC High-Throughput Cluster', 'Kube Custom Operator'],
      decayStatus: 'Fresh (Active 5d ago)',
      roleImpact: '+24% Fit for Principal Eng'
    },
    {
      name: 'React & TypeScript',
      mastery: 89,
      category: 'Frontend Nodes',
      verifiedProofs: 12,
      confidence: 94,
      artifacts: ['SkillMesh WebGL Canvas', 'Micro-Frontend Architecture', 'Real-time WebSocket State'],
      decayStatus: 'Optimal (Active 1d ago)',
      roleImpact: '+15% Fit for Full-Stack Lead'
    },
    {
      name: 'RAG & Vector Search',
      mastery: 88,
      category: 'AI Engineering',
      verifiedProofs: 8,
      confidence: 93,
      artifacts: ['Qdrant Hybrid Retrieval', 'Chunking & Re-ranking AST', 'Production Agent Router'],
      decayStatus: 'Optimal (Active 12h ago)',
      roleImpact: '+28% Fit for AI Engineer'
    }
  ];

  const activeDemoSkill = demoSkills.find(s => s.name === selectedPreviewSkill) || demoSkills[0];

  return (
    <div className="space-y-16 pb-28 animate-in fade-in duration-300 relative">
      {/* Ambient Interactive Particle Constellation Layer */}
      <InteractiveParticleConstellation particleCount={38} className="opacity-60 pointer-events-none" />

      {/* 1. Hero Section with 3D Galaxy Canvas */}
      <section className="relative pt-4 sm:pt-8 max-w-7xl mx-auto px-2 sm:px-4 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 min-h-[520px]">
          {/* Left Text & CTA Column */}
          <div className="flex-1 flex flex-col items-start gap-5 max-w-2xl">
            {/* Live Status Liquid Badge */}
            <LiquidBorderBadge>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0058bc] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0058bc]"></span>
              </span>
              <DecryptedText 
                text="LIVE VERIFIED AI CAREER OPERATING SYSTEM" 
                speed={30} 
                animateOn="both"
                className="font-bold text-[11px] tracking-wider text-[#0058bc]" 
              />
            </LiquidBorderBadge>

            {/* Main Headline with Shiny & Decrypted Typography */}
            <h1 className="text-4xl sm:text-6xl lg:text-[66px] font-black tracking-tight text-[#1b1b1d] leading-[1.08]">
              YOUR SKILLS ARE <br />
              <ShinyText 
                text="MORE THAN" 
                className="bg-gradient-to-r from-[#0058bc] via-[#4a47d2] to-[#6462ec] font-black"
                speed={3.5}
              />{' '}
              A RESUME.
            </h1>

            {/* Sub-text */}
            <p className="text-base sm:text-lg text-[#44474e] max-w-xl font-normal leading-relaxed">
              SkillMesh turns your real-world code, commits, and engineering artifacts into a living 3D capability graph—showing what you've proved, where you're going, and what to build next.
            </p>

            {/* Hero Action Buttons with ReactBits Magnetism */}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Magnet magnetStrength={0.4} activeScale={1.04} onClick={() => handleAction('command')}>
                <button
                  id="hero-primary-launch-btn"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#0058bc] to-[#4a47d2] text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#0058bc]/25 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  BUILD MY SKILLMESH
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Magnet>
              
              <Magnet magnetStrength={0.3} activeScale={1.03} onClick={() => handleAction('universe')}>
                <button
                  id="hero-universe-btn"
                  className="px-5 py-3.5 rounded-2xl glass-frost text-[#1b1b1d] hover:bg-white text-sm font-bold flex items-center gap-2 border border-black/5 shadow-2xs cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-[#0058bc]" />
                  Explore 3D Universe
                </button>
              </Magnet>

              <Magnet magnetStrength={0.25} activeScale={1.02} onClick={() => handleAction('github')}>
                <button
                  id="hero-github-sync-btn"
                  className="px-4 py-3.5 rounded-2xl bg-white text-[#44474e] hover:text-[#1b1b1d] text-sm font-semibold border border-black/5 flex items-center gap-1.5 cursor-pointer hover:bg-[#f4f2f7]"
                >
                  <Github className="w-4 h-4 text-[#1b1b1d]" />
                  Ingest GitHub Repo
                </button>
              </Magnet>
            </div>

            {/* Mini Trust Stats with Animated Counters */}
            <div className="mt-4 pt-4 border-t border-black/5 flex flex-wrap items-center gap-6 text-xs text-[#717786]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Deterministic Proofs: <CountUpNumber to={100} suffix="%" className="text-emerald-700" /></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Hallucination Proofs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Gemini 2.5 Server Verified</span>
              </div>
            </div>
          </div>

          {/* Right Interactive Liquid Glass Live Capability Matrix */}
          <div className="flex-1 w-full relative">
            <SpotlightCard
              spotlightColor="rgba(0, 88, 188, 0.16)"
              className="glass-pearl rounded-3xl p-5 sm:p-7 chromatic-edge shadow-2xl border border-white/90 relative overflow-hidden"
            >
              {/* Header with Live Status & Mode Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-black/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0058bc] to-[#4a47d2] text-white flex items-center justify-center shadow-sm">
                    <Activity className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-[#1b1b1d] tracking-wide">CAPABILITY MESH TELEMETRY</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                    <div className="text-[11px] text-[#717786] font-medium">Real-time Verified Proof Stream</div>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-[#0058bc]/10 text-[#0058bc] text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AST Verified
                </div>
              </div>

              {/* Interactive Node Selector Pills */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5 p-1 bg-[#f4f2f7] rounded-xl border border-black/5">
                {demoSkills.map((skill) => {
                  const isSelected = selectedPreviewSkill === skill.name;
                  return (
                    <button
                      key={skill.name}
                      onClick={() => {
                        soundEffects.playClick(650);
                        setSelectedPreviewSkill(skill.name);
                      }}
                      className={`flex-1 min-w-[110px] py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                        isSelected
                          ? 'bg-white text-[#0058bc] shadow-sm scale-[1.02] border border-black/5'
                          : 'text-[#44474e] hover:text-[#1b1b1d]'
                      }`}
                    >
                      {skill.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>

              {/* Active Skill Telemetry Display */}
              <div className="mt-5 space-y-4">
                {/* Score & Category Bar */}
                <div className="p-4 rounded-2xl bg-white/80 border border-black/5 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-[10px] uppercase font-extrabold text-[#717786] tracking-wider">
                        {activeDemoSkill.category}
                      </div>
                      <div className="text-lg font-black text-[#1b1b1d] flex items-center gap-1.5">
                        <DecryptedText text={activeDemoSkill.name} speed={20} animateOn="hover" />
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-[#0058bc] tracking-tight">
                        <CountUpNumber to={activeDemoSkill.mastery} suffix="%" />
                      </div>
                      <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {activeDemoSkill.decayStatus}
                      </div>
                    </div>
                  </div>

                  {/* Liquid Gradient Progress Bar */}
                  <div className="w-full h-2 bg-[#f4f2f7] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0058bc] via-[#4a47d2] to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${activeDemoSkill.mastery}%` }}
                    />
                  </div>
                </div>

                {/* Evidence Artifacts Mini Feed */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#717786]">
                    <span>LINKED CODE ARTIFACTS</span>
                    <span className="text-[#0058bc]">{activeDemoSkill.verifiedProofs} Cryptographic Proofs</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeDemoSkill.artifacts.slice(0, 2).map((art, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white/90 border border-black/5 flex items-center justify-between shadow-2xs hover:border-[#0058bc]/40 transition-colors"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Code className="w-3.5 h-3.5 text-[#0058bc] flex-shrink-0" />
                          <span className="text-xs font-bold text-[#1b1b1d] truncate">{art}</span>
                        </div>
                        <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          STRONG
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trajectory Lift & Action Footer */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0058bc]/5 via-[#4a47d2]/5 to-transparent border border-[#0058bc]/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#0058bc]/10 text-[#0058bc] flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#717786]">Career Trajectory Lift</div>
                      <div className="text-xs font-black text-emerald-600">{activeDemoSkill.roleImpact}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAction('pathway')}
                    className="px-3 py-1.5 rounded-xl bg-[#0058bc] hover:bg-[#004493] text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                  >
                    <span>View Gap</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* 2. The Evolution of Evidence (Spotlight Bento Grid) */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 pt-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0058bc] uppercase tracking-widest bg-[#0058bc]/5 px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            FOUR-STAGE CAPABILITY PIPELINE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1b1b1d] tracking-tight">
            The Evolution of Evidence
          </h2>
          <p className="text-base text-[#717786] mt-2">
            Stop listing static bullets on paper. Start mapping verifiable capability vectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {pipelineStages.map((stage, idx) => (
            <SpotlightCard
              key={idx}
              spotlightColor={stage.glow}
              className="glass-crystal rounded-2xl p-6 flex flex-col justify-between h-[310px] chromatic-edge group shadow-sm border border-white/80"
              onClick={() => soundEffects.playClick(700 + idx * 50)}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl glass-frost flex items-center justify-center shadow-2xs border border-white/60 group-hover:scale-110 transition-transform">
                    {stage.icon}
                  </div>
                  <span className="text-xs font-extrabold text-[#717786] group-hover:text-[#0058bc] transition-colors">
                    {stage.step}
                  </span>
                </div>

                <div className="text-[11px] font-bold text-[#0058bc] uppercase tracking-wider mb-1">
                  <DecryptedText text={stage.subtitle} animateOn="hover" speed={25} />
                </div>
                <h3 className="text-lg font-bold text-[#1b1b1d] mb-2 leading-snug">
                  {stage.title}
                </h3>
                <p className="text-xs text-[#44474e] leading-relaxed">
                  {stage.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-black/5 flex items-center justify-between text-[11px] font-semibold text-[#717786]">
                <span className="px-2 py-0.5 rounded-md bg-white/70 text-[#0058bc] font-bold text-[10px]">
                  {stage.badge}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* 3. Interactive Live Skill Proof Preview Island with Tilted Cards */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="glass-pearl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-black/5">
            <div>
              <div className="text-xs font-bold text-[#0058bc] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Activity className="w-4 h-4" />
                Interactive Telemetry Sandbox
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1b1b1d]">
                Live Proof & Node Verification Inspector
              </h2>
              <p className="text-sm text-[#44474e] mt-1">
                Select a skill node to inspect real-world proof artifacts, AI confidence scores, and career trajectory impact.
              </p>
            </div>

            {/* Skill Selector Tabs with Sound Triggers */}
            <div className="flex flex-wrap items-center gap-2 bg-[#f4f2f7] p-1.5 rounded-2xl border border-black/5">
              {demoSkills.map((skill) => (
                <button
                  key={skill.name}
                  onClick={() => {
                    soundEffects.playClick(600);
                    setSelectedPreviewSkill(skill.name);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedPreviewSkill === skill.name
                      ? 'bg-white text-[#0058bc] shadow-sm font-extrabold scale-105'
                      : 'text-[#44474e] hover:text-[#1b1b1d]'
                  }`}
                >
                  {skill.name}
                </button>
              ))}
            </div>
          </div>

          {/* Active Skill Dynamic Telemetry Card */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mastery & Status Box */}
            <SpotlightCard spotlightColor="rgba(0, 88, 188, 0.15)" className="glass-liquid rounded-2xl p-5 border border-white/60 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[#717786] uppercase">Mastery Index</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-xs">
                    {activeDemoSkill.decayStatus}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <CountUpNumber to={activeDemoSkill.mastery} suffix="%" className="text-5xl font-black text-[#0058bc] tracking-tight" />
                  <span className="text-xs font-bold text-[#717786]">Demonstrated Mastery</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2.5 bg-black/5 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-gradient-to-r from-[#0058bc] to-[#4a47d2] rounded-full transition-all duration-700" 
                    style={{ width: `${activeDemoSkill.mastery}%` }}
                  />
                </div>
                <div className="p-3 rounded-xl bg-white/80 border border-black/5 text-xs text-[#44474e] flex items-center justify-between">
                  <span className="font-semibold text-[#1b1b1d]">Role Trajectory Lift:</span>
                  <span className="font-extrabold text-emerald-600">{activeDemoSkill.roleImpact}</span>
                </div>
              </div>

              <button
                onClick={() => handleAction('universe')}
                className="mt-6 w-full py-2.5 rounded-xl bg-[#0058bc] hover:bg-[#004493] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                Inspect in 3D Spatial Universe
              </button>
            </SpotlightCard>

            {/* Connected Real-World Artifacts */}
            <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.12)" className="glass-liquid rounded-2xl p-5 border border-white/60 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#717786] uppercase">Verified Proof Artifacts</span>
                  <span className="text-xs font-extrabold text-[#0058bc]">
                    <CountUpNumber to={activeDemoSkill.verifiedProofs} suffix=" Linked Proofs" />
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeDemoSkill.artifacts.map((artifact, i) => (
                    <div 
                      key={i}
                      className="p-3 rounded-xl bg-white/80 border border-black/5 flex items-center justify-between hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#0058bc]/10 text-[#0058bc] flex items-center justify-center">
                          <Code className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#1b1b1d]">{artifact}</div>
                          <div className="text-[10px] text-[#717786]">Repository Commit • AST Verified</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        STRONG
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleAction('evidence')}
                className="mt-4 w-full py-2.5 rounded-xl glass-frost hover:bg-white text-[#1b1b1d] text-xs font-bold flex items-center justify-center gap-1.5 border border-black/5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                View Full Evidence Vault
              </button>
            </SpotlightCard>

            {/* AI Verification & Gemini Engine Card */}
            <SpotlightCard spotlightColor="rgba(74, 71, 210, 0.15)" className="glass-liquid rounded-2xl p-5 border border-white/60 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#717786] uppercase">AI Confidence Metric</span>
                  <span className="text-xs font-extrabold text-emerald-600">
                    <CountUpNumber to={activeDemoSkill.confidence} suffix="% Confidence" />
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/80 border border-black/5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1b1b1d]">
                    <Sparkles className="w-4 h-4 text-[#0058bc]" />
                    <span>Gemini 2.5 Proof Synthesis</span>
                  </div>
                  <p className="text-xs text-[#44474e] leading-relaxed">
                    Verified through automated code pattern AST scans, pull request review histories, and live server endpoints. Zero synthetic claims detected.
                  </p>
                  <div className="pt-2 border-t border-black/5 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <div className="text-[#717786]">Test Ratio</div>
                      <div className="font-bold text-[#1b1b1d]">94% Covered</div>
                    </div>
                    <div>
                      <div className="text-[#717786]">Decay Half-Life</div>
                      <div className="font-bold text-[#1b1b1d]">180 Days</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleAction('pathway')}
                className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0058bc] to-[#4a47d2] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <GitBranch className="w-4 h-4" />
                Calculate Role Gap Pathway
              </button>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* 4. Complete Platform Modules Showcase with ReactBits Spotlight Cards */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-[#0058bc] uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Sliders className="w-4 h-4" />
              INTEGRATED CAREER OS ARCHITECTURE
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1b1b1d] tracking-tight">
              Every Engine at Your Command
            </h2>
            <p className="text-sm text-[#717786] mt-1 max-w-2xl">
              SkillMesh orchestrates your entire professional trajectory through 11 purpose-built intelligent modules.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#f4f2f7] p-1.5 rounded-2xl border border-black/5">
            {(['ALL', 'CORE', 'AI', 'SYSTEMS', 'GROWTH'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundEffects.playClick(620);
                  setActiveCategoryFilter(cat);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategoryFilter === cat
                    ? 'bg-white text-[#0058bc] shadow-sm font-extrabold'
                    : 'text-[#44474e] hover:text-[#1b1b1d]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredModules.map((mod) => (
            <SpotlightCard
              key={mod.id}
              spotlightColor="rgba(0, 88, 188, 0.12)"
              className="glass-pearl rounded-2xl p-6 border border-white/80 shadow-md flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
              onClick={() => handleAction(mod.id)}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center shadow-2xs border border-white/60 group-hover:scale-110 transition-transform`}>
                    {mod.icon}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#f4f2f7] text-[10px] font-extrabold text-[#717786] uppercase tracking-wider">
                    {mod.metrics}
                  </span>
                </div>

                <div className="text-[11px] font-bold text-[#0058bc] uppercase tracking-wider mb-1">
                  {mod.tagline}
                </div>
                <h3 className="text-lg font-bold text-[#1b1b1d] mb-2 group-hover:text-[#0058bc] transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs text-[#44474e] leading-relaxed mb-4">
                  {mod.description}
                </p>

                {/* Key Features Checklist */}
                <div className="space-y-1.5 pt-3 border-t border-black/5 mb-6">
                  {mod.keyFeatures.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#1b1b1d] font-medium">
                      <Check className="w-3.5 h-3.5 text-[#0058bc] flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Launch Module Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(mod.id);
                }}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-[#0058bc] hover:text-white text-[#0058bc] text-xs font-bold flex items-center justify-center gap-1.5 border border-black/5 shadow-2xs transition-all duration-200 cursor-pointer"
              >
                <span>Launch {mod.title.split(' ')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* 5. Bottom Conversion & Executive Launch Banner */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-r from-[#0058bc] via-[#4a47d2] to-[#6462ec] text-white shadow-2xl">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-black/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              ACCELERATE YOUR CAREER TRAJECTORY
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
              Ready to turn your skills into a living career operating system?
            </h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-8 max-w-2xl">
              Connect your GitHub repositories, upload your resume, or let our AI architect your shortest roadmap to founder or senior staff roles today.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Magnet magnetStrength={0.4} activeScale={1.04} onClick={() => handleAction('command')}>
                <button className="px-7 py-3.5 rounded-2xl bg-white text-[#0058bc] text-sm font-extrabold flex items-center gap-2 shadow-lg cursor-pointer">
                  <Compass className="w-4 h-4" />
                  ENTER COMMAND COCKPIT
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Magnet>

              <Magnet magnetStrength={0.3} activeScale={1.03} onClick={() => handleAction('universe')}>
                <button className="px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-sm font-bold flex items-center gap-2 backdrop-blur-md border border-white/20 cursor-pointer">
                  <Layers className="w-4 h-4" />
                  View 3D Universe
                </button>
              </Magnet>

              <Magnet magnetStrength={0.25} activeScale={1.02} onClick={() => handleAction('resume')}>
                <button className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-md border border-white/15 cursor-pointer">
                  Upload Resume (PDF)
                </button>
              </Magnet>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
