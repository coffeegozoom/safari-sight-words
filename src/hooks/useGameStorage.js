import { useState, useEffect } from 'react';

const STORAGE_KEY = 'safari_sight_words_jack';

const defaultState = {
  playerName: 'Jack',
  currentTier: 'tier1',
  totalStars: 0,
  totalGems: 0,
  sessionsCompleted: 0,
  sessions: [],          // array of session records
  allMissedWords: {},    // word -> miss count (cumulative)
  allCorrectWords: {},   // word -> correct count (cumulative)
  createdAt: new Date().toISOString()
};

export function useGameStorage() {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultState, ...JSON.parse(stored) };
      }
    } catch (e) {
      // corrupted storage, start fresh
    }
    return defaultState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // storage full or unavailable
    }
  }, [data]);

  function saveSession(sessionResult) {
    setData(prev => {
      const newMissed = { ...prev.allMissedWords };
      const newCorrect = { ...prev.allCorrectWords };

      (sessionResult.missedWords || []).forEach(w => {
        newMissed[w] = (newMissed[w] || 0) + 1;
      });
      (sessionResult.correctWords || []).forEach(w => {
        newCorrect[w] = (newCorrect[w] || 0) + 1;
      });

      // Tier progression: if 3 consecutive sessions with >80% correct in current tier, advance
      const recentSessions = [...prev.sessions, sessionResult].slice(-3);
      const allHighScores = recentSessions.length === 3 &&
        recentSessions.every(s => s.tier === prev.currentTier && s.accuracy >= 0.8);
      
      let nextTier = prev.currentTier;
      if (allHighScores) {
        if (prev.currentTier === 'tier1') nextTier = 'tier2';
        else if (prev.currentTier === 'tier2') nextTier = 'tier3';
      }

      return {
        ...prev,
        currentTier: nextTier,
        totalStars: prev.totalStars + (sessionResult.stars || 0),
        totalGems: prev.totalGems + (sessionResult.gems || 0),
        sessionsCompleted: prev.sessionsCompleted + 1,
        sessions: [...prev.sessions, { ...sessionResult, date: new Date().toISOString() }],
        allMissedWords: newMissed,
        allCorrectWords: newCorrect
      };
    });
  }

  function resetProgress() {
    const fresh = { ...defaultState, createdAt: new Date().toISOString() };
    setData(fresh);
  }

  function updatePlayerName(name) {
    setData(prev => ({ ...prev, playerName: name }));
  }

  return { data, saveSession, resetProgress, updatePlayerName };
}
