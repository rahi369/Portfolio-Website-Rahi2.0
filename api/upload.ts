import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed.' }));
    return;
  }

  // Serverless environments do not persist local disk uploads; tell the client
  // to fall back to Firebase Storage or Cloudinary cleanly without hanging.
  res.statusCode = 404;
  res.end(
    JSON.stringify({
      error: 'Local disk upload is disabled on serverless hosting; falling back to cloud storage.',
    })
  );
}
