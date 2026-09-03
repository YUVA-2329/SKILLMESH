import React, { useState, useEffect, useCallback } from 'react';
import { 
  Database, 
  Check, 
  RefreshCw, 
  X, 
  Copy, 
  Layers, 
  AlertCircle,
  UserCheck,
  ArrowRightLeft
} from 'lucide-react';
import { 
  checkMongoStatus, 
  fetchCurrentMongoRawDocument, 
  MongoConnectionStatus, 
  getLastSyncTimeText,
  getStoredAuthEmail,
  getStoredAuthId,
  fetchMongoAccounts
} from '../../lib/mongoClient';
import { UserProfile } from '../../types';

interface MongoInspectorButtonProps {
  currentUser?: UserProfile;
  skillsCount?: number;
  projectsCount?: number;
  connectionsCount?: number;
  onRefresh?: () => void;
  onSwitchAccount?: (name: string, email: string) => void;
}

export const MongoInspectorButton: React.FC<MongoInspectorButtonProps> = ({
  currentUser,
  skillsCount = 0,
  projectsCount = 0,
  connectionsCount = 0,
  onRefresh,
  onSwitchAccount
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<MongoConnectionStatus>({
    configured: false,
    connected: false,
    status: 'connecting',
    dbName: 'skillmesh',
    collection: 'users',
    documentCount: 0,
    error: null,
    serverTime: new Date().toISOString()
  });
  const [rawDocument, setRawDocument] = useState<Record<string, any> | null>(null);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [lastSyncText, setLastSyncText] = useState('just now');
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStatusAndDoc = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const s = await checkMongoStatus();
      setStatus(s);

      const identifier = currentUser?.email || getStoredAuthId() || getStoredAuthEmail();
      if (identifier) {
        setIsLoadingDoc(true);
        const docRes = await fetchCurrentMongoRawDocument(identifier);
        if (docRes.document) {
          setRawDocument(docRes.document);
        } else if (currentUser) {
          // Construct live representation if not yet returned
          setRawDocument({
            _id: `local-draft-${currentUser.id || 'current'}`,
            authId: getStoredAuthId() || `auth_draft`,
            name: currentUser.name,
            email: currentUser.email || getStoredAuthEmail(),
            profile: {
              bio: currentUser.summary || '',
              avatar: currentUser.avatar || '',
              location: currentUser.country || '',
              education: '',
              experience: currentUser.experience || ''
            },
            skills: currentUser.skills || [],
            projects: currentUser.projects || [],
            connections: [],
            interests: currentUser.interests || [],
            recommendations: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
        setIsLoadingDoc(false);
      }
      setLastSyncText(getLastSyncTimeText());
    } catch (err) {
      console.warn('MongoDB inspector poll error:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [currentUser]);

  // Initial fetch and periodic polling
  useEffect(() => {
    fetchStatusAndDoc();
    const interval = setInterval(fetchStatusAndDoc, 10000);
    return () => clearInterval(interval);
  }, [fetchStatusAndDoc]);

  // Update sync timestamp
  useEffect(() => {
    const timer = setInterval(() => {
      setLastSyncText(getLastSyncTimeText());
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Listen for real-time sync events from storage/mongoClient
  useEffect(() => {
    const handleSyncEvent = () => {
      setSavedFeedback(true);
      setLastSyncText('just now');
      fetchStatusAndDoc();

      const timeout = setTimeout(() => {
        setSavedFeedback(false);
      }, 3000);
      return () => clearTimeout(timeout);
    };

    window.addEventListener('skillmesh:mongodb:sync', handleSyncEvent);
    return () => window.removeEventListener('skillmesh:mongodb:sync', handleSyncEvent);
  }, [fetchStatusAndDoc]);

  const handleCopyJson = () => {
    if (!rawDocument) return;
    navigator.clipboard.writeText(JSON.stringify(rawDocument, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = () => {
    if (status.connected) return 'bg-emerald-500';
    if (status.status === 'connecting') return 'bg-amber-500 animate-pulse';
    return 'bg-rose-500';
  };

  const getStatusLabel = () => {
    if (status.connected) return 'Connected';
    if (status.status === 'connecting') return 'Connecting';
    return 'Disconnected';
  };

  return (
    <>
      {/* Floating Save Notification Toast: Saved to MongoDB ✓ */}
      {savedFeedback && (
        <div 
          id="mongodb-saved-toast"
          className="fixed bottom-16 right-5 z-50 bg-emerald-950/95 text-emerald-200 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-1.5 animate-fade-in-up"
        >
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Saved to MongoDB ✓</span>
        </div>
      )}

      {/* Floating Subtle MongoDB Button in Bottom-Right Corner */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          id="mongodb-inspector-btn"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) fetchStatusAndDoc();
          }}
          className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-[#1b1b1d] border border-black/10 hover:border-emerald-500/50 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-200 ease-out cursor-pointer active:scale-95"
          title="MongoDB Live Inspector"
        >
          {/* Status Indicator: 🟢 Connected, 🟡 Connecting, 🔴 Disconnected */}
          <span className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor()}`} />

          {/* Exact Label: ◉ MongoDB */}
          <span className="text-xs font-semibold tracking-tight text-[#1b1b1d]">
            ◉ MongoDB
          </span>

          {/* Smooth hover status badge */}
          <span className="hidden group-hover:inline-block text-[11px] font-medium text-[#5f6368] transition-opacity">
            · {getStatusLabel()}
          </span>
        </button>
      </div>

      {/* Inspector Modal Panel */}
      {isOpen && (
        <div 
          id="mongodb-inspector-panel"
          className="fixed bottom-16 right-5 z-50 w-96 max-w-[calc(100vw-2.5rem)] rounded-3xl bg-white/95 backdrop-blur-2xl border border-black/10 shadow-2xl overflow-hidden animate-fade-in-up flex flex-col"
          style={{ maxHeight: 'calc(100vh - 5.5rem)' }}
        >
          {/* Top Emerald Accent Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

          {/* Header */}
          <div className="p-4 border-b border-black/5 flex items-center justify-between bg-[#f8fbf9]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/20">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#1b1b1d] tracking-tight">
                  MongoDB — Live Data
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
                  <span className="text-[11px] font-semibold text-[#44474e]">
                    {status.connected ? 'Connected' : status.status === 'connecting' ? 'Connecting' : 'Disconnected'}
                  </span>
                  <span className="text-[9px] font-mono text-[#75777f] bg-black/5 px-1.5 py-0.5 rounded">
                    {status.dbName}.{status.collection}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="mongodb-refresh-btn"
                onClick={() => {
                  fetchStatusAndDoc();
                  onRefresh?.();
                }}
                disabled={isRefreshing}
                className="p-1.5 rounded-xl hover:bg-black/5 text-[#5f6368] hover:text-[#1b1b1d] transition-colors cursor-pointer"
                title="Refresh Live Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
              <button
                id="mongodb-close-btn"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-black/5 text-[#5f6368] hover:text-[#1b1b1d] transition-colors cursor-pointer"
                title="Close Inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Panel Body */}
          <div className="p-4 space-y-4 overflow-y-auto flex-1 scrollbar-thin text-xs">
            {/* Connection Warning if Disconnected */}
            {!status.connected && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/70 text-amber-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-800">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>MongoDB — Disconnected</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-700">
                  {status.error || 'MONGODB_URI is not set in environment.'} SkillMesh is currently using the local fallback store. Set <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-[10px]">MONGODB_URI</code> in environment variables to connect to your live MongoDB Atlas cluster.
                </p>
              </div>
            )}

            {/* Quick Test Accounts Switcher (Alex & Sarah) */}
            <div className="p-2.5 rounded-2xl bg-blue-50/60 border border-blue-200/50 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-[#0058bc] uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>Verify Multi-User Isolation</span>
                </span>
                <span className="font-mono text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">1 User = 1 Doc</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="switch-to-alex-btn"
                  onClick={() => onSwitchAccount?.('Alex Kumar', 'alex@example.com')}
                  className={`p-2 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                    currentUser?.name.toLowerCase().includes('alex')
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                      : 'bg-white hover:bg-blue-50/80 text-[#1b1b1d] border-blue-200/80'
                  }`}
                >
                  <div className="font-bold truncate">Alex Kumar</div>
                  <div className={`text-[10px] font-mono truncate ${currentUser?.name.toLowerCase().includes('alex') ? 'text-blue-100' : 'text-[#5f6368]'}`}>
                    alex@example.com
                  </div>
                </button>

                <button
                  id="switch-to-sarah-btn"
                  onClick={() => onSwitchAccount?.('Sarah Patel', 'sarah@example.com')}
                  className={`p-2 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                    currentUser?.name.toLowerCase().includes('sarah')
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                      : 'bg-white hover:bg-blue-50/80 text-[#1b1b1d] border-blue-200/80'
                  }`}
                >
                  <div className="font-bold truncate">Sarah Patel</div>
                  <div className={`text-[10px] font-mono truncate ${currentUser?.name.toLowerCase().includes('sarah') ? 'text-blue-100' : 'text-[#5f6368]'}`}>
                    sarah@example.com
                  </div>
                </button>
              </div>
            </div>

            {/* CURRENT ACCOUNT */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-[#75777f] uppercase tracking-wider font-tech flex items-center justify-between">
                <span>CURRENT ACCOUNT</span>
                {status.connected && (
                  <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Live from MongoDB Atlas
                  </span>
                )}
              </div>

              <div className="bg-[#f0f4fd]/60 border border-black/5 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#5f6368] font-medium">Name</span>
                  <span className="font-bold text-[#1b1b1d]">{rawDocument?.name || currentUser?.name || 'Alex Kumar'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5f6368] font-medium">Email</span>
                  <span className="font-mono text-[11px] text-[#0058bc] font-semibold truncate max-w-[200px]">
                    {rawDocument?.email || currentUser?.email || getStoredAuthEmail() || 'alex@example.com'}
                  </span>
                </div>

                <div className="pt-2 border-t border-black/5 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/80 p-2 rounded-xl border border-black/5">
                    <div className="text-[10px] text-[#75777f]">Skills</div>
                    <div className="font-bold text-xs text-[#1b1b1d]">
                      {rawDocument?.skills?.length ?? skillsCount}
                    </div>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl border border-black/5">
                    <div className="text-[10px] text-[#75777f]">Projects</div>
                    <div className="font-bold text-xs text-[#1b1b1d]">
                      {rawDocument?.projects?.length ?? projectsCount}
                    </div>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl border border-black/5">
                    <div className="text-[10px] text-[#75777f]">Connections</div>
                    <div className="font-bold text-xs text-[#1b1b1d]">
                      {rawDocument?.connections?.length ?? connectionsCount}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="border-t border-black/5" />

            {/* DATABASE DOCUMENT */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-[#75777f] uppercase tracking-wider font-tech">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-emerald-600" />
                  <span>DATABASE DOCUMENT</span>
                </span>
                <button
                  id="mongodb-copy-json-btn"
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 text-[10px] text-[#0058bc] hover:underline cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-2.5 h-2.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-2.5 h-2.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>

              {/* Formatted Read-Only JSON Document */}
              <div className="relative rounded-2xl bg-[#1e232a] text-[#e6edf3] p-3 font-mono text-[11px] leading-relaxed max-h-60 overflow-y-auto scrollbar-thin border border-black/20 shadow-inner">
                {isLoadingDoc ? (
                  <div className="py-8 text-center text-slate-400 flex items-center justify-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>Querying MongoDB Atlas...</span>
                  </div>
                ) : rawDocument ? (
                  <pre className="whitespace-pre-wrap break-all">
                    {JSON.stringify(rawDocument, null, 2)}
                  </pre>
                ) : (
                  <div className="py-6 text-center text-slate-400">
                    No document loaded yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-black/5 bg-[#f8fbf9] flex items-center justify-between text-[11px] text-[#75777f]">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor()}`} />
              <span>Last synced: <strong className="text-[#1b1b1d]">{lastSyncText}</strong></span>
            </div>

            <span className="text-[10px] font-mono text-[#5f6368]">
              {status.connected ? 'Atlas Cluster Online' : 'Local Fallback'}
            </span>
          </div>
        </div>
      )}
    </>
  );
};
