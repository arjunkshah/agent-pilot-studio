
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import DisplayCards from '@/components/ui/display-cards';
import { Sparkles, Bot, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface Agent {
  id: string;
  name: string;
  description: string;
  created_at: string;
  status: string;
}

const fetchAgents = async (): Promise<Agent[]> => {
  // Replace with your actual backend URL
  const response = await fetch('/api/agents');
  if (!response.ok) {
    throw new Error('Failed to fetch agents');
  }
  return response.json();
};

const AgentCards = () => {
  const { data: agents, isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getAgentIcon = (index: number) => {
    const icons = [
      <Sparkles className="size-4 text-blue-300" />,
      <Bot className="size-4 text-green-300" />,
      <Zap className="size-4 text-purple-300" />
    ];
    return icons[index % icons.length];
  };

  if (error) {
    console.error('Error fetching agents:', error);
    // Show mock data for demonstration
    const mockAgents = [
      {
        id: '1',
        name: 'Email Assistant',
        description: 'Helps with email composition and replies',
        created_at: new Date().toISOString(),
        status: 'active'
      },
      {
        id: '2',
        name: 'Data Analyzer',
        description: 'Analyzes and visualizes data patterns',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        status: 'active'
      },
      {
        id: '3',
        name: 'Content Writer',
        description: 'Creates engaging content and articles',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        status: 'active'
      }
    ];

    const mockCards = mockAgents.map((agent, index) => ({
      icon: getAgentIcon(index),
      title: agent.name,
      description: agent.description,
      date: formatDate(agent.created_at),
      iconClassName: "text-blue-500",
      titleClassName: "text-blue-500",
      className: index === 0 
        ? "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0"
        : index === 1
        ? "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0"
        : "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10"
    }));

    return (
      <div className="w-full">
        <h3 className="text-lg font-medium text-foreground mb-6 text-center">Your Created Agents</h3>
        <DisplayCards cards={mockCards} />
        <p className="text-sm text-muted-foreground text-center mt-4">
          Demo mode - Connect to your backend to see real agents
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-medium text-foreground mb-6 text-center">Your Created Agents</h3>
        <div className="flex justify-center">
          <Card className="p-8">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-muted-foreground">Loading agents...</span>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!agents || agents.length === 0) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-medium text-foreground mb-6 text-center">Your Created Agents</h3>
        <Card className="p-8 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No agents created yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Start a conversation to create your first AI agent
          </p>
        </Card>
      </div>
    );
  }

  const agentCards = agents.slice(0, 3).map((agent, index) => ({
    icon: getAgentIcon(index),
    title: agent.name,
    description: agent.description,
    date: formatDate(agent.created_at),
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className: index === 0 
      ? "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0"
      : index === 1
      ? "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0"
      : "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10"
  }));

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium text-foreground mb-6 text-center">Your Created Agents</h3>
      <DisplayCards cards={agentCards} />
      {agents.length > 3 && (
        <p className="text-sm text-muted-foreground text-center mt-4">
          Showing 3 of {agents.length} agents
        </p>
      )}
    </div>
  );
};

export default AgentCards;
