import React from 'react';
import { AspectRatio, ImageResolution, GenerationSettings } from '../types';
import { STYLE_PRESETS } from '../constants';
import { Ratio, Monitor, Palette } from 'lucide-react';

interface ControlPanelProps {
  settings: GenerationSettings;
  onSettingsChange: (newSettings: GenerationSettings) => void;
  disabled: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ settings, onSettingsChange, disabled }) => {
  
  const updateSetting = <K extends keyof GenerationSettings>(key: K, value: GenerationSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-8 p-6 glass-panel rounded-2xl md:min-w-[320px] md:max-w-[320px] flex-shrink-0 h-fit md:sticky md:top-24 transition-all duration-300">
      
      {/* Aspect Ratio */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-400 uppercase tracking-wider font-semibold">
          <Ratio className="w-4 h-4" />
          <span>Aspect Ratio</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(AspectRatio).map((ratio) => (
            <button
              key={ratio}
              onClick={() => updateSetting('aspectRatio', ratio)}
              disabled={disabled}
              className={`
                px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200
                ${settings.aspectRatio === ratio 
                  ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                  : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      {/* Resolution */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-400 uppercase tracking-wider font-semibold">
          <Monitor className="w-4 h-4" />
          <span>Resolution</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(ImageResolution).map((res) => (
            <button
              key={res}
              onClick={() => updateSetting('resolution', res)}
              disabled={disabled}
              className={`
                px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200 relative overflow-hidden group
                ${settings.resolution === res 
                  ? res === '8K' 
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-transparent shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                    : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white border-transparent shadow-lg' 
                  : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <span className="relative z-10">{res} {res === '8K' && ' ULTRA'}</span>
              {res === '8K' && settings.resolution === '8K' && (
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Style Presets */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-400 uppercase tracking-wider font-semibold">
          <Palette className="w-4 h-4" />
          <span>Art Style</span>
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
          {STYLE_PRESETS.map((style) => (
            <button
              key={style.id}
              onClick={() => updateSetting('style', style.id)}
              disabled={disabled}
              className={`
                px-3 py-3 text-xs text-left font-medium rounded-lg border transition-all duration-200 flex items-center justify-between group
                ${settings.style === style.id 
                  ? 'bg-white/10 border-purple-500/50 text-white' 
                  : 'bg-transparent text-gray-400 border-white/10 hover:bg-white/5 hover:text-white'}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <span>{style.name}</span>
              {settings.style === style.id && <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_5px_currentColor]" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
