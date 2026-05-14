import React, { useState } from 'react';
import { Lion } from './Animals';

export default function HomeScreen({ data, onPlay, onViewReport }) {
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [nameInput, setNameInput] = useState(data.playerName);

  const tierLabels = { tier1: '🐣 Safari Starter', tier2: '🦁 Safari Explorer', tier3: '🏆 Safari Champion' };
  const tierColors = { tier1: '#4caf50', tier2: '#ff9800', tier3: '#e91e63' };

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
      {/* Jungle decorations */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
        {['🌿','🍃','🌴','🌿','🍃','🌴','🌿','🍃'].map((leaf, i) => (
          <span key={i} style={{
            position: 'absolute',
            fontSize: `${24 + (i % 3) * 8}px`,
            left: `${(i * 13) % 95}%`,
            top: `${(i * 17) % 90}%`,
            opacity: 0.3,
            animation: `sway ${2 + (i % 3)}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.3}s`
          }}>{leaf}</span>
        ))}
      </div>

      <style>{`
        @keyframes sway { from { transform: rotate(-5deg); } to { transform: rotate(5deg); } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes glow { 0%,100% { box-shadow: 0 6px 30px rgba(255,200,0,0.4); } 50% { box-shadow: 0 6px 50px rgba(255,200,0,0.8); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
      `}</style>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '8px', animation: 'fadeIn 0.6s ease', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '48px', marginBottom: '-8px' }}>🦁</div>
        <h1 style={{
          fontFamily: "'Baloo 2', cursive",
          fontSize: 'clamp(32px, 8vw, 52px)',
          fontWeight: 800,
          color: '#FFD700',
          margin: 0,
          textShadow: '0 3px 12px rgba(0,0,0,0.5), 0 0 40px rgba(255,200,0,0.3)',
          lineHeight: 1.1
        }}>Safari Sight Words</h1>
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          color: '#A5D6A7',
          fontSize: '16px',
          fontWeight: 600,
          margin: '4px 0 0'
        }}>The Reading Adventure Game</p>
      </div>

      {/* Player card */}
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '20px 28px',
        marginBottom: '24px',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.2)',
        animation: 'fadeIn 0.8s ease',
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '320px'
      }}>
        <div style={{ animation: 'bounce 2s ease-in-out infinite' }}>
          <Lion mood={data.sessionsCompleted > 0 ? 'excited' : 'happy'} size={90} />
        </div>

        {showNameEdit ? (
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'center' }}>
            <input
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              style={{
                fontFamily: "'Baloo 2', cursive",
                fontSize: '20px',
                fontWeight: 700,
                color: '#333',
                border: 'none',
                borderRadius: '8px',
                padding: '4px 8px',
                width: '120px',
                textAlign: 'center'
              }}
              autoFocus
              maxLength={12}
            />
            <button
              onClick={() => setShowNameEdit(false)}
              style={{
                background: '#4caf50',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                padding: '4px 12px',
                cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700
              }}
            >OK</button>
          </div>
        ) : (
          <h2
            onClick={() => setShowNameEdit(true)}
            style={{
              fontFamily: "'Baloo 2', cursive",
              fontSize: '26px',
              fontWeight: 800,
              color: 'white',
              margin: '8px 0 4px',
              cursor: 'pointer',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >{data.playerName} ✏️</h2>
        )}

        <div style={{
          display: 'inline-block',
          background: tierColors[data.currentTier],
          borderRadius: '20px',
          padding: '4px 14px',
          marginBottom: '12px'
        }}>
          <span style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            color: 'white',
            fontSize: '13px'
          }}>{tierLabels[data.currentTier]}</span>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'space-around', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '22px' }}>⭐</div>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#FFD700', fontSize: '22px' }}>{data.totalStars}</div>
            <div style={{ fontFamily: "'Nunito', sans-serif", color: '#A5D6A7', fontSize: '11px', fontWeight: 600 }}>Stars</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '22px' }}>💎</div>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#00BCD4', fontSize: '22px' }}>{data.totalGems}</div>
            <div style={{ fontFamily: "'Nunito', sans-serif", color: '#A5D6A7', fontSize: '11px', fontWeight: 600 }}>Gems</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '22px' }}>🎯</div>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#FF7043', fontSize: '22px' }}>{data.sessionsCompleted}</div>
            <div style={{ fontFamily: "'Nunito', sans-serif", color: '#A5D6A7', fontSize: '11px', fontWeight: 600 }}>Adventures</div>
          </div>
        </div>
      </div>

      {/* Play button */}
      <button
        onClick={onPlay}
        style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #FF8F00 100%)',
          border: 'none',
          borderRadius: '50px',
          padding: '20px 60px',
          fontFamily: "'Baloo 2', cursive",
          fontSize: '28px',
          fontWeight: 800,
          color: '#1a2a00',
          cursor: 'pointer',
          animation: 'glow 2s ease-in-out infinite, pulse 2s ease-in-out infinite',
          boxShadow: '0 6px 30px rgba(255,200,0,0.4)',
          letterSpacing: '1px',
          marginBottom: '16px',
          position: 'relative',
          zIndex: 1
        }}
      >
        🌿 PLAY! 🌿
      </button>

      {/* Parent report button */}
      <button
        onClick={onViewReport}
        style={{
          background: 'rgba(255,255,255,0.15)',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '50px',
          padding: '12px 32px',
          fontFamily: "'Nunito', sans-serif",
          fontSize: '16px',
          fontWeight: 700,
          color: 'white',
          cursor: 'pointer',
          position: 'relative',
          zIndex: 1
        }}
      >
        📊 Parent Report
      </button>

      {data.sessionsCompleted > 0 && (
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          color: '#A5D6A7',
          fontSize: '13px',
          marginTop: '16px',
          opacity: 0.8,
          position: 'relative',
          zIndex: 1
        }}>
          Last played: {new Date(data.sessions[data.sessions.length - 1]?.date).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
