
"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface SignInPageProps {
  onSignInSuccess: () => void
  onSignInError?: (error: string) => void
  authError?: string
}

export function SignInPage({ onSignInSuccess, onSignInError, authError }: SignInPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [localError, setLocalError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLocalError("")

    // Simulate authentication
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate different scenarios based on form state
      const existingUsers = JSON.parse(localStorage.getItem('pilot_users') || '[]')
      const userExists = existingUsers.some((user: any) => user.email === email)

      if (isSignUp) {
        if (userExists) {
          const error = "An account with this email already exists. Please sign in instead."
          setLocalError(error)
          onSignInError?.(error)
          setIsLoading(false)
          return
        }
        
        // Create new user
        const newUser = { email, password, id: Date.now().toString() }
        existingUsers.push(newUser)
        localStorage.setItem('pilot_users', JSON.stringify(existingUsers))
        localStorage.setItem('pilot_logged_in', 'true')
        localStorage.setItem('pilot_user_email', email)
        
        onSignInSuccess()
      } else {
        if (!userExists) {
          const error = "No account found with this email. Please sign up first."
          setLocalError(error)
          onSignInError?.(error)
          setIsLoading(false)
          return
        }
        
        const user = existingUsers.find((user: any) => user.email === email)
        if (user.password !== password) {
          const error = "Incorrect password. Please try again."
          setLocalError(error)
          onSignInError?.(error)
          setIsLoading(false)
          return
        }
        
        localStorage.setItem('pilot_logged_in', 'true')
        localStorage.setItem('pilot_user_email', email)
        onSignInSuccess()
      }
    } catch (error) {
      const errorMessage = "Something went wrong. Please try again."
      setLocalError(errorMessage)
      onSignInError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const displayError = localError || authError

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md backdrop-blur-2xl bg-card/50 border-border/50">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">P</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-center">
              {isSignUp ? "Create your account" : "Welcome back"}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp 
                ? "Enter your details to create your account" 
                : "Enter your credentials to access your account"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {displayError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {displayError}
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  isSignUp ? "Sign up" : "Sign in"
                )}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </span>
              {" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setLocalError("")
                }}
                className="text-primary hover:underline"
                disabled={isLoading}
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
