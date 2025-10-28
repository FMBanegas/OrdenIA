
import React, { useState, useCallback } from 'react';
import { FamilyMember, Task, TaskStatus } from './types';
import Header from './components/Header';
import FamilyOverview from './components/FamilyOverview';
import TaskBoard from './components/TaskBoard';
import AddTaskModal from './components/AddTaskModal';

const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  { id: '1', name: 'Papá', avatar: 'https://picsum.photos/seed/papa/100', points: 150 },
  { id: '2', name: 'Mamá', avatar: 'https://picsum.photos/seed/mama/100', points: 250 },
  { id: '3', name: 'Lucía', avatar: 'https://picsum.photos/seed/lucia/100', points: 300 },
  { id: '4', name: 'Sofía', avatar: 'https://picsum.photos/seed/sofia/100', points: 180 },
];

const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Pasear al perro', description: 'Dar un paseo de 30 minutos por el parque.', assignedTo: '1', status: TaskStatus.Todo, points: 20 },
  { id: 't2', title: 'Preparar la cena', description: 'Cocinar pasta para toda la familia.', assignedTo: '2', status: TaskStatus.InProgress, points: 30 },
  { id: 't3', title: 'Hacer los deberes de mates', description: 'Completar los ejercicios de la página 42.', assignedTo: '3', status: TaskStatus.Todo, points: 25 },
  { id: 't4', title: 'Ordenar los juguetes', description: 'Guardar todos los juguetes en su caja.', assignedTo: '4', status: TaskStatus.Done, points: 15 },
  { id: 't5', title: 'Regar las plantas', description: 'Regar las plantas de interior y del balcón.', assignedTo: '2', status: TaskStatus.Todo, points: 10 },
  { id: 't6', title: 'Limpiar su habitación', description: 'Hacer la cama, quitar el polvo y ordenar.', assignedTo: '3', status: TaskStatus.InProgress, points: 35 },
];

const App: React.FC = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(INITIAL_FAMILY_MEMBERS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks(prevTasks => {
      const taskIndex = prevTasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prevTasks;

      const task = prevTasks[taskIndex];
      const updatedTasks = [...prevTasks];
      updatedTasks[taskIndex] = { ...task, status: newStatus };

      if (newStatus === TaskStatus.Done && task.status !== TaskStatus.Done && task.assignedTo) {
        const memberId = task.assignedTo;
        setFamilyMembers(prevMembers => {
          const memberIndex = prevMembers.findIndex(m => m.id === memberId);
          if (memberIndex === -1) return prevMembers;
          
          const updatedMembers = [...prevMembers];
          updatedMembers[memberIndex] = { ...updatedMembers[memberIndex], points: updatedMembers[memberIndex].points + task.points };
          return updatedMembers;
        });
      }
      
      return updatedTasks;
    });
  }, []);

  const handleAddTasks = useCallback((newTasks: Omit<Task, 'id' | 'status'>[]) => {
    const tasksToAdd: Task[] = newTasks.map(task => ({
      ...task,
      id: `t${Date.now()}${Math.random()}`,
      status: TaskStatus.Todo,
    }));
    setTasks(prevTasks => [...prevTasks, ...tasksToAdd]);
    setIsModalOpen(false);
  }, []);

  return (
    <div className="min-h-screen font-sans text-gray-800">
      <Header />
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <FamilyOverview familyMembers={familyMembers} />
        <TaskBoard 
          tasks={tasks} 
          familyMembers={familyMembers}
          onUpdateTaskStatus={handleUpdateTaskStatus}
          onOpenModal={() => setIsModalOpen(true)}
        />
      </main>
      {isModalOpen && (
        <AddTaskModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTasks={handleAddTasks}
          familyMembers={familyMembers}
        />
      )}
    </div>
  );
};

export default App;
