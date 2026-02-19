"use client"

import { LucideIcon } from 'lucide-react'

interface FormInputProps {
  id: string
  type: string
  label: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  icon?: LucideIcon
  required?: boolean
}

export default function FormInput({
  id,
  type,
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  required = false
}: FormInputProps) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label 
        htmlFor={id} 
        style={{ 
          display: 'block', 
          fontSize: '14px', 
          fontWeight: '600', 
          marginBottom: '8px', 
          color: '#d1d5db' 
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
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
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          style={{
            display: 'block',
            width: '100%',
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
}