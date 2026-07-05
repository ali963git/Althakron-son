import { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Moon, Sun, RotateCcw, Search, Award, Compass, 
  Sparkles, Share2, Clock, Copy, Check, Play, Pause, Volume2, 
  VolumeX, Menu, Heart, Calculator, ChevronRight, Bookmark, 
  ZoomIn, ZoomOut, User, Star, Bell, Home, Book, Wind, 
  MessageCircle, Hash, X, Headphones, SkipForward, SkipBack,
  Flame, TrendingUp, BarChart3, Zap, ChevronUp, ChevronDown, 
  Plus, Trash2, Coffee, MapPin, Facebook, Github, Calendar,
  Quote, Eye, ExternalLink
} from 'lucide-react';
import { SURAHS, Surah } from './data/surahs';
import { AZKAR_DATA, PRESETS_DHIKR } from './data/azkar';
import { HISN_AL_MUSLIM } from './data/hisn';
import { SUNNAH_DUAS } from './data/duas';
import { ISLAMIC_EVENTS, HIJRI_MONTHS } from './data/islamicEvents';
import { CURATED_HADEETHS } from './data/hadeethOfTheDay';
import { useAuth } from './AuthProvider';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';

type Section = 'home' | 'quran' | 'azkar' | 'hisn' | 'dua' | 'hadeeth' | 'tasbih' | 'qibla' | 'zakat' | 'ai' | 'community' | 'settings';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [isDark, setIsDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const navItems: { id: Section; label: string; icon: any }[] = [
    { id: 'home', label: t('nav.home'), icon: Home },
    { id: 'quran', label: t('nav.quran'), icon: BookOpen },
    { id: 'azkar', label: t('nav.azkar'), icon: Sparkles },
    { id: 'tasbih', label: t('nav.tasbih'), icon: Hash },
    { id: 'qibla', label: t('nav.qibla'), icon: Compass },
    { id: 'zakat', label: t('nav.zakat'), icon: Calculator },
    { id: 'ai', label: t('nav.ai'), icon: MessageCircle },
    { id: 'settings', label: t('nav.settings'), icon: Star },
  ];

  return (
    <div className={`min-h-screen bg-[#02130F] text-[#E6DFD3] font-cairo ${isDark ? 'dark' : ''}`}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#02130F]/90 backdrop-blur-md border-b border-[#D4AF37]/20 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-[#0A2E22] rounded-lg transition-colors">
          <Menu className="w-6 h-6 text-[#D4AF37]" />
        </button>
        <h1 className="text-xl font-bold text-[#D4AF37] flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          الذَّاكِرُون
        </h1>
        <div className="flex items-center gap-2">
          <button onClick={toggleLang} className="px-3 py-1 text-xs bg-[#0A2E22] border border-[#D4AF37]/30 rounded-full text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
            {i18n.language === 'ar' ? 'EN' : 'عربي'}
          </button>
          {user ? (
            <img src={user.photoURL || ''} alt="profile" className="w-8 h-8 rounded-full border-2 border-[#D4AF37]" />
          ) : (
            <User className="w-6 h-6 text-[#D4AF37]/60" />
          )}
        </div>
      </header>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-[#0A2E22] border-l border-[#D4AF37]/20 z-50 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-[#D4AF37]">الذَّاكِرُون</h2>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-[#02130F] rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <button key={item.id}
                      onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        activeSection === item.id 
                          ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30' 
                          : 'hover:bg-[#02130F]/50 text-[#E6DFD3]/80'
                      }`}>
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {activeSection === item.id && <ChevronRight className="w-4 h-4 mr-auto" />}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="pt-16 px-4 pb-8 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={activeSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            {activeSection === 'home' && <HomeSection setActiveSection={setActiveSection} />}
            {activeSection === 'quran' && <QuranSection />}
            {activeSection === 'azkar' && <AzkarSection />}
            {activeSection === 'tasbih' && <TasbihSection />}
            {activeSection === 'qibla' && <QiblaSection />}
            {activeSection === 'zakat' && <ZakatSection />}
            {activeSection === 'ai' && <AISection />}
            {activeSection === 'settings' && <SettingsSection isDark={isDark} setIsDark={setIsDark} toggleLang={toggleLang} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// Home Section
function HomeSection({ setActiveSection }: { setActiveSection: (s: Section) => void }) {
  const today = new Date();
  const randomHadeeth = CURATED_HADEETHS[today.getDate() % CURATED_HADEETHS.length];
  const todayEvent = ISLAMIC_EVENTS[today.getDate() % ISLAMIC_EVENTS.length];

  const cards = [
    { id: 'quran' as Section, title: 'القرآن الكريم', icon: BookOpen, desc: 'تصفّح واقرأ آيات الذكر الحكيم', color: 'from-emerald-900/40 to-emerald-800/20', border: 'border-emerald-700/30' },
    { id: 'azkar' as Section, title: 'أذكار المسلم', icon: Sparkles, desc: 'أذكار الصباح والمساء والنوم', color: 'from-amber-900/40 to-amber-800/20', border: 'border-amber-700/30' },
    { id: 'tasbih' as Section, title: 'المسبحة الإلكترونية', icon: Hash, desc: 'تتبع تسبيحاتك اليومية والكلية', color: 'from-teal-900/40 to-teal-800/20', border: 'border-teal-700/30' },
    { id: 'qibla' as Section, title: 'بوصلة القبلة', icon: Compass, desc: 'تحديد اتجاه القبلة بدقة', color: 'from-blue-900/40 to-blue-800/20', border: 'border-blue-700/30' },
    { id: 'zakat' as Section, title: 'حاسبة الزكاة', icon: Calculator, desc: 'احسب زكاتك بسهولة ودقة', color: 'from-yellow-900/40 to-yellow-800/20', border: 'border-yellow-700/30' },
    { id: 'ai' as Section, title: 'مساعد الذكر', icon: MessageCircle, desc: 'مساعدك الذكي للتدبر والفقه', color: 'from-purple-900/40 to-purple-800/20', border: 'border-purple-700/30' },
  ];

  return (
    <div className="space-y-6">
      <section className="text-center py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#D4AF37] font-amiri leading-relaxed">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </h1>
          <p className="text-lg text-[#E6DFD3]/70 max-w-2xl mx-auto">
            منصة إسلامية شاملة تجمع بين القرآن الكريم، الأذكار، الأدعية، والمساعدة الإيمانية الذكية
          </p>
        </motion.div>
      </section>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-br from-[#0A2E22] to-[#02130F] border border-[#D4AF37]/20 rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Quote className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="text-lg font-bold text-[#D4AF37]">الحديث الشريف</h3>
          <span className="text-xs px-2 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full mr-auto">{randomHadeeth.grade}</span>
        </div>
        <p className="text-xl font-amiri leading-relaxed mb-3">{randomHadeeth.text}</p>
        <p className="text-sm text-[#E6DFD3]/50">{randomHadeeth.narrator} - {randomHadeeth.source}</p>
        {randomHadeeth.explanation && (
          <p className="text-sm text-[#E6DFD3]/60 mt-2 p-3 bg-[#02130F]/50 rounded-lg">{randomHadeeth.explanation}</p>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="p-4 bg-[#0A2E22] border border-[#D4AF37]/10 rounded-xl flex items-center gap-4">
        <Calendar className="w-8 h-8 text-[#D4AF37]" />
        <div>
          <p className="text-sm text-[#E6DFD3]/50">حدث في مثل هذا اليوم</p>
          <p className="font-bold text-[#D4AF37]">{todayEvent.title}</p>
          <p className="text-sm text-[#E6DFD3]/70">{todayEvent.description}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, idx) => (
          <motion.button key={card.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            onClick={() => setActiveSection(card.id)}
            className={`relative p-6 rounded-2xl bg-gradient-to-br ${card.color} border ${card.border} hover:scale-[1.02] transition-all duration-300 group text-right`}>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-[#02130F]/50 rounded-xl group-hover:bg-[#D4AF37]/20 transition-colors">
                <card.icon className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <ChevronRight className="w-5 h-5 text-[#D4AF37]/50 group-hover:text-[#D4AF37] transition-colors" />
            </div>
            <h3 className="text-xl font-bold mb-2">{card.title}</h3>
            <p className="text-sm text-[#E6DFD3]/60">{card.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}


// Quran Section
function QuranSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [viewMode, setViewMode] = useState<'read' | 'listen'>('read');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentReciter, setCurrentReciter] = useState('ar.alafasy');

  const reciters = [
    { id: 'ar.alafasy', name: 'مشاري العفاسي' },
    { id: 'ar.abdulbasitmurattal', name: 'عبد الباسط عبد الصمد' },
    { id: 'ar.husary', name: 'محمود خليل الحصري' },
    { id: 'ar.minshawi', name: 'محمد صديق المنشاوي' },
  ];

  const filteredSurahs = SURAHS.filter(s => 
    s.name.includes(searchQuery) || s.englishName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlayAudio = (surah: Surah) => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#D4AF37] flex items-center gap-3">
        <BookOpen className="w-8 h-8" />
        القرآن الكريم والمصحف الشريف
      </h2>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setViewMode('read')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${viewMode === 'read' ? 'bg-[#D4AF37] text-[#02130F]' : 'bg-[#0A2E22] text-[#E6DFD3]'}`}>
          قراءة
        </button>
        <button onClick={() => setViewMode('listen')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${viewMode === 'listen' ? 'bg-[#D4AF37] text-[#02130F]' : 'bg-[#0A2E22] text-[#E6DFD3]'}`}>
          استماع
        </button>
      </div>

      {viewMode === 'listen' && (
        <div className="p-4 bg-[#0A2E22] rounded-xl border border-[#D4AF37]/20">
          <label className="text-sm text-[#E6DFD3]/70 mb-2 block">القارئ:</label>
          <select value={currentReciter} onChange={(e) => setCurrentReciter(e.target.value)}
            className="w-full bg-[#02130F] border border-[#D4AF37]/20 rounded-lg px-4 py-2 text-[#E6DFD3]">
            {reciters.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      )}

      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]/50" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن سورة..."
          className="w-full bg-[#0A2E22] border border-[#D4AF37]/20 rounded-xl pr-12 pl-4 py-4 text-[#E6DFD3] placeholder-[#E6DFD3]/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors" />
      </div>

      <div className="grid gap-3">
        {filteredSurahs.map((surah) => (
          <motion.div key={surah.number} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-4 bg-[#0A2E22] border border-[#D4AF37]/10 rounded-xl hover:border-[#D4AF37]/30 transition-all cursor-pointer"
            onClick={() => setSelectedSurah(surah)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center text-[#D4AF37] font-bold">
                  {surah.number}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{surah.name}</h3>
                  <p className="text-sm text-[#E6DFD3]/50">{surah.englishName} • {surah.verses} آية</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs ${surah.type === 'meccan' ? 'bg-amber-900/30 text-amber-400' : 'bg-emerald-900/30 text-emerald-400'}`}>
                  {surah.type === 'meccan' ? 'مكية' : 'مدنية'}
                </span>
                {viewMode === 'listen' && (
                  <button onClick={(e) => { e.stopPropagation(); handlePlayAudio(surah); }}
                    className="p-2 bg-[#D4AF37]/20 rounded-lg hover:bg-[#D4AF37]/30 transition-colors">
                    {isPlaying ? <Pause className="w-5 h-5 text-[#D4AF37]" /> : <Play className="w-5 h-5 text-[#D4AF37]" />}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedSurah && <SurahDetailModal surah={selectedSurah} onClose={() => setSelectedSurah(null)} />}
    </div>
  );
}

function SurahDetailModal({ surah, onClose }: { surah: Surah; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const surahText = `بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ

سورة ${surah.name} - ${surah.verses} آية`;

  const copyText = () => {
    navigator.clipboard.writeText(surahText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-[#0A2E22] border border-[#D4AF37]/30 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-[#D4AF37]">سورة {surah.name}</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#02130F] rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-[#02130F] rounded-xl text-center">
            <p className="text-2xl font-amiri mb-2">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
            <p className="text-lg text-[#D4AF37]">سورة {surah.name}</p>
            <p className="text-sm text-[#E6DFD3]/50">{surah.verses} آية - {surah.type === 'meccan' ? 'مكية' : 'مدنية'}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={copyText} className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#D4AF37]/20 rounded-xl text-[#D4AF37] hover:bg-[#D4AF37]/30 transition-colors">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'تم النسخ' : 'نسخ'}
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#D4AF37]/20 rounded-xl text-[#D4AF37] hover:bg-[#D4AF37]/30 transition-colors">
              <Share2 className="w-4 h-4" /> مشاركة
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#D4AF37]/20 rounded-xl text-[#D4AF37] hover:bg-[#D4AF37]/30 transition-colors">
              <ExternalLink className="w-4 h-4" /> قراءة
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Azkar Section
function AzkarSection() {
  const [activeCategory, setActiveCategory] = useState('morning');
  const [counters, setCounters] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const category = AZKAR_DATA.find(c => c.id === activeCategory);

  const increment = (itemId: string, target: number) => {
    setCounters(prev => {
      const newCount = (prev[itemId] || 0) + 1;
      if (newCount >= target) {
        setCompleted(c => ({ ...c, [itemId]: true }));
        if (navigator.vibrate) navigator.vibrate(50);
      }
      return { ...prev, [itemId]: newCount };
    });
  };

  const resetAll = () => { setCounters({}); setCompleted({}); };
  const toggleFavorite = (id: string) => setFavorites(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#D4AF37] flex items-center gap-3">
        <Sparkles className="w-8 h-8" />
        أذكار المسلم والتحصين اليومي
      </h2>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {AZKAR_DATA.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-[#D4AF37] text-[#02130F] font-bold' : 'bg-[#0A2E22] text-[#E6DFD3]/70 border border-[#D4AF37]/20'}`}>
            {cat.title}
          </button>
        ))}
      </div>

      <button onClick={resetAll} className="flex items-center gap-2 text-sm text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors">
        <RotateCcw className="w-4 h-4" /> إعادة تعيين الكل
      </button>

      <div className="space-y-4">
        {category?.items.map((item, idx) => {
          const count = counters[item.id] || 0;
          const isDone = completed[item.id];
          const progress = Math.min((count / item.count) * 100, 100);

          return (
            <motion.div key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
              className={`relative p-6 rounded-2xl border transition-all ${isDone ? 'bg-[#0A2E22]/50 border-[#D4AF37]/30' : 'bg-[#0A2E22] border-[#D4AF37]/10 hover:border-[#D4AF37]/30'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <p className="text-xl leading-relaxed font-amiri text-[#E6DFD3]">{item.text}</p>
                  {item.reference && <p className="text-sm text-[#D4AF37]/70 mt-2 flex items-center gap-1"><BookOpen className="w-3 h-3" />{item.reference}</p>}
                  {item.virtue && <p className="text-sm text-emerald-400/80 mt-1">{item.virtue}</p>}
                </div>
                <button onClick={() => toggleFavorite(item.id)} className="p-2 mr-2">
                  <Heart className={`w-5 h-5 ${favorites[item.id] ? 'text-red-500 fill-red-500' : 'text-[#E6DFD3]/30'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="h-2 bg-[#02130F] rounded-full overflow-hidden">
                    <motion.div className="h-full bg-[#D4AF37] rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-xs text-[#E6DFD3]/50 mt-1">{count} / {item.count}</p>
                </div>
                <button onClick={() => increment(item.id, item.count)} disabled={isDone}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${isDone ? 'bg-emerald-900/50 text-emerald-400 cursor-default' : 'bg-[#D4AF37] text-[#02130F] hover:scale-110 active:scale-95'}`}>
                  {isDone ? <Check className="w-6 h-6" /> : count}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}


// Tasbih Section
function TasbihSection() {
  const [count, setCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedDhikr, setSelectedDhikr] = useState(PRESETS_DHIKR[0]);
  const [history, setHistory] = useState<{date: string; count: number; dhikr: string}[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('tasbih_total');
    if (saved) setTotalCount(parseInt(saved));
    const savedHistory = localStorage.getItem('tasbih_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const increment = () => {
    const newCount = count + 1;
    const newTotal = totalCount + 1;
    setCount(newCount);
    setTotalCount(newTotal);
    localStorage.setItem('tasbih_total', String(newTotal));
    if (newCount >= selectedDhikr.target && navigator.vibrate) navigator.vibrate([50, 100, 50]);
  };

  const reset = () => setCount(0);

  const saveSession = () => {
    const newHistory = [...history, { date: new Date().toISOString(), count, dhikr: selectedDhikr.name }];
    setHistory(newHistory);
    localStorage.setItem('tasbih_history', JSON.stringify(newHistory));
    setCount(0);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#D4AF37] flex items-center gap-3">
        <Hash className="w-8 h-8" /> المسبحة الإلكترونية
      </h2>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {PRESETS_DHIKR.map((dhikr) => (
          <button key={dhikr.name} onClick={() => { setSelectedDhikr(dhikr); setCount(0); }}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${selectedDhikr.name === dhikr.name ? 'bg-[#D4AF37] text-[#02130F] font-bold' : 'bg-[#0A2E22] text-[#E6DFD3]/70 border border-[#D4AF37]/20'}`}>
            {dhikr.name} ({dhikr.target})
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center py-12">
        <motion.div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#0A2E22] to-[#02130F] border-4 border-[#D4AF37]/30 flex flex-col items-center justify-center relative mb-8 cursor-pointer"
          whileTap={{ scale: 0.95 }} onClick={increment}>
          <div className="absolute inset-0 rounded-full bg-[#D4AF37]/5 animate-pulse-gold" />
          <span className="text-6xl font-bold text-[#D4AF37] mb-2">{count}</span>
          <span className="text-sm text-[#E6DFD3]/50 text-center px-8">{selectedDhikr.text}</span>
          <div className="absolute bottom-4 w-full px-8">
            <div className="h-1 bg-[#02130F] rounded-full overflow-hidden">
              <div className="h-full bg-[#D4AF37] rounded-full transition-all duration-300" style={{ width: `${Math.min((count / selectedDhikr.target) * 100, 100)}%` }} />
            </div>
            <p className="text-center text-xs text-[#E6DFD3]/40 mt-1">{selectedDhikr.target} هدف</p>
          </div>
        </motion.div>

        <button onClick={increment} className="w-32 h-32 rounded-full bg-[#D4AF37] text-[#02130F] text-4xl font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] mb-6">
          +1
        </button>

        <div className="flex gap-4">
          <button onClick={reset} className="flex items-center gap-2 px-6 py-3 bg-[#0A2E22] border border-red-900/30 text-red-400 rounded-xl hover:bg-red-900/20 transition-colors">
            <RotateCcw className="w-4 h-4" /> إعادة
          </button>
          <button onClick={saveSession} className="flex items-center gap-2 px-6 py-3 bg-[#0A2E22] border border-[#D4AF37]/30 text-[#D4AF37] rounded-xl hover:bg-[#D4AF37]/10 transition-colors">
            <Bookmark className="w-4 h-4" /> حفظ الجلسة
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#E6DFD3]/50">إجمالي التسبيحات: <span className="text-[#D4AF37] font-bold">{totalCount.toLocaleString()}</span></p>
        </div>
      </div>

      {history.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-[#D4AF37] mb-4">سجل الجلسات</h3>
          <div className="space-y-2">
            {history.slice(-5).reverse().map((h, i) => (
              <div key={i} className="flex justify-between p-3 bg-[#0A2E22] rounded-lg border border-[#D4AF37]/10">
                <span className="text-sm text-[#E6DFD3]/70">{new Date(h.date).toLocaleDateString('ar-SA')}</span>
                <span className="text-[#D4AF37] font-bold">{h.count} {h.dhikr}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Qibla Section
function QiblaSection() {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    if ('DeviceOrientationEvent' in window) {
      const handleOrientation = (e: DeviceOrientationEvent) => {
        if (e.alpha !== null) setCompassHeading(360 - e.alpha);
      };
      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, []);

  const requestPermission = async () => {
    if ('DeviceOrientationEvent' in window && 'requestPermission' in DeviceOrientationEvent) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') setPermissionGranted(true);
      } catch (e) { console.error(e); }
    } else { setPermissionGranted(true); }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const kaabaLat = 21.4225, kaabaLng = 39.8262;
        const dLng = (kaabaLng - lng) * Math.PI / 180;
        const lat1Rad = lat * Math.PI / 180;
        const lat2Rad = kaabaLat * Math.PI / 180;
        const y = Math.sin(dLng);
        const x = Math.cos(lat1Rad) * Math.tan(lat2Rad) - Math.sin(lat1Rad) * Math.cos(dLng);
        let qibla = Math.atan2(y, x) * 180 / Math.PI;
        qibla = (qibla + 360) % 360;
        setQiblaDirection(qibla);
      });
    }
  };

  const rotation = qiblaDirection !== null ? qiblaDirection - compassHeading : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#D4AF37] flex items-center gap-3">
        <Compass className="w-8 h-8" /> بوصلة القبلة
      </h2>

      {!permissionGranted ? (
        <div className="text-center py-12">
          <Compass className="w-24 h-24 text-[#D4AF37]/30 mx-auto mb-4 animate-spin-slow" />
          <p className="text-lg mb-6">يتطلب الوصول إلى مستشعرات الجهاز لتحديد الاتجاه</p>
          <button onClick={requestPermission} className="px-8 py-4 bg-[#D4AF37] text-[#02130F] rounded-xl font-bold hover:scale-105 transition-transform">
            السماح بالوصول للبوصلة
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center py-8">
          <div className="relative w-72 h-72 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-[#D4AF37]/20" />
            <div className="absolute inset-4 rounded-full border border-[#D4AF37]/10" />
            <motion.div className="absolute inset-0" animate={{ rotate: rotation }} transition={{ type: 'spring', stiffness: 100, damping: 20 }}>
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[#D4AF37] font-bold text-sm">N</div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[#E6DFD3]/50 text-sm">S</div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[#E6DFD3]/50 text-sm">W</div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#E6DFD3]/50 text-sm">E</div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full -mt-4">
                <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-[#D4AF37]" />
              </div>
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#D4AF37] rounded-full" />
          </div>

          <button onClick={getLocation} className="flex items-center gap-2 px-6 py-3 bg-[#0A2E22] border border-[#D4AF37]/30 rounded-xl text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
            <MapPin className="w-5 h-5" /> تحديد موقعي
          </button>

          {qiblaDirection !== null && (
            <div className="mt-6 text-center">
              <p className="text-2xl font-bold text-[#D4AF37]">{Math.round(qiblaDirection)}°</p>
              <p className="text-sm text-[#E6DFD3]/50">اتجاه القبلة من موقعك الحالي</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Zakat Section
function ZakatSection() {
  const [amount, setAmount] = useState('');
  const [zakatAmount, setZakatAmount] = useState(0);
  const [goldPrice, setGoldPrice] = useState(85);

  const calculateZakat = () => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      const nisab = goldPrice * 85;
      if (numAmount >= nisab) setZakatAmount(numAmount * 0.025);
      else setZakatAmount(0);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#D4AF37] flex items-center gap-3">
        <Calculator className="w-8 h-8" /> حاسبة الزكاة
      </h2>

      <div className="p-6 bg-[#0A2E22] border border-[#D4AF37]/20 rounded-2xl space-y-6">
        <div>
          <label className="block text-sm text-[#E6DFD3]/70 mb-2">إجمالي المال (بالدولار)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-[#02130F] border border-[#D4AF37]/20 rounded-xl px-4 py-4 text-[#E6DFD3] text-xl font-bold focus:outline-none focus:border-[#D4AF37]/50"
            placeholder="0.00" />
        </div>
        <div>
          <label className="block text-sm text-[#E6DFD3]/70 mb-2">سعر الذهب للجرام (النصاب)</label>
          <input type="number" value={goldPrice} onChange={(e) => setGoldPrice(parseFloat(e.target.value))}
            className="w-full bg-[#02130F] border border-[#D4AF37]/20 rounded-xl px-4 py-3 text-[#E6DFD3] focus:outline-none focus:border-[#D4AF37]/50" />
          <p className="text-xs text-[#E6DFD3]/40 mt-1">النصاب = 85 جرام ذهب = {(goldPrice * 85).toLocaleString()} دولار</p>
        </div>
        <button onClick={calculateZakat}
          className="w-full py-4 bg-[#D4AF37] text-[#02130F] rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform">
          احسب الزكاة
        </button>

        {zakatAmount > 0 && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="p-6 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl text-center">
            <p className="text-sm text-[#E6DFD3]/70 mb-2">مقدار الزكاة الواجبة</p>
            <p className="text-4xl font-bold text-[#D4AF37]">${zakatAmount.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
            <p className="text-sm text-[#E6DFD3]/50 mt-2">2.5% من إجمالي المال</p>
          </motion.div>
        )}
        {parseFloat(amount) > 0 && zakatAmount === 0 && (
          <div className="p-4 bg-amber-900/20 border border-amber-700/30 rounded-xl text-amber-400 text-center">
            لم يبلغ المال النصاب (85 جرام ذهب)
          </div>
        )}
      </div>
    </div>
  );
}

// AI Assistant Section
function AISection() {
  const [messages, setMessages] = useState<{role: 'user' | 'ai'; text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    // TODO: Replace with actual Gemini API call
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'الحمد لله، أنا مساعدك الإيماني. يمكنني مساعدتك في تفسير الآيات، شرح الأحاديث، وتقديم نصائح روحانية. ما الذي تريد معرفته؟' 
      }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <h2 className="text-3xl font-bold text-[#D4AF37] flex items-center gap-3">
        <MessageCircle className="w-8 h-8" /> مساعد التدبر الإيماني
      </h2>

      <div className="flex-1 overflow-y-auto bg-[#0A2E22] border border-[#D4AF37]/20 rounded-2xl p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 text-[#E6DFD3]/40">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-[#D4AF37]/20" />
            <p>مرحباً! أنا مساعدك الذكي للتدبر الإيماني</p>
            <p className="text-sm mt-2">اسألني عن أي آية، حديث، أو موضوع إيماني</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-[#D4AF37]/20 text-[#E6DFD3] rounded-tr-none' : 'bg-[#02130F] text-[#E6DFD3] border border-[#D4AF37]/20 rounded-tl-none'}`}>
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-end">
            <div className="bg-[#02130F] border border-[#D4AF37]/20 rounded-2xl rounded-tl-none p-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="اسأل عن آية، حديث، أو استشارة إيمانية..."
          className="flex-1 bg-[#0A2E22] border border-[#D4AF37]/20 rounded-xl px-4 py-3 text-[#E6DFD3] placeholder-[#E6DFD3]/30 focus:outline-none focus:border-[#D4AF37]/50" />
        <button onClick={sendMessage} disabled={loading}
          className="px-6 py-3 bg-[#D4AF37] text-[#02130F] rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50">
          إرسال
        </button>
      </div>
    </div>
  );
}

// Settings Section
function SettingsSection({ isDark, setIsDark, toggleLang }: { isDark: boolean; setIsDark: (v: boolean) => void; toggleLang: () => void }) {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#D4AF37] flex items-center gap-3">
        <Star className="w-8 h-8" /> الإعدادات
      </h2>

      <div className="space-y-4">
        <div className="p-6 bg-[#0A2E22] border border-[#D4AF37]/20 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">المظهر واللغة</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#02130F] rounded-xl">
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-[#D4AF37]" />
                <span>اللغة / Language</span>
              </div>
              <button onClick={toggleLang} className="px-4 py-2 bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg font-bold hover:bg-[#D4AF37]/30 transition-colors">
                تبديل
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#02130F] rounded-xl">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-[#D4AF37]" />
                <span>الوضع الليلي</span>
              </div>
              <button onClick={() => setIsDark(!isDark)} className={`w-14 h-7 rounded-full transition-colors relative ${isDark ? 'bg-[#D4AF37]' : 'bg-[#E6DFD3]/20'}`}>
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-[#02130F] transition-all ${isDark ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#0A2E22] border border-[#D4AF37]/20 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">الحساب</h3>
          {user ? (
            <div className="flex items-center gap-4 p-4 bg-[#02130F] rounded-xl">
              <img src={user.photoURL || ''} alt="" className="w-12 h-12 rounded-full border-2 border-[#D4AF37]" />
              <div>
                <p className="font-bold">{user.displayName}</p>
                <p className="text-sm text-[#E6DFD3]/50">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-[#E6DFD3]/50">
              <p>لم يتم تسجيل الدخول</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-[#0A2E22] border border-[#D4AF37]/20 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">عن التطبيق</h3>
          <p className="text-[#E6DFD3]/70 leading-relaxed">
            الذاكرون - منصة إسلامية شاملة تهدف إلى تسهيل ذكر الله وتدبر كتابه في حياة المسلم اليومية.
            صدقة جارية عن جميع المسلمين.
          </p>
          <div className="flex gap-4 mt-4">
            <a href="https://github.com/ali963git/Althakron-son" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#E6DFD3] transition-colors">
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
