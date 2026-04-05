import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../types'
import api from '../lib/api'

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isHydrating: boolean
    login: (user: User, token: string) => void
    logout: () => void
    updateUser: (user: User) => void
    hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isHydrating: false,

            login: (user, token) => {
                set({ user, token, isAuthenticated: true })
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false })
            },

            updateUser: (user) => {
                set({ user })
            },

            hydrate: async () => {
                const { token } = get()
                if (!token) return

                set({ isHydrating: true })
                try {
                    const response = await api.get('/auth/me')
                    set({ user: response.data, isAuthenticated: true })
                } catch {
                    // Token invalid/expired — force logout
                    set({ user: null, token: null, isAuthenticated: false })
                } finally {
                    set({ isHydrating: false })
                }
            },
        }),
        {
            name: 'nightlink-auth',
        }
    )
)
