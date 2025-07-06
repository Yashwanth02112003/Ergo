export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string | null;
  status: 'pending' | 'in-progress' | 'completed';
  created_at: string;
  updated_at: string;
  user_id: string;
  context_id?: string | null;
}

export interface Context {
  id: string;
  content: string;
  source_type: 'email' | 'message' | 'note' | 'meeting';
  processed_at?: string | null;
  created_at: string;
  extracted_tasks: number;
  user_id: string;
}

export interface TaskFilters {
  category: string;
  priority: string;
  status: string;
  search: string;
}

export interface AITaskSuggestion {
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  confidence: number;
}