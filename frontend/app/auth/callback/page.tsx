'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import apiClient from '@/lib/api/client';

/**
 * OAuth Callback Handler
 * Receives token from backend after successful OAuth login
 */
export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      // OAuth failed - redirect to login with error
      router.push('/login?error=' + errorParam);
      return;
    }

    if (token) {
      // Fetch user profile with the token
      const fetchUserProfile = async () => {
        try {
          const response = await apiClient.get('/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          // Store user and token
          setAuth(response.data, token);
          router.push('/dashboard');
        } catch (err: any) {
          console.error('Failed to fetch user profile:', err);
          setError('Failed to complete sign in');
          setTimeout(() => router.push('/login'), 2000);
        }
      };

      fetchUserProfile();
    } else {
      // No token received - redirect to login
      router.push('/login');
    }
  }, [searchParams, setAuth, router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-red-600">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900">{error}</p>
          <p className="mt-2 text-sm text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}
