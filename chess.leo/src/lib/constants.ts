export const TIME_CONTROLS = {
  BULLET_1: { time: 60, increment: 0, name: 'Bullet 1+0' },
  BULLET_2: { time: 120, increment: 1, name: 'Bullet 2+1' },
  BLITZ_3: { time: 180, increment: 2, name: 'Blitz 3+2' },
  BLITZ_5: { time: 300, increment: 0, name: 'Blitz 5+0' },
  RAPID_10: { time: 600, increment: 0, name: 'Rapid 10+0' },
  RAPID_15: { time: 900, increment: 10, name: 'Rapid 15+10' },
  CLASSICAL_30: { time: 1800, increment: 0, name: 'Classical 30+0' },
};

export const AI_LEVELS = {
  BEGINNER: { depth: 1, skillLevel: 0, name: 'Новичок (800)' },
  EASY: { depth: 3, skillLevel: 3, name: 'Легко (1200)' },
  MEDIUM: { depth: 6, skillLevel: 7, name: 'Средне (1600)' },
  HARD: { depth: 10, skillLevel: 12, name: 'Сложно (2000)' },
  MASTER: { depth: 15, skillLevel: 17, name: 'Мастер (2400)' },
  GRANDMASTER: { depth: 20, skillLevel: 20, name: 'Гроссмейстер (2800)' },
};

export const PIECE_VALUES: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

export const PIECE_SYMBOLS: Record<string, string> = {
  p: '♟',
  n: '♞',
  b: '♝',
  r: '♜',
  q: '♛',
  k: '♚',
};