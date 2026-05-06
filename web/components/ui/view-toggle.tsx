'use client'

import { Grid, List } from 'lucide-react'

interface ViewToggleProps {
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
}

export default function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex gap-1 p-1 rounded-lg bg-slate-800/80 border border-white/10">
      <button
        onClick={() => onViewModeChange('grid')}
        className={`p-2 rounded-md transition-all ${
          viewMode === 'grid'
            ? 'bg-sky-500 text-white'
            : 'text-slate-400 hover:text-white hover:bg-slate-700'
        }`}
        aria-label="Grid view"
      >
        <Grid className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={`p-2 rounded-md transition-all ${
          viewMode === 'list'
            ? 'bg-sky-500 text-white'
            : 'text-slate-400 hover:text-white hover:bg-slate-700'
        }`}
        aria-label="List view"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  )
}