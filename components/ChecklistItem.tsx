import React from 'react';
import { Task } from '../types';

interface ChecklistItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onCollaboratorChange: (id: number, name: string) => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ task, onToggle, onCollaboratorChange }) => {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${task.id === 1 ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`task-${task.id}`}
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="h-5 w-5 rounded border-gray-200 bg-white text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <label
          htmlFor={`task-${task.id}`}
          className={`ml-3 text-lg text-gray-700 select-none cursor-pointer ${task.completed ? 'line-through text-gray-400' : ''}`}
        >
          {task.name}
        </label>
      </div>
      <input
        type="text"
        value={task.collaborator}
        onChange={(e) => onCollaboratorChange(task.id, e.target.value)}
        className="w-1/2 md:w-1/3 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
      />
    </div>
  );
};

export default ChecklistItem;