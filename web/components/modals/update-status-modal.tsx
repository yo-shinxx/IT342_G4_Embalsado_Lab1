'use client'

import { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { equipmentApi, EquipmentDetail } from '@/lib/api/equipment'
import { toast } from 'sonner'

interface UpdateStatusModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  equipment: EquipmentDetail
}

export default function UpdateStatusModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  equipment 
}: UpdateStatusModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(equipment.conditionStatus)

  const statusOptions = [
    { value: 'EXCELLENT', label: 'Excellent', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    { value: 'GOOD', label: 'Good', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { value: 'FAIR', label: 'Fair', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    { value: 'POOR', label: 'Poor', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    { value: 'DAMAGED', label: 'Damaged', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    { value: 'FOR_DISPOSAL', label: 'For Disposal', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedStatus === equipment.conditionStatus) {
      toast.info('No changes made')
      onClose()
      return
    }

    setLoading(true)

    try {
      await equipmentApi.updateStatus(equipment.id, selectedStatus)
      toast.success('Equipment status updated successfully!')
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Failed to update status:', error)
      toast.error(error.message || 'Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 rounded-2xl border border-white/10 shadow-2xl z-50">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Update Equipment Status</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <p className="text-sm text-slate-400 mb-1">Equipment:</p>
            <p className="text-lg font-semibold">{equipment.name}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Select New Status
            </label>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedStatus === option.value
                      ? 'border-sky-500 bg-sky-500/10'
                      : 'border-white/10 bg-slate-800/50 hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={selectedStatus === option.value}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-4 h-4 text-sky-500"
                  />
                  <span className={`px-3 py-1 rounded-full border text-sm ${option.color}`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {selectedStatus !== equipment.conditionStatus && (
            <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-200">
                <p className="font-semibold mb-1">Status Change</p>
                <p>
                  This will change the equipment status from{' '}
                  <span className="font-semibold">{equipment.conditionStatus}</span> to{' '}
                  <span className="font-semibold">{selectedStatus}</span>
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedStatus === equipment.conditionStatus}
              className="px-4 py-2 rounded-lg bg-linear-to-r from-sky-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}