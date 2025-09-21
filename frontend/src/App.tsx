import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '@/Components/Navbar'
import Hero from '@/Components/Hero'
import Features from '@/Components/Features'
import CallToAction from '@/Components/CallToAction'
import Footer from '@/Components/Footer'
import SignIn from '@/Components/SignIn'
import SignUp from '@/Components/SignUp'
import SweetsDashboard from '@/Components/SweetsDashboard'
import { useAuth } from '@/context/AuthContext'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-rose-100 selection:text-rose-600">
      <Navbar />
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      <Footer />
    </div>
  )
}

function Home() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) {
    return <SweetsDashboard />
  }
  return (
    <>
      <Hero />
      <Features />
      <CallToAction />
    </>
  )
}

export default App

// Smoothly scroll to anchors like /#features within BrowserRouter
function ScrollToHash() {
  const location = useLocation()
  useEffect(() => {
    // If there's a hash, try to scroll to it
    if (location.hash) {
      const id = decodeURIComponent(location.hash.replace('#', ''))
      // Slight delay to ensure DOM content is painted
      const t = setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 0)
      return () => clearTimeout(t)
    } else {
      // No hash: optionally scroll to top on route change
      window.scrollTo({ top: 0 })
    }
  }, [location.pathname, location.hash])
  return null
}
