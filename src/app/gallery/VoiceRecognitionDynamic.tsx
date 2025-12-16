import React from 'react';
import VoiceRecognitionClientWrapper from '../../components/VoiceRecognitionClientWrapper';

interface VoiceRecognitionDynamicProps {
  onFilterIntent: (filterType: string, value: string) => void;
  onClearFilters?: (filterType?: string) => void;
}

const VoiceRecognitionDynamic: React.FC<VoiceRecognitionDynamicProps> = (props) => {
  console.log('[VoiceRecognitionDynamic] Rendering with props:', props);
  console.log('[VoiceRecognitionDynamic] onFilterIntent prop:', props.onFilterIntent);
  console.log('[VoiceRecognitionDynamic] onClearFilters prop:', props.onClearFilters);
  return <VoiceRecognitionClientWrapper {...props} />;
};

export default VoiceRecognitionDynamic;