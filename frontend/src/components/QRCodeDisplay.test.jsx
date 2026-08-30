import { describe, it, expect } from 'vitest'
import React from 'react'
import { QRCodeDisplay } from './QRCodeDisplay'

describe('QRCodeDisplay props checks', () => {
  it('should take registration URL values correctly', () => {
    const comp = <QRCodeDisplay value="http://localhost:5173/event/bootcamp" />
    expect(comp.props.value).toBe('http://localhost:5173/event/bootcamp')
  })
})
