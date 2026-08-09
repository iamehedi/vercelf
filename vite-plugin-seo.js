// ============================================================
// Build-time SEO assets plugin
// ------------------------------------------------
// Generates robots.txt + sitemap.xml into the build output so
// they always match the centralized SEO config (src/config/seo.js)
// and the currently configured admin path (VITE_ADMIN_PATH).
//
// • robots.txt: allows all public resources; disallows the private
//   admin route when VITE_ADMIN_PATH is set (same normalization as
//   src/App.jsx, so the same path is blocked and registered).
// • sitemap.xml: lists only canonical, public, indexable URLs.
// ============================================================

import { loadEnv } from 'vite'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { SEO } from './src/config/seo.js'

// Mirrors App.jsx so robots.txt disallows the exact route the app registers.
const normalizeAdminPath = (raw) => {
  if (!raw) return null
  let path = String(raw).trim()
  if (!path) return null
  if (/^[A-Za-z]:[/\\]/.test(path)) path = path.slice(path.lastIndexOf('/') + 1)
  return path.startsWith('/') ? path : `/${path}`
}

export default function seoPlugin() {
  let outDir
  let adminPath = null

  return {
    name: 'seo-assets',
    apply: 'build',
    config(_config, { mode }) {
      adminPath = normalizeAdminPath(loadEnv(mode, process.cwd(), '').VITE_ADMIN_PATH)
    },
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      if (!outDir) return
      const siteUrl = SEO.siteUrl.replace(/\/+$/, '')

      // ---------- robots.txt ----------
      let robots = 'User-agent: *\nAllow: /\n'
      if (adminPath) robots += `\nDisallow: ${adminPath}\n`
      robots += `\nSitemap: ${siteUrl}/sitemap.xml\n`
      writeFileSync(resolve(outDir, 'robots.txt'), robots)

      // ---------- sitemap.xml ----------
      // Single-page portfolio: the only indexable URL is the homepage.
      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        `  <url>\n    <loc>${siteUrl}/</loc>\n  </url>`,
        '</urlset>',
        '',
      ].join('\n')
      writeFileSync(resolve(outDir, 'sitemap.xml'), xml)
    },
  }
}
