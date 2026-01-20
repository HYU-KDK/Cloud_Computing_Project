
import React from 'react';
import { User } from '../types';
import { STAGE_THRESHOLDS } from '../constants';

interface CharacterProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

const Character: React.FC<CharacterProps> = ({ user, size = 'md' }) => {
  const getStage = (count: number): number => {
    for (let i = 0; i < STAGE_THRESHOLDS.length; i++) {
      if (count < STAGE_THRESHOLDS[i]) return i;
    }
    return 5;
  };

  const stage = getStage(user.totalCorrectCount);
  const isMale = user.gender === 'male';

  // 사이즈 및 스케일링 설정
  const dimensions = {
    sm: { w: 40, h: 50, scale: 0.6 },
    md: { w: 100, h: 120, scale: 1.2 },
    lg: { w: 240, h: 280, scale: 2.8 }
  };
  const dim = dimensions[size];

  return (
    <div 
      className="relative flex items-center justify-center transition-all duration-300"
      style={{ width: `${dim.w}px`, height: `${dim.h}px` }}
    >
      <div className="relative z-10" style={{ transform: `scale(${dim.scale})` }}>
        <svg width="64" height="80" viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
          {/* 하단 신발 (공통 기초) */}
          <rect x="24" y="72" width="6" height="4" fill="#3D2B1F"/>
          <rect x="34" y="72" width="6" height="4" fill="#3D2B1F"/>

          {isMale ? (
            <>
              {/* 남성 0단계: 줄무늬 꼬마 */}
              {stage === 0 && (
                <>
                  <rect x="24" y="60" width="16" height="12" fill="#5D4037"/>
                  <rect x="22" y="44" width="20" height="16" fill="#1ABC9C"/>
                  <rect x="22" y="48" width="20" height="4" fill="#E74C3C"/>
                  <rect x="22" y="56" width="20" height="4" fill="#E74C3C"/>
                  <rect x="24" y="24" width="16" height="20" fill="#FFD1A9"/>
                  <rect x="22" y="20" width="20" height="10" fill="#8D5524"/>
                </>
              )}
              {/* 남성 1단계: 푸른 셔츠와 활 */}
              {stage === 1 && (
                <>
                  <rect x="24" y="60" width="16" height="12" fill="#2C3E50"/>
                  <rect x="22" y="44" width="20" height="16" fill="#3498DB"/>
                  <rect x="24" y="24" width="16" height="20" fill="#FFD1A9"/>
                  <rect x="22" y="20" width="20" height="10" fill="#8D5524"/>
                  <path d="M48 30 Q54 45 48 60" stroke="#795548" strokeWidth="2" fill="none"/>
                </>
              )}
              {/* 남성 2단계: 수염 난 청년 학자 */}
              {stage === 2 && (
                <>
                  <rect x="24" y="60" width="16" height="12" fill="#2C3E50"/>
                  <rect x="22" y="44" width="20" height="16" fill="#3498DB"/>
                  <rect x="24" y="24" width="16" height="20" fill="#FFD1A9"/>
                  <rect x="22" y="20" width="20" height="10" fill="#5D4037"/>
                  <rect x="24" y="40" width="16" height="4" fill="#5D4037" fillOpacity="0.7"/>
                </>
              )}
              {/* 남성 3단계: 갈색 옷의 성숙한 학자 */}
              {stage === 3 && (
                <>
                  <rect x="24" y="60" width="16" height="12" fill="#2C3E50"/>
                  <rect x="20" y="44" width="24" height="16" fill="#8D6E63"/>
                  <rect x="24" y="24" width="16" height="20" fill="#FFD1A9"/>
                  <rect x="20" y="20" width="24" height="10" fill="#3D2B1F"/>
                  <rect x="22" y="38" width="20" height="6" fill="#3D2B1F"/>
                </>
              )}
              {/* 남성 4단계: 남색 로브의 노교수 */}
              {stage === 4 && (
                <>
                  <rect x="20" y="44" width="24" height="28" fill="#1A242F"/>
                  <rect x="24" y="24" width="16" height="20" fill="#F5CBA7"/>
                  <rect x="20" y="20" width="24" height="10" fill="#7F8C8D"/>
                  <rect x="22" y="36" width="20" height="12" fill="#BDC3C7"/>
                  <rect x="46" y="20" width="4" height="52" fill="#5D4037"/>
                  <circle cx="48" cy="18" r="4" fill="#85C1E9"/>
                </>
              )}
              {/* 남성 5단계: 보라색 대현자 */}
              {stage === 5 && (
                <>
                  <rect x="18" y="40" width="28" height="32" fill="#4A235A"/>
                  <rect x="22" y="50" width="20" height="2" fill="#F1C40F"/>
                  <rect x="24" y="24" width="16" height="20" fill="#F5CBA7"/>
                  <rect x="18" y="32" width="28" height="20" fill="#ECF0F1"/>
                  <path d="M22 20 L32 0 L42 20 Z" fill="#4A235A"/>
                  <rect x="50" y="10" width="4" height="62" fill="#7E5109"/>
                  <circle cx="52" cy="10" r="6" fill="#AED6F1" fillOpacity="0.8"/>
                </>
              )}
              {/* 공통 눈 */}
              <rect x="28" y="32" width="2" height="2" fill="#000"/>
              <rect x="34" y="32" width="2" height="2" fill="#000"/>
            </>
          ) : (
            <>
              {/* 여성 0단계: 책을 든 소녀 학도 */}
              {stage === 0 && (
                <>
                  <rect x="24" y="60" width="16" height="12" fill="#2C3E50"/>
                  <rect x="22" y="44" width="20" height="16" fill="#FFFFFF"/>
                  <rect x="22" y="44" width="6" height="16" fill="#2C3E50"/>
                  <rect x="36" y="44" width="6" height="16" fill="#2C3E50"/>
                  <rect x="24" y="24" width="16" height="20" fill="#FFD1A9"/>
                  <rect x="20" y="20" width="24" height="12" fill="#C46210"/>
                  <rect x="20" y="52" width="8" height="10" fill="#C0392B"/>
                </>
              )}
              {/* 여성 1단계: 푸른 셔츠의 학구적 소녀 */}
              {stage === 1 && (
                <>
                  <rect x="24" y="60" width="16" height="12" fill="#2C3E50"/>
                  <rect x="22" y="44" width="20" height="16" fill="#3498DB"/>
                  <rect x="24" y="24" width="16" height="20" fill="#FFD1A9"/>
                  <rect x="20" y="20" width="24" height="15" fill="#5D4037"/>
                </>
              )}
              {/* 여성 2단계: 초록 드레스의 현자 지망생 */}
              {stage === 2 && (
                <>
                  <path d="M20 50 L44 50 L48 72 L16 72 Z" fill="#27AE60"/>
                  <rect x="24" y="24" width="16" height="20" fill="#FFD1A9"/>
                  <rect x="20" y="20" width="24" height="30" fill="#5D4037"/>
                </>
              )}
              {/* 여성 3단계: 성숙한 녹색 예복의 마법사 */}
              {stage === 3 && (
                <>
                  <path d="M20 50 L44 50 L48 72 L16 72 Z" fill="#1E8449"/>
                  <rect x="24" y="24" width="16" height="20" fill="#F5CBA7"/>
                  <rect x="20" y="20" width="24" height="35" fill="#3D2B1F"/>
                </>
              )}
              {/* 여성 4단계: 보라색 노현자 */}
              {stage === 4 && (
                <>
                  <path d="M18 45 L46 45 L50 72 L14 72 Z" fill="#6C3483"/>
                  <rect x="24" y="24" width="16" height="20" fill="#F5CBA7"/>
                  <rect x="22" y="16" width="20" height="15" fill="#95A5A6"/>
                  <rect x="42" y="16" width="8" height="8" fill="#95A5A6" rx="4"/>
                  <rect x="48" y="44" width="2" height="12" fill="#5D4037" transform="rotate(-30)"/>
                </>
              )}
              {/* 여성 5단계: 푸른색 전설의 대현자 */}
              {stage === 5 && (
                <>
                  <path d="M16 40 L48 40 L52 72 L12 72 Z" fill="#2E86C1"/>
                  <rect x="26" y="44" width="12" height="6" fill="#F06292"/>
                  <rect x="24" y="24" width="16" height="20" fill="#F5CBA7"/>
                  <path d="M16 24 Q32 10 48 24" fill="#2E86C1" stroke="#21618C" strokeWidth="2"/>
                  <rect x="20" y="24" width="24" height="4" fill="#ECF0F1"/>
                  <rect x="52" y="10" width="4" height="62" fill="#5D4037"/>
                  <circle cx="54" cy="10" r="8" fill="#AED6F1" fillOpacity="0.9"/>
                </>
              )}
              {/* 공통 눈/입 */}
              <rect x="28" y="32" width="2" height="2" fill="#000"/>
              <rect x="34" y="32" width="2" height="2" fill="#000"/>
              <rect x="31" y="40" width="2" height="1" fill="#E74C3C" fillOpacity="0.5"/>
            </>
          )}
        </svg>
      </div>
      
      {/* 스테이지 표시 */}
      {size !== 'sm' && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
          <span className="pixel-font text-[8px] text-indigo-600 bg-white/90 px-2 py-1 border-2 border-indigo-600 font-bold whitespace-nowrap shadow-sm">
            STAGE {stage}
          </span>
        </div>
      )}
    </div>
  );
};

export default Character;
