"use client"

interface ActivityItemProps {
  user: string
  action: string
  time: string
  initials: string
}

export default function ActivityItem({ user, action, time, initials }: ActivityItemProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 18px',
      borderRadius: '22px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(56,189,248,0.18), rgba(34,197,94,0.18))',
          display: 'grid',
          placeItems: 'center',
          fontWeight: 700,
          color: '#38bdf8'
        }}>
          {initials}
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: 'white' }}>{user}</p>
          <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: '13px' }}>{action}</p>
        </div>
      </div>
      <span style={{ color: '#64748b', fontSize: '12px' }}>{time}</span>
    </div>
  )
}