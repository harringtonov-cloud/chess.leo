'use client';

import Link from 'next/link';
import { Crown, Swords, BookOpen, Lightbulb, Moon, Sun, User } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isDark, setIsDark] = useState(true);

  return (
    <header className="bg-[#262421] border-b border-[#3d3a36] px-6 py-3">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Crown className="w-8 h-8 text-[#759900]" />
            <span className="text-2xl font-bold">Chess App</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 hover:text-[#759900] transition-colors">
              <Swords className="w-5 h-5" />
              <span>Играть</span>
            </Link>
            <Link href="/puzzles" className="flex items-center gap-2 hover:text-[#759900] transition-colors">
              <Lightbulb className="w-5 h-5" />
              <span>Задачи</span>
            </Link>
            <Link href="/learn" className="flex items-center gap-2 hover:text-[#759900] transition-colors">
              <BookOpen className="w-5 h-5" />
              <span>Обучение</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 hover:bg-[#3d3a36] rounded transition-colors"
            title={isDark ? 'Светлая тема' : 'Тёмная тема'}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#759900] rounded-full flex items-center justify-center font-bold">
              Г
            </div>
            <span className="text-sm">Гость</span>
          </div>
        </div>
      </div>
    </header>
  );
}
