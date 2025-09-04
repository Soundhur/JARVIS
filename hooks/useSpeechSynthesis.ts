
import { useState, useEffect, useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const getVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        // Attempt to find a suitable voice
        const jarvisVoice = 
          availableVoices.find(v => v.name === 'Google UK English Male') ||
          availableVoices.find(v => v.lang === 'en-GB' && v.name.includes('Male')) ||
          availableVoices.find(v => v.lang === 'en-GB') ||
          availableVoices.find(v => v.lang.startsWith('en-') && v.name.includes('Male')) ||
          null;
        setSelectedVoice(jarvisVoice);
      }
    };
    
    getVoices();
    // Voices list is loaded asynchronously
    window.speechSynthesis.onvoiceschanged = getVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!text || !window.speechSynthesis) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = 1.05;
    utterance.pitch = 0.9;

    // Cancel any ongoing speech before starting a new one
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [selectedVoice]);

  return { speak, voices, selectedVoice, setSelectedVoice };
};
