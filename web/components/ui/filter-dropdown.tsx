"use client"

import { Filter } from 'lucide-react'

interface FilterDropdownProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function FilterDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder = "Filter",
  className = ""
}: FilterDropdownProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-4 pr-10 py-2 bg-slate-800/80 border border-white/10 rounded-xl text-white focus:outline-none focus:border-sky-500 appearance-none cursor-pointer min-w-35"
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
    </div>
  )
}