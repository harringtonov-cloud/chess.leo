'use client';

import { Flag, Handshake, RotateCcw, Play, Settings } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { TIME_CONTROLS, AI_LEVELS } from '@/lib/constants';
import { useState } from 'react';

export function Controls() {
  const {
    isGameActive,
    gameMode,
    startNewGame,
    resignGame,
    offerDraw,
    resetGame,
    setGameMode,
    setTimeControl,
    setAiLevel,
    isWhiteTurn,
  } = useGameStore();

  const [showSettings, setShowSettings] = useState(false);

  const handleResign = () => {
    if (window.confirm('Вы уверены, что хотите сдаться?')) {
      resignGame(isWhiteTurn ? 'black' : 'white');
    }
  };

  const handleDraw = () => {
    if (window.confirm('Предложить ничью?')) {
      offerDraw();
    }
  };

  return (
    <div className="bg-[#262421] rounded p-4 space-y-4">
      <h3 className="font-bold text-gray-300 flex items-center gap-2">
        <Settings className="w-5 h-5" />
        Управление
      </h3>

      {!isGameActive ? (
        <div className="space-y-3">
          {/* Выбор режима игры */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Режим игры</label>
            <div className="flex gap-2">
              <button
                onClick={() => setGameMode('human')}
                className={`flex-1 px-3 py-2 rounded text-sm ${
                  gameMode === 'human'
                    ? 'bg-[#759900] text-white'
                    : 'bg-[#3d3a36] hover:bg-[#4d4a46]'
                }`}
              >
                Человек vs Человек
              </button>
              <button
                onClick={() => setGameMode('ai')}
                className={`flex-1 px-3 py-2 rounded text-sm ${
                  gameMode === 'ai'
                    ? 'bg-[#759900] text-white'
                    : 'bg-[#3d3a36] hover:bg-[#4d4a46]'
                }`}
              >
                Играть с ИИ
              </button>
            </div>
          </div>

          {/* Выбор уровня ИИ */}
          {gameMode === 'ai' && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">Уровень ИИ</label>
              <select
                onChange={(e) => setAiLevel(parseInt(e.target.value))}
                className="w-full bg-[#3d3a36] border border-[#4d4a46] rounded px-3 py-2 text-sm"
              >
                {Object.entries(AI_LEVELS).map(([key, level]) => (
                  <option key={key} value={level.depth}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Выбор контроля времени */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Контроль времени</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(TIME_CONTROLS).map(([key, control]) => (
                <button
                  key={key}
                  onClick={() => setTimeControl(control)}
                  className="px-3 py-2 bg-[#3d3a36] hover:bg-[#4d4a46] rounded text-sm"
                >
                  {control.name}
                </button>
              ))}
            </div>
          </div>

          {/* Начать игру */}
          <button
            onClick={startNewGame}
            className="w-full flex items-center justify-center gap-2 bg-[#759900] hover:bg-[#618000] text-white px-4 py-3 rounded font-semibold transition-colors"
          >
            <Play className="w-5 h-5" />
            Начать игру
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <button
            onClick={handleResign}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          >
            <Flag className="w-4 h-4" />
            Сдаться
          </button>

          <button
            onClick={handleDraw}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            <Handshake className="w-4 h-4" />
            Предложить ничью
          </button>

          <button
            onClick={resetGame}
            className="w-full flex items-center justify-center gap-2 bg-[#3d3a36] hover:bg-[#4d4a46] text-white px-4 py-2 rounded transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Новая игра
          </button>
        </div>
      )}
    </div>
  );
}