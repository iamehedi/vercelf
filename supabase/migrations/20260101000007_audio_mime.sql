-- Broaden accepted audio MIME types (some clients report audio/mp3 etc.)
update storage.buckets
set allowed_mime_types = array[
  'audio/mpeg', 'audio/mp3', 'audio/mpeg3', 'audio/wav', 'audio/x-wav',
  'audio/ogg', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/webm', 'audio/flac'
]
where id = 'audio';
