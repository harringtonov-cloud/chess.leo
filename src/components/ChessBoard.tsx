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

  if (selectedSquare) {
    customSquareStyles[selectedSquare] = {
      backgroundColor: 'rgba(20,85,30,.5)',
    };
  }

  possibleMoves.forEach((square) => {
    customSquareStyles[square] = {
      background:
        'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
      borderRadius: '50%',
    };
  });

  const history = chess.history({ verbose: true });

  if (history.length > 0) {
    const lastMove = history[history.length - 1];

    customSquareStyles[lastMove.from] = {
      backgroundColor: 'rgba(155,199,0,.41)',
    };

    customSquareStyles[lastMove.to] = {
      backgroundColor: 'rgba(155,199,0,.41)',
    };
  }

  const onSquareClick = (square: Square) => {
    if (!isGameActive) return;
    handleSquareClick(square);
  };

  const onPieceDrop = (
    sourceSquare: Square,
    targetSquare: Square
  ) => {
    if (!isGameActive) return false;

    handleSquareClick(sourceSquare);
    handleSquareClick(targetSquare);

    return true;
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[620px] mx-auto">
        <Chessboard
          position={chess.fen()}
          onSquareClick={onSquareClick}
          onPieceDrop={onPieceDrop}
          customSquareStyles={customSquareStyles}
          boardOrientation="white"
          customBoardStyle={{
            borderRadius: '20px',
            boxShadow: '0 25px 60px rgba(6,182,212,.25)',
          }}
          customDarkSquareStyle={{
            backgroundColor: '#769656',
          }}
          customLightSquareStyle={{
            backgroundColor: '#eeeed2',
          }}
          animationDuration={200}
        />
      </div>
    </div>
  );
}
