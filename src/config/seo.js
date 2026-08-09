// ============================================================
// Centralized SEO configuration — single source of truth for
// metadata, social sharing tags and structured data.
//
// Used by:
//   • index.html baseline (static, via the build)
//   • vite-plugin-seo.js (robots.txt + sitemap.xml at build time)
//   • <Seo /> runtime component (live data from Supabase)
//
// Only truthful, owner-provided information lives here.
// ============================================================

export const SEO = {
  // Primary brand / search entity
  siteName: 'Mehedi Hasan',
  author: 'Mehedi Hasan',
  email: 'iamehedihsn@gmail.com',

  // Canonical domain (no trailing slash — normalize everywhere)
  siteUrl: 'https://iamehedihsn.iam.bd',

  defaultTitle: 'Mehedi Hasan | AI-Assisted Full-Stack Developer',
  defaultDescription:
    'Mehedi Hasan is an AI-assisted full-stack developer from Rajshahi, Bangladesh, building modern web applications, software, APIs and AI-powered digital products.',

  // Open Graph / Twitter image
  ogImage: 'https://iamehedihsn.iam.bd/og-image.svg',
  ogImageAlt: 'Mehedi Hasan — AI-Assisted Full-Stack Developer',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  locale: 'en_US',

  // Only profiles verified to belong to Mehedi Hasan.
  sameAs: ['https://github.com/iamehedi'],
}

// Splits "Rajshahi, Bangladesh" into locality + country (name → ISO code when known).
const COUNTRY_CODES = { Bangladesh: 'BD' }
const splitLocation = (location = '') => {
  const parts = String(location)
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
  if (parts.length < 2) return [parts[0] || '', parts[1] || '']
  const country = parts[parts.length - 1]
  return [parts[0], COUNTRY_CODES[country] || country]
}

// ---------------------------------------------------------------------------
// JSON-LD builders — pure functions so the browser runtime (<Seo />) and any
// static baseline stay consistent. They always produce truthful data derived
// from profile/project content.
// ---------------------------------------------------------------------------

export function buildPersonLd(profile = {}) {
  const name = profile.name?.trim() || SEO.siteName
  const role = profile.role?.trim()
  const location = profile.location?.trim()
  const [locality, country] = splitLocation(location)
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url: `${SEO.siteUrl}/`,
    image: SEO.ogImage,
    ...(role ? { jobTitle: role } : {}),
    description: SEO.defaultDescription,
    email: profile.email?.trim() || SEO.email,
    ...(locality || country
      ? { address: { '@type': 'PostalAddress', ...(locality ? { addressLocality: locality } : {}), ...(country ? { addressCountry: country } : {}) } }
      : {}),
    sameAs: SEO.sameAs,
  }
}

export function buildWebsiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO.siteName,
    url: `${SEO.siteUrl}/`,
    description: SEO.defaultDescription,
    inLanguage: 'en',
  }
}

export function buildProfilePageLd(profile = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: `${profile.name?.trim() || SEO.siteName} — AI-Assisted Full-Stack Developer`,
    url: `${SEO.siteUrl}/`,
    inLanguage: 'en',
    mainEntity: buildPersonLd(profile),
  }
}

// ItemList of projects — only includes projects that carry real links and a
// description, so placeholder/demo rows are never emitted as structured data.
const isPlaceholderLink = (url) =>
  !url || url === '#' || url === 'https://github.com/' || url === 'https://github.com'

export function buildProjectsLd(projects = [], profile = {}) {
  const author = { '@type': 'Person', name: profile.name?.trim() || SEO.siteName, url: `${SEO.siteUrl}/` }
  const items = (Array.isArray(projects) ? projects : [])
    .filter((p) => p && p.title && p.description && (!isPlaceholderLink(p.demo) || !isPlaceholderLink(p.repo)))
    .map((p) => ({
      '@type': 'CreativeWork',
      name: p.title,
      description: p.description,
      ...(p.demo && p.demo !== '#' ? { url: p.demo } : {}),
      ...(p.repo && !isPlaceholderLink(p.repo) ? { codeRepository: p.repo } : {}),
      ...(Array.isArray(p.tags) && p.tags.length ? { keywords: p.tags.join(', ') } : {}),
      author,
    }))
  if (!items.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Projects by Mehedi Hasan',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, item })),
  }
}
