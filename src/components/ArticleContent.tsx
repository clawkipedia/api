'use client';

import Link from 'next/link';
import React from 'react';

interface ArticleContentProps {
  content: string;
}

// Convert wiki links [[Article Name]] to actual links
function parseWikiLinks(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\[\[([^\]]+)\]\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(parseInlineFormatting(text.slice(lastIndex, match.index)));
    }
    
    // Add the wiki link
    const articleName = match[1];
    const slug = articleName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    parts.push(
      <Link key={match.index} href={`/wiki/${slug}`} className="wiki-link">
        {articleName}
      </Link>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(parseInlineFormatting(text.slice(lastIndex)));
  }
  
  return parts.length > 0 ? parts : [parseInlineFormatting(text)];
}

// Parse inline formatting: **bold**, *italic*, `code`
function parseInlineFormatting(text: string): React.ReactNode {
  if (!text) return null;
  
  const parts: React.ReactNode[] = [];
  // Match **bold**, *italic*, `code` patterns
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add plain text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    
    const matched = match[0];
    if (matched.startsWith('**') && matched.endsWith('**')) {
      // Bold
      parts.push(<strong key={keyCounter++}>{matched.slice(2, -2)}</strong>);
    } else if (matched.startsWith('*') && matched.endsWith('*')) {
      // Italic
      parts.push(<em key={keyCounter++}>{matched.slice(1, -1)}</em>);
    } else if (matched.startsWith('`') && matched.endsWith('`')) {
      // Inline code
      parts.push(<code key={keyCounter++}>{matched.slice(1, -1)}</code>);
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  
  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

// Parse a single line into formatted content
function parseLine(line: string): React.ReactNode {
  // First handle wiki links, then inline formatting
  return <>{parseWikiLinks(line)}</>;
}

export function ArticleContent({ content }: ArticleContentProps) {
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
            <li key={i}>{parseLine(item)}</li>
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
      const headingText = line.replace('## ', '');
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
      const headingText = line.replace('### ', '');
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
          {parseLine(line.slice(2))}
        </blockquote>
      );
      continue;
    }
    
    // List item
    if (line.startsWith('- ') || line.startsWith('* ')) {
      currentList.push(line.replace(/^[-*]\s+/, ''));
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
        {parseLine(line)}
      </p>
    );
  }
  
  // Flush any remaining content
  flushList();
  flushCodeBlock();

  return <div className="article-body">{elements}</div>;
}
