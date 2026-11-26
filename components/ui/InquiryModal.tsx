'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { FactoryInquiryForm } from '@/components/sections/FactoryInquiryForm';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  sourcePage: string;
}

/** The site inquiry form in a popup, so a "contact us" button doesn't take the visitor off the page. */
export function InquiryModal({ isOpen, onClose, title = 'Send an Inquiry', sourcePage }: InquiryModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.__lenis?.stop();
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      window.__lenis?.start();
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-modal-title"
      data-lenis-prevent
      onClick={onClose}
      className="fixed inset-0 z-[1000] overflow-y-auto overscroll-contain bg-black/70 backdrop-blur-xs p-3 sm:p-6"
    >
      <div className="flex min-h-full items-center justify-center py-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-xl rounded-3xl border border-[#E6DBC6] bg-white p-5 sm:p-8 text-[var(--ace-ink)] shadow-2xl"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 id="inquiry-modal-title" className="pr-12 mb-5 text-xl sm:text-2xl font-extrabold">{title}</h2>
          <FactoryInquiryForm sourcePage={sourcePage} showCompany={false} />
        </div>
      </div>
    </div>,
    document.body
  );
}
