// The dark title banner used at the top of most inner pages (components/ui/PageBanner).
export type BannerContent = {
  badge: string;
  title: string;
  subtitle: string;
  bgImage: string;
};

export const DEFAULT_BANNER_IMAGE = '/b9d572a7-af59-4e63-92e8-2971440edffe.png';

export function bannerSection(content: BannerContent) {
  return { label: 'Page Banner', description: 'Title strip at the top of the page.', content };
}
