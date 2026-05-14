import React, { useState, useEffect, useRef } from 'react';
import { Lion, Elephant, Giraffe, Zebra } from './Animals';
import { useSpeech, checkAnswer } from '../hooks/useAudio';
import { buildSession, getSimilarWord, SIGHT_WORDS } from '../data/sightWords';

const TOTAL_WORDS = 15;
const animals = [Elephant, Giraffe, Zebra];

// How long to wait after the word is spoken before auto-listening starts
const LISTEN_DELAY_MS = 1400;
// How long to show green/red flash before moving on
const FLASH_MS = 1100;

export default function GameScreen({ data, onSessionComplete }) {
  const [words]        = useState(() => buildSession(data.currentTier, data.sessions));
  const [index, setIndex]         = useState(0);
  const [attempt, setAttempt]     = useState(1);
  const [retryWord, setRetryWord] = useState(null);
  const [correct, setCorrect]     = useState([]);
  const [missed, setMissed]       = useState([]);
  const [stars, setStars]         = useState(0);
  const [gems, setGems]           = useState(0);
  const [lionMood, setLionMood]   = useState('happy');
  const [animalIdx, setAnimalIdx] = useState(0);

  // UI state
  const [listenState, setListenState] = useState('waiting'); // waiting | ready | listening | flash-correct | flash-wrong
  const [flashText, setFlashText]     = useState('');
  const [pulse, setPulse]             = useState(false);
  const [dots, setDots]               = useState('');

  const { speakWord, encourage } = useSpeech();

  // Refs — none of these trigger re-renders, keeping logic clean
  const recogRef      = useRef(null);
  const lockedRef     = useRef(false); // true while flash is showing — ignore all input
  const listenLoopRef = useRef(null);  // tracks if we should restart after onend
  const dotsTimerRef  = useRef(null);

  const currentWord = retryWord || words[index];

  // ─── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopListening();
      clearTimeout(dotsTimerRef.current);
    };
  }, []);

  // ─── Start fresh whenever the word changes ────────────────────────────────
  useEffect(() => {
    lockedRef.current = false;
    listenLoopRef.current = false;
    stopListening();
    setListenState('waiting');
    setFlashText('');

    // Speak the word, then auto-start listening
    const t = setTimeout(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 500);

      // Start listening after a short pause so Jack can read the word
      const t2 = setTimeout(() => {
        if (!lockedRef.current) beginListening();
      }, 800);
      return () => clearTimeout(t2);
    }, 300);

    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, retryWord]);

  // ─── Animated listening dots ──────────────────────────────────────────────
  useEffect(() => {
    clearInterval(dotsTimerRef.current);
    if (listenState === 'listening') {
      dotsTimerRef.current = setInterval(() => {
        setDots(d => d.length >= 3 ? '' : d + '.');
      }, 400);
    } else {
      setDots('');
    }
    return () => clearInterval(dotsTimerRef.current);
  }, [listenState]);

  // ─── Stop any active recognition session ─────────────────────────────────
  function stopListening() {
    listenLoopRef.current = false;
    if (recogRef.current) {
      try { recogRef.current.abort(); } catch (_) {}
      recogRef.current = null;
    }
  }

  // ─── Start a single recognition session ──────────────────────────────────
  function beginListening() {
    if (lockedRef.current) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setListenState('no-support');
      return;
    }

    listenLoopRef.current = true;
    setListenState('ready');

    // Brief "get ready" pause, then go
    setTimeout(() => {
      if (lockedRef.current || !listenLoopRef.current) return;
      launchRecognition();
    }, 600);
  }

  function launchRecognition() {
    if (lockedRef.current || !listenLoopRef.current) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SR();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = 'en-US';
    recog.maxAlternatives = 5;

    recog.onstart = () => {
      if (!lockedRef.current) setListenState('listening');
    };

    recog.onresult = (e) => {
      if (lockedRef.current) return;
      const alts = [];
      for (let i = 0; i < e.results[0].length; i++) {
        alts.push(e.results[0][i].transcript.toLowerCase().trim());
      }
      handleAnswer(alts);
    };

    recog.onerror = (e) => {
      // network / audio-capture errors — restart automatically
      if (!lockedRef.current && listenLoopRef.current) {
        if (e.error === 'no-speech' || e.error === 'audio-capture' || e.error === 'network') {
          setTimeout(() => {
            if (!lockedRef.current && listenLoopRef.current) launchRecognition();
          }, 400);
        }
      }
    };

    recog.onend = () => {
      // If we didn't get a result and aren't locked, restart immediately
      if (!lockedRef.current && listenLoopRef.current) {
        setTimeout(() => {
          if (!lockedRef.current && listenLoopRef.current) launchRecognition();
        }, 200);
      }
    };

    recogRef.current = recog;
    try {
      recog.start();
    } catch (_) {
      // Already started or unavailable — retry
      setTimeout(() => {
        if (!lockedRef.current && listenLoopRef.current) launchRecognition();
      }, 500);
    }
  }

  // ─── Process an answer ────────────────────────────────────────────────────
  function handleAnswer(spoken) {
    if (lockedRef.current) return;
    lockedRef.current = true;
    stopListening();

    const isCorrect = checkAnswer(spoken, currentWord);

    if (isCorrect) {
      const earnedStars = attempt === 1 ? 3 : 1;
      const earnedGems  = attempt === 1 ? 1 : 0;
      const nextStars   = stars + earnedStars;
      const nextGems    = gems + earnedGems;
      const nextCorrect = [...correct, currentWord];

      setStars(nextStars);
      setGems(nextGems);
      setCorrect(nextCorrect);
      setLionMood('cheering');
      setAnimalIdx(i => (i + 1) % animals.length);
      setListenState('flash-correct');
      setFlashText(`⭐⭐⭐ +${earnedStars} stars!`);
      encourage('correct');

      setTimeout(() => advance(nextCorrect, missed, nextStars, nextGems), FLASH_MS);

    } else {
      setLionMood('sad');

      if (attempt === 1) {
        const nextMissed = [...missed, currentWord];
        const similar    = getSimilarWord(currentWord, [...correct, ...nextMissed]);
        setMissed(nextMissed);
        encourage('tryAgain');
        setListenState('flash-wrong');
        setFlashText("Good try! Let's try another!");

        setTimeout(() => {
          setLionMood('thinking');
          if (similar) {
            setRetryWord(similar);
            setAttempt(2);
          } else {
            advance(correct, nextMissed, stars, gems);
          }
        }, FLASH_MS);

      } else {
        const nextMissed = [...missed, currentWord];
        setMissed(nextMissed);
        encourage('miss');
        setListenState('flash-wrong');
        setFlashText("Keep going! You've got this!");

        setTimeout(() => advance(correct, nextMissed, stars, gems), FLASH_MS);
      }
    }
  }

  // ─── Move to next word or end session ────────────────────────────────────
  function advance(nextCorrect, nextMissed, nextStars, nextGems) {
    const next = index + 1;
    if (next >= TOTAL_WORDS) {
      onSessionComplete({
        correctWords: nextCorrect,
        missedWords:  nextMissed,
        stars:        nextStars,
        gems:         nextGems,
        tier:         data.currentTier,
        accuracy:     nextCorrect.length / TOTAL_WORDS
      });
    } else {
      setIndex(next);
      setRetryWord(null);
      setAttempt(1);
      setLionMood('happy');
      setListenState('waiting');
      setFlashText('');
    }
  }

  // ─── Manual mic tap (retry if glitched) ──────────────────────────────────
  function handleMicTap() {
    if (lockedRef.current) return;
    stopListening();
    setTimeout(() => beginListening(), 200);
  }

  // ─── Derived display values ───────────────────────────────────────────────
  const AnimalComp = animals[animalIdx % animals.length];
  const progress   = (index / TOTAL_WORDS) * 100;
  const tierInfo   = SIGHT_WORDS[data.currentTier];

  const isFlashing     = listenState === 'flash-correct' || listenState === 'flash-wrong';
  const isGreen        = listenState === 'flash-correct';
  const isRed          = listenState === 'flash-wrong';
  const isActivelyHearing = listenState === 'listening';

  const cardBg = isGreen
    ? 'linear-gradient(135deg, #1B5E20, #2E7D32)'
    : isRed
    ? 'linear-gradient(135deg, #7f1010, #b71c1c)'
    : 'rgba(255,255,255,0.12)';

  const instructionText = isActivelyHearing
    ? `🎤 Listening${dots}`
    : isGreen ? '🎉 Correct!'
    : isRed   ? '💪 Keep going!'
    : listenState === 'ready' ? '🟡 Get ready...'
    : '⏳ Listen first...';

  const wordColor = isGreen ? '#A5D6A7' : isRed ? '#FFCDD2' : '#FFD700';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #1a4a1a 0%, #2d6a2d 40%, #1a3a0a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes wordPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%,75%{transform:translateX(-8px)} 50%{transform:translateX(8px)} }
        @keyframes bounce { 0%{transform:scale(1)} 35%{transform:scale(1.2)} 65%{transform:scale(0.95)} 100%{transform:scale(1)} }
        @keyframes micRing { 0%,100%{box-shadow:0 0 0 0 rgba(255,80,80,0.6)} 50%{box-shadow:0 0 0 20px rgba(255,80,80,0)} }
        @keyframes popIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes animalPop { from{transform:scale(0) rotate(-15deg);opacity:0} to{transform:scale(1) rotate(0deg);opacity:1} }
        @keyframes readyPulse { 0%,100%{transform:scale(1);opacity:0.8} 50%{transform:scale(1.06);opacity:1} }
      `}</style>

      {/* Score + counter */}
      <div style={{ width:'100%', maxWidth:'400px', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
        <div style={{ background:'rgba(255,255,255,0.15)', borderRadius:'20px', padding:'6px 14px', display:'flex', alignItems:'center', gap:'6px' }}>
          <span style={{ fontSize:'18px' }}>⭐</span>
          <span style={{ fontFamily:"'Baloo 2', cursive", fontWeight:800, color:'#FFD700', fontSize:'20px' }}>{stars}</span>
          <span style={{ fontSize:'18px', marginLeft:'8px' }}>💎</span>
          <span style={{ fontFamily:"'Baloo 2', cursive", fontWeight:800, color:'#00BCD4', fontSize:'20px' }}>{gems}</span>
        </div>
        <div style={{ background:'rgba(255,255,255,0.15)', borderRadius:'20px', padding:'6px 14px' }}>
          <span style={{ fontFamily:"'Nunito', sans-serif", fontWeight:700, color:'white', fontSize:'14px' }}>
            {index + 1} / {TOTAL_WORDS}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width:'100%', maxWidth:'400px', height:'8px', background:'rgba(255,255,255,0.2)', borderRadius:'8px', marginBottom:'10px', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,#FFD700,#FF8F00)', borderRadius:'8px', transition:'width 0.5s ease' }} />
      </div>

      {/* Tier badge */}
      <div style={{ background:tierInfo.color, borderRadius:'20px', padding:'4px 16px', marginBottom:'10px' }}>
        <span style={{ fontFamily:"'Nunito', sans-serif", fontWeight:700, color:'white', fontSize:'13px' }}>
          {tierInfo.emoji} {tierInfo.label}{attempt === 2 && retryWord ? ' — Try Again!' : ''}
        </span>
      </div>

      {/* Lion */}
      <div style={{
        animation: lionMood === 'cheering' ? 'bounce 0.6s ease' : lionMood === 'sad' ? 'shake 0.5s ease' : 'none',
        marginBottom:'6px'
      }}>
        <Lion mood={lionMood} size={96} />
      </div>

      {/* Animal reward */}
      {isGreen && (
        <div style={{ position:'absolute', top:'30%', right:'4%', pointerEvents:'none', animation:'animalPop 0.4s ease' }}>
          <AnimalComp size={80} />
        </div>
      )}

      {/* Word card */}
      <div style={{
        background: cardBg,
        backdropFilter: 'blur(10px)',
        borderRadius: '28px',
        padding: '28px 48px',
        marginBottom: '20px',
        border: isGreen ? '3px solid #4caf50' : isRed ? '3px solid #ef5350' : '2px solid rgba(255,255,255,0.25)',
        boxShadow: isGreen ? '0 0 40px rgba(76,175,80,0.5)' : isRed ? '0 0 30px rgba(239,83,80,0.4)' : '0 8px 32px rgba(0,0,0,0.3)',
        transition: 'background 0.2s ease, border 0.2s ease, box-shadow 0.2s ease',
        textAlign: 'center',
        width: '100%',
        maxWidth: '340px'
      }}>
        <p style={{ fontFamily:"'Nunito', sans-serif", color:'rgba(255,255,255,0.9)', fontSize:'15px', fontWeight:700, margin:'0 0 10px' }}>
          {instructionText}
        </p>

        <div style={{
          fontFamily:"'Baloo 2', cursive",
          fontSize:'clamp(52px,14vw,78px)',
          fontWeight:800,
          color: wordColor,
          lineHeight:1,
          textShadow:'0 4px 16px rgba(0,0,0,0.4)',
          animation: pulse ? 'wordPulse 0.5s ease' : 'none',
          letterSpacing:'2px',
          userSelect:'none'
        }}>
          {currentWord}
        </div>

        {flashText ? (
          <div style={{ fontFamily:"'Baloo 2', cursive", fontSize:'20px', fontWeight:800, color: isGreen ? '#FFD700' : '#FFB74D', marginTop:'10px', animation:'popIn 0.3s ease' }}>
            {flashText}
          </div>
        ) : (
          <button
            onClick={() => { speakWord(currentWord); }}
            style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'20px', padding:'6px 16px', marginTop:'12px', cursor:'pointer', color:'white', fontFamily:"'Nunito', sans-serif", fontSize:'14px', fontWeight:600 }}
          >
            🔊 Hear it
          </button>
        )}
      </div>

      {/* Mic button — tap to retry listening if needed */}
      {!isFlashing && (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'10px' }}>
          <button
            onClick={handleMicTap}
            style={{
              width:'96px',
              height:'96px',
              borderRadius:'50%',
              border:'none',
              background: isActivelyHearing
                ? 'linear-gradient(135deg,#f44336,#c62828)'
                : 'linear-gradient(135deg,#FFD700,#FF8F00)',
              fontSize:'38px',
              cursor:'pointer',
              animation: isActivelyHearing ? 'micRing 1.2s ease-in-out infinite' : listenState === 'ready' ? 'readyPulse 0.8s ease-in-out infinite' : 'none',
              boxShadow: isActivelyHearing
                ? 'none'
                : '0 6px 24px rgba(255,200,0,0.5)',
              transition:'background 0.2s ease'
            }}
          >
            {isActivelyHearing ? '🔴' : '🎤'}
          </button>

          <p style={{ fontFamily:"'Nunito', sans-serif", color: isActivelyHearing ? '#FFD700' : 'rgba(255,255,255,0.5)', fontWeight:700, fontSize: isActivelyHearing ? '17px' : '13px', margin:0, transition:'all 0.3s ease' }}>
            {isActivelyHearing ? 'Say the word now!' : 'Tap mic if needed'}
          </p>
        </div>
      )}

      {listenState === 'no-support' && (
        <p style={{ fontFamily:"'Nunito', sans-serif", color:'#FFAB91', fontWeight:700, fontSize:'14px', textAlign:'center', maxWidth:'280px' }}>
          Voice not available in this browser. Try Chrome or Safari.
        </p>
      )}
    </div>
  );
}
