import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import crypto from 'crypto';

export interface MongoUserProfile {
  bio?: string;
  avatar?: string;
  location?: string;
  education?: string;
  experience?: string;
  country?: string;
  organization?: string;
  title?: string;
  role?: string;
  industry?: string;
  summary?: string;
  targetRole?: string;
  skillFitScore?: number;
  intelligenceLevel?: number;
  privacy?: {
    profileVisibility?: string;
    skillMeshVisibility?: string;
    evidenceVisibility?: string;
    enableInvestorDiscovery?: boolean;
    enableCofounderDiscovery?: boolean;
  };
}

export interface MongoUserDocument {
  _id?: any;
  authId: string;
  name: string;
  email: string;
  profile: MongoUserProfile;
  skills: any[];
  projects: any[];
  connections: any[];
  interests: any[];
  recommendations: any[];
  savedOpportunities?: any[];
  aiRecommendations?: any;
  createdAt: string;
  updatedAt: string;
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let lastConnectionAttempt = 0;
let lastError: string | null = null;

export function getDatabaseName(): string {
  return process.env.MONGODB_DB || process.env.MONGODB_DB_NAME || 'skillmesh';
}

/**
 * Connects or returns existing MongoDB client connection
 */
export async function getMongoDb(): Promise<{ db: Db | null; client: MongoClient | null; error: string | null }> {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    return { 
      db: null, 
      client: null, 
      error: 'MONGODB_URI environment variable is not configured.' 
    };
  }

  const dbName = getDatabaseName();

  // Reuse active connection if healthy
  if (cachedClient && cachedDb) {
    try {
      await cachedDb.command({ ping: 1 });
      return { db: cachedDb, client: cachedClient, error: null };
    } catch (e) {
      console.warn('Cached MongoDB connection stale, reconnecting...');
      cachedClient = null;
      cachedDb = null;
    }
  }

  // Throttle rapid reconnect failures (at least 2s apart)
  const now = Date.now();
  if (now - lastConnectionAttempt < 2000 && lastError) {
    return { db: null, client: null, error: lastError };
  }
  lastConnectionAttempt = now;

  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 6000,
      maxPoolSize: 10
    });

    await client.connect();
    const db = client.db(dbName);
    
    // Test connection with ping
    await db.command({ ping: 1 });

    // Ensure unique index on authId and email in 'users' collection
    try {
      await db.collection('users').createIndex({ authId: 1 }, { unique: true });
    } catch (indexErr) {
      // Non-fatal if index already exists
    }

    try {
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
    } catch (indexErr) {
      // Non-fatal if index already exists
    }

    cachedClient = client;
    cachedDb = db;
    lastError = null;
    console.log(`[MongoDB] Successfully connected to Atlas database "${dbName}"`);

    return { db, client, error: null };
  } catch (err: any) {
    console.error('[MongoDB] Connection error:', err.message);
    lastError = err.message || 'Failed to connect to MongoDB Atlas';
    cachedClient = null;
    cachedDb = null;
    return { db: null, client: null, error: lastError };
  }
}

/**
 * Returns the current MongoDB status, document count, and connection health
 */
export async function getMongoStatus(): Promise<{
  configured: boolean;
  connected: boolean;
  status: 'connected' | 'connecting' | 'disconnected';
  dbName: string;
  collection: string;
  documentCount: number;
  error: string | null;
  serverTime: string;
}> {
  const uri = process.env.MONGODB_URI?.trim();
  const configured = !!uri;
  const dbName = getDatabaseName();

  if (!configured) {
    return {
      configured: false,
      connected: false,
      status: 'disconnected',
      dbName,
      collection: 'users',
      documentCount: 0,
      error: 'MONGODB_URI is not set in environment variables.',
      serverTime: new Date().toISOString()
    };
  }

  const { db, error } = await getMongoDb();
  if (!db) {
    return {
      configured: true,
      connected: false,
      status: 'disconnected',
      dbName,
      collection: 'users',
      documentCount: 0,
      error: error || 'Failed to connect to MongoDB cluster.',
      serverTime: new Date().toISOString()
    };
  }

  try {
    const count = await db.collection('users').countDocuments();
    return {
      configured: true,
      connected: true,
      status: 'connected',
      dbName,
      collection: 'users',
      documentCount: count,
      error: null,
      serverTime: new Date().toISOString()
    };
  } catch (err: any) {
    return {
      configured: true,
      connected: false,
      status: 'disconnected',
      dbName,
      collection: 'users',
      documentCount: 0,
      error: err.message,
      serverTime: new Date().toISOString()
    };
  }
}

/**
 * Finds a single user document by unique authId
 */
export async function findUserDocumentByAuthId(authId: string): Promise<MongoUserDocument | null> {
  const { db } = await getMongoDb();
  if (!db) return null;

  const doc = await db.collection('users').findOne({ authId: authId.trim() });
  return doc as unknown as MongoUserDocument | null;
}

/**
 * Finds a single user document by unique email
 */
export async function findUserDocumentByEmail(email: string): Promise<MongoUserDocument | null> {
  const { db } = await getMongoDb();
  if (!db) return null;

  const normalized = email.trim().toLowerCase();
  const doc = await db.collection('users').findOne({ email: normalized });
  return doc as unknown as MongoUserDocument | null;
}

/**
 * Finds a single user document by authId OR email
 */
export async function findUserDocument(identifier: string): Promise<MongoUserDocument | null> {
  const { db } = await getMongoDb();
  if (!db) return null;

  const trimmed = identifier.trim();
  const normalizedEmail = trimmed.toLowerCase();
  const doc = await db.collection('users').findOne({
    $or: [
      { authId: trimmed },
      { email: normalizedEmail }
    ]
  });
  return doc as unknown as MongoUserDocument | null;
}

/**
 * Generates a stable, unique authentication ID
 */
export function generateAuthId(email: string): string {
  const hash = crypto.createHash('sha256').update(email.trim().toLowerCase() + '-' + Date.now()).digest('hex').substring(0, 12);
  return `auth_${hash}`;
}

/**
 * Creates a brand new MongoDB document for a user in the 'users' collection
 * Enforces: One Account = One Document
 */
export async function createUserDocument(userPayload: {
  authId?: string;
  name: string;
  email: string;
  profile?: Partial<MongoUserProfile>;
  skills?: any[];
  projects?: any[];
  connections?: any[];
  interests?: any[];
  recommendations?: any[];
  savedOpportunities?: any[];
  aiRecommendations?: any;
}): Promise<{ document: MongoUserDocument; inserted: boolean }> {
  const { db, error } = await getMongoDb();
  if (!db) {
    throw new Error(error || 'MongoDB is not connected');
  }

  const normalizedEmail = userPayload.email.trim().toLowerCase();
  const now = new Date().toISOString();

  // Check if existing document already exists to avoid duplicate or overwriting
  const existing = await db.collection('users').findOne({
    $or: [
      ...(userPayload.authId ? [{ authId: userPayload.authId }] : []),
      { email: normalizedEmail }
    ]
  });

  if (existing) {
    return { document: existing as unknown as MongoUserDocument, inserted: false };
  }

  const assignedAuthId = userPayload.authId?.trim() || generateAuthId(normalizedEmail);

  const newDoc: MongoUserDocument = {
    authId: assignedAuthId,
    name: userPayload.name.trim(),
    email: normalizedEmail,
    profile: {
      bio: userPayload.profile?.bio || userPayload.profile?.summary || '',
      avatar: userPayload.profile?.avatar || '',
      location: userPayload.profile?.location || userPayload.profile?.country || '',
      education: userPayload.profile?.education || '',
      experience: userPayload.profile?.experience || '',
      country: userPayload.profile?.country || '',
      organization: userPayload.profile?.organization || '',
      title: userPayload.profile?.title || userPayload.profile?.role || 'Engineer & Builder',
      role: userPayload.profile?.role || userPayload.profile?.title || 'Engineer & Builder',
      industry: userPayload.profile?.industry || 'Software & AI Systems',
      summary: userPayload.profile?.summary || userPayload.profile?.bio || '',
      targetRole: userPayload.profile?.targetRole || 'AI Engineer',
      skillFitScore: userPayload.profile?.skillFitScore ?? 85,
      intelligenceLevel: userPayload.profile?.intelligenceLevel ?? 78,
      privacy: userPayload.profile?.privacy || {
        profileVisibility: 'public',
        skillMeshVisibility: 'public',
        evidenceVisibility: 'public',
        enableInvestorDiscovery: true,
        enableCofounderDiscovery: true
      }
    },
    skills: userPayload.skills || [],
    projects: userPayload.projects || [],
    connections: userPayload.connections || [],
    interests: userPayload.interests || [],
    recommendations: userPayload.recommendations || [],
    savedOpportunities: userPayload.savedOpportunities || [],
    aiRecommendations: userPayload.aiRecommendations || null,
    createdAt: now,
    updatedAt: now
  };

  const result = await db.collection('users').insertOne(newDoc as any);
  newDoc._id = result.insertedId;

  return { document: newDoc, inserted: true };
}

/**
 * Updates an existing user document in the 'users' collection
 */
export async function updateUserDocument(
  identifier: string,
  updates: {
    name?: string;
    profile?: Partial<MongoUserProfile>;
    skills?: any[];
    projects?: any[];
    connections?: any[];
    interests?: any[];
    recommendations?: any[];
    savedOpportunities?: any[];
    aiRecommendations?: any;
  }
): Promise<MongoUserDocument | null> {
  const { db, error } = await getMongoDb();
  if (!db) {
    throw new Error(error || 'MongoDB is not connected');
  }

  const trimmed = identifier.trim();
  const normalizedEmail = trimmed.toLowerCase();
  const now = new Date().toISOString();

  // Construct MongoDB atomic $set object
  const setPayload: Record<string, any> = {
    updatedAt: now
  };

  if (updates.name) setPayload.name = updates.name.trim();
  if (updates.skills !== undefined) setPayload.skills = updates.skills;
  if (updates.projects !== undefined) setPayload.projects = updates.projects;
  if (updates.connections !== undefined) setPayload.connections = updates.connections;
  if (updates.interests !== undefined) setPayload.interests = updates.interests;
  if (updates.recommendations !== undefined) setPayload.recommendations = updates.recommendations;
  if (updates.savedOpportunities !== undefined) setPayload.savedOpportunities = updates.savedOpportunities;
  if (updates.aiRecommendations !== undefined) setPayload.aiRecommendations = updates.aiRecommendations;

  // Flatten profile sub-fields to preserve untouched fields
  if (updates.profile) {
    for (const [key, val] of Object.entries(updates.profile)) {
      if (val !== undefined) {
        setPayload[`profile.${key}`] = val;
      }
    }
  }

  const filter = {
    $or: [
      { authId: trimmed },
      { email: normalizedEmail }
    ]
  };

  const result = await db.collection('users').findOneAndUpdate(
    filter,
    { $set: setPayload },
    { returnDocument: 'after' }
  );

  return (result as unknown as MongoUserDocument) || null;
}

/**
 * Lists all user summaries for inspector account switcher / verification
 */
export async function listAllUserSummaries(): Promise<Array<{ authId: string; name: string; email: string; updatedAt: string }>> {
  const { db } = await getMongoDb();
  if (!db) return [];

  const users = await db.collection('users')
    .find({}, { projection: { authId: 1, name: 1, email: 1, updatedAt: 1 } })
    .limit(20)
    .toArray();

  return users.map(u => ({
    authId: u.authId || u._id?.toString() || '',
    name: u.name || 'Anonymous',
    email: u.email || '',
    updatedAt: u.updatedAt || ''
  }));
}
