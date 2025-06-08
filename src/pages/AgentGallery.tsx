import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { GradientCard } from '@/components/ui/gradient-card'
import { Card } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

interface Agent {
  id: string
  name: string
  description: string
  created_at: string
  status: string
}

const fetchAgents = async (): Promise<Agent[]> => {
  const response = await fetch('/api/agents')
  if (!response.ok) {
    throw new Error('Failed to fetch agents')
  }
  return response.json()
}

const AgentGallery = () => {
  const { data: agents, isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
  })

  const mockAgents: Agent[] = [
    {
      id: '1',
      name: 'Email Assistant',
      description: 'Helps with email composition and replies',
      created_at: new Date().toISOString(),
      status: 'active',
    },
    {
      id: '2',
      name: 'Data Analyzer',
      description: 'Analyzes and visualizes data patterns',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      status: 'active',
    },
    {
      id: '3',
      name: 'Content Writer',
      description: 'Creates engaging content and articles',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      status: 'active',
    },
  ]

  const displayAgents = error || !agents ? mockAgents : agents

  return (
    <div className="min-h-screen bg-background pt-20">
      <h2 className="text-center text-2xl font-semibold mb-8 text-foreground">Agent Gallery</h2>
      {isLoading ? (
        <div className="flex justify-center">
          <Card className="p-6 flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground">Loading agents...</span>
          </Card>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 max-w-6xl mx-auto">
          {displayAgents.map((agent) => (
            <GradientCard key={agent.id} title={agent.name} description={agent.description} />
          ))}
        </div>
      )}
      {error && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          Showing demo agents due to fetch error
        </p>
      )}
    </div>
  )
}

export default AgentGallery
