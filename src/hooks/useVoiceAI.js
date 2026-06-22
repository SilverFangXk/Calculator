import { useState, useEffect, useRef, useCallback } from 'react';

export function useVoiceAI(onResult) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const onResultRef = useRef(onResult);
  const stateRef = useRef('idle');

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      stateRef.current = 'active';
      setIsListening(true);
    };

    recognition.onend = () => {
      stateRef.current = 'idle';
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      if (event.error !== 'aborted') console.error("Error:", event.error);
      stateRef.current = 'idle';
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Voice Input:", transcript);
      onResultRef.current?.(transcript);
    };

    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, []);

  const toggleListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    const state = stateRef.current;
    console.log("toggle, state:", state);

    if (state === 'idle') {
      stateRef.current = 'starting';
      try { recognition.start(); } catch(e) { stateRef.current = 'idle'; }

    } else if (state === 'active' || state === 'starting') {
      // abort() always fires onend, stop() sometimes doesn't
      stateRef.current = 'idle';
      setIsListening(false);
      recognition.abort();
    }
  }, []);

  return { isListening, toggleListening };
}