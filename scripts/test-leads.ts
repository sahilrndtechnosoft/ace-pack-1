// Run: npx tsx scripts/test-leads.ts
import assert from 'node:assert/strict';
import { leadReasons, leadTier } from '../lib/analytics/leads';

assert.equal(leadTier(50), 'hot');
assert.equal(leadTier(49), 'warm');
assert.equal(leadTier(25), 'warm');
assert.equal(leadTier(24), 'cold');

const now = Date.parse('2026-11-12T10:00:00Z');
assert.deepEqual(
  leadReasons({ inquiries: 1, ip_inquiries: 3, product_views: 4, contact_views: 1, visit_count: 3, pageviews: 9, last_visit_at: '2026-11-11T10:00:00Z' }, now),
  ['Sent 1 inquiry', 'Viewed 4 product pages', 'Visited Contact / Downloads', '3 visits', 'Active in the last 3 days', '9 page views']
);
// A network match only counts when the visitor has no linked inquiry of their own.
assert.deepEqual(
  leadReasons({ inquiries: 0, ip_inquiries: 2, product_views: 0, contact_views: 0, visit_count: 1, pageviews: 1, last_visit_at: '2026-10-01T00:00:00Z' }, now),
  ['Inquiry sent from the same network', '1 page view']
);
console.log('lead scoring: all checks passed');
