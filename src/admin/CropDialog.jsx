import { useEffect, useState } from 'react'
import Cropper from 'react-easy-crop'
import { Check, X, AlertCircle } from 'lucide-react'

const PRESETS = [
  { id: 'square', label: '1:1', value: 1 },
  { id: 'fourThree', label: '4:3', value: 4 / 3 },
  { id: 'wide', label: '16:9', value: 16 / 9 },
  { id: 'free', label: 'Free', value: undefined },
]
const FREE = PRESETS.find((p) => p.id === 'free').value

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load the image.'))
    img.src = src
  })
}

// Cut the selected region out of the original image and export it as a JPEG blob
async function cropImageToBlob(imageSrc, pixelCrop) {
  const image = await loadImage(imageSrc)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(pixelCrop.width))
  canvas.height = Math.max(1, Math.round(pixelCrop.height))
  const ctx = canvas.getContext('2d')
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  )
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not export the cropped image.'))),
      'image/jpeg',
      0.92,
    ),
  )
}

export default function CropDialog({ src, defaultAspect, onCancel, onConfirm }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspect, setAspect] = useState(defaultAspect ?? FREE)
  const [pixelCrop, setPixelCrop] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  const confirm = async () => {
    if (!pixelCrop || busy) return
    setBusy(true)
    setError(null)
    try {
      const blob = await cropImageToBlob(src, pixelCrop)
      onConfirm(blob)
    } catch (err) {
      setError(err.message || 'Something went wrong while cropping.')
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-night/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Crop photo"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-nightcard"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-2 border-ink/10 px-5 py-3 dark:border-nightline">
          <h3 className="font-display text-lg font-extrabold">Crop photo</h3>
          <button
            type="button"
            onClick={onCancel}
            className="flex size-8 items-center justify-center rounded-full bg-ink/5 hover:bg-ink/10 dark:bg-bone/10"
            aria-label="Close crop"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="relative h-72 bg-night">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_c, px) => setPixelCrop(px)}
          />
        </div>

        <div className="space-y-4 p-5">
          <div>
            <div className="mb-2 flex items-center justify-between text-xs font-extrabold uppercase tracking-wide text-ink/50 dark:text-bone/50">
              <span>Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-punch"
            />
          </div>

          <div>
            <div className="mb-2 text-xs font-extrabold uppercase tracking-wide text-ink/50 dark:text-bone/50">
              Aspect
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setAspect(p.value)}
                  className={`rounded-full border-2 px-4 py-1.5 text-xs font-extrabold transition-colors ${
                    aspect === p.value
                      ? 'border-ink bg-sun text-ink dark:border-bone'
                      : 'border-ink/15 text-ink/60 hover:text-ink dark:border-nightline dark:text-bone/60 dark:hover:text-bone'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="flex items-center gap-2 rounded-2xl border-2 border-punch/30 bg-punch/10 px-4 py-3 text-sm font-bold text-punch">
              <AlertCircle className="size-4" /> {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="sticker inline-flex items-center gap-2 rounded-full bg-ink/5 px-5 py-2.5 text-sm font-extrabold hover:bg-ink/10 dark:bg-bone/10"
            >
              <X className="size-4" /> Cancel
            </button>
            <button
              type="button"
              onClick={confirm}
              disabled={busy || !pixelCrop}
              className="sticker inline-flex items-center gap-2 rounded-full bg-mint px-5 py-2.5 text-sm font-extrabold text-ink disabled:opacity-60"
            >
              <Check className="size-4" /> {busy ? 'Cropping…' : 'Crop & upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
