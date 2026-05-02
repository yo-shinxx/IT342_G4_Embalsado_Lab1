import { apiRequest } from '@/lib/api'
import { PaginatedResponse } from './equipment'

export interface Transaction {
  id: number
  timestamp: string
  user: {
    id: number
    name: string
    email: string
  }
  equipment: {
    id: number
    name: string
  }
  actionType: 'ADD' | 'UPDATE' | 'STATUS_CHANGE' | 'ARCHIVE'
  details: {
    previousStatus?: string
    newStatus?: string
    reason?: string
    fieldsChanged?: string[]
    previousValues?: Record<string, any>
    newValues?: Record<string, any>
    [key: string]: any
  }
}

export interface TransactionLog {
  id: number
  action: string
  timestamp: string
  equipmentName: string
  user_id: number
  email: string
  details: string
}

export interface TransactionLogListResponse {
  content: TransactionLog[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface TransactionListResponse {
  content: Transaction[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export const transactionApi = {
  // Get all transactions with optional filters
  getAll: async (
    page: number = 0,
    limit: number = 50,
    filters?: {
      actionType?: string
      startDate?: string
      endDate?: string
    }
  ): Promise<TransactionListResponse> => {
    let url = `/transactions?page=${page}&limit=${limit}`
    
    if (filters?.actionType) {
      url += `&actionType=${filters.actionType}`
    }
    if (filters?.startDate) {
      url += `&startDate=${filters.startDate}`
    }
    if (filters?.endDate) {
      url += `&endDate=${filters.endDate}`
    }
    
    return await apiRequest<TransactionListResponse>(url)
  },

   getRecentActivity: (page = 0, limit = 5) => {
    return apiRequest<PaginatedResponse<TransactionLog>>(`/transaction-logs?page=${page}&limit=${limit}&order=timestamp:desc`);
  },
  // for transaction logs
  getAllLogs: (
    page: number = 0,
    limit: number = 50,
    filters?: {
      action?: string
      startDate?: string
      endDate?: string
    }
  ): Promise<TransactionLogListResponse> => {
    let url = `/transaction-logs?page=${page}&limit=${limit}&sort=timestamp&direction=desc`
    
    if (filters?.action) {
      url += `&action=${filters.action}`
    }
    if (filters?.startDate) {
      url += `&startDate=${filters.startDate}`
    }
    if (filters?.endDate) {
      url += `&endDate=${filters.endDate}`
    }
    
    return apiRequest<TransactionLogListResponse>(url)
  },

  getByEquipment: async (
    equipmentId: number,
    page: number = 0,
    limit: number = 50
  ): Promise<TransactionListResponse> => {
    return await apiRequest<TransactionListResponse>(
      `/transactions/equipment/${equipmentId}?page=${page}&limit=${limit}`
    )
  },

  getByUser: async (
    userId: number,
    page: number = 0,
    limit: number = 50
  ): Promise<TransactionListResponse> => {
    return await apiRequest<TransactionListResponse>(
      `/transactions/user/${userId}?page=${page}&limit=${limit}`
    )
  }
}