import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import {
    User,
    Lock,
    Phone,
    Instagram,
    CreditCard,
    MessageSquare,
    Camera,
    Save,
    ArrowLeft,
    ChevronDown
} from 'lucide-react'

export default function EditProfile() {
    const { updateUser } = useAuthStore()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm()

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setUploading(true)
            const formData = new FormData()
            formData.append('file', file)

            const res = await api.post('/profile/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            setValue('photoUrl', res.data.url)
        } catch (err) {
            console.error('Upload error:', err)
            alert('Failed to upload image')
        } finally {
            setUploading(false)
        }
    }

    useEffect(() => {
        api.get('/profile')
            .then(res => {
                const data = res.data
                reset({
                    name: data.name,
                    email: data.email,
                    slug: data.slug,
                    displayName: data.profile?.displayName,
                    bio: data.profile?.bio,
                    photoUrl: data.profile?.photoUrl,
                    whatsapp: data.profile?.contactInfo?.whatsapp || '',
                    instagram: data.profile?.contactInfo?.instagram || '',
                    phone: data.profile?.contactInfo?.phone || '',
                    preferredPaymentMethod: data.profile?.contactInfo?.preferredPaymentMethod || '',
                })
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [reset])

    const onProfileSubmit = async (data: any) => {
        try {
            setSaving(true)
            const { name, email, slug, displayName, bio, photoUrl, ...contactData } = data
            await api.patch('/profile', {
                name,
                email,
                slug,
                displayName,
                bio,
                photoUrl,
                contactInfo: contactData
            })

            const updated = await api.get('/profile')
            updateUser(updated.data)
            navigate('/profile')
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6 overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[10%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[150px] rounded-full mix-blend-screen opacity-30" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold/5 blur-[120px] rounded-full mix-blend-screen opacity-20" />
            </div>

            <div className="max-w-4xl mx-auto space-y-12 relative z-10 animate-in fade-in duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <Link to="/profile" className="flex items-center gap-2 text-zinc-500 hover:text-gold transition-colors mb-4 font-bold text-xs uppercase tracking-widest group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Profile
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-display font-medium text-white mb-2">Edit Profile</h1>
                        <p className="text-zinc-500 font-light">Refine your public persona and details</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-8">
                            {/* Visual Identity Section */}
                            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[40px] shadow-2xl backdrop-blur-sm group">
                                <h2 className="text-lg font-display font-medium text-white mb-8 flex items-center gap-3">
                                    <Camera className="text-gold" size={20} />
                                    Visual Identity
                                </h2>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-3xl bg-zinc-800 border border-white/10 flex items-center justify-center relative overflow-hidden group/photo">
                                            {watch('photoUrl') ? (
                                                <img
                                                    key={watch('photoUrl')}
                                                    src={watch('photoUrl')?.startsWith('/') ? `http://localhost:3001${watch('photoUrl')}?t=${Date.now()}` : `${watch('photoUrl')}?t=${Date.now()}`}
                                                    className="w-full h-full object-cover"
                                                    alt="Profile"
                                                />
                                            ) : (
                                                <User className="text-zinc-600" size={40} />
                                            )}
                                            {uploading && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                    <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Identity Photo</label>
                                            <input
                                                type="file"
                                                id="avatar-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById('avatar-upload')?.click()}
                                                disabled={uploading}
                                                className="bg-white/5 border border-white/10 rounded-xl px-6 py-3 w-full hover:bg-white/10 hover:border-gold/30 transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 text-zinc-300"
                                            >
                                                <Camera size={14} className="text-gold" />
                                                {uploading ? 'Processing...' : 'Upload Image'}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Display Name</label>
                                        <input
                                            {...register('displayName')}
                                            className="bg-zinc-900/50 border border-white/10 rounded-xl px-5 py-4 w-full focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all font-medium text-white placeholder-zinc-700"
                                            placeholder="Your Public Name"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Bio</label>
                                        <textarea
                                            {...register('bio')}
                                            className="bg-zinc-900/50 border border-white/10 rounded-xl px-5 py-4 w-full focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all font-light text-white placeholder-zinc-700 min-h-[120px]"
                                            placeholder="Tell your story..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact & Payment Section */}
                            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[40px] shadow-2xl backdrop-blur-sm">
                                <h2 className="text-lg font-display font-medium text-white mb-8 flex items-center gap-3">
                                    <MessageSquare className="text-gold" size={20} />
                                    Communication
                                </h2>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gold mb-2 block">WhatsApp Number (Required)</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                                <input
                                                    {...register('whatsapp', { required: true })}
                                                    className={`bg-zinc-900/50 border ${errors.whatsapp ? 'border-red-500/50' : 'border-white/10'} rounded-xl pl-12 pr-5 py-4 w-full focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all font-medium text-white placeholder-zinc-700`}
                                                    placeholder="+961 70 ..."
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Instagram Handle</label>
                                            <div className="relative">
                                                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                                <input
                                                    {...register('instagram')}
                                                    className="bg-zinc-900/50 border border-white/10 rounded-xl pl-12 pr-5 py-4 w-full focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all font-medium text-white placeholder-zinc-700"
                                                    placeholder="@username"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Alternative Phone</label>
                                            <input
                                                {...register('phone')}
                                                className="bg-zinc-900/50 border border-white/10 rounded-xl px-5 py-4 w-full focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all font-medium text-white placeholder-zinc-700"
                                                placeholder="Emergency contact"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gold mb-2 block">Preferred Payment Method</label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                                <select
                                                    {...register('preferredPaymentMethod', { required: true })}
                                                    className={`bg-zinc-900/50 border ${errors.preferredPaymentMethod ? 'border-red-500/50' : 'border-white/10'} rounded-xl pl-12 pr-10 py-4 w-full focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all font-medium text-white appearance-none cursor-pointer`}
                                                >
                                                    <option value="">Select Method...</option>
                                                    <option value="Whish Money">Whish Money</option>
                                                    <option value="OMT">OMT</option>
                                                    <option value="BoB Finance">BoB Finance</option>
                                                    <option value="Crypto">Crypto (USDT)</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-gold hover:bg-gold/90 text-black py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-gold/20 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
                            >
                                {saving ? 'Saving...' : (
                                    <>
                                        Save Changes
                                        <Save size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Sidebar: Account & Security */}
                    <div className="space-y-8">
                        {/* Security Card */}
                        <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[40px] shadow-xl backdrop-blur-sm">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                                <Lock className="text-zinc-500" size={16} />
                                Security
                            </h3>

                            <p className="text-zinc-500 text-xs font-medium mb-6 leading-relaxed">
                                Ensure your account remains secure by updating your password regularly.
                            </p>

                            <Link
                                to="/profile/change-password"
                                className="w-full bg-white/5 border border-white/10 text-zinc-300 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                Change Password
                            </Link>
                        </div>

                        {/* Public Link Card */}
                        <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/5 p-8 rounded-[40px] shadow-xl">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Universe Link</h3>
                            <p className="text-zinc-500 text-xs font-medium mb-4">Your public profile URL:</p>
                            <div className="bg-black/40 rounded-xl p-4 font-mono text-[10px] text-gold break-all border border-white/5 select-all">
                                nightlink.com/u/{watch('slug')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
