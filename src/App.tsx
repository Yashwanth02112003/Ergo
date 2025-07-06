import React, { useState } from 'react';
import { Calendar, MessageSquare, BarChart3 } from 'lucide-react';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';
import { FilterBar } from './components/FilterBar';
import { ContextInput } from './components/ContextInput';
import { Dashboard } from './components/Dashboard';
import { ContextHistory } from './components/ContextHistory';
import { AuthForm } from './components/AuthForm';
import { Header } from './components/Header';
import { useTasks } from './hooks/useTasks';
import { useContexts } from './hooks/useContexts';
import { useAuth } from './hooks/useAuth';
import { Task } from './types';

type TabType = 'tasks' | 'context' | 'analytics';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const { 
    tasks, 
    allTasks, 
    filters, 
    setFilters, 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTaskStatus,
    enhanceTaskWithAI,
    refreshTasks
  } = useTasks(user?.id);
  
  const { contexts, loading: contextLoading, addContext } = useContexts(user?.id);

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth form if not authenticated
  if (!user) {
    return <AuthForm onAuthSuccess={() => {}} />;
  }

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await addTask(taskData);
      }
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleAddContext = async (content: string, sourceType: any) => {
    try {
      await addContext(content, sourceType);
      // Refresh tasks to show newly extracted tasks
      refreshTasks();
    } catch (error) {
      console.error('Error adding context:', error);
    }
  };

  const tabs = [
    { id: 'tasks', label: 'Tasks', icon: Calendar },
    { id: 'context', label: 'Context', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header user={user} onSignOut={signOut} />
      
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1 flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'tasks' && (
          <>
            <Dashboard tasks={allTasks} />
            <FilterBar 
              filters={filters} 
              onFiltersChange={setFilters} 
              onAddTask={() => setShowTaskForm(true)}
            />
            
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No tasks found</p>
                  <p className="text-gray-400">Create your first task to get started</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={toggleTaskStatus}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'context' && (
          <>
            <ContextInput 
              onAddContext={handleAddContext}
              loading={contextLoading}
            />
            <ContextHistory contexts={contexts} />
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600">
              Advanced analytics and insights coming soon. This will include task completion trends, 
              productivity metrics, and AI-powered recommendations.
            </p>
          </div>
        )}

        {/* Task Form Modal */}
        {showTaskForm && (
          <TaskForm
            task={editingTask}
            onSave={handleSaveTask}
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
            onEnhanceTask={enhanceTaskWithAI}
          />
        )}
      </div>
    </div>
  );
}

export default App;