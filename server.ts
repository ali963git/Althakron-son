import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());

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

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.5-pro'];
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

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Set headers for Server-Sent Events (SSE)
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.5-pro'];
      let lastError: any = null;
      let streamSuccess = false;

      for (const modelName of modelsToTry) {
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

          let chunksWritten = 0;
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
          if (res.writableEnded) {
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
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
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

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}/`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
