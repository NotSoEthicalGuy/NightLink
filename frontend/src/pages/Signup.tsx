import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import SignupCardSection from '../components/ui/signup-card'

export default function Signup() {
    const navigate = useNavigate()
    const { login } = useAuthStore()

    const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: Profile
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [resendCooldown, setResendCooldown] = useState(0)

    const [signupData, setSignupData] = useState({
        email: '',
        otpCode: '',
    })

    const startResendCooldown = () => {
        setResendCooldown(60)
        const interval = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    const handleEmailSubmit = async (email: string) => {
        try {
            setLoading(true)
            setError('')
            await api.post('/auth/request-otp', { email })
            setSignupData(prev => ({ ...prev, email }))
            setStep(2)
            startResendCooldown()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send verification code. Try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleOtpSubmit = async (otpCode: string) => {
        try {
            setLoading(true)
            setError('')
            await api.post('/auth/verify-otp', { email: signupData.email, code: otpCode })
            setSignupData(prev => ({ ...prev, otpCode }))
            setStep(3)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid or expired code.')
        } finally {
            setLoading(false)
        }
    }

    const handleProfileSubmit = async (data: {
        name: string;
        slug: string;
        password: string;
        confirmPassword: string;
        whatsapp: string;
        preferredPaymentMethod: string;
    }) => {
        try {
            setLoading(true)
            setError('')

            // Validate passwords match
            if (data.password !== data.confirmPassword) {
                setError("Passwords don't match")
                setLoading(false)
                return
            }

            const { confirmPassword, ...rest } = data
            const finalData = {
                ...rest,
                email: signupData.email,
                otpCode: signupData.otpCode
            }

            const response = await api.post('/auth/signup', finalData)
            login(response.data.user, response.data.token)
            navigate('/subscription')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleResendOtp = () => {
        if (resendCooldown > 0) return
        handleEmailSubmit(signupData.email)
    }

    return (
        <SignupCardSection
            onEmailSubmit={handleEmailSubmit}
            onOtpSubmit={handleOtpSubmit}
            onProfileSubmit={handleProfileSubmit}
            error={error}
            loading={loading}
            onLoginClick={() => navigate('/login')}
            onContactClick={() => console.log('Contact clicked')}
            onHomeClick={() => navigate('/')}
            step={step}
            email={signupData.email}
            onBackToEmail={() => setStep(1)}
            resendCooldown={resendCooldown}
            onResendOtp={handleResendOtp}
        />
    )
}
