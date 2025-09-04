
import React from 'react';
import type { Task } from '../types';
import { CheckIcon, TrashIcon } from './Icons';

interface TaskMatrixProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onClearCompletedTasks: () => void;
}

const TaskMatrix: React.FC<TaskMatrixProps> = ({ tasks, onToggleTask, onClearCompletedTasks }) => {
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="flex flex-col h-full font-mono text-cyan-300">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm">{pendingCount} Pending / {completedCount} Complete</p>
        <button 
          onClick={onClearCompletedTasks}
          className="flex items-center space-x-1 text-cyan-500 hover:text-cyan-200 disabled:opacity-50 disabled:hover:text-cyan-500 transition-colors text-sm"
          disabled={completedCount === 0}
          aria-label="Clear completed tasks"
        >
          <TrashIcon className="h-4 w-4" />
          <span>Clear</span>
        </button>
      </div>
      <div className="flex-grow space-y-2 overflow-y-auto pr-2">
        {tasks.length > 0 ? tasks.map(task => (
          <div 
            key={task.id} 
            onClick={() => onToggleTask(task.id)}
            className="flex items-center p-2 rounded-md bg-cyan-900/30 hover:bg-cyan-800/50 cursor-pointer transition-colors"
          >
            <div className={`w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center mr-3 ${task.completed ? 'bg-cyan-500 border-cyan-400' : 'border-cyan-600'}`}>
              {task.completed && <CheckIcon className="w-4 h-4 text-gray-900" />}
            </div>
            <span className={`flex-grow ${task.completed ? 'line-through text-cyan-500' : 'text-cyan-200'}`}>
              {task.text}
            </span>
          </div>
        )) : (
          <div className="text-center text-cyan-600 italic pt-4">
            <p>Task list is empty.</p>
            <p className="text-xs mt-1">"Sir, simply ask me to add a task."</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskMatrix;
