
import React from 'react';
import { AspectRatio, ModelType, ImageSize } from '../types';

interface SettingsPanelProps {
  model: ModelType;
  setModel: (m: ModelType) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ar: AspectRatio) => void;
  imageSize: ImageSize;
  setImageSize: (s: ImageSize) => void;
  negativePrompt: string;
  setNegativePrompt: (np: string) => void;
  isGenerating: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  model,
  setModel,
  aspectRatio,
  setAspectRatio,
  imageSize,
  setImageSize,
  negativePrompt,
  setNegativePrompt,
  isGenerating
}) => {
  const aspectRatios: AspectRatio[] = ['1:1', '4:3', '3:4', '16:9', '9:16'];
  const sizes: ImageSize[] = ['1K', '2K', '4K'];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider text-[11px]">AI Engine</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            disabled={isGenerating}
            onClick={() => setModel('gemini-2.5-flash-image')}
            className={`px-3 py-3 rounded-xl border text-[10px] font-bold transition-all ${model === 'gemini-2.5-flash-image' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-500'}`}
          >
            FLASH (Fast)
          </button>
          <button
            disabled={isGenerating}
            onClick={() => setModel('gemini-3-pro-image-preview')}
            className={`px-3 py-3 rounded-xl border text-[10px] font-bold transition-all ${model === 'gemini-3-pro-image-preview' ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-500'}`}
          >
            PRO (HQ)
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider text-[11px]">Dimensions</label>
        <div className="flex flex-wrap gap-2">
          {aspectRatios.map((ar) => (
            <button
              key={ar}
              disabled={isGenerating}
              onClick={() => setAspectRatio(ar)}
              className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${aspectRatio === ar ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-500'}`}
            >
              {ar}
            </button>
          ))}
        </div>
      </div>

      {model === 'gemini-3-pro-image-preview' && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <label className="block text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider text-[11px]">Output Quality</label>
          <div className="flex gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                disabled={isGenerating}
                onClick={() => setImageSize(s)}
                className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${imageSize === s ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-500'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider text-[11px]">Negative Prompt (Exclusions)</label>
        <textarea
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          disabled={isGenerating}
          placeholder="low resolution, blurry, distorted text..."
          className="w-full h-20 bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 resize-none transition-all"
        />
      </div>
    </div>
  );
};

export default SettingsPanel;
