// Run: npx tsx scripts/test-capacity-label.ts
import assert from 'node:assert/strict';
import { capacityLabel } from '../lib/data/products';

assert.equal(capacityLabel('AP-RE-08 (250ml / 8oz)'), '250ml / 8oz');
assert.equal(capacityLabel('AP-RE-232 (2-Compartment Bento)'), '2-Compartment Bento');
assert.equal(capacityLabel('25ml'), '25ml');
assert.equal(capacityLabel('500ml (16oz)'), '500ml (16oz)'); // no model code in front: unchanged
console.log('capacityLabel checks passed');
