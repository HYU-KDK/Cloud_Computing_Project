
import React from 'react';
import { Paper, AppLanguage } from '../types';
import { BookOpen, ExternalLink, ArrowRight, Calendar, Landmark, Trophy } from 'lucide-react';
import { i18n } from '../App';

interface BookletProps {
  papers: Paper[];
  onSelect: (paper: Paper) => void;
  masteredIds: string[];
  lang?: AppLanguage;
}

const Booklet: React.FC<BookletProps> = ({ papers, onSelect, masteredIds, lang = 'ko' }) => {
  const normalizeTitle = (title: string) => title.toLowerCase().trim().replace(/\s+/g, ' ');
  const t = i18n[lang];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 antialiased">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {papers.map((paper, idx) => {
          const paperTitleNormalized = normalizeTitle(paper.title);
          const isMastered = masteredIds.some(idOrTitle => 
            idOrTitle === paper.id || normalizeTitle(idOrTitle) === paperTitleNormalized
          );
          
          return (
            <div 
              key={paper.id}
              onClick={() => onSelect(paper)}
              className="group cursor-pointer bg-white p-8 border-b-8 border-r-8 border-black hover:translate-x-1 hover:translate-y-1 hover:border-b-4 hover:border-r-4 transition-all booklet-shadow paper-page min-h-[320px] flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">ARCHIVE {idx + 1}</span>
                  <div className="flex gap-2">
                    {isMastered && (
                      <span className="px-2 py-0.5 bg-yellow-400 text-black text-[9px] pixel-font flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                        <Trophy size={8} /> {t.mastery}
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-black text-white text-[9px] pixel-font shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] uppercase">{paper.source}</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-extrabold mb-4 leading-tight text-black uppercase tracking-tighter">
                  {paper.title}
                </h3>
                
                <p className="text-xs text-gray-500 font-bold mb-6 italic">
                  By {paper.authors.join(', ')}
                </p>
                
                <div className="flex flex-wrap gap-3 items-center">
                  {paper.venue && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-200 text-[9px] font-black uppercase tracking-widest text-gray-600">
                      <Landmark size={10} /> {paper.venue}
                    </div>
                  )}
                  {paper.year && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-200 text-[9px] font-black uppercase tracking-widest text-gray-600">
                      <Calendar size={10} /> {paper.year}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-indigo-600 italic font-black uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded truncate max-w-[70%]">
                  {paper.recommendationReason || "Academic Track"}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Booklet;
