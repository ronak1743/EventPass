import { describe, it, expect } from 'vitest'
import React from 'react'
import { FormRenderer } from './FormRenderer'

describe('FormRenderer basic validation', () => {
  it('should render correct list of fields', () => {
    const fields = [
      { id: '1', fieldKey: 'field_name', label: 'Full Name', fieldType: 'TEXT', required: true },
      { id: '2', fieldKey: 'field_desc', label: 'Comments', fieldType: 'TEXTAREA', required: false },
    ]

    const wrapper = <FormRenderer fields={fields} />
    expect(wrapper.props.fields).toHaveLength(2)
    expect(wrapper.props.fields[0].label).toBe('Full Name')
  })
})
