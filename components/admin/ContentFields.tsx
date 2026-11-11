'use client';

import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { MediaInput } from './MediaInput';
import { emptyLike, isPlainObject } from '@/lib/cms/merge';

// Builds a form from the section's content shape: text, long text, images, files, links,
// numbers, on/off switches, groups and repeatable lists (add / remove / reorder).

const LABELS: Record<string, string> = {
  bgImage: 'Background image',
  imageAlt: 'Image description (for accessibility & SEO)',
  link: 'Link',
  text: 'Button text',
  cta: 'Button',
  faqs: 'Questions & answers',
};

const IMAGE_KEY = /(image|img|photo|portrait|logo|thumbnail|thumb|cover|banner|avatar|poster|src)$/i;
const FILE_KEY = /(file|pdf|document|download(url)?|brochure)$/i;
const LINK_KEY = /(link|href|url)$/i;
const SHORT_KEY = /(^text$|buttontext$|label$|title$|heading$|badge$|eyebrow$|name$|alt$)/i;
const LOOKS_LIKE_PATH = /^(\/|https?:\/\/|$)/;
const LONG_KEY = /(body|description|desc|answer|quote|lead|intro|paragraph|note|text|summary|content|story|message)$/i;
const SAFE_LINK = /^(\/|#|https?:\/\/|mailto:|tel:)/i;

export function humanize(key: string): string {
  if (LABELS[key]) return LABELS[key];
  const words = key.replace(/[_-]+/g, ' ').replace(/([a-z0-9])([A-Z])/g, '$1 $2').trim().toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Link fields must be a site path, anchor, web address, email or phone link. */
export function findInvalidLinks(value: unknown, path = ''): string[] {
  if (typeof value === 'string') {
    const key = path.split('.').pop() ?? '';
    return LINK_KEY.test(key) && value.trim() && !SAFE_LINK.test(value.trim()) ? [path] : [];
  }
  if (Array.isArray(value)) return value.flatMap((item, i) => findInvalidLinks(item, `${path}.${i}`));
  if (isPlainObject(value)) return Object.entries(value).flatMap(([k, v]) => findInvalidLinks(v, path ? `${path}.${k}` : k));
  return [];
}

const inputClass =
  'w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]';

function itemTitle(item: unknown, index: number): string {
  if (typeof item === 'string') return item || `Item ${index + 1}`;
  if (Array.isArray(item) && typeof item[0] === 'string') return item[0] || `Item ${index + 1}`;
  if (isPlainObject(item)) {
    for (const key of ['title', 'question', 'label', 'name', 'heading', 'year', 'value', 'text']) {
      const v = item[key];
      if (typeof v === 'string' && v.trim()) return v.replace(/\n/g, ' ');
      if (typeof v === 'number') return String(v);
    }
  }
  return `Item ${index + 1}`;
}

interface FieldProps {
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
  /** Shape used for new list items when the list is empty. */
  template?: unknown;
  depth?: number;
}

export function ContentFields({ value, onChange, template }: { value: Record<string, unknown>; onChange: (v: Record<string, unknown>) => void; template?: Record<string, unknown> }) {
  return (
    <div className="space-y-5">
      {Object.entries(value).map(([key, v]) => (
        <Field
          key={key}
          name={key}
          value={v}
          template={template?.[key]}
          onChange={(next) => onChange({ ...value, [key]: next })}
        />
      ))}
    </div>
  );
}

function Field({ name, value, onChange, template, depth = 0 }: FieldProps) {
  const label = humanize(name);
  const id = React.useId();

  if (typeof value === 'boolean') {
    return (
      <label className="flex items-center gap-3 text-sm text-gray-200 cursor-pointer">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-[#b99750]" />
        {label}
      </label>
    );
  }

  if (typeof value === 'number') {
    return (
      <div>
        <label htmlFor={id} className="block text-xs font-bold text-gray-300 mb-1.5">{label}</label>
        <input id={id} type="number" value={value} onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))} className={inputClass} />
      </div>
    );
  }

  if (typeof value === 'string') {
    if (IMAGE_KEY.test(name) && LOOKS_LIKE_PATH.test(value)) {
      return <MediaInput label={label} value={value} onChange={onChange} category="pages" placeholder="Upload or choose from the media library" />;
    }
    if (FILE_KEY.test(name) && LOOKS_LIKE_PATH.test(value)) {
      return <MediaInput label={label} value={value} onChange={onChange} category="downloads" fileType="any" accept="application/pdf,.pdf,image/*" placeholder="Upload or choose a file" />;
    }
    if (LINK_KEY.test(name)) {
      const invalid = value.trim() !== '' && !SAFE_LINK.test(value.trim());
      return (
        <div>
          <label htmlFor={id} className="block text-xs font-bold text-gray-300 mb-1.5">{label}</label>
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/contact or https://…"
            aria-invalid={invalid}
            className={`${inputClass} ${invalid ? 'border-red-500' : ''}`}
          />
          {invalid && <p className="mt-1 text-xs text-red-400">Use a page path like /contact, a full https:// address, mailto: or tel:.</p>}
        </div>
      );
    }
    const isLong = value.includes('\n') || value.length > 90 || (LONG_KEY.test(name) && !SHORT_KEY.test(name));
    return (
      <div>
        <label htmlFor={id} className="block text-xs font-bold text-gray-300 mb-1.5">{label}</label>
        {isLong ? (
          <textarea id={id} rows={Math.min(8, Math.max(3, Math.ceil(value.length / 90)))} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} leading-relaxed`} />
        ) : (
          <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
        )}
      </div>
    );
  }

  if (Array.isArray(value)) {
    return <ListField name={name} items={value} onChange={onChange} template={Array.isArray(template) ? template[0] : undefined} depth={depth} />;
  }

  if (isPlainObject(value)) {
    return (
      <fieldset className="rounded-2xl border border-[#222C3D] bg-[#0D1117] p-4">
        <legend className="px-2 text-xs font-extrabold uppercase tracking-wider text-[#b99750]">{label}</legend>
        <div className={Object.keys(value).length <= 2 ? 'grid gap-4 sm:grid-cols-2' : 'space-y-4'}>
          {Object.entries(value).map(([key, v]) => (
            <Field
              key={key}
              name={key}
              value={v}
              template={isPlainObject(template) ? template[key] : undefined}
              depth={depth + 1}
              onChange={(next) => onChange({ ...value, [key]: next })}
            />
          ))}
        </div>
      </fieldset>
    );
  }

  return null;
}

function ListField({ name, items, onChange, template, depth }: { name: string; items: unknown[]; onChange: (v: unknown[]) => void; template?: unknown; depth: number }) {
  const label = humanize(name);
  const isSimple = items.every((item) => typeof item === 'string') && (items.length > 0 || typeof template === 'string');
  const blank = () => emptyLike(items[0] ?? template ?? '');

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };
  const remove = (index: number) => {
    if (!window.confirm(`Remove "${itemTitle(items[index], index)}"?`)) return;
    onChange(items.filter((_, i) => i !== index));
  };
  const update = (index: number, next: unknown) => onChange(items.map((item, i) => (i === index ? next : item)));

  const controls = (index: number) => (
    <div className="flex items-center gap-1 shrink-0">
      <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0} aria-label="Move up" className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E2633] disabled:opacity-30 cursor-pointer"><ArrowUp className="w-3.5 h-3.5" /></button>
      <button type="button" onClick={() => move(index, index + 1)} disabled={index === items.length - 1} aria-label="Move down" className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E2633] disabled:opacity-30 cursor-pointer"><ArrowDown className="w-3.5 h-3.5" /></button>
      <button type="button" onClick={() => remove(index)} aria-label="Remove" className="p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
    </div>
  );

  return (
    <div className="rounded-2xl border border-[#222C3D] bg-[#0D1117] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#b99750]">{label} <span className="text-gray-500 normal-case font-semibold">({items.length})</span></span>
      </div>

      <div className="space-y-2.5">
        {items.map((item, index) =>
          isSimple ? (
            <div key={index} className="flex items-center gap-2">
              <input type="text" value={String(item)} onChange={(e) => update(index, e.target.value)} aria-label={`${label} ${index + 1}`} className={inputClass} />
              {controls(index)}
            </div>
          ) : (
            <details key={index} className="group rounded-xl border border-[#222C3D] bg-[#141A24]" open={items.length <= 2 && depth === 0}>
              <summary className="flex items-center justify-between gap-3 px-3.5 py-2.5 cursor-pointer list-none">
                <span className="text-sm font-semibold text-gray-200 truncate">
                  <span className="text-gray-500 mr-2">{index + 1}.</span>
                  {itemTitle(item, index)}
                </span>
                {controls(index)}
              </summary>
              <div className="px-3.5 pb-4 pt-1 space-y-4">
                {isPlainObject(item) ? (
                  Object.entries(item).map(([key, v]) => (
                    <Field
                      key={key}
                      name={key}
                      value={v}
                      depth={depth + 1}
                      template={isPlainObject(template) ? template[key] : undefined}
                      onChange={(next) => update(index, { ...item, [key]: next })}
                    />
                  ))
                ) : (
                  <Field name={`${label} ${index + 1}`} value={item} depth={depth + 1} onChange={(next) => update(index, next)} />
                )}
              </div>
            </details>
          )
        )}
      </div>

      <button
        type="button"
        onClick={() => onChange([...items, blank()])}
        className="mt-3 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-[#b99750]/50 text-[#b99750] hover:bg-[#b99750]/10 text-xs font-bold cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" /> Add {label.toLowerCase().replace(/s$/, '')}
      </button>
    </div>
  );
}
