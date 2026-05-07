"use client"

import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  accent: string
}

export default function StatsCard({ label, value, icon: Icon, accent }: StatsCardProps) {
  return (
    <div style={{
      borderRadius: '24px',
      background: 'rgba(15, 23, 42, 0.9)',
      border: '1px solid rgba(255,255,255,0.08)',
      padding: '22px',
      boxShadow: '0 30px 60px rgba(0,0,0,0.18)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ 
            margin: 0, 
            color: '#94a3b8', 
            fontSize: '12px', 
            letterSpacing: '0.25em', 
            textTransform: 'uppercase' 
          }}>
            {label}
          </p>
          <p style={{ margin: '14px 0 0', fontSize: '34px', fontWeight: 700 }}>{value}</p>
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '16px',
          background: accent,
          display: 'grid',
          placeItems: 'center',
          color: 'white'
        }}>
          <Icon style={{ width: '20px', height: '20px' }} />
        </div>
      </div>
    </div>
  )
}