
import React from 'react';
// Fixed the missing export by using the correct GeneratedMedia type from types.ts
import { GeneratedMedia } from '../types';

interface HistoryGalleryProps {
  history: GeneratedMedia[];
  onSelect: (media: GeneratedMedia) => void;
}

const HistoryGallery: React.FC<HistoryGalleryProps> = ({ history, onSelect }) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm font-medium">No creations yet</p>
        <p className="text-xs">Your generated images will appear here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {history.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-800 transition-all hover:ring-2 hover:ring-blue-500/50"
        >
          <img
            src={item.url}
            alt={item.prompt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
            <p className="text-[10px] text-white/90 line-clamp-2 text-left">{item.prompt}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default HistoryGallery;
