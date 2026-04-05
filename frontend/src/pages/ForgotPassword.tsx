import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import ForgotPasswordCard from '../components/ui/forgot-password-card'
import { toast } from 'sonner'

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('')
    const [otpCode, setOtpCode] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)

    useEffect(() => {
        let timer: any
        if (resendCooldown > 0) {
            timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000)
        }
        return () => clearInterval(timer)
    }, [resendCooldown])

    const handleEmailSubmit = async (emailToSubmit: string) => {
        try {
            setLoading(true)
            setError('')
            await api.post('/auth/forgot-password', { email: emailToSubmit })
            setEmail(emailToSubmit)
            setStep(2)
            setResendCooldown(60)
            toast.success('Verification code sent')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send recovery code')
        } finally {
            setLoading(false)
        }
    }

    const handleOtpSubmit = async (otpToSubmit: string) => {
        try {
            setLoading(true)
            setError('')
            await api.post('/auth/verify-forgot-password', { email, code: otpToSubmit })
            setOtpCode(otpToSubmit)
            setStep(3)
            toast.success('Identity verified')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid or expired code')
        } finally {
            setLoading(false)
        }
    }

    const handleResetSubmit = async (passwordToSubmit: string) => {
        try {
            setLoading(true)
            setError('')
            await api.post('/auth/reset-password', { 
                email, 
                code: otpCode, 
                newPassword: passwordToSubmit 
            })
            toast.success('Password updated successfully')
            setTimeout(() => navigate('/login'), 2000)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Reset failed')
        } finally {
            setLoading(false)
        }
    }

    const handleResend = () => {
        handleEmailSubmit(email)
    }

    return (
        <ForgotPasswordCard
            step={step}
            email={email}
            error={error}
            loading={loading}
            resendCooldown={resendCooldown}
            onEmailSubmit={handleEmailSubmit}
            onOtpSubmit={handleOtpSubmit}
            onResetSubmit={handleResetSubmit}
            onResendOtp={handleResend}
            onLoginClick={() => navigate('/login')}
            onHomeClick={() => navigate('/')}
        />
    )
}
