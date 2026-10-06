import assert from 'node:assert/strict';
import { cartonPlan, resourceLinks } from '../lib/data/resources';
import { languages } from '../lib/data/languages';
import { translatedWebsiteUrl } from '../lib/website-translation';

assert.deepEqual(cartonPlan(10001,500),{cartons:21,spare:499});
assert.deepEqual(cartonPlan(10000,500),{cartons:20,spare:0});
for (const values of [[0,500],[1,0],[-1,5],[1.5,5],[Infinity,5],[Number.MAX_SAFE_INTEGER,2]]) {
  assert.equal(cartonPlan(...values as [number,number]),null);
}
assert.equal(new Set(languages.map(item=>item.code)).size,languages.length);
assert.ok(languages.length>=249);
assert.ok(languages.every(item=>item.name && /^[a-zA-Z-]+$/.test(item.code)));
for (const item of languages) {
  const link = new URL(translatedWebsiteUrl('https://acepack.co.in/products?email=private@example.com#details',item.code)!);
  assert.equal(link.hostname,'translate.google.com');
  assert.equal(link.searchParams.get('tl'),item.code);
  assert.equal(link.searchParams.get('u'),'https://acepack.co.in/products');
}
for (const page of ['http://localhost:3000/tools','http://127.0.0.1/','http://192.168.1.1/','http://demo.local/','http://[::1]/','javascript:alert(1)','https://user:secret@example.com/','invalid']) {
  assert.equal(translatedWebsiteUrl(page,'hi'),null);
}
assert.equal(translatedWebsiteUrl('https://acepack.co.in/','made-up'),null);
assert.ok(['/gallery','/oem','/customization','/tools'].every(href=>resourceLinks.some(item=>item.href===href)));
console.log(`Website updates passed: carton rounding/validation, ${languages.length} translation destinations, URL privacy and Resources links.`);
