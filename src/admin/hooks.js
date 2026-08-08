import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useRows(table) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRows = useCallback(async () => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('sort_order')
    if (error) setError(error.message)
    else setRows(data || [])
  }, [table])

  useEffect(() => {
    setLoading(true)
    fetchRows().finally(() => setLoading(false))
    const channel = supabase
      .channel(`admin-${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, fetchRows)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [fetchRows, table])

  return { rows, loading, error, fetchRows }
}

const MAX_BYTES = 50 * 1024 * 1024 // 50 MiB — matches the bucket limit

// Client-side pre-checks. The server (bucket allowlist + RLS) is the real gate;
// these just fail fast with a clear message instead of a confusing upload error.
function assertFile(file, label, types, extTest) {
  if (!file) throw new Error('No file selected.')
  if (!types.some((t) => file.type.startsWith(t)) && !(extTest && extTest(file.name))) {
    throw new Error(`${label} must be ${types.join(' or ')} (got "${file.type || 'unknown'}").`)
  }
  if (file.size > MAX_BYTES) throw new Error(`${label} is too large — max 50 MB.`)
}

const isPdf = (name) => name.toLowerCase().endsWith('.pdf')

async function uploadTo(bucket, folder, file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
  const path = `${folder}/${Date.now()}-${safeName}`
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) throw new Error(error.message)
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export const uploadPhoto = (file) => {
  assertFile(file, 'Photo', ['image/'])
  return uploadTo('photos', 'gallery', file)
}
export const uploadAudio = (file) => {
  assertFile(file, 'Audio file', ['audio/'])
  return uploadTo('audio', 'music', file)
}
export const uploadResume = (file) => {
  assertFile(file, 'Résumé', ['application/pdf'], isPdf)
  return uploadTo('photos', 'resume', file)
}
