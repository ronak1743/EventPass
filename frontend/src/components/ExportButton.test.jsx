import { describe, it, expect } from 'vitest'
import React from 'react'
import { ExportButton } from './ExportButton'

describe('ExportButton props checks', () => {
  it('should receive eventId correctly', () => {
    const comp = <ExportButton eventId="abc-123" />
    expect(comp.props.eventId).toBe('abc-123')
  })
})
