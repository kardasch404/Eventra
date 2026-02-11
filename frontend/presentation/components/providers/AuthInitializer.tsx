'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { setCredentials, logout, setLoading } from '@/shared/store/slices/auth.slice';
import { AuthService } from '@/infrastructure/services/auth-cookie.service';
import { useQuery } from '@apollo/client/react';
import { GET_ME } from '@/infrastructure/graphql/queries';

interface MeQueryData {
  me: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    isEmailVerified: boolean;
    roles: string[];
    createdAt: string;
    updatedAt: string;
  };
}

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading: authLoading } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  // Only access client-side APIs after mounting
  const accessToken = mounted ? AuthService.getAccessToken() : null;
  const refreshToken = mounted ? AuthService.getRefreshToken() : null;

  // Only run the query if we have a token but Redux isn't authenticated yet
  const { data, loading: queryLoading, error } = useQuery<MeQueryData>(GET_ME, {
    skip: !accessToken || isAuthenticated,
    fetchPolicy: 'network-only',
  });

  // Mark as mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Don't run until mounted
    if (!mounted) return;

    // If no token, mark as done loading (user is not logged in)
    if (!accessToken) {
      dispatch(setLoading(false));
      return;
    }

    // If already authenticated in Redux, mark as done loading
    if (isAuthenticated) {
      dispatch(setLoading(false));
      return;
    }

    // If query returned user data, hydrate Redux
    if (data?.me) {
      dispatch(setCredentials({
        user: data.me,
        accessToken: accessToken,
        refreshToken: refreshToken || '',
      }));
      return;
    }

    // If query errored (token invalid), clear cookies
    if (error) {
      AuthService.clearTokens();
      dispatch(logout());
      return;
    }

    // If query is done loading but no data, mark as done
    if (!queryLoading && !data?.me && accessToken) {
      dispatch(setLoading(false));
    }
  }, [mounted, accessToken, refreshToken, isAuthenticated, data, queryLoading, error, dispatch]);

  // Show loading state while initializing auth (only when mounted, have a token, and query is loading)
  if (mounted && authLoading && accessToken && queryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
