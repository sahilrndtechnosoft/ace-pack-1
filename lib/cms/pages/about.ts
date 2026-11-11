// About Us page (/about and /aboutus).
import { aboutHero, aboutStats, aboutOverview, milestones, mdDesk, values, plant, leadership } from '@/lib/data/about';
import { certifications } from '@/lib/data/quality';

export const aboutPage = {
  title: 'About Us',
  path: '/about',
  sections: {
    hero: { label: 'Hero Banner', description: 'Page headline, intro text and main photo.', content: aboutHero },
    stats: { label: 'Key Numbers', description: 'Animated counters under the hero.', content: { stats: aboutStats } },
    overview: { label: 'Who We Are', description: 'Company overview text, highlights and photo.', content: aboutOverview },
    milestones: {
      label: 'Our Journey (Timeline)',
      description: 'Year-by-year milestones.',
      content: {
        eyebrow: '02 / Our journey',
        heading: 'Fifteen years,',
        headingHighlight: 'five turning points.',
        milestones,
        hint: 'Swipe or scroll to travel · tap a year to jump',
      },
    },
    md_desk: { label: "Managing Director's Message", description: 'Quote, name and portrait.', content: mdDesk },
    values: {
      label: 'Mission, Vision & Values',
      content: { eyebrow: 'What we stand for', heading: 'Safest container.', headingHighlight: 'Highest clarity.', headingEnd: 'Zero leaks.', items: values },
    },
    plant: {
      label: 'Infrastructure',
      description: 'Plant description and machine numbers.',
      content: { ...plant, link: { text: 'Inside our capabilities', link: '/capabilities' } },
    },
    team: {
      label: 'Leadership Team',
      content: {
        eyebrow: '04 / Our team',
        heading: 'The people behind',
        headingHighlight: 'every container.',
        note: 'Seasoned polymer engineers, toolmakers, and packaging specialists leading precision injection moulding operations across Daman.',
        members: leadership,
      },
    },
    certifications: {
      label: 'Certifications',
      content: {
        eyebrow: '05 / Certifications',
        heading: 'Certified at the material, the facility and the process.',
        link: { text: 'Quality & testing', link: '/quality' },
        items: certifications.map(({ id, scope, title, body }) => ({ id, scope, title, body })),
      },
    },
    closing: {
      label: 'Closing Call to Action',
      content: {
        eyebrow: 'Product catalog & sample kit',
        heading: 'Let’s make',
        headingHighlight: 'something good.',
        button: { text: 'Discuss your requirements', link: '/contact' },
        note: 'Daman, India · sales@acepack.co.in · +91 99250 15906',
      },
    },
  },
};
