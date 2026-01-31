
import React, { useState, useEffect, useCallback } from 'react';
import { GeneratedMedia, AspectRatio, ModelType, ImageSize } from './types';
import { generateImage, checkAndRequestApiKey } from './services/geminiService';
import SettingsPanel from './components/SettingsPanel';
import HistoryGallery from './components/HistoryGallery';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [model, setModel] = useState<ModelType>('gemini-2.5-flash-image');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<GeneratedMedia | null>(null);
  const [history, setHistory] = useState<GeneratedMedia[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Analyzing prompt semantics...",
    "Sampling latent space...",
    "Synthesizing high-res textures...",
    "Rendering visual composition...",
    "Applying final artistic polish..."
  ];

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setError(null);
    setIsGenerating(true);

    try {
      if (model === 'gemini-3-pro-image-preview') {
        await checkAndRequestApiKey();
      }

      const imageUrl = await generateImage({
        prompt,
        negativePrompt,
        aspectRatio,
        model,
        imageSize: model === 'gemini-3-pro-image-preview' ? imageSize : undefined,
      });

      const newMedia: GeneratedMedia = {
        id: crypto.randomUUID(),
        url: imageUrl,
        prompt,
        negativePrompt,
        aspectRatio,
        model,
        timestamp: Date.now(),
      };

      setCurrentMedia(newMedia);
      setHistory((prev) => [newMedia, ...prev]);
    } catch (err: any) {
      if (err.message === "API_KEY_RESET_REQUIRED") {
        setError("API Key Error. Please ensure a valid paid API key is selected.");
        // @ts-ignore
        if (typeof window.aistudio !== 'undefined') window.aistudio.openSelectKey();
      } else {
        setError("Failed to create image. The prompt might have triggered a safety filter or the server is busy.");
      }
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadMedia = useCallback((media: GeneratedMedia) => {
    const link = document.createElement('a');
    link.href = media.url;
    link.download = `osama-ai-creation-${media.id.slice(0, 8)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  if (!hasStarted) {
    return (
      <div className="min-h-screen welcome-bg flex flex-col items-center justify-center p-6 overflow-hidden">
        <div className="max-w-3xl text-center space-y-12 animate-in fade-in zoom-in duration-1000">
          <div className="space-y-4">
            <div className="h-20 w-20 bg-gradient-to-br from-sky-400 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-indigo-500/20 float-anim">
              <span className="text-white text-4xl font-black">O</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white">
              Welcome to <span className="gradient-text">Osama AI</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl mx-auto">
              Professional Text-to-Image Generation. <br/>Crafting visual reality from pure linguistic thought.
            </p>
          </div>
          
          <button
            onClick={() => setHasStarted(true)}
            className="px-10 py-5 bg-white text-slate-950 rounded-full font-bold text-lg hover:bg-sky-400 hover:text-white transition-all transform hover:scale-105 shadow-xl shadow-white/5 active:scale-95"
          >
            Start Creating Now
          </button>

          <div className="pt-12 grid grid-cols-3 gap-8 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-600">
            <span>High Fidelity</span>
            <span>Gemini 3.0</span>
            <span>Ultra Fast</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 selection:bg-sky-500/30">
      <header className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => setHasStarted(false)} className="flex items-center gap-3 group">
            <div className="h-8 w-8 bg-gradient-to-br from-sky-400 to-indigo-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-white font-bold text-xs uppercase">O</span>
            </div>
            <h1 className="text-xl font-bold gradient-text">Osama AI</h1>
          </button>
          <div className="hidden sm:flex items-center gap-2">
             <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[9px] text-slate-400 uppercase tracking-widest font-black">Gen Studio v4.0</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="glass p-6 rounded-[2.5rem] shadow-2xl space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider text-[11px]">Prompt Description</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A futuristic city in the clouds, ethereal lighting, hyper-realistic, 8k..."
                  className="w-full h-32 bg-slate-900/30 border border-slate-800 rounded-2xl p-4 text-slate-100 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 resize-none transition-all text-sm leading-relaxed"
                />
              </div>

              <SettingsPanel
                model={model}
                setModel={setModel}
                aspectRatio={aspectRatio}
                setAspectRatio={setAspectRatio}
                imageSize={imageSize}
                setImageSize={setImageSize}
                negativePrompt={negativePrompt}
                setNegativePrompt={setNegativePrompt}
                isGenerating={isGenerating}
              />

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`w-full py-4 rounded-2xl font-bold text-white transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                  isGenerating || !prompt.trim()
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40'
                }`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="uppercase tracking-widest text-xs">Generating...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="uppercase tracking-widest text-xs">Generate Creation</span>
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400 text-[11px] font-medium flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
            </div>

            {/* Ad Placeholder for AdSense compliance */}
            <div className="glass p-6 rounded-3xl border border-white/5 text-center min-h-[100px] flex flex-col justify-center">
              <p className="text-[10px] text-slate-700 uppercase tracking-widest font-bold">Advertisement Area</p>
              <div className="text-slate-800 text-xs mt-2 italic">Space reserved for AdSense content</div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="glass p-4 sm:p-8 rounded-[2.5rem] min-h-[550px] flex flex-col items-center justify-center relative overflow-hidden bg-slate-900/20">
              {isGenerating ? (
                <div className="text-center space-y-8 z-10 w-full max-w-sm animate-pulse">
                   <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 bg-sky-500 transition-all duration-1000 ease-in-out" 
                      style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
                    />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-white tracking-tight">{loadingMessages[loadingStep]}</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Osama AI is processing latent vectors</p>
                  </div>
                </div>
              ) : currentMedia ? (
                <div className="w-full space-y-6 animate-in zoom-in duration-700">
                  <div className={`relative mx-auto rounded-3xl overflow-hidden shadow-2xl bg-slate-950 group border border-white/5`}>
                    <img src={currentMedia.url} className="w-full h-auto object-contain max-h-[70vh] block" alt={currentMedia.prompt} />
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => downloadMedia(currentMedia)}
                        className="p-3 bg-black/40 hover:bg-sky-500 backdrop-blur-xl rounded-2xl text-white transition-all shadow-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4">
                    <div className="space-y-2 max-w-lg">
                      <p className="text-sm font-medium text-slate-300 leading-relaxed italic">"{currentMedia.prompt}"</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-slate-800/50 text-[9px] text-slate-400 font-black border border-white/5 uppercase tracking-widest">{currentMedia.aspectRatio}</span>
                        <span className="px-3 py-1 rounded-full bg-sky-500/10 text-[9px] text-sky-400 font-black border border-sky-500/20 uppercase tracking-widest">{currentMedia.model.includes('pro') ? 'Gemini 3 Pro' : 'Gemini 2.5 Flash'}</span>
                      </div>
                    </div>
                    
                    {/* Dedicated Download Button */}
                    <button 
                      onClick={() => downloadMedia(currentMedia)}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold text-sm transition-all shadow-xl shadow-sky-500/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-8 opacity-10 flex flex-col items-center">
                   <div className="h-40 w-40 border-[0.5px] border-slate-500 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                   </div>
                  <p className="text-sm font-black uppercase tracking-[0.5em]">Creative Void</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-lg font-black uppercase tracking-widest text-slate-400">Creation History</h2>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-900/50 px-3 py-1 rounded-full">{history.length} Assets</span>
              </div>
              <HistoryGallery history={history} onSelect={(media) => setCurrentMedia(media)} />
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-white/5 py-12 px-4 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left mb-12">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-sky-500 rounded flex items-center justify-center text-xs font-bold">O</div>
                <h3 className="font-bold text-white uppercase tracking-widest text-sm">Osama AI</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                Osama AI is a premier generative artificial intelligence platform dedicated to high-fidelity visual arts. 
                We leverage the world's most advanced large language and vision models to empower creators.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Technology</h4>
              <ul className="text-xs text-slate-500 space-y-2">
                <li>Google Gemini 3.0</li>
                <li>Flash 2.5 Engine</li>
                <li>Latent Diffusion</li>
                <li>Real-time Synthesis</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Company</h4>
              <ul className="text-xs text-slate-500 space-y-2 font-medium">
                <li><a href="#" className="hover:text-sky-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-[9px] uppercase tracking-[0.4em] font-black">
              © 2025 Osama AI • All Visual Rights Reserved
            </p>
            <div className="flex gap-6 items-center">
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-[9px] text-slate-500 hover:text-sky-400 transition-colors uppercase font-black tracking-widest">Pricing & Billing</a>
              <span className="text-slate-800 text-[9px] uppercase font-black tracking-widest">Safety Filter Active</span>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-sky-500/5 border border-sky-500/10 rounded-2xl">
            <p className="text-[9px] text-sky-400/60 uppercase tracking-widest font-bold leading-relaxed text-center italic">
              Disclaimer: Content generated by Osama AI is artificial. Users are responsible for the creative use of their prompts.
              We adhere strictly to safety guidelines and do not allow the generation of harmful content.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
