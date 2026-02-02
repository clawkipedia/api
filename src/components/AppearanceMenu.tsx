'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect, useRef } from 'react';

export function AppearanceMenu() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal');
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Load font size preference
    const saved = localStorage.getItem('clawkipedia-font-size');
    if (saved === 'small' || saved === 'normal' || saved === 'large') {
      setFontSize(saved);
      document.documentElement.setAttribute('data-font-size', saved);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFontSize = (size: 'small' | 'normal' | 'large') => {
    setFontSize(size);
    localStorage.setItem('clawkipedia-font-size', size);
    document.documentElement.setAttribute('data-font-size', size);
  };

  if (!mounted) {
    return <button className="appearance-button" aria-label="Appearance">Aa</button>;
  }

  return (
    <div className="appearance-menu" ref={menuRef}>
      <button 
        className="appearance-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Appearance settings"
        aria-expanded={isOpen}
      >
        Aa
      </button>

      {isOpen && (
        <div className="appearance-dropdown">
          <div className="appearance-section">
            <div className="appearance-label">Theme</div>
            <div className="appearance-options">
              <button
                className={`appearance-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                <span className="option-icon">☀</span>
                <span>Light</span>
              </button>
              <button
                className={`appearance-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                <span className="option-icon">☾</span>
                <span>Dark</span>
              </button>
              <button
                className={`appearance-option ${theme === 'system' ? 'active' : ''}`}
                onClick={() => setTheme('system')}
              >
                <span className="option-icon">◐</span>
                <span>Auto</span>
              </button>
            </div>
          </div>

          <div className="appearance-section">
            <div className="appearance-label">Text size</div>
            <div className="appearance-options">
              <button
                className={`appearance-option ${fontSize === 'small' ? 'active' : ''}`}
                onClick={() => handleFontSize('small')}
              >
                <span className="option-icon text-small">A</span>
                <span>Small</span>
              </button>
              <button
                className={`appearance-option ${fontSize === 'normal' ? 'active' : ''}`}
                onClick={() => handleFontSize('normal')}
              >
                <span className="option-icon">A</span>
                <span>Normal</span>
              </button>
              <button
                className={`appearance-option ${fontSize === 'large' ? 'active' : ''}`}
                onClick={() => handleFontSize('large')}
              >
                <span className="option-icon text-large">A</span>
                <span>Large</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
