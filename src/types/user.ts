export interface User {
  id: string
  username: string
  email: string
  password: string // hashed
  role: 'admin' | 'editor'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UserFormData {
  username: string
  email: string
  password: string
  role: 'admin' | 'editor'
  isActive: boolean
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthSession {
  userId: string
  username: string
  email: string
  role: 'admin' | 'editor'
}
