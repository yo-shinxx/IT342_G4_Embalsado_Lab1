"use client"

import { useState } from 'react'
import { X, Upload } from 'lucide-react'
import { apiRequest } from '@/lib/api'
import { toast } from 'sonner'

interface AddEquipmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  categories: { id: number; name: string }[]
}

interface EquipmentFormData {
  name: string
  categoryId: number
  model: string
  manufacturer: string
  specifications: string
  conditionStatus: string
  purchaseDate: string
  serialNumber: string
  quantity: number
  imageUrl: string
}

export default function AddEquipmentModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  categories 
}: AddEquipmentModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<EquipmentFormData>({
    name: '',
    categoryId: categories[0]?.id || 0,
    model: '',
    manufacturer: '',
    specifications: '',
    conditionStatus: 'GOOD',
    purchaseDate: '',
    serialNumber: '',
    quantity: 1,
    imageUrl: ''
  })

  const statusOptions = [
    'EXCELLENT',
    'GOOD',
    'FAIR',
    'POOR',
    'DAMAGED',
    'FOR_DISPOSAL'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await apiRequest('/admin/equipment', {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      toast.success('Equipment added successfully!')
      onSuccess()
      onClose()
      resetForm()
    } catch (error: any) {
      console.error('Failed to add equipment:', error)
      toast.error(error.message || 'Failed to add equipment')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      categoryId: categories[0]?.id || 0,
      model: '',
      manufacturer: '',
      specifications: '',
      conditionStatus: 'GOOD',
      purchaseDate: '',
      serialNumber: '',
      quantity: 1,
      imageUrl: ''
    })
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-slate-900 rounded-2xl border border-white/10 shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Add New Equipment</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Basic Information Section */}
          <div>
            <h3 className="text-sm font-semibold text-sky-400 mb-3">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Equipment Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500 transition-all"
                  placeholder="e.g., Digital Oscilloscope"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  placeholder="e.g., DSO-X 2000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Manufacturer
                </label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  placeholder="e.g., Keysight, Tektronix"
                />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div>
            <h3 className="text-sm font-semibold text-sky-400 mb-3">Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Specifications
                </label>
                <textarea
                  rows={3}
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  placeholder="Technical specifications, features, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Condition Status *
                </label>
                <select
                  required
                  value={formData.conditionStatus}
                  onChange={(e) => setFormData({ ...formData, conditionStatus: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  placeholder="SN-123456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div>
            <h3 className="text-sm font-semibold text-sky-400 mb-3">Media</h3>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/80 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Equipment'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}