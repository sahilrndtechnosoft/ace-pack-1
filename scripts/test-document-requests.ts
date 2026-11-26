// Run: npx tsx scripts/test-document-requests.ts
import assert from 'node:assert/strict';
import { escapeHtml, resolveDocumentFile } from '../lib/documents/requests';

// Real catalogue resolves; anything outside /downloads or /uploads, or escaping public/, does not.
assert.ok(resolveDocumentFile('/downloads/Ace_Packaging_Full_Product_Catalog.pdf'));
assert.equal(resolveDocumentFile('/downloads/../../.env'), null);
assert.equal(resolveDocumentFile('/downloads/%2e%2e/%2e%2e/package.json'), null);
assert.equal(resolveDocumentFile('/../.env'), null);
assert.equal(resolveDocumentFile('/images/products/hinge/hinge-25ml.webp'), null);
assert.equal(resolveDocumentFile('/downloads/missing-file.pdf'), null);
assert.equal(resolveDocumentFile('/uploads/notes.txt'), null);
assert.equal(resolveDocumentFile(42), null);

assert.equal(escapeHtml('<b>"Ace" & Co\'s</b>'), '&lt;b&gt;&quot;Ace&quot; &amp; Co&#39;s&lt;/b&gt;');

console.log('document request checks passed');
