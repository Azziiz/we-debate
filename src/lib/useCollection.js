import { useEffect, useState } from 'react'
import { onSnapshot } from 'firebase/firestore'
import { firebaseReady } from '../firebase'

// Live subscription to a Firestore query. Pass a function that builds the
// query so it is only created when Firebase is configured.
export function useCollection(makeQuery, deps = []) {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(firebaseReady)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!firebaseReady) return
    const q = makeQuery()
    if (!q) {
      setDocs([])
      setLoading(false)
      return
    }
    setLoading(true)
    return onSnapshot(
      q,
      (snap) => {
        setDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        console.error(err)
        setError(err)
        setLoading(false)
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { docs, loading, error }
}
