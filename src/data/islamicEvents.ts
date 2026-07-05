export interface IslamicEvent {
  id: string;
  title: string;
  hijriDate: string;
  description: string;
  type: 'holiday' | 'historical' | 'religious';
}

export const HIJRI_MONTHS = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة',
  'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
];

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    id: 'e1',
    title: 'غزوة بدر',
    hijriDate: '17 رمضان',
    description: 'أولى الغزوات الكبرى في الإسلام وفتح الله فيها على المسلمين',
    type: 'historical'
  },
  {
    id: 'e2',
    title: 'فتح مكة',
    hijriDate: '20 رمضان',
    description: 'دخول النبي صلى الله عليه وسلم مكة فاتحاً عام 8 هـ',
    type: 'historical'
  },
  {
    id: 'e3',
    title: 'ليلة القدر',
    hijriDate: '21-29 رمضان',
    description: 'خير من ألف شهر، تتنزل فيها الملائكة والروح بإذن ربهم',
    type: 'religious'
  },
  {
    id: 'e4',
    title: 'عيد الفطر',
    hijriDate: '1 شوال',
    description: 'يوم الفرح والسرور بعد صيام شهر رمضان المبارك',
    type: 'holiday'
  },
  {
    id: 'e5',
    title: 'يوم عرفة',
    hijriDate: '9 ذو الحجة',
    description: 'خير يوم طلعت عليه الشمس، يكفر الله فيه ذنوب سنة ماضية وسنة قادمة',
    type: 'religious'
  },
  {
    id: 'e6',
    title: 'عيد الأضحى',
    hijriDate: '10-13 ذو الحجة',
    description: 'أيام التشريق والأضحية في ذكرى نبي الله إبراهيم عليه السلام',
    type: 'holiday'
  }
];
