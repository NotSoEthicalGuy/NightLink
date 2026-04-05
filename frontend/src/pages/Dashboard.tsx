import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    Calendar,
    Ticket,
    BarChart3,
    Settings as SettingsIcon,
    Menu,
    ChevronLeft,
    Home,
    Bell,
    XCircle,
    Users,
    ShieldCheck,
    Globe,
    History as LucideHistory,
    Shield,
    ChevronDown,
    TrendingUp,
    Gift,
    Sparkles
} from 'lucide-react'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import DashboardHome from '../components/dashboard/DashboardHome'
import Events from '../components/dashboard/Events'
import Reservations from '../components/dashboard/Reservations'
import Analytics from '../components/dashboard/Analytics'
import TicketControl from '../components/dashboard/TicketControl'
import NotificationsTab from '../components/dashboard/NotificationsTab'
import Settings from '../components/dashboard/Settings'
import CanceledReservations from '../components/dashboard/CanceledReservations'
import { AdminTenants, AdminVerifications, AdminEvents, AdminLogs, AdminAnalytics, AdminSpin } from '../components/admin/AdminViews'
import WeeklySpin from '../components/dashboard/WeeklySpin'
import { Logo } from '../components/ui/Logo'

export default function Dashboard() {
    const { user } = useAuthStore()
    const location = useLocation()
    const isAdmin = user?.role?.toUpperCase() === 'ADMIN'
    const planLabel = user?.subscriptionPlan === 'PREMIUM' ? 'Premium Plan' : 'Standard Plan'
    const [isAdminOpen, setIsAdminOpen] = useState(true)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const [spinAvailable, setSpinAvailable] = useState(false)
    const [showSpin, setShowSpin] = useState(false)

    const fetchUnreadCount = async () => {
        try {
            const response = await api.get('/notifications/unread-count')
            setUnreadCount(response.data.count)
        } catch (err) {
            // console.error('Failed to fetch unread count:', err)
        }
    }

    const fetchSpinStatus = async () => {
        try {
            const response = await api.get('/spin/status')
            setSpinAvailable(response.data.isAvailable)
        } catch (err) {
            // console.error('Failed to fetch spin status:', err)
        }
    }

    useEffect(() => {
        fetchUnreadCount()
        fetchSpinStatus()
        const interval = setInterval(() => {
            fetchUnreadCount()
            fetchSpinStatus()
        }, 30000)
        return () => clearInterval(interval)
    }, [])


    const navItems = [
        // Admin Groups (Top for Admins)
        {
            label: 'Admin',
            icon: <Shield size={20} className="text-gold" />,
            adminOnly: true,
            isParent: true,
            subItems: [
                { path: 'admin/analytics', label: 'Platform Intel', icon: <TrendingUp size={16} /> },
                { path: 'admin/tenants', label: 'PR Management', icon: <Users size={16} /> },
                { path: 'admin/verifications', label: 'Verifications', icon: <ShieldCheck size={16} /> },
                { path: 'admin/events', label: 'Global Events', icon: <Globe size={16} /> },
                { path: 'admin/spin', label: 'Nebula Rewards', icon: <Sparkles size={16} /> },
                { path: 'admin/logs', label: 'Audit Logs', icon: <LucideHistory size={16} /> },
            ]
        },
        { path: '', label: 'Overview', icon: <LayoutDashboard size={20} /> },
        { path: 'events', label: 'Events', icon: <Calendar size={20} /> },
        { path: 'reservations', label: 'Reservations', icon: <Ticket size={20} /> },
        { path: 'canceled-reservations', label: 'Canceled', icon: <XCircle size={20} /> },
        { path: 'tickets', label: 'Ticket Control', icon: <Ticket size={20} className="rotate-45" /> },
        {
            path: 'notifications',
            label: 'Notifications',
            icon: (
                <div className="relative">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-zinc-900">
                            {unreadCount > 99 ? '9+' : unreadCount}
                        </span>
                    )}
                </div>
            )
        },
        { path: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
        { path: 'settings', label: 'Settings', icon: <SettingsIcon size={20} /> },
    ].filter(item => !item.adminOnly || user?.role?.toUpperCase() === 'ADMIN')

    const isActive = (path: string | undefined) => {
        if (path === undefined) return false
        const fullPath = `/dashboard${path ? '/' + path : ''}`
        return location.pathname === fullPath
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white flex font-sans selection:bg-gold/30">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 280 }}
                className="fixed left-0 top-0 h-full bg-[#0a0a0a]/95 backdrop-blur-2xl border-r border-white/5 z-50 flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="p-6 flex items-center justify-between">
                    <AnimatePresence mode="wait">
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-3"
                            >
                                <div>
                                    <Logo gold size="36" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400 block mt-1">
                                        {planLabel}
                                    </span>
                                    {isAdmin && (
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 block mt-1">Admin</span>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-colors ml-auto border border-transparent hover:border-white/5"
                    >
                        {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                <nav className="px-3 py-2 flex-1 space-y-1 overflow-x-hidden overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <div key={item.label} className="mb-1">
                            {item.isParent ? (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsAdminOpen(!isAdminOpen);
                                        }}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-zinc-400 hover:text-white group border border-transparent hover:border-white/5 overflow-hidden whitespace-nowrap"
                                    >
                                        <div className="flex items-center">
                                            <span className="flex-shrink-0 text-zinc-500 group-hover:text-gold transition-colors">{item.icon}</span>
                                            {!isCollapsed && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="ml-3 text-[11px] font-bold uppercase tracking-widest"
                                                >
                                                    {item.label}
                                                </motion.span>
                                            )}
                                        </div>
                                        {!isCollapsed && (
                                            <ChevronDown
                                                size={14}
                                                className={`transition-transform duration-300 text-zinc-600 ${isAdminOpen ? 'rotate-180' : ''}`}
                                            />
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {isAdminOpen && !isCollapsed && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden space-y-1 mt-1 ml-4 pl-2 border-l border-white/5"
                                            >
                                                {item.subItems?.map((sub) => {
                                                    const active = isActive(sub.path)
                                                    return (
                                                        <Link
                                                            key={sub.path}
                                                            to={`/dashboard/${sub.path}`}
                                                            className={`flex items-center px-4 py-2.5 rounded-lg transition-all group text-[11px] font-bold tracking-wide ${active
                                                                ? 'bg-gold/10 text-gold border border-gold/20'
                                                                : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'
                                                                }`}
                                                        >
                                                            <span className={`mr-3 transition-colors ${active ? 'text-gold' : 'text-zinc-600 group-hover:text-white'}`}>
                                                                {sub.icon}
                                                            </span>
                                                            {sub.label}
                                                        </Link>
                                                    )
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            ) : (
                                <Link
                                    to={`/dashboard/${item.path}`}
                                    className={`flex items-center px-4 py-3.5 rounded-xl transition-all group border overflow-hidden whitespace-nowrap relative ${isActive(item.path)
                                        ? 'bg-gradient-to-r from-gold/10 to-transparent text-gold border-gold/20'
                                        : 'text-zinc-500 hover:text-white bg-transparent border-transparent hover:bg-white/5'
                                        }`}
                                >
                                    <span className={`flex-shrink-0 transition-colors ${isActive(item.path) ? 'text-gold' : 'group-hover:text-white'}`}>{item.icon}</span>
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="ml-3 text-xs font-bold uppercase tracking-widest"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                    {isActive(item.path) && (
                                        <motion.div
                                            layoutId="marker"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gold rounded-r-full shadow-glow"
                                        />
                                    )}
                                </Link>
                            )}
                        </div>
                    ))}

                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-white/5 bg-zinc-900/30 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center overflow-hidden">
                            <div className="w-10 h-10 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-full flex-shrink-0 flex items-center justify-center font-display font-bold text-white shadow-lg border border-white/10">
                                {user?.name.charAt(0)}
                            </div>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="ml-3 flex-1 min-w-0"
                                >
                                    <p className="text-sm font-bold truncate text-white">{user?.name}</p>
                                    <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-gold flex items-center mt-1 transition-colors">
                                        <Home size={10} className="mr-1 shadow-glow-sm" /> Return Home
                                    </Link>
                                </motion.div>
                            )}
                        </div>

                        {!isCollapsed && spinAvailable && (
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                onClick={() => setShowSpin(true)}
                                className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold to-amber-500 text-black flex items-center justify-center shadow-glow relative group"
                                title="Bonus available"
                            >
                                <Gift size={20} className="animate-bounce" />
                                <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">Bonus</span>
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <motion.main
                animate={{ marginLeft: isCollapsed ? 80 : 280 }}
                className="flex-1 min-h-screen relative overflow-hidden bg-[#020202]"
            >
                {/* --- LUXURY AMBIENT BACKGROUND --- */}
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                    {/* Deep Midnight Base Glow (Top Left) */}
                    <div className="absolute top-[-25%] left-[-10%] w-[70%] h-[70%] bg-purple-900/20 blur-[150px] rounded-full mix-blend-screen opacity-40" />

                    {/* Rich Obsidian/Gold Warmth (Bottom Right) */}
                    <div className="absolute bottom-[-20%] right-[-5%] w-[60%] h-[60%] bg-amber-600/10 blur-[180px] rounded-full mix-blend-screen opacity-30" />

                    {/* Central Depth (Subtle) */}
                    <div className="absolute top-[30%] left-[20%] w-[50%] h-[50%] bg-blue-950/5 blur-[200px] rounded-full mix-blend-overlay" />

                    {/* Gold Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] pointer-events-none" />
                </div>

                <div className="h-full relative z-10">
                    <AnimatePresence>
                        {showSpin && (
                            <WeeklySpin
                                onClose={() => setShowSpin(false)}
                                onSuccess={() => {
                                    fetchSpinStatus()
                                }}
                            />
                        )}
                    </AnimatePresence>

                    <Routes>
                        <Route index element={<div className="p-8 lg:p-12"><DashboardHome /></div>} />
                        <Route path="events/*" element={<div className="p-8 lg:p-12"><Events /></div>} />
                        <Route path="reservations" element={<div className="p-8 lg:p-12"><Reservations /></div>} />
                        <Route path="canceled-reservations" element={<div className="p-8 lg:p-12"><XCircle className="p-8" /><CanceledReservations /></div>} />
                        <Route path="tickets" element={<div className="p-8 lg:p-12"><TicketControl /></div>} />
                        <Route path="notifications" element={<div className="p-8 lg:p-12"><NotificationsTab /></div>} />
                        <Route path="analytics" element={<div className="p-8 lg:p-12"><Analytics /></div>} />
                        <Route path="settings" element={<div className="p-8 lg:p-12"><Settings /></div>} />

                        {/* Admin Routes */}
                        <Route path="admin/analytics" element={<div className="p-8 lg:p-12"><AdminAnalytics /></div>} />
                        <Route path="admin/tenants" element={<div className="p-8 lg:p-12"><AdminTenants /></div>} />
                        <Route path="admin/verifications" element={<div className="p-8 lg:p-12"><AdminVerifications /></div>} />
                        <Route path="admin/events" element={<div className="p-8 lg:p-12"><AdminEvents /></div>} />
                        <Route path="admin/spin" element={<div className="p-8 lg:p-12"><AdminSpin /></div>} />
                        <Route path="admin/logs" element={<div className="p-8 lg:p-12"><AdminLogs /></div>} />
                    </Routes>
                </div>
            </motion.main>
        </div>
    )
}
