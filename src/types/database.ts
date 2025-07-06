export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          priority: 'high' | 'medium' | 'low';
          deadline: string | null;
          status: 'pending' | 'in-progress' | 'completed';
          user_id: string;
          context_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          category?: string;
          priority?: 'high' | 'medium' | 'low';
          deadline?: string | null;
          status?: 'pending' | 'in-progress' | 'completed';
          user_id: string;
          context_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: string;
          priority?: 'high' | 'medium' | 'low';
          deadline?: string | null;
          status?: 'pending' | 'in-progress' | 'completed';
          user_id?: string;
          context_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      contexts: {
        Row: {
          id: string;
          content: string;
          source_type: 'email' | 'message' | 'note' | 'meeting';
          processed_at: string | null;
          extracted_tasks: number;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          source_type: 'email' | 'message' | 'note' | 'meeting';
          processed_at?: string | null;
          extracted_tasks?: number;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          content?: string;
          source_type?: 'email' | 'message' | 'note' | 'meeting';
          processed_at?: string | null;
          extracted_tasks?: number;
          user_id?: string;
          created_at?: string;
        };
      };
    };
  };
}