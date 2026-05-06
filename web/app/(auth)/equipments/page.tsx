'use client'

import { Plus, MoreVertical, PackageSearch } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Background from '@/components/background'
import Navbar from '@/components/navbar'
import Header from '@/components/header'
import SearchBar from '@/components/ui/search-bar'
import FilterDropdown from '@/components/ui/filter-dropdown'
import ViewToggle from '@/components/ui/view-toggle'
import AddEquipmentModal from '@/components/modals/add-equipment-modal'
import { equipmentApi, Equipment, Category } from '@/lib/api/equipment'
import { apiRequest } from '@/lib/api'
import { toast } from 'sonner'
import { useRole } from '@/components/role-provider'

export default function EquipmentPage() {
  const router = useRouter()
  const { isCoordinator } = useRole()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 12

  const fetchEquipment = async (page: number = 0) => {
    try {
      setLoading(true)
      
      // Determine categoryId from selected category name
      let categoryId: number | undefined = undefined
      if (selectedCategory !== 'All') {
        const category = categories.find(c => c.name === selectedCategory)
        categoryId = category?.id
      }
      
      let data
      
      if (searchQuery.trim()) {
        data = await equipmentApi.search(searchQuery, page, itemsPerPage)
      } else {
        // use getAll with optional category filter
        data = await equipmentApi.getAll(page, itemsPerPage, categoryId)
      }
      
      setEquipment(data.content)
      setCurrentPage(data.pagination.page)
      setTotalPages(data.pagination.pages)
      setTotalItems(data.pagination.total)
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
      fetchCategories()
    }
  }, [router])

  useEffect(() => {
    if (categories.length > 0) {
      fetchEquipment(0) // Reset to page 0 when filters change
    }
  }, [selectedCategory, searchQuery, categories])

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

  const handleAddSuccess = () => {
    fetchEquipment(currentPage)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      fetchEquipment(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      fetchEquipment(currentPage - 1)
    }
  }

  const categoryOptions = ['All', ...categories.map(c => c.name)]

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
              <p className="text-slate-400 text-sm mt-1">
                {totalItems} total equipment{totalItems !== 1 ? 's' : ''}
              </p>
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

          {/* Search, Filter, and View Toggle Bar */}
          <div className="mb-6 flex items-center justify-between">
            <div className="w-80">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search equipments..."
              />
            </div>
            <div className="flex items-center gap-4">
              <FilterDropdown
                options={categoryOptions}
                value={selectedCategory}
                onChange={setSelectedCategory}
                label="Category"
              />
              <ViewToggle
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Loading equipment...</p>
            </div>
          )}

          {/* Grid View */}
          {!loading && viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {equipment.map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/equipments/${item.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      router.push(`/equipments/${item.id}`);
                    }
                  }}
                  role="button"
                  tabIndex={0}
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
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/10 transition-all"
                        aria-label="More options"
                      >
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
          {!loading && viewMode === 'list' && (
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-4 px-4 py-3 rounded-xl bg-slate-800/60 border border-white/10 text-slate-400 text-sm font-medium">
                <div className="col-span-5">Equipment Name</div>
                <div className="col-span-3">Category</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Status</div>
              </div>
              
              {equipment.map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/equipments/${item.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      router.push(`/equipments/${item.id}`);
                    }
                  }}
                  role="button"
                  tabIndex={0}
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
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/10 transition-all"
                        aria-label="More options"
                      >
                        <MoreVertical className="w-4 h-4 text-slate-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && equipment.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800/80 flex items-center justify-center">
                <PackageSearch className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No equipment found</h3>
              <p className="text-slate-400">
                {searchQuery 
                  ? `No results for "${searchQuery}"`
                  : selectedCategory !== 'All'
                  ? `No equipment in category "${selectedCategory}"`
                  : 'No equipment available'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {!loading && equipment.length > 0 && (
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