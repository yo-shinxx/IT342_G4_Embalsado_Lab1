// components/ui/view-toggle.tsx
"use client"

import { Grid3x3, List } from 'lucide-react'

interface ViewToggleProps {
  viewMode: 'grid' | 'list'
  onToggle: (mode: 'grid' | 'list') => void
  className?: string
}

export default function ViewToggle({ viewMode, onToggle, className = "" }: ViewToggleProps) {
  return (
    <div className={`flex bg-slate-800/80 border border-white/10 rounded-xl overflow-hidden ${className}`}>
      <button
        onClick={() => onToggle('grid')}
        className={`p-2 transition-all ${viewMode === 'grid' ? 'bg-sky-500 text-white' : 'text-slate-500 hover:text-white'}`}
      >
        <Grid3x3 className="w-4 h-4" />
      </button>
      <button
        onClick={() => onToggle('list')}
        className={`p-2 transition-all ${viewMode === 'list' ? 'bg-sky-500 text-white' : 'text-slate-500 hover:text-white'}`}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  )
}