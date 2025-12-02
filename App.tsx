import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Zap, Bot, Paperclip, X, Image as ImageIcon, Box } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; 
import ApiKeyGate from './components/ApiKeyGate';
import Landing from './components/Landing';
import Loader from './components/Loader';
import ControlPanel from './components/ControlPanel';
import ImageDisplay from './components/ImageDisplay';
import { generateImageContent } from './services/geminiService';
import { ChatMessage, GenerationSettings, AspectRatio, ImageResolution } from './types';
import { ANIMATION_VARIANTS } from './constants';

const App: React.FC = () => {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // File Upload State
  const [attachment, setAttachment] = useState<{data: string, mimeType: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState<GenerationSettings>({
    aspectRatio: AspectRatio.SQUARE,
    resolution: ImageResolution.RES_4K,
    style: 'none',
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setAttachment({
                data: result,
                mimeType: file.type
            });
        };
        reader.readAsDataURL(file);
    }
    // Reset value to allow selecting same file again if needed
    if (e.target) e.target.value = '';
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && !attachment) || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
      settings: { ...settings },
      attachment: attachment ? { ...attachment } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachment(null);
    setIsLoading(true);

    try {
      const { imageUrl, text } = await generateImageContent(userMessage.content, settings, userMessage.attachment);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text || (imageUrl ? `Generated a ${settings.resolution} image in ${settings.style} style.` : 'Failed to generate content.'),
        imageUrl: imageUrl || undefined,
        timestamp: Date.now(),
        settings: { ...settings }
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error generating that image. Please try again.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasApiKey) {
    return <ApiKeyGate onKeySelected={() => setHasApiKey(true)} />;
  }

  return (
    <div className="min-h-screen text-white flex flex-col font-sans selection:bg-purple-500/30 relative">
      {/* Cinematic Video Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
        >
          {/* Using a high-quality abstract background */}
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-abstract-purple-and-blue-forms-3836-large.mp4" 
            type="video/mp4" 
          />
        </video>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
      </div>

      <AnimatePresence>
        {showLanding && (
          <Landing onEnter={() => setShowLanding(false)} />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="sticky top-0 left-0 right-0 z-30 border-b border-white/5 bg-black/60 backdrop-blur-xl h-16 flex items-center px-6 justify-between transition-colors duration-500">
          <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Zap className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white/90">LUMINA</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <Box className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-gray-300 font-mono">3D READY</span>
            </div>
            <div className="text-xs text-gray-400 font-mono hidden md:block tracking-widest">
                GEMINI 3 PRO / 8K STUDIO
            </div>
          </div>
        </header>

        <main className="flex-1 pt-8 pb-24 px-4 md:px-8 max-w-[1600px] mx-auto w-full flex flex-col md:flex-row gap-8">
          
          {/* Settings Sidebar */}
          <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden md:block"
          >
              <ControlPanel 
                  settings={settings} 
                  onSettingsChange={setSettings} 
                  disabled={isLoading} 
              />
          </motion.div>

          {/* Chat / Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
              {messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6 opacity-80 mt-10 md:mt-0">
                      <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 backdrop-blur-sm group hover:border-purple-500/50 transition-colors">
                          <Bot className="w-10 h-10 text-gray-400 group-hover:text-purple-400 transition-colors" />
                      </div>
                      <h3 className="text-3xl font-light text-white tracking-tight">Creative Studio</h3>
                      <p className="max-w-md text-gray-400 text-lg leading-relaxed">
                          Enter your prompt or upload reference material (3D renders, textures) to generate stunning <span className="text-amber-400 font-medium">8K</span> visuals.
                      </p>
                  </div>
              ) : (
                  <div className="flex-1 space-y-8 mb-8">
                      {messages.map((msg) => (
                          <motion.div 
                              key={msg.id}
                              initial="hidden"
                              animate="visible"
                              variants={ANIMATION_VARIANTS}
                              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                              <div className={`max-w-3xl w-full ${msg.role === 'user' ? 'bg-white/10 backdrop-blur-md ml-auto rounded-2xl rounded-tr-sm border border-white/5' : ''} p-0`}>
                                  {msg.role === 'user' ? (
                                      <div className="p-4 space-y-3">
                                          {msg.attachment && (
                                              <div className="w-full max-w-xs mb-2 rounded-lg overflow-hidden border border-white/10">
                                                  <img 
                                                      src={msg.attachment.data} 
                                                      alt="Reference" 
                                                      className="w-full h-auto object-cover opacity-80 hover:opacity-100 transition-opacity" 
                                                  />
                                                  <div className="bg-black/40 p-1 px-2 text-[10px] text-gray-400 flex items-center gap-1">
                                                      <Paperclip className="w-3 h-3" /> Reference Upload
                                                  </div>
                                              </div>
                                          )}
                                          <div className="text-gray-100 leading-relaxed font-light text-lg">
                                              {msg.content}
                                          </div>
                                      </div>
                                  ) : (
                                      <div className="space-y-4">
                                          {msg.imageUrl && (
                                              <ImageDisplay message={msg} />
                                          )}
                                          {msg.content && !msg.imageUrl && (
                                              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200">
                                                  {msg.content}
                                              </div>
                                          )}
                                      </div>
                                  )}
                              </div>
                          </motion.div>
                      ))}
                      {isLoading && <Loader />}
                      <div ref={messagesEndRef} />
                  </div>
              )}
          </div>
        </main>

        {/* Input Area */}
        <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none">
           <div className="max-w-3xl mx-auto w-full pointer-events-auto space-y-2">
              
              {/* Attachment Preview */}
              <AnimatePresence>
                  {attachment && (
                      <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="flex items-center gap-2 p-2 bg-[#1a1a1a] border border-white/10 rounded-lg w-fit backdrop-blur-md"
                      >
                          <div className="w-8 h-8 rounded bg-gray-800 overflow-hidden relative">
                              <img src={attachment.data} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs text-gray-300">Reference Image</span>
                          <button 
                              onClick={removeAttachment}
                              className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors"
                          >
                              <X className="w-3 h-3 text-gray-400 hover:text-white" />
                          </button>
                      </motion.div>
                  )}
              </AnimatePresence>

              <motion.form 
                  onSubmit={handleSendMessage}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="relative group"
              >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-300" />
                  <div className="relative flex items-center bg-[#111]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                      
                      <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          className="hidden"
                          accept="image/*,.obj,.gltf,.fbx" // Accepting generalized formats, but treating as images for Gemini API compat
                      />
                      
                      <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="ml-3 p-2.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          title="Upload Reference / 3D Image"
                      >
                          <Paperclip className="w-5 h-5" />
                      </button>

                      <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Describe your vision or upload a 3D format reference..."
                          className="w-full bg-transparent border-none px-4 py-5 text-white placeholder-gray-500 focus:outline-none focus:ring-0 text-lg"
                          disabled={isLoading}
                      />
                      
                      <button
                          type="submit"
                          disabled={(!input.trim() && !attachment) || isLoading}
                          className="p-3 mr-2 rounded-xl bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:bg-gray-800 disabled:text-gray-500 transition-all duration-200"
                      >
                          <Send className="w-5 h-5" />
                      </button>
                  </div>
              </motion.form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;
