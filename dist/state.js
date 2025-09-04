export const state = {
    currentCategory: "nato",
    currentYear: 1949,
    startYear: 1900,
    endYear: 2025
};
export function setCategory(id) { state.currentCategory = id; }
export function setYear(y) { state.currentYear = y; }
