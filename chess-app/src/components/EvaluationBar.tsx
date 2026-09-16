'use client';

import { useEffect } from 'react';
import { useStockfish } from '@/hooks/useStockfish';
import { useGameStore } from '@/store/gameStore';

export function EvaluationBar() {
  const chess = useGameStore(state => state.chess);
  const isGameActive = useGameStore(state => state.isGameActive);
  const { evaluation, analyzePosition, stopAnalysis } = useStockfish();

  useEffect(() => {
    if (isGameActive) {
      analyzePosition(chess.fen());
    } else {
      stopAnalysis();
    }
  }, [chess, isGameActive, analyzePosition, stopAnalysis]);

  // Конвертируем оценку в проценты (0-100)
  const getEvaluationPercentage = () => {
    if (!evaluation) return 50;

    if (evaluation.mate !== undefined) {
      return evaluation.mate > 0 ? 100 : 0;
    }

    // Формула: 50 + (score / 10) * 5, ограниченная от 0 до 100
    const percentage = 50 + (evaluation.score / 1000) * 50;
    return Math.max(0, Math.min(100, percentage));
  };

  const getEvaluationText = () => {
    if (!evaluation) return '0.0';

    if (evaluation.mate !== undefined) {
      return `M${Math.abs(evaluation.mate)}`;
    }

    const score = evaluation.score / 100;
    return score > 0 ? `+${score.toFixed(1)}` : score.toFixed(1);
  };

  const whitePercentage = getEvaluationPercentage();

  return (
    <div className="w-8 h-full bg-black rounded overflow-hidden relative">
      {/* Белая часть (снизу вверх) */}
      <div
        className="evaluation-bar absolute bottom-0 left-0 right-0 bg-white"
        style={{ height: `${whitePercentage}%` }}
      />
      
      {/* Текст оценки */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`
          text-xs font-bold px-1 rounded
          ${whitePercentage > 50 ? 'bg-black text-white' : 'bg-white text-black'}
        `}>
          {getEvaluationText()}
        </span>
      </div>

      {/* Глубина анализа */}
      {evaluation && (
        <div className="absolute bottom-1 left-0 right-0 text-center">
          <span className="text-[8px] text-gray-400">
            d{evaluation.depth}
          </span>
        </div>
      )}
    </div>
  );
}