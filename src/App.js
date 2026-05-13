import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';
import SessionEndScreen from './components/SessionEndScreen';
import ParentReport from './components/ParentReport';
import { useGameStorage } from './hooks/useGameStorage';

// Screens: 'home' | 'game' | 'session-end' | 'report'

export default function App() {
  const { data, saveSession, resetProgress, updatePlayerName } = useGameStorage();
  const [screen, setScreen] = useState('home');
  const [lastSession, setLastSession] = useState(null);

  function handleSessionComplete(sessionResult) {
    saveSession(sessionResult);
    setLastSession(sessionResult);
    setScreen('session-end');
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', minHeight: '100vh' }}>
      {screen === 'home' && (
        <HomeScreen
          data={data}
          onPlay={() => setScreen('game')}
          onViewReport={() => setScreen('report')}
        />
      )}

      {screen === 'game' && (
        <GameScreen
          data={data}
          onSessionComplete={handleSessionComplete}
        />
      )}

      {screen === 'session-end' && lastSession && (
        <SessionEndScreen
          sessionResult={lastSession}
          playerName={data.playerName}
          onPlayAgain={() => setScreen('game')}
          onHome={() => setScreen('home')}
          onReport={() => setScreen('report')}
        />
      )}

      {screen === 'report' && (
        <ParentReport
          data={data}
          onBack={() => setScreen(lastSession ? 'session-end' : 'home')}
          onReset={() => {
            resetProgress();
            setLastSession(null);
            setScreen('home');
          }}
        />
      )}
    </div>
  );
}
