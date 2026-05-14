import React, { useState } from 'react';
import { detectPhonicsPatterns, SIGHT_WORDS } from '../data/sightWords';

function Section({ title, emoji, children, color = '#4caf50' }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{
      background: 'rgba(255,255,255,0.07)',
      borderRadius: '20px',
      marginBottom: '16px',
      border: `1px solid ${color}44`,
      overflow: 'hidden'
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          color: 'white'
        }}
      >
        <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '18px', color }}>
          {emoji} {title}
        </span>
        <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.5)' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && <div style={{ padding: '0 20px 20px' }}>{children}</div>}
    </div>
  );
}

export default function ParentReport({ data, onBack, onReset }) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Compute analytics
  
  const masteredWords = Object.entries(data.allCorrectWords)
    .filter(([w, c]) => c >= 3 && (data.allMissedWords[w] || 0) === 0)
    .map(([w]) => w);

  const strugglingWords = Object.entries(data.allMissedWords)
    .filter(([w, c]) => c >= 2)
    .map(([w]) => w);

  const phonicsFlags = detectPhonicsPatterns(strugglingWords);

  const recentSessions = data.sessions.slice(-10).reverse();
  const avgAccuracy = recentSessions.length > 0
    ? Math.round(recentSessions.reduce((s, r) => s + (r.accuracy || 0), 0) / recentSessions.length * 100)
    : 0;

  // Tier progress
  const tier1Total = SIGHT_WORDS.tier1.words.length;
  const tier2Total = SIGHT_WORDS.tier2.words.length;
  const tier1Mastered = SIGHT_WORDS.tier1.words.filter(w => masteredWords.includes(w)).length;
  const tier2Mastered = SIGHT_WORDS.tier2.words.filter(w => masteredWords.includes(w)).length;

  const tierInfo = {
    tier1: { label: 'Safari Starter', color: '#4caf50' },
    tier2: { label: 'Safari Explorer', color: '#ff9800' },
    tier3: { label: 'Safari Champion', color: '#e91e63' }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0d1f0d 0%, #1a3a1a 60%, #0d1f0d 100%)',
      padding: '20px',
      paddingBottom: '40px'
    }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >←</button>
        <div>
          <h1 style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: '26px',
            fontWeight: 800,
            color: '#FFD700',
            margin: 0
          }}>Parent Report</h1>
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            color: '#A5D6A7',
            fontSize: '13px',
            fontWeight: 600,
            margin: 0
          }}>{data.playerName}'s Safari Word Progress</p>
        </div>
      </div>

      {data.sessionsCompleted === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'rgba(255,255,255,0.6)',
          fontFamily: "'Nunito', sans-serif",
          fontSize: '18px',
          fontWeight: 600
        }}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>🦁</div>
          No adventures yet! Play your first game to see a report here.
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '20px',
            animation: 'fadeIn 0.5s ease'
          }}>
            {[
              { label: 'Adventures', value: data.sessionsCompleted, emoji: '🎯', color: '#FF7043' },
              { label: 'Avg. Accuracy', value: `${avgAccuracy}%`, emoji: '🎯', color: '#4CAF50' },
              { label: 'Total Stars', value: data.totalStars, emoji: '⭐', color: '#FFD700' },
              { label: 'Words Mastered', value: masteredWords.length, emoji: '✅', color: '#00BCD4' }
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                border: `1px solid ${stat.color}44`
              }}>
                <div style={{ fontSize: '24px' }}>{stat.emoji}</div>
                <div style={{
                  fontFamily: "'Baloo 2', cursive",
                  fontSize: '28px',
                  fontWeight: 800,
                  color: stat.color
                }}>{stat.value}</div>
                <div style={{
                  fontFamily: "'Nunito', sans-serif",
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '12px',
                  fontWeight: 600
                }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Current level */}
          <Section title="Current Level" emoji="📈" color="#FF9800">
            <div style={{
              background: tierInfo[data.currentTier].color + '22',
              borderRadius: '12px',
              padding: '12px 16px',
              border: `1px solid ${tierInfo[data.currentTier].color}55`,
              marginBottom: '12px'
            }}>
              <span style={{
                fontFamily: "'Baloo 2', cursive",
                fontWeight: 800,
                color: tierInfo[data.currentTier].color,
                fontSize: '18px'
              }}>{tierInfo[data.currentTier].label}</span>
              <p style={{
                fontFamily: "'Nunito', sans-serif",
                color: 'rgba(255,255,255,0.7)',
                fontSize: '13px',
                fontWeight: 600,
                margin: '4px 0 0'
              }}>
                {data.currentTier === 'tier1' && `Very short, basic words (a, I, in, go...). Advance to Explorer after 3 sessions with 80%+ accuracy.`}
                {data.currentTier === 'tier2' && `Common high-frequency words (said, look, come...). Advance to Champion after 3 sessions with 80%+ accuracy.`}
                {data.currentTier === 'tier3' && `Advanced kindergarten words. Keep up the incredible work!`}
              </p>
            </div>
            {/* Progress bars */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontFamily: "'Nunito', sans-serif", color: '#A5D6A7', fontSize: '12px', fontWeight: 700 }}>Starter words mastered</span>
                <span style={{ fontFamily: "'Baloo 2', cursive", color: '#4caf50', fontWeight: 800, fontSize: '13px' }}>{tier1Mastered}/{tier1Total}</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <div style={{ height: '100%', width: `${(tier1Mastered/tier1Total)*100}%`, background: '#4caf50', borderRadius: '8px', transition: 'width 1s ease' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontFamily: "'Nunito', sans-serif", color: '#A5D6A7', fontSize: '12px', fontWeight: 700 }}>Explorer words mastered</span>
                <span style={{ fontFamily: "'Baloo 2', cursive", color: '#FF9800', fontWeight: 800, fontSize: '13px' }}>{tier2Mastered}/{tier2Total}</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <div style={{ height: '100%', width: `${(tier2Mastered/tier2Total)*100}%`, background: '#FF9800', borderRadius: '8px', transition: 'width 1s ease' }} />
              </div>
            </div>
          </Section>

          {/* Words needing practice */}
          {strugglingWords.length > 0 && (
            <Section title="Words That Need Practice" emoji="💪" color="#FF7043">
              <p style={{
                fontFamily: "'Nunito', sans-serif",
                color: 'rgba(255,255,255,0.7)',
                fontSize: '13px',
                fontWeight: 600,
                margin: '0 0 12px'
              }}>
                These words have been missed 2 or more times. Try using them in sentences at home, pointing them out in books, or playing rhyming games.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {strugglingWords.map(w => {
                  const count = data.allMissedWords[w] || 0;
                  return (
                    <div key={w} style={{
                      background: 'rgba(239,83,80,0.2)',
                      border: '1px solid rgba(239,83,80,0.4)',
                      borderRadius: '12px',
                      padding: '6px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#FFAB91', fontSize: '16px' }}>{w}</span>
                      <span style={{ fontFamily: "'Nunito', sans-serif", color: '#FF7043', fontSize: '11px', fontWeight: 700 }}>×{count}</span>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* Phonics patterns */}
          {Object.keys(phonicsFlags).length > 0 && (
            <Section title="Phonics Patterns to Work On" emoji="🔤" color="#9C27B0">
              <p style={{
                fontFamily: "'Nunito', sans-serif",
                color: 'rgba(255,255,255,0.7)',
                fontSize: '13px',
                fontWeight: 600,
                margin: '0 0 12px'
              }}>
                Based on the words {data.playerName} is missing, these letter patterns may need extra practice:
              </p>
              {Object.entries(phonicsFlags).map(([pattern, words]) => (
                <div key={pattern} style={{
                  background: 'rgba(156,39,176,0.15)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  marginBottom: '10px',
                  border: '1px solid rgba(156,39,176,0.3)'
                }}>
                  <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#CE93D8', fontSize: '15px', marginBottom: '6px' }}>
                    {pattern}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {words.map(w => (
                      <span key={w} style={{
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '2px 10px',
                        fontFamily: "'Baloo 2', cursive",
                        fontWeight: 700,
                        color: '#E1BEE7',
                        fontSize: '14px'
                      }}>{w}</span>
                    ))}
                  </div>
                  <p style={{
                    fontFamily: "'Nunito', sans-serif",
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '12px',
                    margin: '8px 0 0',
                    fontWeight: 600
                  }}>
                    {pattern.includes('Digraph') && 'Try: "th makes one sound, like in THINK. Can you make that sound?"'}
                    {pattern.includes('blend') && 'Try: "S and T together say ST, like STOP! What other words start with ST?"'}
                    {pattern.includes('vowel') && 'Try: sound out each letter slowly: /c/ /a/ /t/ = cat!'}
                    {pattern.includes('Double') && 'Try: "When you see two of the same letter together, they make one sound."'}
                    {pattern.includes('syllable') && 'Try: clap each syllable! A-BOUT = 2 claps.'}
                  </p>
                </div>
              ))}
            </Section>
          )}

          {/* Mastered words */}
          {masteredWords.length > 0 && (
            <Section title={`Words ${data.playerName} Knows!`} emoji="✅" color="#00BCD4">
              <p style={{
                fontFamily: "'Nunito', sans-serif",
                color: 'rgba(255,255,255,0.7)',
                fontSize: '13px',
                fontWeight: 600,
                margin: '0 0 12px'
              }}>
                Words gotten correct 3+ times with no misses. Celebrate these wins!
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {masteredWords.map(w => (
                  <span key={w} style={{
                    background: 'rgba(0,188,212,0.2)',
                    border: '1px solid rgba(0,188,212,0.4)',
                    borderRadius: '12px',
                    padding: '4px 14px',
                    fontFamily: "'Baloo 2', cursive",
                    fontWeight: 700,
                    color: '#80DEEA',
                    fontSize: '15px'
                  }}>{w}</span>
                ))}
              </div>
            </Section>
          )}

          {/* Recent sessions */}
          {recentSessions.length > 0 && (
            <Section title="Recent Sessions" emoji="📅" color="#607D8B">
              {recentSessions.map((s, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: i < recentSessions.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }}>
                  <div>
                    <div style={{ fontFamily: "'Nunito', sans-serif", color: 'white', fontWeight: 700, fontSize: '14px' }}>
                      {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div style={{ fontFamily: "'Nunito', sans-serif", color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 600 }}>
                      {tierInfo[s.tier]?.label || 'Unknown tier'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontFamily: "'Baloo 2', cursive",
                      fontWeight: 800,
                      fontSize: '20px',
                      color: (s.accuracy || 0) >= 0.8 ? '#4caf50' : (s.accuracy || 0) >= 0.6 ? '#FF9800' : '#ef5350'
                    }}>{Math.round((s.accuracy || 0) * 100)}%</div>
                    <div style={{ fontFamily: "'Nunito', sans-serif", color: '#FFD700', fontSize: '12px', fontWeight: 700 }}>
                      ⭐ {s.stars || 0}
                    </div>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* Tips for parents */}
          <Section title="Tips for Parents" emoji="💡" color="#8BC34A">
            {[
              { tip: "Read together every day, even just 10 minutes. Let your child point to words they recognize.", icon: "📖" },
              { tip: "When reading, pause at sight words and let them say it. \"Oh look — what's that word?\"", icon: "🔍" },
              { tip: "Write sight words on sticky notes around the house (refrigerator, door, table). Make it a scavenger hunt.", icon: "🗒️" },
              { tip: "Play \"I Spy a Word\" — look for sight words on signs, menus, and packaging when you're out.", icon: "🚗" },
              { tip: "Celebrate every win out loud. \"You just READ that word! You're incredible!\"", icon: "🎉" },
              { tip: "Don't correct harshly — curiosity and confidence matter more than perfection right now.", icon: "❤️" }
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '12px',
                alignItems: 'flex-start'
              }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                <p style={{
                  fontFamily: "'Nunito', sans-serif",
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '14px',
                  fontWeight: 600,
                  margin: 0,
                  lineHeight: 1.5
                }}>{item.tip}</p>
              </div>
            ))}
          </Section>

          {/* Reset */}
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                style={{
                  background: 'none',
                  border: '1px solid rgba(239,83,80,0.4)',
                  borderRadius: '20px',
                  padding: '8px 20px',
                  color: 'rgba(239,83,80,0.7)',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >Reset All Progress</button>
            ) : (
              <div>
                <p style={{ fontFamily: "'Nunito', sans-serif", color: '#FFAB91', fontSize: '14px', fontWeight: 700 }}>
                  Are you sure? This cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    onClick={() => { onReset(); setShowResetConfirm(false); }}
                    style={{
                      background: 'rgba(239,83,80,0.3)',
                      border: '1px solid rgba(239,83,80,0.5)',
                      borderRadius: '20px',
                      padding: '8px 20px',
                      color: '#FFAB91',
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >Yes, Reset</button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '20px',
                      padding: '8px 20px',
                      color: 'white',
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >Cancel</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
