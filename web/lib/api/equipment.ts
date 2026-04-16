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
  model: string;
  manufacturer: string;
  specifications: string;
  conditionStatus: string;
  purchaseDate: string;
  serialNumber: string;
  quantity: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: number;
    name: string;
  };
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

  getById: (id: number) => 
    apiRequest<Equipment>(`/equipments/${id}`),

  search: (query: string, page = 0, limit = 50) => 
    apiRequest<PaginatedResponse<Equipment>>(`/equipments/search?q=${query}&page=${page}&limit=${limit}`),

  create: (data: Partial<Equipment>) => 
    apiRequest<Equipment>('/equipments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<Equipment>) => 
    apiRequest<Equipment>(`/equipments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: number, status: string) => 
    apiRequest<Equipment>(`/equipments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  archive: (id: number) => 
    apiRequest<void>(`/equipments/${id}`, {
      method: 'DELETE',
    }),
};