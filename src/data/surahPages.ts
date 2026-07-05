export const SURAH_START_PAGES: Record<number, number> = {
  1: 1, 2: 2, 3: 50, 4: 77, 5: 106, 36: 440, 55: 531, 67: 562, 112: 604, 113: 604, 114: 604
};

export const getJuzForPage = (page: number): number => {
  return Math.ceil(page / 20);
};

export const getSurahForPage = (page: number): number => {
  const entries = Object.entries(SURAH_START_PAGES).sort((a, b) => b[1] - a[1]);
  for (const [surah, startPage] of entries) {
    if (page >= startPage) return parseInt(surah);
  }
  return 1;
};
