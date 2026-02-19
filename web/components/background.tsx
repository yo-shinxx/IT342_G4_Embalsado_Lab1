"use client"

export default function Background() {
  return (
    <>
      <div style={{
        position: 'fixed',
        top: '80px',
        left: '80px',
        width: '288px',
        height: '288px',
        background: 'rgba(59, 130, 246, 0.2)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }} />
      <div style={{
        position: 'fixed',
        bottom: '80px',
        right: '80px',
        width: '384px',
        height: '384px',
        background: 'rgba(6, 182, 212, 0.2)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }} />
    </>
  )
}