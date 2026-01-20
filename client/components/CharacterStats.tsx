
import React from 'react';
import { User } from '../types';
import { STAGE_THRESHOLDS } from '../constants';
import Character from './Character';
import { ArrowLeft, Trophy, Star, GraduationCap, Flame, Sparkles, RefreshCw } from 'lucide-react';
import { i18n } from '../App';

interface CharacterStatsProps {
  user: User;
  onBack: () => void;
  onUpdateUser: (user: User) => void;
  onReset?: () => void;
}

const CharacterStats: React.FC<CharacterStatsProps> = ({ user, onBack, onReset }) => {
  const currentStage = user.currentStage;
  const nextThreshold = STAGE_THRESHOLDS[currentStage] || STAGE_THRESHOLDS[STAGE_THRESHOLDS.length - 1];
  const prevThreshold = currentStage === 0 ? 0 : STAGE_THRESHOLDS[currentStage - 1];

  const progress = Math.min(100, Math.max(0, ((user.totalCorrectCount - prevThreshold) / (nextThreshold - prevThreshold)) * 100));
  const t = i18n[user.language || 'ko'];

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <button onClick={onBack} className="flex items-center gap-2 font-black text-xs uppercase hover:underline">
          <ArrowLeft size={16} /> {t.back}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white border-4 border-black p-10 flex flex-col items-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-full flex justify-between items-center mb-8">
            <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Lv.{currentStage + 1}</span>
            {currentStage >= 2 && <Star className="text-yellow-400 fill-black" size={24} />}
          </div>
          <div className="scale-150 mb-10">
            <Character user={user} size="lg" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-widest mb-2">{t.level}: {user.level}</h2>
          <div className="flex gap-2 text-indigo-600 font-bold items-center">
            <Trophy size={16} />
            <span>{user.totalCorrectCount} EXP</span>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
            <h3 className="font-black text-lg uppercase mb-4 flex items-center gap-2">
              <Flame size={20} /> {t.roadmap}
            </h3>
            <div className="relative pt-4 pb-2">
              <div className="flex justify-between text-[10px] font-bold mb-2 uppercase text-gray-400">
                <span>Current Stage</span>
                <span>Next Evolution</span>
              </div>
              <div className="h-4 bg-gray-100 border-2 border-black rounded-full overflow-hidden">
                <div className="h-full bg-black transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-right text-[10px] font-bold mt-2 text-indigo-600">
                {nextThreshold - user.totalCorrectCount} {t.ptsRequired}
              </p>
            </div>
          </div>

          <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
            <h3 className="font-black text-lg uppercase mb-4 flex items-center gap-2">
              <GraduationCap size={20} /> {t.mastery}
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.masteredPaperIds.length === 0 ? (
                <p className="text-xs text-gray-400 font-medium italic">No papers mastered yet.</p>
              ) : (
                user.masteredPaperIds.map((id) => (
                  <span key={id} className="text-[10px] bg-yellow-100 border border-yellow-300 px-2 py-1 font-bold uppercase truncate max-w-[200px]">
                    {id}
                  </span>
                ))
              )}
            </div>
          </div>

          {onReset && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
                  onReset();
                }
              }}
              className="w-full py-4 border-2 border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-400 font-black text-xs uppercase flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw size={14} /> Reset Application Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterStats;