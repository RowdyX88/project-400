export type AppState = {
  currentCategory: string;
  currentYear: number;
  startYear: number;
  endYear: number;
};

export const state: AppState = {
  currentCategory: '',
  currentYear: 2000,
  startYear: 1900,
  endYear: 2025,
};
