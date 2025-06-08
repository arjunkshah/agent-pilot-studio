
/** @jsxImportSource react */
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare, Send, User, Bot, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Message, Chat } from '@/pages/Index'

interface ChatInterfaceProps {
  initialTask?: string
  draftMessage?: string
  onBack?: () => void
  activeChat: string | null
  chats: Chat[]
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  initialTask,
  draftMessage,
  onBack,
  activeChat,
  chats,
  setChats
}) => {
  const [message, setMessage] = useState(draftMessage || '')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (draftMessage !== undefined) {
      setMessage(draftMessage)
    }
  }, [draftMessage])

  // Initialize with the initial task if provided
  useEffect(() => {
    if (initialTask && activeChat) {
      // Check if this is a new chat with no messages
      const chat = chats.find(c => c.id === activeChat)
      if (chat && chat.messages.length === 0) {
        sendMessage(initialTask, activeChat)
      }
    }
  }, [initialTask, activeChat])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chats, activeChat])

  const sendMessage = async (content: string, chatId?: string) => {
    const targetChatId = chatId || activeChat
    if (!content.trim() || !targetChatId) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    // Add user message and set title if not set
    setChats(prev => prev.map(chat =>
      chat.id === targetChatId
        ? {
            ...chat,
            title: chat.title === 'New Chat'
              ? content.trim().slice(0, 50) + (content.trim().length > 50 ? '...' : '')
              : chat.title,
            messages: [...chat.messages, userMessage]
          }
        : chat
    ))

    setMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        content: generateAIResponse(content),
        sender: 'ai',
        timestamp: new Date()
      }

      setChats(prev => prev.map(chat => 
        chat.id === targetChatId 
          ? { ...chat, messages: [...chat.messages, aiMessage] }
          : chat
      ))
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userMessage: string) => {
    const responses = [
      `I'll help you with "${userMessage}". Let me create specialized AI agents to handle this task efficiently.`,
      `Great! I'm analyzing your request: "${userMessage}". I'll deploy multiple AI agents to work on different aspects of this task.`,
      `Perfect! For the task "${userMessage}", I'm setting up a team of AI agents with different specializations to ensure the best results.`,
      `Understood! I'm creating custom AI agents tailored specifically for "${userMessage}". Each agent will handle a different component of your request.`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && activeChat) {
      sendMessage(message)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const currentChat = chats.find(chat => chat.id === activeChat)

  return (
    <div className="h-full flex flex-col bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/50">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-fuchsia-500/5 rounded-full mix-blend-normal filter blur-[96px] animate-pulse delay-1000" />
      </div>

      {currentChat ? (
        <>
          {/* Chat Header */}
          <motion.div 
            className="relative z-10 p-6 border-b border-border/50 bg-card/50 backdrop-blur-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground truncate">
                  {currentChat.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  AI agents working on your task
                </p>
              </div>
            </div>
          </motion.div>

          {/* Messages */}
          <ScrollArea className="flex-1 relative z-10">
            <div className="p-6 space-y-6 max-w-4xl mx-auto">
              <AnimatePresence>
                {currentChat.messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-4 max-w-[80%] ${
                      msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <motion.div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          msg.sender === 'user' 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                            : 'bg-gradient-to-r from-muted to-muted/50 border border-border/50'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {msg.sender === 'user' ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Bot className="w-5 h-5 text-foreground" />
                        )}
                      </motion.div>
                      <motion.div 
                        className={`p-4 rounded-2xl backdrop-blur-sm border ${
                          msg.sender === 'user' 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-500/20' 
                            : 'bg-card/50 border-border/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        <p className={`text-xs mt-3 ${
                          msg.sender === 'user' ? 'text-white/60' : 'text-muted-foreground'
                        }`}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-muted to-muted/50 border border-border/50 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="p-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                      <div className="flex space-x-2">
                        <motion.div 
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div 
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div 
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <motion.div 
            className="relative z-10 p-6 border-t border-border/50 bg-card/50 backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="min-h-[60px] max-h-[200px] resize-none pr-16 bg-background/50 border-border/50 focus:border-primary/50 rounded-xl backdrop-blur-sm"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!message.trim() || isTyping}
                  className="absolute right-3 bottom-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      ) : (
        <motion.div 
          className="flex-1 flex items-center justify-center relative z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <MessageSquare className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h3 
              className="text-2xl font-semibold text-foreground mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              No chat selected
            </motion.h3>
            <motion.p 
              className="text-muted-foreground mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Select a chat from the sidebar or create a new one to get started
            </motion.p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ChatInterface
