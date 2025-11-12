import { render, screen, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuthStore } from '@/store/auth'

// Mock the auth store
jest.mock('@/store/auth')
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe('ProtectedRoute', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    } as any)
  })

  describe('When not hydrated', () => {
    it('should show loading spinner while hydrating', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        user: null,
        token: null,
        _hasHydrated: false,
        setAuth: jest.fn(),
        logout: jest.fn(),
        updateUser: jest.fn(),
        setHasHydrated: jest.fn(),
      })

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })

    it('should not redirect while hydrating', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        user: null,
        token: null,
        _hasHydrated: false,
        setAuth: jest.fn(),
        logout: jest.fn(),
        updateUser: jest.fn(),
        setHasHydrated: jest.fn(),
      })

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('When hydrated and authenticated', () => {
    it('should render protected content', async () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: {
          id: '123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        },
        token: 'valid-token',
        _hasHydrated: true,
        setAuth: jest.fn(),
        logout: jest.fn(),
        updateUser: jest.fn(),
        setHasHydrated: jest.fn(),
      })

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument()
      })
    })

    it('should not redirect when authenticated', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: {
          id: '123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        },
        token: 'valid-token',
        _hasHydrated: true,
        setAuth: jest.fn(),
        logout: jest.fn(),
        updateUser: jest.fn(),
        setHasHydrated: jest.fn(),
      })

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('When hydrated but not authenticated', () => {
    it('should show loading spinner', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        user: null,
        token: null,
        _hasHydrated: true,
        setAuth: jest.fn(),
        logout: jest.fn(),
        updateUser: jest.fn(),
        setHasHydrated: jest.fn(),
      })

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })

    it('should redirect to login page', async () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        user: null,
        token: null,
        _hasHydrated: true,
        setAuth: jest.fn(),
        logout: jest.fn(),
        updateUser: jest.fn(),
        setHasHydrated: jest.fn(),
      })

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login')
      })
    })
  })

  describe('Hydration sequence', () => {
    it('should wait for hydration before redirecting', async () => {
      // Reset mock before this test
      mockPush.mockClear()
      
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        user: null,
        token: null,
        _hasHydrated: false,
        setAuth: jest.fn(),
        logout: jest.fn(),
        updateUser: jest.fn(),
        setHasHydrated: jest.fn(),
      })

      // Start with not hydrated
      const { rerender } = render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      // Should show loading, no redirect
      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(mockPush).not.toHaveBeenCalled()

      // Simulate hydration complete, but not authenticated
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        user: null,
        token: null,
        _hasHydrated: true,
        setAuth: jest.fn(),
        logout: jest.fn(),
        updateUser: jest.fn(),
        setHasHydrated: jest.fn(),
      })

      rerender(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      // Now it should redirect
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login')
      })
    })
  })
})
