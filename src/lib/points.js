import { collection, doc, increment, serverTimestamp, writeBatch } from 'firebase/firestore'
import { db } from '../firebase'

// Records a points entry and updates the member's running total atomically.
// Pass `id` to use a deterministic entry id (so it can be revoked later).
export async function awardPoints({ uid, name, amount, reason, awardedBy, id, batch: outer }) {
  const batch = outer || writeBatch(db)
  const ref = id ? doc(db, 'points', id) : doc(collection(db, 'points'))
  batch.set(ref, { uid, name, amount, reason, awardedBy, createdAt: serverTimestamp() })
  batch.update(doc(db, 'users', uid), { points: increment(amount) })
  if (!outer) await batch.commit()
}

export async function revokePoints({ id, uid, amount, batch: outer }) {
  const batch = outer || writeBatch(db)
  batch.delete(doc(db, 'points', id))
  batch.update(doc(db, 'users', uid), { points: increment(-amount) })
  if (!outer) await batch.commit()
}
