import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './views/Dashboard.jsx';
import KanbanBoard from './views/KanbanBoard.jsx';
import PitchDeck from './PitchDeck';

// Simple mockup for auth context
const AuthContext = React.createContext({ user: { uid: '123' } });

function App() {
  const [showPitchDeck, setShowPitchDeck] = useState(false);

  return (
    <AuthContext.Provider value={{ user: { uid: '123' } }}>
      <BrowserRouter>
        <div className="app" role="main" aria-label="Skill Hub Application">
          <header className="glass-panel header" role="banner" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Skill Hub</h1>
              <p>Team Coordination Platform</p>
            </div>
            <button 
              onClick={() => setShowPitchDeck(true)}
              className="status-badge status-badge--done"
              style={{ cursor: 'pointer', padding: '0.8rem 1.5rem', fontSize: '1.1rem', border: 'none', fontWeight: 'bold' }}
            >
              📺 Pitch Deck
            </button>
            <nav style={{ marginTop: '15px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <a href="/" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Dashboard</a>
              <a href="/tasks" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Tasks Board</a>
            </nav>
          </header>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<KanbanBoard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <footer className="glass-panel footer" role="contentinfo" style={{ marginTop: '20px' }}>
            <p>Built by <strong>Abishek Maharajan</strong> · AI-Fullstack Engineer</p>
          </footer>

          {showPitchDeck && <PitchDeck onClose={() => setShowPitchDeck(false)} />}
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
