import { GithubIcon, LinkedinIcon, TwitterIcon, DribbbleIcon, FacebookIcon, InstagramIcon, WhatsAppIcon } from '../components/icons'

export const socialIcons = {
  GitHub: GithubIcon,
  LinkedIn: LinkedinIcon,
  Twitter: TwitterIcon,
  Dribbble: DribbbleIcon,
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  WhatsApp: WhatsAppIcon,
}

// A URL without a scheme (e.g. "github.com/iamehedi") would be treated as a
// relative link and open THIS site — force https:// so it goes to the real site.
export const socialUrl = (url) => {
  if (!url) return '#'
  const clean = String(url).trim().replace(/^\/\/+/, '')
  return /^https?:\/\//i.test(clean) ? clean : `https://${clean}`
}
