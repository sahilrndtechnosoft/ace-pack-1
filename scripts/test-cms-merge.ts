// Run: npx tsx scripts/test-cms-merge.ts
import assert from 'node:assert/strict';
import { withDefaults, emptyLike, hasUnsafeUrl } from '../lib/cms/merge';

const defaults = {
  title: 'Default title',
  image: '/images/default.webp',
  count: 3,
  button: { text: 'Go', link: '/go' },
  items: [{ title: 'A', body: 'a' }],
  tags: ['x'],
};

// Nothing stored -> live defaults.
assert.deepEqual(withDefaults(defaults, undefined), defaults);
assert.deepEqual(withDefaults(defaults, '{bad json'), defaults);

// Stored values win; blanks and wrong types fall back.
const merged = withDefaults(defaults, {
  title: '',
  image: ' ',
  count: 'nope',
  button: { text: 'Buy' },
  items: [{ title: 'B' }, { title: 'C', body: 'c' }],
  tags: [],
  legacyField: 'ignored',
});
// Deliberately cleared text stays cleared; a cleared image falls back so nothing looks broken.
assert.equal(merged.title, '');
assert.equal(merged.image, '/images/default.webp');
assert.equal(merged.count, 3);
assert.deepEqual(merged.button, { text: 'Buy', link: '/go' });
// List replaces defaults; a missing item field is blank, not borrowed from another item.
assert.deepEqual(merged.items, [{ title: 'B', body: '' }, { title: 'C', body: 'c' }]);
// Removing every item from a list sticks (this was the "it comes back" bug).
assert.deepEqual(merged.tags, []);
// A field that was never saved still uses the original content.
assert.equal(withDefaults(defaults, { title: 'T' }).count, 3);
assert.equal('legacyField' in merged, false);

assert.deepEqual(emptyLike({ a: 'x', b: [1], c: { d: 2 } }), { a: '', b: [], c: { d: 0 } });

assert.equal(hasUnsafeUrl({ a: [{ link: ' JavaScript:alert(1)' }] }), true);
assert.equal(hasUnsafeUrl({ link: '/contact', other: 'https://x.y' }), false);

console.log('cms merge: all checks passed');

// Article HTML clean-up (lib/cms/sanitize-html.ts)
import('../lib/cms/sanitize-html').then(({ sanitizeArticleHtml, htmlToParagraphs }) => {
  const dirty = '<p onclick="x()">Hi <a href="javascript:alert(1)">x</a><a href="/ok">ok</a></p><script>alert(1)</script><img src=x onerror=alert(1)><iframe src="//e"></iframe>';
  const clean = sanitizeArticleHtml(dirty);
  assert.ok(!/script|onclick|onerror|javascript:|iframe/i.test(clean), clean);
  assert.ok(clean.includes('<a href="/ok">ok</a>'));
  assert.deepEqual(htmlToParagraphs('<h2>T</h2><p>A<br>B</p><ul><li>c</li></ul>'), ['T', 'A\nB', 'c']);
  console.log('article html: all checks passed');
});
