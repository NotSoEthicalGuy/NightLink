import { useState, useEffect } from 'react'
import api from '../../lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Shield, Trash2, Ban, Calendar, Users, CheckCircle, Edit, Eye, ExternalLink, Settings, XCircle, Search, Building2, TrendingUp, Zap, BarChart3, DollarSign, Clock, Ticket, Archive, RotateCcw } from 'lucide-react'

// --- PR MANAGEMENT ---
export function AdminTenants() {
    const [tenants, setTenants] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [editingTenant, setEditingTenant] = useState<any>(null)
    const [editForm, setEditForm] = useState<any>({
        name: '',
        slug: '',
        displayName: '',
        bio: '',
        photoUrl: null
    })

    useEffect(() => {
        fetchTenants()
    }, [])

    const fetchTenants = async () => {
        try {
            const res = await api.get('/admin/tenants')
            setTenants(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const toggleStatus = async (id: string, current: boolean) => {
        const action = current ? 'activate' : 'deactivate'
        let adminNotes = ''

        if (!current) {
            const reason = prompt('Please provide a reason for deactivation (this will be shown to the PR):')
            if (reason === null) return // Cancel
            if (!reason.trim()) {
                alert('A reason is mandatory for deactivation.')
                return
            }
            adminNotes = reason
        }

        if (!confirm(`Are you sure you want to ${action} this PR?`)) return

        try {
            await api.patch(`/admin/tenants/${id}`, {
                isDeactivated: !current,
                adminNotes: !current ? adminNotes : '' // Clear notes on activation, or keep them? User said "when deactivates... leave him a reason"
            })
            fetchTenants()
        } catch (err) {
            alert('Action failed')
        }
    }

    const grantMonth = async (id: string, currentExpiresAt: string) => {
        const date = currentExpiresAt ? new Date(currentExpiresAt) : new Date()
        date.setMonth(date.getMonth() + 1)
        try {
            await api.patch(`/admin/tenants/${id}`, { subscriptionExpiresAt: date })
            fetchTenants()
            alert('Subscription extended')
        } catch (err) {
            alert('Failed to grant month')
        }
    }

    const openEditModal = (pr: any) => {
        setEditingTenant(pr)
        setEditForm({
            name: pr.name,
            slug: pr.slug,
            displayName: pr.profile?.displayName || '',
            bio: pr.profile?.bio || '',
            photoUrl: pr.profile?.photoUrl || ''
        })
    }

    const saveChanges = async () => {
        try {
            // Update Tenant basic info
            await api.patch(`/admin/tenants/${editingTenant.id}`, {
                name: editForm.name,
                slug: editForm.slug
            })

            // Update Profile info
            await api.patch(`/admin/tenants/${editingTenant.id}/profile`, {
                displayName: editForm.displayName,
                bio: editForm.bio,
                photoUrl: editForm.photoUrl
            })

            setEditingTenant(null)
            fetchTenants()
        } catch (err) {
            alert('Failed to save changes')
        }
    }

    const moderateBio = async (id: string, currentBio: string) => {
        const bio = prompt('New Bio (Moderation):', currentBio || '')
        if (bio === null) return
        try {
            await api.patch(`/admin/tenants/${id}/profile`, { bio })
            fetchTenants()
        } catch (err) {
            alert('Moderation failed')
        }
    }

    const grantSpins = async (id: string, name: string) => {
        const amount = prompt(`How many extra spins to grant to ${name}?`, '1')
        if (amount === null) return
        const num = parseInt(amount)
        if (isNaN(num) || num <= 0) {
            alert('Please enter a valid amount')
            return
        }
        try {
            await api.post('/spin/admin/grant-spins', { tenantId: id, amount: num })
            fetchTenants()
            alert(`Granted ${num} extra spin(s) to ${name}`)
        } catch (err) {
            alert('Grant failed')
        }
    }

    const deleteTenant = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}? This action is irreversible (soft-delete).`)) return
        try {
            await api.patch(`/admin/tenants/${id}/soft-delete`)
            fetchTenants()
        } catch (err) {
            alert('Delete failed')
        }
    }

    if (loading) return (
        <div className="animate-pulse space-y-4 shadow-lg p-8">
            <div className="h-8 w-64 bg-zinc-800 rounded"></div>
            <div className="h-96 bg-zinc-900 rounded-2xl"></div>
        </div>
    )

    const stats = {
        total: tenants.length,
        active: tenants.filter(t => !t.isDeactivated).length,
        deactivated: tenants.filter(t => t.isDeactivated).length,
        verified: tenants.filter(t => t.isVerified).length
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-medium text-white mb-1">PR Command Center</h1>
                    <p className="text-zinc-500 font-light text-sm">Manage platform partners and their status</p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-zinc-900/50 border border-white/5 px-6 py-3 rounded-2xl backdrop-blur-sm">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Total</p>
                        <p className="text-2xl font-display font-medium text-white">{stats.total}</p>
                    </div>
                    <div className="bg-emerald-900/20 border border-emerald-500/10 px-6 py-3 rounded-2xl backdrop-blur-sm">
                        <p className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-widest mb-1">Active</p>
                        <p className="text-2xl font-display font-medium text-emerald-400">{stats.active}</p>
                    </div>
                    <div className="bg-blue-900/20 border border-blue-500/10 px-6 py-3 rounded-2xl backdrop-blur-sm">
                        <p className="text-[10px] text-blue-400/70 font-bold uppercase tracking-widest mb-1">Verified</p>
                        <p className="text-2xl font-display font-medium text-blue-400">{stats.verified}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {tenants.map((pr) => (
                    <div key={pr.id} className={`bg-zinc-900/40 border border-white/5 p-6 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-gold/30 hover:shadow-glow hover:bg-zinc-900/60 ${pr.isDeactivated ? 'opacity-60 grayscale' : ''}`}>
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center font-display font-medium text-2xl text-white uppercase border border-white/5">
                                    {pr.name.charAt(0)}
                                </div>
                                {pr.isVerified && (
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-500 border-2 border-zinc-900 flex items-center justify-center shadow-lg text-white" title="Verified PR">
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-display font-medium text-xl text-white tracking-wide">{pr.name}</h3>
                                    {pr.isDeactivated && (
                                        <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase rounded-md border border-red-500/20 tracking-wider">
                                            Deactivated
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-zinc-400 font-light italic">@{pr.slug} • {pr.email}</p>
                                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-1">
                                        <Calendar size={10} />
                                        Sub expires: {pr.subscriptionExpiresAt ? new Date(pr.subscriptionExpiresAt).toLocaleDateString() : 'Never'}
                                    </p>
                                    <p className="text-[10px] text-gold uppercase font-bold tracking-widest flex items-center gap-1">
                                        <Zap size={10} />
                                        Available Spins: {pr.availableSpins || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Primary Actions */}
                            <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
                                <button
                                    onClick={() => grantMonth(pr.id, pr.subscriptionExpiresAt)}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20"
                                    title="Grant 1 Month Free"
                                >
                                    <Calendar size={14} />
                                    +1 Month
                                </button>

                                <button
                                    onClick={() => moderateBio(pr.id, pr.profile?.bio)}
                                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all border border-white/10"
                                    title="Moderate Bio"
                                >
                                    <Edit size={18} />
                                </button>

                                <button
                                    onClick={() => grantSpins(pr.id, pr.name)}
                                    className="p-2.5 bg-gold/10 hover:bg-gold/20 text-gold hover:text-gold/90 rounded-xl transition-all border border-gold/20"
                                    title="Grant Extra Spin"
                                >
                                    <RotateCcw size={18} />
                                </button>
                            </div>

                            {/* View/Edit Actions */}
                            <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
                                <a
                                    href={`/profile/${pr.id}`}
                                    target="_blank"
                                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all border border-white/10"
                                    title="View Profile Only"
                                >
                                    <Eye size={18} />
                                </a>

                                <button
                                    onClick={() => openEditModal(pr)}
                                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all border border-white/10"
                                    title="Manage & Edit Profile"
                                >
                                    <Settings size={18} />
                                </button>

                                <a
                                    href={`/pr/${pr.slug}`}
                                    target="_blank"
                                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all border border-white/10"
                                    title="View Public PR Site"
                                >
                                    <ExternalLink size={18} />
                                </a>
                            </div>

                            {/* Destructive Actions */}
                            <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 font-bold">
                                <button
                                    onClick={() => toggleStatus(pr.id, pr.isDeactivated)}
                                    className={`p-2.5 rounded-xl transition-all border ${pr.isDeactivated
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20'
                                        }`}
                                    title={pr.isDeactivated ? 'Activate' : 'Deactivate'}
                                >
                                    {pr.isDeactivated ? <CheckCircle size={18} /> : <Ban size={18} />}
                                </button>

                                <button
                                    onClick={() => deleteTenant(pr.id, pr.name)}
                                    className="p-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all"
                                    title="Delete PR"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit PR Modal */}
            <AnimatePresence>
                {editingTenant && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingTenant(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
                                <div>
                                    <h2 className="text-2xl font-display font-medium text-white mb-1">Edit PR Profile</h2>
                                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Internal Moderation Tools</p>
                                </div>
                                <button onClick={() => setEditingTenant(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto space-y-6">
                                {/* Profile Picture Moderation */}
                                <div className="flex items-center gap-6 p-4 bg-zinc-900/50 rounded-3xl border border-white/5">
                                    <div className="relative group">
                                        {editForm.photoUrl ? (
                                            <img src={editForm.photoUrl.startsWith('/') ? `http://localhost:3001${editForm.photoUrl}` : editForm.photoUrl} className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
                                        ) : (
                                            <div className="w-20 h-20 rounded-2xl bg-zinc-800 flex items-center justify-center border-2 border-dashed border-white/10 text-zinc-600">
                                                <Users size={32} />
                                            </div>
                                        )}
                                        {editForm.photoUrl && (
                                            <button
                                                onClick={() => setEditForm({ ...editForm, photoUrl: '' })}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"
                                                title="Remove Profile Picture"
                                            >
                                                <X size={12} strokeWidth={4} />
                                            </button>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">Profile Identity</h4>
                                        <p className="text-xs text-zinc-500">Admins can force-remove inappropriate profile pictures.</p>
                                        {editForm.photoUrl && (
                                            <button
                                                onClick={() => setEditForm({ ...editForm, photoUrl: '' })}
                                                className="mt-2 text-[10px] font-bold uppercase text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                Force Remove Image
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">Display Name</label>
                                        <input
                                            type="text"
                                            value={editForm.displayName}
                                            onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                                            className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-4 py-3 text-white focus:border-gold/30 focus:ring-1 focus:ring-gold/10 transition-all outline-none"
                                            placeholder="Public Display Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">Username (@slug)</label>
                                        <input
                                            type="text"
                                            value={editForm.slug}
                                            onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                                            className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-4 py-3 text-white focus:border-gold/30 focus:ring-1 focus:ring-gold/10 transition-all outline-none"
                                            placeholder="username-slug"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">Internal Name (Company/PR Name)</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-4 py-3 text-white focus:border-gold/30 focus:ring-1 focus:ring-gold/10 transition-all outline-none"
                                        placeholder="Full Legal/Company Name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">Public Bio</label>
                                    <textarea
                                        value={editForm.bio}
                                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                        className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-4 py-3 text-white focus:border-gold/30 focus:ring-1 focus:ring-gold/10 transition-all outline-none min-h-[100px] resize-none"
                                        placeholder="Write something about this PR..."
                                    />
                                </div>
                            </div>

                            <div className="p-8 border-t border-white/5 flex gap-4 mt-auto bg-zinc-900/50">
                                <button
                                    onClick={() => setEditingTenant(null)}
                                    className="flex-1 px-6 py-4 rounded-2xl font-bold uppercase text-sm tracking-widest text-zinc-400 hover:bg-white/5 transition-all"
                                >
                                    Discard Changes
                                </button>
                                <button
                                    onClick={saveChanges}
                                    className="flex-1 bg-gold hover:bg-gold/90 px-6 py-4 rounded-2xl font-bold uppercase text-sm tracking-widest text-midnight shadow-glow transition-all"
                                >
                                    Update PR Profile
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

// --- VERIFICATION REQUESTS ---
export function AdminVerifications() {
    const [requests, setRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showArchived, setShowArchived] = useState(false)

    useEffect(() => {
        fetchRequests()
    }, [showArchived])

    const fetchRequests = async () => {
        try {
            setLoading(true)
            const res = await api.get(`/admin/verification-requests?archived=${showArchived}`)
            setRequests(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        const notes = prompt('Add internal admin notes (optional):')
        try {
            await api.patch(`/admin/verification-requests/${id}`, { status, adminNotes: notes })
            fetchRequests()
        } catch (err) {
            alert('Action failed')
        }
    }

    const toggleArchived = async (id: string, isArchived: boolean) => {
        const actionText = isArchived ? 'Archive' : 'Restore'
        const confirmText = isArchived
            ? 'Archive this request? It will be hidden from the active queue.'
            : 'Restore this request to the active queue?'

        if (!confirm(confirmText)) return

        try {
            await api.patch(`/admin/verification-requests/${id}/archive`, { archive: isArchived })
            fetchRequests()
        } catch (err) {
            alert(`${actionText} failed`)
        }
    }

    if (loading && requests.length === 0) return <div className="p-20 text-center animate-pulse text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Queue...</div>

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-display font-medium text-white mb-1">Verification Queue</h1>
                    <p className="text-zinc-500 font-light text-sm">Vetting new partners for the NightLink ecosystem</p>
                </div>

                <button
                    onClick={() => setShowArchived(!showArchived)}
                    className={`px-6 py-3 rounded-2xl flex items-center gap-3 transition-all font-bold uppercase tracking-widest text-[10px] border ${showArchived
                        ? 'bg-zinc-800 text-white border-zinc-700 shadow-lg'
                        : 'bg-white/5 text-zinc-400 border-white/5 hover:border-white/10 hover:bg-white/10'
                        }`}
                >
                    <Archive size={14} />
                    {showArchived ? 'Viewing Archived' : 'Show Archived'}
                </button>
            </div>

            <div className="grid gap-6">
                {requests.length === 0 && (
                    <div className="text-center py-32 bg-zinc-900/40 border border-white/5 rounded-[48px] border-dashed">
                        <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-zinc-600">
                            <Shield size={32} />
                        </div>
                        <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs">Queue Clear</p>
                        <p className="text-zinc-600 text-[10px] mt-2 italic font-medium">No {showArchived ? 'archived' : 'pending'} requests detected in system.</p>
                    </div>
                )}

                {requests.map((req) => (
                    <div key={req.id} className="bg-zinc-900/40 border border-white/5 p-8 rounded-[40px] shadow-2xl space-y-6 hover:border-gold/10 transition-all">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-3xl bg-zinc-800 flex items-center justify-center text-zinc-500 border border-white/5">
                                    <Shield size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-display font-medium text-white mb-1">{req.fullName}</h3>
                                    <p className="text-zinc-400 font-light text-sm">@{req.tenant.slug} • {req.phoneNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${req.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                    req.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        'bg-red-500/10 text-red-500 border-red-500/20'
                                    }`}>
                                    {req.status}
                                </div>
                                {req.status !== 'PENDING' && (
                                    <button
                                        onClick={() => toggleArchived(req.id, !req.isArchived)}
                                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-500 hover:text-white transition-all border border-white/5"
                                        title={req.isArchived ? 'Restore' : 'Archive'}
                                    >
                                        {req.isArchived ? <Check size={16} /> : <Archive size={16} />}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 text-sm pt-4 border-t border-white/5">
                            <div className="space-y-2">
                                <p className="text-zinc-500 uppercase tracking-widest font-bold text-[10px]">Context</p>
                                <p className="text-zinc-300"><span className="text-zinc-500">Instagram:</span> {req.instagramHandle || 'N/A'}</p>
                                <p className="text-zinc-300"><span className="text-zinc-500">Clubs:</span> {req.clubsWorked || 'N/A'}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-zinc-500 uppercase tracking-widest font-bold text-[10px]">Note from PR</p>
                                <p className="italic text-zinc-400 font-light">"{req.notes || 'No notes provided'}"</p>
                            </div>
                        </div>

                        {req.status === 'PENDING' && (
                            <div className="flex gap-4 pt-6">
                                <button
                                    onClick={() => handleAction(req.id, 'APPROVED')}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-4 rounded-3xl font-bold uppercase text-sm tracking-widest text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
                                >
                                    Approve Request <Check size={18} />
                                </button>
                                <button
                                    onClick={() => handleAction(req.id, 'REJECTED')}
                                    className="flex-1 bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 py-4 rounded-3xl font-bold uppercase text-sm tracking-widest text-zinc-400 transition-all flex items-center justify-center gap-2"
                                >
                                    Reject <X size={18} />
                                </button>
                            </div>
                        )}

                        {req.adminNotes && (
                            <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold uppercase text-zinc-500 mb-1">Admin Notes</p>
                                <p className="text-xs text-zinc-400 italic">{req.adminNotes}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

// --- GLOBAL EVENTS ---
export function AdminEvents() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [venueFilter, setVenueFilter] = useState('')
    const [dateFilter, setDateFilter] = useState('')

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const res = await api.get('/admin/events')
            setEvents(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const togglePublish = async (id: string, current: boolean) => {
        try {
            await api.patch(`/admin/events/${id}/visibility`, { isPublished: !current })
            setEvents(events.map(e => e.id === id ? { ...e, isPublished: !current } : e))
        } catch (err) {
            alert('Action failed')
        }
    }

    const softDeleteEvent = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to SOFT-DISABLE "${name}"? This will hide it from the public but keep data for records.`)) return
        try {
            await api.patch(`/admin/events/${id}/soft-delete`)
            alert('Event disabled and moved to archives.')
            fetchEvents()
        } catch (err) {
            alert('Disable failed')
        }
    }

    const filteredEvents = events.filter(ev => {
        const matchesSearch = ev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ev.tenant.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesVenue = venueFilter === '' || ev.venueName === venueFilter;
        const matchesDate = dateFilter === '' || ev.eventDate.startsWith(dateFilter);
        const notDeleted = !ev.deletedAt;
        return matchesSearch && matchesVenue && matchesDate && notDeleted;
    });

    const uniqueVenues = Array.from(new Set(events.filter(e => !e.deletedAt).map(e => e.venueName)));

    if (loading) return (
        <div className="flex items-center justify-center p-20 text-zinc-500 animate-pulse text-xs font-bold uppercase tracking-widest">
            Establishing oversight connection...
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <h1 className="text-4xl font-display font-medium text-white">Event Control</h1>

                <div className="flex gap-4 items-center bg-zinc-900/50 p-2 rounded-2xl border border-white/5 w-full md:w-auto">
                    <div className="flex-1 md:w-64 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search Event or PR..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent rounded-xl pl-10 pr-4 py-2 text-xs outline-none text-white placeholder-zinc-600"
                        />
                    </div>
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-900/30 border border-white/5 p-6 rounded-[32px]">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-2 flex items-center gap-2">
                        <Calendar size={12} /> Target Date
                    </label>
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none text-white focus:border-gold/30 focus:ring-1 focus:ring-gold/10 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-2 flex items-center gap-2">
                        <Building2 size={12} /> Venue Filter
                    </label>
                    <select
                        value={venueFilter}
                        onChange={(e) => setVenueFilter(e.target.value)}
                        className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none text-white appearance-none cursor-pointer focus:border-gold/30 focus:ring-1 focus:ring-gold/10 transition-all"
                    >
                        <option value="">All Venues</option>
                        {uniqueVenues.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={() => { setSearchTerm(''); setVenueFilter(''); setDateFilter(''); }}
                        className="w-full py-3 h-[42px] mb-[1px] bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
                    >
                        Reset All Filters
                    </button>
                </div>
            </div>

            <div className="grid gap-6">
                {filteredEvents.length === 0 && (
                    <div className="text-center p-20 bg-zinc-900/40 rounded-[40px] text-zinc-500 italic border border-dashed border-white/5">
                        No active events match your oversight criteria.
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {filteredEvents.map((ev) => (
                        <div key={ev.id} className="bg-zinc-900/40 border border-white/5 rounded-[32px] overflow-hidden group hover:border-gold/30 hover:shadow-glow transition-all p-5 flex gap-5">
                            <div className="w-24 h-24 rounded-2xl bg-zinc-800 overflow-hidden flex-shrink-0 relative border border-white/5">
                                {ev.coverImageUrl ? (
                                    <img
                                        src={ev.coverImageUrl.startsWith('/') ? `http://localhost:3001${ev.coverImageUrl}` : ev.coverImageUrl}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                        <Calendar size={32} />
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[8px] font-bold uppercase text-white border border-white/10">
                                    {new Date(ev.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-display font-medium text-lg leading-tight truncate text-white">{ev.name}</h3>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">By {ev.tenant.name}</p>
                                    </div>
                                    <div className={`px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-wide border ${ev.isPublished ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                        {ev.isPublished ? 'Live' : 'Hidden'}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-[10px] text-zinc-400 mb-4 font-medium">
                                    <span className="flex items-center gap-1"><Building2 size={10} className="text-zinc-600" /> {ev.venueName}</span>
                                    <span className="flex items-center gap-1 text-white"><Users size={10} className="text-gold" /> {ev._count?.reservations || 0} RSVPs</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => togglePublish(ev.id, ev.isPublished)}
                                        className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${ev.isPublished ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'}`}
                                    >
                                        {ev.isPublished ? 'Unpublish' : 'Publish Live'}
                                    </button>
                                    <button
                                        onClick={() => softDeleteEvent(ev.id, ev.name)}
                                        className="p-2 bg-white/5 border border-white/10 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                        title="Soft Disable (Problematic Event)"
                                    >
                                        <XCircle size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// --- AUDIT LOGS ---
export function AdminLogs() {
    const [logs, setLogs] = useState<any[]>([])

    useEffect(() => {
        api.get('/admin/logs').then(res => setLogs(res.data))
    }, [])

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-display font-medium text-white mb-6">Governance Logs</h1>

            <div className="bg-zinc-900/40 rounded-[40px] border border-white/5 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 uppercase text-[10px] font-bold tracking-widest text-zinc-500">
                        <tr>
                            <th className="px-8 py-5">Action</th>
                            <th className="px-8 py-5">Target</th>
                            <th className="px-8 py-5">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-8 py-5 font-bold text-gold">{log.action}</td>
                                <td className="px-8 py-5 text-zinc-400">{log.targetType} ({log.targetId.slice(0, 8)}...)</td>
                                <td className="px-8 py-5 text-xs text-zinc-500 font-mono">{new Date(log.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
// --- ANALYTICS DASHBOARD ---
export function AdminAnalytics() {
    const [stats, setStats] = useState<any>(null)
    const [sales, setSales] = useState<any[]>([])
    const [tenants, setTenants] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        tenantId: ''
    })

    useEffect(() => {
        fetchData()
        // Fetch tenants for the filter
        api.get('/admin/tenants').then(res => setTenants(res.data))
    }, [])

    useEffect(() => {
        fetchData()
    }, [filters])

    const fetchData = async () => {
        try {
            setLoading(true)
            const queryParams = new URLSearchParams(filters).toString()
            const [statsRes, salesRes] = await Promise.all([
                api.get(`/admin/analytics?${queryParams}`),
                api.get(`/admin/sales?${queryParams}`)
            ])
            setStats(statsRes.data)
            setSales(salesRes.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (!stats && loading) return <div className="p-20 text-center animate-pulse text-zinc-500 font-bold uppercase tracking-widest text-xs">Summoning Platform Intel...</div>

    const cards = [
        { title: 'Platform Revenue', value: `$${stats?.totalRevenue?.toLocaleString() || 0}`, icon: <DollarSign size={20} />, color: 'text-gold', bg: 'bg-gold/10' },
        { title: 'Ticket Volume', value: stats?.totalTickets || 0, icon: <Ticket size={20} />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { title: 'Live Events', value: stats?.activeEvents || 0, icon: <Zap size={20} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { title: 'PR Network', value: stats?.totalPrs || 0, icon: <Users size={20} />, color: 'text-zinc-400', bg: 'bg-zinc-500/10' },
    ]

    const maxRevenue = Math.max(...(stats?.dailyStats?.map((d: any) => d.revenue) || [1]))

    return (
        <div className="space-y-12 pb-20">
            {/* Header & Filters */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-display font-medium text-white mb-1">Platform Intel</h1>
                    <p className="text-zinc-500 font-light text-sm">Financial & operational oversight across all PR nodes</p>
                </div>

                <div className="flex flex-wrap gap-3 bg-zinc-900/50 p-3 rounded-3xl border border-white/5 backdrop-blur-sm">
                    <div className="flex flex-col gap-1">
                        <label className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 ml-2">Start Date</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            className="bg-zinc-800/50 border border-white/5 rounded-xl px-4 py-2 text-[10px] font-bold outline-none focus:border-gold/30 text-white"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 ml-2">End Date</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            className="bg-zinc-800/50 border border-white/5 rounded-xl px-4 py-2 text-[10px] font-bold outline-none focus:border-gold/30 text-white"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 ml-2">PR Node Filter</label>
                        <select
                            value={filters.tenantId}
                            onChange={(e) => setFilters({ ...filters, tenantId: e.target.value })}
                            className="bg-zinc-800/50 border border-white/5 rounded-xl px-4 py-2 text-[10px] font-bold outline-none appearance-none min-w-[140px] text-white"
                        >
                            <option value="">Global View</option>
                            {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900/40 border border-white/5 p-8 rounded-[40px] shadow-2xl group hover:border-gold/10 transition-all hover:shadow-glow"
                    >
                        <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            {card.icon}
                        </div>
                        <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">{card.title}</h3>
                        <p className="text-3xl font-display font-medium text-white">{card.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Real Performance Pulse Chart */}
                <div className="lg:col-span-2 bg-zinc-900/40 border border-white/5 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="text-xl font-display font-medium text-white flex items-center gap-3">
                                <BarChart3 className="text-gold" size={20} />
                                Revenue Pulse
                            </h3>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Daily platform sales volume</p>
                        </div>
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gold">
                            Real-time Matrix
                        </div>
                    </div>

                    <div className="flex items-end gap-2 h-64 mb-10 px-4">
                        {stats?.dailyStats?.length > 0 ? (
                            stats.dailyStats.map((d: any, i: number) => {
                                const heightPercentage = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group h-full justify-end">
                                        <div className="relative w-full h-full flex items-end">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${Math.max(heightPercentage, 2)}%` }}
                                                transition={{ duration: 1, delay: i * 0.05 }}
                                                className="w-full bg-gradient-to-t from-gold/10 to-gold/60 rounded-t-lg group-hover:to-gold transition-all duration-300 relative"
                                            >
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 rounded-lg text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-all shadow-xl whitespace-nowrap z-10">
                                                    ${d.revenue.toFixed(0)} ({d.count} tix)
                                                </div>
                                            </motion.div>
                                        </div>
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-white transition-colors">
                                            {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600 italic text-sm">
                                No sales data detected for this temporal range.
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center pt-8 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gold" /> Revenue Stream</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gold/30" /> Inactive Payouts</span>
                        </div>
                        <div>Aggregated via Global Stripe/Cash Mesh</div>
                    </div>
                </div>

                {/* Performance Leaderboard */}
                <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-[48px] shadow-2xl">
                    <h3 className="text-xl font-display font-medium text-white mb-8 flex items-center gap-3">
                        <TrendingUp className="text-emerald-400" size={20} />
                        Node Rankings
                    </h3>

                    <div className="space-y-6">
                        {stats?.topPrs?.map((pr: any, i: number) => (
                            <div key={pr.id} className="flex items-center justify-between group p-3 hover:bg-white/5 rounded-2xl transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-amber-400 text-black shadow-glow' : 'bg-white/5 text-zinc-500'}`}>
                                        {i === 0 ? '👑' : `#${i + 1}`}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm tracking-tight text-white">{pr.name}</div>
                                        <div className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest">Active Partner</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-display font-medium text-white">{pr.volume}</div>
                                    <div className="text-[8px] font-bold uppercase text-emerald-400 tracking-widest">Reservations</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-8 bg-gradient-to-br from-gold/10 to-transparent border border-white/5 rounded-[32px] relative overflow-hidden">
                        <BarChart3 className="absolute -bottom-4 -right-4 text-gold/5" size={80} />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-3">Expansion Insight</h4>
                        <p className="text-[10px] leading-relaxed text-zinc-400 font-medium">
                            Your top performers are driving <span className="text-white">82%</span> of total platform volume this period. Consider verifying more nodes in active venues.
                        </p>
                    </div>
                </div>
            </div>

            {/* Platform Sales Ledger */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-2xl font-display font-medium text-white flex items-center gap-3">
                        <Clock className="text-blue-400" size={24} />
                        Platform Sales Ledger
                    </h3>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Live Transaction Stream</div>
                </div>

                <div className="bg-zinc-900/40 border border-white/5 rounded-[48px] shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                                <tr>
                                    <th className="px-10 py-6">Transaction / Code</th>
                                    <th className="px-10 py-6">PR Partner</th>
                                    <th className="px-10 py-6">Event / Ticket</th>
                                    <th className="px-10 py-6">Quantity</th>
                                    <th className="px-10 py-6 text-right">Volume</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {sales.length > 0 ? (
                                    sales.map((sale) => (
                                        <tr key={sale.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-glow" />
                                                    <div>
                                                        <span className="font-bold text-sm block tracking-tight uppercase text-white">{sale.reservationCode}</span>
                                                        <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{new Date(sale.createdAt).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 font-bold text-sm text-gold uppercase tracking-tight">{sale.tenant.name}</td>
                                            <td className="px-10 py-6">
                                                <div className="font-bold text-sm truncate max-w-[200px] text-white">{sale.event.name}</div>
                                                <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{sale.ticketType.name}</div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-bold text-zinc-400">{sale.quantity}x</span>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <span className="text-lg font-display font-medium text-emerald-400 tracking-wide">${sale.totalAmount.toFixed(2)}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-20 text-center text-zinc-600 italic">No transactions found in this jurisdiction.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- SPIN MANAGEMENT ---
export function AdminSpin() {
    const [config, setConfig] = useState<any>(null)
    const [editedProbabilities, setEditedProbabilities] = useState<any>(null)
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const fetchSpinData = async () => {
        try {
            const [configRes, logsRes] = await Promise.all([
                api.get('/spin/admin/config'),
                api.get('/spin/admin/logs')
            ])
            setConfig(configRes.data)
            setEditedProbabilities(configRes.data.probabilities)
            setLogs(logsRes.data)
        } catch (err) {
            console.error('Failed to fetch spin data', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSpinData()
    }, [])

    const handleUpdateConfig = async (updates: any) => {
        try {
            setSaving(true)
            await api.patch('/spin/admin/config', updates)
            await fetchSpinData()
            // Success feedback without spammy alerts
        } catch (err) {
            alert('Failed to update config')
        } finally {
            setSaving(false)
        }
    }

    const saveProbabilities = async () => {
        const total = Object.values(editedProbabilities).reduce((a: any, b: any) => a + b, 0) as number
        if (Math.abs(total - 1.0) > 0.0001) {
            alert(`Total probability must equal 100% (currently ${(total * 100).toFixed(1)}%)`)
            return
        }

        try {
            setSaving(true)
            await api.patch('/spin/admin/config', { probabilities: editedProbabilities })
            await fetchSpinData()
            alert('Spin probabilities synchronized successfully!')
        } catch (err) {
            alert('Sync failed')
        } finally {
            setSaving(false)
        }
    }

    const getRewardLabel = (type: string) => {
        switch (type) {
            case 'SUB_3_DAYS': return '+3 Days Subscription'
            case 'SUB_5_DAYS': return '+5 Days Subscription'
            case 'BRANDING_7_DAYS': return '7 Days Custom Branding'
            case 'NONE': return 'Better luck next week!'
            default: return type
        }
    }

    if (loading) return <div className="p-20 text-center animate-pulse text-gold font-bold uppercase tracking-widest text-xs">Accessing Midnight Rewards System...</div>

    const currentSum = editedProbabilities ? Object.values(editedProbabilities).reduce((a: any, b: any) => a + b, 0) as number : 0

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div>
                <h1 className="text-4xl font-display font-medium text-white mb-1">Rewards Engine</h1>
                <p className="text-zinc-500 font-light text-sm text-[10px] mt-1">Platform-wide "Weekly Spin" mechanics & oversight</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Configuration */}
                <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-[48px] shadow-2xl space-y-8">
                    <h2 className="text-2xl font-display font-medium text-white mb-8">Engine Configuration</h2>

                    <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-2xl border border-white/5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">System Active</span>
                        <button
                            onClick={() => handleUpdateConfig({ isEnabled: !config.isEnabled })}
                            className={`w-12 h-6 rounded-full transition-all relative ${config.isEnabled ? 'bg-gold shadow-glow' : 'bg-zinc-700'}`}
                        >
                            <motion.span
                                animate={{ x: config.isEnabled ? 24 : 0 }}
                                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end px-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Probability Distribution</label>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${Math.abs(currentSum - 1.0) < 0.0001 ? 'text-emerald-500' : 'text-red-500 animate-pulse'}`}>
                                Total: {(currentSum * 100).toFixed(1)}%
                            </span>
                        </div>
                        <div className="space-y-4">
                            {editedProbabilities && Object.entries(editedProbabilities).map(([type, prob]: any) => (
                                <div key={type} className="flex gap-4 p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Reward Type</p>
                                        <p className="font-bold text-sm text-zinc-300">{getRewardLabel(type)}</p>
                                    </div>
                                    <div className="w-24">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Prob</p>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full bg-zinc-800/50 border-b border-white/10 outline-none font-bold text-sm text-white px-2 py-1 focus:border-gold/50 transition-colors"
                                            value={prob}
                                            onChange={(e) => {
                                                setEditedProbabilities({ ...editedProbabilities, [type]: parseFloat(e.target.value) || 0 })
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={saveProbabilities}
                            disabled={saving}
                            className={`w-full py-4 mt-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all shadow-xl active:scale-95 ${Math.abs(currentSum - 1.0) < 0.0001
                                ? 'bg-gold hover:bg-gold/90 text-midnight shadow-glow'
                                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
                                }`}
                        >
                            {saving ? 'Synchronizing Engine...' : 'Confirm & Sync Probabilities'}
                        </button>
                    </div>
                </div>

                {/* Audit Logs */}
                <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-[48px] shadow-2xl flex flex-col h-full">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-display font-medium text-white">Live Reward Log</h2>
                        <button onClick={fetchSpinData} className="p-2 hover:bg-white/5 rounded-xl transition-all text-gold">
                            <TrendingUp size={16} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[600px]">
                        {logs.map((log) => (
                            <div key={log.id} className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5 flex justify-between items-center transition-all hover:bg-zinc-900">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-500 border border-white/5 uppercase text-xs">
                                        {log.tenant?.name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-zinc-300">{log.tenant?.name || 'Unknown PR'}</p>
                                        <p className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">{new Date(log.createdAt).toLocaleDateString()} @ {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-xs font-bold uppercase tracking-widest ${log.rewardType === 'NONE' ? 'text-zinc-600' : 'text-emerald-400'}`}>
                                        {getRewardLabel(log.rewardType)}
                                    </p>
                                    <p className="text-[10px] font-bold text-zinc-600 italic opacity-50">ID: {log.id.slice(0, 8)}</p>
                                </div>
                            </div>
                        ))}
                        {logs.length === 0 && (
                            <div className="text-center py-20 grayscale opacity-40">
                                <Zap size={48} className="mx-auto mb-4 text-zinc-600" />
                                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">No orbital rewards detected</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
