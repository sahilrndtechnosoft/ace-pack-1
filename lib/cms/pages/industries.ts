// Industries page (/industries).
import { allIndustries } from '@/lib/data/industries';

export const industriesPage = {
  title: 'Industries',
  path: '/industries',
  sections: {
    hero: {
      label: 'Hero Banner',
      description: 'The number of segments and product lines is counted automatically.',
      content: {
        eyebrow: 'Who we serve',
        heading: 'Built for the way',
        headingHighlight: 'each industry serves.',
        lead: 'From the corner QSR to global export partners: twelve segments, each with its own demands on a container, all moulded from the same certified virgin PP 05.',
        stats: [
          { value: '12+', label: 'Export markets' },
          { value: 'PP 05', label: 'One resin' },
        ],
      },
    },
    segments: {
      label: 'Industry Segments',
      description: '"Product lines" are category URL names, e.g. re-series.',
      content: {
        eyebrow: '01 / By segment',
        heading: 'What each kitchen asks of a container,',
        headingHighlight: 'and the lines that answer.',
        buttonText: 'Open the line',
        items: allIndustries.map(({ title, description, image, href, needs, lines }) => ({
          title,
          description,
          image: image ?? '',
          link: href ?? '/categories',
          needs: needs ?? [],
          lines: lines ?? [],
        })),
      },
    },
    standard: {
      label: 'Material Standard',
      content: {
        eyebrow: '02 / Every segment, one standard',
        heading: 'Different demands,',
        headingHighlight: 'the same polymer.',
        bullets: [
          '100% prime virgin polypropylene (PP 05) — no regrind, no recycled content',
          '100% food-grade material with ISO 9001:2015 plant certification',
          'Rated −20°C deep freeze to +120°C microwave reheating',
          'Zero-leak snap-rim geometry across every lidded format',
          'Custom in-mould labelling on any line',
          'ISO 9001:2015 facility, two Daman units, 12+ export markets',
        ],
      },
    },
    closing: {
      label: 'Closing Call to Action',
      content: {
        eyebrow: 'Don’t see your segment?',
        heading: 'Custom formats',
        headingHighlight: 'to specification.',
        description: 'Our in-house CAD toolroom develops new container geometries and multi-cavity moulds. Tell us the product, the volume and the shipping route.',
        button: { text: 'Discuss your requirement', link: '/contact' },
      },
    },
  },
};
