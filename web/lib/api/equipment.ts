import { apiRequest } from '@/lib/api';

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
  }
};

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