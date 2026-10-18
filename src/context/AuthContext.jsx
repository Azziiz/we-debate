import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth'
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { auth, db, firebaseReady } from '../firebase'

const AuthContext = createContext(null)

// Creates the user document on first sign-in. New users start as "guest"
// until an admin approves their application.
async function ensureUserDoc(user, name) {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      // no email here: user docs are visible to other members (leaderboard)
      name: name || user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL || '',
      bio: '',
      role: 'guest',
      points: 0,
      createdAt: serverTimestamp(),
    })
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(firebaseReady)

  useEffect(() => {
    if (!firebaseReady) return
    let unsubProfile = () => {}
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      unsubProfile()
      setUser(u)
      if (!u) {
        setProfile(null)
        setLoading(false)
        return
      }
      try {
        await ensureUserDoc(u)
      } catch (e) {
        console.error('Could not create user profile', e)
      }
      unsubProfile = onSnapshot(doc(db, 'users', u.uid), (snap) => {
        setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null)
        setLoading(false)
      })
    })
    return () => {
      unsubAuth()
      unsubProfile()
    }
  }, [])

  const value = {
    user,
    profile,
    loading,
    isMember: profile?.role === 'member' || profile?.role === 'admin',
    isAdmin: profile?.role === 'admin',
    signInWithGoogle: () => signInWithPopup(auth, new GoogleAuthProvider()),
    signInWithEmail: (email, password) => signInWithEmailAndPassword(auth, email, password),
    signUpWithEmail: async (name, email, password) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName: name })
      await ensureUserDoc(cred.user, name)
      return cred
    },
    logout: () => signOut(auth),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
