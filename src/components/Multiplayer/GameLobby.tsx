'use client';

import { useState, useEffect } from 'react';
import { Plus, Users, Clock, Trophy } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  createChallenge,
  subscribeToOpenChallenges,
  acceptChallenge,
  cancelChallenge,
  createGame,
  Challenge,
} from '@/lib/firestore';
import { TIME_CONTROLS } from '@/lib/constants';
import { Chess } from 'chess.js';
import { Timestamp } from 'firebase/firestore';

interface GameLobbyProps {
  onGameStart: (gameId: string) => void;
}

export function GameLobby({ onGameStart }: GameLobbyProps) {
  const { user, userProfile } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [myChallenge, setMyChallenge] = useState<Challenge | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTimeControl, setSelectedTimeControl] = useState(TIME_CONTROLS.BLITZ_3);

  useEffect(() => {
    const unsubscribe = subscribeToOpenChallenges((newChallenges) => {
      setChallenges(newChallenges);
      
      // Проверяем наш вызов
      if (user) {
        const mine = newChallenges.find((c) => c.creatorId === user.uid);
        setMyChallenge(mine || null);
      }
    });

    return unsubscribe;
  }, [user]);

  const handleCreateChallenge = async () => {
    if (!user || !userProfile) return;

    const challengeId = await createChallenge({
      creatorId: user.uid,
      creatorName: userProfile.displayName,
      creatorRating: userProfile.rating,
      timeControl: selectedTimeControl,
      rated: true,
      status: 'open',
    });

    setShowCreateForm(false);
  };

  const handleCancelChallenge = async () => {
    if (!myChallenge) return;
    await cancelChallenge(myChallenge.id);
    setMyChallenge(null);
  };

  const handleAcceptChallenge = async (challenge: Challenge) => {
    if (!user || !userProfile) return;

    await acceptChallenge(challenge.id);

    // Создаем игру
    const chess = new Chess();
    const gameId = await createGame({
      whitePlayerId: challenge.creatorId,
      blackPlayerId: user.uid,
      whitePlayerName: challenge.creatorName,
      blackPlayerName: userProfile.displayName,
      whiteRating: challenge.creatorRating,
      blackRating: userProfile.rating,
      fen: chess.fen(),
      pgn: '',
      moves: [],
      timeControl: challenge.timeControl,
      whiteTime: challenge.timeControl.time,
      blackTime: challenge.timeControl.time,
      currentTurn: 'white',
      status: 'active',
    });

    onGameStart(gameId);
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Войдите, чтобы играть онлайн</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6" />
          Лобби игроков
        </h2>
        
        {!myChallenge && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 bg-[#759900] hover:bg-[#618000] px-4 py-2 rounded"
          >
            <Plus className="w-4 h-4" />
            Создать вызов
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="bg-[#3d3a36] p-4 rounded space-y-3">
          <h3 className="font-semibold">Новый вызов</h3>
          
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(TIME_CONTROLS).map(([key, control]) => (
              <button
                key={key}
                onClick={() => setSelectedTimeControl(control)}
                className={`px-3 py-2 rounded text-sm ${
                  selectedTimeControl.name === control.name
                    ? 'bg-[#759900]'
                    : 'bg-[#262421] hover:bg-[#2d2b28]'
                }`}
              >
                {control.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCreateChallenge}
              className="flex-1 bg-[#759900] hover:bg-[#618000] py-2 rounded"
            >
              Создать
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="flex-1 bg-[#262421] hover:bg-[#2d2b28] py-2 rounded"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {myChallenge && (
        <div className="bg-[#3d3a36] p-4 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Ваш вызов</p>
              <p className="font-semibold">{myChallenge.timeControl.name}</p>
            </div>
            <button
              onClick={handleCancelChallenge}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
            >
              Отменить
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-sm text-gray-400 font-semibold">Доступные игры</h3>
        
        {challenges.filter((c) => c.creatorId !== user.uid).length === 0 ? (
          <p className="text-gray-500 text-sm py-4">Нет доступных вызовов</p>
        ) : (
          challenges
            .filter((c) => c.creatorId !== user.uid)
            .map((challenge) => (
              <div
                key={challenge.id}
                className="bg-[#262421] p-3 rounded flex items-center justify-between hover:bg-[#2d2b28] transition-colors"
              >
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    {challenge.creatorName}
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {challenge.creatorRating}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {challenge.timeControl.name}
                  </p>
                </div>
                
                <button
                  onClick={() => handleAcceptChallenge(challenge)}
                  className="bg-[#759900] hover:bg-[#618000] px-4 py-2 rounded text-sm"
                >
                  Принять
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  );
}