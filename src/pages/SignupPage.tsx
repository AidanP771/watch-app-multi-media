import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push('Password must be at least 8 characters long');
    if (!/[A-Z]/.test(password)) errors.push('Include at least one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Include at least one lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('Include at least one number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Include at least one special character');
    return errors;
  };

  const startRateLimitCountdown = (seconds: number) => {
    setRateLimitCountdown(seconds);
    const interval = setInterval(() => {
      setRateLimitCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || rateLimitCountdown !== null) return;
    
    setError('');
    setIsLoading(true);

    try {
      // Validate form data
      if (!formData.email.trim()) {
        throw new Error('Please enter your email');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        throw new Error(passwordErrors.join('. '));
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Attempt signup
      const name = [formData.firstName, formData.lastName].filter(Boolean).join(' ');
      await signUp(formData.email, formData.password, name);
      
      // If successful, show success message
      setSuccess(true);
      setError('');

    } catch (err: any) {
      console.error('Signup error:', err);
      
      // Handle rate limit error
      if (err.message?.includes('rate limit') || err?.status === 429) {
        const waitSeconds = parseInt(err.message?.match(/\d+/)?.[0] || '45');
        startRateLimitCountdown(waitSeconds);
        setError(`Please wait ${waitSeconds} seconds before trying again`);
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  if (success) {
    return (
      <div className="pt-24 px-6 min-h-screen bg-primary">
        <div className="max-w-md mx-auto">
          <div className="bg-primary-light rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-secondary" />
            </div>
            <h2 className="text-2xl font-serif text-white mb-4">Check your email</h2>
            <p className="text-gray-light mb-6">
              We've sent you an email with a link to verify your account.
              Please check your inbox and follow the instructions.
            </p>
            <Link
              to="/login"
              className="inline-block bg-secondary hover:bg-secondary-light text-primary px-6 py-3 rounded font-semibold transition"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 min-h-screen bg-primary">
      <div className="max-w-md mx-auto">
        <div className="bg-primary-light rounded-lg p-8">
          <h1 className="text-3xl font-serif text-white mb-6 text-center">Create Account</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-start gap-2 text-red-500">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-white mb-2">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-primary text-white border border-gray-dark focus:border-secondary outline-none"
                  placeholder="First name"
                  disabled={isLoading || rateLimitCountdown !== null}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-white mb-2">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-primary text-white border border-gray-dark focus:border-secondary outline-none"
                  placeholder="Last name"
                  disabled={isLoading || rateLimitCountdown !== null}
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-4 py-2 rounded bg-primary text-white border border-gray-dark focus:border-secondary outline-none"
                  placeholder="Enter your email"
                  disabled={isLoading || rateLimitCountdown !== null}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
              </div>
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
                  className="w-full pl-10 pr-12 py-2 rounded bg-primary text-white border border-gray-dark focus:border-secondary outline-none"
                  placeholder="Create a password"
                  disabled={isLoading || rateLimitCountdown !== null}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-light hover:text-white transition"
                  disabled={isLoading || rateLimitCountdown !== null}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-light">
                Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-white mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-2 rounded bg-primary text-white border border-gray-dark focus:border-secondary outline-none"
                  placeholder="Confirm your password"
                  disabled={isLoading || rateLimitCountdown !== null}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-light hover:text-white transition"
                  disabled={isLoading || rateLimitCountdown !== null}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || rateLimitCountdown !== null}
              className="w-full bg-secondary hover:bg-secondary-light text-primary px-6 py-3 rounded font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : rateLimitCountdown ? (
                `Try again in ${rateLimitCountdown}s`
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-light">
              Already have an account?{' '}
              <Link to="/login" className="text-secondary hover:text-secondary-light transition">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;