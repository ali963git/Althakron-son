export interface ZikrItem {
  id: string;
  text: string;
  count: number;
  reference?: string;
  virtue?: string;
  category: string;
}

export interface AzkarCategory {
  id: string;
  title: string;
  icon: string;
  items: ZikrItem[];
}

export const AZKAR_DATA: AzkarCategory[] = [
  {
    id: 'morning',
    title: 'أذكار الصباح',
    icon: 'Sun',
    items: [
      {
        id: 'm1',
        text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        count: 1,
        reference: 'مسلم',
        virtue: 'من قالها حين يصبح كان له أجر عتق رقبة',
        category: 'morning'
      },
      {
        id: 'm2',
        text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
        count: 1,
        reference: 'الترمذي',
        category: 'morning'
      },
      {
        id: 'm3',
        text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ، وَهُوَ السَّمِيعُ الْعَلِيمُ',
        count: 3,
        reference: 'الترمذي',
        virtue: 'من قالها ثلاث مرات حين يصبح وثلاث مرات حين يمسي لم يضره شيء',
        category: 'morning'
      },
      {
        id: 'm4',
        text: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
        count: 3,
        reference: 'أبو داود والترمذي',
        virtue: 'من قالها حين يصبح وحين يمسي كان حقاً على الله أن يرضيه',
        category: 'morning'
      },
      {
        id: 'm5',
        text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ',
        count: 3,
        reference: 'مسلم',
        category: 'morning'
      }
    ]
  },
  {
    id: 'evening',
    title: 'أذكار المساء',
    icon: 'Moon',
    items: [
      {
        id: 'e1',
        text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        count: 1,
        reference: 'مسلم',
        category: 'evening'
      },
      {
        id: 'e2',
        text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        count: 3,
        reference: 'مسلم',
        category: 'evening'
      }
    ]
  },
  {
    id: 'sleep',
    title: 'أذكار النوم',
    icon: 'Moon',
    items: [
      {
        id: 's1',
        text: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        count: 1,
        reference: 'البخاري',
        category: 'sleep'
      },
      {
        id: 's2',
        text: 'سُبْحَانَ اللَّهِ',
        count: 33,
        reference: 'البخاري',
        category: 'sleep'
      },
      {
        id: 's3',
        text: 'الْحَمْدُ لِلَّهِ',
        count: 33,
        category: 'sleep'
      },
      {
        id: 's4',
        text: 'اللَّهُ أَكْبَرُ',
        count: 34,
        category: 'sleep'
      }
    ]
  },
  {
    id: 'prayer',
    title: 'أذكار بعد الصلاة',
    icon: 'Sparkles',
    items: [
      {
        id: 'p1',
        text: 'أَسْتَغْفِرُ اللَّهَ (ثلاثاً)',
        count: 3,
        category: 'prayer'
      },
      {
        id: 'p2',
        text: 'اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
        count: 1,
        reference: 'مسلم',
        category: 'prayer'
      },
      {
        id: 'p3',
        text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        count: 1,
        reference: 'البخاري',
        category: 'prayer'
      }
    ]
  }
];

export const PRESETS_DHIKR = [
  { name: 'تسبيح', text: 'سُبْحَانَ اللَّهِ', target: 33 },
  { name: 'تحميد', text: 'الْحَمْدُ لِلَّهِ', target: 33 },
  { name: 'تكبير', text: 'اللَّهُ أَكْبَرُ', target: 33 },
  { name: 'تهليل', text: 'لَا إِلَهَ إِلَّا اللَّهُ', target: 100 },
  { name: 'استغفار', text: 'أَسْتَغْفِرُ اللَّهَ', target: 100 },
  { name: 'الصلاة على النبي', text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', target: 100 }
];
