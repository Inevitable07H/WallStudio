import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Maximize2, X, Share2, Info, Check } from 'lucide-react';
import { ChatMessage } from '../types';

interface ImageDisplayProps {
  message: ChatMessage;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ message }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'complete'>('idle');

  const handleDownload = async () => {
    if (!message.imageUrl) return;
    setDownloadState('downloading');
    
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = message.imageUrl!;
        link.download = `lumina-${message.settings?.resolution || '4k'}-${message.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setDownloadState('complete');
        
        // Reset after success
        setTimeout(() => setDownloadState('idle'), 2000);
    }, 1500);
  };

  if (!message.imageUrl) return null;

  return (
    <>
      <motion.div 
        layoutId={`image-${message.id}`}
        className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/50"
      >
        <img 
          src={message.imageUrl} 
          alt={message.content} 
          className="w-full h-auto object-contain max-h-[600px]"
          loading="lazy"
        />
        
        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-white font-medium text-sm line-clamp-1">{message.content}</p>
              <div className="flex gap-2 text-xs text-gray-400">
                <span className="bg-white/10 px-2 py-0.5 rounded">{message.settings?.resolution}</span>
                <span className="bg-white/10 px-2 py-0.5 rounded">{message.settings?.aspectRatio}</span>
                {message.settings?.style && message.settings.style !== 'none' && (
                    <span className="bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded capitalize">{message.settings?.style.replace('-', ' ')}</span>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setIsFullscreen(true)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md"
                title="Fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              
              <button 
                onClick={handleDownload}
                disabled={downloadState !== 'idle'}
                className={`
                    p-2 rounded-full transition-all duration-300 relative overflow-hidden flex items-center justify-center min-w-[40px]
                    ${downloadState === 'complete' ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-gray-200'}
                `}
                title="Download"
              >
                 <AnimatePresence mode='wait'>
                    {downloadState === 'downloading' ? (
                        <motion.div
                            key="downloading"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        </motion.div>
                    ) : downloadState === 'complete' ? (
                        <motion.div
                            key="complete"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <Check className="w-5 h-5" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <Download className="w-5 h-5" />
                        </motion.div>
                    )}
                 </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
          >
            <button 
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors z-50"
            >
              <X className="w-8 h-8" />
            </button>

            <motion.img 
              layoutId={`image-${message.id}`}
              src={message.imageUrl} 
              alt={message.content}
              className="max-w-full max-h-full object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            />
            
            {message.settings?.resolution === '8K' && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 text-xs tracking-widest rounded-full uppercase font-bold backdrop-blur-sm">
                    8K Ultra HD Preview
                </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageDisplay;
