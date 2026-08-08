import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DataProvider } from './lib/DataContext'
import Portfolio from './Portfolio'

const Admin = lazy(() => import('./admin/Admin'))

// Secret admin path — set VITE_ADMIN_PATH in .env.local.
// Fail-closed: without it, the admin route is not registered at all.
//
// Git Bash (MSYS) mangles leading-slash env values when it spawns Windows
// tooling: "/iamdaddy" arrives as "C:/Program Files/Git/iamdaddy". Normalize
// so the admin route survives builds from any shell. The path is obscurity
// only — Supabase Auth + RLS remain the real security boundary.
const normalizeAdminPath = (raw) => {
  if (!raw) return null
  let path = String(raw).trim()
  if (!path) return null // whitespace-only → fail closed, no admin route
  // Windows-drive-prefixed Git path → keep the last segment (e.g. "iamdaddy")
  if (/^[A-Za-z]:[/\\]/.test(path)) path = path.slice(path.lastIndexOf('/') + 1)
  return path.startsWith('/') ? path : `/${path}`
}
const adminPath = normalizeAdminPath(import.meta.env.VITE_ADMIN_PATH)

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream dark:bg-night">
      <span className="text-4xl">🛠️</span>
    </div>
  )
}

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            {adminPath && adminPath !== '/' && <Route path={adminPath} element={<Admin />} />}
            <Route path="*" element={<Portfolio />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </DataProvider>
  )
}
