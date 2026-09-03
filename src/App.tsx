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
import { NameLoginModal } from './components/modals/NameLoginModal';
import { EditProfilePasscodeModal } from './components/modals/EditProfilePasscodeModal';
import { 
  getStoredProfilesBundle, 
  getIdentifiedName, 
  getStoredActiveProfileId, 
  getComprehensiveProfile, 
  identifyUserByName 
} from './lib/storage';
import {
  fetchCurrentUserFromMongo,
  syncMongoLoginOrRegister,
  persistUserDataToMongo,
  getStoredAuthEmail,
  setStoredAuthEmail,
  getStoredAuthId
} from './lib/mongoClient';
import { DockNav } from './components/effects/DockNav';
import { SkillMeshIntroShader } from './components/effects/SkillMeshIntroShader';

// Views
import { HomeSimpleView } from './components/views/HomeSimpleView';
import { MySkillsSimpleView } from './components/views/MySkillsSimpleView';
import { AICopilotView } from './components/views/AICopilotView';
import { LearnPersonalizedView } from './components/views/LearnPersonalizedView';
import { SkillPassportView } from './components/views/SkillPassportView';
import { LandingHeroView } from './components/views/LandingHeroView';
import { CommandCenterDashboard } from './components/views/CommandCenterDashboard';
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
import { MongoInspectorButton } from './components/mongodb/MongoInspectorButton';

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
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isPlayingIntro, setIsPlayingIntro] = useState(true);
  const [pendingNameModal, setPendingNameModal] = useState(false);

  // Persistent profile loading on mount (restores from MongoDB or local fallback)
  useEffect(() => {
    // 1. Try to restore active user session from MongoDB Atlas first
    fetchCurrentUserFromMongo().then((res) => {
      if (res.success && res.document) {
        const doc = res.document;
        const restoredUser: UserProfile = {
          ...initialUserProfile,
          ...(doc.profile || {}),
          id: doc.authId || `user-${doc._id}`,
          name: doc.name || initialUserProfile.name,
          email: doc.email || initialUserProfile.email
        };
        setUser(restoredUser);
        if (doc.skills && Array.isArray(doc.skills) && doc.skills.length > 0) {
          setSkills(doc.skills);
          setSelectedSkill(doc.skills[0]);
        }
        if (doc.projects && Array.isArray(doc.projects) && doc.projects.length > 0) {
          setProjects(doc.projects);
        }
        setIsPlayingIntro(false);
        return;
      }

      // 2. Fallback to local profile cache
      const activeId = getStoredActiveProfileId();
      const activeName = getIdentifiedName();
      if (activeId || activeName) {
        const prof = getComprehensiveProfile(activeId || activeName || 'Arjun Mehta');
        setUser(prof.user);
        setSkills(prof.skills);
        setEvidence(prof.evidence);
        setProjects(prof.projects);
        setCareerGoal(prof.careerGoal);
      } else {
        // First application launch: initialize persistent predefined profiles & prompt name after intro
        getStoredProfilesBundle();
        setPendingNameModal(true);
      }
    });
  }, []);

  const handleIntroComplete = () => {
    setIsPlayingIntro(false);
    if (pendingNameModal) {
      setIsNameModalOpen(true);
      setPendingNameModal(false);
    }
  };

  const handleSelectName = async (name: string, email?: string) => {
    const targetEmail = (email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`).trim().toLowerCase();
    
    // Call MongoDB Atlas registration/login (One Account = One Document)
    const res = await syncMongoLoginOrRegister({
      name,
      email: targetEmail,
      profile: {
        bio: '',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        location: 'Global',
        education: 'Computer Science',
        experience: '3+ Years'
      },
      skills: skills,
      projects: projects,
      connections: [],
      interests: []
    });

    if (res.success && res.document) {
      const doc = res.document;
      const mappedUser: UserProfile = {
        ...initialUserProfile,
        ...(doc.profile || {}),
        id: doc.authId || `user-${doc._id}`,
        name: doc.name || name,
        email: doc.email || targetEmail
      };
      setUser(mappedUser);
      if (doc.skills && Array.isArray(doc.skills) && doc.skills.length > 0) {
        setSkills(doc.skills);
        setSelectedSkill(doc.skills[0]);
      }
      if (doc.projects && Array.isArray(doc.projects) && doc.projects.length > 0) {
        setProjects(doc.projects);
      }
    } else {
      const prof = identifyUserByName(name, targetEmail);
      setUser(prof.user);
      setSkills(prof.skills);
      setEvidence(prof.evidence);
      setProjects(prof.projects);
      setCareerGoal(prof.careerGoal);
    }
    setIsNameModalOpen(false);
  };

  const handleSaveProfile = async (updatedUser: UserProfile) => {
    setUser(updatedUser);
    const identifier = updatedUser.email || getStoredAuthEmail();
    if (identifier) {
      await persistUserDataToMongo(identifier, {
        name: updatedUser.name,
        profile: {
          bio: updatedUser.summary,
          avatar: updatedUser.avatar,
          location: updatedUser.country,
          experience: updatedUser.experience,
          title: updatedUser.title || updatedUser.role
        }
      });
    }
  };
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
    setActiveTab('skills');
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
      {/* 2-Second Premium 3D Shader Intro Animation */}
      {isPlayingIntro && (
        <SkillMeshIntroShader
          onComplete={handleIntroComplete}
          onSkip={handleIntroComplete}
          autoCloseDelay={450}
        />
      )}

      {/* Ambient Interactive WebGL Liquid Background Shader */}
      <LiquidBackgroundShader />

      {/* Top Floating Glass Navigation Header */}
      <TopNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectTab={setActiveTab}
        user={user}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenIdentityModal={() => setIsNameModalOpen(true)}
        onOpenEditProfileModal={() => setIsEditProfileModalOpen(true)}
        onPlayIntro={() => setIsPlayingIntro(true)}
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
        {activeTab === 'home' && (
          <HomeSimpleView
            user={user}
            skills={skills}
            onNavigate={setActiveTab}
            onOpenAskAI={handleOpenAskWithPrompt}
            onUpdateGoal={handleUpdateTargetRole}
          />
        )}

        {activeTab === 'landing' && (
          <LandingHeroView
            onNavigate={setActiveTab}
            skills={skills}
            user={user}
          />
        )}

        {activeTab === 'skills' && (
          <MySkillsSimpleView
            skills={skills}
            user={user}
            onNavigate={setActiveTab}
            onSelectSkillForGraph={(skill) => {
              setSelectedSkill(skill);
              setActiveTab('skills');
            }}
            onAddSkill={(newSkill) => {
              setSkills((prev) => [newSkill, ...prev]);
            }}
          />
        )}

        {activeTab === 'ai' && (
          <AICopilotView
            user={user}
            skills={skills}
            onNavigate={setActiveTab}
            initialPrompt={askDrawerInitialPrompt}
          />
        )}

        {activeTab === 'learn' && (
          <LearnPersonalizedView
            user={user}
            skills={skills}
            onNavigate={setActiveTab}
            onSkillLeveledUp={handleSkillLeveledUp}
          />
        )}

        {activeTab === 'passport' && (
          <SkillPassportView
            user={user}
            skills={skills}
            evidence={evidence}
            onNavigate={setActiveTab}
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
              setActiveTab('skills');
            }}
            onAskAI={handleOpenAskWithPrompt}
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
          setActiveTab('skills');
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

      {/* Name-Only Login & Profile Selector Modal */}
      <NameLoginModal
        isOpen={isNameModalOpen}
        currentName={user.name}
        canDismiss={!!getIdentifiedName() || !!getStoredActiveProfileId()}
        onClose={() => setIsNameModalOpen(false)}
        onSelectName={handleSelectName}
      />

      {/* Passcode-Protected Edit Profile Modal (Code: 0000) */}
      <EditProfilePasscodeModal
        isOpen={isEditProfileModalOpen}
        user={user}
        onClose={() => setIsEditProfileModalOpen(false)}
        onSaveProfile={handleSaveProfile}
      />

      {/* MongoDB Atlas Live Database Inspector & Status Button (Bottom-Right) */}
      <MongoInspectorButton
        currentUser={user}
        skillsCount={skills.length}
        projectsCount={projects.length}
        connectionsCount={team.connectionsCount || 28}
        onSwitchAccount={handleSelectName}
        onRefresh={() => {
          const activeId = getStoredActiveProfileId();
          const activeName = getIdentifiedName();
          if (activeId || activeName) {
            const prof = getComprehensiveProfile(activeId || activeName || 'Arjun Mehta');
            setUser(prof.user);
            setSkills(prof.skills);
            setEvidence(prof.evidence);
            setProjects(prof.projects);
            setCareerGoal(prof.careerGoal);
          }
        }}
      />
    </div>
  );
}
