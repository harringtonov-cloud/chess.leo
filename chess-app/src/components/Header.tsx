'use client';

import { Crown, Swords, BookOpen, Lightbulb, Moon, Sun, LogIn, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginModal } from './Auth/LoginModal';
import { RegisterModal } from './Auth/RegisterModal';

export function Header() {
  const [isDark, setIsDark] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  const { user, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <header className="bg-[#262421] border-b border-[#3d3a36] px-6 py-3">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Crown className="w-8 h-8 text-[#759900]" />
              <span className="text-2xl font-bold">LichessClone</span>
            </div>
            
            <nav className="flex items-center gap-6">
              <button className="flex items-center gap-2 hover:text-[#759900] transition-colors">
                <Swords className="w-5 h-5" />
                <span>Играть</span>
              </button>
              <button className="flex items-center gap-2 hover:text-[#759900] transition-colors">
                <Lightbulb className="w-5 h-5" />
                <span>Задачи</span>
              </button>
              <button className="flex items-center gap-2 hover:text-[#759900] transition-colors">
                <BookOpen className="w-5 h-5" />
                <span>Обучение</span>
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 hover:bg-[#3d3a36] rounded transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {user && userProfile ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-semibold">{userProfile.displayName}</div>
                  <div className="text-xs text-gray-400">{userProfile.rating}</div>
                </div>
                <div className="w-8 h-8 bg-[#759900] rounded-full flex items-center justify-center font-bold">
                  {userProfile.displayName[0].toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-[#3d3a36] rounded transition-colors"
                  title="Выйти"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#3d3a36] hover:bg-[#4d4a46] rounded transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Войти
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#759900] hover:bg-[#618000] rounded transition-colors"
                >
                  <User className="w-4 h-4" />
                  Регистрация
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
}