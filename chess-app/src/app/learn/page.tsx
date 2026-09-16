'use client';

import { Header } from '@/components/Header';
import { BookOpen } from 'lucide-react';

export default function LearnPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-screen-2xl mx-auto w-full p-6">
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-[#759900]" />
          <h1 className="text-4xl font-bold mb-4">Обучение шахматам</h1>
          <p className="text-xl text-gray-400 mb-8">
            Изучайте правила, дебюты и стратегии игры
          </p>
          <div className="bg-[#262421] p-8 rounded-lg max-w-2xl mx-auto">
            <p className="text-gray-300">
              🚧 Раздел находится в разработке
            </p>
            <p className="text-gray-500 mt-2">
              Скоро здесь появятся уроки для начинающих и продвинутых игроков
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
