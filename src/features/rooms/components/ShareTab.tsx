import { QRCodeSVG } from 'qrcode.react'
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import { normalizeShareLink } from '@/features/rooms/utils/normalizeShareLink'

interface ShareTabProps {
  initialLink?: string
}

export function ShareTab({ initialLink = '' }: ShareTabProps) {
  const [linkInput, setLinkInput] = useState(initialLink)
  const [qrLink, setQrLink] = useState<string | null>(() =>
    normalizeShareLink(initialLink),
  )
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [qrSize, setQrSize] = useState(280)
  const frameRef = useRef<HTMLDivElement>(null)
  const canNativeShare = typeof navigator.share === 'function'

  useEffect(() => {
    setLinkInput(initialLink)
    setQrLink(normalizeShareLink(initialLink))
    setError('')
  }, [initialLink])

  // Grow QR to fill the frame (almost full viewport width on phones).
  useEffect(() => {
    const el = frameRef.current
    if (!el) return

    const update = () => {
      const side = Math.floor(Math.min(el.clientWidth, el.clientHeight))
      setQrSize(Math.max(160, side - 32))
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [qrLink])

  function handleGenerate(event: FormEvent) {
    event.preventDefault()
    const normalized = normalizeShareLink(linkInput)

    if (!normalized) {
      setError('Paste a valid link (e.g. https://example.com/page).')
      setQrLink(null)
      return
    }

    setError('')
    setQrLink(normalized)
  }

  async function copyLink() {
    if (!qrLink) return

    try {
      await navigator.clipboard.writeText(qrLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  async function shareLink() {
    if (!qrLink) return

    if (!canNativeShare) {
      await copyLink()
      return
    }

    try {
      await navigator.share({
        title: 'Quick Note',
        text: 'Open this link',
        url: qrLink,
      })
    } catch {
      // user cancelled share sheet
    }
  }

  function downloadQr() {
    const svg = frameRef.current?.querySelector('svg')
    if (!svg || !qrLink) return

    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svg)
    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    })
    const url = URL.createObjectURL(svgBlob)

    const img = new Image()
    img.onload = () => {
      const pad = 24
      const canvas = document.createElement('canvas')
      canvas.width = img.width + pad * 2
      canvas.height = img.height + pad * 2
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(url)
        return
      }
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, pad, pad)

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url)
        if (!blob) return
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(blob)
        a.href = objectUrl
        a.download = 'quick-note-qr.png'
        a.click()
        URL.revokeObjectURL(objectUrl)
      }, 'image/png')
    }
    img.onerror = () => URL.revokeObjectURL(url)
    img.src = url
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4">
      <form onSubmit={handleGenerate} className="shrink-0 space-y-3">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-300">
            Paste link
          </span>
          <input
            type="url"
            value={linkInput}
            onChange={(event) => {
              setLinkInput(event.target.value)
              setError('')
            }}
            placeholder="https://… or paste room link"
            autoComplete="off"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-base outline-none ring-emerald-500/0 transition focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/20"
          />
        </label>

        {error ? (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
        >
          Generate QR
        </button>
      </form>

      {qrLink ? (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div
            ref={frameRef}
            className="flex min-h-[min(70vw,420px)] flex-1 items-center justify-center rounded-2xl bg-white p-4 shadow-lg shadow-black/20"
          >
            <QRCodeSVG
              value={qrLink}
              size={qrSize}
              level="M"
              includeMargin
              aria-label="QR code for pasted link"
            />
          </div>

          <p className="shrink-0 break-all text-center text-xs text-zinc-500">
            {qrLink}
          </p>

          <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={downloadQr}
              className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:border-emerald-500/60 hover:bg-emerald-500/20"
            >
              Download
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="rounded-xl border border-zinc-700 px-4 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:text-white"
            >
              {copied ? 'Copied!' : 'Copy link'}
            </button>
            <button
              type="button"
              onClick={shareLink}
              className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
            >
              {canNativeShare ? 'Share' : 'Copy & share'}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-zinc-500">
          Paste any link above, then tap Generate QR.
        </p>
      )}
    </section>
  )
}
