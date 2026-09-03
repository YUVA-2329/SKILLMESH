import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Layers, 
  Compass, 
  ShieldCheck, 
  FolderGit2, 
  Briefcase, 
  Award, 
  BookOpen, 
  Bot, 
  ChevronDown, 
  GitBranch, 
  TrendingUp, 
  Github, 
  FileText, 
  Users, 
  Shield, 
  UserCheck
} from 'lucide-react';
import { ActiveTab, UserProfile } from '../../types';
import { SoundToggle } from '../effects/SoundToggle';
import { soundEffects } from '../effects/SoundFeedback';
import { ShinyText } from '../effects/ShinyText';

interface TopNavBarProps {
  activeTab: ActiveTab;
  setActiveTab?: (tab: ActiveTab) => void;
  onSelectTab?: (tab: ActiveTab) => void;
  user: UserProfile;
  onOpenAskAI?: () => void;
  onOpenAskSkillMesh?: () => void;
  onOpenCommandPalette: () => void;
  onOpenIdentityModal?: () => void;
  onOpenEditProfileModal?: () => void;
  onPlayIntro?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  setActiveTab,
  onSelectTab,
  user,
  onOpenAskAI,
  onOpenAskSkillMesh,
  onOpenCommandPalette,
  onOpenIdentityModal,
  onOpenEditProfileModal,
  onPlayIntro
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const rawNav = onSelectTab || setActiveTab || (() => {});
  const handleNav = (tab: ActiveTab) => {
    soundEffects.playClick(680);
    rawNav(tab);
    setIsMoreMenuOpen(false);
  };
  const handleAsk = () => {
    soundEffects.playChime();
    const action = onOpenAskSkillMesh || onOpenAskAI || (() => {});
    action();
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Sparkles className="w-3.5 h-3.5 text-[#0058bc]" /> },
    { id: 'skills', label: 'My Skills', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'ai', label: 'AI', icon: <Bot className="w-3.5 h-3.5" /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-3.5 h-3.5" /> },
    { id: 'learn', label: 'Learn', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'opportunities', label: 'Opportunities', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'passport', label: 'Passport', icon: <ShieldCheck className="w-3.5 h-3.5" /> }
  ];

  const secondaryItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'command', label: 'Command Cockpit', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'evidence', label: 'Evidence Ledger', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'pathway', label: 'Career Pathway', icon: <GitBranch className="w-3.5 h-3.5" /> },
    { id: 'simulator', label: 'Market Simulator', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'github', label: 'GitHub AI Analysis', icon: <Github className="w-3.5 h-3.5" /> },
    { id: 'resume', label: 'Resume Parser', icon: <FileText className="w-3.5 h-3.5" /> }
  ];

  return (
    <header className="sticky top-3 z-40 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="glass-pearl rounded-2xl px-3 sm:px-4 py-2.5 flex items-center justify-between shadow-sm border border-white/60">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
          id="brand-logo-btn"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0058bc] via-[#4a47d2] to-[#6462ec] flex items-center justify-center text-white shadow-md shadow-[#4a47d2]/20 group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-black text-sm tracking-wide text-[#1b1b1d] flex items-center gap-1.5 font-display">
              <span className="bg-gradient-to-r from-[#1b1b1d] via-[#0058bc] to-[#4a47d2] bg-clip-text text-transparent group-hover:opacity-90">
                SKILLMESH
              </span>
              <span className="text-[10px] uppercase font-black tracking-widest text-[#0058bc] bg-[#0058bc]/10 px-1.5 py-0.5 rounded-md font-tech">
                OS
              </span>
            </div>
            <div className="text-[10px] text-[#717786] font-semibold hidden sm:block tracking-tight">Living Career Intelligence</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#f4f2f7] p-1 rounded-xl border border-black/5 relative">
          {navItems.map((item) => {
            const isActive = activeTab === item.id || (item.id === 'home' && activeTab === 'landing');
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => handleNav(item.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer font-heading ${
                  isActive 
                    ? 'bg-white text-[#0058bc] shadow-sm font-black' 
                    : 'text-[#44474e] hover:text-[#1b1b1d] hover:bg-white/60 font-bold'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* More Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="px-2 py-1.5 rounded-lg text-xs font-semibold text-[#44474e] hover:text-[#1b1b1d] hover:bg-white/60 flex items-center gap-1 cursor-pointer"
            >
              <span>More</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isMoreMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-black/10 py-1.5 z-50 animate-fade-in">
                {secondaryItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-[#1b1b1d] hover:bg-[#f0f4fd] hover:text-[#0058bc] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
                
                <div className="border-t border-black/5 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onOpenIdentityModal?.();
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-[#0058bc] hover:bg-blue-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-[#0058bc]" />
                    <span>Switch Profile / Name</span>
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  </button>

                  {onPlayIntro && (
                    <button
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        onPlayIntro();
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-[#1b1b1d] hover:bg-[#f0f4fd] hover:text-[#0058bc] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#4a47d2]" />
                      <span>Play 3D Shader Intro</span>
                      <span className="ml-auto text-[9px] font-mono font-bold bg-[#0058bc]/10 text-[#0058bc] px-1.5 py-0.5 rounded">2.0s</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Replay 3D Shader Intro Button */}
          {onPlayIntro && (
            <button
              id="replay-3d-intro-btn"
              onClick={onPlayIntro}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/80 hover:bg-white text-[#44474e] hover:text-[#0058bc] border border-black/5 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
              title="Play 2-Second 3D Shader Intro"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0058bc] group-hover:rotate-12 transition-transform" />
              <span className="text-[11px] font-tech font-bold">3D INTRO</span>
            </button>
          )}

          {/* Identity & Profile Switcher Badge */}
          <button
            id="identity-status-badge"
            onClick={onOpenIdentityModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50/80 hover:bg-blue-100 text-[#0058bc] border border-blue-200/80 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            title="Switch User / View Profiles (What's your name?)"
          >
            <Users className="w-3.5 h-3.5 text-[#0058bc]" />
            <span className="hidden sm:inline text-[11px] font-bold truncate max-w-[110px]">{user.name}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          {/* Quick Search */}
          <button
            id="quick-search-trigger"
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 text-xs text-[#717786] bg-[#f4f2f7] hover:bg-[#e9e6ed] px-2.5 py-1.5 rounded-xl transition-colors border border-black/5 cursor-pointer"
            title="Search (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#0058bc]" />
            <span className="hidden md:inline">Quick Search</span>
            <kbd className="hidden md:inline text-[10px] bg-white text-[#44474e] px-1.5 py-0.5 rounded shadow-2xs">⌘K</kbd>
          </button>

          {/* Ask SkillMesh AI Assistant Button */}
          <button
            id="ask-skillmesh-ai-btn"
            onClick={handleAsk}
            className="magnetic-btn px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0058bc] to-[#4a47d2] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-[#0058bc]/25 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Sound Micro Effects Toggle */}
          <SoundToggle />

          {/* Settings / Privacy */}
          <button
            id="settings-tab-btn"
            onClick={() => handleNav('settings')}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'settings' ? 'bg-[#0058bc]/10 text-[#0058bc]' : 'text-[#717786] hover:bg-[#f4f2f7]'
            }`}
            title="Security & Privacy"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* User Profile Pill - Triggers Passcode Protected Profile Editor */}
          <div 
            id="user-profile-trigger"
            onClick={() => onOpenEditProfileModal ? onOpenEditProfileModal() : handleNav('command')}
            className="flex items-center gap-2 pl-1 cursor-pointer group"
            title="Edit Profile (Passcode Protected)"
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-8 h-8 rounded-xl object-cover border border-[#0058bc]/30 shadow-2xs group-hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar Slider */}
      <div className="xl:hidden flex items-center gap-1.5 overflow-x-auto py-2 px-1 scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id || (item.id === 'home' && activeTab === 'landing');
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive 
                  ? 'bg-[#0058bc] text-white shadow-xs font-semibold' 
                  : 'bg-white/80 text-[#44474e] border border-black/5 hover:bg-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
