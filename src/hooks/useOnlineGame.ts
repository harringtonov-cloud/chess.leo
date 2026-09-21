import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  createGame,
  updateGame,
  subscribeToGame,
  finishGame,
  GameData,
  updateRatingsAfterGame,
} from '@/lib/firestore';
import { Chess } from 'chess.js';

export function useOnlineGame(gameId: string | null) {
  const { user, userProfile } = useAuth();
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [chess] = useState(new Chess());

  useEffect(() => {
    if (!gameId) return;

    const unsubscribe = subscribeToGame(gameId, (game) => {
      setGameData(game);
      if (game) {
        chess.load(game.fen);
      }
    });

    return unsubscribe;
  }, [gameId, chess]);

  const makeMove = useCallback(
    async (from: string, to: string, promotion?: string) => {
      if (!gameData || !gameId || !user) return false;

      // Проверяем, наш ли ход
      const isWhite = user.uid === gameData.whitePlayerId;
      const isOurTurn =
        (isWhite && gameData.currentTurn === 'white') ||
        (!isWhite && gameData.currentTurn === 'black');

      if (!isOurTurn) return false;

      try {
        const move = chess.move({ from, to, promotion: promotion || 'q' });
        if (!move) return false;

        const newFen = chess.fen();
        const newMoves = [...gameData.moves, move.san];
        const pgn = chess.pgn();

        // Проверяем окончание игры
        let status: GameData['status'] = 'active';
        let result: GameData['result'] | undefined;
        let resultReason: string | undefined;

        if (chess.isCheckmate()) {
          status = 'finished';
          result = gameData.currentTurn === 'white' ? 'black' : 'white';
          resultReason = 'Мат';

          await finishGame(gameId, result, resultReason);
          await updateRatingsAfterGame(
            gameData.whitePlayerId,
            gameData.blackPlayerId,
            result
          );
        } else if (chess.isDraw()) {
          status = 'finished';
          result = 'draw';
          resultReason = 'Ничья';

          await finishGame(gameId, result, resultReason);
          await updateRatingsAfterGame(
            gameData.whitePlayerId,
            gameData.blackPlayerId,
            result
          );
        } else if (chess.isStalemate()) {
          status = 'finished';
          result = 'draw';
          resultReason = 'Пат';

          await finishGame(gameId, result, resultReason);
          await updateRatingsAfterGame(
            gameData.whitePlayerId,
            gameData.blackPlayerId,
            result
          );
        }

        await updateGame(gameId, {
          fen: newFen,
          pgn,
          moves: newMoves,
          currentTurn: gameData.currentTurn === 'white' ? 'black' : 'white',
          status,
          result,
          resultReason,
        });

        return true;
      } catch (error) {
        console.error('Error making move:', error);
        return false;
      }
    },
    [gameData, gameId, user, chess]
  );

  const resign = useCallback(async () => {
    if (!gameData || !gameId || !user) return;

    const isWhite = user.uid === gameData.whitePlayerId;
    const result = isWhite ? 'black' : 'white';

    await finishGame(gameId, result, 'Сдача');
    await updateRatingsAfterGame(
      gameData.whitePlayerId,
      gameData.blackPlayerId,
      result
    );
  }, [gameData, gameId, user]);

  const offerDraw = useCallback(async () => {
    if (!gameData || !gameId) return;

    // В реальности нужна логика подтверждения от оппонента
    await finishGame(gameId, 'draw', 'Ничья по соглашению');
    await updateRatingsAfterGame(
      gameData.whitePlayerId,
      gameData.blackPlayerId,
      'draw'
    );
  }, [gameData, gameId]);

  return {
    gameData,
    chess,
    makeMove,
    resign,
    offerDraw,
    isWhitePlayer: user ? user.uid === gameData?.whitePlayerId : false,
    isBlackPlayer: user ? user.uid === gameData?.blackPlayerId : false,
  };
}