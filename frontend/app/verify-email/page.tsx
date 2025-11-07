'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';
import apiClient from '@/lib/api/client';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email...');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await apiClient.get(`/auth/verify-email/${token}`);
        
        // Store user and token (auto-login)
        setAuth(response.data.user, response.data.token);
        setUser(response.data.user);
        setStatus('success');
        setMessage(response.data.message);
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
        
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.error || 'Verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, setAuth, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="flex min-h-[300px] flex-col items-center justify-center p-8">
          {status === 'verifying' && (
            <>
              <div className="mb-6 inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Verifying Email</h2>
              <p className="text-center text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Email Verified!</h2>
              <p className="mb-6 text-center text-gray-600">{message}</p>
              {user && (
                <p className="mb-6 text-center text-sm text-gray-500">
                  Welcome, <strong>{user.name}</strong>!
                </p>
              )}
              <p className="text-center text-sm text-gray-500">
                Redirecting to dashboard in 3 seconds...
              </p>
              <Button
                className="mt-4"
                onClick={() => router.push('/dashboard')}
              >
                Go to Dashboard Now
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-10 w-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Verification Failed</h2>
              <p className="mb-6 text-center text-gray-600">{message}</p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/register')}
                >
                  Register Again
                </Button>
                <Button
                  onClick={() => router.push('/login')}
                >
                  Go to Login
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
