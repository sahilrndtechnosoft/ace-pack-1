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
    slug: 'leak-proof-food-containers-what-to-check-before-buying-in-bulk',
    title: 'Leak-Proof Food Containers: What to Check Before Buying in Bulk',
    category: 'Buying Guide',
    date: '2026-10-07',
    readTime: '4 min read',
    summary: 'Discover what critical features to verify when sourcing leak-proof food containers in bulk for cloud kitchens and takeaway restaurants.',
    image: '/images/food-pairings/sauces-dips.webp',
    author: {
      name: 'Ace Packaging Editorial',
      role: 'Packaging Systems Team',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop'
    },
    content: [
      'In high-volume quick-service restaurants and cloud kitchens, every container must withstand the rigors of motorcycle delivery and rough transit without leaks.',
      'Checking rim snap locks, wall thickness uniformity, and virgin PP 05 polymer grades ensures liquids, gravies, and hot oils stay securely sealed.',
      'Ace Packaging containers undergo rigorous vacuum leak testing and drop testing to ensure pristine delivery to the customer.'
    ],
    takeaways: [
      'Look for continuous perimeter snap seals that lock hermetically.',
      'Ensure 100% virgin PP 05 material certification to prevent warping.',
      'Verify thermal resistance for microwave and freezer compatibility.',
      'Inspect stacking lugs for delivery tote stability.'
    ],
    tags: ['Leak-Proof', 'Bulk Purchase', 'Food Packaging', 'QSR Delivery']
  },
  {
    id: 'b2',
    slug: 'food-packaging-for-hot-vs-cold-foods-what-businesses-should-consider',
    title: 'Food Packaging for Hot vs Cold Foods: What Businesses Should Consider',
    category: 'Food Safety',
    date: '2026-09-30',
    readTime: '5 min read',
    summary: 'A comprehensive guide on selecting the right plastic containers tailored to extreme hot curry and boiling soup versus frozen dairy storage.',
    image: '/images/food-pairings/curry-biryani.webp',
    author: {
      name: 'Ace Packaging Editorial',
      role: 'Technical Quality Team',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop'
    },
    content: [
      'Hot foods require thermal resistance up to 120°C with no chemical migration, while cold and frozen desserts demand crack resistance down to -20°C.',
      'Using prime virgin polypropylene (PP 05) provides a wide operating window across both freezing storage and microwave reheating without deformation.',
      'Ace Packaging designs containers with specialized wall geometries to handle temperature shifts seamlessly.'
    ],
    takeaways: [
      'Resists thermal deformation up to +120°C for direct hot food pouring.',
      'BPA-free & non-toxic food contact safe manufactured in an ISO 9001:2015 certified facility.',
      'Freezer safe down to -20°C without embrittlement or cracking.',
      'Airtight lid locks preserve internal moisture and freshness.'
    ],
    tags: ['Hot Food Packaging', 'Cold Storage', 'Thermal Range', 'Virgin PP 05']
  },
  {
    id: 'b3',
    slug: 'what-makes-a-food-container-suitable-for-takeaway-and-delivery',
    title: 'What Makes a Food Container Suitable for Takeaway and Delivery?',
    category: 'Packaging Insights',
    date: '2026-09-29',
    readTime: '5 min read',
    summary: 'Understanding the key engineering factors—from structural stacking ridges to living hinges—that guarantee pristine unboxing for delivery apps.',
    image: '/images/food-pairings/bento-meal.webp',
    author: {
      name: 'Ace Packaging Editorial',
      role: 'Design Engineering Team',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop'
    },
    content: [
      'In the competitive food delivery landscape, the packaging is the primary physical representation of a brand’s culinary quality.',
      'Food containers must feature tight rim locks that prevent lid pop-off during bike transit and compartmentalized partitions that keep gravies separate.',
      'Ace Packaging engineers every container with robotic precision in Daman to ensure 100% reliability for delivery businesses.'
    ],
    takeaways: [
      'Compartment isolation prevents sauce and curry cross-mixing.',
      'Living hinge designs eliminate detached or lost lid inventory.',
      'High-clarity optical lids enhance visual appetite appeal.',
      '100% recyclable polypropylene supports sustainable brand initiatives.'
    ],
    tags: ['Takeaway Containers', 'Delivery Packaging', 'Cloud Kitchen', 'Ace Packaging']
  }
];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find((post) => post.slug === slug);
};

export const getAllBlogSlugs = (): string[] => {
  return blogPosts.map((post) => post.slug);
};
