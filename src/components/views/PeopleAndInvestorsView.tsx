import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Building2, 
  MapPin, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  TrendingUp, 
  MessageSquare, 
  X 
} from 'lucide-react';
import { PersonProfile, PersonRole, UserProfile } from '../../types';
import confetti from 'canvas-confetti';

interface PeopleAndInvestorsViewProps {
  people: PersonProfile[];
  user: UserProfile;
}

export const PeopleAndInvestorsView: React.FC<PeopleAndInvestorsViewProps> = ({
  people,
  user
}) => {
  const [activeRole, setActiveRole] = useState<string>('all');
  const [selectedPerson, setSelectedPerson] = useState<PersonProfile | null>(null);
  const [pitchMessage, setPitchMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [peopleList, setPeopleList] = useState<PersonProfile[]>(people);

  const filteredPeople = activeRole === 'all'
    ? peopleList
    : peopleList.filter(p => p.role === activeRole);

  const handleOpenPitch = (person: PersonProfile) => {
    setSelectedPerson(person);
    setPitchMessage(`Hi ${person.name.split(' ')[0]}, I'm ${user.name} (${user.role}). Based on your public thesis around ${person.sector || 'AI infrastructure'}, my SkillMesh graph demonstrates verified STRONG evidence in production RAG systems with 94% test coverage. Would love to share our technical benchmark artifact.`);
  };

  const handleSendPitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPerson) return;
    setIsSending(true);

    setTimeout(() => {
      setPeopleList(prev => prev.map(p => {
        if (p.id === selectedPerson.id) {
          return { ...p, connectionStatus: 'pending' as const };
        }
        return p;
      }));
      setIsSending(false);
      setSelectedPerson(null);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-[#0058bc] uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            Global Venture & Talent Graph
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1b1b1d] tracking-tight">
            Investors, Cofounders & Mentors
          </h1>
          <p className="text-xs text-[#717786] mt-1">
            Discover venture capitalists investing in your exact technical stack and complementary cofounders.
          </p>
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-frost border border-white/70 shadow-2xs overflow-x-auto">
          {['all', 'investor', 'cofounder', 'mentor'].map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-all ${
                activeRole === role
                  ? 'bg-[#0058bc] text-white shadow-xs'
                  : 'text-[#44474e] hover:bg-white/60'
              }`}
            >
              {role === 'all' ? 'All Connections' : `${role}s`}
            </button>
          ))}
        </div>
      </div>

      {/* People Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPeople.map((person) => (
          <div
            key={person.id}
            className="glass-pearl p-6 rounded-3xl border border-white/80 shadow-md flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-200"
          >
            <div>
              {/* Header Profile Row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-[#0058bc]/20 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-[#1b1b1d]">{person.name}</h3>
                      {person.verified && (
                        <ShieldCheck className="w-4 h-4 text-[#0058bc]" title="Verified Profile" />
                      )}
                    </div>
                    <div className="text-xs font-semibold text-[#44474e]">{person.title}</div>
                    <div className="text-[11px] text-[#717786] flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3 h-3" />
                      <span>{person.organization}</span>
                      <span>•</span>
                      <MapPin className="w-3 h-3" />
                      <span>{person.location}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200">
                    {person.matchScore}%
                  </span>
                  <div className="text-[9px] text-[#717786] mt-1 uppercase font-bold">{person.role}</div>
                </div>
              </div>

              {/* Thesis / Bio */}
              <div className="p-3.5 rounded-2xl bg-[#fbf8fb] border border-black/5 text-xs text-[#44474e] leading-relaxed mb-3">
                <strong className="text-[#1b1b1d] block mb-1">
                  {person.role === 'investor' ? 'Public Investment Thesis:' : 'Background & Focus:'}
                </strong>
                {person.thesisOrBio}
              </div>

              {/* Stage & Portfolio Relevance (For Investors) */}
              {person.stage && (
                <div className="text-xs space-y-1 mb-3 text-[#44474e]">
                  <div><strong className="text-[#1b1b1d]">Stage & Sector:</strong> {person.stage} • {person.sector}</div>
                  {person.portfolioRelevance && (
                    <div className="text-[11px] text-[#717786]"><strong className="text-[#1b1b1d]">Notable Backings:</strong> {person.portfolioRelevance}</div>
                  )}
                </div>
              )}

              {/* Why Matched Deep-Dive */}
              <div className="text-xs text-[#0058bc] bg-[#0058bc]/5 p-2.5 rounded-xl border border-[#0058bc]/10 leading-relaxed mb-3">
                <span className="font-bold flex items-center gap-1 mb-0.5">
                  <Sparkles className="w-3 h-3" />
                  Why SkillMesh Matched You:
                </span>
                {person.whyMatched}
              </div>

              {/* Complementary Skills */}
              <div>
                <div className="text-[10px] font-bold text-[#717786] uppercase mb-1">
                  Complementary Capabilities Brought:
                </div>
                <div className="flex flex-wrap gap-1">
                  {person.complementarySkills.map((sk, idx) => (
                    <span key={idx} className="text-[10px] bg-white text-[#1b1b1d] font-semibold px-2 py-0.5 rounded-md border border-black/5">
                      + {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions & Attribution */}
            <div className="mt-5 pt-3 border-t border-black/5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[10px] text-[#717786] max-w-[200px] truncate" title={person.publicSource}>
                Source: {person.publicSource}
              </span>

              <div className="flex items-center gap-2">
                {person.connectionStatus === 'connected' ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Connected
                  </span>
                ) : person.connectionStatus === 'pending' ? (
                  <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold">
                    Pitch Pending
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenPitch(person)}
                    className="px-4 py-1.5 rounded-xl bg-[#0058bc] hover:bg-[#004899] text-white font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Send className="w-3 h-3" />
                    <span>Connect & Pitch Mesh</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Connect & Pitch Modal */}
      {selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-pearl w-full max-w-lg rounded-3xl p-6 border border-white/80 shadow-2xl relative">
            <button
              onClick={() => setSelectedPerson(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-black/5 text-[#717786]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img src={selectedPerson.avatar} alt={selectedPerson.name} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <h3 className="text-base font-bold text-[#1b1b1d]">Pitch to {selectedPerson.name}</h3>
                <p className="text-xs text-[#717786]">{selectedPerson.title}, {selectedPerson.organization}</p>
              </div>
            </div>

            <form onSubmit={handleSendPitch} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#1b1b1d] block mb-1">
                  Verified SkillMesh Context Attachment
                </label>
                <div className="p-3 rounded-xl bg-[#fbf8fb] border border-black/5 text-[11px] text-[#44474e]">
                  ✓ Attached: 14 Verified STRONG Proofs (Python 87%, RAG 79%, FastAPI 85%)<br />
                  ✓ Attached: Live RAG Demo Endpoint (94% test coverage)
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1b1b1d] block mb-1">Personalized Message</label>
                <textarea
                  rows={4}
                  value={pitchMessage}
                  onChange={(e) => setPitchMessage(e.target.value)}
                  className="w-full bg-white p-3 rounded-xl border border-black/10 outline-none focus:border-[#0058bc]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPerson(null)}
                  className="px-4 py-2 rounded-xl text-[#717786] hover:bg-black/5 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending || !pitchMessage.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#0058bc] hover:bg-[#004899] text-white font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      Sending Pitch...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Direct Introduction
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
