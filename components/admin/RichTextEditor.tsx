'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bold, Code, Heading2, Heading3, Italic, Link2, List, ListOrdered, Pilcrow, Redo2, Undo2, Unlink } from 'lucide-react';

// Small WYSIWYG editor for article HTML. Uses the browser's built-in editing commands
// (no extra dependency); the server cleans the HTML again on save.
export function RichTextEditor({ value, onChange, label = 'Article content' }: { value: string; onChange: (html: string) => void; label?: string }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showSource, setShowSource] = useState(false);

  // Only push outside changes into the editor; re-setting innerHTML while typing would move the caret.
  useEffect(() => {
    const el = editorRef.current;
    if (el && !showSource && el.innerHTML !== value) el.innerHTML = value;
  }, [value, showSource]);

  const run = (command: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    onChange(editorRef.current?.innerHTML ?? '');
  };

  const addLink = () => {
    const url = window.prompt('Link address (e.g. /contact or https://…)');
    if (!url) return;
    if (!/^(\/|#|https?:\/\/|mailto:|tel:)/i.test(url.trim())) {
      window.alert('Please use a page path like /contact or a full https:// address.');
      return;
    }
    run('createLink', url.trim());
  };

  const tools: Array<{ label: string; icon: React.ComponentType<{ className?: string }>; action: () => void }> = [
    { label: 'Paragraph', icon: Pilcrow, action: () => run('formatBlock', 'P') },
    { label: 'Heading', icon: Heading2, action: () => run('formatBlock', 'H2') },
    { label: 'Sub-heading', icon: Heading3, action: () => run('formatBlock', 'H3') },
    { label: 'Bold', icon: Bold, action: () => run('bold') },
    { label: 'Italic', icon: Italic, action: () => run('italic') },
    { label: 'Bulleted list', icon: List, action: () => run('insertUnorderedList') },
    { label: 'Numbered list', icon: ListOrdered, action: () => run('insertOrderedList') },
    { label: 'Add link', icon: Link2, action: addLink },
    { label: 'Remove link', icon: Unlink, action: () => run('unlink') },
    { label: 'Undo', icon: Undo2, action: () => run('undo') },
    { label: 'Redo', icon: Redo2, action: () => run('redo') },
  ];

  return (
    <div className="rounded-2xl border border-[#222C3D] bg-[#0D1117] overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[#222C3D] bg-[#0A0D12]" role="toolbar" aria-label={`${label} formatting`}>
        {tools.map(({ label: toolLabel, icon: Icon, action }) => (
          <button
            key={toolLabel}
            type="button"
            title={toolLabel}
            aria-label={toolLabel}
            disabled={showSource}
            onMouseDown={(e) => e.preventDefault()} // keep the text selection
            onClick={action}
            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#1E2633] disabled:opacity-30 cursor-pointer"
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowSource((v) => !v)}
          aria-pressed={showSource}
          className={`ml-auto inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${showSource ? 'bg-[#b99750] text-[#0A0D12]' : 'text-gray-400 hover:text-white hover:bg-[#1E2633]'}`}
        >
          <Code className="w-3.5 h-3.5" /> HTML
        </button>
      </div>
      {showSource ? (
        <textarea
          aria-label={`${label} HTML source`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={18}
          className="w-full p-4 bg-[#090C10] text-xs font-mono text-emerald-300 focus:outline-none"
        />
      ) : (
        <div
          ref={editorRef}
          role="textbox"
          aria-multiline="true"
          aria-label={label}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          className="min-h-[360px] max-h-[60vh] overflow-y-auto p-5 bg-white text-[#1A1D20] text-sm leading-relaxed focus:outline-none [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-[#8c6f2a] [&_a]:underline [&_table]:w-full [&_td]:border [&_td]:p-1.5 [&_th]:border [&_th]:p-1.5"
        />
      )}
    </div>
  );
}
