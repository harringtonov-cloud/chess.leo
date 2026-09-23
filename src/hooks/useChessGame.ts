import { useCallback } from 'react';
import { Square } from 'chess.js';
import { useGameStore } from '@/store/gameStore';
import { useSound } from './useSound';

export function useChessGame() {
  const store = useGameStore();
  const { playMove } = useSound();

  const handleSquareClick = useCallback((square: Square) => {
    if (!store.isGameActive) return;
    
    const { selectedSquare, possibleMoves, chess } = store;

    if (selectedSquare && possibleMoves.includes(square)) {
      const move = chess.get(selectedSquare);
      const targetSquare = chess.get(square);
      const isCapture = !!targetSquare;
      const isCastle = move?.type === 'k' && Math.abs(selectedSquare.charCodeAt(0) - square.charCodeAt(0)) > 1;
      
      const piece = chess.get(selectedSquare);
      let promotion: string | undefined = undefined;
      
      if (piece?.type === 'p') {
        const toRank = square[1];
        if ((piece.color === 'w' && toRank === '8') || (piece.color === 'b' && toRank === '1')) {
          promotion = 'q';
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

  return {
    ...store,
    handleSquareClick,
  };
}
