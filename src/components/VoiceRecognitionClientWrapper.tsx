"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { parseIntent } from '@/lib/voiceIntentMap';
import VoiceRecognitionFloating from './VoiceRecognitionFloating';
import { speak } from '@/lib/speak';

interface VoiceRecognitionClientWrapperProps {
  onFilterIntent?: (filterType: string, value: string) => void;
  onClearFilters?: (filterType?: string) => void;
}

const VoiceRecognitionClientWrapper: React.FC<VoiceRecognitionClientWrapperProps> = ({ 
  onFilterIntent, 
  onClearFilters 
}) => {
  const router = useRouter();
  
  const handleVoiceCommand = (transcript: string) => {
    console.log('[VoiceRecognition] ====== VOICE COMMAND START ======');
    console.log('[VoiceRecognition] Transcript:', transcript);
    const intent = parseIntent(transcript);
    console.log('[VoiceRecognition] Intent:', intent);
    
    let response = '';
    
    switch (intent.type) {
      case 'route':
        response = `Navigating to ${intent.path.replace('/', '').replace('-', ' ') || 'home'}`;
        console.log('[VoiceRecognition] Route intent - navigating to:', intent.path);
        router.push(intent.path);
        break;
        
      case 'filter':
        response = `Filtering by ${intent.filterType} ${intent.value}`;
        console.log('[VoiceRecognition] Filter intent detected:', intent.filterType, '=', intent.value);
        console.log('[VoiceRecognition] onFilterIntent function exists?', !!onFilterIntent);
        console.log('[VoiceRecognition] onFilterIntent function:', onFilterIntent);
        
        if (onFilterIntent) {
          console.log('[VoiceRecognition] CALLING onFilterIntent with:', intent.filterType, intent.value);
          try {
            onFilterIntent(intent.filterType, intent.value);
            console.log('[VoiceRecognition] onFilterIntent called SUCCESSFULLY');
          } catch (error) {
            console.error('[VoiceRecognition] ERROR calling onFilterIntent:', error);
          }
        } else {
          console.error('[VoiceRecognition] ERROR: onFilterIntent prop is NOT PROVIDED!');
          console.error('[VoiceRecognition] This means GalleryPage is not passing the handler function');
        }
        break;
        
      case 'clearFilter':
        response = intent.filterType ? `Clearing ${intent.filterType} filter` : 'Clearing all filters';
        console.log('[VoiceRecognition] Clear filter intent:', intent.filterType);
        
        if (onClearFilters) {
          console.log('[VoiceRecognition] Calling onClearFilters with:', intent.filterType);
          onClearFilters(intent.filterType);
        }
        break;
        
      case 'clearAllFilters':
        response = 'Clearing all filters';
        console.log('[VoiceRecognition] Clear all filters intent');
        
        if (onClearFilters) {
          console.log('[VoiceRecognition] Calling onClearFilters without filterType');
          onClearFilters();
        }
        break;
        
      // ... other cases remain the same
        
      default:
        response = `Sorry, I didn't understand.`;
    }
    
    console.log('[VoiceRecognition] Response:', response);
    console.log('[VoiceRecognition] ====== VOICE COMMAND END ======');
    
    speak(`${response}`);
  };
  
  return <VoiceRecognitionFloating onTranscript={handleVoiceCommand} />;
};

export default VoiceRecognitionClientWrapper;