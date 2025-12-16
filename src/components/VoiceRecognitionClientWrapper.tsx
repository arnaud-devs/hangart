"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { parseIntent } from '@/lib/voiceIntentMap';
import VoiceRecognitionFloating from './VoiceRecognitionFloating';
import { speak } from '@/lib/speak';

const VoiceRecognitionClientWrapper: React.FC = () => {
  const router = useRouter();
  const handleVoiceCommand = (transcript: string) => {
    const intent = parseIntent(transcript);
    let response = '';
    if (intent.type === 'route') {
      response = `Navigating to ${intent.path.replace('/', '').replace('-', ' ') || 'home'}`;
      router.push(intent.path);
    } else if (intent.type === 'filter') {
      response = `Filtering by ${intent.filterType} ${intent.value}`;
    } else if (intent.type === 'sort') {
      response = `Sorting by ${intent.sortType.replace('-', ' ')}`;
    } else if (intent.type === 'orderStatus') {
      response = `Showing orders with status ${intent.status}`;
    } else if (intent.type === 'paymentStatus') {
      response = `Showing payments with status ${intent.status}`;
    } else if (intent.type === 'search') {
      response = `Searching for ${intent.query}`;
    } else if (intent.type === 'addToCart') {
      response = intent.productTitle ? `Adding ${intent.productTitle} to cart` : 'Adding item to cart';
    } else if (intent.type === 'productDetail') {
      response = `Showing details for ${intent.productTitle}`;
    } else if (intent.type === 'artistDetail') {
      response = `Showing artist ${intent.artistUsername}`;
    } else if (intent.type === 'productInfo') {
      response = `Showing ${intent.infoType} for ${intent.productTitle}`;
    } else {
      response = `Sorry, I didn't understand.`;
    }
    speak(`${response}`);
  };
  return <VoiceRecognitionFloating onTranscript={handleVoiceCommand} />;
};

export default VoiceRecognitionClientWrapper;