import { describe, expect, it } from 'vitest'
import {
  clientSchema,
  leadSchema,
  noteSchema,
  parseFormData,
} from './validation'

describe('leadSchema', () => {
  it('accepts a minimal lead and applies the default status', () => {
    const result = leadSchema.safeParse({ name: 'Maya Brooks' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Maya Brooks')
      expect(result.data.status).toBe('new')
    }
  })

  it('requires a non-empty name', () => {
    const result = leadSchema.safeParse({ name: '   ' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Name is required')
    }
  })

  it('coerces blank optional fields to null', () => {
    const result = leadSchema.safeParse({
      name: 'Maya',
      email: '',
      phone: '',
      source: '',
      follow_up_date: '',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBeNull()
      expect(result.data.phone).toBeNull()
      expect(result.data.source).toBeNull()
      expect(result.data.follow_up_date).toBeNull()
    }
  })

  it('trims and keeps a valid email', () => {
    const result = leadSchema.safeParse({ name: 'Maya', email: '  maya@example.com  ' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('maya@example.com')
    }
  })

  it('rejects a malformed email', () => {
    const result = leadSchema.safeParse({ name: 'Maya', email: 'not-an-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Enter a valid email address')
    }
  })

  it('rejects an out-of-enum status', () => {
    const result = leadSchema.safeParse({ name: 'Maya', status: 'archived' })
    expect(result.success).toBe(false)
  })

  it('rejects a non ISO follow-up date', () => {
    const result = leadSchema.safeParse({ name: 'Maya', follow_up_date: 'June 15' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Enter a valid follow-up date')
    }
  })

  it('keeps a valid ISO follow-up date', () => {
    const result = leadSchema.safeParse({ name: 'Maya', follow_up_date: '2026-06-15' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.follow_up_date).toBe('2026-06-15')
    }
  })
})

describe('clientSchema', () => {
  it('defaults status to active', () => {
    const result = clientSchema.safeParse({ name: 'Avery Stone' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe('active')
    }
  })

  it('rejects an unknown client status', () => {
    const result = clientSchema.safeParse({ name: 'Avery', status: 'converted' })
    expect(result.success).toBe(false)
  })
})

describe('noteSchema', () => {
  it('requires a non-empty body', () => {
    expect(noteSchema.safeParse({ body: '' }).success).toBe(false)
    expect(noteSchema.safeParse({ body: 'Followed up by phone' }).success).toBe(true)
  })
})

describe('parseFormData', () => {
  it('parses FormData entries through a schema', () => {
    const formData = new FormData()
    formData.set('name', 'Jordan Ellis')
    formData.set('email', 'jordan@example.com')
    formData.set('status', 'contacted')

    const result = parseFormData(leadSchema, formData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Jordan Ellis')
      expect(result.data.email).toBe('jordan@example.com')
      expect(result.data.status).toBe('contacted')
    }
  })

  it('surfaces validation errors from FormData', () => {
    const formData = new FormData()
    formData.set('name', '')

    const result = parseFormData(leadSchema, formData)
    expect(result.success).toBe(false)
  })
})
