interface OutlineButtonProps {
  onClick: () => void
  children: React.ReactNode
  fullWidth?: boolean
}

export default function OutlineButton({
  onClick,
  children,
  fullWidth = false
}: OutlineButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      style={{
        width: fullWidth ? '100%' : 'auto',
        padding: '12px 16px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        color: 'white'
      }}
    >
      {children}
    </button>
  )
}