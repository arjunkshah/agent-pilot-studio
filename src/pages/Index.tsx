
import React, { useState, useEffect } from 'react'
import { HeroSection } from '@/components/ui/hero-section-dark'
import { AnimatedAIChat } from '@/components/ui/animated-ai-chat'
import { SignInPage } from '@/components/ui/sign-in-flow-1'
import { motion } from 'framer-motion'

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)

  // Check if user is logged in on component mount
  useEffect(() => {
    const loggedIn = localStorage.getItem('pilot_logged_in') === 'true'
    setIsLoggedIn(loggedIn)
  }, [])

  const handleSignInSuccess = () => {
    setIsLoggedIn(true)
    setShowSignIn(false)
  }

  const handleGetStartedClick = () => {
    if (isLoggedIn) {
      // Already logged in, do nothing or scroll to task input
      return
    } else {
      // Show sign-in modal
      setShowSignIn(true)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('pilot_logged_in')
    localStorage.removeItem('pilot_user_email')
    setIsLoggedIn(false)
  }

  // If showing sign-in, render only the sign-in component
  if (showSignIn) {
    return <SignInPage onSignInSuccess={handleSignInSuccess} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-foreground">Pilot</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">How it works</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Examples</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={() => setShowSignIn(true)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {isLoggedIn ? (
        <div className="pt-24 pb-20">
          <AnimatedAIChat />
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <HeroSection
            title="AI Agents for Any Task"
            subtitle={{
              regular: "Describe what you need done, and we'll create ",
              gradient: "custom AI agents to do it",
            }}
            description="From writing emails to analyzing data, our AI creates specialized agents tailored to your exact needs. No coding required."
            ctaText="Get Started"
            onCtaClick={handleGetStartedClick}
            bottomImage={{
              light: "https://www.launchuicomponents.com/app-light.png",
              dark: "https://www.launchuicomponents.com/app-dark.png",
            }}
            gridOptions={{
              angle: 65,
              opacity: 0.4,
              cellSize: 50,
              lightLineColor: "#4a4a4a",
              darkLineColor: "#2a2a2a",
            }}
          />
        </>
      )}
    </div>
  )
}

export default Index
