// Run: npx tsx scripts/test-product-description.ts
import assert from 'node:assert/strict';
import { productCategories } from '../lib/data/products';
import { productDescription } from '../lib/data/product-description';

const category = productCategories[0];
const product = category.products[0];

const generated = productDescription({ ...product, description: undefined }, category);
assert.ok(generated.paragraphs.length >= 2, 'generated copy has several paragraphs');
assert.ok(generated.paragraphs[0].includes(product.name));
assert.ok(generated.features.every((f) => !/^\d+\./.test(f)), 'feature numbering stripped');
assert.equal(new Set(generated.features).size, generated.features.length, 'no duplicate features');

const own = productDescription({ ...product, description: 'First para.\n\n  Second para. ' }, category);
assert.deepEqual(own.paragraphs, ['First para.', 'Second para.']);

for (const c of productCategories) {
  for (const p of c.products) {
    const text = productDescription(p, c).paragraphs.join(' ');
    assert.ok(!/thermal|bento|factory|undefined/i.test(text), `${p.name}: banned word in copy`);
  }
}
console.log('productDescription checks passed');
