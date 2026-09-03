import React from 'react';
import { 
  Sparkles, 
  Search, 
  MessageSquare, 
  Layers, 
  Compass, 
  ShieldCheck, 
  GitBranch, 
  FolderGit2, 
  Briefcase, 
  Users, 
  Github, 
  FileText, 
  TrendingUp, 
  Shield
} from 'lucide-react';
import { ActiveTab, UserProfile } from '../../types';
import { SoundToggle } from '../effects/SoundToggle';
import { soundEffects } from '../effects/SoundFeedback';

interface TopNavBarProps {
  activeTab: ActiveTab;
  setActiveTab?: (tab: ActiveTab) => void;
  onSelectTab?: (tab: ActiveTab) => void;
  user: UserProfile;
  onOpenAskAI?: () => void;
  onOpenAskSkillMesh?: () => void;
  onOpenCommandPalette: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  setActiveTab,
  onSelectTab,
  user,
  onOpenAskAI,
  onOpenAskSkillMesh,
  onOpenCommandPalette
}) => {
  const rawNav = onSelectTab || setActiveTab || (() => {});
  const handleNav = (tab: ActiveTab) => {
    soundEffects.playClick(680);
    rawNav(tab);
  };
  const handleAsk = () => {
    soundEffects.playChime();
    const action = onOpenAskSkillMesh || onOpenAskAI || (() => {});
    action();
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Sparkles className="w-4 h-4 text-[#0058bc]" /> },
    { id: 'command', label: 'Command', icon: <Compass className="w-4 h-4" /> },
    { id: 'universe', label: '3D Universe', icon: <Layers className="w-4 h-4" /> },
    { id: 'pathway', label: 'Pathway', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'evidence', label: 'Evidence', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'opportunities', label: 'Opportunities', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'people', label: 'Investors & People', icon: <Users className="w-4 h-4" /> },
    { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" /> },
    { id: 'github', label: 'GitHub AI', icon: <Github className="w-4 h-4" /> },
    { id: 'resume', label: 'Resume', icon: <FileText className="w-4 h-4" /> },
    { id: 'simulator', label: 'Simulator', icon: <TrendingUp className="w-4 h-4" /> }
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
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0058bc] via-[#4a47d2] to-[#6462ec] flex items-center justify-center text-white shadow-md shadow-[#4a47d2]/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-tight text-[#1b1b1d] flex items-center gap-1.5">
              SKILLMESH
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#0058bc] bg-[#0058bc]/10 px-1.5 py-0.5 rounded-md">
                OS
              </span>
            </div>
            <div className="text-[10px] text-[#717786] font-medium hidden sm:block">Living Career Intelligence</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1 bg-[#f4f2f7] p-1 rounded-xl border border-black/5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id || (item.id === 'home' && activeTab === 'landing');
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => handleNav(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive 
                    ? 'bg-white text-[#0058bc] shadow-sm font-bold' 
                    : 'text-[#44474e] hover:text-[#1b1b1d] hover:bg-white/60'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
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

          {/* User Profile Pill */}
          <div 
            id="user-profile-trigger"
            onClick={() => handleNav('command')}
            className="flex items-center gap-2 pl-1 cursor-pointer"
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-8 h-8 rounded-xl object-cover border border-[#0058bc]/30 shadow-2xs"
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
