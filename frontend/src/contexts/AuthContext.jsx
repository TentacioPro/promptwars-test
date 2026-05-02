import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebaseConfig.js';
import { authAPI } from '../lib/api.js';

const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const data = await authAPI.me();
          setProfile(data);
        } catch {
          // User exists in Firebase Auth but not in Firestore — will register on first action
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }

  async function register(email, password, displayName, skills = []) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Create Firestore user doc via backend
    const data = await authAPI.register({ displayName, email });
    setProfile(data);
    return cred.user;
  }

  async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    // Ensure Firestore user doc exists
    try {
      const data = await authAPI.me();
      setProfile(data);
    } catch {
      const data = await authAPI.register({
        displayName: result.user.displayName || 'User',
        email: result.user.email,
      });
      setProfile(data);
    }
    return result.user;
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  }

  async function refreshProfile() {
    try {
      const data = await authAPI.me();
      setProfile(data);
    } catch {
      // ignore
    }
  }

  const value = {
    user,
    profile,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    refreshProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
