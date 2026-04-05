import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import api from '../../lib/api'
import { useAuthStore } from '../../stores/authStore'
import { isTemplateLockedForStandardUser } from '../../lib/templateAccess'

export default function Settings() {
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)
    const [config, setConfig] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState('')

    useEffect(() => {
        fetchConfig()
    }, [])

    const fetchConfig = async () => {
        try {
            const res = await api.get('/site-config')
            setConfig(res.data)
        } catch (err) {
            console.error('Failed to fetch config', err)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async (updates: any) => {
        try {
            setSaving(true)
            setSuccess('')
            const res = await api.patch('/site-config', updates)
            setConfig(res.data)
            setSuccess('Settings saved successfully!')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            alert('Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    const handleTemplatePick = (t: string) => {
        if (isTemplateLockedForStandardUser(user, t)) {
            navigate('/subscription')
            return
        }
        handleUpdate({ templateId: t })
    }

    const togglePublish = async () => {
        try {
            setSaving(true)
            const newStatus = !config.isPublished
            await api.patch('/site-config/publish', { isPublished: newStatus })
            setConfig({ ...config, isPublished: newStatus })
        } catch (err) {
            alert('Failed to update status')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-gray-800 rounded"></div>
        <div className="h-64 bg-gray-900 rounded-xl"></div>
    </div>

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-display font-bold">Site Settings</h1>
                <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${config.isPublished ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        {config.isPublished ? '● Live' : '○ Draft'}
                    </span>
                    <button
                        onClick={togglePublish}
                        disabled={saving}
                        className={`btn-${config.isPublished ? 'secondary' : 'primary'} px-6`}
                    >
                        {config.isPublished ? 'Unpublish Site' : 'Publish Site'}
                    </button>
                </div>
            </div>

            {success && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl animate-in fade-in zoom-in duration-300">
                    {success}
                </div>
            )}

            {config && isTemplateLockedForStandardUser(user, config.templateId) && (
                <div className="bg-amber-500/10 border border-amber-500/25 text-amber-100 px-4 py-3 rounded-xl text-sm flex flex-wrap items-center justify-between gap-3">
                    <span>
                        Active theme is <strong className="text-white">Premium</strong>. Choose a Standard theme or upgrade
                        to keep using it.
                    </span>
                    <button
                        type="button"
                        onClick={() => navigate('/subscription')}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 font-bold text-xs uppercase tracking-wider border border-amber-500/40"
                    >
                        Upgrade
                    </button>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* Visual Identity */}
                <div className="card space-y-6">
                    <h2 className="text-xl font-bold flex items-center">
                        <span className="mr-2">🎨</span> Visual Identity
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-3">Template</label>
                        <div className="grid grid-cols-2 gap-4">
                            {['minimalist', 'vibrant', 'neon', 'premium', 'dark-luxury', 'neon-nights', 'velvet-lounge', 'block-party'].map((t) => {
                                const locked = isTemplateLockedForStandardUser(user, t)
                                return (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => handleTemplatePick(t)}
                                        className={`p-4 rounded-xl border text-sm capitalize transition-all flex items-center justify-between gap-2 ${config.templateId === t ? 'border-purple-500 bg-purple-500/10 text-white' : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/10'} ${locked && config.templateId !== t ? 'opacity-60' : ''}`}
                                    >
                                        <span className="flex items-center gap-1.5">
                                            {t.replace(/-/g, ' ')}
                                            {locked && <Lock size={14} className="text-amber-400 shrink-0" aria-hidden />}
                                        </span>
                                        {locked && <span className="text-[10px] font-bold text-amber-400/90 uppercase">Premium</span>}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-3">Brand Accent Color</label>
                        <div className="flex flex-wrap gap-4">
                            {['purple', 'blue', 'pink', 'gold', 'emerald'].map((c) => (
                                <button
                                    key={c}
                                    onClick={() => handleUpdate({ colorPalette: c })}
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${config.colorPalette === c ? 'border-white scale-110 shadow-lg shadow-' + c + '-500/50' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    style={{ backgroundColor: c === 'gold' ? '#FFD700' : c }}
                                    title={c}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <a
                            href="/dashboard/editor"
                            className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all group"
                        >
                            <span className="text-sm font-bold uppercase tracking-widest">Launch Advanced Editor</span>
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                    </div>
                </div>

                {/* Custom Branding */}
                <div className="card space-y-6">
                    <h2 className="text-xl font-bold flex items-center">
                        <span className="mr-2">🏷️</span> Custom Branding
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Logo URL</label>
                        <input
                            className="input-field"
                            placeholder="https://example.com/logo.png"
                            onBlur={(e) => handleUpdate({ logoUrl: e.target.value })}
                            defaultValue={config.logoUrl}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Hero Image URL</label>
                        <input
                            className="input-field"
                            placeholder="https://example.com/hero.jpg"
                            onBlur={(e) => {
                                const theme = { ...config.themeConfig, heroImageUrl: e.target.value }
                                handleUpdate({ themeConfig: theme })
                            }}
                            defaultValue={config.themeConfig?.heroImageUrl}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Primary (Accent)</label>
                            <input
                                type="color"
                                className="w-full h-10 bg-transparent border-none cursor-pointer"
                                onChange={(e) => handleUpdate({ colorPalette: e.target.value })}
                                value={config.colorPalette?.startsWith('#') ? config.colorPalette : '#8b5cf6'}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Secondary Color</label>
                            <input
                                type="color"
                                className="w-full h-10 bg-transparent border-none cursor-pointer"
                                onChange={(e) => handleUpdate({ secondaryColor: e.target.value })}
                                value={config.secondaryColor?.startsWith('#') ? config.secondaryColor : '#d1d5db'}
                            />
                        </div>
                    </div>
                </div>

                {/* Content Visibility */}
                <div className="card space-y-6">
                    <h2 className="text-xl font-bold flex items-center">
                        <span className="mr-2">👁️</span> Public Sections
                    </h2>
                    <p className="text-sm text-gray-400">Control which sections are visible on your public website.</p>

                    <div className="space-y-4">
                        {['about', 'events', 'gallery', 'contact'].map((section) => (
                            <div key={section} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                <span className="capitalize text-gray-200">{section}</span>
                                <button
                                    onClick={() => {
                                        const newVis = { ...config.sectionsVisibility }
                                        if (!newVis[section]) {
                                            newVis[section] = { visible: false, order: 4 }
                                        }
                                        newVis[section].visible = !newVis[section].visible
                                        handleUpdate({ sectionsVisibility: newVis })
                                    }}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${config.sectionsVisibility?.[section]?.visible ? 'bg-purple-500' : 'bg-gray-700'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${config.sectionsVisibility?.[section]?.visible ? 'translate-x-6' : ''}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Advanced / Analytics */}
                <div className="card md:col-span-2 space-y-6 bg-gradient-to-br from-gray-900 to-purple-900/20">
                    <h2 className="text-xl font-bold flex items-center">
                        <span className="mr-2">📈</span> Tracking & SEO
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Google Analytics ID</label>
                            <input
                                className="input-field"
                                placeholder="G-XXXXXXXXXX"
                                onBlur={(e) => handleUpdate({ googleAnalyticsId: e.target.value })}
                                defaultValue={config.googleAnalyticsId}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Facebook Pixel ID</label>
                            <input
                                className="input-field"
                                placeholder="123456789012345"
                                onBlur={(e) => handleUpdate({ facebookPixelId: e.target.value })}
                                defaultValue={config.facebookPixelId}
                            />
                        </div>
                    </div>
                </div>

                {/* Trust & Verification */}
                <div className="card md:col-span-2 space-y-6 border border-yellow-500/20 bg-yellow-500/5">
                    <h2 className="text-xl font-bold flex items-center">
                        <span className="mr-2">🛡️</span> Trust & Verification
                    </h2>
                    <VerificationSection />
                </div>

                {/* Ticket Templates */}
                <TicketTemplatesSection />
            </div>

            <div className="flex justify-end pt-4">
                <a
                    href={`/pr/${config.tenant?.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary px-8 flex items-center"
                >
                    View Your Public Site
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>
        </div>
    )
}

function VerificationSection() {
    const [status, setStatus] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        instagramHandle: '',
        clubsWorked: '',
        notes: ''
    })

    useEffect(() => {
        fetchStatus()
    }, [])

    const fetchStatus = async () => {
        try {
            const res = await api.get('/verification/my-status')
            setStatus(res.data)
        } catch (err) {
            console.error('Failed to fetch verification status', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setSubmitting(true)
            await api.post('/verification/request', formData)
            await fetchStatus()
            alert('Verification request submitted successfully!')
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to submit request')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="animate-pulse h-20 bg-white/5 rounded-xl"></div>

    if (status && status.status === 'PENDING') {
        return (
            <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center space-y-3">
                <div className="text-3xl">⏳</div>
                <h3 className="text-xl font-bold text-blue-400">Request Pending</h3>
                <p className="text-sm text-gray-400">An admin is currently reviewing your profile. We'll notify you once a decision is made.</p>
            </div>
        )
    }

    if (status && status.status === 'APPROVED') {
        return (
            <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-center space-y-3">
                <div className="text-3xl">✅</div>
                <h3 className="text-xl font-bold text-green-400">Account Verified</h3>
                <p className="text-sm text-gray-400">Your profile now features the prestigious "Verified PR" trust badge.</p>
            </div>
        )
    }

    const isRejected = status?.status === 'REJECTED'
    const cooldownDays = 30
    const canReapply = !isRejected || (new Date().getTime() - new Date(status.updatedAt).getTime() > cooldownDays * 24 * 60 * 60 * 1000)

    return (
        <div className="space-y-6">
            {isRejected && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <strong>Request Rejected:</strong> {status.adminNotes || 'Your previous request did not meet our criteria.'}
                    {!canReapply && <p className="mt-1 text-xs opacity-70 italic text-white/50">You can reapply 30 days after rejection.</p>}
                </div>
            )}

            {!canReapply ? (
                <div className="text-center p-8 bg-black/20 rounded-2xl">
                    <p className="text-gray-500">Verification cooldown active. Please check back later.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Full Legal Name</label>
                            <input
                                required
                                className="input-field"
                                value={formData.fullName}
                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Phone Number</label>
                            <input
                                required
                                type="tel"
                                className="input-field"
                                placeholder="+1 234 567 890"
                                value={formData.phoneNumber}
                                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Instagram @Handle</label>
                            <input
                                className="input-field"
                                placeholder="@your_profile"
                                value={formData.instagramHandle}
                                onChange={e => setFormData({ ...formData, instagramHandle: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Clubs Worked With</label>
                            <input
                                className="input-field"
                                placeholder="Clubs list..."
                                value={formData.clubsWorked}
                                onChange={e => setFormData({ ...formData, clubsWorked: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Extra Notes (Optional)</label>
                            <textarea
                                className="input-field h-24"
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full btn-primary py-4 font-bold uppercase italic tracking-tighter"
                        >
                            {submitting ? 'Submitting...' : 'Request Official Verification'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}

function TicketTemplatesSection() {
    const [templates, setTemplates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        api.get('/profile').then(res => {
            setTemplates(res.data.defaultTicketTemplates || [])
            setLoading(false)
        })
    }, [])

    const handleAdd = () => {
        setTemplates([...templates, { name: '', price: 0, totalQuantity: 100 }])
    }

    const handleRemove = (index: number) => {
        setTemplates(templates.filter((_, i) => i !== index))
    }

    const handleChange = (index: number, field: string, value: any) => {
        const newTemplates = [...templates]
        newTemplates[index] = { ...newTemplates[index], [field]: value }
        setTemplates(newTemplates)
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            await api.patch('/profile/ticket-templates', { templates })
            alert('Templates saved!')
        } catch (err) {
            alert('Failed to save templates')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return null

    return (
        <div className="card md:col-span-2 space-y-6 bg-purple-900/10 border-purple-500/20">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold flex items-center text-purple-200">
                        <span className="mr-2">🎟️</span> Default Ticket Templates
                    </h2>
                    <p className="text-sm text-purple-400/60 font-bold uppercase tracking-widest mt-1">Automatically applied to new events</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white rounded-xl border border-purple-500/20 transition-all font-black uppercase text-[10px] tracking-widest"
                >
                    + Add Template
                </button>
            </div>

            <div className="space-y-4">
                {templates.map((template, index) => (
                    <div key={index} className="flex gap-4 items-center bg-black/40 p-6 rounded-3xl border border-white/5">
                        <div className="flex-1 grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Name</label>
                                <input
                                    className="bg-purple-900/20 border border-white/10 rounded-xl px-4 py-2 w-full focus:border-purple-500/50 outline-none text-sm"
                                    value={template.name}
                                    onChange={e => handleChange(index, 'name', e.target.value)}
                                    placeholder="e.g. Early Bird"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Price ($)</label>
                                <input
                                    type="number"
                                    className="bg-purple-900/20 border border-white/10 rounded-xl px-4 py-2 w-full focus:border-purple-500/50 outline-none text-sm"
                                    value={template.price}
                                    onChange={e => handleChange(index, 'price', parseFloat(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Quantity</label>
                                <input
                                    type="number"
                                    className="bg-purple-900/20 border border-white/10 rounded-xl px-4 py-2 w-full focus:border-purple-500/50 outline-none text-sm"
                                    value={template.totalQuantity}
                                    onChange={e => handleChange(index, 'totalQuantity', parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => handleRemove(index)}
                            className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl border border-red-500/20 transition-all mt-4"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                        </button>
                    </div>
                ))}

                {templates.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-3xl">
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No default templates configured</p>
                    </div>
                )}
            </div>

            <div className="flex justify-end border-t border-white/5 pt-6">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-black uppercase italic tracking-widest text-sm shadow-xl shadow-purple-600/30 transition-all active:scale-95"
                >
                    {saving ? 'Saving...' : 'Save Configuration'}
                </button>
            </div>
        </div>
    )
}
