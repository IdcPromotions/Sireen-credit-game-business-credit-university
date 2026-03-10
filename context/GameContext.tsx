import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";

export type Rank =
  | "Rookie"
  | "Builder"
  | "Strategist"
  | "Operator"
  | "Commander"
  | "Elite Restorer";

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
}

export interface GameState {
  xp: number;
  rank: Rank;
  completedLessons: number[];
  lessonScores: Record<number, number>;
  badges: Badge[];
}

interface GameContextValue extends GameState {
  isPremium: boolean;
  premiumExpiresAt: string | null;
  hasLetters: boolean;
  hasUniversity: boolean;
  premiumDaysLeft: number | null;
  completeLesson: (lessonId: number, score: number, xpEarned: number) => void;
  resetProgress: () => void;
  checkPremiumStatus: () => void;
  getRankProgress: () => { current: number; next: number; progress: number; nextRank: Rank | null };
}

const RANKS: { rank: Rank; minXp: number }[] = [
  { rank: "Rookie", minXp: 0 },
  { rank: "Builder", minXp: 100 },
  { rank: "Strategist", minXp: 300 },
  { rank: "Operator", minXp: 600 },
  { rank: "Commander", minXp: 1000 },
  { rank: "Elite Restorer", minXp: 1500 },
];

const ALL_BADGES: Badge[] = [
  { id: "first_mission", name: "First Mission", icon: "flag", description: "Complete Lesson 1", earned: false },
  { id: "score_tracker", name: "Score Tracker", icon: "bar-chart-2", description: "Complete Lesson 2", earned: false },
  { id: "report_reader", name: "Report Reader", icon: "file-text", description: "Complete Lesson 3", earned: false },
  { id: "threat_analyst", name: "Threat Analyst", icon: "alert-triangle", description: "Complete Lesson 4", earned: false },
  { id: "myth_buster", name: "Myth Buster", icon: "x-circle", description: "Complete Lesson 5", earned: false },
  { id: "bootcamp_grad", name: "Bootcamp Graduate", icon: "award", description: "Complete all 5 free lessons", earned: false },
  { id: "perfect_score", name: "Perfect Score", icon: "star", description: "Score 100% on any quiz", earned: false },
  { id: "auditor", name: "Auditor", icon: "search", description: "Complete Lesson 6", earned: false },
  { id: "dispute_op", name: "Dispute Operator", icon: "send", description: "Complete Lesson 8", earned: false },
  { id: "elite_restorer", name: "Elite Restorer", icon: "shield", description: "Complete all 18 lessons", earned: false },
];

const BADGE_LESSON_MAP: Record<number, string> = {
  1: "first_mission",
  2: "score_tracker",
  3: "report_reader",
  4: "threat_analyst",
  5: "myth_buster",
  6: "auditor",
  8: "dispute_op",
};

function getRankForXp(xp: number): Rank {
  let rank: Rank = "Rookie";
  for (const r of RANKS) {
    if (xp >= r.minXp) rank = r.rank;
  }
  return rank;
}

const STORAGE_KEY = "sireen_game_state";

const GameContext = createContext<GameContextValue | null>(null);

function getDaysLeft(expiresAt: string | null): number | null {
  if (!expiresAt) return null;
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return 0;
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function GameProvider({ children }: { children: ReactNode }) {
  const { user, refreshUser } = useAuth();

  const [state, setState] = useState<GameState>({
    xp: 0,
    rank: "Rookie",
    completedLessons: [],
    lessonScores: {},
    badges: ALL_BADGES,
  });

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved = JSON.parse(raw) as Partial<GameState>;
          setState((prev) => ({
            ...prev,
            xp: saved.xp ?? 0,
            rank: getRankForXp(saved.xp ?? 0),
            completedLessons: saved.completedLessons ?? [],
            lessonScores: saved.lessonScores ?? {},
            badges: ALL_BADGES.map((b) => ({
              ...b,
              earned: (saved.badges ?? []).some(
                (sb: Badge) => sb.id === b.id && sb.earned
              ),
            })),
          }));
        } catch (e) {
          console.warn("Failed to parse saved game state:", e);
        }
      }
    });
  }, []);

  const saveState = (newState: GameState) => {
    setState(newState);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const completeLesson = (lessonId: number, score: number, xpEarned: number) => {
    setState((prev) => {
      const alreadyCompleted = prev.completedLessons.includes(lessonId);
      const prevScore = prev.lessonScores[lessonId] ?? 0;
      const newXp = prev.xp + (alreadyCompleted ? 0 : xpEarned);

      const newBadges = prev.badges.map((b) => {
        if (BADGE_LESSON_MAP[lessonId] === b.id) return { ...b, earned: true };
        if (b.id === "perfect_score" && score === 100) return { ...b, earned: true };
        return b;
      });

      const allFreeDone = [1, 2, 3, 4, 5].every(
        (id) =>
          id === lessonId ||
          prev.completedLessons.includes(id)
      );

      const allDone = Array.from({ length: 18 }, (_, i) => i + 1).every(
        (id) => id === lessonId || prev.completedLessons.includes(id)
      );

      const finalBadges = newBadges.map((b) => {
        if (b.id === "bootcamp_grad" && allFreeDone) return { ...b, earned: true };
        if (b.id === "elite_restorer" && allDone) return { ...b, earned: true };
        return b;
      });

      const newState: GameState = {
        ...prev,
        xp: newXp,
        rank: getRankForXp(newXp),
        completedLessons: alreadyCompleted
          ? prev.completedLessons
          : [...prev.completedLessons, lessonId],
        lessonScores: {
          ...prev.lessonScores,
          [lessonId]: Math.max(score, prevScore),
        },
        badges: finalBadges,
      };

      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  };

  const checkPremiumStatus = useCallback(() => {
    refreshUser();
  }, [refreshUser]);

  const resetProgress = () => {
    const freshState: GameState = {
      xp: 0,
      rank: "Rookie",
      completedLessons: [],
      lessonScores: {},
      badges: ALL_BADGES,
    };
    saveState(freshState);
  };

  const isPremium = user?.isPremium ?? false;
  const premiumExpiresAt = user?.premiumExpiresAt ?? null;
  const hasLetters = user?.hasLetters ?? false;
  const hasUniversity = user?.hasUniversity ?? false;
  const premiumDaysLeft = getDaysLeft(premiumExpiresAt);

  const getRankProgress = () => {
    const currentIdx = RANKS.findIndex((r) => r.rank === state.rank);
    const currentMin = RANKS[currentIdx].minXp;
    const nextRank = RANKS[currentIdx + 1] ?? null;
    const nextMin = nextRank?.minXp ?? currentMin + 500;
    const progress =
      nextRank
        ? Math.min((state.xp - currentMin) / (nextMin - currentMin), 1)
        : 1;
    return {
      current: state.xp - currentMin,
      next: nextMin - currentMin,
      progress,
      nextRank: nextRank?.rank ?? null,
    };
  };

  const value = useMemo<GameContextValue>(
    () => ({
      ...state,
      isPremium,
      premiumExpiresAt,
      hasLetters,
      hasUniversity,
      premiumDaysLeft,
      completeLesson,
      resetProgress,
      checkPremiumStatus,
      getRankProgress,
    }),
    [state, isPremium, premiumExpiresAt, hasLetters, hasUniversity, premiumDaysLeft]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
}
