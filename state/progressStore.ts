import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ActivityId = 'mpc' | 'architecture' | 'mxe-builder' | 'staking' | 'mempool';

export interface ProgressState {
  xp: number;
  level: number;
  completedActivities: Record<ActivityId, boolean>;
  hasSeenWelcome: boolean;
}

interface ProgressActions {
  addXP: (amount: number) => void;
  markActivityCompleted: (activity: ActivityId) => void;
  setHasSeenWelcome: () => void;
  resetProgress: () => void;
}

export type ProgressStore = ProgressState & ProgressActions;

const calculateLevel = (xp: number) => Math.floor(xp / 500) + 1;

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      completedActivities: {
        'mpc': false,
        'architecture': false,
        'mxe-builder': false,
        'staking': false,
        'mempool': false,
      },
      hasSeenWelcome: false,

      addXP: (amount) =>
        set((state) => {
          const newXP = state.xp + amount;
          return {
            xp: newXP,
            level: calculateLevel(newXP),
          };
        }),

      markActivityCompleted: (activity) => {
        const state = get();
        if (!state.completedActivities[activity]) {
          set((s) => ({
            completedActivities: {
              ...s.completedActivities,
              [activity]: true,
            },
          }));
          // Award 100 XP for first-time completion
          get().addXP(100);
        }
      },

      setHasSeenWelcome: () => set({ hasSeenWelcome: true }),

      resetProgress: () =>
        set({
          xp: 0,
          level: 1,
          completedActivities: {
            'mpc': false,
            'architecture': false,
            'mxe-builder': false,
            'staking': false,
            'mempool': false,
          },
          hasSeenWelcome: false,
        }),
    }),
    {
      name: 'arcium-progress-storage', // unique name for localStorage key
    }
  )
);
