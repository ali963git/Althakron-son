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
      'header.quran': '📖 القرآن الكريم والمصحف الشريف',
      'header.hisn': '📜 حصن المسلم',
      'header.azkar': '📿 أذكار المسلم والتحصين اليومي',
      'header.dua': '🤲 أدعية مختارة',
      'header.hadeeth': '✨ الحديث الشريف',
      'header.tasbih': '📿 المسبحة الإلكترونية ومستودع الأوراد الذكي',
      'header.history': 'حدث في مثل هذا اليوم من التاريخ الإسلامي 📜',
      'nav.tasbih_desc': 'تتبع تسبيحاتك اليومية والكلية التي تستوعب الآلاف والمليون مع مستودع أوراد مخصص وتفاعلي يعمل بسلاسة فائقة على جميع الأجهزة والمتصفحات.',
      'nav.quran_desc': 'تصفّح واقرأ آيات الذكر الحكيم بصفحات مصورة بالرسم العثماني أو استمع إلى أعذب التلاوات',
      'nav.quran_read': '📖 قراءة وتصفح المصحف',
      'nav.quran_listen': '🔊 استماع للمصحف المرتل',
      'history.hijri_current': 'اليوم الهجري الحالي',
      'settings.language': 'لغة الواجهة',
      'settings.arabic': 'العربية',
      'settings.english': 'English'
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
      'header.quran': '📖 Holy Quran & Al-Mus\'haf Al-Sharif',
      'header.hisn': '📜 Hisn Al-Muslim (Fortress of the Muslim)',
      'header.azkar': '📿 Daily Muslim Azkar & Protection',
      'header.dua': '🤲 Selected Supplications',
      'header.hadeeth': '✨ The Prophetic Hadith',
      'header.tasbih': '📿 Digital Tasbih & Smart Dhikr Repository',
      'header.history': 'On This Day in Islamic History 📜',
      'nav.tasbih_desc': 'Track your daily and total tasbih counts with a dedicated, interactive dhikr repository that works seamlessly on all devices.',
      'nav.quran_desc': 'Browse and read verses of the Holy Quran with illustrated pages or listen to beautiful recitations.',
      'nav.quran_read': '📖 Read & Browse Quran',
      'nav.quran_listen': '🔊 Listen to Recited Quran',
      'history.hijri_current': 'Current Hijri Day',
      'settings.language': 'Interface Language',
      'settings.arabic': 'العربية',
      'settings.english': 'English'
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
    }
  });

export default i18n;
