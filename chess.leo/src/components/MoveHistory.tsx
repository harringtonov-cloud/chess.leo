'use client';

import { useGameStore } from '@/store/gameStore';

export function MoveHistory() {
  const moveHistory = useGameStore(state => state.moveHistory);

  const getMovesPairs = () => {
    const pairs: Array<{ moveNumber: number; white: string; black?: string }> = [];
    
    for (let i = 0; i < moveHistory.length; i += 2) {
      pairs.push({
        moveNumber: Math.floor(i / 2) + 1,
        white: moveHistory[i],
        black: moveHistory[i + 1],
      });
    }
    
    return pairs;
  };

  return (
    <div className="bg-[#262421] rounded p-4 h-[400px] overflow-y-auto">
      <h3 className="font-bold mb-3 text-gray-300">История ходов</h3>
      
      {moveHistory.length === 0 ? (
        <p className="text-gray-500 text-sm">Партия еще не начата</p>
      ) : (
        <div className="space-y-1">
          {getMovesPairs().map((pair) => (
            <div
              key={pair.moveNumber}
              className="flex items-center gap-3 text-sm move-item p-1 rounded"
            >
              <span className="text-gray-500 w-6">{pair.moveNumber}.</span>
              <span className="flex-1 font-mono">{pair.white}</span>
              {pair.black && (
                <span className="flex-1 font-mono text-gray-300">{pair.black}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}