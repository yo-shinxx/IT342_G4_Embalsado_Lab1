interface PrimaryButtonProps {
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
  fullWidth?: boolean
}

export default function PrimaryButton({
  type = 'button',
  onClick,
  disabled = false,
  children,
  fullWidth = false
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: fullWidth ? '100%' : 'auto',
        padding: '12px 16px',
        background: 'linear-gradient(to right, #2563eb, #06b6d4)',
        border: 'none',
        borderRadius: '12px',
        color: 'white',
        fontSize: '16px',
        fontWeight: '700',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1
      }}
    >
      {children}
    </button>
  )
}