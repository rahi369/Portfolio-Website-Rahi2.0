import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import firebaseAppletConfig from './firebase-applet-config.json' with { type: 'json' };
import { type AiChatRequestBody, runPortfolioChat } from './server/gemini.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';
const ADMIN_EMAIL = 'rahihumaun369@gmail.com';

const uploadsDir = path.resolve(__dirname, 'public', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

// Load Firebase Web API key from env or provisioned firebase-applet-config.json for server-side ID token verification
function getFirebaseApiKey(): string {
  return process.env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey || '';
}

async function verifyAdminBearerToken(authHeader?: string): Promise<{ ok: boolean; reason?: string }> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { ok: false, reason: 'Missing Authorization header.' };
  }
  const idToken = authHeader.slice('Bearer '.length).trim();
  const apiKey = getFirebaseApiKey();
  if (!apiKey) {
    return { ok: false, reason: 'Firebase API key unavailable on server.' };
  }

  try {
    const resp = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!resp.ok) {
      return { ok: false, reason: 'Invalid or expired authentication token.' };
    }
    const data = (await resp.json()) as {
      users?: Array<{ email?: string; emailVerified?: boolean }>;
    };
    const user = data.users?.[0];
    if (!user || !user.emailVerified || user.email?.toLowerCase() !== ADMIN_EMAIL) {
      return { ok: false, reason: 'Unauthorized: verified administrator required.' };
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: 'Token verification failed.' };
  }
}

// Sliding-window rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function createRateLimiter(windowMs: number, max: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const key = `${req.path}:${req.ip || 'unknown'}`;
    const now = Date.now();
    const entry = rateLimitMap.get(key);
    if (!entry || entry.resetAt <= now) {
      rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (entry.count >= max) {
      return res.status(429).json({
        error: 'Too many requests. Please wait a moment before trying again.',
      });
    }
    entry.count += 1;
    return next();
  };
}

const STATIC_ROUTES = [
  '/',
  '/about',
  '/gallery',
  '/projects',
  '/skills',
  '/experience',
  '/services',
  '/assistant',
  '/contact',
];

const ALLOWED_MIME_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '16mb' }));

  // Security headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  // Always serve uploaded assets directly
  app.use('/uploads', express.static(uploadsDir, { maxAge: '30d' }));

  app.get('/robots.txt', (req, res) => {
    const baseUrl = (
      process.env.APP_URL || `${req.protocol}://${req.get('host')}`
    ).replace(/\/$/, '');
    res.type('text/plain').send(
      [
        'User-agent: *',
        'Allow: /',
        'Disallow: /admin',
        'Disallow: /admin/',
        `Sitemap: ${baseUrl}/sitemap.xml`,
      ].join('\n')
    );
  });

  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = (
      process.env.APP_URL || `${req.protocol}://${req.get('host')}`
    ).replace(/\/$/, '');
    const today = new Date().toISOString().split('T')[0];

    const urls = STATIC_ROUTES.map(
      (route) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route === '/' || route === '/gallery' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`
    ).join('\n');

    res.type('application/xml').send(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
    );
  });

  app.get('/api/health', createRateLimiter(60_000, 120), (_req, res) => {
    res.json({ ok: true, service: 'rahi-portfolio', timestamp: new Date().toISOString() });
  });

  // Server-side Gemini Multi-Turn Chat & Google Search Grounding Endpoint
  app.post('/api/ai/chat', createRateLimiter(60_000, 30), async (req, res) => {
    try {
      const body = (req.body || {}) as AiChatRequestBody;
      const result = await runPortfolioChat(body);
      return res.json(result);
    } catch (err) {
      const status =
        typeof (err as { status?: unknown })?.status === 'number'
          ? (err as { status: number }).status
          : 500;
      const message =
        err instanceof Error ? err.message : 'Unable to process AI request.';
      return res.status(status).json({ error: message });
    }
  });

  // Authenticated Admin Upload Endpoint (Images + CV PDF)
  app.post('/api/upload', createRateLimiter(60_000, 40), async (req, res) => {
    const authCheck = await verifyAdminBearerToken(req.headers.authorization);
    if (!authCheck.ok) {
      return res.status(401).json({ error: authCheck.reason || 'Unauthorized' });
    }

    const { fileName, mimeType, dataBase64 } = req.body as {
      fileName?: string;
      mimeType?: string;
      dataBase64?: string;
    };

    if (!mimeType || !ALLOWED_MIME_EXT[mimeType]) {
      return res.status(400).json({
        error: 'Unsupported file type. Allowed formats: PNG, JPG, WEBP, and PDF.',
      });
    }
    if (!dataBase64 || typeof dataBase64 !== 'string') {
      return res.status(400).json({ error: 'Missing file payload.' });
    }

    const cleanBase64 = dataBase64.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    const maxBytes = mimeType === 'application/pdf' ? 10 * 1024 * 1024 : 6 * 1024 * 1024;
    if (buffer.length === 0 || buffer.length > maxBytes) {
      return res.status(400).json({
        error: `File size must be under ${mimeType === 'application/pdf' ? '10MB' : '6MB'}.`,
      });
    }

    const ext = ALLOWED_MIME_EXT[mimeType];
    const baseSafe = (fileName || 'asset')
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48);
    const outName = `${baseSafe || 'upload'}-${Date.now()}.${ext}`;
    const targetPath = path.join(uploadsDir, outName);

    fs.writeFileSync(targetPath, buffer);
    return res.json({
      url: `/uploads/${outName}`,
      fileName: outName,
      bytes: buffer.length,
    });
  });

  // Ensure API errors (e.g. PayloadTooLargeError / invalid JSON) always return JSON
  app.use(
    '/api',
    (
      err: { status?: number; message?: string },
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      const status = typeof err?.status === 'number' ? err.status : 500;
      return res.status(status).json({
        error: err?.message || 'API request failed.',
      });
    }
  );

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir, { maxAge: '7d' }));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RAHI Portfolio server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
