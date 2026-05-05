"use client"

import { useRef, useState } from 'react'
import { X, Upload, ImageIcon } from 'lucide-react'
import { apiRequest } from '@/lib/api'
import { toast } from 'sonner'
import { equipmentApi, EquipmentFormData } from '@/lib/api/equipment'

interface AddEquipmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  categories: { id: number; name: string }[]
}

export default function AddEquipmentModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  categories 
}: AddEquipmentModalProps) {
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = ''
      
      if (imageFile) {
        imageUrl = await equipmentApi.uploadImage(imageFile)
      }
      
      await equipmentApi.create({
        ...formData,
        imageUrl: imageUrl
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
    setImageFile(null)
    setImagePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Image Upload Section */}
          <div>
            <h3 className="text-sm font-semibold text-sky-400 mb-3">Media</h3>
            <div className="flex items-center gap-4">
              <div 
                className="w-32 h-32 rounded-xl bg-slate-800/80 border border-white/10 overflow-hidden cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                    <ImageIcon className="w-8 h-8 mb-1" />
                    <span className="text-xs">Click to upload</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700 transition-all border border-white/10"
                >
                  <Upload className="w-4 h-4" />
                  Choose Image
                </button>
                <p className="text-xs text-slate-400 mt-2">
                  JPG, PNG, GIF (Max 5MB)
                </p>
              </div>
            </div>
          </div>

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
              className="px-4 py-2 rounded-lg bg-linear-to-r from-sky-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Equipment'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}