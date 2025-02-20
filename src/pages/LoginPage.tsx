import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const from = location.state?.from?.pathname || '/profile';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      await signIn(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  return (
    <div className="pt-24 px-6 min-h-screen bg-primary">
      <div className="max-w-md mx-auto">
        <div className="bg-primary-light rounded-lg p-8">
          <h1 className="text-3xl font-serif text-white mb-6 text-center">Welcome Back</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-white mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-4 py-2 rounded bg-primary text-white border ${
                    touched.email && !validateEmail(formData.email)
                      ? 'border-red-500'
                      : 'border-gray-dark'
                  } focus:border-secondary outline-none`}
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
              </div>
              {touched.email && !validateEmail(formData.email) && (
                <p className="mt-1 text-sm text-red-500">Please enter a valid email address</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-white mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-12 py-2 rounded bg-primary text-white border ${
                    touched.password && formData.password.length < 6
                      ? 'border-red-500'
                      : 'border-gray-dark'
                  } focus:border-secondary outline-none`}
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-light hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {touched.password && formData.password.length < 6 && (
                <p className="mt-1 text-sm text-red-500">Password must be at least 6 characters long</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-gray-light">Remember me</span>
              </label>
              <Link to="/reset-password" className="text-secondary hover:text-secondary-light transition">
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-secondary hover:bg-secondary-light text-primary px-6 py-3 rounded font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-light">
              Don't have an account?{' '}
              <Link to="/signup" className="text-secondary hover:text-secondary-light transition">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;