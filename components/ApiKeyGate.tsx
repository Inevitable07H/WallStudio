import React, { useEffect, useState } from 'react';
import { WindowWithAI } from '../types';
import { Lock, Key } from 'lucide-react';
import { motion } from 'framer-motion';

interface ApiKeyGateProps {
  onKeySelected: () => void;
}

const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ onKeySelected }) => {
  const [loading, setLoading] = useState(true);

  const checkKey = async () => {
    const win = window as WindowWithAI;
    if (win.aistudio && win.aistudio.hasSelectedApiKey) {
      const hasKey = await win.aistudio.hasSelectedApiKey();
      if (hasKey) {
        onKeySelected();
      }
      setLoading(false);
    } else {
      // If the API isn't available, we might be in dev mode or outside the specific environment.
      // For this app, we assume the environment is correct as per instructions.
      setLoading(false);
    }
  };

  useEffect(() => {
    checkKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectKey = async () => {
    const win = window as WindowWithAI;
    if (win.aistudio && win.aistudio.openSelectKey) {
      await win.aistudio.openSelectKey();
      // Assume success and proceed, as per instructions to avoid race conditions
      onKeySelected();
    } else {
        alert("AI Studio environment not detected. Please run this in the correct environment.");
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 rounded-2xl max-w-md w-full text-center space-y-6 border border-gray-800"
      >
        <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
          <Lock className="w-8 h-8 text-white" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Access Required
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            To generate 4K images with Gemini 3 Pro, you need to connect a paid Google Cloud Project API key.
          </p>
        </div>

        <button
          onClick={handleSelectKey}
          className="w-full py-3 px-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 group"
        >
          <Key className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          Select API Key
        </button>
        
        <p className="text-xs text-gray-500">
          Check billing details at <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">ai.google.dev</a>
        </p>
      </motion.div>
    </div>
  );
};

export default ApiKeyGate;