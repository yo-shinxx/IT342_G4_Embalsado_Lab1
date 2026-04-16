"use client"

import SearchBar from './searchbar'
import FilterDropdown from './filter-dropdown'
import ViewToggle from './view-toggle'

interface ActionBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  
  filterOptions: string[]
  filterValue: string
  onFilterChange: (value: string) => void
  
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  
  className?: string
}

export default function ActionBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterOptions,
  filterValue,
  onFilterChange,
  viewMode,
  onViewModeChange,
  className = ""
}: ActionBarProps) {
  return (
    <div className={`flex flex-col sm:flex-row justify-between gap-4 mb-6 ${className}`}>
      <SearchBar 
        value={searchValue}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
      />
      
      <div className="flex gap-3">
        <FilterDropdown
          options={filterOptions}
          value={filterValue}
          onChange={onFilterChange}
        />
        <ViewToggle
          viewMode={viewMode}
          onToggle={onViewModeChange}
        />
      </div>
    </div>
  )
}