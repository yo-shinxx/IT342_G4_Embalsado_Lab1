'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Edit, 
  Archive, 
  Clock, 
  User, 
  Calendar,
  Package,
  Hash,
  FileText,
  Building2,
  Boxes
} from 'lucide-react'
import Background from '@/components/background'
import Navbar from '@/components/navbar'
import Header from '@/components/header'
import { equipmentApi, EquipmentDetail } from '@/lib/api/equipment'
import { toast } from 'sonner'
import { useRole } from '@/components/role-provider'
import EditEquipmentModal from '@/components/modals/edit-equipment-modal'
import UpdateStatusModal from '@/components/modals/update-status-modal'
import ConfirmArchiveModal from '@/components/modals/confirm-archive-modal'

export default function EquipmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { isCoordinator } = useRole()
  const [equipment, setEquipment] = useState<EquipmentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)

  const equipmentId = Number(params.id)

  const fetchEquipment = async () => {
    try {
      setLoading(true)
      const data = await equipmentApi.getById(equipmentId)
      setEquipment(data)
    } catch (error: any) {
      console.error('Failed to fetch equipment:', error)
      toast.error(error.message || 'Failed to load equipment details')
      router.push('/equipments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/login')
    } else {
      fetchEquipment()
    }
  }, [equipmentId])

  const handleUpdateSuccess = () => {
    fetchEquipment()
    setIsEditModalOpen(false)
    setIsStatusModalOpen(false)
  }

  const handleArchive = async () => {
    try {
      await equipmentApi.archive(equipmentId)
      toast.success('Equipment archived successfully')
      router.push('/equipments')
    } catch (error: any) {
      console.error('Failed to archive equipment:', error)
      toast.error(error.message || 'Failed to archive equipment')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'EXCELLENT':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'GOOD':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'FAIR':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'POOR':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'DAMAGED':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'FOR_DISPOSAL':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#020617] via-[#0f172a] to-[#020617] text-white">
        <Background />
        <Navbar />
        <div className="min-h-screen flex flex-col" style={{ marginLeft: '280px' }}>
          <Header title="Equipment Details" />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Loading equipment details...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!equipment) {
    return null
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#020617] via-[#0f172a] to-[#020617] text-white">
      <Background />
      <Navbar />

      <div className="min-h-screen flex flex-col" style={{ marginLeft: '280px' }}>
        <Header title="Equipment Details" />

        <main className="flex-1 p-8 pt-6 overflow-y-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/equipments')}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Equipment List
          </button>

          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{equipment.name}</h1>
              <div className="flex items-center gap-3">
                <span className="text-slate-400">{equipment.category.name}</span>
                <span className={`text-sm px-3 py-1 rounded-full border ${getStatusColor(equipment.conditionStatus)}`}>
                  {equipment.conditionStatus}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!isCoordinator && (
                <button
                  onClick={() => setIsStatusModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl text-white border border-white/10 hover:border-sky-500/30 transition-all"
                >
                  <Edit className="w-4 h-4" />
                  Update Status
                </button>
              )}

              {isCoordinator && (
                <>
                  <button
                    onClick={() => setIsStatusModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl text-white border border-white/10 hover:border-sky-500/30 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    Update Status
                  </button>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-sky-500 to-cyan-500 rounded-xl text-white hover:opacity-90 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Details
                  </button>
                  <button
                    onClick={() => setIsArchiveModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-xl text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              {/* Equipment Image */}
              <div className="rounded-2xl bg-slate-800/90 border border-white/10 p-6">
                <div className="aspect-square rounded-xl bg-slate-700 overflow-hidden mb-4">
                  {equipment.imageUrl ? (
                    <img
                      src={equipment.imageUrl}
                      alt={equipment.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-24 h-24 text-slate-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Info Card */}
              <div className="rounded-2xl bg-slate-800/90 border border-white/10 p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Boxes className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-400">Quantity:</span>
                    <span className="font-semibold ml-auto">{equipment.quantity}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-400">Purchase Date:</span>
                    <span className="font-medium ml-auto">{formatDate(equipment.purchaseDate)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-400">Added By:</span>
                    <span className="font-medium ml-auto">{equipment.createdBy.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-400">Created:</span>
                    <span className="font-medium ml-auto">{formatDate(equipment.createdAt)}</span>
                  </div>
                  {equipment.updatedAt && (
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-400">Last Updated:</span>
                      <span className="font-medium ml-auto">{formatDate(equipment.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl bg-slate-800/90 border border-white/10 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sky-500" />
                  Basic Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 block mb-1">Model</label>
                    <p className="font-medium">{equipment.model || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-1">Manufacturer</label>
                    <p className="font-medium">{equipment.manufacturer || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-1">Serial Number</label>
                    <p className="font-medium font-mono text-sm">{equipment.serialNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-1">Category</label>
                    <p className="font-medium">{equipment.category.name}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-800/90 border border-white/10 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-sky-500" />
                  Specifications
                </h3>
                <div className="text-slate-300 whitespace-pre-wrap">
                  {equipment.specifications || 'No specifications provided'}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {isCoordinator && (
        <EditEquipmentModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleUpdateSuccess}
          equipment={equipment}
        />
      )}

      <UpdateStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onSuccess={handleUpdateSuccess}
        equipment={equipment}
      />

      {isCoordinator && (
        <ConfirmArchiveModal
          isOpen={isArchiveModalOpen}
          onClose={() => setIsArchiveModalOpen(false)}
          onConfirm={handleArchive}
          equipmentName={equipment.name}
        />
      )}
    </div>
  )
}