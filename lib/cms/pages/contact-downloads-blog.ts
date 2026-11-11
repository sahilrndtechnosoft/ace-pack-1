// Contact (/contact and /contactus), Download Center (/downloads) and Blog listing (/blogs, /blog).
// Phone, email and WhatsApp come from Site-wide Settings so they stay the same everywhere.
import { bannerSection, DEFAULT_BANNER_IMAGE } from './shared';

export const contactPage = {
  title: 'Contact Us',
  path: '/contact',
  sections: {
    banner: bannerSection({
      badge: 'Get in touch with Ace Packaging',
      title: 'Contact Our Factory & Sales Team',
      subtitle: 'Discuss your requirements, inquire about custom IML branding, or speak with our polymer packaging engineers in Daman.',
      bgImage: DEFAULT_BANNER_IMAGE,
    }),
    details: {
      label: 'Contact Cards',
      description: 'Factory addresses and labels. Phone, email and WhatsApp numbers are edited in Site-wide Settings.',
      content: {
        addressLabel: 'Manufacturing Units',
        addressTitle: 'Unit 1 & Unit 2, Daman',
        unit1Address: 'Survey No. 42/1, Dori Kadaiya Road, Kadaiya, Nani Daman - 396 210, U.T., India.',
        unit2Address: 'Survey No. 191/1, Somnath Road, Dabhel, Daman - 396 210, U.T., India.',
        phoneLabel: 'Direct Sales Hotline',
        phoneHours: 'Available Monday through Saturday, 9:00 AM – 7:00 PM IST.',
        emailLabel: 'Official Inquiry Emails',
        exportEmail: 'sales@acepack.co.in',
        whatsappLabel: 'WhatsApp Sales',
        whatsappButtonText: 'Chat on WhatsApp',
        whatsappMessage: "Hello Ace Packaging, I'd like product information for food containers.",
        trustNote: 'Product Specifications & Sample Kits',
      },
    },
    form: {
      label: 'Inquiry Form',
      content: {
        heading: 'Send Factory Inquiry',
        description: 'Tell us about your application and request product information or a sample kit.',
      },
    },
    map: {
      label: 'Map & Directions',
      description: 'Google map pin. Coordinates are "latitude,longitude".',
      content: {
        eyebrow: 'Find Us & Navigation',
        heading: 'Daman Manufacturing Units (Unit 1 & Unit 2)',
        description: 'Exact pinned location for factory visits, logistics dispatch, and audits.',
        coordinates: '20.4519,72.8590',
        directionsButtonText: 'Get Directions (Unit 1)',
        openMapButtonText: 'Open in Google Maps',
        unit1Note: 'Survey No. 42/1, Dori Kadaiya Road, Kadaiya, Nani Daman - 396210',
        unit2Note: 'Survey No. 191/1, Somnath Road, Dabhel, Daman - 396210',
      },
    },
  },
};

export const downloadsPage = {
  title: 'Download Center',
  path: '/downloads',
  sections: {
    banner: bannerSection({
      badge: 'CATALOGS & DATASHEETS',
      title: 'Download Center',
      subtitle: 'Catalogs, per-line datasheets, the IML branding guide and compliance certificates — everything a buyer or export auditor needs from one place.',
      bgImage: DEFAULT_BANNER_IMAGE,
    }),
  },
};

export const blogPage = {
  title: 'Blog',
  path: '/blogs',
  sections: {
    banner: bannerSection({
      badge: 'PACKAGING KNOWLEDGE & ARTICLES',
      title: 'Our Blogs & Insights',
      subtitle: 'Explore expert perspectives on plastic food container engineering, zero-leak lid designs, microwave safety, and sustainable packaging trends.',
      bgImage: DEFAULT_BANNER_IMAGE,
    }),
  },
};
