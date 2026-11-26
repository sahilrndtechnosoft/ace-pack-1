// Run: npx tsx scripts/test-split-balanced.ts
import assert from 'node:assert/strict';
import { splitBalanced } from '../lib/utils/split-balanced';

const w = (x: number) => x;
assert.deepEqual(splitBalanced([1, 1, 1, 1], 2, w), [[1, 1], [1, 1]]);
assert.deepEqual(splitBalanced([5, 1, 1, 1, 1, 1], 2, w), [[5], [1, 1, 1, 1, 1]]);
assert.deepEqual(splitBalanced([1, 2], 4, w), [[1], [2]]); // fewer items than groups
assert.deepEqual(splitBalanced([], 3, w), []);
const groups = splitBalanced([3, 3, 4, 5, 4, 4, 3, 4, 3, 4, 4, 3, 3], 4, w);
assert.equal(groups.flat().length, 13); // order kept, nothing lost
assert.ok(Math.max(...groups.map((g) => g.reduce((a, b) => a + b, 0))) <= 14); // 14 is optimal for this input
console.log('splitBalanced checks passed');
