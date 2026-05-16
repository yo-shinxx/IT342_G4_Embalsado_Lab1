'use client'

import { useState, useRef, useEffect } from 'react'
import { Filter, ChevronDown } from 'lucide-react'

interface FilterDropdownProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  label?: string
}

export default function FilterDropdown({ options, value, onChange, label = 'Filter' }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 text-slate-400 hover:bg-slate-700 border border-white/10 transition-all whitespace-nowrap"
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm">{label}: {value}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 min-w-[200px] rounded-lg bg-slate-800 border border-white/10 shadow-lg z-10 overflow-hidden">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-all hover:bg-slate-700 ${
                value === option ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}