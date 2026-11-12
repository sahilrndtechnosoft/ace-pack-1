// Lead scoring for site visitors. The score is computed in SQL (so the admin list can filter,
// sort and paginate by it); `leadReasons` turns the same signals into plain-language labels.

export const HOT_LEAD_SCORE = 50;
export const WARM_LEAD_SCORE = 25;

const PRODUCT_PAGES = "(page_url LIKE '/plastic-food-containers%' OR page_url LIKE '/categories%' OR page_url LIKE '/products%')";
const CONTACT_PAGES = "(page_url LIKE '/contact%' OR page_url LIKE '/downloads%')";

/**
 * One row per visitor with engagement signals, linked inquiry and lead score.
 * shortcut: aggregates visitor_logs on every request; fine to ~100k page views, then precompute
 * the per-visitor counters on site_visitors when tracking a page view.
 */
export const SCORED_VISITORS_SQL = `
  SELECT
    v.id, v.visitor_id, v.ip_address, v.user_agent, v.device_type, v.browser, v.os,
    v.initial_landing_page, v.initial_referrer, v.country, v.city, v.visit_count,
    v.first_visit_at, v.last_visit_at,
    COALESCE(l.pageviews, 0) AS pageviews,
    COALESCE(l.product_views, 0) AS product_views,
    COALESCE(l.contact_views, 0) AS contact_views,
    COALESCE(c.inquiries, 0) AS inquiries,
    COALESCE(ipc.inquiries, 0) AS ip_inquiries,
    c.lead_name, c.lead_company, c.lead_email,
    COALESCE(sip.n, 1) - 1 AS same_ip,
    COALESCE(sdev.n, 1) - 1 AS same_device,
    LEAST(100,
        (COALESCE(c.inquiries, 0) > 0) * 50
      + (COALESCE(c.inquiries, 0) = 0 AND COALESCE(ipc.inquiries, 0) > 0) * 15
      + LEAST(COALESCE(l.product_views, 0), 5) * 4
      + (COALESCE(l.contact_views, 0) > 0) * 10
      + LEAST(GREATEST(v.visit_count - 1, 0), 4) * 5
      + (v.last_visit_at >= NOW() - INTERVAL 3 DAY) * 10
      + LEAST(COALESCE(l.pageviews, 0), 10)
    ) AS lead_score
  FROM site_visitors v
  LEFT JOIN (
    SELECT visitor_id, COUNT(*) AS pageviews,
      SUM(${PRODUCT_PAGES}) AS product_views,
      SUM(${CONTACT_PAGES}) AS contact_views
    FROM visitor_logs GROUP BY visitor_id
  ) l ON l.visitor_id = v.visitor_id
  LEFT JOIN (
    SELECT visitor_id, COUNT(*) AS inquiries,
      SUBSTRING_INDEX(GROUP_CONCAT(name ORDER BY created_at DESC SEPARATOR '\\n'), '\\n', 1) AS lead_name,
      SUBSTRING_INDEX(GROUP_CONCAT(COALESCE(company, '') ORDER BY created_at DESC SEPARATOR '\\n'), '\\n', 1) AS lead_company,
      SUBSTRING_INDEX(GROUP_CONCAT(email ORDER BY created_at DESC SEPARATOR '\\n'), '\\n', 1) AS lead_email
    FROM contact_submissions WHERE visitor_id IS NOT NULL GROUP BY visitor_id
  ) c ON c.visitor_id = v.visitor_id
  LEFT JOIN (
    -- Inquiries sent before visitor linking existed can only be matched by network address.
    SELECT ip_address, COUNT(*) AS inquiries FROM contact_submissions WHERE visitor_id IS NULL GROUP BY ip_address
  ) ipc ON ipc.ip_address = v.ip_address
  LEFT JOIN (SELECT ip_address, COUNT(*) AS n FROM site_visitors GROUP BY ip_address) sip ON sip.ip_address = v.ip_address
  LEFT JOIN (
    SELECT ip_address, user_agent, COUNT(*) AS n FROM site_visitors GROUP BY ip_address, user_agent
  ) sdev ON sdev.ip_address = v.ip_address AND sdev.user_agent <=> v.user_agent
`;

export type LeadTier = 'hot' | 'warm' | 'cold';

export function leadTier(score: number): LeadTier {
  return score >= HOT_LEAD_SCORE ? 'hot' : score >= WARM_LEAD_SCORE ? 'warm' : 'cold';
}

export interface LeadSignals {
  inquiries: number;
  ip_inquiries: number;
  product_views: number;
  contact_views: number;
  visit_count: number;
  pageviews: number;
  last_visit_at: string | Date;
}

/** Why a visitor scored what it did, in the order a salesperson cares about. */
export function leadReasons(v: LeadSignals, now = Date.now()): string[] {
  const reasons: string[] = [];
  if (v.inquiries > 0) reasons.push(`Sent ${v.inquiries} inquir${v.inquiries === 1 ? 'y' : 'ies'}`);
  else if (v.ip_inquiries > 0) reasons.push('Inquiry sent from the same network');
  if (v.product_views > 0) reasons.push(`Viewed ${v.product_views} product page${v.product_views === 1 ? '' : 's'}`);
  if (v.contact_views > 0) reasons.push('Visited Contact / Downloads');
  if (v.visit_count > 1) reasons.push(`${v.visit_count} visits`);
  if (now - new Date(v.last_visit_at).getTime() <= 3 * 24 * 60 * 60 * 1000) reasons.push('Active in the last 3 days');
  if (v.pageviews > 0) reasons.push(`${v.pageviews} page view${v.pageviews === 1 ? '' : 's'}`);
  return reasons;
}
