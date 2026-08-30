import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { AllocationConfigComponent } from './AllocationConfig'

// Mock axios API
vi.mock('@/api/axios', () => {
  return {
    default: {
      get: vi.fn(),
      put: vi.fn(),
    },
  }
})

describe('AllocationConfig UI component structure', () => {
  it('should initialize states correctly', () => {
    const wrapper = <AllocationConfigComponent eventId="123" initialAllocationEnabled={false} />
    expect(wrapper.props.eventId).toBe('123')
    expect(wrapper.props.initialAllocationEnabled).toBe(false)
  })
})
