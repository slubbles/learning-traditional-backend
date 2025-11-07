// ========================================
// TASKS PAGE
// ========================================
// View and manage all tasks

'use client';

import { useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTasksStore } from '@/store/tasks';
import { getTasks } from '@/lib/api/tasks';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

export default function TasksPage() {
  const { tasks, setTasks, isLoading, setLoading } = useTasksStore();
  const { user } = useAuthStore();

  // Fetch tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data.tasks);
    } catch (err: any) {
      console.error('Failed to load tasks:', err);
      toast.error('Failed to Load Tasks', {
        description: err.response?.data?.error || 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'destructive';
      case 'HIGH':
        return 'default';
      case 'MEDIUM':
        return 'secondary';
      case 'LOW':
        return 'outline';
      default:
        return 'outline';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'default';
      case 'IN_PROGRESS':
        return 'secondary';
      case 'IN_REVIEW':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
        <Navbar />

        <main className="container mx-auto p-6">
          {/* Header */}
          <motion.div
            className="mb-8 flex items-center justify-between"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div>
              <h1 className="mb-2 text-3xl font-bold">Tasks</h1>
              <p className="text-gray-600">Manage all your tasks</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Task
              </Button>
            </motion.div>
          </motion.div>

          {/* Tasks List */}
          {isLoading ? (
            <motion.div
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div key={i} variants={scaleIn}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="mt-2 h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-12" />
                          <Skeleton className="h-5 w-20" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-12" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                      <Skeleton className="mt-4 h-10 w-full" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : tasks.length === 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="flex min-h-[300px] flex-col items-center justify-center">
                  <motion.div
                    className="mb-4 rounded-full bg-gray-100 p-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <svg
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </motion.div>
                  <p className="mb-4 text-lg font-medium text-gray-700">No tasks yet</p>
                  <p className="mb-6 text-sm text-gray-500">Create your first task to get started</p>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="gap-2">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Create Your First Task
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {tasks.map((task, index) => (
                <motion.div key={task.id} variants={scaleIn}>
                  <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden border-l-4" style={{
                    borderLeftColor: task.priority === 'HIGH' ? 'rgb(239, 68, 68)' : task.priority === 'MEDIUM' ? 'rgb(245, 158, 11)' : 'rgb(34, 197, 94)'
                  }}>
                    <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-pink-50">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="line-clamp-2 text-lg">{task.title}</CardTitle>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Badge variant={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </motion.div>
                      </div>
                      <CardDescription className="line-clamp-2 mt-2">
                        {task.description || 'No description'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-blue-100 p-1">
                              <svg className="h-3 w-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-600">Status:</span>
                          </div>
                          <Badge variant={getStatusColor(task.status)}>
                            {task.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        {task.assigneeId && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="rounded-full bg-purple-100 p-1">
                                <svg className="h-3 w-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-600">Assigned:</span>
                            </div>
                            <span className="text-sm font-medium">{task.assigneeId === user?.id ? 'You' : 'Team member'}</span>
                          </div>
                        )}
                        
                        {task.dueDate && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="rounded-full bg-green-100 p-1">
                                <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-600">Due:</span>
                            </div>
                            <span className="text-sm font-medium">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <motion.div
                        className="mt-4"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button variant="outline" className="w-full font-medium hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 transition-colors">
                          View Details
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
