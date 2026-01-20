import React from 'react';
import { User } from '../types';
import { STAGE_THRESHOLDS } from '../constants';

// Male Imports
import maleStage0 from '../assets/characters/male/stage_0.png';
import maleStage1 from '../assets/characters/male/stage_1.png';
import maleStage2 from '../assets/characters/male/stage_2.png';
import maleStage3 from '../assets/characters/male/stage_3.png';
import maleStage4 from '../assets/characters/male/stage_4.png';
import maleStage5 from '../assets/characters/male/stage_5.png';

// Female Imports
import femaleStage0 from '../assets/characters/female/stage_0.png';
import femaleStage1 from '../assets/characters/female/stage_1.png';
import femaleStage2 from '../assets/characters/female/stage_2.png';
import femaleStage3 from '../assets/characters/female/stage_3.png';
import femaleStage4 from '../assets/characters/female/stage_4.png';
import femaleStage5 from '../assets/characters/female/stage_5.png';

interface CharacterProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

const characterImages = {
  male: [maleStage0, maleStage1, maleStage2, maleStage3, maleStage4, maleStage5],
  female: [femaleStage0, femaleStage1, femaleStage2, femaleStage3, femaleStage4, femaleStage5]
};

const Character: React.FC<CharacterProps> = ({ user, size = 'md' }) => {
  const getStage = (count: number): number => {
    for (let i = 0; i < STAGE_THRESHOLDS.length; i++) {
      if (count < STAGE_THRESHOLDS[i]) return i;
    }
    return 5;
  };

  const stage = getStage(user.totalCorrectCount);
  const gender = user.gender || 'female'; // Default fallback

  // Dimensions
  const dimensions = {
    sm: { w: 50, h: 60 },
    md: { w: 120, h: 140 }, // Adjusted for image aspect ratio
    lg: { w: 260, h: 300 }
  };
  const dim = dimensions[size];

  const imageSrc = characterImages[gender][stage] || characterImages[gender][0];

  return (
    <div
      className="relative flex items-center justify-center transition-all duration-300"
      style={{ width: `${dim.w}px`, height: `${dim.h}px` }}
    >
      <img
        src={imageSrc}
        alt={`Character Stage ${stage}`}
        className="object-contain w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Stage Badge */}
      {size !== 'sm' && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 translate-y-1/2">
          <span className="pixel-font text-[8px] text-indigo-600 bg-white/95 px-3 py-1 border-2 border-indigo-600 font-bold whitespace-nowrap shadow-sm uppercase tracking-widest">
            Stage {stage}
          </span>
        </div>
      )}
    </div>
  );
};

export default Character;
