import { useEffect, useRef, useState, useCallback } from 'react';
import { Chess } from 'chess.js';

interface StockfishEvaluation {
  score: number; // В сантипешках (центипавнах)
  mate?: number; // Мат в N ходов
  bestMove?: string;
  pv?: string[]; // Principal variation (лучшая линия)
  depth: number;
}

export function useStockfish() {
  const workerRef = useRef<Worker | null>(null);
  const [evaluation, setEvaluation] = useState<StockfishEvaluation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const callbackRef = useRef<((move: string) => void) | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Создаем Stockfish worker
    workerRef.current = new Worker('/stockfish.js');

    workerRef.current.onmessage = (event) => {
      const line = event.data;
      
      if (typeof line !== 'string') return;

      // Парсим вывод Stockfish
      if (line.startsWith('info')) {
        parseInfoLine(line);
      } else if (line.startsWith('bestmove')) {
        const move = line.split(' ')[1];
        if (callbackRef.current) {
          callbackRef.current(move);
          callbackRef.current = null;
        }
      }
    };

    // Инициализация Stockfish
    workerRef.current.postMessage('uci');
    workerRef.current.postMessage('isready');

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const parseInfoLine = (line: string) => {
    const depthMatch = line.match(/depth (\d+)/);
    const scoreMatch = line.match(/score (cp|mate) (-?\d+)/);
    const pvMatch = line.match(/pv (.+)/);

    if (scoreMatch && depthMatch) {
      const depth = parseInt(depthMatch[1]);
      const scoreType = scoreMatch[1];
      const scoreValue = parseInt(scoreMatch[2]);

      const evaluation: StockfishEvaluation = {
        score: scoreType === 'cp' ? scoreValue : 0,
        depth,
      };

      if (scoreType === 'mate') {
        evaluation.mate = scoreValue;
      }

      if (pvMatch) {
        evaluation.pv = pvMatch[1].split(' ');
        evaluation.bestMove = evaluation.pv[0];
      }

      setEvaluation(evaluation);
    }
  };

  const analyzePosition = useCallback((fen: string, depth: number = 15) => {
    if (!workerRef.current) return;

    setIsAnalyzing(true);
    workerRef.current.postMessage(`position fen ${fen}`);
    workerRef.current.postMessage(`go depth ${depth}`);
  }, []);

  const getBestMove = useCallback((fen: string, depth: number = 10): Promise<string> => {
    return new Promise((resolve) => {
      if (!workerRef.current) {
        resolve('');
        return;
      }

      callbackRef.current = resolve;
      workerRef.current.postMessage(`position fen ${fen}`);
      workerRef.current.postMessage(`go depth ${depth}`);
    });
  }, []);

  const stopAnalysis = useCallback(() => {
    if (!workerRef.current) return;
    workerRef.current.postMessage('stop');
    setIsAnalyzing(false);
  }, []);

  return {
    evaluation,
    isAnalyzing,
    analyzePosition,
    getBestMove,
    stopAnalysis,
  };
}