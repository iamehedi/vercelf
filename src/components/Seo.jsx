import { useEffect } from 'react'
import { useContent } from '../lib/useContent'
import {
  SEO,
  buildPersonLd,
  buildWebsiteLd,
  buildProfilePageLd,
  buildProjectsLd,
} from '../config/seo'

// Keeps <head> metadata in sync with the live content (Supabase + fallbacks).
// This is the "self-updating SEO" layer: when the profile changes in the admin
// panel, the title, description, canonical, social tags and JSON-LD follow.
// The static baseline lives in index.html so crawlers that don't run JS still
// see complete metadata.

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertJsonLd(id, data) {
  // Remove the script when there is nothing to emit (e.g. no real projects)
  // so a stale block never lingers in the DOM.
  const existing = document.getElementById(id)
  if (!data) {
    existing?.remove()
    return
  }
  if (!existing) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = id
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)
    return
  }
  existing.textContent = JSON.stringify(data)
}

export default function Seo() {
  const { profile, projects } = useContent()

  useEffect(() => {
    const name = profile?.name?.trim() || SEO.siteName
    const role = profile?.role?.trim()
    // Custom admin-set title wins; otherwise auto-compose from name + role.
    const title =
      profile?.seoTitle?.trim() ||
      (name && role ? `${name} | ${role}` : SEO.defaultTitle)
    const description = profile?.metaDescription?.trim() || SEO.defaultDescription
    const ogImage = profile?.ogImage?.trim() || SEO.ogImage
    const canonical = `${SEO.siteUrl}/`

    document.title = title
    upsertMeta('name', 'description', description)
    upsertMeta('name', 'author', name)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('property', 'og:image', ogImage)
    upsertMeta('property', 'og:image:alt', SEO.ogImageAlt)
    upsertMeta('property', 'og:image:width', String(SEO.ogImageWidth))
    upsertMeta('property', 'og:image:height', String(SEO.ogImageHeight))
    upsertMeta('property', 'og:site_name', SEO.siteName)
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', ogImage)
    upsertMeta('name', 'twitter:image:alt', SEO.ogImageAlt)

    const canonicalLink = document.head.querySelector('link[rel="canonical"]')
    if (canonicalLink) canonicalLink.setAttribute('href', canonical)

    upsertJsonLd('ld-website', buildWebsiteLd())
    upsertJsonLd('ld-person', buildPersonLd(profile))
    upsertJsonLd('ld-profilepage', buildProfilePageLd(profile))
    upsertJsonLd('ld-projects', buildProjectsLd(projects, profile))
  }, [profile, projects])

  return null
}
