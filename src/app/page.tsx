'use client';

import { ChessBoardComponent } from '@/components/ChessBoard';
import { PlayerPanel } from '@/components/PlayerPanel';
import { Timer } from '@/components/Timer';
import { Controls } from '@/components/Controls';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1a1a1a] text-white p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        <div className="space-y-4">
          <PlayerPanel
            name="Black"
            rating={1500}
            isWhite={false}
            capturedPieces={[]}
            materialAdvantage={0}
          />

          <Timer
            isWhite={false}
            time={600}
            isActive={false}
          />

          <ChessBoardComponent />

          <Timer
            isWhite={true}
            time={600}
            isActive={true}
          />

          <PlayerPanel
            name="White"
            rating={1500}
            isWhite={true}
            capturedPieces={[]}
            materialAdvantage={0}
          />
        </div>

        <div>
          <Controls />
        </div>

      </div>
    </main>
  );
}
