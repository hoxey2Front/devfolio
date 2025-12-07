/* filename: components/RotatingTyped.tsx */
'use client'

import React from 'react'
import TypedText from './TypedText'

type Props = {
  items: string[]
  speedMs?: number
  pauseMs?: number
  className?: string
}

export default function RotatingTyped({
  items,
  speedMs = 45,
  pauseMs = 1200,
  className = '',
}: Props) {
  const [idx, setIdx] = React.useState(0)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  React.useEffect(() => {
    if (prefersReducedMotion) return
    const t = window.setTimeout(() => {
      setIdx((prev) => (prev + 1) % items.length)
    }, pauseMs + items[idx].length * speedMs + 300)
    return () => window.clearTimeout(t)
  }, [idx, items, speedMs, pauseMs, prefersReducedMotion])

  return (
    <div className={['inline-flex flex-row items-baseline gap-2', className].join(' ')}>
      <span>저는</span>
      <TypedText
        key={items[idx]}
        text={items[idx]}
        speedMs={speedMs}
        startDelayMs={100}
        loop={false}
        pauseMs={pauseMs}
        ariaLive="polite"
        cursor
      />
      <span>입니다.</span>
    </div>
  )
}
