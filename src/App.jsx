import React from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import WorkExperience from './components/WorkExperience/WorkExperience'
import ContactMe from './components/ContactMe/ContactMe'
import Footer from './components/Footer/Footer'
import Achievements from './components/Achievements/Achievements'


function App() {
  return (
    <>
      <Navbar />

      <div className="container">
        {/*
        <div className="bg">
          <div className="bubble bubble1"></div>
          <div className="bubble bubble2"></div>
        </div>
        */}
        <Hero/>
        <About />
        <WorkExperience />
        <Achievements />
        <ContactMe />
      </div>
      <Footer />
    </>
  )
}

export default App