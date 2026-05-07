interface DividerProps {
  text?: string
}

export default function Divider({ text = "Or" }: DividerProps) {
  return (
    <div style={{ position: 'relative', margin: '24px 0' }}>
      <div style={{ position: 'absolute', inset: '0', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%', borderTop: '1px solid #374151' }} />
      </div>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', fontSize: '14px' }}>
        <span style={{ padding: '0 16px', backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#9ca3af' }}>
          {text}
        </span>
      </div>
    </div>
  )
}