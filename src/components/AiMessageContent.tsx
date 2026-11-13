import React from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import { AiGroundSource } from '../types';

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-[#18221D] dark:text-[#F4F1EA]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 text-[12px] font-mono-tabular bg-[#F2EFE7] dark:bg-[#141F1A] border border-[#DFD5C3] dark:border-[#24352C] rounded text-[#1B4332] dark:text-[#6EC4A7]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function getHostname(uri: string): string {
  try {
    return new URL(uri).hostname.replace(/^www\./, '');
  } catch {
    return 'web';
  }
}

export function AiMessageContent({
  text,
  sources,
}: {
  text: string;
  sources?: AiGroundSource[];
}) {
  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (keyPrefix: string) => {
    if (listItems.length === 0) return;
    blocks.push(
      <ul key={keyPrefix} className="space-y-1.5 pl-4 list-disc marker:text-[#2D6A6A] dark:marker:text-[#6EC4A7]">
        {listItems.map((item, i) => (
          <li key={`${keyPrefix}-${i}`} className="leading-relaxed">
            {renderInline(item)}
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) {
      flushList(`list-empty-${index}`);
      return;
    }

    if (/^[-*•]\s+/.test(line)) {
      listItems.push(line.replace(/^[-*•]\s+/, ''));
      return;
    }

    if (/^\d+\.\s+/.test(line)) {
      listItems.push(line.replace(/^\d+\.\s+/, ''));
      return;
    }

    flushList(`list-before-${index}`);

    if (line.startsWith('### ')) {
      blocks.push(
        <h4
          key={`h3-${index}`}
          className="font-display text-lg font-semibold text-[#1B4332] dark:text-[#F4F1EA] pt-1"
        >
          {renderInline(line.slice(4))}
        </h4>
      );
      return;
    }

    if (line.startsWith('## ')) {
      blocks.push(
        <h3
          key={`h2-${index}`}
          className="font-display text-xl font-semibold text-[#1B4332] dark:text-[#F4F1EA] pt-1"
        >
          {renderInline(line.slice(3))}
        </h3>
      );
      return;
    }

    blocks.push(
      <p key={`p-${index}`} className="leading-relaxed">
        {renderInline(line)}
      </p>
    );
  });

  flushList('list-end');

  return (
    <div className="space-y-2.5 text-sm text-[#35443D] dark:text-[#D1DCD6]">
      {blocks}

      {sources && sources.length > 0 && (
        <div className="pt-3 mt-3 border-t border-[#DFD5C3]/80 dark:border-[#24352C] space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#2D6A6A] dark:text-[#6EC4A7]">
            <Globe className="w-3 h-3" />
            <span>Verified Web Sources ({sources.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sources.slice(0, 6).map((source, idx) => (
              <a
                key={`${source.uri}-${idx}`}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-2 p-2.5 rounded-lg border border-[#DFD5C3] dark:border-[#24352C] bg-[#FAF8F3]/80 dark:bg-[#0D1411]/70 hover:border-[#1B4332] dark:hover:border-[#6EC4A7] transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#18221D] dark:text-[#F4F1EA] truncate group-hover:text-[#1B4332] dark:group-hover:text-[#6EC4A7]">
                    {source.title}
                  </p>
                  <p className="text-[11px] font-mono-tabular text-[#5B6B63] dark:text-[#8E9F96] truncate">
                    {getHostname(source.uri)}
                  </p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#5B6B63] dark:text-[#8E9F96] shrink-0 mt-0.5 group-hover:text-[#1B4332] dark:group-hover:text-[#6EC4A7]" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
