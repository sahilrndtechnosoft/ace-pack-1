import type mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { blogPosts } from '../data/blogs';
import { exhibitionEvents } from '../data/events';
import { downloadGroups } from '../data/downloads';
import { aboutHero, aboutStats, aboutOverview, milestones, mdDesk } from '../data/about';
import { certifications, qualityChecks } from '../data/quality';

export async function seedDatabase(db: mysql.Pool): Promise<void> {
  // 1. Seed Default Super Admin
  const adminId = 'admin_root_1';
  const email = 'admin@acepack.com';
  const passwordHash = bcrypt.hashSync('AcePackaging2026!', 10);
  const name = 'Ace Administrator';
  const role = 'super_admin';

  await db.query(
    `INSERT INTO admins (id, email, password_hash, name, role, created_at)
     VALUES (?, ?, ?, ?, ?, NOW())
     ON DUPLICATE KEY UPDATE name=VALUES(name)`,
    [adminId, email, passwordHash, name, role]
  );

  // 2. Seed Pages
  const pages = [
    {
      slug: 'home',
      title: 'Home',
      seo_title: 'Ace Packaging | High-Performance Food Packaging Containers',
      seo_description: 'Fifteen years of precision injection moulding and thermoforming in Daman. 100% virgin PP 05 food containers for QSR chains, cloud kitchens & global export.',
      og_image: '/images/hero-bg-image.jpg',
    },
    {
      slug: 'about',
      title: 'About Us',
      seo_title: 'About Us | Ace Packaging Food Container Manufacturer',
      seo_description: 'Fifteen years of precision injection moulding in Daman. Ace Packaging manufactures food-grade PP 05 containers for QSR chains and food brands across India and 12+ export markets.',
      og_image: '/images/gallery/studio-range.webp',
    },
    {
      slug: 'products',
      title: 'Products Catalog',
      seo_title: 'All Products Catalog (89+ Models) | Ace Packaging',
      seo_description: 'Browse the full catalog of 89+ commercial food packaging containers. 100% virgin PP 05, tamper-evident seals, leak-proof rims.',
      og_image: '/images/gallery/kitchen-set.webp',
    },
    {
      slug: 'categories',
      title: 'Product Categories',
      seo_title: 'Packaging Collections & Series | Ace Packaging',
      seo_description: 'Explore 17 commercial container collections: RE bento, RO round bowls, Zen boxes, hinge cups, deli tubs, and portion pots.',
      og_image: '/images/gallery/studio-range.webp',
    },
    {
      slug: 'events',
      title: 'Exhibitions & Events',
      seo_title: 'Exhibitions & Events 2026 | Ace Packaging',
      seo_description: 'Explore Ace Packaging at international packaging expos, trade shows, and plastic summits worldwide. Live demos and samples.',
      og_image: '/images/DSC03993.JPG',
    },
    {
      slug: 'quality',
      title: 'Quality & Certifications',
      seo_title: 'Quality Standards & ISO 9001:2015 | Ace Packaging',
      seo_description: 'ISO 9001:2015 certified quality management, 100% prime virgin PP 05, vacuum seal leak testing, and thermal resilience from -20°C to +120°C.',
      og_image: '/images/gallery/kitchen-set.webp',
    },
    {
      slug: 'process',
      title: 'Manufacturing Process',
      seo_title: 'Manufacturing Process | Sheet Extrusion & Injection Tooling',
      seo_description: 'Inside our Daman production units: Sheet Extrusion, Thermoforming, Automated Robotic Packing, and In-Line Quality Control.',
      og_image: '/images/hero-bg-image.jpg',
    },
    {
      slug: 'downloads',
      title: 'Download Center',
      seo_title: 'Download Center | Catalogues, Datasheets & ISO Certificate',
      seo_description: 'Download official Ace Packaging technical datasheets, full product catalogues, and ISO 9001:2015 certificates.',
      og_image: '/images/gallery/studio-range.webp',
    },
    {
      slug: 'contact',
      title: 'Contact Us',
      seo_title: 'Contact Factory Sales & Technical Team | Ace Packaging',
      seo_description: 'Connect directly with our engineering and wholesale sales division in Daman. Fast sample dispatches and export quotes.',
      og_image: '/images/gallery/studio-range.webp',
    },
    {
      slug: 'faq',
      title: 'FAQ',
      seo_title: 'Frequently Asked Questions | Ace Packaging',
      seo_description: 'Commercial minimum order quantities, custom mould tooling lead times, and global shipping terms answered.',
      og_image: '/images/gallery/kitchen-set.webp',
    },
    {
      slug: 'gallery',
      title: 'Visual Gallery',
      seo_title: 'Visual Gallery | Production Line & Application Showcases',
      seo_description: 'Visual gallery of our manufacturing floor in Daman and high-volume container applications.',
      og_image: '/images/gallery/kitchen-set.webp',
    },
  ];

  for (const p of pages) {
    const pageId = 'page_' + p.slug;
    await db.query(
      `INSERT INTO pages (id, slug, title, seo_title, seo_description, og_image, canonical_url, robots_index, is_published, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, NOW(), NOW())
       ON DUPLICATE KEY UPDATE title=VALUES(title), seo_title=VALUES(seo_title), seo_description=VALUES(seo_description), og_image=VALUES(og_image)`,
      [pageId, p.slug, p.title, p.seo_title, p.seo_description, p.og_image, 'https://acepack.co.in/' + (p.slug === 'home' ? '' : p.slug)]
    );
  }

  // 3. Seed Sections for Home Page
  const homeSections = [
    {
      key: 'hero',
      title: 'Precision Engineered. Delivered Worldwide.',
      subtitle: 'High-performance injection-moulded and thermoformed food packaging containers. 100% prime virgin food-grade polymer PP 05.',
      sort_order: 1,
      content: {
        eyebrow: '15 Years of Precision Moulding · Daman, India',
        headingLines: ['Precision Engineered.', 'Delivered Worldwide.'],
        leadParagraph: 'High-performance injection-moulded and thermoformed food packaging containers. Moulded from 100% prime virgin PP 05 with hermetic snap rims, microwave resilience and global export compliance.',
        primaryButton: { text: 'Explore 89+ Models', link: '/products' },
        secondaryButton: { text: 'Download Catalog', link: '/downloads' },
        floatingBadge: { value: '1.5M+', label: 'Containers Daily' },
        bgImage: '/images/hero-bg-image.jpg',
      },
    },
    {
      key: 'craft_facts',
      title: 'Engineering & Material Craftsmanship',
      subtitle: 'Built for demanding hot curry delivery, deep freezer storage, and automated packing lines.',
      sort_order: 2,
      content: {
        facts: [
          {
            tag: '01 / Material integrity',
            title: '100% virgin\nPP 05.',
            body: '100% prime virgin food-grade polymer. Completely BPA-free, heavy-metal free, non-toxic and compliant with global food contact regulations.',
          },
          {
            tag: '02 / Sealed for the ride',
            title: 'Zero-leak\nsnap rim.',
            body: 'A hermetically tight perimeter rim seal that stops hot sauce, oily gravies, and liquid soup escaping during motorcycle delivery.',
          },
          {
            tag: '03 / Extreme thermal range',
            title: '−20°C to\n+120°C.',
            body: 'From deep-freeze storage down to −20°C straight into microwave reheating up to +120°C, with zero cracking, warping, or odor transfer.',
          },
        ],
      },
    },
    {
      key: 'stats_band',
      title: 'Our Production & Trust Scale',
      subtitle: 'Two automated manufacturing plants in Daman delivering precision at scale.',
      sort_order: 3,
      content: {
        stats: [
          { value: '15+', label: 'Years of Experience', hint: 'Since 2011 in Daman' },
          { value: '1,500,000+', label: 'Containers Moulded Daily', hint: 'High-cavity robotic presses' },
          { value: '1,000+', label: 'Happy Brand Clients', hint: 'QSRs, cloud kitchens & retail' },
          { value: '12+', label: 'Export Markets Worldwide', hint: 'UAE, UK, Australia & Americas' },
        ],
      },
    },
    {
      key: 'manufacturing_highlight',
      title: 'Robotic precision. 1.5 million a day.',
      subtitle: 'Fifteen years of injection moulding across two Daman units supplying QSR chains worldwide.',
      sort_order: 4,
      content: {
        eyebrow: '03 / Made with intent',
        heading: 'Robotic precision. 1.5 million a day.',
        body: 'Fifteen years of injection moulding across two Daman units — Dori Kadaiya and Dabhel — supplying QSR chains, cloud kitchens, and food brands in Australia, UAE, Europe, Canada, and the Middle East. Moulded exclusively from 100% prime virgin PP 05.',
        buttonText: 'Inside our process',
        buttonLink: '/process',
      },
    },
    {
      key: 'quality_preview',
      title: 'ISO 9001:2015 Certified Manufacturing Facility',
      subtitle: 'Certified Quality Management System audited and certified by SGS United Kingdom Ltd (UKAS 0005).',
      sort_order: 5,
      content: {
        certificateNumber: 'IN25/00000652',
        auditingBody: 'SGS United Kingdom Ltd (UKAS 0005)',
        validity: '01 August 2025 – 01 August 2028',
        buttonText: 'View All Certifications',
        buttonLink: '/quality',
      },
    },
    {
      key: 'pre_footer_cta',
      title: 'Ready to elevate your packaging programme?',
      subtitle: 'Request physical sample kits or speak directly with our factory tooling specialists.',
      sort_order: 6,
      content: {
        heading: 'Ready to elevate your packaging programme?',
        lead: 'Request physical sample kits, discuss bespoke mould tooling, or get competitive volume pricing for wholesale container supply.',
        primaryButton: { text: 'Contact Our Team', link: '/contact' },
        secondaryButton: { text: 'Download Full Catalog', link: '/downloads' },
        phone: '+91 99250 15906',
      },
    },
  ];

  for (const s of homeSections) {
    const secId = `sec_home_${s.key}`;
    const contentJson = JSON.stringify(s.content);
    await db.query(
      `INSERT INTO sections (id, page_slug, section_key, title, subtitle, draft_content, published_content, is_enabled, is_published, sort_order, created_at, updated_at)
       VALUES (?, 'home', ?, ?, ?, ?, ?, 1, 1, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), draft_content=VALUES(draft_content), published_content=VALUES(published_content), sort_order=VALUES(sort_order)`,
      [secId, s.key, s.title, s.subtitle, contentJson, contentJson, s.sort_order]
    );
  }

  // 4. Seed Sections for About Page
  const aboutSections = [
    {
      key: 'hero',
      title: 'Pioneers in Premium Food Container Solutions.',
      subtitle: 'Leading manufacturer of injection moulded food packaging articles with over 15 years of designing and manufacturing experience.',
      sort_order: 1,
      content: aboutHero,
    },
    {
      key: 'stats',
      title: 'Key Milestones in Numbers',
      subtitle: '15+ Years of Industry Leadership',
      sort_order: 2,
      content: { stats: aboutStats },
    },
    {
      key: 'overview',
      title: 'Know About Ace Packaging',
      subtitle: 'Pioneers of Injection Moulded Food Packaging Containers in India',
      sort_order: 3,
      content: aboutOverview,
    },
    {
      key: 'milestones',
      title: 'Our Journey of Innovation',
      subtitle: 'From a single unit in Daman to an international export leader',
      sort_order: 4,
      content: { milestones },
    },
    {
      key: 'md_desk',
      title: 'From the Managing Director’s Desk',
      subtitle: 'Our promise of zero defect, 100% food safety and enduring partnerships',
      sort_order: 5,
      content: mdDesk,
    },
  ];

  for (const s of aboutSections) {
    const secId = `sec_about_${s.key}`;
    const contentJson = JSON.stringify(s.content);
    await db.query(
      `INSERT INTO sections (id, page_slug, section_key, title, subtitle, draft_content, published_content, is_enabled, is_published, sort_order, created_at, updated_at)
       VALUES (?, 'about', ?, ?, ?, ?, ?, 1, 1, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), draft_content=VALUES(draft_content), published_content=VALUES(published_content)`,
      [secId, s.key, s.title, s.subtitle, contentJson, contentJson, s.sort_order]
    );
  }

  // 5. Seed Sections for Quality Page
  const qualitySections = [
    {
      key: 'hero',
      title: 'Quality & Certifications',
      subtitle: 'ISO 9001:2015 certified management systems, 100% prime virgin food-grade PP 05 polymer, and rigorous QA verification across every production cycle.',
      sort_order: 1,
      content: {
        badge: 'Rigorous Quality Assurance',
        heading: 'Certified Excellence. Zero Compromise.',
        description: 'Every container leaving our Daman production lines is engineered from 100% prime virgin polypropylene (PP 05) and manufactured under an accredited ISO 9001:2015 Quality Management System.',
      },
    },
    {
      key: 'certifications',
      title: 'Core Quality Pillars',
      subtitle: 'Certified standards backed by internationally recognized auditing bodies.',
      sort_order: 2,
      content: { certifications },
    },
    {
      key: 'inspection_protocol',
      title: 'Comprehensive 4-Stage Inspection Protocol',
      subtitle: 'Continuous quality checks from incoming virgin granules to boxed pallet dispatch.',
      sort_order: 3,
      content: { protocol: qualityChecks },
    },
    {
      key: 'certificate_preview',
      title: 'Official ISO 9001:2015 Certificate',
      subtitle: 'Audited and certified by SGS United Kingdom Ltd (UKAS 0005).',
      sort_order: 4,
      content: {
        certificateName: 'ISO 9001:2015 Management System Certification',
        certificateNumber: 'IN25/00000652',
        downloadUrl: '/downloads/Ace_Packaging_ISO_9001_2015.pdf',
        previewImage: '/images/DSC03993.JPG',
      },
    },
  ];

  for (const s of qualitySections) {
    const secId = `sec_quality_${s.key}`;
    const contentJson = JSON.stringify(s.content);
    await db.query(
      `INSERT INTO sections (id, page_slug, section_key, title, subtitle, draft_content, published_content, is_enabled, is_published, sort_order, created_at, updated_at)
       VALUES (?, 'quality', ?, ?, ?, ?, ?, 1, 1, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), draft_content=VALUES(draft_content), published_content=VALUES(published_content)`,
      [secId, s.key, s.title, s.subtitle, contentJson, contentJson, s.sort_order]
    );
  }

  // 6. Seed Sections for Process Page
  const processSections = [
    {
      key: 'hero',
      title: 'Manufacturing Process',
      subtitle: 'Precision Sheet Extrusion, Thermoforming, Automated Robotic Packing & Quality Testing under one roof.',
      sort_order: 1,
      content: {
        eyebrow: 'Precision Engineering in Daman',
        title: 'From Virgin Granule to Palletized Dispatch.',
        description: 'Our five-stage integrated production ecosystem combines European sheet extrusion lines, German high-speed thermoforming stations, robotic stacking automation, and real-time vacuum leak inspections.',
      },
    },
    {
      key: 'process_steps',
      title: '5 Core Manufacturing Stages',
      subtitle: 'Sheet Extrusion · Thermoforming · Automated Production · Quality Checks · Packaging & Dispatch',
      sort_order: 2,
      content: {
        steps: [
          {
            number: '01',
            title: 'Sheet Extrusion',
            description: '100% prime virgin polypropylene (PP 05) polymer granules are melted and extruded into uniform multi-layer plastic sheets with tight micron-level gauge control (±0.015mm).',
          },
          {
            number: '02',
            title: 'Thermoforming',
            description: 'Precision high-speed thermoforming presses heat the polymer sheet and mold it under vacuum pressure into high-definition container cavities with hermetic snap-lock rims.',
          },
          {
            number: '03',
            title: 'Automated Production',
            description: 'Continuous robotic trimming, automated container ejection, and optical camera vision systems eliminate human contact and guarantee ultra-clean food-grade hygiene.',
          },
          {
            number: '04',
            title: 'Quality Checks',
            description: 'Every batch undergoes rigorous vacuum leak testing, thermal shock verification (-20°C freezer to +120°C microwave), drop impact audits, and rim latch tension verification.',
          },
          {
            number: '05',
            title: 'Packaging and Dispatch',
            description: 'Containers are counted automatically, nested in cleanroom poly-liners, packed into corrugated export shippers, and shrink-wrapped onto standard wooden pallets for worldwide dispatch.',
          },
        ],
      },
    },
  ];

  for (const s of processSections) {
    const secId = `sec_process_${s.key}`;
    const contentJson = JSON.stringify(s.content);
    await db.query(
      `INSERT INTO sections (id, page_slug, section_key, title, subtitle, draft_content, published_content, is_enabled, is_published, sort_order, created_at, updated_at)
       VALUES (?, 'process', ?, ?, ?, ?, ?, 1, 1, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), draft_content=VALUES(draft_content), published_content=VALUES(published_content)`,
      [secId, s.key, s.title, s.subtitle, contentJson, contentJson, s.sort_order]
    );
  }

  // 7. Seed Sections for Contact Page
  const contactSections = [
    {
      key: 'hero',
      title: 'Get in Touch with Ace Packaging',
      subtitle: 'Connect directly with our factory sales and technical tooling specialists for wholesale quotes, physical sample kits, and custom tooling projects.',
      sort_order: 1,
      content: {
        phoneDomestic: '(+91) 99250 15906',
        phoneExport: '(+91) 99251 55799',
        emailDomestic: 'acepack2011@gmail.com',
        emailExport: 'sales@acepack.co.in / exports@acepack.co.in',
        address: 'Survey No: 142/1, Dabhel, Daman - 396210, India',
        timing: 'Monday – Saturday: 9:00 AM – 7:00 PM IST',
        whatsapp: '+91 99250 15906',
      },
    },
  ];

  for (const s of contactSections) {
    const secId = `sec_contact_${s.key}`;
    const contentJson = JSON.stringify(s.content);
    await db.query(
      `INSERT INTO sections (id, page_slug, section_key, title, subtitle, draft_content, published_content, is_enabled, is_published, sort_order, created_at, updated_at)
       VALUES (?, 'contact', ?, ?, ?, ?, ?, 1, 1, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), draft_content=VALUES(draft_content), published_content=VALUES(published_content)`,
      [secId, s.key, s.title, s.subtitle, contentJson, contentJson, s.sort_order]
    );
  }

  // 8. Seed Sections for Categories Page
  const categorySections = [
    {
      key: 'hero',
      title: 'Every format food service needs.',
      subtitle: 'Commercial container lines, one material standard: 100% prime virgin PP 05.',
      sort_order: 1,
      content: {
        eyebrow: 'The catalog · commercial packaging lines',
        title_line_1: 'Every format',
        title_line_2: 'food service needs.',
        lead: 'Commercial container lines, one material standard: 100% prime virgin PP 05, ISO 9001:2015 certified manufacturing, rated from deep freeze to microwave reheating.',
        stat_resin: 'PP 05',
        stat_resin_label: 'Virgin Resin',
        stat_range: '−20 · +120°C',
        stat_range_label: 'Rated Range',
      },
    },
    {
      key: 'index',
      title: 'Commercial Packaging Lines Directory',
      subtitle: 'Find your form among our certified commercial container series.',
      sort_order: 2,
      content: {
        eyebrow: '01 / Commercial Packaging Lines',
        title: 'Find your form.',
        hint: 'Certified series · Select a category to inspect full specs',
      },
    },
    {
      key: 'standard',
      title: 'Material & Engineering Standard',
      subtitle: 'One standard across every format.',
      sort_order: 3,
      content: {
        eyebrow: '02 / Material & Engineering Standard',
        title: 'One standard across every format.',
        lead: 'Whether you order 5,000 hinge cups or 500,000 bento boxes, every container is produced to the same rigorous technical specification.',
        bullets: [
          '100% prime virgin polypropylene (PP 05) — no regrind, no recycled content',
          'Manufactured in an ISO 9001:2015 certified facility in Daman',
          'Rated −20°C deep freeze to +120°C microwave reheating',
          'Zero-leak snap-rim geometry across every lidded format',
          'BPA-free and heavy-metal free',
          'Custom in-mould labelling available on every line',
        ],
      },
    },
  ];

  for (const s of categorySections) {
    const secId = `sec_categories_${s.key}`;
    const contentJson = JSON.stringify(s.content);
    await db.query(
      `INSERT INTO sections (id, page_slug, section_key, title, subtitle, draft_content, published_content, is_enabled, is_published, sort_order, created_at, updated_at)
       VALUES (?, 'categories', ?, ?, ?, ?, ?, 1, 1, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), draft_content=VALUES(draft_content), published_content=VALUES(published_content), sort_order=VALUES(sort_order)`,
      [secId, s.key, s.title, s.subtitle, contentJson, contentJson, s.sort_order]
    );
  }

  // 9. Seed Sections for Products Page
  const productSections = [
    {
      key: 'hero',
      title: 'Specified in hand.',
      subtitle: 'Complete catalog of plastic food containers and packaging models.',
      sort_order: 1,
      content: {
        eyebrow: 'The catalog · models · lines',
        title_line_1: 'Models.',
        title_line_2: 'Specified in hand.',
        lead: 'Every model below is moulded from 100% prime virgin PP 05 in an ISO 9001:2015 certified facility and rated from deep freeze to microwave. Filter by line, sort by capacity, open any model for its full specification.',
        stat_resin: 'PP 05',
        stat_resin_label: 'Virgin resin',
        stat_facility: 'ISO 9001:2015',
        stat_facility_label: 'Facility Standard',
      },
    },
    {
      key: 'catalog_filter',
      title: 'Interactive Model Catalog & Filters',
      subtitle: 'Filter by container series, sort by volume capacity, and access full engineering drawings.',
      sort_order: 2,
      content: {
        filter_label: 'Filter by product line',
        sort_label: 'Sort by capacity',
        empty_message: 'No models match the selected filter.',
        catalog_download_cta: 'Download Full Catalog (PDF)',
        catalog_download_link: '/downloads',
      },
    },
    {
      key: 'custom_mould_cta',
      title: 'Custom Mould Tooling & OEM Production',
      subtitle: 'Inquire about custom tooling or high-volume wholesale dispatch.',
      sort_order: 3,
      content: {
        heading: 'Need a customized shape, volume or IML decoration?',
        lead: 'Our in-house mould tooling engineers in Daman develop bespoke packaging for restaurant chains and food brands.',
        button_text: 'Contact Engineering Team',
        button_link: '/contact',
      },
    },
  ];

  for (const s of productSections) {
    const secId = `sec_products_${s.key}`;
    const contentJson = JSON.stringify(s.content);
    await db.query(
      `INSERT INTO sections (id, page_slug, section_key, title, subtitle, draft_content, published_content, is_enabled, is_published, sort_order, created_at, updated_at)
       VALUES (?, 'products', ?, ?, ?, ?, ?, 1, 1, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), draft_content=VALUES(draft_content), published_content=VALUES(published_content), sort_order=VALUES(sort_order)`,
      [secId, s.key, s.title, s.subtitle, contentJson, contentJson, s.sort_order]
    );
  }

  // 10. Seed Sections for Downloads, Events, Gallery Pages
  const otherPageSections = [
    {
      page: 'downloads',
      key: 'hero',
      title: 'Download Center & Technical Datasheets',
      subtitle: 'Official specification sheets, ISO 9001 certificates, and high-resolution packaging catalogs.',
      sort_order: 1,
      content: {
        badge: 'Official Technical Documentation',
        heading: 'Technical Datasheets & Compliance Files',
        lead: 'Download verified engineering drawings, migration test reports, and compliance certificates for your regulatory filing.',
      },
    },
    {
      page: 'events',
      key: 'hero',
      title: 'Exhibitions & Industry Events',
      subtitle: 'Connect with our polymer engineers at global food packaging summits and expos.',
      sort_order: 1,
      content: {
        badge: 'Global Trade Presence',
        heading: 'Meet Ace Packaging Worldwide',
        lead: 'Visit our expo booths to test physical container samples, discuss volume contracts, and review mould innovations.',
      },
    },
    {
      page: 'gallery',
      key: 'hero',
      title: 'Visual Manufacturing Gallery',
      subtitle: 'Inside look at our Daman manufacturing operations and food container models.',
      sort_order: 1,
      content: {
        badge: 'Factory Floor & Packaging Showcase',
        heading: 'Precision in Every Frame',
        lead: 'High-speed multi-cavity injection moulds, robotic clean-pack cells, and our commercial food container lines.',
      },
    },
  ];

  for (const s of otherPageSections) {
    const secId = `sec_${s.page}_${s.key}`;
    const contentJson = JSON.stringify(s.content);
    await db.query(
      `INSERT INTO sections (id, page_slug, section_key, title, subtitle, draft_content, published_content, is_enabled, is_published, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), draft_content=VALUES(draft_content), published_content=VALUES(published_content), sort_order=VALUES(sort_order)`,
      [secId, s.page, s.key, s.title, s.subtitle, contentJson, contentJson, s.sort_order]
    );
  }

  // 11. Seed Blogs
  for (const post of blogPosts) {
    const blogId = 'blog_' + post.slug;
    await db.query(
      `INSERT INTO blogs (id, slug, title, category, summary, content, takeaways, tags, image, author_name, author_role, author_avatar, read_time, date, is_published, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
       ON DUPLICATE KEY UPDATE title=VALUES(title), summary=VALUES(summary), content=VALUES(content), image=VALUES(image)`,
      [
        blogId,
        post.slug,
        post.title,
        post.category,
        post.summary,
        JSON.stringify(post.content),
        JSON.stringify(post.takeaways || []),
        JSON.stringify(post.tags || []),
        post.image,
        post.author?.name || 'Ace Editorial',
        post.author?.role || 'Packaging Team',
        post.author?.avatar || '/images/Ace_New_Update_Logo-01.png',
        post.readTime || '4 min read',
        post.date || '2026-10-01',
      ]
    );
  }

  // 9. Seed Events
  for (const ev of exhibitionEvents) {
    const eventId = 'event_' + ev.slug;
    await db.query(
      `INSERT INTO events (id, slug, title, short_desc, full_desc, date, location, booth, image, gallery, category, is_featured, is_published, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
       ON DUPLICATE KEY UPDATE title=VALUES(title), short_desc=VALUES(short_desc), full_desc=VALUES(full_desc), date=VALUES(date), location=VALUES(location), image=VALUES(image)`,
      [
        eventId,
        ev.slug,
        ev.title,
        ev.description || ev.shortTitle || ev.title,
        Array.isArray(ev.fullStory) ? ev.fullStory.join('\n\n') : ev.description || '',
        ev.date,
        ev.location,
        ev.booth || '',
        ev.image,
        JSON.stringify(ev.highlights || []),
        ev.category || 'expo',
        ev.status === 'featured' ? 1 : 0,
      ]
    );
  }

  // 10. Seed Downloads
  let sortOrder = 1;
  for (const group of downloadGroups) {
    for (const doc of group.items) {
      const docId = 'doc_' + doc.id;
      await db.query(
        `INSERT INTO downloads (id, title, category, format, file_size, download_url, cover_image, sort_order, is_published, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
         ON DUPLICATE KEY UPDATE title=VALUES(title), download_url=VALUES(download_url), file_size=VALUES(file_size)`,
        [
          docId,
          doc.title,
          group.title,
          doc.type || 'PDF',
          '4.2 MB',
          doc.file || '/downloads/Ace_Packaging_Full_Product_Catalog.pdf',
          doc.image || '/images/hero-bg-image.jpg',
          sortOrder++,
        ]
      );
    }
  }

  // 11. Seed Global Site Settings & Header/Footer
  const siteSettings = [
    { key: 'site_name', value: 'Ace Packaging', type: 'string' },
    { key: 'site_tagline', value: 'Pioneers in Premium Food Container Solutions', type: 'string' },
    { key: 'logo_url', value: '/images/Ace_New_Update_Logo-01.png', type: 'image' },
    { key: 'favicon_url', value: '/favicon.ico', type: 'image' },
    { key: 'primary_color', value: '#b99750', type: 'color' },
    { key: 'secondary_color', value: '#1A1D20', type: 'color' },
    { key: 'contact_email_domestic', value: 'acepack2011@gmail.com', type: 'string' },
    { key: 'contact_email_export', value: 'sales@acepack.co.in', type: 'string' },
    { key: 'contact_phone_domestic', value: '(+91) 99250 15906', type: 'string' },
    { key: 'contact_phone_export', value: '(+91) 99251 55799', type: 'string' },
    { key: 'whatsapp_number', value: '919925015906', type: 'string' },
    { key: 'factory_address', value: 'Survey No: 142/1, Dabhel, Daman - 396210, India', type: 'string' },
    { key: 'unit_2_address', value: 'Dori Kadaiya, Daman - 396210, India', type: 'string' },
    { key: 'maintenance_mode', value: 'false', type: 'boolean' },
    { key: 'google_analytics_id', value: '', type: 'string' },
    { key: 'social_linkedin', value: 'https://www.linkedin.com/company/ace-packaging', type: 'url' },
    { key: 'social_instagram', value: 'https://www.instagram.com/acepackaging', type: 'url' },
    { key: 'social_facebook', value: 'https://www.facebook.com/acepackaging', type: 'url' },
    {
      key: 'header_settings',
      type: 'json',
      value: JSON.stringify({
        logo: '/images/Ace_New_Update_Logo-01.png',
        ctaButtonText: 'Contact Us',
        ctaButtonLink: '/contact',
        topbarPhone: '+91 99250 15906',
        navLinks: [
          { label: 'About Us', href: '/about' },
          { label: 'Our Products', href: '/categories', hasMegaMenu: true },
          { label: 'Resources', href: '/resources', hasDropdown: true },
          { label: 'Exhibitions & Events', href: '/events' },
          { label: 'Blogs', href: '/blog' },
        ],
      }),
    },
    {
      key: 'footer_settings',
      type: 'json',
      value: JSON.stringify({
        logo: '/images/Ace_New_Update_Logo-01.png',
        description: 'Ace Packaging is an ISO 9001:2015 certified manufacturer of premium injection moulded and thermoformed food containers. Engineered from 100% prime virgin PP 05 in Daman, India for global food brands.',
        copyrightText: '© 2026 Ace Packaging. All rights reserved. ISO 9001:2015 Certified Manufacturing Facility.',
        domesticEmail: 'acepack2011@gmail.com',
        exportEmail: 'sales@acepack.co.in / exports@acepack.co.in',
        phoneNumbers: '(+91) 99250 15906 / (+91) 99251 55799',
        address: 'Survey No: 142/1, Dabhel, Daman - 396210, India',
      }),
    },
  ];

  for (const item of siteSettings) {
    await db.query(
      `INSERT INTO site_settings (setting_key, setting_value, setting_type, updated_at)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value), setting_type=VALUES(setting_type)`,
      [item.key, item.value, item.type]
    );
  }

  // 12. Seed initial Activity Log
  await db.query(
    `INSERT IGNORE INTO activity_logs (id, admin_email, action, entity_type, entity_id, details, created_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [
      'act_init_seed',
      'system@acepack.com',
      'SYSTEM_INITIALIZED',
      'DATABASE',
      'mysql',
      'Initial Ace Packaging website CMS database tables and content seeded successfully in MySQL.',
    ]
  );
}
