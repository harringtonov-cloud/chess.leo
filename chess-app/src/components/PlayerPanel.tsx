'use client';

import { PIECE_SYMBOLS } from '@/lib/constants';

interface PlayerPanelProps {
  name: string;
  rating: number;
  isWhite: boolean;
  capturedPieces: string[];
  materialAdvantage: number;
}

export function PlayerPanel({ name, rating, isWhite, capturedPieces, materialAdvantage }: PlayerPanelProps) {
  return (
    <div className="flex items-center justify-between bg-[#262421] p-3 rounded">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
          isWhite ? 'bg-white text-black' : 'bg-gray-800 text-white'
        }`}>
          {name[0]}
        </div>
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-gray-400">{rating}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {capturedPieces.length > 0 && (
          <div className="flex flex-wrap gap-1 max-w-[150px]">
            {capturedPieces.map((piece, idx) => (
              <span key={idx} className="text-lg opacity-60">
                {PIECE_SYMBOLS[piece]}
              </span>
            ))}
          </div>
        )}
        
        {materialAdvantage > 0 && (
          <span className="text-[#759900] font-bold text-sm">
            +{materialAdvantage}
          </span>
        )}
      </div>
    </div>
  );
}