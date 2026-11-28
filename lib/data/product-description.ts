import { capacityLabel, type ProductCategory, type ProductItem } from './products';

export interface ProductDescription {
  paragraphs: string[];
  features: string[];
}

const listJoin = (items: string[]) =>
  items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

/** Features are stored as "01. Premium Quality"; drop the numbering and duplicates. */
function cleanFeatures(features: string[]): string[] {
  const seen = new Set<string>();
  return features
    .map((f) => f.replace(/^\s*\d+\.\s*/, '').trim())
    .filter((f) => f && !seen.has(f.toLowerCase()) && seen.add(f.toLowerCase()));
}

/**
 * The admin "Description" field wins (blank lines split paragraphs). Products without one get
 * a description written from their own specs, so every detail page has full copy.
 */
export function productDescription(product: ProductItem, category: ProductCategory): ProductDescription {
  const features = cleanFeatures(product.features?.length ? product.features : category.features);
  const own = product.description?.trim();
  if (own) return { paragraphs: own.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean), features };

  const capacity = capacityLabel(product.capacity);
  const paragraphs = [
    `The ${product.name} is a ${capacity} container from our ${category.name} range${
      category.subtitleName ? ` (${category.subtitleName})` : ''
    }. It is injection-moulded from ${product.material || '100% virgin food-grade polypropylene'}, giving a rigid, food-safe body that holds its shape when filled, stacked and transported.`,
  ];

  const d = product.dimensions;
  if (d) {
    const size = d.bottom
      ? `${d.top} across the top, ${d.bottom} at the base and ${d.height} tall`
      : `${d.top} across and ${d.height} tall`;
    paragraphs.push(
      `It measures ${size}. The rim is moulded to close securely with its matching lid, helping to prevent leaks and spills during handling and delivery, while the even wall thickness keeps the container stable on the counter and in the carton.`
    );
  }

  if (product.applications?.length) {
    paragraphs.push(
      `Typical uses include ${listJoin(product.applications.map((a) => a.toLowerCase()))}. It suits restaurants, cloud kitchens, caterers, sweet shops and food brands that need consistent, presentable packaging in volume.`
    );
  }

  if (product.varieties?.length) {
    paragraphs.push(
      `Available in ${listJoin(product.varieties.map((v) => v.name))} finishes, so you can match the container to your food and your brand.`
    );
  }

  return { paragraphs, features };
}
