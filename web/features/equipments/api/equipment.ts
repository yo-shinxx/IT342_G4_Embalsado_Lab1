import { apiRequest } from '@/features/shared/lib/api';

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Equipment {
  id: number;
  name: string;
  category: Category;
  model?: string;
  manufacturer?: string;
  specifications?: string;
  conditionStatus: string;
  purchaseDate?: string;
  serialNumber?: string;
  quantity: number;
  imageUrl: string;
  createdAt: string;
  updatedAt?: string;
  createdBy: {
    id: number;
    name: string;
  };
}

export interface EquipmentFormData {
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

export interface EquipmentDetail extends Equipment {
  model?: string
  manufacturer?: string
  specifications?: string
  purchaseDate?: string
  serialNumber?: string
  createdAt: string
  createdBy: {
    id: number
    name: string
  }
  updatedAt?: string
}


export interface PaginatedResponse<T> {
  content: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const equipmentApi = {
  getAll: (page = 0, limit = 50, categoryId?: number, status?: string) => {
    let url = `/equipments?page=${page}&limit=${limit}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    if (status) url += `&status=${status}`;
    return apiRequest<PaginatedResponse<Equipment>>(url);
  },

  getById: async (id: number): Promise<EquipmentDetail> => {
    const response = await apiRequest<EquipmentDetail>(`/equipments/${id}`)
    return response
  },

  getByName: async (name: string): Promise<Equipment | null> => {
    const response = await apiRequest<PaginatedResponse<Equipment>>(`/equipments?search=${encodeURIComponent(name)}&limit=1`)
    return response.content[0] || null
  },

  create: async (data: EquipmentFormData): Promise<EquipmentDetail> => {
    const response = await apiRequest<EquipmentDetail>(`/equipments`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return response
  },

  update: async (id: number, data: Partial<EquipmentFormData>): Promise<EquipmentDetail> => {
    const response = await apiRequest<EquipmentDetail>(`/equipments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    return response
  },

  updateStatus: async (id: number, status: string): Promise<EquipmentDetail> => {
    const response = await apiRequest<EquipmentDetail>(`/equipments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
    return response
  },

  archive: async (id: number): Promise<void> => {
    await apiRequest(`/equipments/${id}`, {
      method: 'DELETE'
    })
  },

  search: (query: string, page = 0, limit = 50) => {
  return apiRequest<PaginatedResponse<Equipment>>(`/equipments/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
},

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const token = localStorage.getItem('authToken')
    const response = await fetch('http://localhost:8080/api/uploads/equipment-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    
    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to upload image')
    }
    return result.imageUrl
  },
};
