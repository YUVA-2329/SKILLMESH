import React, { useState, useEffect } from 'react';
import { ActiveTab, EvidenceItem, CareerProject, SkillNode, UserProfile, DailyMission } from './types';
import { 
  initialUserProfile, 
  initialSkillGraph, 
  initialCareerGoal, 
  initialEvidence, 
  initialProjects, 
  initialOpportunities, 
  initialPeople, 
  initialTeamMesh,
  initialDailyMission
} from './data/mockData';
import { LiquidBackgroundShader } from './components/canvas/LiquidBackgroundShader';
import { TopNavBar } from './components/navigation/TopNavBar';
import { CommandPaletteModal } from './components/navigation/CommandPaletteModal';
import { AskSkillMeshDrawer } from './components/chat/AskSkillMeshDrawer';
import { DockNav } from './components/effects/DockNav';

// Views
import { LandingHeroView } from './components/views/LandingHeroView';
import { CommandCenterDashboard } from './components/views/CommandCenterDashboard';
import { SkillMeshUniverseView } from './components/views/SkillMeshUniverseView';
import { EvidenceVerificationView } from './components/views/EvidenceVerificationView';
import { AdaptivePathwayView } from './components/views/AdaptivePathwayView';
import { ProjectsWorkspaceView } from './components/views/ProjectsWorkspaceView';
import { OpportunitiesView } from './components/views/OpportunitiesView';
import { PeopleAndInvestorsView } from './components/views/PeopleAndInvestorsView';
import { GitHubAnalyzerView } from './components/views/GitHubAnalyzerView';
import { ResumeImporterView } from './components/views/ResumeImporterView';
import { CareerSimulatorView } from './components/views/CareerSimulatorView';
import { TeamIntelligenceView } from './components/views/TeamIntelligenceView';
import { SettingsPrivacyView } from './components/views/SettingsPrivacyView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [skills, setSkills] = useState<SkillNode[]>(initialSkillGraph.nodes);
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(initialSkillGraph.nodes[0]);
  const [evidence, setEvidence] = useState<EvidenceItem[]>(initialEvidence);
  const [projects, setProjects] = useState<CareerProject[]>(initialProjects);
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [people, setPeople] = useState(initialPeople);
  const [team, setTeam] = useState(initialTeamMesh);
  const [careerGoal, setCareerGoal] = useState(initialCareerGoal);
  const [dailyMission, setDailyMission] = useState<DailyMission>(initialDailyMission);

  // Command palette and AI Drawer modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAskDrawerOpen, setIsAskDrawerOpen] = useState(false);
  const [askDrawerInitialPrompt, setAskDrawerInitialPrompt] = useState<string | undefined>();

  // Global keyboard shortcuts (Cmd+K, etc.)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenAskWithPrompt = (prompt: string) => {
    setAskDrawerInitialPrompt(prompt);
    setIsAskDrawerOpen(true);
  };

  const handleAddEvidence = (item: EvidenceItem) => {
    setEvidence((prev) => [item, ...prev]);
    // Boost skill mastery
    setSkills((prev) =>
      prev.map((s) => {
        if (s.name.toLowerCase() === item.skillName.toLowerCase()) {
          const newMastery = Math.min(100, s.masteryPercentage + 6);
          return {
            ...s,
            masteryPercentage: newMastery,
            evidenceCount: s.evidenceCount + 1,
            freshnessScore: 100,
            lastDemonstrated: 'Just now'
          };
        }
        return s;
      })
    );
  };

  const handleSkillLeveledUp = (skillName: string, points: number) => {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.name.toLowerCase() === skillName.toLowerCase()) {
          const newMastery = Math.min(100, s.masteryPercentage + points);
          return {
            ...s,
            masteryPercentage: newMastery,
            freshnessScore: 100,
            lastDemonstrated: 'Today'
          };
        }
        return s;
      })
    );
  };

  const handleImportSkillsFromResume = (newSkills: SkillNode[], candidateSummary: string) => {
    // Merge new skills
    const existingNames = new Set(skills.map((s) => s.name.toLowerCase()));
    const filteredNew = newSkills.filter((s) => !existingNames.has(s.name.toLowerCase()));

    setSkills((prev) => [...filteredNew, ...prev]);
    if (candidateSummary) {
      setUser((prev) => ({
        ...prev,
        bio: candidateSummary,
        skillFitScore: Math.min(100, prev.skillFitScore + 4)
      }));
    }
    setActiveTab('universe');
  };

  const handleAddSkillsFromGitHub = (detected: { skill: string; evidenceStrength: any; reason: string }[]) => {
    detected.forEach((ds) => {
      const newEv: EvidenceItem = {
        id: `ev-gh-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        title: `GitHub AST Proof: ${ds.skill}`,
        skillId: `skill-${ds.skill.toLowerCase().replace(/\s+/g, '-')}`,
        skillName: ds.skill,
        category: ds.evidenceStrength,
        type: 'github_repo',
        source: 'Automated AST Repository Inspector',
        timestamp: new Date().toISOString().split('T')[0],
        aiConfidence: 96,
        explanation: ds.reason,
        isVerified: true
      };
      handleAddEvidence(newEv);
    });
    setActiveTab('evidence');
  };

  const handleUpdateTargetRole = (newRole: string) => {
    setUser((prev) => ({ ...prev, targetRole: newRole }));
    setCareerGoal((prev) => ({ ...prev, targetRole: newRole }));
  };

  return (
    <div className="min-h-screen bg-[#f7f9fd] text-[#1b1b1d] font-sans antialiased relative selection:bg-[#0058bc]/20 selection:text-[#0058bc]">
      {/* Ambient Interactive WebGL Liquid Background Shader */}
      <LiquidBackgroundShader />

      {/* Top Floating Glass Navigation Header */}
      <TopNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectTab={setActiveTab}
        user={user}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenAskAI={() => {
          setAskDrawerInitialPrompt(undefined);
          setIsAskDrawerOpen(true);
        }}
        onOpenAskSkillMesh={() => {
          setAskDrawerInitialPrompt(undefined);
          setIsAskDrawerOpen(true);
        }}
      />

      {/* Main View Container */}
      <main className="pt-20 sm:pt-24 px-2 sm:px-4 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
        {(activeTab === 'home' || activeTab === 'landing') && (
          <LandingHeroView
            onNavigate={setActiveTab}
            skills={skills}
            user={user}
          />
        )}

        {activeTab === 'command' && (
          <CommandCenterDashboard
            user={user}
            skills={skills}
            careerGoal={careerGoal}
            dailyMission={dailyMission}
            evidence={evidence}
            projects={projects}
            opportunities={opportunities}
            people={people}
            team={team}
            onNavigate={setActiveTab}
            onSelectSkill={(skill) => {
              setSelectedSkill(skill);
              setActiveTab('universe');
            }}
            onAskAI={handleOpenAskWithPrompt}
          />
        )}

        {activeTab === 'universe' && (
          <SkillMeshUniverseView
            skills={skills}
            selectedSkill={selectedSkill}
            onSelectSkill={setSelectedSkill}
            onNavigate={setActiveTab}
            user={user}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceVerificationView
            evidence={evidence}
            skills={skills}
            onAddEvidence={handleAddEvidence}
          />
        )}

        {activeTab === 'pathway' && (
          <AdaptivePathwayView
            careerGoal={careerGoal}
            skills={skills}
            user={user}
            onNavigate={setActiveTab}
            onUpdateTargetRole={handleUpdateTargetRole}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsWorkspaceView
            projects={projects}
            skills={skills}
            user={user}
            onUpdateProjects={setProjects}
            onSkillLeveledUp={handleSkillLeveledUp}
          />
        )}

        {activeTab === 'opportunities' && (
          <OpportunitiesView opportunities={opportunities} />
        )}

        {activeTab === 'people' && (
          <PeopleAndInvestorsView people={people} user={user} />
        )}

        {activeTab === 'github' && (
          <GitHubAnalyzerView onAddSkillsFromGitHub={handleAddSkillsFromGitHub} />
        )}

        {activeTab === 'resume' && (
          <ResumeImporterView
            user={user}
            onImportSkills={handleImportSkillsFromResume}
          />
        )}

        {activeTab === 'simulator' && (
          <CareerSimulatorView skills={skills} user={user} />
        )}

        {activeTab === 'team' && (
          <TeamIntelligenceView team={team} user={user} />
        )}

        {activeTab === 'settings' && (
          <SettingsPrivacyView
            user={user}
            skills={skills}
            evidence={evidence}
            onUpdateUser={setUser}
          />
        )}
      </main>

      {/* Floating Micro Dock Navigation */}
      <DockNav activeTab={activeTab} onNavigate={setActiveTab} />

      {/* Global Command Palette (Cmd + K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setActiveTab}
        onSelectSkill={(skill) => {
          setSelectedSkill(skill);
          setActiveTab('universe');
        }}
        skills={skills}
        opportunities={opportunities}
        people={people}
      />

      {/* Global Ask SkillMesh Co-Pilot Drawer */}
      <AskSkillMeshDrawer
        isOpen={isAskDrawerOpen}
        onClose={() => setIsAskDrawerOpen(false)}
        onNavigate={setActiveTab}
        user={user}
        skills={skills}
        careerGoal={careerGoal}
        initialPrompt={askDrawerInitialPrompt}
      />
    </div>
  );
}
