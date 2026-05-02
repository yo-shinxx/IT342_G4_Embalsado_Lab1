'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  History, 
  Filter, 
  User,
  Clock,
  FileText,
  ChevronDown,
} from 'lucide-react'
import Background from '@/components/background'
import Navbar from '@/components/navbar'
import Header from '@/components/header'
import { transactionApi, TransactionLog } from '@/lib/api/transaction'
import { toast } from 'sonner'

export default function TransactionsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<TransactionLog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAction, setSelectedAction] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const actionTypes = ['All', 'REGISTER', 'EQUIPMENT CREATED', 'EQUIPMENT UPDATED', 'EQUIPMENT STATUS CHANGED', 'EQUIPMENT ARCHIVED']

  const getDisplayAction = (action: string) => {
    if (action === 'All') return 'All Actions'
    if (action === 'REGISTER') return 'Register'
    if (action === 'EQUIPMENT_CREATED') return 'Equipment Created'
    if (action === 'EQUIPMENT_UPDATED') return 'Equipment Updated'
    if (action === 'EQUIPMENT_STATUS_CHANGED') return 'Status Changed'
    if (action === 'EQUIPMENT_ARCHIVED') return 'Equipment Archived'
    return action
  }

  const fetchTransactions = async (page: number = 0) => {
    try {
      setLoading(true)
      const data = await transactionApi.getAllLogs(page, 50, { 
        action: selectedAction !== 'All' ? selectedAction : undefined 
      })
      setTransactions(data.content)
      setCurrentPage(data.pagination.page)
      setTotalPages(data.pagination.pages)
      setTotalItems(data.pagination.total)
    } catch (error: any) {
      console.error('Failed to fetch transactions:', error)
      toast.error(error.message || 'Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/login')
    } else {
      fetchTransactions(0)
    }
  }, [router, selectedAction])

  const getActionColor = (action: string) => {
    switch (action) {
      case 'REGISTER':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'EQUIPMENT_CREATED':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'EQUIPMENT_UPDATED':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'EQUIPMENT_STATUS_CHANGED':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'EQUIPMENT_ARCHIVED':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const formatTimestamp = (timestamp: string) => {
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

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  const formatFullTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      fetchTransactions(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      fetchTransactions(currentPage - 1)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#020617] via-[#0f172a] to-[#020617] text-white">
      <Background />
      <Navbar />

      <div className="min-h-screen flex flex-col" style={{ marginLeft: '280px' }}>
        <Header title="Transactions" />

        <main className="flex-1 p-8 pt-6 overflow-y-auto">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Transaction History</h1>
              <p className="text-slate-400 text-sm mt-1">Complete audit trail of all equipment activities</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <History className="w-4 h-4" />
              {totalItems} total transactions
            </div>
          </div>

          {/* Filter Bar - matching Equipment page style */}
          <div className="mb-6">
            <div className="relative inline-block">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 text-slate-400 hover:bg-slate-700 border border-white/10 transition-all"
              >
                <Filter className="w-4 h-4" />
                <span>Filter: {selectedAction === 'All' ? 'All Actions' : getDisplayAction(selectedAction)}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isFilterOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 rounded-lg bg-slate-800 border border-white/10 shadow-lg z-10 overflow-hidden">
                  {actionTypes.map((action) => (
                    <button
                      key={action}
                      onClick={() => {
                        setSelectedAction(action)
                        setIsFilterOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-all hover:bg-slate-700 ${
                        selectedAction === action ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400'
                      }`}
                    >
                      {action === 'All' ? 'All Actions' : getDisplayAction(action)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Loading transactions...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && transactions.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800/80 flex items-center justify-center">
                <FileText className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No transactions found</h3>
              <p className="text-slate-400">
                {selectedAction !== 'All'
                  ? `No ${selectedAction.replace('_', ' ')} transactions to display`
                  : 'No transaction history available'}
              </p>
            </div>
          )}

          {/* Transaction List */}
          {!loading && transactions.length > 0 && (
            <div className="space-y-3">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 rounded-xl bg-slate-800/60 border border-white/10 text-slate-400 text-sm font-medium">
                <div className="col-span-4">Action</div>
                <div className="col-span-4">Equipment / Details</div>
                <div className="col-span-2">User</div>
                <div className="col-span-2">Timestamp</div>
              </div>
              
              {transactions.map((transaction, index) => (
                <div
                  key={transaction.id || `transaction-${index}`}
                  className="grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-xl bg-slate-800/90 border border-white/10 hover:border-sky-500/30 transition-all group"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getActionColor(transaction.action)}`}>
                      {transaction.action.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="col-span-4">
                    <div>
                      <p className="font-medium text-sm">{transaction.equipmentName || '-'}</p>
                      <p className="text-xs text-slate-500 truncate">{transaction.details || 'No additional details'}</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <User className="w-3 h-3" />
                      <span className="truncate">{transaction.email}</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-1 text-sm text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimestamp(transaction.timestamp)}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{formatFullTimestamp(transaction.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && transactions.length > 0 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-slate-400">
                Showing page {currentPage + 1} of {totalPages} ({totalItems} total)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-white border border-white/10 hover:border-sky-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-white border border-white/10 hover:border-sky-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}