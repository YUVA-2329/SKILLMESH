export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';
export type EvidenceStrength = 'STRONG' | 'MEDIUM' | 'WEAK';
export type EvidenceType = 'github_repo' | 'deployment' | 'oss_contribution' | 'work_experience' | 'certification' | 'competition' | 'project' | 'self_claim';
export type ProjectDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
export type OpportunityType = 'Job' | 'Internship' | 'Hackathon' | 'Grant' | 'Accelerator' | 'Research' | 'Freelance' | 'Competition';
export type PersonRole = 'investor' | 'mentor' | 'cofounder' | 'recruiter' | 'engineer' | 'researcher' | 'designer';

export interface ConnectedArtifact {
  id: string;
  title: string;
  type: 'code' | 'model' | 'paper' | 'certificate' | 'deployment';
  updatedAt: string;
  url?: string;
}

export interface SkillNode {
  id: string;
  name: string;
  category: 'Languages' | 'AI & ML' | 'Backend' | 'Frontend' | 'Cloud & DevOps' | 'Architecture' | 'Data & Vector';
  description: string;
  masteryPercentage: number;
  level: SkillLevel;
  confidence: number;
  freshnessScore: number;
  lastDemonstrated: string;
  evidenceCount: number;
  verifiedCertsCount: number;
  status: 'mastered' | 'developing' | 'gap' | 'planned';
  isCoreCompetency: boolean;
  position3D?: [number, number, number];
  prerequisites: string[];
  leadsTo: string[];
  relatedSkills: string[];
  connectedArtifacts: ConnectedArtifact[];
  evidenceIds: string[];
}

export interface EvidenceItem {
  id: string;
  title: string;
  skillId: string;
  skillName: string;
  category: EvidenceStrength;
  type: EvidenceType;
  source: string;
  sourceUrl?: string;
  timestamp: string;
  aiConfidence: number;
  explanation: string;
  metrics?: {
    stars?: number;
    testCoverage?: string;
    commits?: number;
    linesOfCode?: number;
    usersServed?: string;
  };
  isVerified: boolean;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  provesSkill: string;
}

export interface CareerProject {
  id: string;
  title: string;
  tagline: string;
  problemStatement: string;
  goal: string;
  skillsDeveloped: string[];
  difficulty: ProjectDifficulty;
  estimatedTime: string;
  techStack: string[];
  milestones: ProjectMilestone[];
  expectedEvidence: string;
  portfolioValue: string;
  status: 'suggested' | 'in_progress' | 'completed' | 'submitted';
  repoUrl?: string;
  liveUrl?: string;
  aiFeedback?: string;
}

export interface CareerGoal {
  id: string;
  title: string;
  fitScore: number;
  currentSkills: string[];
  missingSkills: string[];
  weakSkills: string[];
  criticalSkills: string[];
  salaryRange: string;
  demandTrend: string;
  growthRate: string;
  roadmapSteps: {
    title: string;
    description: string;
    skills: string[];
    timeline: string;
    status: 'completed' | 'active' | 'projected';
    reason: string;
    effort: string;
  }[];
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  category: string;
  targetSkill: string;
  timeRemaining: string;
  durationMinutes: number;
  isCompleted: boolean;
  xpReward: number;
}

export interface OpportunityItem {
  id: string;
  title: string;
  type: OpportunityType;
  organization: string;
  logo?: string;
  location: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  whyItMatches: string;
  compensationOrPrize: string;
  deadline: string;
  freshness: string;
  source: string;
  url?: string;
}

export interface PersonProfile {
  id: string;
  name: string;
  avatar: string;
  role: PersonRole;
  title: string;
  organization: string;
  location: string;
  matchScore: number;
  thesisOrBio: string;
  stage?: string;
  sector?: string;
  portfolioRelevance?: string;
  complementarySkills: string[];
  sharedInterests: string[];
  whyMatched: string;
  publicSource: string;
  verified: boolean;
  connectionStatus: 'none' | 'pending' | 'connected';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  topSkills: string[];
}

export interface TeamMesh {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  aggregateSkills: { skill: string; coverage: number; memberNames: string[] }[];
  missingCapabilities: string[];
  criticalGaps: string[];
  aiRecommendation: string;
}

export interface GitHubRepoAnalysis {
  repoName: string;
  description: string;
  stars: number;
  forks: number;
  primaryLanguage: string;
  languages: { name: string; percentage: number }[];
  frameworks: string[];
  architectureSummary: string;
  testCoverageEstimate: string;
  ciCdDetected: boolean;
  codeQualityRating: 'A+' | 'A' | 'B' | 'C';
  detectedSkills: { skill: string; evidenceStrength: EvidenceStrength; reason: string }[];
}

export interface UserProfile {
  id?: string;
  name: string;
  title?: string;
  country?: string;
  role: string;
  organization?: string;
  experience?: string;
  industry?: string;
  intelligenceLevel: number;
  avatar: string;
  email: string;
  targetRole: string;
  skillFitScore: number;
  verifiedArtifactsCount: number;
  activeMissionsCount: number;
  summary: string;
  githubConnected: boolean;
  githubUsername?: string;
  resumeUploaded: boolean;
  primarySkills?: string[];
  secondarySkills?: string[];
  strongestSkills?: string[];
  emergingSkills?: string[];
  skillGaps?: string[];
  recommendedSkills?: string[];
  suggestedLearningPaths?: string[];
  interests?: string[];
  investmentInterests?: string[];
  projectInterests?: string[];
  preferredDomains?: string[];
  matchingOpportunities?: string[];
  skillsDemonstratedCount?: number;
  projectsCompletedCount?: number;
  verificationLevel?: string;
  isDemo?: boolean;
  profileType?: 'indian' | 'foreign_investor' | 'custom';
  privacy: {
    profileVisibility: 'public' | 'connections' | 'private';
    skillMeshVisibility: 'public' | 'connections' | 'private';
    evidenceVisibility: 'public' | 'connections' | 'private';
    enableInvestorDiscovery: boolean;
    enableCofounderDiscovery: boolean;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionSuggestions?: { label: string; actionType: string; payload?: any }[];
}

export type ActiveTab = 
  | 'home'
  | 'landing' 
  | 'skills'
  | 'ai'
  | 'projects' 
  | 'learn'
  | 'opportunities' 
  | 'passport'
  | 'command' 
  | 'evidence' 
  | 'pathway' 
  | 'people' 
  | 'team' 
  | 'github' 
  | 'resume' 
  | 'simulator' 
  | 'profile' 
  | 'settings';
