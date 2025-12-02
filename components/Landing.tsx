import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface LandingProps {
  onEnter: () => void;
}

const Landing: React.FC<LandingProps> = ({ onEnter }) => {
  return (
    <motion.div 
      className="fixed inset-0 flex flex-col items-center justify-center z-50 overflow-hidden bg-black"
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-80"
        >
           {/* Using a high-quality magical atmosphere video to match the fantasy book vibe */}
           <source src="bg-1.mp4" type="video/mp4" />
        </video>
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
        <div className="absolute inset-0 bg-purple-900/20 mix-blend-overlay" />
      </div>

      <div className="z-10 text-center space-y-8 p-6 relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.2, ease: "easeOut" }}
          className="space-y-2"
        >
            <div className="flex items-center justify-center gap-3 mb-6">
                <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                    <Sparkles className="w-8 h-8 text-yellow-300" />
                </motion.div>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 mb-4 drop-shadow-2xl">
              WallStudio
            </h1>
            <h2 className="text-xl md:text-3xl font-light tracking-[0.3em] text-white/80 uppercase">
              Imagine. Create. 8K.
            </h2>
        </motion.div>

        <motion.button
          onClick={onEnter}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(168, 85, 247, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="group relative px-12 py-6 bg-white text-black font-bold text-xl rounded-full overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_80px_rgba(255,255,255,0.6)] transition-all duration-300 mt-8"
        >
          <span className="relative z-10 flex items-center gap-3">
            Enter Studio <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_auto] animate-gradient" />
        </motion.button>
      </div>
      
      {/* Footer hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 text-white/40 text-xs tracking-widest uppercase font-mono z-10"
      >
        Powered by Gemini 3 Pro
      </motion.div>
    </motion.div>
  );
};

export default Landing;