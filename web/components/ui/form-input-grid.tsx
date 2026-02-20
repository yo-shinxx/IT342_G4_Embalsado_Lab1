import { LucideIcon } from 'lucide-react'

interface GridInputProps {
  id: string
  type: string
  label: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  icon?: LucideIcon
  required?: boolean
}

interface FormInputGridProps {
  inputs: GridInputProps[]
}

export default function FormInputGrid({ inputs }: FormInputGridProps) {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: `repeat(${inputs.length}, 1fr)`, 
      gap: '16px', 
      marginBottom: '16px' 
    }}>
      {inputs.map((input) => {
        const Icon = input.icon
        return (
          <div key={input.id} style={{ width: '100%' }}>
            <label 
              htmlFor={input.id} 
              style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '600', 
                marginBottom: '8px', 
                color: '#d1d5db' 
              }}
            >
              {input.label}
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              {Icon && (
                <div style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '12px', 
                  transform: 'translateY(-50%)', 
                  pointerEvents: 'none' 
                }}>
                  <Icon style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                </div>
              )}
              <input
                id={input.id}
                type={input.type}
                placeholder={input.placeholder}
                value={input.value}
                onChange={input.onChange}
                required={input.required}
                style={{
                  display: 'block',
                  width: '100%',
                  maxWidth: '100%',
                  height: '44px',
                  paddingLeft: Icon ? '44px' : '16px',
                  paddingRight: '16px',
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}