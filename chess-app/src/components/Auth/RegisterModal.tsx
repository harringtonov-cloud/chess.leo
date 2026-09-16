'use client';

import { useState } from 'react';
import { X, Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Пароль должен быть минимум 6 символов');
      setLoading(false);
      return;
    }

    const result = await register(email, password, displayName);

    if (result.success) {
      onClose();
      setEmail('');
      setPassword('');
      setDisplayName('');
    } else {
      setError(result.error || 'Ошибка регистрации');
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#262421] rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Регистрация</h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Имя</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#3d3a36] border border-[#4d4a46] rounded px-10 py-2 focus:outline-none focus:border-[#759900]"
                placeholder="Ваше имя"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#3d3a36] border border-[#4d4a46] rounded px-10 py-2 focus:outline-none focus:border-[#759900]"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#3d3a36] border border-[#4d4a46] rounded px-10 py-2 focus:outline-none focus:border-[#759900]"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Минимум 6 символов</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#759900] hover:bg-[#618000] text-white py-2 rounded font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <UserPlus className="w-5 h-5" />
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-gray-400">Уже есть аккаунт? </span>
          <button
            onClick={onSwitchToLogin}
            className="text-[#759900] hover:underline"
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}