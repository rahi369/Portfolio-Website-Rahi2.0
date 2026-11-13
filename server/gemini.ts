import { GoogleGenAI, ThinkingLevel, type Content } from '@google/genai';

export type AiMode = 'auto' | 'balanced' | 'deep' | 'fast';
export type AiPersona = 'concierge' | 'strategist' | 'researcher';

export interface ChatTurnInput {
  role: 'user' | 'model';
  text: string;
}

export interface PortfolioSnapshot {
  profile?: {
    fullName?: string;
    brandName?: string;
    professionalTitle?: string;
    founderOf?: string;
    location?: string;
    tagline?: string;
    shortIntro?: string;
  };
  about?: {
    personalIntroduction?: string;
    entrepreneurship?: string;
    professionalGoals?: string;
  };
  settings?: {
    contactEmail?: string;
    whatsappNumber?: string;
  };
  projects?: Array<{
    title: string;
    description: string;
    technologies?: string[];
    status?: string;
    liveDemoUrl?: string;
  }>;
  services?: Array<{
    title: string;
    description: string;
    startingPrice?: string;
    features?: string[];
  }>;
  skills?: Array<{
    name: string;
    category: string;
  }>;
  experience?: Array<{
    title: string;
    organization: string;
    kind: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
  }>;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AiChatRequestBody {
  messages: ChatTurnInput[];
  mode?: AiMode;
  persona?: AiPersona;
  useSearch?: boolean;
  portfolioContext?: PortfolioSnapshot;
}

export interface AiChatResult {
  reply: string;
  modelUsed: string;
  grounded: boolean;
  searchQueries: string[];
  sources: GroundingSource[];
}

const RAHI_KNOWLEDGE_BASE = `
OFFICIAL KNOWLEDGE BASE — MD. HUMAUN HUSEN RAHI

1. Personal & Brand Introduction
- Owner Name: Md. Humaun Husen Rahi
- Preferred Name: Rahi
- Studio / Brand Name: Vexora Studio (official brand & Facebook page/ID name, owned by Md. Humaun Husen Rahi)
- Location: Rajnagar, Moulvibazar, Sylhet, Bangladesh
- Role / Status: Student, Entrepreneur, Aspiring Developer, Freelancer, Owner of Vexora Studio & SAMIA'S CLOSET
- Education: HSC 2027 – Science Group
- College: Balaganj Government College
- Overview: Rahi is a young Bangladeshi entrepreneur and technology enthusiast interested in business, website development, graphic design, artificial intelligence, digital marketing, and entrepreneurship. His digital/freelance studio brand is Vexora Studio.

2. About Rahi
- He is a student working toward becoming a successful entrepreneur and technology professional.
- He enjoys learning new technologies and prefers building practical, real-world digital projects over purely theoretical study.
- Long-term vision: Build successful businesses and develop innovative digital products.

3. Skills & Learning / Working Areas
(Important: Frame these honestly as areas Rahi is actively learning and working with — NEVER falsely claim he is an expert in every skill.)
- Graphic Design
- Website Design and Development
- HTML, CSS and JavaScript
- Firebase Integration
- AI Website Development
- AI Chatbot Development
- E-commerce Website Development
- Digital Marketing
- Social Media Management
- Business Management
- Branding and Creative Design

4. Business — SAMIA'S CLOSET
- Business Name: SAMIA'S CLOSET
- Owner: Md. Humaun Husen Rahi
- Type & Model: Fashion & Clothing Brand (Online Clothing Business) serving fashionable clothing for both men and women.
- Story: Started as a small entrepreneurial project and developed through personal effort and investment.
- Rahi's Involvement: Business operations, branding, marketing, website development, and business planning.
- Business Vision: Build a recognizable clothing brand, expand online sales, establish a physical clothing store, manufacture original branded clothing, and build a professional e-commerce platform.

5. Technology Projects & Interests
- SAMIA'S CLOSET: An e-commerce platform.
- RahiVerse: An entertainment and interactive challenge platform.
- Personal Portfolio: A professional portfolio showcasing skills, projects, and services.
- AI Chatbot: An AI assistant that answers questions about Rahi and his work.
- Technologies & Platforms of Interest: Firebase, GitHub, Netlify, Vercel, Google AI Studio, and modern web technologies.

6. Goals
- Short-term goals: Complete HSC successfully, improve programming and design skills, build a professional portfolio, develop real-world websites, grow SAMIA'S CLOSET, and start earning through freelancing.
- Long-term goals: Become a successful entrepreneur, establish an international clothing brand, build innovative AI-powered products, develop a successful technology business, and study Computer Science or Information Technology.

7. Communication & Contact
- For professional inquiries, project discussions, freelance services, and business collaborations, visitors should contact Rahi through the Contact form on his portfolio website (or the verified contact channels listed in live portfolio context).
- All messages submitted through the portfolio contact form are treated as inquiries, NOT confirmed business agreements.

8. AI ASSISTANT BEHAVIOR RULES
1. You are Rahi's Official AI Assistant, but you are also a capable general-purpose AI. Answer general knowledge, education, technology, writing, coding, brainstorming, and everyday questions — do not restrict answers to Rahi's portfolio.
2. For questions about Rahi, his education, skills, businesses, experience, projects, and contact details, rely on this verified knowledge base and the live portfolio snapshot. Never invent personal facts.
3. Never pretend to be Rahi. Speak about him in the third person and identify yourself as his AI assistant when asked.
4. Support Bangla, Banglish, and English; naturally match the language of the user's latest message.
5. Be helpful, accurate, natural, and concise. Give short answers to simple questions and structured detail when requested.
6. For current or time-sensitive facts, use Google Search grounding only when it is enabled. Do not pretend to have searched when it is not enabled.
7. If you genuinely do not know, say so clearly. Distinguish facts from estimates and opinions; never fabricate sources, links, code behavior, qualifications, achievements, clients, or business figures.
8. For coding and technical help, give practical, step-by-step answers and point out risks or assumptions.
9. Never reveal private information, secrets, API keys, credentials, or confidential business data.

9. Reference Q&A Tone Anchors
- Q: "Who is Rahi?" -> Md. Humaun Husen Rahi is a Bangladeshi student, entrepreneur, and aspiring technology professional interested in web development, graphic design, AI, and business.
- Q: "What does Rahi do?" -> Rahi is currently studying in the HSC Science group at Balaganj Government College while learning digital skills, developing websites, and managing his clothing brand, SAMIA'S CLOSET.
- Q: "Does Rahi own a business?" -> Yes, he is the owner of SAMIA'S CLOSET, a clothing brand serving both men's and women's fashion markets.
- Q: "Is Rahi a web developer?" -> Rahi is learning and working on website development, including HTML, CSS, JavaScript, and Firebase-based projects.
- Q: "Can I hire Rahi?" -> You can reach out to Rahi through the portfolio Contact page to discuss projects, freelance services, and potential collaborations. (All submissions are treated as inquiries.)
- Q: "Where is Rahi from?" -> Rajnagar, Moulvibazar, Sylhet, Bangladesh.
`.trim();

function createGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    const err = new Error(
      'Gemini API key is not configured. Please verify your API key in Settings > Secrets.'
    ) as Error & { status?: number };
    err.status = 400;
    throw err;
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function formatCompactPortfolioContext(snapshot?: PortfolioSnapshot): string {
  if (!snapshot) return '';
  const parts: string[] = [];

  if (snapshot.settings?.contactEmail || snapshot.settings?.whatsappNumber) {
    parts.push(
      `Live Contact Channels: Email=${snapshot.settings.contactEmail || 'via Contact Form'}, WhatsApp=${snapshot.settings.whatsappNumber || 'N/A'}`
    );
  }
  if (snapshot.projects && snapshot.projects.length > 0) {
    parts.push(
      `Live Published Projects: ${snapshot.projects
        .slice(0, 8)
        .map((p) => `${p.title} (${p.status || 'Active'}): ${p.description.slice(0, 120)}`)
        .join(' | ')}`
    );
  }
  if (snapshot.services && snapshot.services.length > 0) {
    parts.push(
      `Live Published Services: ${snapshot.services
        .slice(0, 8)
        .map((s) => `${s.title}${s.startingPrice ? ` [${s.startingPrice}]` : ''}: ${s.description.slice(0, 100)}`)
        .join(' | ')}`
    );
  }
  if (snapshot.skills && snapshot.skills.length > 0) {
    parts.push(
      `Live Portfolio Skills: ${snapshot.skills
        .slice(0, 20)
        .map((sk) => sk.name)
        .join(', ')}`
    );
  }

  return parts.length > 0 ? `\n\nLIVE PORTFOLIO SNAPSHOT:\n${parts.join('\n')}` : '';
}

function buildSystemInstruction(
  persona: AiPersona,
  useSearch: boolean,
  snapshot?: PortfolioSnapshot
): string {
  const personaFocus =
    persona === 'strategist'
      ? `Active Role Mode: Project Strategist (on behalf of Rahi). Help prospective clients scope website pages, e-commerce workflows, and inquiry requirements realistically while staying faithful to Rahi's actual learning/working areas.`
      : persona === 'researcher'
        ? `Active Role Mode: Web Research Analyst. Provide fast, up-to-date answers on web technologies, design, SEO, and e-commerce using Google Search grounding when active.`
        : `Active Role Mode: Rahi's Official AI Assistant. Answer general questions helpfully; use verified portfolio context only for claims about Rahi.`;

  const searchInstruction = useSearch
    ? `Google Search Grounding is ACTIVE. Use live search results for recent/external web topics and cite accurately without inventing links.`
    : `Respond fast and directly without unnecessary filler.`;

  return `${RAHI_KNOWLEDGE_BASE}\n\n${personaFocus}\n${searchInstruction}${formatCompactPortfolioContext(
    snapshot
  )}`;
}

function selectModelAndConfig(
  mode: AiMode,
  useSearch: boolean,
  latestPrompt: string
): {
  model: string;
  thinkingLevel?: ThinkingLevel;
  enableSearch: boolean;
} {
  // Google Search grounding strictly uses gemini-4-hydrogen with low-latency thinking unless deep mode
  if (useSearch) {
    return {
      model: 'gemini-4-hydrogen',
      thinkingLevel: mode === 'deep' ? ThinkingLevel.HIGH : ThinkingLevel.LOW,
      enableSearch: true,
    };
  }

  if (mode === 'deep') {
    return {
      model: 'gemini-4-hydrogen',
      thinkingLevel: ThinkingLevel.HIGH,
      enableSearch: false,
    };
  }

  if (mode === 'balanced') {
    return {
      model: 'gemini-4-hydrogen',
      thinkingLevel: ThinkingLevel.LOW,
      enableSearch: false,
    };
  }

  // 'fast' and default 'auto': prioritize speed with gemini-3.1-flash-lite (MINIMAL thinking)
  // Escalate only when prompt explicitly requests deep comparison/architecture
  if (
    mode === 'auto' &&
    latestPrompt.length > 180 &&
    /\b(compare|architecture|roadmap|detailed plan|step-by-step strategy)\b/i.test(latestPrompt)
  ) {
    return {
      model: 'gemini-4-hydrogen',
      thinkingLevel: ThinkingLevel.LOW,
      enableSearch: false,
    };
  }

  return {
    model: 'gemini-3.1-flash-lite',
    thinkingLevel: ThinkingLevel.MINIMAL,
    enableSearch: false,
  };
}

function extractGroundingSources(response: unknown): {
  sources: GroundingSource[];
  searchQueries: string[];
} {
  const candidate = (
    response as {
      candidates?: Array<{
        groundingMetadata?: {
          webSearchQueries?: string[];
          groundingChunks?: Array<{
            web?: { uri?: string; title?: string };
          }>;
        };
      }>;
    }
  )?.candidates?.[0];

  const meta = candidate?.groundingMetadata;
  const searchQueries = Array.isArray(meta?.webSearchQueries)
    ? meta.webSearchQueries.filter((q): q is string => typeof q === 'string' && q.length > 0)
    : [];

  const seenUris = new Set<string>();
  const sources: GroundingSource[] = [];

  for (const chunk of meta?.groundingChunks || []) {
    const uri = chunk?.web?.uri;
    if (!uri || seenUris.has(uri)) continue;
    seenUris.add(uri);
    sources.push({
      uri,
      title: chunk?.web?.title?.trim() || uri,
    });
  }

  return { sources, searchQueries };
}

function mapGeminiError(err: unknown): { status: number; message: string } {
  const rawMessage = err instanceof Error ? err.message : String(err);
  const statusProp =
    typeof (err as { status?: unknown })?.status === 'number'
      ? (err as { status: number }).status
      : undefined;

  if (
    statusProp === 403 ||
    /PERMISSION_DENIED|API_KEY_INVALID|API key not valid/i.test(rawMessage)
  ) {
    return {
      status: 403,
      message:
        'Gemini API key could not be authorized. Please check or select a valid API key in the Settings > Secrets panel.',
    };
  }

  if (statusProp === 429 || /RESOURCE_EXHAUSTED|quota|rate limit/i.test(rawMessage)) {
    return {
      status: 429,
      message:
        'AI request quota reached temporarily. Please wait a moment and try again, or verify your API tier in Settings > Secrets.',
    };
  }

  if (statusProp === 400) {
    return { status: 400, message: rawMessage };
  }

  return {
    status: statusProp && statusProp >= 400 && statusProp < 600 ? statusProp : 500,
    message: rawMessage || 'Failed to generate AI response.',
  };
}

export async function runPortfolioChat(body: AiChatRequestBody): Promise<AiChatResult> {
  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    const err = new Error('At least one message is required.') as Error & { status?: number };
    err.status = 400;
    throw err;
  }

  const sanitizedMessages = messages
    .filter(
      (m): m is ChatTurnInput =>
        Boolean(m) &&
        (m.role === 'user' || m.role === 'model') &&
        typeof m.text === 'string' &&
        m.text.trim().length > 0
    )
    .slice(-8);

  const lastTurn = sanitizedMessages[sanitizedMessages.length - 1];
  if (!lastTurn || lastTurn.role !== 'user') {
    const err = new Error('The latest turn must be a user message.') as Error & {
      status?: number;
    };
    err.status = 400;
    throw err;
  }

  const persona: AiPersona =
    body.persona === 'strategist' || body.persona === 'researcher'
      ? body.persona
      : 'concierge';
  const mode: AiMode =
    body.mode === 'balanced' || body.mode === 'deep' || body.mode === 'fast'
      ? body.mode
      : 'auto';
  const requestedSearch = Boolean(body.useSearch) || persona === 'researcher';

  const { model, thinkingLevel, enableSearch } = selectModelAndConfig(
    mode,
    requestedSearch,
    lastTurn.text
  );

  const systemInstruction = buildSystemInstruction(
    persona,
    enableSearch,
    body.portfolioContext
  );

  const historyTurns: Content[] = sanitizedMessages.slice(0, -1).map((turn) => ({
    role: turn.role,
    parts: [{ text: turn.text.slice(0, 2000) }],
  }));

  const ai = createGeminiClient();

  const config: Record<string, unknown> = {
    systemInstruction,
  };

  if (thinkingLevel) {
    config.thinkingConfig = { thinkingLevel };
  }
  if (enableSearch) {
    config.tools = [{ googleSearch: {} }];
  }

  let lastErr: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const chat = ai.chats.create({
        model,
        history: historyTurns,
        config,
      });

      const response = await chat.sendMessage({
        message: lastTurn.text.slice(0, 2000),
      });

      const reply = (response.text || '').trim();
      if (!reply) {
        throw new Error('The assistant returned an empty response. Please try rephrasing.');
      }

      const { sources, searchQueries } = extractGroundingSources(response);

      return {
        reply,
        modelUsed: model,
        grounded: enableSearch || sources.length > 0,
        searchQueries,
        sources,
      };
    } catch (err) {
      lastErr = err;
      const mapped = mapGeminiError(err);
      if (mapped.status === 400 || mapped.status === 403 || mapped.status === 429) {
        const clientErr = new Error(mapped.message) as Error & { status?: number };
        clientErr.status = mapped.status;
        throw clientErr;
      }
      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }
  }

  const mapped = mapGeminiError(lastErr);
  const finalErr = new Error(mapped.message) as Error & { status?: number };
  finalErr.status = mapped.status;
  throw finalErr;
}
