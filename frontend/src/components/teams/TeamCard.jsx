import React from 'react';
import Icon from '../ui/Icon.jsx';

export default function TeamCard({ team, onClick }) {
  const memberCount = team.members?.length || 0;

  return (
    <div 
      className="glass-card p-6 rounded-2xl cursor-pointer hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all group flex flex-col h-full"
      onClick={() => onClick?.(team)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6c63ff]/20 to-[#3529c2]/20 border border-[#6c63ff]/30 flex items-center justify-center">
          <Icon name="groups" className="text-[#6c63ff] text-[24px]" />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
          <Icon name="people" className="text-[14px]" />
          {memberCount}
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#c4c0ff] transition-colors">{team.name}</h3>
      
      {team.description && (
        <p className="text-sm text-slate-400 line-clamp-2 mb-6 flex-1">
          {team.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
        <div className="flex -space-x-2">
          {(team.members || []).slice(0, 5).map((m) => (
            <img 
              key={m.uid}
              alt={m.uid} 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(m.uid)}&background=0D8ABC&color=fff`} 
              className="w-8 h-8 rounded-full border-2 border-[#0a0a14] object-cover"
            />
          ))}
          {memberCount > 5 && (
            <div className="w-8 h-8 rounded-full border-2 border-[#0a0a14] bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">
              +{memberCount - 5}
            </div>
          )}
        </div>
        
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#6c63ff] group-hover:text-white text-slate-500 transition-colors">
          <Icon name="arrow_forward" className="text-[16px]" />
        </div>
      </div>
    </div>
  );
}
