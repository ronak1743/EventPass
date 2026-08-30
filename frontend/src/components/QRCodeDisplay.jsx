import React, { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Button } from './Button'
import { useToast } from './Toast'

export const QRCodeDisplay = ({ value }) => {
  const canvasRef = useRef(null)
  const toast = useToast()

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: 180,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff',
        },
      }, (err) => {
        if (err) console.error('Failed to generate QR code', err)
      })
    }
  }, [value])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success('Registration link copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const downloadQRCode = () => {
    if (!canvasRef.current) return
    const url = canvasRef.current.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'registration-qr.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div style={containerStyle}>
      <div style={qrWrapperStyle}>
        <canvas ref={canvasRef} />
      </div>
      <div style={actionRowStyle}>
        <Button variant="secondary" onClick={copyToClipboard} style={{ fontSize: '13px', padding: '6px 12px' }}>
          Copy Link
        </Button>
        <Button variant="primary" onClick={downloadQRCode} style={{ fontSize: '13px', padding: '6px 12px' }}>
          Download QR
        </Button>
      </div>
    </div>
  )
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  padding: '16px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px dashed #d1d5db',
  width: 'fit-content',
}

const qrWrapperStyle = {
  backgroundColor: '#ffffff',
  padding: '8px',
  borderRadius: '6px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  display: 'flex',
}

const actionRowStyle = {
  display: 'flex',
  gap: '10px',
}
