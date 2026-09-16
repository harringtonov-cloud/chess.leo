'use client';

import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { User, Trophy, Target, TrendingUp } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function ProfilePage() {
  const { user, userProfile, logout } = useAuth();

  if (!user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-screen-2xl mx-auto w-full p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Профиль</h1>
          
          {/* Информация о пользователе */}
          <div className="bg-[#262421] p-6 rounded-lg mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-[#759900] rounded-full flex items-center justify-center text-3xl font-bold">
                {userProfile?.displayName?.[0]?.toUpperCase() || 'У'}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{userProfile?.displayName || 'Пользователь'}</h2>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#3d3a36] p-4 rounded text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-[#759900]" />
                <div className="text-2xl font-bold">{userProfile?.rating || 1500}</div>
                <div className="text-sm text-gray-400">Рейтинг</div>
              </div>
              
              <div className="bg-[#3d3a36] p-4 rounded text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold">{userProfile?.gamesPlayed || 0}</div>
                <div className="text-sm text-gray-400">Игр сыграно</div>
              </div>
              
              <div className="bg-[#3d3a36] p-4 rounded text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold">{userProfile?.wins || 0}</div>
                <div className="text-sm text-gray-400">Побед</div>
              </div>
              
              <div className="bg-[#3d3a36] p-4 rounded text-center">
                <User className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                <div className="text-2xl font-bold">{userProfile?.draws || 0}</div>
                <div className="text-sm text-gray-400">Ничьих</div>
              </div>
            </div>
          </div>

          {/* Настройки */}
          <div className="bg-[#262421] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Настройки</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Отображаемое имя</label>
                <input
                  type="text"
                  value={userProfile?.displayName || ''}
                  readOnly
                  className="w-full bg-[#3d3a36] border border-[#4d4a46] rounded px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={user.email || ''}
                  readOnly
                  className="w-full bg-[#3d3a36] border border-[#4d4a46] rounded px-4 py-2"
                />
              </div>

              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
              >
                Выйти из аккаунта
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
