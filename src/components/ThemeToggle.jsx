import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle({ dark, onToggle, compact = false }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`sticker flex items-center justify-center rounded-xl bg-white dark:bg-nightcard ${
        compact ? 'size-11' : 'w-full px-5 py-3'
      }`}
    >
      {dark ? (
        <Sun className="size-5 text-sun" />
      ) : (
        <Moon className="size-5 text-grape" />
      )}
      {!compact && <span className="ml-2 text-sm font-extrabold">{dark ? 'Light mode' : 'Dark mode'}</span>}
    </button>
  )
}
