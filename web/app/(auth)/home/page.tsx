'use client'

import { ArrowRight, FileText, PackageSearch, TrendingDown, TrendingUp, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Background from '@/features/shared/components/background'
import Navbar from '@/features/shared/components/navbar'
import Header from '@/features/shared/components/header'
import { toast } from 'sonner'
import { TransactionLog, transactionApi } from '@/features/transactions/api/transaction'
import { equipmentApi, Equipment } from '@/features/equipments/api/equipment'

const getActionDisplay = (action: string) => {
  switch (action) {
    case 'REGISTER': return 'User Registration'
    case 'EQUIPMENT_CREATED': return 'Equipment Added'
    case 'EQUIPMENT_UPDATED': return 'Equipment Updated'
    case 'EQUIPMENT_STATUS_CHANGED': return 'Status Changed'
    case 'EQUIPMENT_ARCHIVED': return 'Equipment Archived'
    default: return action?.replace('_', ' ') || action
  }
}

const formatRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

export default function Dashboard() {
  const router = useRouter()
  const [recentTransactions, setRecentTransactions] = useState<TransactionLog[]>([])
  const [equipmentMap, setEquipmentMap] = useState<Map<string, Equipment>>(new Map())
  const [stats, setStats] = useState({
    totalEquipment: 0,
    totalTransactions: 0,
    lowStockAlerts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // All equipment
        const equipmentData = await equipmentApi.getAll(0, 1000)
        const allEquipment = equipmentData.content
        
        const totalEquipment = allEquipment.length
        
        // Quantity <= 5 for now
        const lowStockAlerts = allEquipment.filter(e => e.quantity <= 5).length
        
        // Recent transactions
        const transactionsData = await transactionApi.getRecentActivity(0, 5)
        setRecentTransactions(transactionsData.content)
        
        // Total transactions
        const allTransactions = await transactionApi.getAllLogs(0, 1000)
        const totalTransactions = allTransactions.content.length
        
        setStats({
          totalEquipment,
          totalTransactions,
          lowStockAlerts
        })
        
        // Equipment object from allEquipment
        const equipmentMapData = new Map<string, Equipment>()
        allEquipment.forEach(eq => {
          equipmentMapData.set(eq.name, eq)
        })
        setEquipmentMap(equipmentMapData)
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        toast.error('Failed to fetch dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  const statsCards = [
    {
      label: 'Total Equipments',
      value: stats.totalEquipment.toString(),
      icon: PackageSearch,
      accent: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
    },
    {
      label: 'Total Transactions',
      value: stats.totalTransactions.toString(),
      icon: TrendingUp,
      accent: 'linear-gradient(135deg, #22c55e, #14b8a6)',
    },
    {
      label: 'Low Stock Alerts',
      value: stats.lowStockAlerts.toString(),
      icon: Users,
      accent: 'linear-gradient(135deg, #fb7185, #f43f5e)',
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#020617] via-[#0f172a] to-[#020617] text-white">
        <Background />
        <Navbar />
        <div className="min-h-screen flex flex-col" style={{ marginLeft: '280px' }}>
          <Header />
          <main className="flex-1 p-8 pt-6 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Loading dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#020617] via-[#0f172a] to-[#020617] text-white">
      <Background />
      <Navbar />

      <div className="min-h-screen flex flex-col" style={{ marginLeft: '280px' }}>
        <Header />

        <main className="flex-1 p-8 pt-6 overflow-y-auto">
          {/* Stats Grid */}
          <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] mb-6">
            {statsCards.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="rounded-3xl bg-[rgba(15,23,42,0.9)] border border-[rgba(255,255,255,0.08)] p-5 shadow-[0_30px_60px_rgba(0,0,0,0.18)]">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="m-0 text-[#94a3b8] text-xs tracking-[0.25em] uppercase">{item.label}</p>
                      <p className="mt-3.5 mb-0 text-4xl font-bold">{item.value}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl grid place-items-center text-white" style={{ background: item.accent }}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid gap-6 grid-cols-[1.8fr_1fr]">
            {/* Chart Section - Placeholder */}
            <div className="rounded-3xl bg-[rgba(15,23,42,0.9)] border border-[rgba(255,255,255,0.08)] shadow-[0_30px_60px_rgba(0,0,0,0.16)] p-7">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="m-0 text-[#94a3b8] text-xs tracking-[0.24em] uppercase">Statistics</p>
                  <h2 className="mt-3.5 mb-0 text-3xl font-bold">Equipment Overview</h2>
                </div>
              </div>
              <div className="mt-7 min-h-80 rounded-3xl bg-[rgba(255,255,255,0.03)] p-6 flex items-center justify-center">
                <p className="text-slate-400">Chart coming soon</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-3xl bg-[rgba(15,23,42,0.9)] border border-[rgba(255,255,255,0.08)] shadow-[0_30px_60px_rgba(0,0,0,0.16)] p-7 flex flex-col">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="m-0 text-[#94a3b8] text-xs tracking-[0.24em] uppercase">Recent Transactions</p>
                  <h2 className="mt-3.5 mb-0 text-2xl font-bold">Latest activity</h2>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[rgba(255,255,255,0.08)] grid place-items-center text-[#38bdf8]">
                  <FileText className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-6">
                <div className="rounded-2xl bg-slate-800/90 border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Recent Activity</h2>
                    <button
                      onClick={() => router.push('/transactions')}
                      className="text-sm text-sky-400 hover:text-sky-300 transition-all"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {recentTransactions.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">
                        <p className="text-sm">No recent activity</p>
                      </div>
                    ) : (
                      recentTransactions.map((transaction, index) => {
                        const equipment = equipmentMap.get(transaction.equipmentName)
                        return (
                          <div
                            key={transaction.id || index}
                            className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-all cursor-pointer"
                            onClick={() => router.push('/transactions')}
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                              {equipment?.imageUrl ? (
                                <img 
                                  src={equipment.imageUrl} 
                                  alt={transaction.equipmentName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-sky-400">
                                  {transaction.equipmentName?.charAt(0) || transaction.action?.charAt(0) || '?'}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {getActionDisplay(transaction.action)}
                              </p>
                              {transaction.equipmentName && (
                                <p className="text-xs text-slate-400 truncate">
                                  {transaction.equipmentName}
                                </p>
                              )}
                            </div>
                            <span className="text-xs text-slate-500 shrink-0">
                              {formatRelativeTime(transaction.timestamp)}
                            </span>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-[rgba(255,255,255,0.08)]">
                <button 
                  onClick={() => router.push('/transactions')}
                  className="inline-flex items-center gap-2 text-[#38bdf8] font-bold hover:gap-3 transition-all"
                >
                  View All Transactions
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}