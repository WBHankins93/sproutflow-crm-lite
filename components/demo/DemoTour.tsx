'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type TourStep = {
  /** Stable key for the step. */
  key: string
  /** Short numbered title, e.g. "1 · Review follow-ups". */
  title: string
  /** One-line explanation shown in the tooltip. */
  body: string
  /** `data-tour` value of the element to highlight. */
  anchor: string
  /** Where to pin the tooltip so it stays clear of the highlighted target. */
  placement?: 'bottom-center' | 'bottom-left' | 'bottom-right'
  /** Runs when the step becomes active — used to switch the demo view. */
  onEnter?: () => void
}

const PLACEMENTS = {
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  'bottom-left': 'bottom-6 left-6',
  'bottom-right': 'bottom-6 right-6',
} as const

/**
 * Lightweight, non-blocking guided tour. Rings the element matching the active
 * step's `data-tour` anchor and shows a fixed tooltip with step navigation.
 * Highlighting is done by toggling a class on the real element, so it tracks
 * the target across layouts without any pixel math. The underlying demo stays
 * interactive so people can follow along.
 */
export function DemoTour({
  steps,
  open,
  onClose,
}: {
  steps: TourStep[]
  open: boolean
  onClose: () => void
}) {
  const [index, setIndex] = useState(0)

  const step = steps[index]

  // Let the active step drive the demo (switch view, select a record, …).
  useEffect(() => {
    if (open) step?.onEnter?.()
  }, [open, step])

  // Ring the active step's target. A step can switch the demo view, so the
  // element may mount a frame or two later — retry across frames until found.
  useEffect(() => {
    if (!open || !step) return

    let highlighted: HTMLElement | null = null
    let frame = 0
    let attempts = 0

    const apply = () => {
      const el = document.querySelector<HTMLElement>(`[data-tour="${step.anchor}"]`)
      if (el) {
        highlighted = el
        el.classList.add('demo-tour-highlight')
        el.scrollIntoView({ block: 'nearest' })
        return true
      }
      return false
    }

    const tick = () => {
      if (apply() || attempts >= 20) return
      attempts += 1
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      highlighted?.classList.remove('demo-tour-highlight')
    }
  }, [open, step])

  if (!open || !step) return null

  const isFirst = index === 0
  const isLast = index === steps.length - 1

  const close = () => {
    setIndex(0)
    onClose()
  }

  return (
    <div
      className={`pointer-events-none fixed z-50 w-[min(420px,calc(100vw-2rem))] ${
        PLACEMENTS[step.placement ?? 'bottom-center']
      }`}
      role="dialog"
      aria-modal="false"
      aria-label="Demo guided tour"
    >
      <div className="pointer-events-auto rounded-xl border bg-card p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Step {index + 1} of {steps.length}
            </p>
            <h3 className="font-display text-lg font-semibold">{step.title}</h3>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Skip tour"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>

        {/* Progress dots */}
        <div className="mt-4 flex items-center gap-1.5" aria-hidden>
          {steps.map((s, i) => (
            <span
              key={s.key}
              className={
                i === index
                  ? 'h-1.5 w-5 rounded-full bg-primary transition-all'
                  : 'h-1.5 w-1.5 rounded-full bg-border transition-all'
              }
            />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={close}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Skip
          </button>
          <div className="flex items-center gap-2">
            {!isFirst && (
              <Button variant="outline" size="sm" onClick={() => setIndex((i) => i - 1)}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            )}
            {isLast ? (
              <Button size="sm" onClick={close}>
                <Check className="mr-1 h-4 w-4" />
                Done
              </Button>
            ) : (
              <Button size="sm" onClick={() => setIndex((i) => i + 1)}>
                Next
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
