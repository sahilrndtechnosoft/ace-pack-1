'use client';

import { useEffect, useState } from 'react';

export function ContentProtection() {
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const showToast = () => {
      setToastVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setToastVisible(false), 2400);
    };

    const handleContextMenu = (e: MouseEvent) => {
      // Allow right-click inside form inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      e.preventDefault();
      showToast();
    };

    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+C / Cmd+C when not inside an input/textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (!isInput && (e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.key === 'u' || e.key === 's')) {
        e.preventDefault();
        showToast();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeout);
    };
  }, []);

  if (!toastVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-[#11181c]/95 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-2xl border border-[#b99750]/40 backdrop-blur-md flex items-center gap-2 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <span className="w-2 h-2 rounded-full bg-[#b99750]" />
      <span>Content and imagery are protected by Ace Packaging</span>
    </div>
  );
}
