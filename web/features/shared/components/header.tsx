"use client"

import { Bell } from "lucide-react"
import Logo from "./logo"

interface HeaderProps {
  title?: string
  showBell?: boolean
  onBellClick?: () => void
  actions?: React.ReactNode
}

export default function Header({ 
  title = "Dashboard", 
  showBell = true,
  onBellClick,
  actions 
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between pr-8 py-4 bg-linear-to-br from-[#020617] via-[#0f172a] to-[#020617] border-b border-[rgba(255,255,255,0.08)]" style={{ paddingLeft: 0 }}>
      <div className="mb-2.5">
            <Logo compact={true} />
        </div>

      <div className="flex items-center gap-3">
        {actions}
        {showBell && (
          <button 
            onClick={onBellClick}
            className="w-10 h-10 rounded-2xl bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] grid place-items-center cursor-pointer transition-all duration-200 hover:bg-[rgba(255,255,255,0.12)]"
          >
            <Bell className="w-5 h-5 text-[#93c5fd]" />
          </button>
        )}
      </div>
    </header>
  )
}