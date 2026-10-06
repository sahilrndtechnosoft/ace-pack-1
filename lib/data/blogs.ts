export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  image: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  content: string[];
  takeaways: string[];
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 'b1',
    slug: '5-ways-hinge-cups-drive-qsr-satisfaction',
    title: '5 Ways Hinge Cups Drive Customer Satisfaction in Quick-Service Restaurants',
    category: 'Takeaway Trends',
    date: '2026-08-24',
    readTime: '4 min read',
    summary: 'Discover how one-piece hinged plastic cups eliminate lid misplacement, prevent sauce leaks during motorcycle delivery, and streamline kitchen speed.',
    image: 'https://plus.unsplash.com/premium_photo-1664392020927-9344e87b378d?q=80&w=800&auto=format&fit=crop',
    author: {
      name: 'Rajesh Sharma',
      role: 'Packaging Systems Director',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop'
    },
    content: [
      'In high-volume quick-service restaurants and cloud kitchens, every second saved during food assembly impacts order accuracy and customer rating scores.',
      'One-piece hinged plastic container cups have emerged as an industry staple for chutneys, gravies, dips, and dressings due to their zero-leak seal and pre-attached lid design.',
      'Unlike traditional separate lid cups where kitchen staff must search for matching caps, hinged cups snap shut instantly with one hand, reducing packing time by up to 35%.'
    ],
    takeaways: [
      'Attached hinged lids eliminate lost or mismatched cap inventory in busy kitchens.',
      'Hermetic snap-rim prevents sauce spills inside takeaway delivery bags.',
      '100% Virgin PP 05 polymer ensures hot sauces remain safe without warping.',
      'Stackable base geometry optimizes refrigerator prep space.'
    ],
    tags: ['Hinge Cups', 'QSR Takeaway', 'Cloud Kitchen', 'Food Safety']
  },
  {
    id: 'b2',
    slug: 'pp-05-polymer-safety-hot-soups-gravies',
    title: 'Why Virgin PP 05 Polypropylene is the Gold Standard for Hot Soups & Curries',
    category: 'Food Safety Standards',
    date: '2026-08-20',
    readTime: '6 min read',
    summary: 'An engineering deep-dive into thermal resistance (-20°C to +120°C), US FDA food-grade compliance, and microwave safety for takeaway containers.',
    image: 'https://plus.unsplash.com/premium_photo-1701213306445-9874fe01971a?w=800&auto=format&fit=crop',
    author: {
      name: 'Dr. Anita Mehta',
      role: 'Chief Polymer Scientist',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop'
    },
    content: [
      'When hot gravies and soups at temperatures exceeding 80°C are poured into low-grade containers, plastic softening and harmful chemical leaching become major health concerns.',
      'Virgin Polypropylene (PP 05) features high heat distortion resistance, enabling microwave reheating up to 120°C without structural sagging or chemical emission.',
      'Ace Packaging uses 100% prime virgin PP 05 resins certified under US FDA 21 CFR 177.1520 guidelines, ensuring complete BPA-free safety for end consumers.'
    ],
    takeaways: [
      'Resists thermal deformation up to +120°C for direct hot soup pouring.',
      'BPA-free & Phthalate-free food-contact safe material.',
      'Freezer safe down to -20°C without cracking or becoming brittle.',
      'Fully recyclable polypropylene supporting circular economy initiatives.'
    ],
    tags: ['PP 05', 'Food Safety', 'Microwave Safe', 'FDA Compliant']
  },
  {
    id: 'b3',
    slug: 'custom-iml-branding-for-cloud-kitchens',
    title: 'Custom In-Mould Labelling (IML) for Cloud Kitchen Container Branding',
    category: 'Branding & Design',
    date: '2026-08-15',
    readTime: '5 min read',
    summary: 'How full-color high-definition IML graphics fused directly into plastic container walls elevate brand recall and unboxing experience.',
    image: 'https://plus.unsplash.com/premium_photo-1701213306583-082f9bfd88b4?w=800&auto=format&fit=crop',
    author: {
      name: 'Karan Malhotra',
      role: 'Brand & Design Strategist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop'
    },
    content: [
      'In the competitive cloud kitchen landscape, customer unboxing is often the primary physical touchpoint between a brand and its diner.',
      'Paper labels frequently peel off or smear when exposed to condensation from hot meals. In-Mould Labelling (IML) fuses vibrant artwork directly into the plastic wall during moulding.',
      'The result is a scratch-proof, moisture-proof, photo-realistic branded container that customers reuse in their homes, extending brand visibility for months.'
    ],
    takeaways: [
      '100% moisture-proof and oil-resistant full-color artwork.',
      'Fused during moulding — will never peel, bleed, or tear.',
      'High consumer reuse value extends brand impression lifespan.',
      'Suitable for round tubs, rectangular bento boxes, and sweet containers.'
    ],
    tags: ['IML Branding', 'Cloud Kitchen', 'Custom Containers', 'Packaging Design']
  }
];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find((post) => post.slug === slug);
};

export const getAllBlogSlugs = (): string[] => {
  return blogPosts.map((post) => post.slug);
};
