
import React, { useState, useEffect } from 'react'
import { HeroSection } from '@/components/ui/hero-section-dark'
import TaskInput from '@/components/TaskInput'
import AgentCreation from '@/components/AgentCreation'
import { SignInPage } from '@/components/ui/sign-in-flow-1'
import { Sparkles, Zap, Brain, Users, CheckCircle, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const Index = () => {
  const [currentTask, setCurrentTask] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)

  // Check if user is logged in on component mount
  useEffect(() => {
    const loggedIn = localStorage.getItem('pilot_logged_in') === 'true'
    setIsLoggedIn(loggedIn)
  }, [])

  const handleTaskSubmit = (task: string) => {
    setIsCreating(true)
    setCurrentTask(task)
  }

  const handleReset = () => {
    setCurrentTask(null)
    setIsCreating(false)
  }

  const handleSignInSuccess = () => {
    setIsLoggedIn(true)
    setShowSignIn(false)
  }

  const handleGetStartedClick = () => {
    if (isLoggedIn) {
      // Scroll to task input section
      document.getElementById('task-input')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Show sign-in modal
      setShowSignIn(true)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('pilot_logged_in')
    localStorage.removeItem('pilot_user_email')
    setIsLoggedIn(false)
    setCurrentTask(null)
    setIsCreating(false)
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

      {isLoggedIn && currentTask ? (
        <div className="pt-24 pb-20">
          <AgentCreation task={currentTask} onReset={handleReset} />
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
            ctaText={isLoggedIn ? "Create Your First Agent" : "Get Started"}
            ctaHref="#task-input"
          />

          {/* Task Input Section - Only show if logged in */}
          {isLoggedIn && (
            <div id="task-input" className="py-20 bg-background">
              <TaskInput onTaskSubmit={handleTaskSubmit} isCreating={isCreating} />
            </div>
          )}

          {/* Enhanced Features Section */}
          <div className="py-32 bg-gradient-to-b from-background via-background/95 to-muted/20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
            
            <div className="max-w-screen-xl mx-auto px-4 relative z-10">
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  Why Choose <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Pilot</span>?
                </h2>
                <p className="text-muted-foreground max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
                  Our AI agents are designed to handle complex tasks with precision and efficiency, adapting to your specific requirements and working together seamlessly
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                {[
                  {
                    icon: <Zap className="w-8 h-8" />,
                    title: "Instant Creation",
                    description: "AI agents are created and deployed in seconds, not hours. Get immediate results for your tasks with our advanced AI technology.",
                    color: "from-yellow-500 to-orange-500",
                    highlight: "Seconds, not hours"
                  },
                  {
                    icon: <Brain className="w-8 h-8" />,
                    title: "Task-Specific Intelligence",
                    description: "Each agent is tailored to your exact requirements with specialized knowledge, tools, and capabilities for maximum effectiveness.",
                    color: "from-purple-500 to-pink-500",
                    highlight: "Tailored intelligence"
                  },
                  {
                    icon: <Users className="w-8 h-8" />,
                    title: "Multi-Agent Collaboration",
                    description: "Multiple agents work together seamlessly to handle complex workflows, ensuring comprehensive and coordinated results.",
                    color: "from-blue-500 to-cyan-500",
                    highlight: "Seamless teamwork"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="group relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                  >
                    <div className="relative p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-border transition-all duration-500 h-full">
                      <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-foreground text-center">{feature.title}</h3>
                      <p className="text-muted-foreground text-center leading-relaxed mb-4">{feature.description}</p>
                      <div className="text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${feature.color} text-white`}>
                          {feature.highlight}
                        </span>
                      </div>
                      
                      {/* Enhanced Hover Effect */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-0 rounded-3xl shadow-2xl shadow-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced Use Cases */}
              <motion.div 
                className="mt-24"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-center mb-12">
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Popular Use Cases</h3>
                  <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
                    See how teams are using Pilot to automate their workflows and boost productivity across different industries
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { 
                      title: "Email Campaigns", 
                      description: "Personalized outreach at scale with AI-powered copywriting", 
                      icon: "📧",
                      metric: "10x faster"
                    },
                    { 
                      title: "Market Research", 
                      description: "Comprehensive industry analysis and competitor insights", 
                      icon: "📊",
                      metric: "95% accurate"
                    },
                    { 
                      title: "Content Creation", 
                      description: "Blog posts, social media, and marketing materials", 
                      icon: "✍️",
                      metric: "50+ formats"
                    },
                    { 
                      title: "Data Analysis", 
                      description: "Extract insights from complex datasets and reports", 
                      icon: "📈",
                      metric: "Real-time insights"
                    }
                  ].map((useCase, index) => (
                    <motion.div
                      key={index}
                      className="group p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30 hover:bg-card/60 hover:border-border/60 transition-all duration-300"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.03, y: -5 }}
                    >
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{useCase.icon}</div>
                      <h4 className="font-semibold text-foreground mb-2 text-lg">{useCase.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{useCase.description}</p>
                      <div className="text-xs font-medium text-purple-600 dark:text-purple-400">
                        {useCase.metric}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Enhanced CTA Section */}
              <motion.div 
                className="mt-32 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-30"></div>
                  <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-12 rounded-3xl">
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to get started?</h3>
                    <p className="text-white/80 mb-8 text-lg max-w-2xl mx-auto">
                      Join thousands of teams already using Pilot to automate their workflows and achieve more with AI agents
                    </p>
                    <button 
                      onClick={handleGetStartedClick}
                      className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 text-lg hover:scale-105"
                    >
                      {isLoggedIn ? 'Create Your First Agent' : 'Get Started Free'} 
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <div className="mt-6 flex items-center justify-center gap-6 text-white/60 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>No credit card required</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Free tier available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Index
