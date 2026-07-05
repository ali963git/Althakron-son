export interface Surah {
  number: number;
  name: string;
  englishName: string;
  verses: number;
  type: 'meccan' | 'medinan';
  pageStart: number;
}

export const SURAHS: Surah[] = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Fatiha', verses: 7, type: 'meccan', pageStart: 1 },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', verses: 286, type: 'medinan', pageStart: 2 },
  { number: 3, name: 'آل عمران', englishName: 'Aal-E-Imran', verses: 200, type: 'medinan', pageStart: 50 },
  { number: 4, name: 'النساء', englishName: 'An-Nisa', verses: 176, type: 'medinan', pageStart: 77 },
  { number: 5, name: 'المائدة', englishName: 'Al-Ma\'idah', verses: 120, type: 'medinan', pageStart: 106 },
  { number: 36, name: 'يس', englishName: 'Ya-Sin', verses: 83, type: 'meccan', pageStart: 440 },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', verses: 78, type: 'medinan', pageStart: 531 },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', verses: 30, type: 'meccan', pageStart: 562 },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', verses: 4, type: 'meccan', pageStart: 604 },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', verses: 5, type: 'meccan', pageStart: 604 },
  { number: 114, name: 'الناس', englishName: 'An-Nas', verses: 6, type: 'meccan', pageStart: 604 },
];

export const getSurahByNumber = (num: number): Surah | undefined => 
  SURAHS.find(s => s.number === num);
