'use client';

import { Chessboard } from 'react-chessboard';
import { Square } from 'chess.js';
import { useChessGame } from '@/hooks/useChessGame';

export function ChessBoardComponent() {
  const {
    chess,
    selectedSquare,
    possibleMoves,
    handleSquareClick,
    isGameActive,
  } = useChessGame();

  const customSquareStyles: { [square: string]: React.CSSProperties } = {};

  // Подсветка выбранной клетки
  if (selectedSquare) {
    customSquareStyles[selectedSquare] = {
      backgroundColor: 'rgba(20, 85, 30, 0.5)',
    };
  }

  // Подсветка возможных ходов
  possibleMoves.forEach((square) => {
    customSquareStyles[square] = {
      background: 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
      borderRadius: '50%',
    };
  });

  // Подсветка последнего хода
  const history = chess.history({ verbose: true });
  if (history.length > 0) {
    const lastMove = history[history.length - 1];
    customSquareStyles[lastMove.from] = {
      backgroundColor: 'rgba(155, 199, 0, 0.41)',
    };
    customSquareStyles[lastMove.to] = {
      backgroundColor: 'rgba(155, 199, 0, 0.41)',
    };
  }

  const onSquareClick = (square: Square) => {
    if (!isGameActive) return;
    handleSquareClick(square);
  };

  const onPieceDrop = (sourceSquare: Square, targetSquare: Square) => {
    if (!isGameActive) return false;
    
    handleSquareClick(sourceSquare);
    handleSquareClick(targetSquare);
    
    return true;
  };

  return (
    <div className="chess-board-wrapper">
      <Chessboard
        position={chess.fen()}
        onSquareClick={onSquareClick}
        onPieceDrop={onPieceDrop}
        customSquareStyles={customSquareStyles}
        boardOrientation="white"
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
        }}
        customDarkSquareStyle={{ backgroundColor: '#b58863' }}
        customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
        animationDuration={200}
      />
    </div>
  );
}