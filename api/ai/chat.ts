import type { IncomingMessage, ServerResponse } from 'http';
import { type AiChatRequestBody, runPortfolioChat } from '../../server/gemini.ts';

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const preParsed = (req as IncomingMessage & { body?: unknown }).body;
  if (preParsed !== undefined) {
    if (typeof preParsed === 'string') {
      try {
        return JSON.parse(preParsed);
      } catch {
        return {};
      }
    }
    return preParsed;
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};
  return JSON.parse(raw);
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed. Use POST /api/ai/chat.' }));
    return;
  }

  try {
    const body = (await readJsonBody(req)) as AiChatRequestBody;
    const result = await runPortfolioChat(body || {});
    res.statusCode = 200;
    res.end(JSON.stringify(result));
  } catch (err) {
    const status =
      typeof (err as { status?: unknown })?.status === 'number'
        ? (err as { status: number }).status
        : 500;
    const message =
      err instanceof Error ? err.message : 'Unable to process AI request.';
    res.statusCode = status;
    res.end(JSON.stringify({ error: message }));
  }
}
