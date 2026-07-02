import express from 'express';
import compression from 'compression';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import webpush from 'web-push';
import fs from 'fs';

dotenv.config();

// Initialize VAPID Keys
const VAPID_KEYS_FILE = path.join(process.cwd(), 'vapid-keys.json');
let vapidKeys = { publicKey: '', privateKey: '' };

if (fs.existsSync(VAPID_KEYS_FILE)) {
  try {
    vapidKeys = JSON.parse(fs.readFileSync(VAPID_KEYS_FILE, 'utf8'));
  } catch (err) {
    console.error('Error reading VAPID keys:', err);
  }
}

if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
  vapidKeys = webpush.generateVAPIDKeys();
  try {
    fs.writeFileSync(VAPID_KEYS_FILE, JSON.stringify(vapidKeys, null, 2));
    console.log('[Push Server] Generated new VAPID keys.');
  } catch (err) {
    console.error('Error saving VAPID keys:', err);
  }
}

webpush.setVapidDetails(
  'mailto:ali977347@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Manage subscriptions
const SUBSCRIPTIONS_FILE = path.join(process.cwd(), 'subscriptions.json');
interface SubscriptionData {
  subscription: webpush.PushSubscription;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
  timezone: string;
  createdAt: string;
  lastNotified?: Record<string, string>;
}
let subscriptions: SubscriptionData[] = [];

if (fs.existsSync(SUBSCRIPTIONS_FILE)) {
  try {
    subscriptions = JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf8'));
    console.log(`[Push Server] Loaded ${subscriptions.length} subscriptions.`);
  } catch (err) {
    console.error('Error reading subscriptions file:', err);
  }
}

function saveSubscriptions() {
  try {
    fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2));
  } catch (err) {
    console.error('Error saving subscriptions file:', err);
  }
}

// Prayer times calculation matching client
const DEFAULT_LAT = 33.5138;
const DEFAULT_LNG = 36.2765;

function computePrayerTimesForCoords(lat: number, lng: number) {
  const latDiff = lat - DEFAULT_LAT;
  const lngDiff = lng - DEFAULT_LNG;
  const timeShiftMinutes = -lngDiff * 4;

  const fajrShift = -latDiff * 2.5 + timeShiftMinutes;
  const sunriseShift = -latDiff * 1.5 + timeShiftMinutes;
  const dhuhrShift = timeShiftMinutes;
  const asrShift = latDiff * 0.8 + timeShiftMinutes;
  const maghribShift = latDiff * 1.8 + timeShiftMinutes;
  const ishaShift = latDiff * 2.8 + timeShiftMinutes;

  const addMinutesToTime = (timeStr: string, minutes: number) => {
    const [h, m] = timeStr.split(':').map(Number);
    let totalMinutes = h * 60 + m + Math.round(minutes);
    totalMinutes = (totalMinutes + 1440) % 1440;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  return {
    fajr: addMinutesToTime('04:02', fajrShift),
    sunrise: addMinutesToTime('05:35', sunriseShift),
    dhuhr: addMinutesToTime('12:38', dhuhrShift),
    asr: addMinutesToTime('16:20', asrShift),
    maghrib: addMinutesToTime('19:42', maghribShift),
    isha: addMinutesToTime('21:15', ishaShift)
  };
}

const PRAYER_NAMES_AR: Record<string, string> = {
  fajr: 'صلاة الفجر',
  sunrise: 'شروق الشمس',
  dhuhr: 'صلاة الظهر',
  asr: 'صلاة العصر',
  maghrib: 'صلاة المغرب',
  isha: 'صلاة العشاء'
};

const PRAYER_MESSAGES: Record<string, string> = {
  fajr: 'حان الآن موعد أذان الفجر 🕌. الصلاة خير من النوم، تقبل الله طاعتك.',
  sunrise: 'أشرقت الشمس ☀️. تذكير بصلاة الضحى والبدء بذكر الله تعالى.',
  dhuhr: 'حان الآن موعد أذان الظهر 🕌. تقبل الله طاعتك وبارك في يومك.',
  asr: 'حان الآن موعد أذان العصر 🕌. حافظوا على الصلوات والصلاة الوسطى.',
  maghrib: 'حان الآن موعد أذان المغرب 🕌. تقبل الله صيام الصائمين وصلاتكم جميعاً.',
  isha: 'حان الآن موعد أذان العشاء 🕌. تقبل الله صلاتكم وقيامكم.'
};

async function sendPush(subscription: webpush.PushSubscription, title: string, body: string) {
  const payload = JSON.stringify({
    title,
    body,
    icon: '/icon.png',
    badge: '/badge.png',
    vibrate: [200, 100, 200, 100, 200],
    url: '/'
  });

  try {
    await webpush.sendNotification(subscription, payload, {
      TTL: 60,
      urgency: 'high'
    });
    console.log(`[Push Scheduler] Push sent successfully to ${subscription.endpoint}`);
  } catch (err: any) {
    console.error(`[Push Scheduler] Failed to send push to ${subscription.endpoint}:`, err.message, err.statusCode ? `(Status: ${err.statusCode})` : '');
    if (err.statusCode === 410 || err.statusCode === 404) {
      console.log(`[Push Scheduler] Removing expired/inactive subscription: ${subscription.endpoint}`);
      subscriptions = subscriptions.filter(sub => sub.subscription.endpoint !== subscription.endpoint);
      saveSubscriptions();
    }
  }
}

function startPushNotificationScheduler() {
  console.log('[Push Scheduler] Background prayer time checker started.');
  
  setInterval(async () => {
    const nowUtc = new Date();
    
    for (const sub of subscriptions) {
      try {
        const offset = sub.timezoneOffset; // in minutes
        const localTime = new Date(nowUtc.getTime() - (offset * 60 * 1000));
        const localHour = localTime.getUTCHours();
        const localMinute = localTime.getUTCMinutes();
        const localTimeStr = `${String(localHour).padStart(2, '0')}:${String(localMinute).padStart(2, '0')}`;
        
        const year = localTime.getUTCFullYear();
        const month = String(localTime.getUTCMonth() + 1).padStart(2, '0');
        const day = String(localTime.getUTCDate()).padStart(2, '0');
        const todayDateStr = `${year}-${month}-${day}`;
        
        const times = computePrayerTimesForCoords(sub.latitude, sub.longitude);
        
        for (const [prayerKey, prayerTime] of Object.entries(times)) {
          // 1. Exact Prayer Alert
          if (localTimeStr === prayerTime) {
            sub.lastNotified = sub.lastNotified || {};
            const notifyKey = `${prayerKey}-exact`;
            if (sub.lastNotified[notifyKey] !== todayDateStr) {
              sub.lastNotified[notifyKey] = todayDateStr;
              saveSubscriptions();
              
              const title = `🕌 ${PRAYER_NAMES_AR[prayerKey]}`;
              const message = PRAYER_MESSAGES[prayerKey];
              await sendPush(sub.subscription, title, message);
            }
          }
          
          // 2. 10 Minutes Before Alert
          const [ph, pm] = prayerTime.split(':').map(Number);
          let totalPrayerMins = ph * 60 + pm;
          let beforeMins = (totalPrayerMins - 10 + 1440) % 1440;
          const beforeHour = Math.floor(beforeMins / 60);
          const beforeMinute = beforeMins % 60;
          const beforeTimeStr = `${String(beforeHour).padStart(2, '0')}:${String(beforeMinute).padStart(2, '0')}`;
          
          if (localTimeStr === beforeTimeStr) {
            sub.lastNotified = sub.lastNotified || {};
            const notifyKey = `${prayerKey}-before`;
            if (sub.lastNotified[notifyKey] !== todayDateStr) {
              sub.lastNotified[notifyKey] = todayDateStr;
              saveSubscriptions();
              
              const title = `⏰ اقتربت ${PRAYER_NAMES_AR[prayerKey]}`;
              const message = `بقي 10 دقائق على موعد ${PRAYER_NAMES_AR[prayerKey]} 🕌. تهيأ وتوضأ لتدرك الصلاة في وقتها.`;
              await sendPush(sub.subscription, title, message);
            }
          }
        }
      } catch (err) {
        console.error('[Push Scheduler] Error checking subscription:', err);
      }
    }
  }, 30000); // Check every 30 seconds
}

async function startServer() {
  const app = express();
  app.use(compression());
  app.use(express.json());

  // Web Push Configuration endpoint
  app.get('/api/push/config', (req, res) => {
    res.json({ publicKey: vapidKeys.publicKey });
  });

  // Quran Audio Proxy with range/streaming support to ensure absolute reliability on all devices
  app.get('/api/quran/audio', async (req, res) => {
    const audioUrl = req.query.url as string;
    if (!audioUrl) {
      res.status(400).send('URL is required');
      return;
    }

    try {
      // Security check: only allow safe audio domains
      if (!audioUrl.startsWith('https://') && !audioUrl.startsWith('http://')) {
        res.status(400).send('Invalid protocol');
        return;
      }
      const parsedUrl = new URL(audioUrl);
      if (!parsedUrl.hostname.endsWith('mp3quran.net') && 
          !parsedUrl.hostname.endsWith('quranicaudio.com') && 
          !parsedUrl.hostname.endsWith('tvquran.com')) {
        res.status(403).send('Forbidden source domain');
        return;
      }

      // Forward browser Range requests to the source server to save memory & support fast seeking
      const rangeHeader = req.headers.range || req.headers.Range;
      const headers: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*'
      };
      if (rangeHeader) {
        headers['Range'] = Array.isArray(rangeHeader) ? rangeHeader[0] : String(rangeHeader);
      }

      // Fetch the audio stream from the source
      const response = await fetch(audioUrl, { headers, redirect: 'follow' });

      console.log(`[Audio Proxy] Source: ${audioUrl}, Status: ${response.status}, Content-Type: ${response.headers.get('content-type')}`);

      if (!response.ok && response.status !== 206 && response.status !== 416) {
        throw new Error(`Failed to fetch audio stream: ${response.status} ${response.statusText}`);
      }

      // Match response status (e.g. 206 Partial Content or 200 OK)
      res.status(response.status);

      // Propagate crucial headers for chunked media streaming
      const contentType = response.headers.get('content-type');
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      }
      
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        res.setHeader('Content-Length', contentLength);
      }

      const contentRange = response.headers.get('content-range');
      if (contentRange) {
        res.setHeader('Content-Range', contentRange);
      }

      const acceptRanges = response.headers.get('accept-ranges');
      if (acceptRanges) {
        res.setHeader('Accept-Ranges', acceptRanges);
      } else {
        res.setHeader('Accept-Ranges', 'bytes');
      }

      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day

      if (response.body) {
        const { Readable } = await import('stream');
        const nodeStream = Readable.fromWeb(response.body as any);
        nodeStream.pipe(res);
        res.on('close', () => {
          nodeStream.destroy();
        });
      } else {
        res.status(500).send('Empty stream received');
      }
    } catch (err: any) {
      console.error('[Quran Proxy Error] Failed to proxy:', err.message);
      // Fallback: redirect the client to the direct URL if proxying encounters an error
      res.redirect(302, audioUrl);
    }
  });

  // Dynamic Quran Reciters cache and lookup
  let cachedReciters: any = null;
  let cacheExpiry = 0;
  let pendingRecitersFetch: Promise<any> | null = null;

  app.get('/api/quran/reciters', async (req, res) => {
    const now = Date.now();
    // Cache for 6 hours
    if (cachedReciters && now < cacheExpiry) {
      res.json(cachedReciters);
      return;
    }

    if (pendingRecitersFetch) {
      try {
        const data = await pendingRecitersFetch;
        res.json(data);
      } catch (err) {
        if (cachedReciters) {
          res.json(cachedReciters);
        } else {
          res.status(500).json({ error: 'Failed to load reciters list' });
        }
      }
      return;
    }

    pendingRecitersFetch = (async () => {
      try {
        const apiResponse = await fetch('https://mp3quran.net/api/v3/reciters?language=ar');
        if (apiResponse.ok) {
          const data = await apiResponse.json();
          cachedReciters = data;
          cacheExpiry = Date.now() + 6 * 60 * 60 * 1000; // 6 hours
          return data;
        } else {
          throw new Error(`Mp3Quran API returned ${apiResponse.status}`);
        }
      } catch (err: any) {
        console.error('[Quran Reciters API] Failed to fetch live reciters, using cached/empty', err.message);
        if (cachedReciters) return cachedReciters;
        return { reciters: [] };
      } finally {
        pendingRecitersFetch = null;
      }
    })();

    try {
      const data = await pendingRecitersFetch;
      res.json(data);
    } catch (err: any) {
      if (cachedReciters) {
        res.json(cachedReciters);
      } else {
        res.status(500).json({ error: err.message || 'Internal Server Error' });
      }
    }
  });

  // Subscribe endpoint
  app.post('/api/push/subscribe', (req, res) => {
    const { subscription, latitude, longitude, timezoneOffset, timezone } = req.body;
    if (!subscription || !subscription.endpoint) {
       res.status(400).json({ error: 'Subscription data is required' });
       return;
    }

    const index = subscriptions.findIndex(sub => sub.subscription.endpoint === subscription.endpoint);
    const subData: SubscriptionData = {
      subscription,
      latitude: Number(latitude) || 33.5138,
      longitude: Number(longitude) || 36.2765,
      timezoneOffset: Number(timezoneOffset) || 0,
      timezone: timezone || 'UTC',
      createdAt: new Date().toISOString(),
      lastNotified: index > -1 ? subscriptions[index].lastNotified : {}
    };

    if (index > -1) {
      subscriptions[index] = subData;
    } else {
      subscriptions.push(subData);
    }

    saveSubscriptions();
    console.log(`[Push Server] Subscription updated/added. Endpoint: ${subscription.endpoint.substring(0, 40)}...`);
    res.json({ success: true });
  });

  // Unsubscribe endpoint
  app.post('/api/push/unsubscribe', (req, res) => {
    const { subscription } = req.body;
    if (!subscription || !subscription.endpoint) {
       res.status(400).json({ error: 'Subscription endpoint is required' });
       return;
    }

    subscriptions = subscriptions.filter(sub => sub.subscription.endpoint !== subscription.endpoint);
    saveSubscriptions();
    console.log(`[Push Server] Subscription removed. Endpoint: ${subscription.endpoint.substring(0, 40)}...`);
    res.json({ success: true });
  });

  // Server-side Gemini API Proxy
  app.post('/api/gemini', async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      if (!prompt) {
         res.status(400).json({ error: 'Prompt is required' });
         return;
      }

      // Check if user provided their own API key in headers, fallback to environment variable
      const clientApiKey = req.headers['x-gemini-key'] as string;
      const apiKey = (clientApiKey && clientApiKey.trim()) ? clientApiKey.trim() : process.env.GEMINI_API_KEY;

      console.log('[Gemini Proxy] Request received. Client key length:', clientApiKey?.length || 0, 'Fallback key exists:', !!process.env.GEMINI_API_KEY);

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
         res.status(400).json({ 
          error: 'مفتاح Gemini API غير متوفر. يرجى توفير مفتاح خاص بك في واجهة المستخدم (حقل مفتاح API) أو تكوينه في لوحة التحكم (Settings > Secrets) كـ GEMINI_API_KEY.' 
        });
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      const modelsToTry = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.5-pro'];
      let lastError: any = null;
      let responseText = '';
      let success = false;

      for (const modelName of modelsToTry) {
        try {
          console.log(`[Gemini Proxy] Attempting text generation with model: ${modelName}`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction: systemInstruction || 'أنت مساعد إسلامي ومستشار تدبري خبير تساعد المسلمين في تدبر الآيات وفهم معاني القرآن العظيم.',
              temperature: 0.7,
            }
          });
          responseText = response.text || '';
          success = true;
          console.log(`[Gemini Proxy] Success with model: ${modelName}`);
          break;
        } catch (err: any) {
          console.warn(`[Gemini Proxy] Failed with model ${modelName}:`, err.message || err);
          lastError = err;
        }
      }

      if (!success) {
        throw lastError || new Error('All models failed to respond');
      }

      res.json({ text: responseText });
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // Server-side Gemini API Streaming Proxy
  app.post('/api/gemini/stream', async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      if (!prompt) {
         res.status(400).json({ error: 'Prompt is required' });
         return;
      }

      // Check if user provided their own API key in headers, fallback to environment variable
      const clientApiKey = req.headers['x-gemini-key'] as string;
      const apiKey = (clientApiKey && clientApiKey.trim()) ? clientApiKey.trim() : process.env.GEMINI_API_KEY;

      console.log('[Gemini Proxy Stream] Request received. Client key length:', clientApiKey?.length || 0, 'Fallback key exists:', !!process.env.GEMINI_API_KEY);

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
         res.status(400).json({ 
          error: 'مفتاح Gemini API غير متوفر. يرجى توفير مفتاح خاص بك في واجهة المستخدم (حقل مفتاح API) أو تكوينه في لوحة التحكم (Settings > Secrets) كـ GEMINI_API_KEY.' 
        });
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      // Set headers for Server-Sent Events (SSE)
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const modelsToTry = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.5-pro'];
      let lastError: any = null;
      let streamSuccess = false;

      for (const modelName of modelsToTry) {
        let chunksWritten = 0;
        try {
          console.log(`[Gemini Proxy Stream] Attempting stream with model: ${modelName}`);
          const responseStream = await ai.models.generateContentStream({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction: systemInstruction || 'أنت مساعد إسلامي ومستشار تدبري خبير تساعد المسلمين في تدبر الآيات وفهم معاني القرآن العظيم.',
              temperature: 0.7,
            }
          });

          for await (const chunk of responseStream) {
            if (chunk.text) {
              res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
              chunksWritten++;
            }
          }
          res.write('data: [DONE]\n\n');
          res.end();
          streamSuccess = true;
          console.log(`[Gemini Proxy Stream] Success with model: ${modelName}`);
          break;
        } catch (err: any) {
          console.warn(`[Gemini Proxy Stream] Failed with model ${modelName}:`, err.message || err);
          lastError = err;
          // If we already wrote some chunks, we shouldn't attempt to start over with another model
          // as it would produce mixed or duplicated content stream.
          if (chunksWritten > 0 || res.writableEnded) {
            streamSuccess = true;
            break;
          }
        }
      }

      if (!streamSuccess) {
        console.error('[Gemini Proxy Stream] All models failed:', lastError);
        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify({ error: lastError?.message || 'جميع نماذج الذكاء الاصطناعي ممتلئة بالطلبات حالياً. يرجى المحاولة بعد قليل.' })}\n\n`);
          res.end();
        }
      }
    } catch (error: any) {
      console.error('Error setting up stream:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // Serve static assets or use Vite middleware
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // In development mode, load Vite dynamically
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  // Start background push notifications scheduler
  startPushNotificationScheduler();

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}/`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
