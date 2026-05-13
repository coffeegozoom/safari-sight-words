import React, { useEffect, useState } from 'react';
import { Lion } from './Animals';
import { useSpeech } from '../hooks/useAudio';

export default function SessionEndScreen({ sessionResult, playerName, onPlayAgain, onHome, onReport }) {
  const { encourage, speak } = useSpeech();
  const [showConfetti, setShowConfetti] = useState(false);

  const { correctWords, missedWords, stars, gems, accuracy } = sessionResult;
  const total = correctWords.length + missedWords.length;
  const pct = total > 0 ? Math.round((correctWords.length / total) * 100) : 0;

  const grade = pct >= 90 ? 'safari-champion' : pct >= 70 ? 'explorer' : 'starter';
  const gradeEmoji = { 'safari-champion': '🏆', explorer: '🦁', starter: '🐣' }[grade];
  const gradeLabel = { 'safari-champion': 'Safari Champion!', explorer: 'Safari Explorer!', starter: 'Great Start!' }[grade];
  const gradeColor = { 'safari-champion': '#FFD700', explorer: '#FF9800', starter: '#4caf50' }[grade];

  useEffect(() => {
    setShowConfetti(true);
    setTimeout(() => {
      encourage('sessionEnd');
    }, 600);
  }, []);

  const confettiItems = ['⭐', '🌟', '💎', '🎉', '🦁', '🌿', '🎊', '⭐'];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #1a4a1a 0%, #2d6a2d 40%, #1a3a0a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes scoreReveal { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes glow { 0%,100%{box-shadow:0 6px 30px rgba(255,200,0,0.4)} 50%{box-shadow:0 6px 50px rgba(255,200,0,0.8)} }
      `}</style>

      {/* Confetti */}
      {showConfetti && confettiItems.map((item, i) => (
        <div
          key={i}
          style={{
            position: 'fixed',
            top: '-20px',
            left: `${10 + (i * 12)}%`,
            fontSize: `${20 + (i % 3) * 10}px`,
            animation: `confettiFall ${2 + (i % 3) * 0.5}s ease-in ${i * 0.15}s forwards`,
            pointerEvents: 'none',
            zIndex: 10
          }}
        >{item}</div>
      ))}

      {/* Lion */}
      <div style={{ animation: 'bounce 1.5s ease-in-out infinite', marginBottom: '8px' }}>
        <Lion mood={pct >= 70 ? 'cheering' : 'happy'} size={100} />
      </div>

      {/* Grade badge */}
      <div style={{
        animation: 'scoreReveal 0.6s cubic-bezier(0.175,0.885,0.32,1.275) 0.3s backwards',
        background: gradeColor,
        borderRadius: '50px',
        padding: '8px 24px',
        marginBottom: '12px',
        boxShadow: `0 4px 20px ${gradeColor}88`
      }}>
        <span style={{
          fontFamily: "'Baloo 2', cursive",
          fontSize: '22px',
          fontWeight: 800,
          color: 'white'
        }}>{gradeEmoji} {gradeLabel}</span>
      </div>

      {/* Name + message */}
      <h2 style={{
        fontFamily: "'Baloo 2', cursive",
        fontSize: 'clamp(24px, 7vw, 36px)',
        fontWeight: 800,
        color: 'white',
        margin: '0 0 4px',
        textShadow: '0 2px 12px rgba(0,0,0,0.4)',
        textAlign: 'center'
      }}>
        Amazing work, {playerName}!
      </h2>
      <p style={{
        fontFamily: "'Nunito', sans-serif",
        color: '#A5D6A7',
        fontSize: '16px',
        fontWeight: 600,
        margin: '0 0 20px',
        textAlign: 'center'
      }}>
        You're becoming a reading explorer!
      </p>

      {/* Score card */}
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '20px 28px',
        marginBottom: '20px',
        border: '1px solid rgba(255,255,255,0.2)',
        width: '100%',
        maxWidth: '320px',
        animation: 'scoreReveal 0.6s cubic-bezier(0.175,0.885,0.32,1.275) 0.5s backwards'
      }}>
        {/* Big score */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: '64px',
            fontWeight: 800,
            color: pct >= 80 ? '#FFD700' : pct >= 60 ? '#FF9800' : '#A5D6A7',
            lineHeight: 1,
            textShadow: '0 4px 16px rgba(0,0,0,0.3)'
          }}>{pct}%</div>
          <div style={{
            fontFamily: "'Nunito', sans-serif",
            color: 'rgba(255,255,255,0.7)',
            fontSize: '14px',
            fontWeight: 600
          }}>{correctWords.length} of {total} words correct</div>
        </div>

        {/* Stars and gems earned */}
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px' }}>⭐</div>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#FFD700', fontSize: '26px' }}>+{stars}</div>
            <div style={{ fontFamily: "'Nunito', sans-serif", color: '#A5D6A7', fontSize: '12px', fontWeight: 600 }}>Stars earned</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px' }}>💎</div>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#00BCD4', fontSize: '26px' }}>+{gems}</div>
            <div style={{ fontFamily: "'Nunito', sans-serif", color: '#A5D6A7', fontSize: '12px', fontWeight: 600 }}>Gems earned</div>
          </div>
        </div>

        {/* Words preview */}
        {correctWords.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontFamily: "'Nunito', sans-serif", color: '#A5D6A7', fontSize: '12px', fontWeight: 700, margin: '0 0 6px' }}>
              ✅ Words you crushed:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {correctWords.map(w => (
                <span key={w} style={{
                  background: 'rgba(76,175,80,0.3)',
                  border: '1px solid rgba(76,175,80,0.5)',
                  borderRadius: '12px',
                  padding: '2px 10px',
                  fontFamily: "'Baloo 2', cursive",
                  fontWeight: 700,
                  color: '#A5D6A7',
                  fontSize: '14px'
                }}>{w}</span>
              ))}
            </div>
          </div>
        )}

        {missedWords.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            <p style={{ fontFamily: "'Nunito', sans-serif", color: '#FFAB91', fontSize: '12px', fontWeight: 700, margin: '0 0 6px' }}>
              💪 Keep practicing:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {missedWords.map(w => (
                <span key={w} style={{
                  background: 'rgba(239,83,80,0.2)',
                  border: '1px solid rgba(239,83,80,0.4)',
                  borderRadius: '12px',
                  padding: '2px 10px',
                  fontFamily: "'Baloo 2', cursive",
                  fontWeight: 700,
                  color: '#FFAB91',
                  fontSize: '14px'
                }}>{w}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <button
        onClick={onPlayAgain}
        style={{
          background: 'linear-gradient(135deg, #FFD700, #FF8F00)',
          border: 'none',
          borderRadius: '50px',
          padding: '18px 48px',
          fontFamily: "'Baloo 2', cursive",
          fontSize: '22px',
          fontWeight: 800,
          color: '#1a2a00',
          cursor: 'pointer',
          animation: 'glow 2s ease-in-out infinite',
          boxShadow: '0 6px 30px rgba(255,200,0,0.4)',
          marginBottom: '12px',
          width: '100%',
          maxWidth: '320px'
        }}
      >
        🌿 Play Again!
      </button>

      <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '320px' }}>
        <button
          onClick={onHome}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.15)',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '50px',
            padding: '14px',
            fontFamily: "'Nunito', sans-serif",
            fontSize: '15px',
            fontWeight: 700,
            color: 'white',
            cursor: 'pointer'
          }}
        >🏠 Home</button>

        <button
          onClick={onReport}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.15)',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '50px',
            padding: '14px',
            fontFamily: "'Nunito', sans-serif",
            fontSize: '15px',
            fontWeight: 700,
            color: 'white',
            cursor: 'pointer'
          }}
        >📊 Report</button>
      </div>
    </div>
  );
}
