import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
interface TaskInputProps {
  onTaskSubmit: (task: string) => void;
  isCreating: boolean;
}
const TaskInput: React.FC<TaskInputProps> = ({
  onTaskSubmit,
  isCreating
}) => {
  const [task, setTask] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim() && !isCreating) {
      onTaskSubmit(task.trim());
    }
  };
  const examples = ["Write and send 10 personalized cold emails to potential clients", "Research and summarize the top 5 AI trends for 2024", "Create a social media content calendar for next month", "Analyze competitor pricing and create a comparison report"];
  return <div className="w-full max-w-4xl mx-auto px-4">
      <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="text-center mb-6">
          <h2 className="mb-2 font-extrabold text-gray-50 text-2xl text-center">What do you need done?</h2>
          <p className="text-muted-foreground">Describe any task and custom AI agents wi</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea value={task} onChange={e => setTask(e.target.value)} placeholder="Enter your task here... (e.g., Create a marketing plan for my new product)" className="min-h-[120px] text-lg resize-none bg-background/50 border-border/50 focus:border-primary/50" disabled={isCreating} />
          
          <div className="flex justify-center">
            <Button type="submit" disabled={!task.trim() || isCreating} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
              {isCreating ? 'Creating Agent...' : 'Create AI Agent'}
            </Button>
          </div>
        </form>

        <div className="mt-8">
          <p className="text-sm font-medium text-muted-foreground mb-3">Example tasks:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {examples.map((example, index) => <button key={index} onClick={() => !isCreating && setTask(example)} className="text-left p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors text-sm text-muted-foreground hover:text-foreground border border-border/30" disabled={isCreating}>
                {example}
              </button>)}
          </div>
        </div>
      </Card>
    </div>;
};
export default TaskInput;