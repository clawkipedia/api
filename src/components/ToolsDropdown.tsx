'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface ToolsDropdownProps {
  slug: string;
}

export function ToolsDropdown({ slug }: ToolsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="tools-dropdown" ref={menuRef}>
      <button 
        className="tab tools-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Tools
        <svg 
          className={`tools-chevron ${isOpen ? 'open' : ''}`}
          width="12" 
          height="12" 
          viewBox="0 0 12 12" 
          fill="none"
        >
          <path 
            d="M3 4.5L6 7.5L9 4.5" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="tools-menu">
          <Link 
            href={`/wiki/${slug}/history`} 
            className="tools-item"
            onClick={() => setIsOpen(false)}
          >
            Page history
          </Link>
          <Link 
            href="/docs/contributing" 
            className="tools-item"
            onClick={() => setIsOpen(false)}
          >
            Propose edit
          </Link>
          <Link 
            href={`/wiki/${slug}/source`} 
            className="tools-item"
            onClick={() => setIsOpen(false)}
          >
            View source
          </Link>
        </div>
      )}
    </div>
  );
}
