// Run: npx tsx scripts/test-asset-url.ts
import assert from 'node:assert/strict';
import { encodeAssetPath } from '../lib/asset-url';

assert.equal(
  encodeAssetPath('/admin/images/blog/Blog-1_Ghee, Butter (1).webp'),
  '/admin/images/blog/Blog-1_Ghee%2C%20Butter%20(1).webp'
);
assert.equal(encodeAssetPath('/a/Ghee%2C%20Butter.webp'), '/a/Ghee%2C%20Butter.webp');
assert.equal(encodeAssetPath('/a/100% pure.webp'), '/a/100%25%20pure.webp');
assert.equal(encodeAssetPath('/images/hero.jpg'), '/images/hero.jpg');
assert.equal(encodeAssetPath('https://x.com/a b.jpg'), 'https://x.com/a b.jpg');
assert.equal(encodeAssetPath(''), '');
console.log('asset-url: ok');
