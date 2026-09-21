'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';

interface TimerProps {
  isWhite: boolean;
  time: number;
  isActive: boolean;
}

export function Timer({ isWhite, time, isActive }: TimerProps) {
  const updateTime = useGameStore(state => state.updateTime);
  const [displayTime, setDisplayTime] = useState(time);

  useEffect(() => {
    setDisplayTime(time);
  }, [time]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setDisplayTime(prev => {
        const newTime = Math.max(0, prev - 0.1);
        updateTime(isWhite, newTime);
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, isWhite, updateTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    
    if (seconds < 20) {
      return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = displayTime < 20;
  const isCritical = displayTime < 10;

  return (
    <div className={`
      px-4 py-2 rounded font-mono text-2xl font-bold
      ${isActive ? 'timer-active' : ''}
      ${isCritical ? 'bg-red-600 text-white' : isLowTime ? 'bg-orange-500 text-white' : 'bg-[#3d3a36] text-gray-300'}
    `}>
      {formatTime(displayTime)}
    </div>
  );
}