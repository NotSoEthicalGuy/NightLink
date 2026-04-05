import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import LoginCardSection from '../components/ui/login-signup'

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuthStore()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (email: string, password: string) => {
        try {
            setLoading(true)
            setError('')
            const response = await api.post('/auth/login', { email, password })
            const { user, token } = response.data
            login(user, token)
            if (!user.isSubscribed) {
                navigate('/subscription')
            } else {
                navigate('/dashboard')
            }
        } catch (err: any) {
            const message = err.response?.data?.message || ''
            if (message.startsWith('DEACTIVATED|')) {
                const reason = message.split('|')[1]
                navigate(`/deactivated-account?reason=${encodeURIComponent(reason)}`)
                return
            }
            setError(message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <LoginCardSection
            onSubmit={handleLogin}
            error={error}
            loading={loading}
            onSignupClick={() => navigate('/signup')}
            onForgotPasswordClick={() => navigate('/forgot-password')}
            onContactClick={() => console.log('Contact clicked')}
            onHomeClick={() => navigate('/')}
        />
    )
}
