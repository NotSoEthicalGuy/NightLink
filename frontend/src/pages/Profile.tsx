import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../lib/api'
import {
    User,
    Settings,
    MessageSquare,
    CreditCard,
    Calendar,
    Link as LinkIcon,
    Instagram,
    Edit3,
    Shield,
    CheckCircle2
} from 'lucide-react'
import { format } from 'date-fns'
import VerifiedBadge from '../components/templates/VerifiedBadge'

export default function Profile() {
    const { tenantId } = useParams()
    const [profileData, setProfileData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const url = tenantId ? `/admin/pr-full-profile/${tenantId}` : '/profile'
        api.get(url)
            .then(res => setProfileData(res.data))
            .catch(err => {
                console.error('Failed to fetch profile', err)
                setError(err.response?.data?.message || err.message || 'Failed to establish connection.')
            })
            .finally(() => setLoading(false))
    }, [tenantId])

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (error || !profileData) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-zinc-500 gap-6 p-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-zinc-900/50 border border-white/5 flex items-center justify-center text-zinc-500 mb-2">
                <Shield size={40} />
            </div>
            <div>
                <p className="text-2xl font-display font-medium text-white mb-2">
                    {error ? 'Access Restricted' : 'Profile Not Found'}
                </p>
                <p className="text-zinc-500 max-w-sm mx-auto mb-8">
                    {error || "The profile you're looking for is unavailable."}
                </p>
            </div>
            <Link to="/" className="text-gold font-bold uppercase text-xs tracking-widest px-8 py-4 border border-gold/30 rounded-2xl hover:bg-gold/10 transition-all flex items-center gap-2">
                Return to Base
            </Link>
        </div>
    )

    const contact = profileData.profile?.contactInfo || {}

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6 overflow-hidden relative">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[150px] rounded-full mix-blend-screen opacity-40" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[150px] rounded-full mix-blend-screen opacity-30" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-8">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
                        {/* Avatar */}
                        <div className="relative group">
                            <Link to="/" className="absolute -top-8 -left-2 z-30 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-gold transition-colors">
                                ← Return to Home Page
                            </Link>
                            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[40px] overflow-hidden bg-zinc-900 border border-white/10 p-1 shadow-2xl relative group-hover:border-gold/30 transition-colors">
                                <div className="w-full h-full bg-[#0a0a0a] rounded-[36px] overflow-hidden flex items-center justify-center">
                                    {profileData.profile?.photoUrl ? (
                                        <img
                                            src={profileData.profile.photoUrl.startsWith('/') ? `http://localhost:3001${profileData.profile.photoUrl}` : profileData.profile.photoUrl}
                                            alt=""
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <User className="text-zinc-700" size={60} />
                                    )}
                                </div>
                            </div>
                            {!tenantId && (
                                <Link to="/profile/edit" className="absolute -bottom-2 -right-2 w-10 h-10 bg-gold text-black rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                    <Edit3 size={18} />
                                </Link>
                            )}
                        </div>

                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    {profileData.role}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${profileData.subscriptionStatus === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                    {profileData.subscriptionStatus}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-display font-medium text-white mb-2 flex items-center gap-3">
                                {profileData.profile?.displayName || profileData.name}
                                {profileData.role?.toUpperCase() === 'ADMIN' && <VerifiedBadge size={28} className="mt-1" />}
                            </h1>
                            <p className="text-gold font-medium text-lg flex items-center justify-center md:justify-start gap-2">
                                <LinkIcon size={16} className="text-gold/50" />
                                @{profileData.slug}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        {!tenantId ? (
                            <>
                                <Link to="/dashboard" className="flex-1 md:flex-none px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all text-center text-zinc-300">
                                    Dashboard
                                </Link>
                                <Link to="/profile/edit" className="flex-1 md:flex-none px-6 py-3 bg-gold text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold/90 transition-all text-center">
                                    Edit Profile
                                </Link>
                            </>
                        ) : (
                            <div className="px-6 py-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl font-bold uppercase tracking-widest text-xs">
                                Admin View
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[32px] md:p-10 relative overflow-hidden group hover:border-gold/10 transition-colors backdrop-blur-sm">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                                <Edit3 size={14} className="text-gold" />
                                Bio
                            </h3>
                            <p className="text-xl text-zinc-200 font-light leading-relaxed">
                                "{profileData.profile?.bio || 'No bio provided yet.'}"
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[32px] backdrop-blur-sm">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">Account Details</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400">
                                            <Settings size={18} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email</p>
                                            <p className="text-white font-medium text-sm truncate">{profileData.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Member Since</p>
                                            <p className="text-white font-medium text-sm">{format(new Date(profileData.createdAt), 'MMM d, yyyy')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[32px] backdrop-blur-sm">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">Status</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                            <Shield size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Verification</p>
                                            <p className="text-white font-medium text-sm">Verified Account</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                                            <CheckCircle2 size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Subscription</p>
                                            <p className="text-white font-medium text-sm">Auto-Renewal On</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000">
                        <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[32px] backdrop-blur-sm">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-8">Contact Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 text-zinc-400 flex items-center justify-center group-hover:bg-green-500/10 group-hover:text-green-500 transition-colors">
                                        <MessageSquare size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-0.5">WhatsApp</p>
                                        <p className="text-lg font-display font-medium text-white">{contact.whatsapp || 'Not set'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 text-zinc-400 flex items-center justify-center group-hover:bg-pink-500/10 group-hover:text-pink-500 transition-colors">
                                        <Instagram size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-0.5">Instagram</p>
                                        <p className="text-lg font-display font-medium text-white">{contact.instagram || 'Not set'}</p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <CreditCard size={16} className="text-gold" />
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Payment Preference</h4>
                                    </div>
                                    <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                                        <p className="text-xl font-display font-medium text-white">
                                            {contact.preferredPaymentMethod || 'Not defined'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
