import React from 'react';
import { motion } from 'framer-motion';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className="relative w-24 h-24">
        {/* Core Pulsing Circle */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 opacity-50 blur-lg"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Spinning Rings */}
        <motion.div
          className="absolute inset-0 border-2 border-t-purple-400 border-r-transparent border-b-blue-400 border-l-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 border-2 border-t-transparent border-r-white/50 border-b-transparent border-l-white/50 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center Dot */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </div>
      </div>
      
      <motion.p 
        className="text-sm text-gray-400 font-mono tracking-widest uppercase"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Generating 4K Assets...
      </motion.p>
    </div>
  );
};

export default Loader;