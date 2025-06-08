
/** @jsxImportSource react */
import React, { useState, useEffect, useRef } from 'react'
import { HeroSection } from '@/components/ui/hero-section-dark'
import { AnimatedAIChat } from '@/components/ui/animated-ai-chat'
import { SignInModal } from '@/components/ui/sign-in-flow-adapted'
import ChatInterface from '@/components/ChatInterface'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { MessageSquare, PlusIcon, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [initialTask, setInitialTask] = useState<string>('')
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [authError, setAuthError] = useState<string>('')

  // Check if user is logged in on component mount
  useEffect(() => {
    const loggedIn = localStorage.getItem('pilot_logged_in') === 'true'
    setIsLoggedIn(loggedIn)
    
    // Load previous chats from localStorage
    const savedChats = localStorage.getItem('pilot_chats')
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats)
        setChats(parsedChats.map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        })))
      } catch (e) {
        console.error('Failed to parse saved chats', e)
      }
    }
  }, [])

  // Save chats to localStorage when they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('pilot_chats', JSON.stringify(chats))
    }
  }, [chats])

  const handleSignInSuccess = () => {
    setIsLoggedIn(true)
    setShowSignIn(false)
    setAuthError('')
    toast.success('Successfully signed in!')
  }

  const handleSignInError = (error: string) => {
    setAuthError(error)
    toast.error(error)
  }

  const handleGetStartedClick = () => {
    if (isLoggedIn) {
      return
    } else {
      setShowSignIn(true)
    }
  }

  const createNewChat = (firstMessage?: string) => {
    const newChatId = `chat-${Date.now()}`
    const newChat: Chat = {
      id: newChatId,
      title: firstMessage ? firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '') : 'New Chat',
      messages: [],
      createdAt: new Date()
    }

    setChats(prev => [newChat, ...prev])
    setActiveChat(newChatId)
    return newChatId
  }

  const handleTaskSubmit = (task: string) => {
    const chatId = createNewChat(task)
    setInitialTask(task)
    setShowChat(true)
    setActiveChat(chatId)
  }

  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId)
    setShowChat(true)
    const chat = chats.find(c => c.id === chatId)
    if (chat) {
      setInitialTask(chat.title)
    }
  }

  const handleBackToHome = () => {
    setShowChat(false)
    setInitialTask('')
    setActiveChat(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('pilot_logged_in')
    localStorage.removeItem('pilot_user_email')
    setIsLoggedIn(false)
    setShowChat(false)
    setInitialTask('')
    setActiveChat(null)
    toast.success('Successfully logged out')
  }

  // If showing sign-in, render only the sign-in component
  if (showSignIn) {
    return (
      <SignInModal 
        onSignInSuccess={handleSignInSuccess} 
        onSignInError={handleSignInError}
        authError={authError}
      />
    )
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
            {!showChat && (
              <>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">How it works</a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Examples</a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              </>
            )}
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

      <AnimatePresence mode="wait">
        {showChat ? (
          <motion.div 
            className="h-screen pt-16 flex bg-background"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {/* Sidebar */}
            <AnimatePresence initial={false}>
              {isSidebarOpen && (
                <motion.div 
                  className="w-80 border-r border-border bg-card flex flex-col"
                  initial={{ x: -320, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -320, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {/* Header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-foreground">Chats</h2>
                      <Button
                        onClick={() => {
                          const chatId = createNewChat()
                          setActiveChat(chatId)
                        }}
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        New Chat
                      </Button>
                    </div>
                    <Button
                      onClick={handleBackToHome}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Home
                    </Button>
                  </div>

                  {/* Chat List */}
                  <ScrollArea className="flex-1">
                    <div className="p-2 space-y-2">
                      {chats.map((chat) => (
                        <Card
                          key={chat.id}
                          className={`p-3 cursor-pointer transition-colors hover:bg-accent/50 ${
                            activeChat === chat.id ? 'bg-accent border-primary' : ''
                          }`}
                          onClick={() => handleSelectChat(chat.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <MessageSquare className="w-4 h-4 mt-1 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {chat.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(chat.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle sidebar button */}
            <motion.button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-card border border-border h-10 w-6 z-20 flex items-center justify-center rounded-r-md"
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isSidebarOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </motion.button>

            {/* Chat interface */}
            <div className="flex-1">
              <ChatInterface 
                initialTask={initialTask} 
                onBack={handleBackToHome}
                activeChat={activeChat}
                chats={chats}
                setChats={setChats}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="pt-24 pb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {isLoggedIn ? (
              <div className="relative">
                <AnimatedAIChat onTaskSubmit={handleTaskSubmit} />
                
                {chats.length > 0 && (
                  <motion.div 
                    className="mt-8 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-lg font-medium text-foreground mb-4 px-4">Recent Chats</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-4">
                      {chats.slice(0, 4).map(chat => (
                        <Card
                          key={chat.id}
                          className="p-3 cursor-pointer transition-colors hover:bg-accent/50"
                          onClick={() => handleSelectChat(chat.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <MessageSquare className="w-4 h-4 mt-1 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {chat.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(chat.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Index
