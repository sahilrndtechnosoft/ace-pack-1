import { redirect } from 'next/navigation';

// Header & Footer now live in Site-wide Settings; keep old bookmarks working.
export default function LegacyHeaderFooterRedirect() {
  redirect('/admin/settings');
}
