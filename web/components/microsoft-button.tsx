import OutlineButton from './ui/outline-button'

interface MicrosoftButtonProps {
  onClick: () => void
}

export default function MicrosoftButton({ onClick }: MicrosoftButtonProps) {
  return (
    <OutlineButton onClick={onClick} fullWidth>
      <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 23 23" fill="none">
        <path d="M0 0h11v11H0V0z" fill="#F25022"/>
        <path d="M12 0h11v11H12V0z" fill="#7FBA00"/>
        <path d="M0 12h11v11H0V12z" fill="#00A4EF"/>
        <path d="M12 12h11v11H12V12z" fill="#FFB900"/>
      </svg>
      Sign in with Microsoft
    </OutlineButton>
  )
}