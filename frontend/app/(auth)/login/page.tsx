'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '@/infrastructure/graphql/mutations';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/shared/store/hooks';
import { setCredentials } from '@/shared/store/slices/auth.slice';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [login, { loading, error }] = useMutation(LOGIN);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });
      if (data?.login) {
        dispatch(setCredentials(data.login));
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Eventra</h1>
          <p className="text-gray-400">Event Management Platform</p>
        </div>

        <div className="bg-[#2a2a2a] rounded-lg p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-white mb-6">Sign in</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                Invalid email or password
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Continue'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <a href="/register" className="text-orange-500 hover:text-orange-400 font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-gray-400 hover:text-gray-300 underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-gray-400 hover:text-gray-300 underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
