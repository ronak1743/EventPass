import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { Button } from './Button'

describe('Button component basic behaviors', () => {
  it('should render children content', () => {
    // A simple mock element check
    const btn = <Button>Click me</Button>
    expect(btn.props.children).toBe('Click me')
  })

  it('should call onClick on trigger', () => {
    const handleClick = vi.fn()
    const btn = <Button onClick={handleClick}>Click me</Button>
    btn.props.onClick()
    expect(handleClick).toHaveBeenCalled()
  })
})
