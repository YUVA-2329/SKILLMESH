import React, { useState } from 'react';
import { Sparkles, ArrowRight, UserCheck, Globe, MapPin, Briefcase } from 'lucide-react';
import { PREDEFINED_INDIAN_PROFILES, PREDEFINED_FOREIGN_PROFILES } from '../../data/profilesData';
import { soundEffects } from '../effects/SoundFeedback';
import confetti from 'canvas-confetti';

interface NameLoginModalProps {
  isOpen: boolean;
  onSelectName: (name: string, email?: string) => void;
  currentName?: string;
  onClose?: () => void;
  canDismiss?: boolean;
}

export const NameLoginModal: React.FC<NameLoginModalProps> = ({
  isOpen,
  onSelectName,
  currentName = '',
  onClose,
  canDismiss = false
}) => {
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'indian' | 'foreign'>('indian');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputName.trim();
    if (!trimmed) {
      setError('Please enter your name to proceed.');
      soundEffects.playError();
      return;
    }
    setError('');
    soundEffects.playSuccess();
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } catch {}

    const finalEmail = inputEmail.trim() || `${trimmed.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`;
    onSelectName(trimmed, finalEmail);
  };

  const handlePickPredefined = (name: string, email?: string) => {
    soundEffects.playClick(720);
    setInputName(name);
    if (email) setInputEmail(email);
    setError('');
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } catch {}
    onSelectName(name, email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="glass-pearl rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-white/80 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0058bc] via-[#4a47d2] to-[#6462ec]" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0058bc]/10 text-[#0058bc] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SkillMesh Career OS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1b1b1d] tracking-tight">
              What's your name?
            </h2>
            <p className="text-xs sm:text-sm text-[#5f6368] leading-relaxed">
              Enter your name to load your persistent skill mesh profile or select from the 14 verified demo profiles.
            </p>
          </div>

          {canDismiss && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-black/5 text-[#75777f] text-xs font-semibold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#44474e]">
                Your Full Name
              </label>
              <input
                type="text"
                id="user-name-input"
                autoFocus
                value={inputName}
                onChange={(e) => {
                  setInputName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Alex Kumar, Sarah Patel, or your own name"
                className="w-full px-4 py-3 rounded-2xl bg-white/95 border border-black/15 focus:border-[#0058bc] focus:ring-3 focus:ring-[#0058bc]/15 outline-none text-sm sm:text-base font-semibold text-[#1b1b1d] transition-all shadow-xs"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#44474e]">
                  Account Email (MongoDB Unique Document Key)
                </label>
                <span className="text-[10px] text-emerald-600 font-mono font-bold">1 Account = 1 Document</span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  id="user-email-input"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder={inputName ? `${inputName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com` : "e.g. alex@example.com"}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/95 border border-black/15 focus:border-[#0058bc] focus:ring-3 focus:ring-[#0058bc]/15 outline-none text-xs sm:text-sm font-medium text-[#1b1b1d] transition-all shadow-xs"
                />
                <button
                  type="submit"
                  id="name-submit-btn"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 rounded-xl bg-[#0058bc] hover:bg-[#004899] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-600 font-medium pl-1">{error}</p>
            )}
          </div>
        </form>

        {/* Predefined Profiles Tabbed Selector */}
        <div className="space-y-3 pt-2 border-t border-black/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#44474e] uppercase tracking-wider">
              Or Select Verified Demo Profile
            </span>
            <div className="flex bg-[#eef2fb] p-0.5 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick(600);
                  setSelectedCategory('indian');
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedCategory === 'indian'
                    ? 'bg-white text-[#0058bc] shadow-xs font-bold'
                    : 'text-[#5f6368] hover:text-[#1b1b1d]'
                }`}
              >
                🇮🇳 Indian (7)
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick(640);
                  setSelectedCategory('foreign');
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedCategory === 'foreign'
                    ? 'bg-white text-[#0058bc] shadow-xs font-bold'
                    : 'text-[#5f6368] hover:text-[#1b1b1d]'
                }`}
              >
                🌍 Foreign (7)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
            {(selectedCategory === 'indian' ? PREDEFINED_INDIAN_PROFILES : PREDEFINED_FOREIGN_PROFILES).map((item) => {
              const isCurrent = currentName.toLowerCase() === item.user.name.toLowerCase();
              return (
                <button
                  key={item.user.name}
                  type="button"
                  onClick={() => handlePickPredefined(item.user.name, item.user.email)}
                  className={`p-2.5 rounded-2xl text-left border transition-all flex items-center gap-3 cursor-pointer ${
                    isCurrent
                      ? 'bg-blue-50/80 border-[#0058bc] shadow-xs'
                      : 'bg-white/80 hover:bg-white border-black/10 hover:border-black/20'
                  }`}
                >
                  <img
                    src={item.user.avatar}
                    alt={item.user.name}
                    className="w-10 h-10 rounded-xl object-cover border border-black/10 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <div className="text-xs font-bold text-[#1b1b1d] truncate">
                        {item.user.name}
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] text-[#0058bc] font-bold">Active</span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#5f6368] truncate">
                      {item.user.title || item.user.role}
                    </div>
                    <div className="text-[10px] text-[#75777f] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-blue-500" />
                      <span className="truncate">{item.user.country}</span>
                      <span className="text-black/30">•</span>
                      <span>{item.skills.length} skills</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-2 text-[11px] text-[#717786] text-center flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>MongoDB Atlas: Real document persistence with unique account isolation.</span>
        </div>
      </div>
    </div>
  );
};
