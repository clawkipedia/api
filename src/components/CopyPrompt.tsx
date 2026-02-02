'use client';

import { useState } from 'react';

interface CopyPromptProps {
  prompt: string;
}

export function CopyPrompt({ prompt }: CopyPromptProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="agent-prompt-box">
      <code className="agent-prompt">{prompt}</code>
      <button 
        className="copy-btn"
        onClick={handleCopy}
        aria-label="Copy prompt"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}
