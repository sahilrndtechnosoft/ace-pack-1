// Run: npx tsx scripts/test-blog-display.ts
import assert from 'node:assert/strict';
import { blogAuthorAvatar, blogCategory, blogViewCount, formatBlogViews, IMPORTED_BLOG_CATEGORY } from '../lib/data/blog-display';

assert.equal(blogCategory('Case Studies', 'How to Recycle Containers'), 'Case Studies'); // CMS choice wins
assert.equal(blogCategory(IMPORTED_BLOG_CATEGORY, 'How to Recycle and Reuse Plastic Food Containers'), 'Sustainability');
assert.equal(blogCategory(null, 'Salad, Fruit and Fresh Produce Packaging Keeping Greens Crisp'), 'Food Safety & Freshness');
assert.equal(blogCategory('', 'Elite Containers: The Premium Choice for Food Storage'), 'Product Spotlights');
assert.equal(blogAuthorAvatar('/Ace_New_Update_Logo-01.png'), '/images/ace-mark.png');
assert.equal(blogAuthorAvatar(null), '/images/ace-mark.png');
assert.equal(blogAuthorAvatar('/uploads/team/priya.jpg'), '/uploads/team/priya.jpg');
console.log('blog-display: ok');

assert.equal(blogViewCount('1101 Views'), 1101);
assert.equal(blogViewCount('1,23,456'), 123456);
assert.equal(blogViewCount(null), 0);
assert.equal(formatBlogViews('123456 Views'), '1,23,456 views');
assert.equal(formatBlogViews('1 Views'), '1 view');
assert.equal(formatBlogViews(''), null);
console.log('blog views: ok');
