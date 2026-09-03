import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Code, 
  UploadCloud, 
  Award, 
  Play, 
  Check, 
  ChevronRight,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { ActiveTab, UserProfile, SkillNode } from '../../types';
import { soundEffects } from '../effects/SoundFeedback';
import { SpotlightCard } from '../effects/SpotlightCard';

interface LearnPersonalizedViewProps {
  user: UserProfile;
  skills: SkillNode[];
  onNavigate: (tab: ActiveTab) => void;
  onSkillLeveledUp?: (skillName: string, points: number) => void;
}

interface LearningTrack {
  id: string;
  skillName: string;
  badge: string;
  why: string;
  currentScore: number;
  targetScore: number;
  buildStep: {
    title: string;
    description: string;
    duration: string;
  };
  deployStep: {
    title: string;
    description: string;
    duration: string;
  };
  proveStep: {
    title: string;
    description: string;
    reward: string;
  };
}

export const LearnPersonalizedView: React.FC<LearnPersonalizedViewProps> = ({
  user,
  skills,
  onNavigate,
  onSkillLeveledUp
}) => {
  const [activeStepTrack, setActiveStepTrack] = useState<string>('docker');
  const [completedSteps, setCompletedSteps] = useState<Record<string, { build: boolean; deploy: boolean; prove: boolean }>>({
    docker: { build: true, deploy: false, prove: false },
    cv: { build: false, deploy: false, prove: false },
    vectordb: { build: false, deploy: false, prove: false }
  });

  const tracks: LearningTrack[] = [
    {
      id: 'docker',
      skillName: 'Docker',
      badge: 'HIGH IMPACT',
      why: 'It will help you deploy your AI projects so anyone can use them.',
      currentScore: 48,
      targetScore: 80,
      buildStep: {
        title: 'Build a Dockerfile for an AI app',
        description: 'Package your Python model and dependencies into a lightweight image.',
        duration: '15 mins'
      },
      deployStep: {
        title: 'Deploy to a cloud container',
        description: 'Push your container to Cloud Run or a local Docker engine.',
        duration: '20 mins'
      },
      proveStep: {
        title: 'Earn Verified Deployment Proof',
        description: 'SkillMesh verifies your running container and adds proof to your passport.',
        reward: '+32% Docker Mastery'
      }
    },
    {
      id: 'cv',
      skillName: 'Computer Vision',
      badge: 'CORE REQUIREMENT',
      why: 'It will let you build image classifiers and object detectors for AI Engineering.',
      currentScore: 38,
      targetScore: 75,
      buildStep: {
        title: 'Build an Image Classifier',
        description: 'Train a convolutional neural network on real image datasets.',
        duration: '30 mins'
      },
      deployStep: {
        title: 'Deploy real-time camera web app',
        description: 'Host the web app so it can classify live webcam feeds.',
        duration: '25 mins'
      },
      proveStep: {
        title: 'Earn Computer Vision Badge',
        description: 'Demonstrates real model training and inference in your portfolio.',
        reward: '+37% CV Mastery'
      }
    },
    {
      id: 'vectordb',
      skillName: 'Vector Databases',
      badge: 'RECOMMENDED',
      why: 'It will give your AI assistants a long-term memory to search large documents.',
      currentScore: 74,
      targetScore: 90,
      buildStep: {
        title: 'Build semantic search with pgvector',
        description: 'Index 10,000 document embeddings for sub-second similarity lookup.',
        duration: '25 mins'
      },
      deployStep: {
        title: 'Deploy search microservice',
        description: 'Serve vector queries through a lightning-fast FastAPI endpoint.',
        duration: '20 mins'
      },
      proveStep: {
        title: 'Earn Production Vector Proof',
        description: 'Proves advanced data retrieval architecture.',
        reward: '+16% Vector DB Mastery'
      }
    }
  ];

  const handleToggleStep = (trackId: string, stepKey: 'build' | 'deploy' | 'prove') => {
    soundEffects.playClick(680);
    setCompletedSteps(prev => {
      const trackState = prev[trackId] || { build: false, deploy: false, prove: false };
      const nextVal = !trackState[stepKey];
      const updated = {
        ...prev,
        [trackId]: {
          ...trackState,
          [stepKey]: nextVal
        }
      };

      // If user marks prove as complete, celebrate and level up
      if (stepKey === 'prove' && nextVal) {
        soundEffects.playSuccess();
        if (onSkillLeveledUp) {
          const track = tracks.find(t => t.id === trackId);
          if (track) onSkillLeveledUp(track.skillName, 15);
        }
      }

      return updated;
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-8 animate-fade-in pb-28">
      {/* Header */}
      <div>
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0058bc] bg-[#0058bc]/10 px-2.5 py-1 rounded-full">
          PERSONALIZED LEARNING
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1b1b1d] tracking-tight mt-2">
          Learn Next
        </h1>
        <p className="text-sm text-[#555a64] font-medium mt-1">
          SkillMesh picks exactly what to learn next based on your goal: <strong>{user.targetRole || 'AI Engineer'}</strong>.
        </p>
      </div>

      {/* The 3-Step Philosophy Banner: Build -> Deploy -> Prove */}
      <div className="glass-pearl rounded-2xl p-4 sm:p-5 border border-white/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-[#717786]">
            The SkillMesh Way
          </div>
          <div className="text-base font-black text-[#1b1b1d] mt-0.5">
            Build → Deploy → Prove
          </div>
        </div>
        <p className="text-xs text-[#555a64] max-w-md">
          Don't just watch videos. Build a real project, put it on the web, and get verified proof for your passport.
        </p>
      </div>

      {/* Personalized Learning Tracks */}
      <div className="space-y-6">
        {tracks.map((track) => {
          const progress = completedSteps[track.id] || { build: false, deploy: false, prove: false };
          const completedCount = (progress.build ? 1 : 0) + (progress.deploy ? 1 : 0) + (progress.prove ? 1 : 0);

          return (
            <SpotlightCard
              key={track.id}
              spotlightColor="rgba(0, 88, 188, 0.12)"
              className="glass-pearl rounded-3xl p-6 sm:p-7 border border-white/80 shadow-md space-y-6"
            >
              {/* Top Track Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#0058bc] uppercase tracking-wider">
                      {track.badge}
                    </span>
                    <span className="text-xs text-[#717786]">• 3 Steps</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#1b1b1d] tracking-tight mt-0.5">
                    Learn {track.skillName}
                  </h2>
                  <div className="text-xs sm:text-sm text-[#44474e] font-medium mt-1 flex items-start gap-1.5">
                    <span className="font-bold text-[#1b1b1d]">Why?</span>
                    <span>{track.why}</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-bold text-[#717786]">
                    Goal Mastery
                  </div>
                  <div className="text-lg font-black text-[#0058bc]">
                    {track.currentScore}% → {track.targetScore}%
                  </div>
                </div>
              </div>

              {/* The 3 Steps: Build -> Deploy -> Prove */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. BUILD */}
                <div 
                  onClick={() => handleToggleStep(track.id, 'build')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    progress.build 
                      ? 'bg-emerald-50/60 border-emerald-300' 
                      : 'bg-white hover:bg-[#f8fafd] border-black/5'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#717786] flex items-center gap-1">
                        <Code className="w-3.5 h-3.5 text-[#0058bc]" />
                        STEP 1 • BUILD
                      </span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        progress.build ? 'bg-emerald-500 text-white' : 'border border-[#717786]/40 text-transparent'
                      }`}>
                        ✓
                      </div>
                    </div>
                    <div className="font-extrabold text-sm text-[#1b1b1d]">
                      {track.buildStep.title}
                    </div>
                    <p className="text-xs text-[#555a64]">
                      {track.buildStep.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-black/5 text-[11px] font-bold text-[#717786] flex items-center justify-between">
                    <span>{track.buildStep.duration}</span>
                    <span className="text-[#0058bc]">{progress.build ? 'Completed' : 'Tap when built'}</span>
                  </div>
                </div>

                {/* 2. DEPLOY */}
                <div 
                  onClick={() => handleToggleStep(track.id, 'deploy')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    progress.deploy 
                      ? 'bg-emerald-50/60 border-emerald-300' 
                      : 'bg-white hover:bg-[#f8fafd] border-black/5'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#717786] flex items-center gap-1">
                        <UploadCloud className="w-3.5 h-3.5 text-[#0058bc]" />
                        STEP 2 • DEPLOY
                      </span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        progress.deploy ? 'bg-emerald-500 text-white' : 'border border-[#717786]/40 text-transparent'
                      }`}>
                        ✓
                      </div>
                    </div>
                    <div className="font-extrabold text-sm text-[#1b1b1d]">
                      {track.deployStep.title}
                    </div>
                    <p className="text-xs text-[#555a64]">
                      {track.deployStep.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-black/5 text-[11px] font-bold text-[#717786] flex items-center justify-between">
                    <span>{track.deployStep.duration}</span>
                    <span className="text-[#0058bc]">{progress.deploy ? 'Completed' : 'Tap when deployed'}</span>
                  </div>
                </div>

                {/* 3. PROVE */}
                <div 
                  onClick={() => handleToggleStep(track.id, 'prove')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    progress.prove 
                      ? 'bg-emerald-50/60 border-emerald-300' 
                      : 'bg-white hover:bg-[#f8fafd] border-black/5'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#717786] flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-[#0058bc]" />
                        STEP 3 • PROVE
                      </span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        progress.prove ? 'bg-emerald-500 text-white' : 'border border-[#717786]/40 text-transparent'
                      }`}>
                        ✓
                      </div>
                    </div>
                    <div className="font-extrabold text-sm text-[#1b1b1d]">
                      {track.proveStep.title}
                    </div>
                    <p className="text-xs text-[#555a64]">
                      {track.proveStep.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-black/5 text-[11px] font-black text-emerald-700 flex items-center justify-between">
                    <span>{track.proveStep.reward}</span>
                    <span className="text-[#0058bc]">{progress.prove ? 'Verified on Passport!' : 'Verify proof'}</span>
                  </div>
                </div>

              </div>

              {/* Action Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-[#555a64] font-medium">
                  {completedCount} of 3 steps completed
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('projects')}
                    className="px-4 py-2 rounded-xl bg-[#0058bc] hover:bg-[#004493] text-white font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Open in Projects Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </div>
  );
};
