import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ArrowLeft, Check, X, ShieldCheck, ShieldAlert } from 'lucide-react'

export default function ChangePassword() {
    const navigate = useNavigate()
    const [saving, setSaving] = useState(false)
    const [oldPwdValid, setOldPwdValid] = useState<boolean | null>(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const { register, handleSubmit, watch, formState: { errors } } = useForm()

    const oldPassword = watch('oldPassword', '')
    const newPassword = watch('newPassword', '')
    const confirmPassword = watch('confirmPassword', '')

    const passwordsMatch = newPassword === confirmPassword && newPassword?.length >= 6

    // Verify old password as user types (debounced or on blur)
    useEffect(() => {
        const verify = async () => {
            if (oldPassword.length < 1) {
                setOldPwdValid(null)
                return
            }
            try {
                const res = await api.post('/auth/verify-password', { password: oldPassword })
                setOldPwdValid(res.data.isValid)
            } catch (err) {
                setOldPwdValid(false)
            }
        }

        const timeoutId = setTimeout(verify, 500)
        return () => clearTimeout(timeoutId)
    }, [oldPassword])

    const onSubmit = async (data: any) => {
        if (!oldPwdValid) {
            setError('Current password is incorrect')
            return
        }
        if (!passwordsMatch) {
            setError('New passwords do not match')
            return
        }

        try {
            setSaving(true)
            setError('')
            setSuccess('')
            await api.post('/auth/change-password', {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            })
            setSuccess('Password updated successfully!')
            setTimeout(() => navigate('/profile/edit'), 2000)
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to change password')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
            <div className="max-w-2xl mx-auto space-y-12">
                <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                    <Link to="/profile/edit" className="flex items-center gap-2 text-gray-500 hover:text-[#ff0080] transition-colors mb-4 font-bold text-sm group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Edit Profile
                    </Link>
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter" style={{ fontFamily: 'Archivo Black' }}>Security</h1>
                    <p className="text-gray-400 font-medium">Update your access credentials</p>
                </div>

                <div className="bg-[#1a0025] border border-white/5 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent blur-3xl" />

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Old Password */}
                        <div className="relative">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Current Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    type="password"
                                    {...register('oldPassword', { required: true })}
                                    className={`bg-white/5 border ${oldPwdValid === true ? 'border-green-500/50' : oldPwdValid === false ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-12 pr-12 py-4 w-full focus:border-white/30 outline-none transition-all font-bold`}
                                    placeholder="••••••••"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    {oldPwdValid === true && <Check className="text-green-500" size={20} />}
                                    {oldPwdValid === false && <X className="text-red-500" size={20} />}
                                </div>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">New Password</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                    <input
                                        type="password"
                                        {...register('newPassword', { required: true, minLength: 6 })}
                                        className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 w-full focus:border-[#ff0080]/50 outline-none transition-all font-bold"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.newPassword && <span className="text-red-400 text-[10px] font-bold uppercase mt-2 block tracking-widest">Min 6 characters required</span>}
                            </div>

                            <div className="relative">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Confirm New Password</label>
                                <div className="relative">
                                    <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                    <input
                                        type="password"
                                        {...register('confirmPassword', { required: true })}
                                        className={`bg-white/5 border ${confirmPassword ? (passwordsMatch ? 'border-green-500/50' : 'border-red-500/50') : 'border-white/10'} rounded-2xl pl-12 pr-12 py-4 w-full focus:border-[#ff0080]/50 outline-none transition-all font-bold`}
                                        placeholder="••••••••"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        {confirmPassword && (
                                            passwordsMatch ? <Check className="text-green-500" size={20} /> : <X className="text-red-500" size={20} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <AnimatePresence mode='wait'>
                            {error && (
                                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-red-400 text-xs font-black uppercase text-center tracking-widest bg-red-400/10 p-4 rounded-2xl border border-red-400/20">{error}</motion.p>
                            )}
                            {success && (
                                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-green-400 text-xs font-black uppercase text-center tracking-widest bg-green-400/10 p-4 rounded-2xl border border-green-400/20">{success}</motion.p>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={saving || !oldPwdValid || !passwordsMatch}
                            className="w-full bg-gradient-to-r from-red-500 to-red-700 py-5 rounded-[40px] font-black uppercase italic tracking-tighter text-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(239,68,68,0.3)] disabled:opacity-30 disabled:hover:scale-100"
                            style={{ fontFamily: 'Archivo Black' }}
                        >
                            {saving ? 'UPDATING...' : (
                                <>
                                    Verify & Change
                                    <Lock size={24} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
