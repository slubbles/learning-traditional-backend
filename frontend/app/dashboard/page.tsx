// ========================================
// DASHBOARD PAGE
// ========================================
// Main page after login - shows projects and tasks

'use client';

import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Navbar />

        {/* Main Content */}
        <main className="container mx-auto p-6">
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h2 className="mb-2 text-3xl font-bold">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h2>
          <p className="text-gray-600">Here's what's happening with your projects today</p>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Stats Cards */}
          <motion.div variants={scaleIn}>
            <Card className="overflow-hidden border-l-4 border-l-blue-600 transition-all hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
                  <motion.div
                    className="rounded-full bg-blue-100 p-2"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent>
                <motion.p
                  className="text-4xl font-bold text-gray-900"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  0
                </motion.p>
                <p className="mt-2 text-sm text-gray-500">Active projects</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="overflow-hidden border-l-4 border-l-purple-600 transition-all hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">My Tasks</CardTitle>
                  <motion.div
                    className="rounded-full bg-purple-100 p-2"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <svg
                      className="h-5 w-5 text-purple-600"
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
                </div>
              </CardHeader>
              <CardContent>
                <motion.p
                  className="text-4xl font-bold text-gray-900"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  0
                </motion.p>
                <p className="mt-2 text-sm text-gray-500">Assigned to you</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="overflow-hidden border-l-4 border-l-green-600 transition-all hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                  <motion.div
                    className="rounded-full bg-green-100 p-2"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent>
                <motion.p
                  className="text-4xl font-bold text-gray-900"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  0
                </motion.p>
                <p className="mt-2 text-sm text-gray-500">This week</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Quick Actions Section */}
        <motion.div
          className="mt-8"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-2 border-dashed border-gray-200 bg-white/50 backdrop-blur transition-all hover:border-blue-300 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Quick Actions
              </CardTitle>
              <CardDescription>Get started with your work</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Link href="/projects">
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
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                      </svg>
                      View Projects
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/tasks">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" className="gap-2">
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
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      View Tasks
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      </div>
    </ProtectedRoute>
  );
}
