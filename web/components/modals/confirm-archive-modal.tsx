'use client'

import { X, AlertTriangle } from 'lucide-react'

interface ConfirmArchiveModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  equipmentName: string
}

export default function ConfirmArchiveModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  equipmentName 
}: ConfirmArchiveModalProps) {
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
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Confirm Archive
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-red-200">
              Are you sure you want to archive <span className="font-bold">{equipmentName}</span>?
            </p>
            <p className="text-sm text-red-300 mt-2">
              This equipment will no longer appear in the active inventory, but transaction history will be preserved.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
            >
              Archive Equipment
            </button>
          </div>
        </div>
      </div>
    </>
  )
}