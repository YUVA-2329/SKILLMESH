import { UserProfile, SkillNode, EvidenceItem, CareerProject, CareerGoal } from '../types';
import { ALL_PREDEFINED_PROFILES, ComprehensiveProfile, PREDEFINED_INDIAN_PROFILES, PREDEFINED_FOREIGN_PROFILES } from '../data/profilesData';
import { INITIAL_USER, INITIAL_SKILLS, INITIAL_EVIDENCE, INITIAL_PROJECTS, INITIAL_CAREER_GOAL } from '../data/mockData';
import { 
  setStoredAuthEmail, 
  getStoredAuthEmail, 
  syncMongoLoginOrRegister, 
  persistUserDataToMongo 
} from './mongoClient';

const PROFILES_STORAGE_KEY = 'skillmesh_profiles_v2';
const ACTIVE_PROFILE_ID_KEY = 'skillmesh_active_profile_id_v2';
const IDENTIFIED_NAME_KEY = 'skillmesh_identified_name_v2';

export const EDIT_PROTECTION_PASSCODE = '0000';

/**
 * Verify passcode for editing profiles
 */
export function verifyEditPasscode(passcode: string): boolean {
  return passcode.trim() === EDIT_PROTECTION_PASSCODE;
}

/**
 * Convert predefined profiles to the full initial persistent profile bundle
 */
function buildInitialProfilesMap(): Record<string, ComprehensiveProfile> {
  const map: Record<string, ComprehensiveProfile> = {};

  // Add all predefined Indian and Foreign profiles
  for (const item of ALL_PREDEFINED_PROFILES) {
    const key = item.user.id || `profile-${item.user.name.toLowerCase().replace(/\s+/g, '-')}`;
    map[key] = {
      ...item,
      user: {
        ...item.user,
        id: key
      }
    };
  }

  // Also include initial Alex as an option
  map['profile-alex'] = {
    user: {
      ...INITIAL_USER,
      id: 'profile-alex',
      country: 'United States',
      organization: 'SkillMesh Core Labs',
      experience: '2 Years',
      industry: 'AI Engineering',
      isDemo: true,
      profileType: 'custom'
    },
    skills: INITIAL_SKILLS,
    evidence: INITIAL_EVIDENCE,
    projects: INITIAL_PROJECTS,
    careerGoal: INITIAL_CAREER_GOAL
  };

  return map;
}

/**
 * Synchronous read of all comprehensive profiles from localStorage.
 * Initializes from predefined profiles on first launch.
 */
export function getStoredProfilesBundle(): Record<string, ComprehensiveProfile> {
  if (typeof window === 'undefined') {
    return buildInitialProfilesMap();
  }

  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse profiles from localStorage', err);
  }

  // First time launch: Initialize predefined profiles
  const initialBundle = buildInitialProfilesMap();
  try {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(initialBundle));
  } catch (e) {
    console.warn('Could not write initial profiles to localStorage', e);
  }
  return initialBundle;
}

/**
 * Saves the entire bundle to localStorage and syncs with server
 */
export function saveStoredProfilesBundle(bundle: Record<string, ComprehensiveProfile>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(bundle));
  } catch (err) {
    console.error('Failed to save profiles to localStorage', err);
  }

  // Asynchronously sync with server storage endpoint
  try {
    fetch('/api/storage/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bundle })
    }).catch(() => {
      // Ignore background fetch failure in offline/preview sandbox
    });
  } catch {}
}

/**
 * Get list of all user profiles (for selection / search)
 */
export function getAllUserProfiles(): UserProfile[] {
  const bundle = getStoredProfilesBundle();
  return Object.values(bundle).map(b => b.user);
}

/**
 * Get active profile ID
 */
export function getStoredActiveProfileId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_PROFILE_ID_KEY);
}

/**
 * Set active profile ID
 */
export function setStoredActiveProfileId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_PROFILE_ID_KEY, id);
}

/**
 * Get identified user name
 */
export function getIdentifiedName(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(IDENTIFIED_NAME_KEY);
}

/**
 * Set identified user name
 */
export function setIdentifiedName(name: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(IDENTIFIED_NAME_KEY, name.trim());
}

/**
 * Clear identification (allows re-asking "What's your name?")
 */
export function clearIdentification(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(IDENTIFIED_NAME_KEY);
  localStorage.removeItem(ACTIVE_PROFILE_ID_KEY);
}

/**
 * Get comprehensive profile by ID or by Name
 */
export function getComprehensiveProfile(idOrName: string): ComprehensiveProfile {
  const bundle = getStoredProfilesBundle();

  // Try direct ID lookup
  if (bundle[idOrName]) {
    return bundle[idOrName];
  }

  // Try lookup by user name (case insensitive)
  const normalized = idOrName.trim().toLowerCase();
  const matched = Object.values(bundle).find(
    b => b.user.name.trim().toLowerCase() === normalized || b.user.id?.toLowerCase() === normalized
  );

  if (matched) {
    return matched;
  }

  // Default to first profile (Arjun Mehta)
  const first = Object.values(bundle)[0];
  if (first) return first;

  // Fallback
  return {
    user: INITIAL_USER,
    skills: INITIAL_SKILLS,
    evidence: INITIAL_EVIDENCE,
    projects: INITIAL_PROJECTS,
    careerGoal: INITIAL_CAREER_GOAL
  };
}

/**
 * Selects or creates a profile by Name (for "What's your name?" flow)
 * Connects directly with MongoDB Atlas backend: One Account = One Document
 */
export function identifyUserByName(name: string, customEmail?: string): ComprehensiveProfile {
  const trimmed = name.trim();
  setIdentifiedName(trimmed);

  const bundle = getStoredProfilesBundle();
  const normalized = trimmed.toLowerCase();

  // Check if matches an existing predefined profile
  const existing = Object.values(bundle).find(
    b => b.user.name.toLowerCase() === normalized
  );

  let activeProfile: ComprehensiveProfile;
  let activeId: string;

  if (existing) {
    activeId = existing.user.id || `profile-${existing.user.name.toLowerCase().replace(/\s+/g, '-')}`;
    setStoredActiveProfileId(activeId);
    activeProfile = existing;
  } else {
    // If user entered a custom name that doesn't exist yet, create a customized profile for them
    const newId = `profile-custom-${Date.now()}`;
    const email = customEmail?.trim() || `${trimmed.toLowerCase().replace(/[^a-z0-9]/g, '.')}@skillmesh.network`;
    const newProfile: ComprehensiveProfile = {
      user: {
        ...INITIAL_USER,
        id: newId,
        name: trimmed,
        country: 'Global',
        organization: 'Independent Builder',
        experience: '3+ Years',
        industry: 'Software & AI Systems',
        email,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`,
        summary: `Builder and developer specializing in intelligent software, responsive user interfaces, and neural system architecture.`,
        isDemo: false,
        profileType: 'custom'
      },
      skills: INITIAL_SKILLS,
      evidence: INITIAL_EVIDENCE,
      projects: INITIAL_PROJECTS,
      careerGoal: INITIAL_CAREER_GOAL
    };

    bundle[newId] = newProfile;
    saveStoredProfilesBundle(bundle);
    setStoredActiveProfileId(newId);
    activeId = newId;
    activeProfile = newProfile;
  }

  // Set authenticated email for strict MongoDB account isolation
  const targetEmail = customEmail?.trim() || activeProfile.user.email || `${trimmed.toLowerCase().replace(/[^a-z0-9]/g, '.')}@skillmesh.network`;
  setStoredAuthEmail(targetEmail);

  // Sync / Load with MongoDB Atlas
  syncMongoLoginOrRegister({
    name: activeProfile.user.name,
    email: targetEmail,
    profile: activeProfile.user,
    skills: activeProfile.skills,
    projects: activeProfile.projects,
    connections: [],
    interests: activeProfile.user.interests || []
  }).then(res => {
    if (res && res.document) {
      const currentBundle = getStoredProfilesBundle();
      if (currentBundle[activeId]) {
        if (res.document.skills && res.document.skills.length > 0) {
          currentBundle[activeId].skills = res.document.skills;
        }
        if (res.document.projects && res.document.projects.length > 0) {
          currentBundle[activeId].projects = res.document.projects;
        }
        if (res.document.profile) {
          currentBundle[activeId].user = { ...currentBundle[activeId].user, ...res.document.profile };
        }
        saveStoredProfilesBundle(currentBundle);
      }
    }
  }).catch(() => {
    // Non-blocking
  });

  return activeProfile;
}

/**
 * Save / Update an edited profile in persistent storage.
 * Validates, writes to localStorage, and syncs directly to MongoDB Atlas.
 */
export async function updateStoredProfile(
  profileId: string, 
  updatedUser: Partial<UserProfile>
): Promise<{ success: boolean; user: UserProfile; error?: string }> {
  if (!updatedUser.name || !updatedUser.name.trim()) {
    return { success: false, user: updatedUser as UserProfile, error: 'Name is required.' };
  }

  const bundle = getStoredProfilesBundle();
  const existing = bundle[profileId];

  let targetKey = profileId;
  let currentProfile = existing;

  if (!currentProfile) {
    const foundKey = Object.keys(bundle).find(
      k => bundle[k].user.id === profileId || bundle[k].user.name.toLowerCase() === profileId.toLowerCase()
    );
    if (foundKey) {
      targetKey = foundKey;
      currentProfile = bundle[foundKey];
    } else {
      return { success: false, user: updatedUser as UserProfile, error: 'Profile not found.' };
    }
  }

  const mergedUser: UserProfile = {
    ...currentProfile.user,
    ...updatedUser,
    name: updatedUser.name.trim()
  };

  bundle[targetKey].user = mergedUser;
  saveStoredProfilesBundle(bundle);

  // Sync to backend file storage fallback
  try {
    fetch(`/api/storage/profiles/${encodeURIComponent(targetKey)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: mergedUser })
    }).catch(() => {});
  } catch {}

  // Sync to MongoDB Atlas with account isolation
  const authEmail = mergedUser.email || getStoredAuthEmail();
  if (authEmail) {
    try {
      await persistUserDataToMongo(authEmail, {
        name: mergedUser.name,
        profile: mergedUser
      });
    } catch (e) {
      console.warn('MongoDB sync error:', e);
    }
  }

  return { success: true, user: mergedUser };
}

/**
 * Synchronize full skill mesh, projects, and goals to MongoDB Atlas
 */
export async function syncMeshChangesToMongo(
  userEmail: string,
  skills?: SkillNode[],
  projects?: CareerProject[],
  careerGoal?: CareerGoal
): Promise<void> {
  const email = userEmail || getStoredAuthEmail();
  if (!email) return;

  const payload: Record<string, any> = {};
  if (skills) payload.skills = skills;
  if (projects) payload.projects = projects;
  if (careerGoal) payload.aiRecommendations = { careerGoal };

  try {
    await persistUserDataToMongo(email, payload);
  } catch (err) {
    console.warn('Background mesh sync to MongoDB:', err);
  }
}
