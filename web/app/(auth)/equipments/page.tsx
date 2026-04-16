'use client'

import { Plus, MoreVertical, PackageSearch } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Background from '@/components/background'
import Navbar from '@/components/navbar'
import Header from '@/components/header'
import ActionBar from '@/components/ui/action-bar'
import AddEquipmentModal from '@/components/modals/add-equipment-modal'
import { equipmentApi, Equipment, Category } from '@/lib/api/equipment'
import { apiRequest } from '@/lib/api'
import { toast } from 'sonner'
import { useUserRole } from '@/hooks/useUserRole'

export default function EquipmentPage() {
  const router = useRouter()
  const { isCoordinator, loading: roleLoading } = useUserRole()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchEquipment = async () => {
    try {
      const data = await equipmentApi.getAll(0, 100)
      setEquipment(data.content)
      setFilteredEquipment(data.content)
    } catch (error) {
      console.error('Failed to fetch equipment:', error)
      toast.error('Failed to load equipment')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await apiRequest<Category[]>('/categories')
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/login')
    } else {
      fetchEquipment()
      fetchCategories()
    }
  }, [router])

  useEffect(() => {
    let filtered = equipment
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category?.name === selectedCategory)
    }
    
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    setFilteredEquipment(filtered)
  }, [searchQuery, selectedCategory, equipment])

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
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const handleAddSuccess = () => {
    fetchEquipment()
  }

  const categoryOptions = ['All', ...categories.map(c => c.name)]

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#020617] via-[#0f172a] to-[#020617] text-white">
        <Background />
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center" style={{ marginLeft: '280px' }}>
          <div className="w-12 h-12 rounded-full border-2 border-sky-500/30 border-t-sky-500 animate-spin" />
          <p className="mt-4 text-slate-400">Loading equipment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#020617] via-[#0f172a] to-[#020617] text-white">
      <Background />
      <Navbar />

      <div className="min-h-screen flex flex-col" style={{ marginLeft: '280px' }}>
        <Header title="Equipments" />

        <main className="flex-1 p-8 pt-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Lab Equipments</h1>
              <p className="text-slate-400 text-sm mt-1">Manage and track all laboratory equipment</p>
            </div>
            {isCoordinator && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-sky-500 to-cyan-500 rounded-xl text-white font-semibold hover:opacity-90 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Equipment
              </button>
            )}
          </div>

          <ActionBar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search equipments..."
            filterOptions={categoryOptions}
            filterValue={selectedCategory}
            onFilterChange={setSelectedCategory}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Grid View */}
            {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredEquipment.map((item) => (
                <div
                    key={item.id}
                    className="group rounded-2xl bg-slate-800/90 border border-white/10 p-5 hover:border-sky-500/30 hover:shadow-lg transition-all cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center overflow-hidden">
                        {item.imageUrl ? (
                        <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                        ) : (
                        <div className="w-6 h-6 rounded-lg bg-sky-500/30 flex items-center justify-center text-sky-500 font-bold">
                            {item.name.charAt(0)}
                        </div>
                        )}
                    </div>
                    {isCoordinator && (
                        <button className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/10 transition-all">
                        <MoreVertical className="w-4 h-4 text-slate-500" />
                        </button>
                    )}
                    </div>
                    
                    <h3 className="text-lg font-bold mb-1">{item.name}</h3>
                    <p className="text-slate-400 text-sm mb-2">{item.category?.name}</p>
                    
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                    <span className="text-sm text-slate-500">Qty: {item.quantity}</span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(item.conditionStatus)}`}>
                        {item.conditionStatus}
                    </span>
                    </div>
                </div>
                ))}
            </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="space-y-3">
                <div className="grid grid-cols-12 gap-4 px-4 py-3 rounded-xl bg-slate-800/60 border border-white/10 text-slate-400 text-sm font-medium">
                    <div className="col-span-5">Equipment Name</div>
                    <div className="col-span-3">Category</div>
                    <div className="col-span-2">Quantity</div>
                    <div className="col-span-2">Status</div>
                </div>
                
                {filteredEquipment.map((item) => (
                    <div
                    key={item.id}
                    className="grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-xl bg-slate-800/90 border border-white/10 hover:border-sky-500/30 transition-all cursor-pointer group"
                    >
                    <div className="col-span-5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-sky-500/20 to-cyan-500/20 flex items-center justify-center">
                        <span className="text-sky-500 text-sm font-bold">{item.name.charAt(0)}</span>
                        </div>
                        <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="col-span-3 text-slate-400 text-sm">{item.category?.name}</div>
                    <div className="col-span-2 text-sm">{item.quantity}</div>
                    <div className="col-span-2 flex justify-between items-center">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(item.conditionStatus)}`}>
                        {item.conditionStatus}
                        </span>
                        {isCoordinator && (
                        <button className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/10 transition-all">
                            <MoreVertical className="w-4 h-4 text-slate-500" />
                        </button>
                        )}
                    </div>
                    </div>
                ))}
                </div>
            )}

            {filteredEquipment.length === 0 && (
                <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800/80 flex items-center justify-center">
                    <PackageSearch className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No equipment found</h3>
                <p className="text-slate-400">Try adjusting your search or filter criteria</p>
                </div>
            )}

            {filteredEquipment.length > 0 && (
                <div className="mt-6 text-center text-sm text-slate-500">
                Showing {filteredEquipment.length} of {equipment.length} equipments
                </div>
            )}
            </main>
        </div>

        {isCoordinator && (
            <AddEquipmentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleAddSuccess}
            categories={categories}
            />
        )}
        </div>
  )
}