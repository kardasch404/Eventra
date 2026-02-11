'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { LOGIN } from '@/infrastructure/graphql/mutations';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/shared/store/hooks';
import { setCredentials } from '@/shared/store/slices/auth.slice';
import { AuthService } from '@/infrastructure/services/auth-cookie.service';

interface LoginResponse {
  login: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      roles: string[];
    };
  };
}

interface LoginVariables {
  input: {
    email: string;
    password: string;
  };
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [login, { loading, error }] = useMutation<LoginResponse, LoginVariables>(LOGIN);
  
  const isRegistered = searchParams.get('registered') === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await login({ 
        variables: { 
          input: { email, password } 
        } 
      });
      if (data?.login) {
        // Store tokens in cookies for middleware/server access
        AuthService.setTokens(data.login.accessToken, data.login.refreshToken);
        
        // Update Redux state
        dispatch(setCredentials(data.login));
        
        // Role-based redirect
        const roles = data.login.user?.roles || [];
        if (roles.includes('admin')) {
          router.push('/admin');
        } else {
          // All users go to profile
          router.push('/profile');
        }
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <a href="/" className="inline-block mb-6">
              <svg className="w-32 h-8" viewBox="0 0 200 40" fill="#F05537">
                <text x="0" y="30" fontSize="32" fontWeight="bold" fill="#F05537">Eventra</text>
              </svg>
            </a>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Log in</h1>
            <div className="text-sm">
              <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">Sign up</a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegistered && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                Account created successfully! Please login with your credentials.
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                Invalid email or password
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-semibold">or</span>
              </div>
            </div>

            <button className="mt-6 w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors">
              Email me a login link
            </button>
          </div>

          <div className="mt-6 space-y-3">
            <button className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src="/img/login.png" alt="Login" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute bottom-8 right-8 text-white text-right">
          <div className="text-sm font-medium">Event Management</div>
          <div className="text-xs opacity-90">Eventra Platform</div>
          <div className="text-xs opacity-75">Powered by Innovation</div>
        </div>
      </div>
    </div>
  );
}
