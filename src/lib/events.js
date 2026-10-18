import { collection, query, orderBy, where, limit, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'

export const eventsCol = () => collection(db, 'events')

export const upcomingEventsQuery = (max) =>
  query(eventsCol(), where('date', '>=', Timestamp.now()), orderBy('date', 'asc'), ...(max ? [limit(max)] : []))

export const pastEventsQuery = () => query(eventsCol(), where('date', '<', Timestamp.now()), orderBy('date', 'desc'))
