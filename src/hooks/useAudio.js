import { useState, useRef, useCallback } from 'react';

// Speech synthesis - encouragement audio
export function useSpeech() {
  const speak = useCallback((text, options = {}) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1.2;
    utterance.volume = options.volume || 1;
    
    // Try to pick a friendly voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => 
      v.name.includes('Samantha') || 
      v.name.includes('Karen') ||
      v.name.includes('Google US English') ||
      (v.lang === 'en-US' && !v.name.includes('Male'))
    );
    if (preferred) utterance.voice = preferred;
    
    window.speechSynthesis.speak(utterance);
  }, []);

  const speakWord = useCallback((word) => {
    speak(word, { rate: 0.8, pitch: 1.0 });
  }, [speak]);

  const encourage = useCallback((type) => {
    const messages = {
      correct: [
        "Amazing! You got it!",
        "Wow, you're so smart!",
        "Incredible! You're a reading superstar!",
        "Yes! High five! Keep going!",
        "Roar! You're crushing it!",
        "Spectacular! You rock!"
      ],
      tryAgain: [
        "Almost! Let's try another one!",
        "Good try! Safari explorers never give up!",
        "You're learning! Keep going!",
        "That's okay! Let's try a different word!"
      ],
      miss: [
        "We'll practice that one more! You've got this!",
        "Keep going, safari explorer! You're doing great!"
      ],
      sessionEnd: [
        "Amazing adventure today! You're a true safari word champion!",
        "Incredible work! You should be so proud of yourself!",
        "Wow! Jack is becoming a reading superstar!"
      ],
      start: [
        "Let's go on a safari word adventure!",
        "Time to explore the jungle of words! You've got this!"
      ]
    };
    const arr = messages[type] || messages.correct;
    const chosen = arr[Math.floor(Math.random() * arr.length)];
    speak(chosen, { pitch: 1.3, rate: 0.95 });
  }, [speak]);

  return { speak, speakWord, encourage };
}

// Voice recognition hook
export function useVoiceRecognition({ onResult, onError }) {
  const [isListening, setIsListening] = useState(false);
  const [hasSupport, setHasSupport] = useState(
    !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  );
  const recognitionRef = useRef(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setHasSupport(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 3;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const alternatives = [];
      for (let i = 0; i < event.results[0].length; i++) {
        alternatives.push(event.results[0][i].transcript.toLowerCase().trim());
      }
      onResult(alternatives);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        onError && onError(event.error);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onResult, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  return { isListening, hasSupport, startListening, stopListening };
}

// Check if spoken word matches target (fuzzy match)
export function checkAnswer(spoken, target) {
  const clean = (s) => s.toLowerCase().trim().replace(/[^a-z]/g, '');
  const t = clean(target);
  
  for (const s of spoken) {
    const sc = clean(s);
    if (sc === t) return true;
    // Allow 1-character difference for short words
    if (t.length <= 4 && Math.abs(sc.length - t.length) <= 1) {
      let diff = 0;
      const shorter = sc.length < t.length ? sc : t;
      const longer = sc.length >= t.length ? sc : t;
      for (let i = 0; i < shorter.length; i++) {
        if (shorter[i] !== longer[i]) diff++;
      }
      if (diff <= 1) return true;
    }
  }
  return false;
}
