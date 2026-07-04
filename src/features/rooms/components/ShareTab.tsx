import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState, type FormEvent } from 'react'
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
  const canNativeShare = typeof navigator.share === 'function'

  useEffect(() => {
    setLinkInput(initialLink)
    setQrLink(normalizeShareLink(initialLink))
    setError('')
  }, [initialLink])

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

  return (
    <section className="flex flex-1 flex-col gap-6 py-2">
      <form onSubmit={handleGenerate} className="space-y-4">
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
        <div className="flex flex-col items-center gap-6">
          <div className="rounded-2xl bg-white p-5 shadow-lg shadow-black/20">
            <QRCodeSVG
              value={qrLink}
              size={220}
              level="M"
              includeMargin
              aria-label="QR code for pasted link"
            />
          </div>

          <p className="max-w-sm break-all text-center text-xs text-zinc-500">
            {qrLink}
          </p>

          <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={copyLink}
              className="flex-1 rounded-xl border border-zinc-700 px-4 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:text-white"
            >
              {copied ? 'Copied!' : 'Copy link'}
            </button>
            <button
              type="button"
              onClick={shareLink}
              className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
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
