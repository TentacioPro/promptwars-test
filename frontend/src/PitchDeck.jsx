import React, { useState, useEffect, useCallback } from 'react';

const slides = [
  {
    title: "Skill Hub",
    subtitle: "The Future of AI-Driven Team Coordination",
    content: "Revolutionizing how agile teams work with intelligent, automated insights.",
    footer: "Presented by Abishek Maharajan"
  },
  {
    title: "The Problem",
    subtitle: "Fragmented Workflows & Burnout",
    content: "Teams lose 20% of their time to context switching, manual standups, and siloed communication. Burnout goes unnoticed until it's too late.",
    footer: "Abishek Maharajan | AI-Fullstack Engineer"
  },
  {
    title: "The Solution",
    subtitle: "An Integrated, AI-First Platform",
    content: "Skill Hub centralizes tasks, standups, and team health, powered by AI to remove the busywork and keep teams focused.",
    footer: "Abishek Maharajan | Architect & Lead Developer"
  },
  {
    title: "Key Features",
    subtitle: "What makes Skill Hub different?",
    content: "• 🎯 AI Skill-Task Matcher\n• 🤖 Auto-Generated Standups\n• 🔥 Real-Time Burnout Radar\n• 📊 Sprint Forecaster",
    footer: "Abishek Maharajan | Core Engine"
  },
  {
    title: "AI Skill-Task Matcher",
    subtitle: "Right person. Right task. Instantly.",
    content: "Our AI analyzes task requirements and team skills to suggest the most optimal assignee, preventing bottlenecks.",
    footer: "Abishek Maharajan | AI Systems integration"
  },
  {
    title: "Auto-Standups",
    subtitle: "No more status meetings",
    content: "Skill Hub automatically compiles daily digests of what was completed, in-progress, and blocked based on actual activity.",
    footer: "Abishek Maharajan | Automation & Tooling"
  },
  {
    title: "Burnout Radar",
    subtitle: "Protect your most valuable asset",
    content: "A heat map of team workload intensity helps managers proactively redistribute tasks before burnout occurs.",
    footer: "Abishek Maharajan | Product Strategy"
  },
  {
    title: "Sprint Forecaster",
    subtitle: "Data-driven predictability",
    content: "Using historical velocity, we calculate the probability of sprint completion to ensure realistic deadlines.",
    footer: "Abishek Maharajan | Data & Analytics"
  },
  {
    title: "The Tech Stack",
    subtitle: "Built for Scale and Speed",
    content: "• Frontend: React, Vite, Glassmorphism UI\n• Backend: Node.js, Express\n• Database: Firebase Firestore\n• AI: Google Gemini API",
    footer: "Abishek Maharajan | Fullstack Architect"
  },
  {
    title: "Join the Revolution",
    subtitle: "Let's build better teams together.",
    content: "Skill Hub is ready to transform your workflow. Are you ready?",
    footer: "Abishek Maharajan | maharajanabishek@gmail.com"
  }
];

export default function PitchDeck({ onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? prev : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, onClose]);

  const slide = slides[currentSlide];

  return (
    <div className="pitch-deck-overlay" style={styles.overlay}>
      <div className="pitch-deck-container glass-panel" style={styles.container}>
        {onClose && (
          <button onClick={onClose} style={styles.closeBtn} aria-label="Close Pitch Deck">
            ✕
          </button>
        )}
        
        <div style={styles.slideContent}>
          <h1 style={styles.title}>{slide.title}</h1>
          <h2 style={styles.subtitle}>{slide.subtitle}</h2>
          <div style={styles.content}>
            {slide.content.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        </div>

        <div style={styles.footer}>
          <div style={styles.credentials}>
            <span style={styles.badge}>🎤 Pitch Deck</span>
            {slide.footer}
          </div>
          <div style={styles.controls}>
            <button 
              onClick={prevSlide} 
              disabled={currentSlide === 0}
              style={{...styles.navBtn, opacity: currentSlide === 0 ? 0.5 : 1}}
            >
              ← Prev
            </button>
            <span style={styles.counter}>
              {currentSlide + 1} / {slides.length}
            </span>
            <button 
              onClick={nextSlide} 
              disabled={currentSlide === slides.length - 1}
              style={{...styles.navBtn, opacity: currentSlide === slides.length - 1 ? 0.5 : 1}}
            >
              Next →
            </button>
          </div>
        </div>
        
        <div style={styles.progressContainer}>
          <div 
            style={{
              ...styles.progressBar, 
              width: `${((currentSlide + 1) / slides.length) * 100}%`
            }} 
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 10, 20, 0.85)',
    backdropFilter: 'blur(8px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  container: {
    width: '100%',
    maxWidth: '1000px',
    height: '80vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    padding: '4rem',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  closeBtn: {
    position: 'absolute',
    top: '1.5rem',
    right: '1.5rem',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '50%',
    transition: 'color 0.2s, background-color 0.2s',
  },
  slideContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: '4rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1rem',
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: '2rem',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '3rem',
  },
  content: {
    fontSize: '1.5rem',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 1.6,
    maxWidth: '800px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '2rem',
  },
  credentials: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '1.1rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  badge: {
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    color: '#6c63ff',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  navBtn: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: 'white',
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    transition: 'all 0.2s',
  },
  counter: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.8)',
    fontVariantNumeric: 'tabular-nums',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6c63ff',
    transition: 'width 0.3s ease-out',
  }
};
