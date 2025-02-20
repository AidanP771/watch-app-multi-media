import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface TwoFactorAuthProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ onSuccess, onCancel }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { verify2FA } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await verify2FA(code);
      onSuccess();
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    }
  };

  return (
    <div className="bg-primary-light rounded-lg p-8">
      <h2 className="text-2xl font-serif text-white mb-6">Two-Factor Authentication</h2>
      <p className="text-gray-light mb-6">
        Please enter the verification code from your authenticator app.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter verification code"
            className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
            required
          />
        </div>

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-secondary hover:bg-secondary-light text-primary px-6 py-3 rounded font-semibold transition"
          >
            Verify
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-gray-dark hover:border-secondary text-white px-6 py-3 rounded font-semibold transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TwoFactorAuth;