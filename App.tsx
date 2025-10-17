
import React, { useState, useCallback, useRef } from 'react';
import { Task } from './types';
import ChecklistItem from './components/ChecklistItem';
import ImageUploader from './components/ImageUploader';

// Declaração para informar ao TypeScript sobre as bibliotecas globais
declare var jspdf: any;
declare var html2canvas: any;

const initialTasks: Task[] = [
  { id: 1, name: 'Orçamento', completed: false, collaborator: '' },
  { id: 2, name: 'Venda', completed: false, collaborator: '' },
  { id: 3, name: 'Arte', completed: false, collaborator: '' },
  { id: 4, name: 'Serralheria', completed: false, collaborator: '' },
  { id: 5, name: 'Corte', completed: false, collaborator: '' },
  { id: 6, name: 'Impressão', completed: false, collaborator: '' },
  { id: 7, name: 'Acabamento', completed: false, collaborator: '' },
  { id: 8, name: 'Instalação', completed: false, collaborator: '' },
];

const App: React.FC = () => {
  const [clientName, setClientName] = useState('Leonardo Condé');
  const [serviceType, setServiceType] = useState('Comunicação Visual');
  const [layoutImage, setLayoutImage] = useState<File | null>(null);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const printableRef = useRef<HTMLDivElement>(null);

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
        serviceType,
        layoutImage: layoutImage ? { name: layoutImage.name, type: layoutImage.type, size: layoutImage.size } : null,
        tasks,
        deliveryDate
    };
    console.log("Project Data Submitted:", JSON.stringify(projectData, null, 2));
    alert("Projeto salvo! Verifique o console para ver os dados.");
  };

  const handleGeneratePdf = () => {
    const input = printableRef.current;
    if (!input) {
      console.error("Elemento para impressão não encontrado!");
      return;
    }

    html2canvas(input, { scale: 2, useCORS: true }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = jspdf;
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const ratio = canvasWidth / canvasHeight;
      const heightInPdf = pdfWidth / ratio;
      
      let finalHeight = heightInPdf;
      if (heightInPdf > pdfHeight) {
          finalHeight = pdfHeight; // Limita a altura a uma página para este exemplo
      }

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, finalHeight);
      pdf.save(`ordem-servico-${clientName.replace(/\s/g, '_')}.pdf`);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full mx-auto">
        <div ref={printableRef} className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-3xl font-bold"
                    placeholder="Nome do cliente"
                  />
                </div>
                
                <div>
                  <label htmlFor="service-type" className="text-xl font-semibold text-gray-700 mb-2 block">
                    Tipo de Serviço:
                  </label>
                  <input
                    type="text"
                    id="service-type"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-3xl font-bold"
                    placeholder="Tipo de Serviço"
                  />
                </div>

                <ImageUploader onFileSelect={handleFileSelect} initialImageUrl="https://picsum.photos/id/1060/800/400" />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Checklist de Etapas</h2>
                <div className="space-y-1">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-3xl font-bold"
                  />
              </div>
            </form>
          </div>
        </div>
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handleGeneratePdf}
            className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v3a2 2 0 002 2h6a2 2 0 002-2v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v3h6v-3z" clipRule="evenodd" />
              <path d="M9 11a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
            </svg>
            Gerar PDF para Impressão
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
