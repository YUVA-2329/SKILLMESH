import React, { useState } from 'react';
import { Lock, Unlock, Key, CheckCircle2, AlertCircle, Save, X, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types';
import { verifyEditPasscode, updateStoredProfile } from '../../lib/storage';
import { soundEffects } from '../effects/SoundFeedback';
import confetti from 'canvas-confetti';

interface EditProfilePasscodeModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onSaveProfile: (updated: UserProfile) => void;
}

export const EditProfilePasscodeModal: React.FC<EditProfilePasscodeModalProps> = ({
  isOpen,
  user,
  onClose,
  onSaveProfile
}) => {
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [name, setName] = useState(user.name);
  const [title, setTitle] = useState(user.title || user.role || '');
  const [country, setCountry] = useState(user.country || '');
  const [organization, setOrganization] = useState(user.organization || '');
  const [industry, setIndustry] = useState(user.industry || '');
  const [experience, setExperience] = useState(user.experience || '');
  const [email, setEmail] = useState(user.email || '');
  const [summary, setSummary] = useState(user.summary || '');

  if (!isOpen) return null;

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyEditPasscode(passcode)) {
      soundEffects.playSuccess();
      setIsUnlocked(true);
      setErrorMessage('');
    } else {
      soundEffects.playError();
      setErrorMessage('Incorrect passcode.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Name cannot be empty.');
      return;
    }

    setIsSaving(true);
    soundEffects.playClick(680);

    const updatedUser: UserProfile = {
      ...user,
      name: name.trim(),
      title: title.trim(),
      role: title.trim() || user.role,
      country: country.trim() || user.country,
      organization: organization.trim() || user.organization,
      industry: industry.trim() || user.industry,
      experience: experience.trim() || user.experience,
      email: email.trim() || user.email,
      summary: summary.trim() || user.summary
    };

    const res = await updateStoredProfile(user.id || user.name, updatedUser);

    setIsSaving(false);
    if (res.success) {
      soundEffects.playLevelUp();
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch {}
      onSaveProfile(res.user);
      onClose();
    } else {
      setErrorMessage(res.error || 'Failed to save changes.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="glass-pearl rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/80 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0058bc] via-[#4a47d2] to-[#6462ec]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-xl hover:bg-black/5 text-[#75777f] text-xs font-semibold cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!isUnlocked ? (
          /* Step 1: Passcode Prompt */
          <div className="space-y-5">
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0058bc] flex items-center justify-center mx-auto shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#1b1b1d] tracking-tight">
                Profile Edit Protection
              </h3>
              <p className="text-xs sm:text-sm text-[#5f6368] max-w-sm mx-auto">
                Enter the system passcode to unlock and edit <span className="font-bold text-[#1b1b1d]">{user.name}'s</span> profile in persistent storage.
              </p>
            </div>

            <form onSubmit={handleVerifyPasscode} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#44474e] block text-center">
                  Passcode Required
                </label>
                <div className="flex justify-center">
                  <input
                    type="password"
                    id="edit-profile-passcode-input"
                    autoFocus
                    maxLength={10}
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Enter Passcode: ____"
                    className="text-center tracking-widest text-lg font-mono font-bold w-64 px-4 py-3 rounded-2xl bg-white/95 border border-black/15 focus:border-[#0058bc] focus:ring-3 focus:ring-[#0058bc]/15 outline-none text-[#1b1b1d] transition-all shadow-xs"
                  />
                </div>
                {errorMessage && (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-rose-600 font-semibold pt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                <div className="text-[11px] text-[#717786] text-center pt-1">
                  Default testing passcode: <span className="font-mono font-bold text-[#0058bc]">0000</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-black/10 bg-white hover:bg-black/5 text-xs font-semibold text-[#44474e] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="verify-passcode-btn"
                  className="flex-1 py-2.5 rounded-xl bg-[#0058bc] hover:bg-[#004899] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Unlock Editor
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Step 2: Edit Profile Form */
          <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <div className="flex items-center gap-2 pb-2 border-b border-black/10">
              <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700">
                <Unlock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#1b1b1d]">
                  Edit Profile
                </h3>
                <p className="text-[11px] text-[#5f6368]">
                  All changes are saved to persistent local & server storage.
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#44474e]">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 text-xs font-medium text-[#1b1b1d] focus:border-[#0058bc] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#44474e]">Professional Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 text-xs font-medium text-[#1b1b1d] focus:border-[#0058bc] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#44474e]">Country / Location</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 text-xs font-medium text-[#1b1b1d] focus:border-[#0058bc] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#44474e]">Organization / Lab</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 text-xs font-medium text-[#1b1b1d] focus:border-[#0058bc] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#44474e]">Experience</label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 text-xs font-medium text-[#1b1b1d] focus:border-[#0058bc] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#44474e]">Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 text-xs font-medium text-[#1b1b1d] focus:border-[#0058bc] outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#44474e]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 text-xs font-medium text-[#1b1b1d] focus:border-[#0058bc] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#44474e]">Bio / Executive Summary</label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 text-xs font-medium text-[#1b1b1d] focus:border-[#0058bc] outline-none resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-black/10 bg-white hover:bg-black/5 text-xs font-semibold text-[#44474e] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="save-profile-btn"
                disabled={isSaving}
                className="flex-1 py-2.5 rounded-xl bg-[#0058bc] hover:bg-[#004899] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save to Persistent Storage'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
