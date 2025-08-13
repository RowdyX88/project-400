export type AppState = {
  currentCategory: string;
  currentYear: number;
  startYear: number;
  endYear: number;
};
export const state: AppState = {
  currentCategory: "nato",
  currentYear: 1949,
  startYear: 1900,
  endYear: 2025
};
export function setCategory(id: string){ state.currentCategory = id; }
export function setYear(y: number){ state.currentYear = y; }
