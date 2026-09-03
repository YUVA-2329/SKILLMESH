import { 
  SkillNode, 
  EvidenceItem, 
  CareerProject, 
  CareerGoal, 
  DailyMission, 
  OpportunityItem, 
  PersonProfile, 
  TeamMesh, 
  UserProfile 
} from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Kishore Yuva',
  role: 'Evolution Lead',
  intelligenceLevel: 4,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  email: 'kishore@skillmesh.network',
  targetRole: 'AI Engineer',
  skillFitScore: 82,
  verifiedArtifactsCount: 14,
  activeMissionsCount: 3,
  summary: 'Senior full-stack & AI practitioner specializing in production RAG systems, distributed vector architectures, and high-performance neural web experiences.',
  githubConnected: true,
  githubUsername: 'kishore-yuva',
  resumeUploaded: true,
  privacy: {
    profileVisibility: 'public',
    skillMeshVisibility: 'public',
    evidenceVisibility: 'public',
    enableInvestorDiscovery: true,
    enableCofounderDiscovery: true
  }
};

export const INITIAL_SKILLS: SkillNode[] = [
  {
    id: 'skill-python',
    name: 'Python',
    category: 'Languages',
    description: 'Expert-level proficiency in asynchronous Python 3.12+, meta-programming, performance profiling, and backend orchestration.',
    masteryPercentage: 87,
    level: 'Expert',
    confidence: 96,
    freshnessScore: 98,
    lastDemonstrated: '2 days ago',
    evidenceCount: 12,
    verifiedCertsCount: 2,
    status: 'mastered',
    isCoreCompetency: true,
    position3D: [0, 0.4, 0],
    prerequisites: ['Computer Science Fundamentals'],
    leadsTo: ['FastAPI', 'PyTorch', 'RAG Architectures', 'MLOps'],
    relatedSkills: ['FastAPI', 'PyTorch', 'Data Pipeline V2', 'PostgreSQL'],
    connectedArtifacts: [
      { id: 'art-1', title: 'Data Pipeline V2', type: 'code', updatedAt: '2 days ago', url: 'https://github.com/skillmesh/data-pipeline-v2' },
      { id: 'art-2', title: 'NLP Classifier Model', type: 'model', updatedAt: '1 week ago', url: 'https://github.com/skillmesh/nlp-classifier' },
      { id: 'art-3', title: 'Async Worker Queue', type: 'code', updatedAt: '3 weeks ago' }
    ],
    evidenceIds: ['ev-1', 'ev-2', 'ev-3']
  },
  {
    id: 'skill-rag',
    name: 'RAG Architectures',
    category: 'AI & ML',
    description: 'Design and deployment of hybrid lexical-dense vector search, reranking pipelines, chunking heuristics, and context compression.',
    masteryPercentage: 79,
    level: 'Advanced',
    confidence: 92,
    freshnessScore: 95,
    lastDemonstrated: 'Yesterday',
    evidenceCount: 8,
    verifiedCertsCount: 1,
    status: 'developing',
    isCoreCompetency: true,
    position3D: [1.8, 0.9, 0.5],
    prerequisites: ['Python', 'Vector Databases', 'Embeddings'],
    leadsTo: ['Autonomous Agents', 'Context Engineering'],
    relatedSkills: ['Vector Databases', 'Python', 'FastAPI', 'LLM Agents'],
    connectedArtifacts: [
      { id: 'art-rag-1', title: 'Hybrid RAG Knowledge Engine', type: 'deployment', updatedAt: 'Yesterday', url: 'https://rag-demo.skillmesh.network' },
      { id: 'art-rag-2', title: 'Context Window Optimizer', type: 'code', updatedAt: '5 days ago' }
    ],
    evidenceIds: ['ev-4', 'ev-5']
  },
  {
    id: 'skill-vector-db',
    name: 'Vector Databases',
    category: 'Data & Vector',
    description: 'HNSW indexing, IVFFlat partitioning, Qdrant/Milvus clusters, and sub-10ms similarity search queries.',
    masteryPercentage: 74,
    level: 'Advanced',
    confidence: 88,
    freshnessScore: 90,
    lastDemonstrated: '4 days ago',
    evidenceCount: 6,
    verifiedCertsCount: 1,
    status: 'developing',
    isCoreCompetency: false,
    position3D: [1.2, -1.1, -0.6],
    prerequisites: ['Linear Algebra', 'PostgreSQL'],
    leadsTo: ['RAG Architectures', 'Semantic Caching'],
    relatedSkills: ['PostgreSQL', 'RAG Architectures', 'Redis'],
    connectedArtifacts: [
      { id: 'art-vdb-1', title: 'Vector Benchmark Suite', type: 'code', updatedAt: '4 days ago' }
    ],
    evidenceIds: ['ev-6']
  },
  {
    id: 'skill-fastapi',
    name: 'FastAPI',
    category: 'Backend',
    description: 'High-throughput async ASGI REST microservices, Pydantic v2 schemas, background tasks, and OpenAPI specs.',
    masteryPercentage: 85,
    level: 'Expert',
    confidence: 94,
    freshnessScore: 92,
    lastDemonstrated: '3 days ago',
    evidenceCount: 9,
    verifiedCertsCount: 1,
    status: 'mastered',
    isCoreCompetency: true,
    position3D: [-1.4, 0.6, -0.4],
    prerequisites: ['Python', 'HTTP Protocols'],
    leadsTo: ['Distributed Systems', 'API Gateways'],
    relatedSkills: ['Python', 'Docker', 'PostgreSQL'],
    connectedArtifacts: [
      { id: 'art-api-1', title: 'Microservice Cluster', type: 'code', updatedAt: '3 days ago' }
    ],
    evidenceIds: ['ev-7']
  },
  {
    id: 'skill-docker',
    name: 'Docker & Containers',
    category: 'Cloud & DevOps',
    description: 'Multi-stage builds, non-root security contexts, layer optimization, and containerized GPU runtime environments.',
    masteryPercentage: 81,
    level: 'Advanced',
    confidence: 90,
    freshnessScore: 89,
    lastDemonstrated: '1 week ago',
    evidenceCount: 7,
    verifiedCertsCount: 2,
    status: 'mastered',
    isCoreCompetency: false,
    position3D: [-1.6, -1.2, 0.8],
    prerequisites: ['Linux Kernel Basics'],
    leadsTo: ['Kubernetes', 'MLOps'],
    relatedSkills: ['Kubernetes', 'FastAPI', 'MLOps'],
    connectedArtifacts: [
      { id: 'art-doc-1', title: 'Production Docker Compose', type: 'deployment', updatedAt: '1 week ago' }
    ],
    evidenceIds: ['ev-8']
  },
  {
    id: 'skill-mlops',
    name: 'MLOps & Deployment',
    category: 'Cloud & DevOps',
    description: 'CI/CD model evaluation pipelines, canary rollouts, drift detection, Prometheus metrics, and Triton inference servers.',
    masteryPercentage: 62,
    level: 'Intermediate',
    confidence: 76,
    freshnessScore: 78,
    lastDemonstrated: '2 weeks ago',
    evidenceCount: 3,
    verifiedCertsCount: 0,
    status: 'gap',
    isCoreCompetency: true,
    position3D: [2.2, -0.4, 1.2],
    prerequisites: ['Docker & Containers', 'Python', 'FastAPI'],
    leadsTo: ['Autonomous AI Platforms'],
    relatedSkills: ['Docker & Containers', 'RAG Architectures', 'Kubernetes'],
    connectedArtifacts: [
      { id: 'art-mlops-1', title: 'Model Monitor Scaffold', type: 'code', updatedAt: '2 weeks ago' }
    ],
    evidenceIds: ['ev-9']
  },
  {
    id: 'skill-react-ts',
    name: 'React & TypeScript',
    category: 'Frontend',
    description: 'Component architecture, custom hooks, WebGL bindings, strict typing, Tailwind CSS, and state orchestration.',
    masteryPercentage: 90,
    level: 'Master',
    confidence: 97,
    freshnessScore: 99,
    lastDemonstrated: 'Today',
    evidenceCount: 16,
    verifiedCertsCount: 3,
    status: 'mastered',
    isCoreCompetency: true,
    position3D: [-0.6, 1.8, -0.7],
    prerequisites: ['JavaScript ES6+', 'HTML/CSS'],
    leadsTo: ['Spatial Web Interfaces', 'Three.js & Shaders'],
    relatedSkills: ['Three.js & WebGL', 'TypeScript', 'Tailwind CSS'],
    connectedArtifacts: [
      { id: 'art-fe-1', title: 'SkillMesh Liquid UI System', type: 'deployment', updatedAt: 'Today' },
      { id: 'art-fe-2', title: 'Neural Graph Visualizer', type: 'code', updatedAt: 'Yesterday' }
    ],
    evidenceIds: ['ev-10', 'ev-11']
  },
  {
    id: 'skill-threejs',
    name: 'Three.js & WebGL',
    category: 'Frontend',
    description: 'GLSL custom fragment/vertex shaders, buffer geometries, particle halo instancing, and GPU lighting pipelines.',
    masteryPercentage: 84,
    level: 'Advanced',
    confidence: 91,
    freshnessScore: 96,
    lastDemonstrated: 'Today',
    evidenceCount: 6,
    verifiedCertsCount: 1,
    status: 'mastered',
    isCoreCompetency: false,
    position3D: [0.8, 1.9, 0.9],
    prerequisites: ['React & TypeScript', 'Linear Algebra'],
    leadsTo: ['Spatial Computing', 'WebXR'],
    relatedSkills: ['React & TypeScript', 'Shaders & GLSL'],
    connectedArtifacts: [
      { id: 'art-3d-1', title: 'Liquid Pearl Shader Engine', type: 'code', updatedAt: 'Today' }
    ],
    evidenceIds: ['ev-12']
  },
  {
    id: 'skill-postgres',
    name: 'PostgreSQL & pgvector',
    category: 'Data & Vector',
    description: 'Relational query optimization, indexing strategies, CTEs, ACID transactions, and pgvector semantic searches.',
    masteryPercentage: 86,
    level: 'Expert',
    confidence: 93,
    freshnessScore: 91,
    lastDemonstrated: '3 days ago',
    evidenceCount: 9,
    verifiedCertsCount: 1,
    status: 'mastered',
    isCoreCompetency: false,
    position3D: [-0.4, -1.6, -0.8],
    prerequisites: ['Relational Database Theory'],
    leadsTo: ['Distributed Vector Databases'],
    relatedSkills: ['Vector Databases', 'Python', 'FastAPI'],
    connectedArtifacts: [
      { id: 'art-db-1', title: 'Production Analytics Schema', type: 'code', updatedAt: '3 days ago' }
    ],
    evidenceIds: ['ev-13']
  }
];

export const INITIAL_EVIDENCE: EvidenceItem[] = [
  {
    id: 'ev-1',
    title: 'High-Throughput Data Pipeline (V2)',
    skillId: 'skill-python',
    skillName: 'Python',
    category: 'STRONG',
    type: 'github_repo',
    source: 'github.com/skillmesh/data-pipeline-v2',
    sourceUrl: 'https://github.com/skillmesh/data-pipeline-v2',
    timestamp: '2026-08-31',
    aiConfidence: 96,
    explanation: 'Contains 18,400+ lines of typed Python 3.12 code, 94% test coverage using pytest-asyncio, CI/CD pipeline, and active production usage processing 1.2M records/day.',
    metrics: { stars: 142, testCoverage: '94%', commits: 88, linesOfCode: 18450 },
    isVerified: true
  },
  {
    id: 'ev-2',
    title: 'PyTorch NLP Classifier in Production',
    skillId: 'skill-python',
    skillName: 'Python',
    category: 'STRONG',
    type: 'deployment',
    source: 'Deployed on AWS ECS Cluster',
    timestamp: '2026-08-25',
    aiConfidence: 94,
    explanation: 'Verified deployed model serving endpoint with Prometheus latency telemetry under 45ms P99 across 200k daily requests.',
    metrics: { usersServed: '200k/day' },
    isVerified: true
  },
  {
    id: 'ev-3',
    title: 'Meta Certified Python Professional',
    skillId: 'skill-python',
    skillName: 'Python',
    category: 'MEDIUM',
    type: 'certification',
    source: 'Meta / Coursera Verified Credential #META-PY-8821',
    timestamp: '2025-11-14',
    aiConfidence: 92,
    explanation: 'Cryptographically verified certificate issued by Meta covering OOP, algorithmic data structures, and database connectivity.',
    isVerified: true
  },
  {
    id: 'ev-4',
    title: 'Live Enterprise RAG Knowledge Base',
    skillId: 'skill-rag',
    skillName: 'RAG Architectures',
    category: 'STRONG',
    type: 'deployment',
    source: 'Live at rag-demo.skillmesh.network',
    sourceUrl: 'https://rag-demo.skillmesh.network',
    timestamp: '2026-09-01',
    aiConfidence: 95,
    explanation: 'Demonstrates end-to-end multi-document ingestion, dynamic reranking with FlashRank, citation generation, and hallucination reduction guards.',
    metrics: { usersServed: '12,000+ queries' },
    isVerified: true
  },
  {
    id: 'ev-5',
    title: 'Open Source Contribution to LangChain / LlamaIndex',
    skillId: 'skill-rag',
    skillName: 'RAG Architectures',
    category: 'STRONG',
    type: 'oss_contribution',
    source: 'PR #14289 merged into langchain-core',
    timestamp: '2026-07-19',
    aiConfidence: 98,
    explanation: 'Merged upstream pull request optimizing vector store retrieval batching and async token streaming for Gemini & OpenAI providers.',
    isVerified: true
  },
  {
    id: 'ev-6',
    title: 'Qdrant & pgvector Hybrid Benchmark',
    skillId: 'skill-vector-db',
    skillName: 'Vector Databases',
    category: 'MEDIUM',
    type: 'project',
    source: 'github.com/skillmesh/vector-benchmark',
    timestamp: '2026-08-28',
    aiConfidence: 89,
    explanation: 'Reproducible benchmark harness comparing recall, index construction time, and memory overhead across 1M OpenAI text-embedding-3-small vectors.',
    metrics: { stars: 39, linesOfCode: 3200 },
    isVerified: true
  },
  {
    id: 'ev-7',
    title: 'Core API Gateway in FastAPI',
    skillId: 'skill-fastapi',
    skillName: 'FastAPI',
    category: 'STRONG',
    type: 'github_repo',
    source: 'github.com/skillmesh/api-gateway',
    timestamp: '2026-08-30',
    aiConfidence: 94,
    explanation: 'Multi-tenant API gateway handling authentication, rate limiting, and reverse proxying with structured Pydantic schemas and zero validation errors.',
    metrics: { testCoverage: '91%', commits: 64 },
    isVerified: true
  },
  {
    id: 'ev-8',
    title: 'Docker Certified Associate',
    skillId: 'skill-docker',
    skillName: 'Docker & Containers',
    category: 'MEDIUM',
    type: 'certification',
    source: 'Mirantis / Docker DCA #88129',
    timestamp: '2025-09-10',
    aiConfidence: 91,
    explanation: 'Verified industry certification demonstrating mastery of Docker orchestration, storage volumes, network bridging, and security.',
    isVerified: true
  },
  {
    id: 'ev-9',
    title: 'Initial Model Serving Pipeline',
    skillId: 'skill-mlops',
    skillName: 'MLOps & Deployment',
    category: 'WEAK',
    type: 'self_claim',
    source: 'Self-declared Resume Claim',
    timestamp: '2026-06-15',
    aiConfidence: 58,
    explanation: 'Claimed experience deploying automated retraining triggers. Lacks direct CI/CD logs or production cluster verification. Needs tangible deployment artifact to upgrade to STRONG.',
    isVerified: false
  },
  {
    id: 'ev-10',
    title: 'SkillMesh Liquid Interface System',
    skillId: 'skill-react-ts',
    skillName: 'React & TypeScript',
    category: 'STRONG',
    type: 'deployment',
    source: 'Production Web Application',
    timestamp: '2026-09-02',
    aiConfidence: 99,
    explanation: 'Architected high-density modern React 19 application with full TypeScript safety, Motion layout transitions, and Liquid Glass design tokens.',
    metrics: { linesOfCode: 24500, testCoverage: '96%' },
    isVerified: true
  },
  {
    id: 'ev-11',
    title: 'TypeScript Design Patterns',
    skillId: 'skill-react-ts',
    skillName: 'React & TypeScript',
    category: 'MEDIUM',
    type: 'certification',
    source: 'Frontend Masters Certification',
    timestamp: '2025-12-01',
    aiConfidence: 90,
    explanation: 'Completed advanced generic typing, conditional types, and template literal type programming course modules.',
    isVerified: true
  }
];

export const INITIAL_CAREER_GOAL: CareerGoal = {
  id: 'goal-ai-engineer',
  title: 'AI Engineer',
  fitScore: 82,
  currentSkills: ['Python', 'FastAPI', 'React & TypeScript', 'PostgreSQL & pgvector', 'Docker & Containers', 'RAG Architectures', 'Vector Databases'],
  missingSkills: ['Triton / TensorRT-LLM', 'Distributed Training (vLLM)', 'Automated Drift Monitoring'],
  weakSkills: ['MLOps & Deployment (62%)'],
  criticalSkills: ['RAG Architectures', 'MLOps & Deployment', 'Vector Databases', 'Python'],
  salaryRange: '$175,000 - $240,000',
  demandTrend: '+48% YoY',
  growthRate: 'Extreme',
  roadmapSteps: [
    {
      title: 'Advanced Data Structures & Async Python',
      description: 'Master asynchronous worker queues, event-loop concurrency, and zero-copy memory buffers.',
      skills: ['Python', 'FastAPI'],
      timeline: 'COMPLETED • Q2 2025',
      status: 'completed',
      reason: 'Foundation required for building scalable inference gateways.',
      effort: '60 hrs'
    },
    {
      title: 'Deploy Production RAG Application',
      description: 'Deploy end-to-end containerized RAG pipeline with vector indexing, semantic caching, and live evaluation.',
      skills: ['RAG Architectures', 'Vector Databases', 'Docker & Containers'],
      timeline: 'ACTIVE FOCUS • Q3 2026',
      status: 'active',
      reason: 'Validates MLOps and infrastructure competencies to close the primary gap for target profile.',
      effort: '25 hrs'
    },
    {
      title: 'System Architecture & Distributed Inference',
      description: 'Benchmark vLLM / TensorRT throughput, set up Prometheus monitoring, and implement auto-scaling clusters.',
      skills: ['MLOps & Deployment', 'Distributed Systems'],
      timeline: 'PROJECTED • Q4 2026',
      status: 'projected',
      reason: 'Unlocks top-percentile AI Systems Engineer opportunities.',
      effort: '40 hrs'
    }
  ]
};

export const INITIAL_DAILY_MISSION: DailyMission = {
  id: 'mission-react-hooks',
  title: 'Master React Hooks & Context',
  description: 'Complete the advanced context API module to reinforce your frontend node connections and state propagation.',
  category: 'Frontend Nodes',
  targetSkill: 'React & TypeScript',
  timeRemaining: '12:45 LEFT',
  durationMinutes: 25,
  isCompleted: false,
  xpReward: 150
};

export const INITIAL_PROJECTS: CareerProject[] = [
  {
    id: 'proj-1',
    title: 'Production RAG Knowledge Assistant',
    tagline: 'Bridging the critical gap to your target AI Engineer profile.',
    problemStatement: 'Modern enterprises struggle to query internal knowledge bases accurately without context hallucination or sluggish latency.',
    goal: 'Build and deploy a scalable RAG assistant with pgvector, dynamic reranking, and sub-second streaming answers.',
    skillsDeveloped: ['RAG Architectures', 'Vector Databases', 'FastAPI', 'MLOps & Deployment'],
    difficulty: 'Advanced',
    estimatedTime: '12 - 18 hours',
    techStack: ['Python', 'FastAPI', 'pgvector', 'Gemini 3.7', 'Docker'],
    milestones: [
      { id: 'm1', title: 'Document Chunking & Embeddings Engine', description: 'Implement semantic chunking with overlap and embedding caching.', isCompleted: true, provesSkill: 'Vector Databases' },
      { id: 'm2', title: 'Hybrid Lexical + Vector Retrieval', description: 'Build BM25 + dense vector ranking with reciprocal rank fusion (RRF).', isCompleted: true, provesSkill: 'RAG Architectures' },
      { id: 'm3', title: 'Containerized Deployment & Metrics', description: 'Deploy Docker image with health checks and latency logging.', isCompleted: false, provesSkill: 'MLOps & Deployment' },
      { id: 'm4', title: 'Live Streaming UI & Verification', description: 'Connect React SSE stream and submit live URL for AI evidence verification.', isCompleted: false, provesSkill: 'React & TypeScript' }
    ],
    expectedEvidence: 'STRONG: Live deployed URL + GitHub repository with automated test suite.',
    portfolioValue: 'High Impact: Direct proof required by AI infrastructure teams at top tech firms.',
    status: 'in_progress',
    repoUrl: 'https://github.com/skillmesh/rag-knowledge-engine',
    liveUrl: 'https://rag-demo.skillmesh.network'
  },
  {
    id: 'proj-2',
    title: 'Distributed Model Inference Gateway',
    tagline: 'High-throughput LLM proxy with load-shedding and semantic token cache.',
    problemStatement: 'LLM API costs and rate limits bottleneck multi-agent applications without caching identical semantic intents.',
    goal: 'Construct a Rust or Python async proxy with Redis semantic cache and automatic failover across cloud providers.',
    skillsDeveloped: ['Distributed Systems', 'Redis', 'Python', 'AI Security'],
    difficulty: 'Elite',
    estimatedTime: '20 - 25 hours',
    techStack: ['Python', 'Redis', 'Docker', 'Prometheus'],
    milestones: [
      { id: 'p2-m1', title: 'Embedding-based Intent Cache', description: 'Cosine similarity matching for prompt deduplication (>95% threshold).', isCompleted: false, provesSkill: 'Redis' },
      { id: 'p2-m2', title: 'Dynamic Load Balancer', description: 'Route requests across multi-region endpoints based on token latency.', isCompleted: false, provesSkill: 'Distributed Systems' }
    ],
    expectedEvidence: 'STRONG: Benchmark whitepaper + GitHub repo with 50,000 req/min stress test.',
    portfolioValue: 'Elite: Demonstrates system-level cost optimization and reliability architecture.',
    status: 'suggested'
  }
];

export const INITIAL_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 'opp-1',
    title: 'Senior AI Engineer, Platform Intelligence',
    type: 'Job',
    organization: 'Google DeepMind',
    location: 'Mountain View, CA (Hybrid)',
    matchScore: 94,
    matchingSkills: ['Python', 'RAG Architectures', 'Vector Databases', 'FastAPI'],
    missingSkills: ['Distributed Model Training'],
    whyItMatches: 'Your verified evidence in Python (87%) and live RAG deployment match 94% of this role’s core platform requirements.',
    compensationOrPrize: '$210,000 - $265,000 + Equity',
    deadline: 'Rolling',
    freshness: 'Posted 2 days ago',
    source: 'Verified Careers Portal'
  },
  {
    id: 'opp-2',
    title: 'Autonomous Systems Research Fellowship',
    type: 'Research',
    organization: 'Stanford AI Lab / HAI',
    location: 'Palo Alto, CA / Remote',
    matchScore: 88,
    matchingSkills: ['Python', 'PyTorch', 'Vector Databases'],
    missingSkills: ['Reinforcement Learning from AI Feedback'],
    whyItMatches: 'Strong fit for your neural graph & embedding benchmarking projects.',
    compensationOrPrize: '$95,000 Research Grant',
    deadline: 'Oct 15, 2026',
    freshness: 'New',
    source: 'Academic Intelligence Feed'
  },
  {
    id: 'opp-3',
    title: 'Global AI Agent Grand Hackathon 2026',
    type: 'Hackathon',
    organization: 'Google AI Studio & Antigravity',
    location: 'Global Virtual',
    matchScore: 96,
    matchingSkills: ['React & TypeScript', 'Python', 'Three.js & WebGL', 'FastAPI'],
    missingSkills: [],
    whyItMatches: '100% skill overlap across front-end spatial systems and backend Gemini tool-calling integrations.',
    compensationOrPrize: '$250,000 Prize Pool',
    deadline: 'In 14 days',
    freshness: 'Live Now',
    source: 'Antigravity Hackathon Feed'
  },
  {
    id: 'opp-4',
    title: 'Y Combinator W27 Batch Acceleration',
    type: 'Accelerator',
    organization: 'Y Combinator',
    location: 'San Francisco, CA',
    matchScore: 91,
    matchingSkills: ['React & TypeScript', 'Python', 'RAG Architectures'],
    missingSkills: ['B2B Enterprise Sales'],
    whyItMatches: 'Matches your current cybersecurity / AI infrastructure startup project readiness.',
    compensationOrPrize: '$500,000 Investment',
    deadline: 'Nov 01, 2026',
    freshness: 'Applications Open',
    source: 'Verified Public Accelerator Registry'
  }
];

export const INITIAL_PEOPLE: PersonProfile[] = [
  {
    id: 'person-1',
    name: 'Roelof Botha',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    role: 'investor',
    title: 'Managing Partner',
    organization: 'Sequoia Capital',
    location: 'Menlo Park, CA',
    matchScore: 95,
    thesisOrBio: 'Leading investments in foundational AI infrastructure, developer tooling, and applied intelligence platforms.',
    stage: 'Seed to Series A',
    sector: 'AI Systems & Developer Infrastructure',
    portfolioRelevance: 'Led early rounds in OpenAI, LangChain, Linear',
    complementarySkills: ['Capital Strategy', 'Global Distribution', 'Board Governance'],
    sharedInterests: ['Vector Search', 'AI Developer Tooling', 'Spatial Computing'],
    whyMatched: 'Your project “Production RAG Knowledge Engine” aligns directly with Sequoia’s Q3 2026 AI Infrastructure investment thesis.',
    publicSource: 'Sequoia Capital Public Portfolio & Investment Manifesto (sequoiacap.com)',
    verified: true,
    connectionStatus: 'none'
  },
  {
    id: 'person-2',
    name: 'Sarah Guo',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    role: 'investor',
    title: 'Founder & General Partner',
    organization: 'Conviction',
    location: 'San Francisco, CA',
    matchScore: 93,
    thesisOrBio: 'First-check native AI investment firm backing technical founders building "Software 3.0" and intelligent workflows.',
    stage: 'Pre-Seed & Seed ($1M - $3M)',
    sector: 'AI-Native Applications & MLOps',
    portfolioRelevance: 'Early backer of Mistral, Harvey, Braintrust',
    complementarySkills: ['Product Strategy', 'Go-To-Market', 'Talent Magnet'],
    sharedInterests: ['Context Engines', 'AI Native Career Graphs', 'LLM Infrastructure'],
    whyMatched: 'Conviction publicly funds developer-founded AI primitives with proven code artifacts.',
    publicSource: 'Conviction Fund Public Theses (conviction.com)',
    verified: true,
    connectionStatus: 'none'
  },
  {
    id: 'person-3',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    role: 'cofounder',
    title: 'Ex-Stripe Head of Growth / Technical Marketer',
    organization: 'Angel Investor & Operator',
    location: 'New York, NY',
    matchScore: 94,
    thesisOrBio: 'Built growth engines scaling from 0 to $20M ARR. Looking to partner with a world-class AI/ML engineer to cofound an enterprise AI workflow platform.',
    complementarySkills: ['Enterprise Sales', 'B2B Growth', 'Product Marketing', 'Fundraising'],
    sharedInterests: ['AI Tooling', 'Developer Experience', 'Career Intelligence'],
    whyMatched: 'Complementary Match: You have 95th-percentile AI Engineering depth; Elena brings proven enterprise B2B sales and growth expertise.',
    publicSource: 'Verified Founder Network & Track Record',
    verified: true,
    connectionStatus: 'none'
  },
  {
    id: 'person-4',
    name: 'Dr. Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    role: 'mentor',
    title: 'Staff AI Systems Architect',
    organization: 'DeepMind Core Infrastructure',
    location: 'London, UK / Remote',
    matchScore: 91,
    thesisOrBio: 'Mentoring top engineers transitioning into distributed LLM inference and GPU memory optimization.',
    complementarySkills: ['vLLM Internals', 'CUDA Optimization', 'Career Architecture'],
    sharedInterests: ['RAG Benchmarking', 'Latency Reduction', 'System Design'],
    whyMatched: 'Has guided 18 senior engineers to Staff AI roles at premier AI research labs.',
    publicSource: 'SkillMesh Verified Mentor Guild',
    verified: true,
    connectionStatus: 'connected'
  }
];

export const INITIAL_TEAM: TeamMesh = {
  id: 'team-antigravity',
  name: 'Nexus Intelligence Core',
  description: 'AI & Spatial Platform R&D Team building the next-gen career graph engine.',
  members: [
    {
      id: 'tm-1',
      name: 'Kishore Yuva',
      role: 'Evolution Lead & AI Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      topSkills: ['Python (87%)', 'React & TS (90%)', 'RAG (79%)']
    },
    {
      id: 'tm-2',
      name: 'Dr. Liam Chen',
      role: 'Lead ML Researcher',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      topSkills: ['PyTorch (94%)', 'CUDA (86%)', 'Model Distillation (88%)']
    },
    {
      id: 'tm-3',
      name: 'Aria Stirling',
      role: 'Spatial Systems Designer',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=150&q=80',
      topSkills: ['Three.js (92%)', 'Liquid UX (95%)', 'Shader Math (88%)']
    }
  ],
  aggregateSkills: [
    { skill: 'AI & ML Engineering', coverage: 92, memberNames: ['Kishore Yuva', 'Dr. Liam Chen'] },
    { skill: 'Spatial Frontend Systems', coverage: 93, memberNames: ['Kishore Yuva', 'Aria Stirling'] },
    { skill: 'Data & Vector Infrastructure', coverage: 85, memberNames: ['Kishore Yuva', 'Dr. Liam Chen'] },
    { skill: 'Product Go-To-Market & Enterprise Sales', coverage: 24, memberNames: [] }
  ],
  missingCapabilities: ['Enterprise B2B Sales', 'Product Growth Strategy', 'SOC-2 Compliance Architecture'],
  criticalGaps: ['Go-to-Market Leadership', 'Product Marketing'],
  aiRecommendation: 'Your team possesses elite tier AI architecture and spatial WebGL frontend capability (92%+ coverage), but critically lacks product marketing and enterprise B2B sales execution (24% coverage). Match with growth cofounder profile to balance launch readiness.'
};

// Aliases
export const initialUserProfile = INITIAL_USER;
export const initialSkillGraph = {
  nodes: INITIAL_SKILLS,
  links: []
};
export const initialCareerGoal = INITIAL_CAREER_GOAL;
export const initialEvidence = INITIAL_EVIDENCE;
export const initialProjects = INITIAL_PROJECTS;
export const initialOpportunities = INITIAL_OPPORTUNITIES;
export const initialPeople = INITIAL_PEOPLE;
export const initialTeamMesh = INITIAL_TEAM;
export const initialDailyMission = INITIAL_DAILY_MISSION;

