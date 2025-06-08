/** @jsxImportSource react */
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { PlusIcon, MessageSquare, Send, User, Bot } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Message, Chat } from '@/pages/Index'

interface ChatInterfaceProps {
  initialTask?: string
  onBack?: () => void
  activeChat: string | null
  chats: Chat[]
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  initialTask, 
  onBack, 
  activeChat, 
  chats, 
  setChats 
}) => {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

    // Add user message
    setChats(prev => prev.map(chat => 
      chat.id === targetChatId 
        ? { ...chat, messages: [...chat.messages, userMessage] }
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
    <div className="h-full flex flex-col bg-background">
      {currentChat ? (
        <>
          {/* Chat Header */}
          <div className="p-4 border-b border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {currentChat.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              AI agents working on your task
            </p>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 max-w-4xl mx-auto">
              {currentChat.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[80%] ${
                    msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.sender === 'user' 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                        : 'bg-muted'
                    }`}>
                      {msg.sender === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-foreground" />
                      )}
                    </div>
                    <Card className={`p-3 ${
                      msg.sender === 'user' 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className={`text-xs mt-2 ${
                        msg.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </Card>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Bot className="w-4 h-4 text-foreground" />
                    </div>
                    <Card className="p-3 bg-muted">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </Card>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border bg-card">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="min-h-[60px] max-h-[200px] resize-none pr-12"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!message.trim() || isTyping}
                    className="absolute right-2 bottom-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No chat selected
            </h3>
            <p className="text-muted-foreground mb-4">
              Select a chat from the sidebar or create a new one
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatInterface