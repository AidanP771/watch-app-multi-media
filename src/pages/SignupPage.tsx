import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Here you would typically handle user registration
    console.log('Signup attempt:', formData);
    navigate('/profile');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="pt-24 px-6 min-h-screen bg-primary">
      <div className="max-w-md mx-auto">
        <div className="bg-primary-light rounded-lg p-8">
          <h1 className="text-3xl font-serif text-white mb-6 text-center">Create Account</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-white mb-2">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded bg-primary text-white border border-gray-dark focus:border-secondary outline-none"
                  placeholder="Enter your full name"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
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
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-white mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded bg-primary text-white border border-gray-dark focus:border-secondary outline-none"
                  placeholder="Create a password"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-white mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded bg-primary text-white border border-gray-dark focus:border-secondary outline-none"
                  placeholder="Confirm your password"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary-light text-primary px-6 py-3 rounded font-semibold transition"
            >
              Create Account
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