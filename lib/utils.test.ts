import { describe, expect, it } from 'vitest'
import { cn, getInitials } from './utils'

describe('getInitials', () => {
  it('uses the first letters of the first two words', () => {
    expect(getInitials('Maya Brooks')).toBe('MB')
    expect(getInitials('jordan kyle ellis')).toBe('JK')
  })

  it('handles a single-word name', () => {
    expect(getInitials('Madonna')).toBe('M')
  })

  it('falls back to the email when no name is given', () => {
    expect(getInitials(null, 'avery@example.com')).toBe('A')
  })

  it('falls back to "U" when neither name nor email is usable', () => {
    expect(getInitials()).toBe('U')
    expect(getInitials('', '')).toBe('U')
  })
})

describe('cn', () => {
  it('merges conflicting tailwind classes, last one wins', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('drops falsy values', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c')
  })
})
