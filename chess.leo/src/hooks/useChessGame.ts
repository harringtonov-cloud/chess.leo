import { useEffect, useCallback } from 'react';
import { Square } from 'chess.js';
import { useGameStore } from '@/store/gameStore';
import { useStockfish } from './useStockfish';
import { useSound } from './useSound';

export function useChessGame() {
  const store = useGameStore();
  const { getBestMove } = useStockfish();
  const { playMove } = useSound();

  // AI ход
  const makeAiMove = useCallback(async () => {
    if (store.gameMode !== 'ai' || store.isWhiteTurn || !store.isGameActive) return;

    const fen = store.chess.fen();
    const bestMove = await getBestMove(fen, store.aiLevel);
    
    if (bestMove && bestMove.length >= 4) {
      const from = bestMove.substring(0, 2) as Square;
      const to = bestMove.substring(2, 4) as Square;
      const promotion = bestMove.length > 4 ? bestMove[4] : undefined;
      
      setTimeout(() => {
        const move = store.chess.get(from);
        const targetSquare = store.chess.get(to);
        const isCapture = !!targetSquare;
        const isCastle = move?.type === 'k' && Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) > 1;
        
        store.makeMove(from, to, promotion);
        
        const isCheck = store.chess.isCheck();
        const isCheckmate = store.chess.isCheckmate();
        
        playMove(isCapture, isCheck, isCheckmate, isCastle);
      }, 500);
    }
  }, [store, getBestMove, playMove]);

  // Обработка ходов
  const handleSquareClick = useCallback((square: Square) => {
    if (!store.isGameActive) return;
    
    const { selectedSquare, possibleMoves, chess } = store;

    if (selectedSquare && possibleMoves.includes(square)) {
      const move = chess.get(selectedSquare);
      const targetSquare = chess.get(square);
      const isCapture = !!targetSquare;
      const isCastle = move?.type === 'k' && Math.abs(selectedSquare.charCodeAt(0) - square.charCodeAt(0)) > 1;
      
      // Проверка на превращение пешки
      const piece = chess.get(selectedSquare);
      let promotion: string | undefined = undefined;
      
      if (piece?.type === 'p') {
        const toRank = square[1];
        if ((piece.color === 'w' && toRank === '8') || (piece.color === 'b' && toRank === '1')) {
          promotion = 'q'; // Автоматически превращаем в ферзя
        }
      }
      
      const success = store.makeMove(selectedSquare, square, promotion);
      
      if (success) {
        const isCheck = chess.isCheck();
        const isCheckmate = chess.isCheckmate();
        playMove(isCapture, isCheck, isCheckmate, isCastle);
      }
    } else {
      store.selectSquare(square);
    }
  }, [store, playMove]);

  // Автоматический ход AI после хода игрока
  useEffect(() => {
    if (store.gameMode === 'ai' && !store.isWhiteTurn && store.isGameActive) {
      makeAiMove();
    }
  }, [store.isWhiteTurn, store.gameMode, store.isGameActive, makeAiMove]);

  return {
    ...store,
    handleSquareClick,
  };
}