import { useState } from 'react';
import { X, Copy, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ShareAyahModalProps {
  ayah: string;
  surah: string;
  ayahNumber: number;
  onClose: () => void;
}

export function ShareAyahModal({ ayah, surah, ayahNumber, onClose }: ShareAyahModalProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${ayah} [${surah}: ${ayahNumber}]`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = () => {
    if (navigator.share) {
      navigator.share({
        title: `آية من ${surah}`,
        text: `${ayah} [${surah}: ${ayahNumber}]`,
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.9 }} animate={{ scale: 1 }}
        className="bg-[#0A2E22] border border-[#D4AF37]/30 rounded-2xl p-6 max-w-md w-full"
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#D4AF37]">مشاركة الآية</h3>
          <button onClick={onClose} className="p-1 hover:bg-[#02130F] rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 bg-[#02130F] rounded-xl mb-4 font-amiri text-lg leading-relaxed text-center">
          {ayah}
          <p className="text-sm text-[#D4AF37] mt-2">سورة {surah} - آية {ayahNumber}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={copyToClipboard} className="flex items-center justify-center gap-2 py-3 bg-[#D4AF37]/20 rounded-xl text-[#D4AF37] hover:bg-[#D4AF37]/30">
            <Copy className="w-4 h-4" /> {copied ? 'تم النسخ' : 'نسخ'}
          </button>
          <button onClick={shareText} className="flex items-center justify-center gap-2 py-3 bg-[#D4AF37]/20 rounded-xl text-[#D4AF37] hover:bg-[#D4AF37]/30">
            <Share2 className="w-4 h-4" /> مشاركة
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
