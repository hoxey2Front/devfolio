/* filename: components/TypedText.tsx */
'use client'

import React from 'react'

type Props = {
  text: string
  speedMs?: number
  startDelayMs?: number
  loop?: boolean
  pauseMs?: number
  className?: string
  ariaLive?: 'off' | 'polite' | 'assertive'
  cursor?: boolean
}

export default function TypedText({
  text,
  speedMs = 50,
  startDelayMs = 0,
  loop = false,
  pauseMs = 1200,
  className = '',
  ariaLive = 'polite',
  cursor = true,
}: Props) {
  const [visible, setVisible] = React.useState('')
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  React.useEffect(() => {
    let mounted = true
    let timeout: number | undefined

    async function run() {
      setVisible('')
      if (startDelayMs > 0) {
        await new Promise((r) => (timeout = window.setTimeout(r, startDelayMs)))
      }

      const unit = prefersReducedMotion ? 0 : speedMs
      for (let i = 0; i < text.length && mounted; i++) {
        setVisible((prev) => prev + text[i])
        if (unit > 0) {
          await new Promise((r) => (timeout = window.setTimeout(r, unit)))
        }
      }

      if (loop && mounted) {
        const pause = prefersReducedMotion ? 0 : pauseMs
        await new Promise((r) => (timeout = window.setTimeout(r, pause)))
        run()
      }
    }

    run()

    return () => {
      mounted = false
      if (timeout) window.clearTimeout(timeout)
    }
  }, [text, speedMs, startDelayMs, loop, pauseMs, prefersReducedMotion])

  return (
    <span
      aria-live={ariaLive}
      aria-atomic="true"
      className={[
        'inline-block align-baseline gradient-text',
        cursor ? 'cursor-block' : '',
        className,
      ].join(' ')}
    >
      {visible}
    </span>
  )
}
