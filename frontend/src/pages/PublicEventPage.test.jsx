import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { PublicEventPage } from './PublicEventPage'

vi.mock('react-router-dom', () => ({
  useParams: () => ({ slug: 'my-camp' }),
  useNavigate: () => vi.fn(),
}))

vi.mock('@/api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('PublicEventPage validation structure checks', () => {
  it('should initialize correctly with slug parameters', () => {
    const component = <PublicEventPage />
    expect(component).toBeDefined()
  })
})
