import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import PRWebsite from './pages/PRWebsite'
import Login from './pages/Login'
import Signup from './pages/Signup'
import DeactivatedAccount from './pages/DeactivatedAccount'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import ChangePassword from './pages/ChangePassword'
import ReserveYourSpot from './pages/public/ReserveYourSpot'
import ReservationStatus from './pages/public/ReservationStatus'
import EventDetails from './pages/public/EventDetails'
import Editor from './components/dashboard/Editor'
import ForgotPassword from './pages/ForgotPassword'
import SubscriptionPage from './pages/SubscriptionPage'
import PaymentMockPage from './pages/PaymentMockPage'
import { useAuthStore } from './stores/authStore'

function App() {
    const { isAuthenticated, isHydrating, user, hydrate } = useAuthStore()

    // On every page load/refresh, re-fetch user from DB to get the latest role
    useEffect(() => {
        hydrate()
    }, [])

    // Show nothing while we're re-validating the session so routes render
    // with the correct user.role (avoids flash of wrong UI)
    if (isHydrating) {
        return null
    }

    const isAdmin = isAuthenticated && user?.role?.toUpperCase() === 'ADMIN'

    return (
        <>
            <Routes>
            {/* Home route - shows different landing based on auth status */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/subscription" element={isAuthenticated ? <SubscriptionPage /> : <Navigate to="/login" replace />} />
            <Route path="/payment" element={isAuthenticated ? <PaymentMockPage /> : <Navigate to="/login" replace />} />
            <Route path="/deactivated-account" element={<DeactivatedAccount />} />
            <Route path="/pr/:username" element={<PRWebsite />} />
            <Route path="/pr/:username/event/:eventId" element={<EventDetails />} />
            <Route path="/pr/:username/reserve/:eventId" element={<ReserveYourSpot />} />
            <Route path="/reserve/status/:code" element={<ReservationStatus />} />

            {/* Protected routes */}
            <Route
                path="/dashboard/*"
                element={
                    isAuthenticated ? (
                        user?.isSubscribed ? <Dashboard /> : <Navigate to="/subscription" replace />
                    ) : <Navigate to="/login" replace />
                }
            />
            <Route
                path="/profile/:tenantId?"
                element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />}
            />
            <Route
                path="/profile/edit"
                element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" replace />}
            />
            <Route
                path="/profile/change-password"
                element={isAuthenticated ? <ChangePassword /> : <Navigate to="/login" replace />}
            />

            <Route
                path="/editor"
                element={
                    isAuthenticated ? (
                        user?.isSubscribed ? <Editor /> : <Navigate to="/subscription" replace />
                    ) : <Navigate to="/login" replace />
                }
            />

            <Route
                path="/admin/*"
                element={isAdmin ? <Navigate to="/dashboard/admin/tenants" replace /> : <Navigate to="/" replace />}
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-center" richColors />
    </>
    )
}

export default App
