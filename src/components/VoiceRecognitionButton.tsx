import React, { useRef, useState } from 'react';
import { speak } from '@/lib/speak';

// Check for browser support
const SpeechRecognition =
  typeof window !== 'undefined' &&
  ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

interface VoiceRecognitionProps {
  onTranscript: (transcript: string) => void;
  listening?: boolean;
  setListening?: (val: boolean) => void;
}

const VoiceRecognitionButton: React.FC<VoiceRecognitionProps> = ({ onTranscript }) => {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    setError(null);
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.');
      return;
    }
    speak('I am listening');
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      onTranscript(result);
      setListening(false);
    };
    recognition.onerror = (event: any) => {
      setError(event.error || 'Speech recognition error');
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return (
    <div style={{ display: 'inline-block' }}>
      <button
        onClick={listening ? stopListening : startListening}
        style={{
          background: listening ? '#facc15' : '#fff',
          color: listening ? '#fff' : '#facc15',
          border: '2px solid #facc15',
          borderRadius: '50%',
          width: 48,
          height: 48,
          fontSize: 24,
          cursor: 'pointer',
          outline: 'none',
        }}
        aria-label={listening ? 'Stop listening' : 'Start voice command'}
      >
        {listening ? '🎤' : '🗣️'}
      </button>
      {error && <div style={{ color: 'red', fontSize: 12 }}>{error}</div>}
      {listening && (
        <div style={{ color: '#facc15', fontSize: 12, marginTop: 4 }}>I am listening…</div>
      )}
      {transcript && !listening && (
        <div style={{ color: '#333', fontSize: 12, marginTop: 4 }}>Heard: {transcript}</div>
      )}
    </div>
  );
};

export default VoiceRecognitionButton;
