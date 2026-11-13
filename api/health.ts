import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(
    JSON.stringify({
      ok: true,
      service: 'vexora-studio-portfolio',
      timestamp: new Date().toISOString(),
    })
  );
}
