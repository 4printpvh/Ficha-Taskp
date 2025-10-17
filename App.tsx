
import React, { useState, useCallback } from 'react';
import { Task } from './types';
import ChecklistItem from './components/ChecklistItem';
import ImageUploader from './components/ImageUploader';

const initialTasks: Task[] = [
  { id: 1, name: 'Orçamento', completed: false, collaborator: '' },
  { id: 2, name: 'Venda', completed: false, collaborator: '' },
  { id: 3, name: 'Arte', completed: false, collaborator: '' },
  { id: 4, name: 'Serralheria', completed: false, collaborator: '' },
  { id: 5, name: 'Corte', completed: false, collaborator: '' },
  { id: 6, name: 'Impressão', completed: false, collaborator: '' },
  { id: 7, name: 'Acabamento', completed: false, collaborator: '' },
];

const App: React.FC = () => {
  const [clientName, setClientName] = useState('Leonardo Condé');
  const [layoutImage, setLayoutImage] = useState<File | null>(null);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [deliveryDate, setDeliveryDate] = useState<string>('');

  const handleTaskToggle = useCallback((id: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const handleCollaboratorChange = useCallback((id: number, name:string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, collaborator: name } : task
      )
    );
  }, []);

  const handleFileSelect = (file: File | null) => {
    setLayoutImage(file);
  };
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const projectData = {
        clientName,
        layoutImage: layoutImage ? { name: layoutImage.name, type: layoutImage.type, size: layoutImage.size } : null,
        tasks,
        deliveryDate
    };
    console.log("Project Data Submitted:", JSON.stringify(projectData, null, 2));
    alert("Projeto salvo! Verifique o console para ver os dados.");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800">Ordem de Serviço</h1>
            <p className="text-gray-500 mt-2">Acompanhamento de Projeto</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="client-name" className="text-xl font-semibold text-gray-700 mb-2 block">
                  Cliente:
                </label>
                <input
                  type="text"
                  id="client-name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nome do cliente"
                />
              </div>

              <ImageUploader onFileSelect={handleFileSelect} initialImageUrl="https://picsum.photos/id/1060/800/400" />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Checklist de Etapas</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-t-lg">
                    <span className="font-semibold text-gray-600">Tarefa</span>
                    <span className="font-semibold text-gray-600">Colaborador</span>
                </div>
                {tasks.map(task => (
                  <ChecklistItem
                    key={task.id}
                    task={task}
                    onToggle={handleTaskToggle}
                    onCollaboratorChange={handleCollaboratorChange}
                  />
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
                 <label htmlFor="delivery-date" className="text-xl font-semibold text-gray-700 mb-2 block">
                  Data de Entrega:
                </label>
                <input
                  type="date"
                  id="delivery-date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
              >
                Salvar Projeto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
