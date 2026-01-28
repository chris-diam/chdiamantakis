import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthForm: React.FC = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-950 to-black flex items-center justify-center p-4">
      {/* Decorative space elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full opacity-60" />
        <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full opacity-80" />
        <div className="absolute top-40 right-40 w-3 h-3 bg-cyan-400 rounded-full opacity-40" />
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-white rounded-full opacity-50" />
        <div className="absolute top-1/3 left-20 w-1 h-1 bg-white rounded-full opacity-70" />
        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-purple-400 rounded-full opacity-30" />
      </div>

      <div className="relative bg-gray-900/90 backdrop-blur rounded-2xl shadow-2xl p-8 w-full max-w-md border border-cyan-500/30">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-400 mb-2" style={{ fontFamily: 'system-ui', textShadow: '0 0 20px rgba(0,255,255,0.5)' }}>
            Christos Diamantakis
          </h1>
          <p className="text-gray-400">
            {isLogin ? 'Welcome back, explorer!' : 'Begin your journey!'}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors text-white placeholder-gray-500"
                placeholder="Choose your name"
                required
                minLength={3}
                maxLength={20}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors text-white placeholder-gray-500"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors text-white placeholder-gray-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading...
              </span>
            ) : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        {/* Toggle login/register */}
        <p className="mt-6 text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-cyan-400 hover:text-cyan-300 font-medium"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};
