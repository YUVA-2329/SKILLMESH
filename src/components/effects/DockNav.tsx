import React, { useRef, useState } from 'react';
import { ActiveTab } from '../../types';
import { 
  Sparkles, 
  Compass, 
  Layers, 
  GitBranch, 
  ShieldCheck, 
  FolderGit2, 
  Briefcase, 
  Users, 
  Github, 
  FileText, 
  TrendingUp, 
  Shield
} from 'lucide-react';
import { soundEffects } from './SoundFeedback';

interface DockNavProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
}

export const DockNav: React.FC<DockNavProps> = ({ activeTab, onNavigate }) => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const items: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'command', label: 'Cockpit', icon: <Compass className="w-4 h-4" /> },
    { id: 'universe', label: 'Universe', icon: <Layers className="w-4 h-4" /> },
    { id: 'pathway', label: 'Pathway', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'evidence', label: 'Evidence', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'opportunities', label: 'Market', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'people', label: 'Investors', icon: <Users className="w-4 h-4" /> },
    { id: 'github', label: 'GitHub', icon: <Github className="w-4 h-4" /> },
    { id: 'resume', label: 'Resume', icon: <FileText className="w-4 h-4" /> },
    { id: 'simulator', label: 'Simulator', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'settings', label: 'Privacy', icon: <Shield className="w-4 h-4" /> }
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dockRef.current) return;
    setMouseX(e.clientX);
  };

  const handleMouseLeave = () => {
    setMouseX(null);
  };

  return (
    <div className="fixed bottom-5 left-0 right-0 z-40 flex justify-center pointer-events-none px-4">
      <div
        ref={dockRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="pointer-events-auto glass-pearl px-3 py-2 rounded-2xl border border-white/80 shadow-2xl flex items-center gap-1.5 backdrop-blur-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,88,188,0.15)]"
      >
        {items.map((item) => {
          const isActive = activeTab === item.id || (item.id === 'home' && activeTab === 'landing');
          return (
            <DockItem
              key={item.id}
              item={item}
              isActive={isActive}
              mouseX={mouseX}
              onClick={() => {
                soundEffects.playClick(750);
                onNavigate(item.id);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

interface DockItemProps {
  item: { id: ActiveTab; label: string; icon: React.ReactNode };
  isActive: boolean;
  mouseX: number | null;
  onClick: () => void;
}

const DockItem: React.FC<DockItemProps> = ({ item, isActive, mouseX, onClick }) => {
  const itemRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Compute distance-based magnification scale
  let scale = 1;
  if (mouseX !== null && itemRef.current) {
    const rect = itemRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const distance = Math.abs(mouseX - centerX);
    const maxDistance = 120;
    if (distance < maxDistance) {
      const factor = 1 - distance / maxDistance;
      scale = 1 + factor * 0.35; // scales up to 1.35x
    }
  }

  return (
    <div className="relative flex flex-col items-center group">
      {/* Tooltip */}
      <div className="absolute -top-9 px-2 py-1 rounded-md bg-[#1b1b1d] text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 transform -translate-y-1 group-hover:translate-y-0 whitespace-nowrap shadow-lg">
        {item.label}
      </div>

      <button
        ref={itemRef}
        onClick={onClick}
        onMouseEnter={() => {
          setIsHovered(true);
          soundEffects.playHover();
        }}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: `scale(${scale})`,
          transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.2s ease'
        }}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
          isActive
            ? 'bg-[#0058bc] text-white shadow-md shadow-[#0058bc]/30 font-bold'
            : 'text-[#44474e] hover:text-[#0058bc] hover:bg-white/90 bg-white/40'
        }`}
      >
        {item.icon}
        {isActive && (
          <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white ring-2 ring-[#0058bc]" />
        )}
      </button>
    </div>
  );
};
