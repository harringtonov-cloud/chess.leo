'use client';

import { useState } from 'react';
import { ChessBoardComponent } from '@/components/ChessBoard';
import { Timer } from '@/components/Timer';
import { MoveHistory } from '@/components/MoveHistory';
import { Controls } from '@/components/Controls';
import { EvaluationBar } from '@/components/EvaluationBar';
import { PlayerPanel } from '@/components/PlayerPanel';
import { Header } from '@/components/Header';
import { GameLobby } from '@/components/Multiplayer/GameLobby';
import { useGameStore } from '@/store/gameStore';
import { useAuth } from '@/hooks/useAuth';
import { PIECE_VALUES } from '@/lib/constants';
import { Users, Monitor } from 'lucide-react';

export default function Home() {
  const {
    whiteTime,
    blackTime,
    isWhiteTurn,
    isGameActive,
    capturedPieces,
    gameResult,
    gameMode,
  } = useGameStore();

  const { user } = useAuth();
  const [showLobby, setShowLobby] = useState(false);
  const [onlineGameId, setOnlineGameId] = useState<string | null>(null);

  const calculateMaterialAdvantage = (pieces: string[]) => {
    return pieces.reduce((sum, piece) => sum + (PIECE_VALUES[piece] || 0), 0);
  };

  const whiteAdvantage = calculateMaterialAdvantage(capturedPieces.white);
  const blackAdvantage = calculateMaterialAdvantage(capturedPieces.black);
  const materialDifference = whiteAdvantage - blackAdvantage;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-screen-2xl mx-auto w-full p-6">
        {/* Переключатель режимов */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setShowLobby(false);
              setOnlineGameId(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
              !showLobby 
                ? 'bg-[#759900] text-white' 
                : 'bg-[#3d3a36] hover:bg-[#4d4a46] text-gray-300'
            }`}
          >
            <Monitor className="w-4 h-4" />
            Играть с компьютером
          </button>
          
          {user && (
            <button
              onClick={() => setShowLobby(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                showLobby 
                  ? 'bg-[#759900] text-white' 
                  : 'bg-[#3d3a36] hover:bg-[#4d4a46] text-gray-300'
              }`}
            >
              <Users className="w-4 h-4" />
              Играть с другом онлайн
            </button>
          )}
          
          {!user && (
            <div className="flex items-center gap-2 px-4 py-2 bg-[#3d3a36] rounded text-gray-500">
              <Users className="w-4 h-4" />
              Войдите для игры онлайн
            </div>
          )}
        </div>

        {showLobby && user ? (
          <GameLobby onGameStart={(gameId) => setOnlineGameId(gameId)} />
        ) : (
          <div className="grid grid-cols-[auto_1fr] gap-6">
            <div className="flex gap-4">
              <div className="flex flex-col justify-center">
                <EvaluationBar />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <PlayerPanel
                    name={gameMode === 'ai' ? 'Компьютер' : 'Игрок 2'}
                    rating={gameMode === 'ai' ? 2000 : 1500}
                    isWhite={false}
                    capturedPieces={capturedPieces.black}
                    materialAdvantage={materialDifference < 0 ? Math.abs(materialDifference) : 0}
                  />
                  <Timer
                    isWhite={false}
                    time={blackTime}
                    isActive={isGameActive && !isWhiteTurn}
                  />
                </div>

                <div className="w-[600px]">
                  <ChessBoardComponent />
                </div>

                <div className="flex items-center gap-4">
                  <PlayerPanel
                    name={user?.displayName || 'Вы'}
                    rating={1500}
                    isWhite={true}
                    capturedPieces={capturedPieces.white}
                    materialAdvantage={materialDifference > 0 ? materialDifference : 0}
                  />
                  <Timer
                    isWhite={true}
                    time={whiteTime}
                    isActive={isGameActive && isWhiteTurn}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Controls />
              <MoveHistory />
              
              {gameResult && (
                <div className="bg-[#759900] text-white p-4 rounded text-center font-bold">
                  {gameResult}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
