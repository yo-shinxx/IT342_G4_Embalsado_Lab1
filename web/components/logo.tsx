import { Box } from 'lucide-react'

export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
      <div style={{
        width: '48px',
        height: '48px',
        background: 'linear-gradient(to bottom right, #3b82f6, #06b6d4)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box style={{ width: '28px', height: '28px' }} />
      </div>
      <span style={{ fontSize: '30px', fontWeight: 'bold' }}>Quantix</span>
    </div>
  )
}