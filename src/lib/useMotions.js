import { collection, query, where } from 'firebase/firestore'
import { db, firebaseReady } from '../firebase'
import { useCollection } from './useCollection'
import { SEED_MOTIONS } from '../data/motions'

// Approved motions from Firestore, falling back to the built-in starter set
// until the club has added its own.
export function useMotions() {
  const { docs, loading } = useCollection(() => query(collection(db, 'motions'), where('approved', '==', true)), [])
  const motions = firebaseReady && docs.length > 0 ? docs : SEED_MOTIONS
  return { motions, loading, usingSeed: motions === SEED_MOTIONS }
}
