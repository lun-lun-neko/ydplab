import { create } from "zustand";

const initialState = {
  householdIncome: 1,
  leisurePurpose: 0,
  leisurePurpose2: 0,
  weekdayAvgLeisureTime: 0,
  weekendAvgLeisureTime: 0,
  restRecreationRate: 0,
  hobbyRate: 0,
  selfImprovementRate: 0,
  socialRelationshipRate: 0,
  leisureActivity1: 0,
  leisureActivity2: 0,
  leisureActivity3: 0,
  leisureActivity4: 0,
  leisureActivity5: 0,
};

export const usePostDataStore = create((set) => ({
  ...initialState,
  setPostData: (key, value) => set((state) => ({ ...state, [key]: value })),
  resetPostData: () => set(() => ({ ...initialState })),
}));
