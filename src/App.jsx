import React, { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { RequireAuth, Loading } from './components/Guards'

const Home = lazy(() => import('./pages/Home'))
const Events = lazy(() => import('./pages/Events'))
const EventDetail = lazy(() => import('./pages/EventDetail'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Join = lazy(() => import('./pages/Join'))
const Login = lazy(() => import('./pages/Login'))
const Profile = lazy(() => import('./pages/Profile'))
const Leaderboard = lazy(() => import('./pages/Leaderboard'))
const Tools = lazy(() => import('./pages/tools/Tools'))
const Timer = lazy(() => import('./pages/tools/Timer'))
const MotionGenerator = lazy(() => import('./pages/tools/MotionGenerator'))
const TeamDraw = lazy(() => import('./pages/tools/TeamDraw'))
const ScoreSheet = lazy(() => import('./pages/tools/ScoreSheet'))
const Motions = lazy(() => import('./pages/library/Motions'))
const Formats = lazy(() => import('./pages/library/Formats'))
const Practice = lazy(() => import('./pages/library/Practice'))
const Admin = lazy(() => import('./pages/admin/Dashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/join" element={<Join />} />
            <Route path="/login" element={<Login />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/timer" element={<Timer />} />
            <Route path="/tools/motion" element={<MotionGenerator />} />
            <Route path="/tools/draw" element={<TeamDraw />} />
            <Route path="/tools/score" element={<ScoreSheet />} />
            <Route path="/library" element={<Motions />} />
            <Route path="/library/formats" element={<Formats />} />
            <Route path="/library/practice" element={<Practice />} />
            <Route
              path="/admin"
              element={
                <RequireAuth admin>
                  <Admin />
                </RequireAuth>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

export default App
