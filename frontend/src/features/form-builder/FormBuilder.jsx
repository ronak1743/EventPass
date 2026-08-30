import React, { useState, useEffect } from 'react'
import API from '@/api/axios'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { useToast } from '@/components/Toast'
import { FormRenderer } from '@/components/FormRenderer'

const FIELD_TYPES = [
  { value: 'TEXT', label: 'Short Text' },
  { value: 'TEXTAREA', label: 'Long Text' },
  { value: 'NUMBER', label: 'Number' },
  { value: 'EMAIL', label: 'Email Address' },
  { value: 'MOBILE', label: 'Mobile Number' },
  { value: 'DATE', label: 'Date' },
  { value: 'TIME', label: 'Time' },
  { value: 'DROPDOWN', label: 'Dropdown Selection' },
  { value: 'RADIO', label: 'Radio Selection' },
  { value: 'CHECKBOX', label: 'Checkboxes' },
]

export const FormBuilder = ({ eventId }) => {
  const toast = useToast()
  const [fields, setFields] = useState([])
  const [selectedField, setSelectedField] = useState(null)
  
  // Editor values
  const [editLabel, setEditLabel] = useState('')
  const [editRequired, setEditRequired] = useState(false)
  const [editUnique, setEditUnique] = useState(false)
  const [editOptions, setEditOptions] = useState([])
  const [newOption, setNewOption] = useState('')
  
  const [previewOpen, setPreviewOpen] = useState(false)

  const fetchFields = async () => {
    try {
      const response = await API.get(`/admin/events/${eventId}/fields`)
      if (response.success) {
        setFields(response.data)
      }
    } catch (err) {
      toast.error('Failed to load form fields')
    }
  }

  useEffect(() => {
    fetchFields()
  }, [eventId])

  const handleAddField = async (type) => {
    const defaultLabel = `New ${FIELD_TYPES.find((t) => t.value === type).label}`
    const defaultOptions = ['DROPDOWN', 'RADIO', 'CHECKBOX'].includes(type) ? ['Option 1'] : []
    
    try {
      const response = await API.post(`/admin/events/${eventId}/fields`, {
        label: defaultLabel,
        fieldType: type,
        required: false,
        isUnique: false,
        options: defaultOptions,
        validationRules: {},
      })
      if (response.success) {
        toast.success('Field added')
        fetchFields()
        setSelectedField(response.data)
        setEditLabel(response.data.label)
        setEditRequired(response.data.required)
        setEditUnique(response.data.isUnique || false)
        setEditOptions(response.data.options || [])
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add field')
    }
  }

  const handleSelectField = (field) => {
    setSelectedField(field)
    setEditLabel(field.label)
    setEditRequired(field.required)
    setEditUnique(field.isUnique || false)
    setEditOptions(field.options || [])
    setNewOption('')
  }

  const handleSaveField = async () => {
    if (!selectedField) return
    
    // Validate options
    if (['DROPDOWN', 'RADIO', 'CHECKBOX'].includes(selectedField.fieldType) && editOptions.length === 0) {
      toast.error('At least one option is required')
      return
    }

    try {
      const response = await API.put(`/admin/events/${eventId}/fields/${selectedField.id}`, {
        label: editLabel,
        fieldType: selectedField.fieldType,
        required: editRequired,
        isUnique: editUnique,
        options: editOptions,
        validationRules: {},
      })
      if (response.success) {
        toast.success('Field updated successfully')
        fetchFields()
        setSelectedField(response.data)
        setEditUnique(response.data.isUnique || false)
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update field')
    }
  }

  const handleDeleteField = async (id) => {
    try {
      const response = await API.delete(`/admin/events/${eventId}/fields/${id}`)
      if (response.success) {
        toast.success('Field deleted')
        if (selectedField?.id === id) {
          setSelectedField(null)
        }
        fetchFields()
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete field')
    }
  }

  // HTML5 Drag and Drop Reordering
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = async (e, targetIdx) => {
    e.preventDefault()
    const sourceIdx = parseInt(e.dataTransfer.getData('text/plain'), 10)
    if (sourceIdx === targetIdx) return

    const reordered = [...fields]
    const [moved] = reordered.splice(sourceIdx, 1)
    reordered.splice(targetIdx, 0, moved)
    
    setFields(reordered)

    try {
      await API.put(`/admin/events/${eventId}/fields/reorder`, {
        fieldIds: reordered.map((f) => f.id),
      })
      toast.success('Fields order updated')
    } catch (err) {
      toast.error('Failed to update field order')
      fetchFields()
    }
  }

  // Options edit helper
  const handleAddOption = () => {
    if (!newOption.trim()) return
    setEditOptions((prev) => [...prev, newOption.trim()])
    setNewOption('')
  }

  const handleRemoveOption = (index) => {
    setEditOptions((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div style={builderContainerStyle}>
      <div style={builderHeaderStyle}>
        <div>
          <h3 style={titleStyle}>Form Builder</h3>
          <p style={subtitleStyle}>Drag items to reorder or click them to configure question values</p>
        </div>
        <Button variant="secondary" onClick={() => setPreviewOpen(true)}>
          Preview Form
        </Button>
      </div>

      <div style={workspaceStyle}>
        {/* Left Side: Palette */}
        <div style={panelStyle}>
          <h4 style={panelTitleStyle}>Question Types</h4>
          <div style={paletteListStyle}>
            {FIELD_TYPES.map((type) => (
              <button key={type.value} onClick={() => handleAddField(type.value)} style={paletteBtnStyle}>
                + {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center Canvas */}
        <div style={{ ...panelStyle, flex: 2 }}>
          <h4 style={panelTitleStyle}>Form Canvas</h4>
          <div style={canvasListStyle}>
            {fields.length === 0 ? (
              <div style={canvasEmptyStyle}>No questions added yet. Click items on the left.</div>
            ) : (
              fields.map((f, idx) => (
                <div
                  key={f.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, idx)}
                  onClick={() => handleSelectField(f)}
                  style={{
                    ...canvasItemStyle,
                    borderColor: selectedField?.id === f.id ? '#2563eb' : '#e5e7eb',
                  }}
                >
                  <div style={itemDragHandleStyle}>☰</div>
                  <div style={itemContentStyle}>
                    <span style={itemLabelStyle}>
                      {f.label} {f.required && <span style={{ color: '#dc2626' }}>*</span>}
                    </span>
                    <span style={itemTypeStyle}>{f.fieldType}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteField(f.id)
                    }}
                    style={deleteBtnStyle}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Editor */}
        <div style={panelStyle}>
          <h4 style={panelTitleStyle}>Edit Question</h4>
          {selectedField ? (
            <div style={editorFormStyle}>
              <Input
                label="Question Label"
                id="editLabel"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '16px', margin: '8px 0' }}>
                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    checked={editRequired}
                    onChange={(e) => setEditRequired(e.target.checked)}
                  />
                  Mark as Required
                </label>
                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    checked={editUnique}
                    onChange={(e) => setEditUnique(e.target.checked)}
                  />
                  Unique Answer
                </label>
              </div>

              {/* Show options editing list if select type */}
              {['DROPDOWN', 'RADIO', 'CHECKBOX'].includes(selectedField.fieldType) && (
                <div style={optionsEditContainerStyle}>
                  <label style={fieldLabelStyle}>Options list</label>
                  <div style={optionListStyle}>
                    {editOptions.map((opt, idx) => (
                      <div key={idx} style={optionItemStyle}>
                        <span>{opt}</span>
                        <button onClick={() => handleRemoveOption(idx)} style={removeOptionBtnStyle}>&times;</button>
                      </div>
                    ))}
                  </div>
                  <div style={addOptionRowStyle}>
                    <input
                      type="text"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="Add option..."
                      style={addOptionInputStyle}
                    />
                    <button type="button" onClick={handleAddOption} style={addOptionBtnStyle}>Add</button>
                  </div>
                </div>
              )}

              <Button onClick={handleSaveField} style={{ marginTop: '12px' }}>
                Save Changes
              </Button>
            </div>
          ) : (
            <div style={editorEmptyStyle}>Select a question on the canvas to configure it.</div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalCardStyle}>
            <div style={modalHeaderStyle}>
              <h3>Form Live Preview</h3>
              <button onClick={() => setPreviewOpen(false)} style={modalCloseBtnStyle}>&times;</button>
            </div>
            <div style={modalBodyStyle}>
              <FormRenderer fields={fields} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const builderContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
}

const builderHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #f3f4f6',
  paddingBottom: '16px',
}

const titleStyle = {
  fontSize: '18px',
  fontWeight: 600,
  color: '#111827',
}

const subtitleStyle = {
  fontSize: '13px',
  color: '#6b7280',
}

const workspaceStyle = {
  display: 'flex',
  gap: '20px',
  alignItems: 'flex-start',
}

const panelStyle = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  minHeight: '400px',
  flex: 1,
}

const panelTitleStyle = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#374151',
  borderBottom: '1px solid #e5e7eb',
  paddingBottom: '8px',
}

const paletteListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}

const paletteBtnStyle = {
  padding: '10px',
  fontSize: '13px',
  fontWeight: 500,
  color: '#374151',
  backgroundColor: '#ffffff',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 150ms ease',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
}

const canvasListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
}

const canvasEmptyStyle = {
  fontSize: '14px',
  color: '#9ca3af',
  textAlign: 'center',
  padding: '40px 16px',
}

const canvasItemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px',
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'border-color 150ms ease',
  gap: '12px',
}

const itemDragHandleStyle = {
  cursor: 'grab',
  color: '#9ca3af',
  fontSize: '18px',
  padding: '0 4px',
}

const itemContentStyle = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: '2px',
}

const itemLabelStyle = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#111827',
}

const itemTypeStyle = {
  fontSize: '11px',
  color: '#6b7280',
  textTransform: 'uppercase',
}

const deleteBtnStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  color: '#dc2626',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 500,
  padding: '4px 8px',
}

const editorFormStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  cursor: 'pointer',
}

const editorEmptyStyle = {
  fontSize: '13px',
  color: '#9ca3af',
  textAlign: 'center',
  padding: '40px 16px',
}

const fieldLabelStyle = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#374151',
  marginBottom: '6px',
}

const optionsEditContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}

const optionListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}

const optionItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '6px 12px',
  backgroundColor: '#ffffff',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '13px',
}

const removeOptionBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#dc2626',
  cursor: 'pointer',
  fontSize: '16px',
}

const addOptionRowStyle = {
  display: 'flex',
  gap: '8px',
  marginTop: '4px',
}

const addOptionInputStyle = {
  flex: 1,
  padding: '6px 10px',
  fontSize: '13px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  outline: 'none',
}

const addOptionBtnStyle = {
  padding: '6px 12px',
  fontSize: '13px',
  fontWeight: 500,
  backgroundColor: '#ffffff',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  cursor: 'pointer',
}

// Modal styles
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  backdropFilter: 'blur(4px)',
}

const modalCardStyle = {
  backgroundColor: '#ffffff',
  padding: '24px',
  borderRadius: '12px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  maxWidth: '560px',
  width: '100%',
  border: '1px solid #e5e7eb',
}

const modalHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #f3f4f6',
  paddingBottom: '12px',
  marginBottom: '20px',
}

const modalCloseBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: '24px',
  color: '#9ca3af',
  cursor: 'pointer',
}

const modalBodyStyle = {
  maxHeight: '400px',
  overflowY: 'auto',
  paddingRight: '4px',
}
