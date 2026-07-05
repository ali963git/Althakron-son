import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ar: {
    translation: {
      'nav.home': 'الرئيسية',
      'nav.quran': 'القرآن الكريم',
      'nav.hisn': 'حصن المسلم',
      'nav.azkar': 'أذكار المسلم',
      'nav.dua': 'دعاء اليوم',
      'nav.hadeeth': 'الحديث الشريف',
      'nav.community': 'المجتمع',
      'nav.settings': 'الإعدادات',
      'nav.tasbih': 'المسبحة',
      'nav.qibla': 'القبلة',
      'nav.zakat': 'حاسبة الزكاة',
      'nav.ai': 'مساعد الذكر',
      'header.quran': '📖 القرآن الكريم والمصحف الشريف',
      'header.hisn': '📜 حصن المسلم',
      'header.azkar': '📿 أذكار المسلم والتحصين اليومي',
      'header.dua': '🤲 أدعية مختارة',
      'header.hadeeth': '✨ الحديث الشريف',
      'header.tasbih': '📿 المسبحة الإلكترونية',
      'header.qibla': '🧭 بوصلة القبلة',
      'header.zakat': '💰 حاسبة الزكاة',
      'header.ai': '🤖 مساعد التدبر الإيماني',
      'settings.language': 'لغة الواجهة',
      'settings.arabic': 'العربية',
      'settings.english': 'English',
      'common.read': 'قراءة',
      'common.listen': 'استماع',
      'common.share': 'مشاركة',
      'common.copy': 'نسخ',
      'common.bookmark': 'حفظ',
      'common.search': 'بحث',
      'common.close': 'إغلاق',
      'common.loading': 'جاري التحميل...',
      'tasbih.count': 'العدد',
      'tasbih.reset': 'إعادة تعيين',
      'tasbih.target': 'الهدف',
      'qibla.calibrating': 'جاري تحديد اتجاه القبلة...',
      'zakat.calculate': 'احسب الزكاة',
      'zakat.amount': 'مقدار الزكاة',
      'ai.placeholder': 'اسأل عن آية، حديث، أو استشارة إيمانية...',
      'ai.send': 'إرسال'
    }
  },
  en: {
    translation: {
      'nav.home': 'Home',
      'nav.quran': 'Holy Quran',
      'nav.hisn': 'Hisn Al-Muslim',
      'nav.azkar': 'Daily Azkar',
      'nav.dua': 'Daily Dua',
      'nav.hadeeth': 'Hadith',
      'nav.community': 'Community',
      'nav.settings': 'Settings',
      'nav.tasbih': 'Tasbih',
      'nav.qibla': 'Qibla',
      'nav.zakat': 'Zakat Calculator',
      'nav.ai': 'Dhakir AI',
      'header.quran': '📖 Holy Quran & Al-Mus\'haf',
      'header.hisn': '📜 Hisn Al-Muslim',
      'header.azkar': '📿 Daily Azkar & Protection',
      'header.dua': '🤲 Selected Supplications',
      'header.hadeeth': '✨ The Prophetic Hadith',
      'header.tasbih': '📿 Digital Tasbih',
      'header.qibla': '🧭 Qibla Compass',
      'header.zakat': '💰 Zakat Calculator',
      'header.ai': '🤖 Faith Reflection Assistant',
      'settings.language': 'Interface Language',
      'settings.arabic': 'العربية',
      'settings.english': 'English',
      'common.read': 'Read',
      'common.listen': 'Listen',
      'common.share': 'Share',
      'common.copy': 'Copy',
      'common.bookmark': 'Bookmark',
      'common.search': 'Search',
      'common.close': 'Close',
      'common.loading': 'Loading...',
      'tasbih.count': 'Count',
      'tasbih.reset': 'Reset',
      'tasbih.target': 'Target',
      'qibla.calibrating': 'Calibrating Qibla direction...',
      'zakat.calculate': 'Calculate Zakat',
      'zakat.amount': 'Zakat Amount',
      'ai.placeholder': 'Ask about a verse, hadith, or spiritual advice...',
      'ai.send': 'Send'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
