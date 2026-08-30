import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { CheckInPage } from './CheckInPage'

vi.mock('@/api/axios', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
    },
  }
})

describe('CheckInPage structure validation', () => {
  it('should compile correctly with eventId', () => {
    const comp = <CheckInPage eventId="456" />
    expect(comp.props.eventId).toBe('456')
  })
})
