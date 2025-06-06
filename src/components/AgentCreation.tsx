
import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface AgentCreationProps {
  task: string
  onReset: () => void
}

const AgentCreation: React.FC<AgentCreationProps> = ({ task, onReset }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [agentName, setAgentName] = useState('')
  const [agentCapabilities, setAgentCapabilities] = useState<string[]>([])

  const steps = [
    { title: 'Analyzing Task', description: 'Understanding your requirements' },
    { title: 'Designing Agent', description: 'Creating specialized AI capabilities' },
    { title: 'Training Agent', description: 'Teaching task-specific skills' },
    { title: 'Agent Ready', description: 'Your custom AI agent is ready to work' }
  ]

  useEffect(() => {
    // Generate agent name based on task
    const generateAgentName = () => {
      const taskWords = task.toLowerCase().split(' ')
      const actionWord = taskWords.find(word => 
        ['write', 'create', 'analyze', 'research', 'send', 'build', 'design', 'manage'].includes(word)
      ) || 'Task'
      const randomSuffix = Math.floor(Math.random() * 1000)
      return `${actionWord.charAt(0).toUpperCase() + actionWord.slice(1)}Agent-${randomSuffix}`
    }

    // Generate capabilities based on task
    const generateCapabilities = () => {
      const capabilities = []
      const taskLower = task.toLowerCase()
      
      if (taskLower.includes('email') || taskLower.includes('send')) {
        capabilities.push('Email Communication', 'Personalization')
      }
      if (taskLower.includes('research') || taskLower.includes('analyze')) {
        capabilities.push('Web Research', 'Data Analysis')
      }
      if (taskLower.includes('write') || taskLower.includes('content')) {
        capabilities.push('Content Generation', 'Writing Optimization')
      }
      if (taskLower.includes('social') || taskLower.includes('media')) {
        capabilities.push('Social Media Management', 'Content Scheduling')
      }
      if (taskLower.includes('report') || taskLower.includes('summary')) {
        capabilities.push('Report Generation', 'Data Visualization')
      }
      
      // Add some default capabilities
      if (capabilities.length === 0) {
        capabilities.push('Task Automation', 'Process Optimization')
      }
      
      capabilities.push('Real-time Updates', 'Quality Assurance')
      return capabilities
    }

    setAgentName(generateAgentName())
    setAgentCapabilities(generateCapabilities())

    // Simulate agent creation process
    const intervals = [1500, 2000, 2500] // Different timing for each step
    
    intervals.forEach((interval, index) => {
      setTimeout(() => {
        setCurrentStep(index + 1)
      }, intervals.slice(0, index + 1).reduce((sum, time) => sum + time, 0))
    })
  }, [task])

  return (
    <div className="w-full max-w-4xl mx-auto px-4 space-y-6">
      {/* Progress Steps */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="flex justify-between items-center mb-6">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 ${
                index <= currentStep 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {index < currentStep ? '✓' : index + 1}
              </div>
              <div className="mt-2">
                <p className={`text-sm font-medium ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`absolute h-px w-16 mt-4 ml-12 transition-all duration-500 ${
                  index < currentStep ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Agent Details */}
      {currentStep >= 1 && (
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 animate-fade-in">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Agent Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Agent Name</label>
              <p className="text-foreground font-mono bg-muted/30 px-3 py-2 rounded-md">{agentName}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Task Description</label>
              <p className="text-foreground bg-muted/30 px-3 py-2 rounded-md">{task}</p>
            </div>

            {currentStep >= 2 && (
              <div className="animate-fade-in">
                <label className="text-sm font-medium text-muted-foreground">Specialized Capabilities</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {agentCapabilities.map((capability, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-foreground rounded-full text-sm border border-purple-600/30"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Agent Ready */}
      {currentStep >= 3 && (
        <Card className="p-6 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-purple-600/30 animate-fade-in">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">{agentName} is Ready!</h3>
            <p className="text-muted-foreground mb-6">Your custom AI agent has been created and is ready to start working on your task.</p>
            
            <div className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                Deploy Agent
              </Button>
              <Button variant="outline" onClick={onReset} className="w-full">
                Create Another Agent
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default AgentCreation
