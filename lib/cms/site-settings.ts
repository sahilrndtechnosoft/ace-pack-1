// Site-wide content shared by every page (stored in the site_settings table).
// Values are the live fallbacks used when a setting is empty.

export const LOGO = '/images/Ace_New_Update_Logo-01.png';

export const headerDefaults = {
  logo: LOGO,
  topbarPhone: '+91 99250 15906',
  ctaButtonText: 'Contact Us',
  ctaButtonLink: '/contact',
};

export const footerDefaults = {
  logo: LOGO,
  description:
    'The foundation of Ace Packaging was laid to manufacture, distribute, and export premium food packaging containers. With over 15 years of experience, we offer our customers the finest, durable, and extensive quality products.',
  badge: 'ISO 9001:2015 Certified Facility',
  unit1Address: 'Survey No. 111, Gala No. 2, Village Dori Kadaiya, Daman - 396210',
  unit2Address: 'Survey No. 201/(24), Nr. Atiyawad Check Post, Dabhel, Daman - 396210',
  phoneNumbers: '(+91) 99250 15906 / (+91) 99251 55799',
  domesticEmail: 'acepack2011@gmail.com',
  exportEmail: 'sales@acepack.co.in / exports@acepack.co.in',
  quickLinksHeading: 'Quick Links',
  quickLinks: [
    { label: 'Home', link: '/' },
    { label: 'Our Products', link: '/categories' },
    { label: 'All Product Catalog', link: '/products' },
    { label: 'About Us', link: '/about' },
    { label: 'Industries We Serve', link: '/industries' },
    { label: 'Quality & Certifications', link: '/quality' },
    { label: 'Manufacturing Process', link: '/process' },
    { label: 'Download Center', link: '/downloads' },
    { label: 'OEM & Customization', link: '/customization' },
    { label: 'Tools', link: '/tools' },
    { label: 'Exhibitions & Events', link: '/events' },
    { label: 'Visual Gallery', link: '/gallery' },
    { label: 'Blog & Articles', link: '/blogs' },
    { label: 'Contact Team', link: '/contact' },
  ],
  newsletterHeading: 'Catalog & Updates',
  newsletterText: 'Subscribe to receive our latest product catalog, new CAD specifications, and export packaging updates.',
  socialLinks: [] as Array<{ label: string; link: string }>,
  copyrightText: '',
};

/** Shown on the Contact page cards. */
export const contactDefaults = {
  contact_phone_domestic: '+91 98251 20023 / +91 98251 47525',
  contact_email_domestic: 'acepack2011@gmail.com',
  whatsapp_number: '+91 99250 15906',
};

export type HeaderSettings = typeof headerDefaults;
export type FooterSettings = typeof footerDefaults;
