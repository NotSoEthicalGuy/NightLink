import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import api from '../../lib/api'
import WeeklySpin from './WeeklySpin'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardHome() {
    const { user } = useAuthStore()
    const [isPublished, setIsPublished] = useState(false)
    const [dashboardData, setDashboardData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [spinStatus, setSpinStatus] = useState<any>(null)
    const [showSpinModal, setShowSpinModal] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [configRes, statsRes, spinRes] = await Promise.all([
                    api.get('/site-config'),
                    api.get('/dashboard/stats'),
                    api.get('/spin/status')
                ])

                if (configRes.data) {
                    setIsPublished(configRes.data.isPublished)
                }
                if (statsRes.data) {
                    setDashboardData(statsRes.data)
                }
                if (spinRes.data) {
                    setSpinStatus(spinRes.data)
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const togglePublish = async () => {
        const newState = !isPublished
        setIsPublished(newState)
        try {
            await api.patch('/site-config/publish', { isPublished: newState })
        } catch (error) {
            console.error('Failed to update publish status', error)
            setIsPublished(!newState)
        }
    }

    const stats = [
        {
            label: 'Total Events',
            value: dashboardData?.stats?.totalEvents || '0',
            icon: '🎉',
            trend: 'Total events created'
        },
        {
            label: 'Active Reservations',
            value: dashboardData?.stats?.activeReservations || '0',
            icon: '🎫',
            trend: 'Confirmed & Pending'
        },
        {
            label: 'Confirmed Sales',
            value: `$${(dashboardData?.stats?.totalSales || 0).toLocaleString()}`,
            icon: '💰',
            trend: 'Total income from sales'
        },
        {
            label: 'Website Visits',
            value: dashboardData?.stats?.websiteVisits || '0',
            icon: '👥',
            trend: 'Coming soon'
        },
    ]

    return (
        <div>
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-medium mb-2 text-white">
                        Welcome back, <span className="text-gold italic">{user?.name}</span>
                    </h1>
                    <p className="text-zinc-500 font-light">
                        Here's what's happening with your empire today
                    </p>
                </div>

                {/* Publish Switch */}
                <div className="flex items-center gap-3 bg-zinc-900/50 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
                    <span className={`text-sm font-medium transition-colors ${isPublished ? 'text-emerald-400' : 'text-zinc-500'}`}>
                        {loading ? 'Loading...' : (isPublished ? 'Website Live' : 'Website Private')}
                    </span>
                    <button
                        onClick={togglePublish}
                        disabled={loading}
                        className={`w-12 h-6 rounded-full transition-all relative ${isPublished ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-zinc-800 border border-zinc-700'}`}
                    >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all shadow-sm ${isPublished ? 'left-7 bg-emerald-400' : 'left-0.5 bg-zinc-500'}`} />
                    </button>
                </div>
            </div>

            {/* Spin Alert */}
            <AnimatePresence>
                {spinStatus?.isAvailable && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mb-8 p-1 bg-gradient-to-r from-gold/40 via-white/5 to-white/5 rounded-[32px] shadow-glow"
                    >
                        <div className="bg-midnight/95 rounded-[30px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-gold/10 transition-all duration-700" />

                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-16 h-16 bg-gold/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl border border-gold/20 text-gold">
                                    🎰
                                </div>
                                <div>
                                    <h2 className="text-xl font-display font-bold text-white">Nebula Rewards Available</h2>
                                    <p className="text-zinc-400 text-sm">Your weekly bonus is ready to be claimed.</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center md:items-end gap-3 relative z-10">
                                {spinStatus?.availableSpins > 0 && (
                                    <span className="px-3 py-1 bg-gold/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-gold border border-gold/20">
                                        {spinStatus.availableSpins} Bonus Spin{spinStatus.availableSpins > 1 ? 's' : ''} Ready
                                    </span>
                                )}
                                <button
                                    onClick={() => setShowSpinModal(true)}
                                    className="px-8 py-3 bg-gold text-midnight rounded-xl font-bold uppercase tracking-wide text-sm hover:scale-105 transition-all shadow-glow active:scale-95"
                                >
                                    Spin Now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
                <Link to="/dashboard/events/new" className="group relative overflow-hidden bg-zinc-900/30 border border-white/5 p-6 rounded-3xl hover:border-gold/30 transition-all duration-300">
                    <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-display font-medium mb-1 text-white group-hover:text-gold transition-colors">Create Event</h3>
                            <p className="text-sm text-zinc-500">Launch a new experience</p>
                        </div>
                        <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">🎉</span>
                    </div>
                </Link>

                <Link
                    to={isPublished ? `/pr/${user?.slug}` : '#'}
                    target={isPublished ? "_blank" : undefined}
                    className={`group relative overflow-hidden bg-zinc-900/30 border border-white/5 p-6 rounded-3xl hover:border-gold/30 transition-all duration-300 ${!isPublished && 'opacity-50 cursor-not-allowed'}`}
                >
                    <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-display font-medium mb-1 text-white group-hover:text-gold transition-colors">View Website</h3>
                            <p className="text-sm text-zinc-500">
                                {isPublished ? 'Visit public portal' : 'Publish to view'}
                            </p>
                        </div>
                        <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">🌐</span>
                    </div>
                </Link>

                <Link to="/dashboard/editor" className="group relative overflow-hidden bg-zinc-900/30 border border-white/5 p-6 rounded-3xl hover:border-gold/30 transition-all duration-300">
                    <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-display font-medium mb-1 text-white group-hover:text-gold transition-colors">Visual Editor</h3>
                            <p className="text-sm text-zinc-500">Customize your aesthetic</p>
                        </div>
                        <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">🎨</span>
                    </div>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-zinc-900/20 border border-white/5 p-6 rounded-3xl backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl grayscale hover:grayscale-0 transition-all cursor-default">{stat.icon}</span>
                        </div>
                        <p className="text-3xl font-display font-medium mb-1 text-white tracking-tight">{stat.value}</p>
                        <p className="text-sm text-zinc-500 mb-2">{stat.label}</p>
                        <p className="text-[10px] text-zinc-600 font-bold tracking-widest uppercase">{stat.trend}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[32px]">
                    <h2 className="text-xl font-display font-medium mb-6 flex items-center gap-3 text-white">
                        <span className="w-1.5 h-1.5 bg-gold rounded-full shadow-glow" />
                        Upcoming Events
                    </h2>
                    <div className="space-y-3">
                        {dashboardData?.upcomingEvents?.length > 0 ? (
                            dashboardData.upcomingEvents.map((event: any) => (
                                <div key={event.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-colors group">
                                    <div>
                                        <h3 className="font-medium text-white group-hover:text-gold transition-colors">{event.name}</h3>
                                        <p className="text-xs text-zinc-500 font-medium mt-1">
                                            {new Date(event.eventDate).toLocaleDateString()} • {event.eventTime}
                                        </p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${event.isPublished
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                                        }`}>
                                        {event.isPublished ? 'Live' : 'Draft'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-zinc-600 font-light text-sm">
                                No upcoming events found
                            </div>
                        )}
                        <Link to="/dashboard/events" className="block text-center text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-gold transition-colors pt-4">
                            View All Events →
                        </Link>
                    </div>
                </div>

                <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[32px]">
                    <h2 className="text-xl font-display font-medium mb-6 flex items-center gap-3 text-white">
                        <span className="w-1.5 h-1.5 bg-platinum rounded-full" />
                        Recent Activity
                    </h2>
                    <div className="space-y-3">
                        {dashboardData?.recentReservations?.length > 0 ? (
                            dashboardData.recentReservations.map((res: any) => (
                                <div key={res.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-colors">
                                    <div>
                                        <h3 className="font-medium text-white">{res.customerName}</h3>
                                        <p className="text-xs text-zinc-500 font-medium mt-1">{res.quantity}x {res.ticketType.name} • ${res.totalAmount}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${res.status === 'PAID_CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        res.status === 'PENDING_PAYMENT' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                            'bg-red-500/10 text-red-500 border-red-500/20'
                                        }`}>
                                        {res.status.split('_').pop()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-zinc-600 font-light text-sm">
                                No recent activity
                            </div>
                        )}
                        <Link to="/dashboard/reservations" className="block text-center text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-gold transition-colors pt-4">
                            Manage All Bookings →
                        </Link>
                    </div>
                </div>
            </div>

            {showSpinModal && (
                <WeeklySpin
                    onClose={() => setShowSpinModal(false)}
                    onSuccess={() => {
                        api.get('/spin/status').then(res => setSpinStatus(res.data))
                    }}
                />
            )}
        </div>
    )
}
