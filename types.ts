
export enum TaskStatus {
  Todo = 'Todo',
  InProgress = 'InProgress',
  Done = 'Done',
}

export interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  points: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string | null;
  status: TaskStatus;
  points: number;
}
