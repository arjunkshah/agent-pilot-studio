
import React, { useState } from 'react'
import { HeroSection } from '@/components/ui/hero-section-dark'
import TaskInput from '@/components/TaskInput'
import AgentCreation from '@/components/AgentCreation'

const Index = () => {
  const [currentTask, setCurrentTask] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleTaskSubmit = (task: string) => {
    setIsCreating(true)
    setCurrentTask(task)
  }

  const handleReset = () => {
    setCurrentTask(null)
    setIsCreating(false)
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
          </div>
        </div>
      </nav>

      {!currentTask ? (
        <>
          {/* Hero Section */}
          <HeroSection
            title="AI Agents for Any Task"
            subtitle={{
              regular: "Describe what you need done, and we'll create ",
              gradient: "custom AI agents to do it",
            }}
            description="From writing emails to analyzing data, our AI creates specialized agents tailored to your exact needs. No coding required."
            ctaText="Create Your First Agent"
            ctaHref="#task-input"
            gridOptions={{
              angle: 65,
              opacity: 0.3,
              cellSize: 60,
              lightLineColor: "#6366f1",
              darkLineColor: "#4338ca",
            }}
          />

          {/* Task Input Section */}
          <div id="task-input" className="py-20 bg-background">
            <TaskInput onTaskSubmit={handleTaskSubmit} isCreating={isCreating} />
          </div>
        </>
      ) : (
        <div className="pt-24 pb-20">
          <AgentCreation task={currentTask} onReset={handleReset} />
        </div>
      )}

      {/* Features Section */}
      {!currentTask && (
        <div className="py-20 bg-muted/30">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Why Choose Pilot?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our AI agents are designed to handle complex tasks with precision and efficiency
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Instant Creation</h3>
                <p className="text-muted-foreground">AI agents are created and deployed in seconds, not hours</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Task-Specific</h3>
                <p className="text-muted-foreground">Each agent is tailored to your exact requirements and goals</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">🔄</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Continuous Learning</h3>
                <p className="text-muted-foreground">Agents improve and adapt based on feedback and results</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Index
