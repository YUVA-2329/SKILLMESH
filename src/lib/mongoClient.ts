/**
 * MongoDB Atlas Frontend Client & Synchronization Helper
 * Securely communicates with server-side /api/users and /api/mongodb/* endpoints.
 * Never stores or exposes MongoDB credentials in client JavaScript.
 */

export interface MongoConnectionStatus {
  configured: boolean;
  connected: boolean;
  status: 'connected' | 'connecting' | 'disconnected';
  dbName: string;
  collection: string;
  documentCount: number;
  error: string | null;
  serverTime: string;
}

export interface MongoAccountSummary {
  authId: string;
  name: string;
  email: string;
  updatedAt: string;
}

export interface MongoRawDocResponse {
  success: boolean;
  connected: boolean;
  dbName: string;
  collection: string;
  document: Record<string, any> | null;
  error?: string | null;
  timestamp: string;
}

const AUTH_ID_STORAGE_KEY = 'skillmesh_auth_id_v3';
const AUTH_EMAIL_STORAGE_KEY = 'skillmesh_auth_email_v3';
let lastSyncTimestamp: Date = new Date();

/**
 * Get the currently stored authId token
 */
export function getStoredAuthId(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(AUTH_ID_STORAGE_KEY) || '';
}

/**
 * Store the unique authId token
 */
export function setStoredAuthId(authId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_ID_STORAGE_KEY, authId.trim());
}

/**
 * Get the currently authenticated email for MongoDB isolation
 */
export function getStoredAuthEmail(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(AUTH_EMAIL_STORAGE_KEY) || '';
}

/**
 * Store the authenticated email for MongoDB isolation
 */
export function setStoredAuthEmail(email: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_EMAIL_STORAGE_KEY, email.trim().toLowerCase());
}

/**
 * Clear stored auth credentials on logout
 */
export function clearStoredAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_ID_STORAGE_KEY);
  localStorage.removeItem(AUTH_EMAIL_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_ID_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_EMAIL_STORAGE_KEY);
}

/**
 * Helper to get authorization headers for backend requests
 */
function getAuthHeaders(): Record<string, string> {
  const authId = getStoredAuthId();
  const email = getStoredAuthEmail();
  const headers: Record<string, string> = {
    'Accept': 'application/json'
  };
  if (authId) {
    headers['Authorization'] = `Bearer ${authId}`;
    headers['x-auth-id'] = authId;
  }
  if (email) {
    headers['x-user-email'] = email;
  }
  return headers;
}

/**
 * Check live MongoDB Atlas connection status
 */
export async function checkMongoStatus(): Promise<MongoConnectionStatus> {
  try {
    const res = await fetch('/api/mongodb/status', {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      configured: false,
      connected: false,
      status: 'disconnected',
      dbName: 'skillmesh',
      collection: 'users',
      documentCount: 0,
      error: err.message || 'Failed to reach server MongoDB endpoint',
      serverTime: new Date().toISOString()
    };
  }
}

/**
 * Fetch accounts summaries for account switching / verification
 */
export async function fetchMongoAccounts(): Promise<MongoAccountSummary[]> {
  try {
    const res = await fetch('/api/mongodb/accounts');
    if (!res.ok) return [];
    const data = await res.json();
    return data.accounts || [];
  } catch {
    return [];
  }
}

/**
 * Fetch the authenticated user's profile from MongoDB: GET /api/users/me
 * Restores the user session upon browser refresh
 */
export async function fetchCurrentUserFromMongo(): Promise<{
  success: boolean;
  savedToMongo: boolean;
  authId?: string;
  user?: any;
  document?: any;
  error?: string;
}> {
  const authId = getStoredAuthId();
  const email = getStoredAuthEmail();

  if (!authId && !email) {
    return { success: false, savedToMongo: false, error: 'No active session' };
  }

  try {
    const res = await fetch('/api/users/me', {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      return { success: false, savedToMongo: false, error: err.error || 'User not found' };
    }

    const data = await res.json();
    if (data.authId) setStoredAuthId(data.authId);
    if (data.user?.email) setStoredAuthEmail(data.user.email);
    lastSyncTimestamp = new Date();

    return data;
  } catch (err: any) {
    return { success: false, savedToMongo: false, error: err.message };
  }
}

/**
 * Fetch raw MongoDB document for the current user (for Inspector view)
 */
export async function fetchCurrentMongoRawDocument(userIdentifier?: string): Promise<MongoRawDocResponse> {
  const identifier = (userIdentifier || getStoredAuthId() || getStoredAuthEmail()).trim();
  if (!identifier) {
    return {
      success: false,
      connected: false,
      dbName: 'skillmesh',
      collection: 'users',
      document: null,
      error: 'No active authenticated user found.',
      timestamp: new Date().toISOString()
    };
  }

  try {
    const res = await fetch(`/api/mongodb/user/raw-document?email=${encodeURIComponent(identifier)}`, {
      headers: {
        ...getAuthHeaders(),
        'x-user-email': identifier
      }
    });
    const data = await res.json();
    lastSyncTimestamp = new Date();
    return data;
  } catch (err: any) {
    return {
      success: false,
      connected: false,
      dbName: 'skillmesh',
      collection: 'users',
      document: null,
      error: err.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Authenticate or register an account in MongoDB: POST /api/users
 * (ONE ACCOUNT = ONE MONGODB DOCUMENT)
 */
export async function syncMongoLoginOrRegister(params: {
  name: string;
  email: string;
  authId?: string;
  profile?: any;
  skills?: any[];
  projects?: any[];
  connections?: any[];
  interests?: any[];
  recommendations?: any[];
  savedOpportunities?: any[];
  aiRecommendations?: any;
}): Promise<{ success: boolean; isNew: boolean; savedToMongo: boolean; authId?: string; user?: any; document: any; error?: string }> {
  try {
    const email = params.email.trim().toLowerCase();
    setStoredAuthEmail(email);

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        ...params,
        email
      })
    });

    const data = await res.json();
    if (data.authId) {
      setStoredAuthId(data.authId);
    }
    lastSyncTimestamp = new Date();

    // Trigger sync event for MongoDB inspector
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('skillmesh:mongodb:sync', { 
        detail: { savedToMongo: data.savedToMongo, email, authId: data.authId } 
      }));

      // Show "Saved to MongoDB ✓" feedback
      if (data.savedToMongo) {
        window.dispatchEvent(new CustomEvent('skillmesh:toast', {
          detail: { message: 'Saved to MongoDB ✓', type: 'success' }
        }));
      }
    }

    return data;
  } catch (err: any) {
    console.error('MongoDB login/register sync error:', err);
    return {
      success: false,
      isNew: false,
      savedToMongo: false,
      document: null,
      error: err.message
    };
  }
}

/**
 * Persist user profile and mesh data changes directly to MongoDB: PATCH /api/users/me
 */
export async function persistUserDataToMongo(
  emailOrAuthId: string, 
  updates: Record<string, any>
): Promise<{ success: boolean; savedToMongo: boolean; authId?: string; user?: any; document?: any; error?: string }> {
  try {
    const res = await fetch('/api/users/me', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(updates)
    });

    const data = await res.json();
    lastSyncTimestamp = new Date();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('skillmesh:mongodb:sync', { 
        detail: { savedToMongo: data.savedToMongo, email: emailOrAuthId } 
      }));

      if (data.savedToMongo) {
        window.dispatchEvent(new CustomEvent('skillmesh:toast', {
          detail: { message: 'Saved to MongoDB ✓', type: 'success' }
        }));
      }
    }

    return data;
  } catch (err: any) {
    console.error('Failed to persist user data to MongoDB:', err);
    return { success: false, savedToMongo: false, error: err.message };
  }
}

/**
 * Returns formatted time elapsed since last sync
 */
export function getLastSyncTimeText(): string {
  const diffSec = Math.floor((Date.now() - lastSyncTimestamp.getTime()) / 1000);
  if (diffSec < 5) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  return lastSyncTimestamp.toLocaleTimeString();
}
