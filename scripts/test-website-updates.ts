import assert from 'node:assert/strict';
import { cartonPlan, resourceLinks } from '../lib/data/resources';
import { languages } from '../lib/data/languages';
import { languagePreference, translationNavigationUrl } from '../lib/website-translation';

assert.deepEqual(cartonPlan(10001,500),{cartons:21,spare:499});
assert.deepEqual(cartonPlan(10000,500),{cartons:20,spare:0});
for (const values of [[0,500],[1,0],[-1,5],[1.5,5],[Infinity,5],[Number.MAX_SAFE_INTEGER,2]]) {
  assert.equal(cartonPlan(...values as [number,number]),null);
}
assert.equal(new Set(languages.map(item=>item.code)).size,languages.length);
assert.ok(languages.length>=249);
assert.ok(languages.every(item=>item.name && /^[a-zA-Z-]+$/.test(item.code)));
for (const item of languages) {
  assert.equal(languagePreference('',item.code),item.code);
  assert.equal(languagePreference(`googtrans=/en/${item.code}`,null),item.code);
}
assert.equal(languagePreference('other=value; googtrans=%2Fen%2Ffr',null),'fr');
assert.equal(languagePreference('googtrans=%broken',null),'en');
assert.equal(languagePreference('googtrans=/en/hi','fr'),'fr');
assert.equal(languagePreference('googtrans=/en/unknown','bad'),'en');
for (const origin of ['http://localhost:3000','https://ace-pack-1.vercel.app']) {
  assert.equal(translationNavigationUrl('/oem?format=500#details',`${origin}/tools`,'fr'),`${origin}/oem?format=500#details`);
  assert.equal(translationNavigationUrl('/tools#calculator',`${origin}/tools`,'fr'),null);
  assert.equal(translationNavigationUrl('/oem',`${origin}/tools`,'en'),null);
  for (const href of ['https://translate.google.com/translate','https://other.example/oem','mailto:sales@acepack.co.in','javascript:alert(1)']) {
    assert.equal(translationNavigationUrl(href,`${origin}/tools`,'fr'),null);
  }
}
assert.ok(['/gallery','/oem','/customization','/tools'].every(href=>resourceLinks.some(item=>item.href===href)));
console.log(`Website updates passed: carton rounding/validation, ${languages.length} language preferences, same-origin navigation and Resources links.`);
