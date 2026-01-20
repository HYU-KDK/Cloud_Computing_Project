
import React, { useState } from 'react';
import { Paper, AppLanguage } from '../types';
import { Check, Plus, ArrowRight, BookOpen, Calendar, Landmark, Sparkles, Loader2, Search, BookmarkPlus, CheckCircle2, Star, RefreshCw } from 'lucide-react';
import { i18n } from '../App';

interface DiscoveryProps {
  papers: Paper[];
  readList: Paper[];
  onToggleRead: (paper: Paper, status: boolean) => void;
  onContinue: () => void;
  isLoading?: boolean;
  onSearch?: (query: string) => void;
  onRefresh?: () => void;
  title?: string;
  description?: string;
  lang?: AppLanguage;
}

const Discovery: React.FC<DiscoveryProps> = ({ 
  papers, 
  readList, 
  onToggleRead, 
  onContinue, 
  isLoading = false,
  onSearch,
  onRefresh,
  title,
  description,
  lang = 'ko'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const t = i18n[lang];
  
  const normalizeTitle = (title: string) => title.toLowerCase().trim().replace(/\s+/g, ' ');

  const getSelectedStatus = (paperTitle: string) => {
    const normalized = normalizeTitle(paperTitle);
    const paper = readList.find(p => normalizeTitle(p.title) === normalized);
    if (!paper) return null;
    return paper.isRead ? 'read' : 'to-read';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 pb-32 antialiased">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white pixel-font text-[8px] mb-4 uppercase">
          <BookOpen size={10} /> DISCOVERY MODE
        </div>
        <h2 className="text-5xl font-extrabold tracking-tighter mb-4 text-black uppercase leading-none">{title || t.foundationalWorks}</h2>
        <p className="text-gray-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed mb-10 italic">
          {description || t.discoveryDescription}
        </p>

        <div className="max-w-2xl mx-auto mb-12 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full px-6 py-4 border-4 border-black font-bold outline-none bg-gray-50 focus:bg-white focus:ring-4 focus:ring-black/5 transition-all placeholder:italic"
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={20} />
              </div>
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-black text-white px-8 py-4 pixel-font text-[10px] flex items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-30 border-4 border-black uppercase"
            >
              {isLoading && !onRefresh ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />} 
              {t.search}
            </button>
          </form>

          {onRefresh && (
            <div className="flex justify-center">
              <button 
                onClick={onRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 border-2 border-black bg-white text-black font-extrabold text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
              >
                {isLoading ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />} 
                {t.refreshSuggestions}
              </button>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6 bg-white border-4 border-dashed border-gray-100">
          <Loader2 className="animate-spin text-black" size={64} />
          <div className="text-center">
            <p className="pixel-font text-[12px] tracking-widest animate-pulse mb-2 text-black uppercase">{t.resynthesizing}</p>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest italic">{t.filteringHistory}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {papers.map((paper) => {
            const status = getSelectedStatus(paper.title);
            const isMustRead = paper.recommendationReason?.toLowerCase().includes('must-read') || paper.recommendationReason?.toLowerCase().includes('seminal');
            
            return (
              <div 
                key={paper.id}
                className={`group p-8 border-4 transition-all flex flex-col justify-between h-full bg-white relative ${
                  status 
                    ? 'border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]' 
                    : 'border-gray-200 hover:border-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]'
                }`}
              >
                {isMustRead && (
                   <div className="absolute -top-3 -right-3 bg-yellow-400 border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-bounce z-10">
                     <Star size={16} fill="black" />
                   </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 uppercase tracking-widest">{paper.source}</span>
                    {paper.year && (
                      <span className="text-[10px] font-black text-gray-400 pixel-font">{paper.year}</span>
                    )}
                  </div>
                  
                  <h4 className="font-extrabold text-3xl mb-4 leading-tight text-black uppercase tracking-tighter">
                    {paper.title}
                  </h4>
                  
                  <p className="text-sm text-gray-500 font-bold mb-6 italic">
                    Investigators: {paper.authors.join(', ')}
                  </p>
                  
                  <div className="flex gap-4 items-center mb-8">
                    {paper.venue && (
                      <div className="flex items-center gap-1 text-[10px] font-black text-black uppercase bg-gray-100 px-2 py-1">
                        <Landmark size={12} /> {paper.venue}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-[11px] font-bold text-gray-500 border-l-4 border-gray-100 pl-4 py-1 italic mb-10 leading-relaxed">
                    {paper.recommendationReason}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => onToggleRead(paper, false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 border-2 font-black text-[10px] uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] active:shadow-none active:translate-x-1 active:translate-y-1 ${
                      status === 'to-read' 
                        ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                        : 'bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black'
                    }`}
                  >
                    <BookmarkPlus size={14} /> {status === 'to-read' ? t.saved : t.saveToRead}
                  </button>
                  <button 
                    onClick={() => onToggleRead(paper, true)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 border-2 font-black text-[10px] uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] active:shadow-none active:translate-x-1 active:translate-y-1 ${
                      status === 'read' 
                        ? 'bg-green-600 text-white border-green-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                        : 'bg-white text-gray-400 border-gray-100 hover:border-green-600 hover:text-green-600'
                    }`}
                  >
                    <CheckCircle2 size={14} /> {status === 'read' ? t.inLibrary : t.alreadyRead}
                  </button>
                </div>
              </div>
            );
          })}
          {papers.length === 0 && !isLoading && (
            <div className="col-span-full py-32 text-center border-4 border-dashed border-gray-100 bg-white/50">
              <Search className="mx-auto mb-4 text-gray-200" size={64} />
              <p className="text-gray-400 font-bold italic uppercase tracking-widest">{t.noFoundational}</p>
            </div>
          )}
        </div>
      )}

      <div className="fixed bottom-12 left-0 w-full flex justify-center px-6 pointer-events-none z-50">
        <button
          onClick={onContinue}
          className="pointer-events-auto bg-black text-white px-12 py-5 pixel-font text-xs flex items-center gap-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all border-4 border-black uppercase"
        >
          {t.confirmSelection} ({readList.length}) <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Discovery;
