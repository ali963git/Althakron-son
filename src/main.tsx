import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './AuthProvider';
import { registerSW } from 'virtual:pwa-register';
import './index.css';
import './i18n';

registerSW({ 
  immediate: true,
  onNeedRefresh() {
    if (confirm('تحديث جديد متاح! هل تريد تحديث التطبيق الآن؟')) {
      window.location.reload();
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
