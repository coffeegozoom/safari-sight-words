import React from 'react';

// Animated lion mascot - main character
export function Lion({ mood = 'happy', size = 120 }) {
  const expressions = {
    happy: { mouthPath: "M 35 68 Q 50 80 65 68", eyeScale: 1, color: '#FFB300' },
    excited: { mouthPath: "M 30 65 Q 50 85 70 65", eyeScale: 1.2, color: '#FFC107' },
    thinking: { mouthPath: "M 38 70 Q 50 72 62 70", eyeScale: 0.9, color: '#FFB300' },
    cheering: { mouthPath: "M 28 63 Q 50 88 72 63", eyeScale: 1.3, color: '#FF8F00' },
    sad: { mouthPath: "M 35 74 Q 50 65 65 74", eyeScale: 0.85, color: '#FFB300' },
  };
  const expr = expressions[mood] || expressions.happy;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
      {/* Mane */}
      <circle cx="50" cy="52" r="44" fill="#E65100" />
      <circle cx="50" cy="48" r="36" fill={expr.color} />
      {/* Ears */}
      <circle cx="20" cy="22" r="10" fill={expr.color} />
      <circle cx="80" cy="22" r="10" fill={expr.color} />
      <circle cx="20" cy="22" r="6" fill="#FFCC02" />
      <circle cx="80" cy="22" r="6" fill="#FFCC02" />
      {/* Face */}
      <ellipse cx="50" cy="55" rx="22" ry="18" fill="#FFCC02" />
      {/* Eyes */}
      <g transform={`scale(${expr.eyeScale}) translate(${50 * (1 - expr.eyeScale)}, ${50 * (1 - expr.eyeScale)})`}>
        <circle cx="38" cy="44" r="7" fill="white" />
        <circle cx="62" cy="44" r="7" fill="white" />
        <circle cx="39" cy="45" r="4" fill="#4a2c00" />
        <circle cx="63" cy="45" r="4" fill="#4a2c00" />
        <circle cx="40" cy="44" r="1.5" fill="white" />
        <circle cx="64" cy="44" r="1.5" fill="white" />
      </g>
      {/* Nose */}
      <ellipse cx="50" cy="58" rx="5" ry="3.5" fill="#E65100" />
      {/* Mouth */}
      <path d={expr.mouthPath} fill="none" stroke="#8B4513" strokeWidth="2.5" strokeLinecap="round" />
      {/* Whiskers */}
      <line x1="28" y1="56" x2="42" y2="58" stroke="#8B4513" strokeWidth="1.2" />
      <line x1="28" y1="60" x2="42" y2="60" stroke="#8B4513" strokeWidth="1.2" />
      <line x1="58" y1="58" x2="72" y2="56" stroke="#8B4513" strokeWidth="1.2" />
      <line x1="58" y1="60" x2="72" y2="60" stroke="#8B4513" strokeWidth="1.2" />
    </svg>
  );
}

// Safari animals that appear as rewards
export function Elephant({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <ellipse cx="40" cy="50" rx="28" ry="22" fill="#9E9E9E" />
      <circle cx="40" cy="32" r="20" fill="#9E9E9E" />
      <ellipse cx="16" cy="38" rx="7" ry="12" fill="#9E9E9E" />
      <ellipse cx="64" cy="38" rx="7" ry="12" fill="#9E9E9E" />
      <ellipse cx="40" cy="52" rx="8" ry="6" fill="#BDBDBD" />
      <path d="M 40 58 Q 38 65 32 68 Q 28 70 30 74" fill="none" stroke="#9E9E9E" strokeWidth="5" strokeLinecap="round" />
      <circle cx="32" cy="28" r="4" fill="white" />
      <circle cx="48" cy="28" r="4" fill="white" />
      <circle cx="33" cy="29" r="2" fill="#333" />
      <circle cx="49" cy="29" r="2" fill="#333" />
    </svg>
  );
}

export function Giraffe({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <rect x="34" y="5" width="12" height="40" rx="6" fill="#FFB300" />
      <ellipse cx="40" cy="14" rx="14" ry="12" fill="#FFB300" />
      <circle cx="33" cy="8" r="3" fill="#E65100" />
      <circle cx="47" cy="8" r="3" fill="#E65100" />
      <circle cx="34" cy="12" r="3" fill="white" />
      <circle cx="46" cy="12" r="3" fill="white" />
      <circle cx="35" cy="13" r="1.5" fill="#333" />
      <circle cx="47" cy="13" r="1.5" fill="#333" />
      <ellipse cx="40" cy="44" rx="20" ry="15" fill="#FFB300" />
      {/* Spots */}
      <ellipse cx="35" cy="20" rx="3" ry="4" fill="#E65100" opacity="0.6" />
      <ellipse cx="46" cy="28" rx="3" ry="3" fill="#E65100" opacity="0.6" />
      <ellipse cx="32" cy="40" rx="4" ry="3" fill="#E65100" opacity="0.6" />
      <ellipse cx="50" cy="42" rx="3" ry="4" fill="#E65100" opacity="0.6" />
    </svg>
  );
}

export function Zebra({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <ellipse cx="40" cy="50" rx="26" ry="20" fill="white" />
      <circle cx="40" cy="30" r="18" fill="white" />
      {/* Stripes */}
      <path d="M 30 15 Q 35 20 28 28" stroke="#333" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M 40 12 Q 42 18 38 26" stroke="#333" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M 50 15 Q 48 22 53 28" stroke="#333" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M 20 45 Q 26 42 22 55" stroke="#333" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M 60 45 Q 54 42 58 55" stroke="#333" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M 35 50 Q 38 44 42 50" stroke="#333" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="33" cy="27" r="4" fill="white" />
      <circle cx="47" cy="27" r="4" fill="white" />
      <circle cx="34" cy="28" r="2" fill="#333" />
      <circle cx="48" cy="28" r="2" fill="#333" />
      <ellipse cx="40" cy="38" rx="6" ry="4" fill="#f5f5f5" />
      <ellipse cx="38" cy="36" rx="3" ry="2" fill="#333" />
      <ellipse cx="42" cy="36" rx="3" ry="2" fill="#333" />
    </svg>
  );
}

// Star and gem reward icons
export function Star({ size = 32, filled = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <polygon
        points="16,2 20,12 31,12 22,19 25,30 16,23 7,30 10,19 1,12 12,12"
        fill={filled ? '#FFD700' : '#ccc'}
        stroke={filled ? '#FFA000' : '#999'}
        strokeWidth="1"
        style={{ filter: filled ? 'drop-shadow(0 2px 4px rgba(255,200,0,0.5))' : 'none' }}
      />
    </svg>
  );
}

export function Gem({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <polygon points="16,2 28,12 16,30 4,12" fill="#00BCD4" stroke="#006064" strokeWidth="1" />
      <polygon points="16,2 28,12 16,16" fill="#80DEEA" />
      <polygon points="4,12 16,12 16,16" fill="#4DD0E1" />
      <style>{`@keyframes gemshine { 0%,100%{opacity:0.6} 50%{opacity:1} }`}</style>
      <polygon points="16,4 24,11 16,14" fill="white" opacity="0.4" style={{ animation: 'gemshine 2s infinite' }} />
    </svg>
  );
}
