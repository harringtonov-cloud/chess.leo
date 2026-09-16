import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Типы данных
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  rating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  photoURL?: string;
  createdAt: Timestamp;
  lastActive: Timestamp;
}

export interface GameData {
  id: string;
  whitePlayerId: string;
  blackPlayerId: string;
  whitePlayerName: string;
  blackPlayerName: string;
  whiteRating: number;
  blackRating: number;
  fen: string;
  pgn: string;
  moves: string[];
  timeControl: {
    time: number;
    increment: number;
  };
  whiteTime: number;
  blackTime: number;
  currentTurn: 'white' | 'black';
  status: 'waiting' | 'active' | 'finished';
  result?: 'white' | 'black' | 'draw';
  resultReason?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Challenge {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorRating: number;
  timeControl: {
    time: number;
    increment: number;
    name: string;
  };
  rated: boolean;
  color?: 'white' | 'black' | 'random';
  status: 'open' | 'accepted' | 'cancelled';
  createdAt: Timestamp;
}

// Коллекции
export const COLLECTIONS = {
  USERS: 'users',
  GAMES: 'games',
  CHALLENGES: 'challenges',
  GAME_HISTORY: 'gameHistory',
};

// ==================== ПОЛЬЗОВАТЕЛИ ====================

export async function createUserProfile(
  uid: string,
  email: string,
  displayName: string
): Promise<void> {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  const userProfile: UserProfile = {
    uid,
    displayName,
    email,
    rating: 1500,
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    createdAt: Timestamp.now(),
    lastActive: Timestamp.now(),
  };

  await setDoc(userRef, userProfile);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }

  return null;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  await updateDoc(userRef, {
    ...data,
    lastActive: serverTimestamp(),
  });
}

export async function updateUserStats(
  uid: string,
  result: 'win' | 'loss' | 'draw',
  ratingChange: number
): Promise<void> {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return;

  const currentData = userSnap.data() as UserProfile;

  const updates: Partial<UserProfile> = {
    gamesPlayed: currentData.gamesPlayed + 1,
    rating: currentData.rating + ratingChange,
    lastActive: Timestamp.now(),
  };

  if (result === 'win') updates.wins = currentData.wins + 1;
  if (result === 'loss') updates.losses = currentData.losses + 1;
  if (result === 'draw') updates.draws = currentData.draws + 1;

  await updateDoc(userRef, updates);
}

// ==================== ВЫЗОВЫ ====================

export async function createChallenge(challenge: Omit<Challenge, 'id' | 'createdAt'>): Promise<string> {
  const challengesRef = collection(db, COLLECTIONS.CHALLENGES);
  const newChallengeRef = doc(challengesRef);

  const challengeData: Challenge = {
    ...challenge,
    id: newChallengeRef.id,
    createdAt: Timestamp.now(),
  };

  await setDoc(newChallengeRef, challengeData);
  return newChallengeRef.id;
}

export async function getOpenChallenges(): Promise<Challenge[]> {
  const challengesRef = collection(db, COLLECTIONS.CHALLENGES);
  const q = query(
    challengesRef,
    where('status', '==', 'open'),
    orderBy('createdAt', 'desc'),
    limit(20)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Challenge);
}

export function subscribeToOpenChallenges(
  callback: (challenges: Challenge[]) => void
): () => void {
  const challengesRef = collection(db, COLLECTIONS.CHALLENGES);
  const q = query(
    challengesRef,
    where('status', '==', 'open'),
    orderBy('createdAt', 'desc'),
    limit(20)
  );

  return onSnapshot(q, (snapshot) => {
    const challenges = snapshot.docs.map((doc) => doc.data() as Challenge);
    callback(challenges);
  });
}

export async function acceptChallenge(challengeId: string): Promise<void> {
  const challengeRef = doc(db, COLLECTIONS.CHALLENGES, challengeId);
  await updateDoc(challengeRef, {
    status: 'accepted',
  });
}

export async function cancelChallenge(challengeId: string): Promise<void> {
  const challengeRef = doc(db, COLLECTIONS.CHALLENGES, challengeId);
  await deleteDoc(challengeRef);
}

// ==================== ИГРЫ ====================

export async function createGame(gameData: Omit<GameData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const gamesRef = collection(db, COLLECTIONS.GAMES);
  const newGameRef = doc(gamesRef);

  const game: GameData = {
    ...gameData,
    id: newGameRef.id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await setDoc(newGameRef, game);
  return newGameRef.id;
}

export async function getGame(gameId: string): Promise<GameData | null> {
  const gameRef = doc(db, COLLECTIONS.GAMES, gameId);
  const gameSnap = await getDoc(gameRef);

  if (gameSnap.exists()) {
    return gameSnap.data() as GameData;
  }

  return null;
}

export async function updateGame(
  gameId: string,
  data: Partial<GameData>
): Promise<void> {
  const gameRef = doc(db, COLLECTIONS.GAMES, gameId);
  await updateDoc(gameRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToGame(
  gameId: string,
  callback: (game: GameData | null) => void
): () => void {
  const gameRef = doc(db, COLLECTIONS.GAMES, gameId);

  return onSnapshot(gameRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as GameData);
    } else {
      callback(null);
    }
  });
}

export async function finishGame(
  gameId: string,
  result: 'white' | 'black' | 'draw',
  resultReason: string
): Promise<void> {
  const gameRef = doc(db, COLLECTIONS.GAMES, gameId);
  await updateDoc(gameRef, {
    status: 'finished',
    result,
    resultReason,
    updatedAt: serverTimestamp(),
  });

  // Сохраняем в историю
  const game = await getGame(gameId);
  if (game) {
    const historyRef = doc(collection(db, COLLECTIONS.GAME_HISTORY));
    await setDoc(historyRef, game);
  }
}

export async function getUserGames(
  userId: string,
  limitCount: number = 10
): Promise<GameData[]> {
  const gamesRef = collection(db, COLLECTIONS.GAME_HISTORY);
  
  const q = query(
    gamesRef,
    where('whitePlayerId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const q2 = query(
    gamesRef,
    where('blackPlayerId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const [snapshot1, snapshot2] = await Promise.all([getDocs(q), getDocs(q2)]);

  const games = [
    ...snapshot1.docs.map((doc) => doc.data() as GameData),
    ...snapshot2.docs.map((doc) => doc.data() as GameData),
  ];

  // Сортируем по дате
  games.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

  return games.slice(0, limitCount);
}

// ==================== РЕЙТИНГ ====================

export function calculateElo(
  playerRating: number,
  opponentRating: number,
  result: number // 1 = победа, 0.5 = ничья, 0 = поражение
): number {
  const K = 32; // K-фактор
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  return Math.round(K * (result - expectedScore));
}

export async function updateRatingsAfterGame(
  whitePlayerId: string,
  blackPlayerId: string,
  result: 'white' | 'black' | 'draw'
): Promise<void> {
  const [whitePlayer, blackPlayer] = await Promise.all([
    getUserProfile(whitePlayerId),
    getUserProfile(blackPlayerId),
  ]);

  if (!whitePlayer || !blackPlayer) return;

  let whiteResult: number;
  let blackResult: number;

  if (result === 'white') {
    whiteResult = 1;
    blackResult = 0;
  } else if (result === 'black') {
    whiteResult = 0;
    blackResult = 1;
  } else {
    whiteResult = 0.5;
    blackResult = 0.5;
  }

  const whiteRatingChange = calculateElo(
    whitePlayer.rating,
    blackPlayer.rating,
    whiteResult
  );

  const blackRatingChange = calculateElo(
    blackPlayer.rating,
    whitePlayer.rating,
    blackResult
  );

  await Promise.all([
    updateUserStats(
      whitePlayerId,
      result === 'white' ? 'win' : result === 'draw' ? 'draw' : 'loss',
      whiteRatingChange
    ),
    updateUserStats(
      blackPlayerId,
      result === 'black' ? 'win' : result === 'draw' ? 'draw' : 'loss',
      blackRatingChange
    ),
  ]);
}