'use client';

import Link from 'next/link';
import React, { useMemo } from 'react';

interface ArticleContentProps {
  content: string;
  existingSlugs?: string[];
}

// Parse all inline formatting in order of priority
function parseInline(text: string, existingSlugsSet?: Set<string>): React.ReactNode {
  if (!text) return null;
  
  const result: React.ReactNode[] = [];
  let remaining = text;
  let keyCounter = 0;

  while (remaining.length > 0) {
    // Find the earliest match of any pattern
    const patterns = [
      { regex: /\[\[([^\]]+)\]\]/, type: 'wikilink' },
      { regex: /\[([^\]]+)\]\(([^)]+)\)/, type: 'mdlink' },
      { regex: /\*\*([^*]+)\*\*/, type: 'bold' },
      { regex: /\*([^*]+)\*/, type: 'italic' },
      { regex: /`([^`]+)`/, type: 'code' },
    ];

    let earliestMatch: { index: number; match: RegExpMatchArray; type: string } | null = null;

    for (const pattern of patterns) {
      const match = remaining.match(pattern.regex);
      if (match && match.index !== undefined) {
        if (!earliestMatch || match.index < earliestMatch.index) {
          earliestMatch = { index: match.index, match, type: pattern.type };
        }
      }
    }

    if (!earliestMatch) {
      // No more patterns, add remaining text
      result.push(remaining);
      break;
    }

    // Add text before the match
    if (earliestMatch.index > 0) {
      result.push(remaining.slice(0, earliestMatch.index));
    }

    // Add the formatted element
    const content = earliestMatch.match[1];
    const fullMatch = earliestMatch.match[0];

    switch (earliestMatch.type) {
      case 'wikilink': {
        const slug = content.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const articleExists = !existingSlugsSet || existingSlugsSet.has(slug);
        
        if (articleExists) {
          result.push(
            <Link key={keyCounter++} href={`/wiki/${slug}`} className="wiki-link">
              {content}
            </Link>
          );
        } else {
          // Orphan link - article doesn't exist yet
          result.push(
            <span 
              key={keyCounter++} 
              className="wiki-link-orphan"
              title={`Article "${content}" doesn't exist yet`}
            >
              {content}
            </span>
          );
        }
        break;
      }
      case 'mdlink': {
        const linkText = earliestMatch.match[1];
        const linkUrl = earliestMatch.match[2];
        // External links open in new tab
        const isExternal = linkUrl.startsWith('http://') || linkUrl.startsWith('https://');
        result.push(
          <a 
            key={keyCounter++} 
            href={linkUrl} 
            className="article-link"
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
          >
            {linkText}
          </a>
        );
        break;
      }
      case 'bold':
        result.push(<strong key={keyCounter++}>{parseInline(content, existingSlugsSet)}</strong>);
        break;
      case 'italic':
        result.push(<em key={keyCounter++}>{parseInline(content, existingSlugsSet)}</em>);
        break;
      case 'code':
        result.push(<code key={keyCounter++}>{content}</code>);
        break;
    }

    // Continue with the rest
    remaining = remaining.slice(earliestMatch.index + fullMatch.length);
  }

  return result.length === 1 ? result[0] : <>{result}</>;
}

export function ArticleContent({ content, existingSlugs }: ArticleContentProps) {
  // Convert array to Set for efficient lookups (arrays can be serialized from server components)
  const existingSlugsSet = useMemo(
    () => (existingSlugs ? new Set(existingSlugs) : undefined),
    [existingSlugs]
  );

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockLang = '';
  let keyCounter = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={keyCounter++} className="article-list">
          {currentList.map((item, i) => (
            <li key={i}>{parseInline(item, existingSlugsSet)}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const flushCodeBlock = () => {
    if (codeBlockContent.length > 0) {
      elements.push(
        <pre key={keyCounter++} className="article-code-block">
          <code className={codeBlockLang ? `language-${codeBlockLang}` : ''}>
            {codeBlockContent.join('\n')}
          </code>
        </pre>
      );
      codeBlockContent = [];
      codeBlockLang = '';
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Code block handling
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock();
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
        codeBlockLang = line.slice(3).trim();
      }
      continue;
    }
    
    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }
    
    // Skip H1 (we use article title)
    if (line.startsWith('# ') && !line.startsWith('## ')) {
      continue;
    }
    
    // H2
    if (line.startsWith('## ')) {
      flushList();
      const headingText = line.slice(3);
      const headingId = headingText.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      elements.push(
        <h2 key={keyCounter++} id={headingId} className="article-h2">
          {headingText}
        </h2>
      );
      continue;
    }
    
    // H3
    if (line.startsWith('### ')) {
      flushList();
      const headingText = line.slice(4);
      elements.push(
        <h3 key={keyCounter++} className="article-h3">
          {headingText}
        </h3>
      );
      continue;
    }
    
    // Blockquote
    if (line.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={keyCounter++} className="article-blockquote">
          {parseInline(line.slice(2), existingSlugsSet)}
        </blockquote>
      );
      continue;
    }
    
    // List item
    if (line.startsWith('- ') || line.startsWith('* ')) {
      currentList.push(line.slice(2));
      continue;
    }
    
    // Empty line
    if (!line.trim()) {
      flushList();
      continue;
    }
    
    // Regular paragraph
    flushList();
    elements.push(
      <p key={keyCounter++} className="article-paragraph">
        {parseInline(line, existingSlugsSet)}
      </p>
    );
  }
  
  // Flush any remaining content
  flushList();
  flushCodeBlock();

  return <div className="article-body">{elements}</div>;
}
