import React from 'react';
import VoiceRecognitionButton from './VoiceRecognitionButton';

const VoiceRecognitionFloating: React.FC<{ onTranscript: (transcript: string) => void }> = ({ onTranscript }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 1000,
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      borderRadius: '50%',
      background: 'white',
      padding: 4,
    }}>
      <VoiceRecognitionButton onTranscript={onTranscript} />
    </div>
  );
};

export default VoiceRecognitionFloating;
