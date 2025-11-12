import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuthStore } from '@/store/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Reset the store
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,
    })
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore())
      
      expect(result.current.user).toBeNull()
      expect(result.current.token).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current._hasHydrated).toBe(false)
    })
  })

  describe('setAuth', () => {
    it('should set user and token correctly', () => {
      const { result } = renderHook(() => useAuthStore())
      
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      }
      const mockToken = 'mock-jwt-token'

      act(() => {
        result.current.setAuth(mockUser, mockToken)
      })

      expect(result.current.user).toEqual(mockUser)
      expect(result.current.token).toBe(mockToken)
      expect(result.current.isAuthenticated).toBe(true)
    })

    it('should save to localStorage', () => {
      const { result } = renderHook(() => useAuthStore())
      
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      }
      const mockToken = 'mock-jwt-token'

      act(() => {
        result.current.setAuth(mockUser, mockToken)
      })

      expect(localStorage.getItem('token')).toBe(mockToken)
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser))
    })
  })

  describe('logout', () => {
    it('should clear user and token', () => {
      const { result } = renderHook(() => useAuthStore())
      
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      }
      const mockToken = 'mock-jwt-token'

      // First login
      act(() => {
        result.current.setAuth(mockUser, mockToken)
      })

      // Then logout
      act(() => {
        result.current.logout()
      })

      expect(result.current.user).toBeNull()
      expect(result.current.token).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should clear localStorage', () => {
      const { result } = renderHook(() => useAuthStore())
      
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      }
      const mockToken = 'mock-jwt-token'

      // First login
      act(() => {
        result.current.setAuth(mockUser, mockToken)
      })

      // Then logout
      act(() => {
        result.current.logout()
      })

      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
    })
  })

  describe('updateUser', () => {
    it('should update user data', () => {
      const { result } = renderHook(() => useAuthStore())
      
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      }

      // First login
      act(() => {
        result.current.setAuth(mockUser, 'token')
      })

      // Update user
      act(() => {
        result.current.updateUser({ name: 'Updated Name' })
      })

      expect(result.current.user?.name).toBe('Updated Name')
      expect(result.current.user?.email).toBe('test@example.com')
    })

    it('should update localStorage', () => {
      const { result } = renderHook(() => useAuthStore())
      
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      }

      // First login
      act(() => {
        result.current.setAuth(mockUser, 'token')
      })

      // Update user
      act(() => {
        result.current.updateUser({ name: 'Updated Name' })
      })

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
      expect(storedUser.name).toBe('Updated Name')
    })
  })

  describe('Persistence/Hydration', () => {
    it('should persist auth state to localStorage', async () => {
      const { result } = renderHook(() => useAuthStore())
      
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      }
      const mockToken = 'mock-jwt-token'

      act(() => {
        result.current.setAuth(mockUser, mockToken)
      })

      // Check that data is in localStorage
      const authStorage = localStorage.getItem('auth-storage')
      expect(authStorage).toBeTruthy()
      
      if (authStorage) {
        const parsed = JSON.parse(authStorage)
        expect(parsed.state.user).toEqual(mockUser)
        expect(parsed.state.token).toBe(mockToken)
        expect(parsed.state.isAuthenticated).toBe(true)
      }
    })

    it('should set _hasHydrated flag after rehydration', async () => {
      const { result } = renderHook(() => useAuthStore())
      
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      }

      // Set auth
      act(() => {
        result.current.setAuth(mockUser, 'token')
      })

      // Manually trigger hydration
      act(() => {
        result.current.setHasHydrated(true)
      })

      expect(result.current._hasHydrated).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle updating user when no user is logged in', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.updateUser({ name: 'Test' })
      })

      expect(result.current.user).toBeNull()
    })

    it('should handle multiple login/logout cycles', () => {
      const { result } = renderHook(() => useAuthStore())
      
      const user1 = { id: '1', email: 'user1@test.com', name: 'User 1', role: 'user' }
      const user2 = { id: '2', email: 'user2@test.com', name: 'User 2', role: 'admin' }

      // First login
      act(() => {
        result.current.setAuth(user1, 'token1')
      })
      expect(result.current.user?.id).toBe('1')

      // Logout
      act(() => {
        result.current.logout()
      })
      expect(result.current.user).toBeNull()

      // Second login
      act(() => {
        result.current.setAuth(user2, 'token2')
      })
      expect(result.current.user?.id).toBe('2')
      expect(result.current.user?.role).toBe('admin')
    })
  })
})
