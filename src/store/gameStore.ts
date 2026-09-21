import { create } from 'zustand';
import { Chess, Square } from 'chess.js';

export type GameMode = 'human' | 'ai';
export type TimeControl = {
  time: number;
  increment: number;
  name: string;
};

interface GameState {
  chess: Chess;
  gameMode: GameMode;
  aiLevel: number;
  timeControl: TimeControl | null;
  whiteTime: number;
  blackTime: number;
  isWhiteTurn: boolean;
  isGameActive: boolean;
  selectedSquare: Square | null;
  possibleMoves: Square[];
  moveHistory: string[];
  capturedPieces: { white: string[]; black: string[] };
  gameResult: string | null;
  
  setGameMode: (mode: GameMode) => void;
  setAiLevel: (level: number) => void;
  setTimeControl: (control: TimeControl) => void;
  startNewGame: () => void;
  makeMove: (from: Square, to: Square, promotion?: string) => boolean;
  selectSquare: (square: Square | null) => void;
  updateTime: (isWhite: boolean, time: number) => void;
  resignGame: (winner: 'white' | 'black') => void;
  offerDraw: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  chess: new Chess(),
  gameMode: 'human',
  aiLevel: 10,
  timeControl: null,
  whiteTime: 180,
  blackTime: 180,
  isWhiteTurn: true,
  isGameActive: false,
  selectedSquare: null,
  possibleMoves: [],
  moveHistory: [],
  capturedPieces: { white: [], black: [] },
  gameResult: null,

  setGameMode: (mode) => set({ gameMode: mode }),
  
  setAiLevel: (level) => set({ aiLevel: level }),
  
  setTimeControl: (control) => set({ 
    timeControl: control,
    whiteTime: control.time,
    blackTime: control.time,
  }),

  startNewGame: () => {
    const chess = new Chess();
    set({
      chess,
      isGameActive: true,
      isWhiteTurn: true,
      selectedSquare: null,
      possibleMoves: [],
      moveHistory: [],
      capturedPieces: { white: [], black: [] },
      gameResult: null,
    });
  },

  makeMove: (from, to, promotion = 'q') => {
    const { chess, timeControl, isWhiteTurn } = get();
    
    try {
      const move = chess.move({ from, to, promotion });

      if (move) {
        const captured = { ...get().capturedPieces };
        if (move.captured) {
          if (move.color === 'w') {
            captured.white.push(move.captured);
          } else {
            captured.black.push(move.captured);
          }
        }

        let newWhiteTime = get().whiteTime;
        let newBlackTime = get().blackTime;
        
        if (timeControl) {
          if (isWhiteTurn) {
            newWhiteTime += timeControl.increment;
          } else {
            newBlackTime += timeControl.increment;
          }
        }

        let gameResult = null;
        if (chess.isCheckmate()) {
          gameResult = isWhiteTurn ? 'Белые выиграли' : 'Черные выиграли';
        } else if (chess.isDraw()) {
          gameResult = 'Ничья';
        } else if (chess.isStalemate()) {
          gameResult = 'Пат';
        } else if (chess.isThreefoldRepetition()) {
          gameResult = 'Ничья (троекратное повторение)';
        } else if (chess.isInsufficientMaterial()) {
          gameResult = 'Ничья (недостаточно материала)';
        }

        set({
          chess: new Chess(chess.fen()),
          isWhiteTurn: !isWhiteTurn,
          selectedSquare: null,
          possibleMoves: [],
          moveHistory: chess.history(),
          capturedPieces: captured,
          whiteTime: newWhiteTime,
          blackTime: newBlackTime,
          gameResult,
          isGameActive: !gameResult,
        });

        return true;
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }

    return false;
  },

  selectSquare: (square) => {
    if (!square) {
      set({ selectedSquare: null, possibleMoves: [] });
      return;
    }

    const { chess } = get();
    const piece = chess.get(square);
    
    if (piece && piece.color === (chess.turn() === 'w' ? 'w' : 'b')) {
      const moves = chess.moves({ square, verbose: true });
      const possibleSquares = moves.map(m => m.to as Square);
      
      set({ selectedSquare: square, possibleMoves: possibleSquares });
    } else {
      set({ selectedSquare: null, possibleMoves: [] });
    }
  },

  updateTime: (isWhite, time) => {
    if (isWhite) {
      set({ whiteTime: time });
      if (time <= 0) {
        set({ gameResult: 'Черные выиграли (время)', isGameActive: false });
      }
    } else {
      set({ blackTime: time });
      if (time <= 0) {
        set({ gameResult: 'Белые выиграли (время)', isGameActive: false });
      }
    }
  },

  resignGame: (winner) => {
    set({
      gameResult: winner === 'white' ? 'Белые выиграли' : 'Черные выиграли',
      isGameActive: false,
    });
  },

  offerDraw: () => {
    set({
      gameResult: 'Ничья по соглашению',
      isGameActive: false,
    });
  },

  resetGame: () => {
    const { timeControl } = get();
    set({
      chess: new Chess(),
      isGameActive: false,
      isWhiteTurn: true,
      selectedSquare: null,
      possibleMoves: [],
      moveHistory: [],
      capturedPieces: { white: [], black: [] },
      gameResult: null,
      whiteTime: timeControl?.time || 180,
      blackTime: timeControl?.time || 180,
    });
  },
}));
