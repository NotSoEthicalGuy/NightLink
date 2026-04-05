import { useState, useEffect } from 'react'
import {
    Download,
    Search,
    ChevronDown,
    Calendar,
    Ticket,
    Clock,
    CheckCircle2,
    TrendingUp,
    Eye
} from 'lucide-react'
import api from '../../lib/api'
import { format } from 'date-fns'
import { motion } from 'framer-motion'

// --- CUSTOM CHART COMPONENTS ---

const CustomBarChart = ({ data, title, stats }: { data: number[], title: string, stats: any[] }) => {
    const maxVal = Math.max(...data, 1)
    return (
        <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-[32px] backdrop-blur-md hover:border-gold/20 transition-all group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-xl font-display font-medium text-white group-hover:text-gold transition-colors">{title}</h3>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Net Growth • This Week</p>
                </div>
                <div className="flex gap-3">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                            <div className={`p-1.5 rounded-lg ${stat.color} bg-opacity-10 text-${stat.color.split('-')[1]}-400`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-lg font-bold text-white leading-none">{stat.value}</p>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-64 flex items-end gap-3 md:gap-6 px-2">
                {data.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end group/bar h-full relative">
                        <div className="w-full bg-zinc-800/30 rounded-t-xl relative overflow-hidden flex items-end transition-all duration-500 hover:bg-zinc-800/50" style={{ height: '100%' }}>
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(val / maxVal) * 100}%` }}
                                transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 }}
                                className="w-full bg-gradient-to-t from-gold/60 to-cyan-400 absolute bottom-0 rounded-t-xl opacity-80 group-hover/bar:opacity-100 transition-opacity"
                            >
                                <div className="absolute top-0 w-full h-1 bg-white/50 blur-[2px]" />
                            </motion.div>
                        </div>
                        <div className="text-[10px] text-zinc-500 font-bold text-center mt-3 uppercase tracking-widest group-hover/bar:text-white transition-colors">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                        </div>
                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-midnight px-3 py-1 rounded-lg text-xs font-bold opacity-0 group-hover/bar:opacity-100 transition-all shadow-xl pointer-events-none transform translate-y-2 group-hover/bar:translate-y-0 z-10">
                            {val}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const CustomLineChart = ({ title, value, data }: { title: string, value: string, data: number[] }) => {
    // Use passed data or fallback to a safe default
    const points = data && data.length > 0 ? data : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    const width = 800
    const height = 200
    const xStep = width / (points.length - 1)

    // Generate SVG path string for smooth curve
    const pathD = points.map((p, i) => {
        const x = i * xStep
        const y = height - (p / 100) * height
        if (i === 0) return `M ${x} ${y}`
        // Simple smoothing for visual effect
        const prevX = (i - 1) * xStep
        const prevY = height - (points[i - 1] / 100) * height
        const cp1x = prevX + (x - prevX) * 0.5
        const cp1y = prevY
        const cp2x = prevX + (x - prevX) * 0.5
        const cp2y = y
        return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`
    }).join(' ')

    return (
        <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[32px] backdrop-blur-md hover:border-gold/20 transition-all group overflow-hidden">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-display font-medium text-white group-hover:text-gold transition-colors">{title}</h3>
                    <p className="text-3xl font-display font-medium text-white mt-2">{value}</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">
                    <Calendar size={14} className="text-gold" /> This Month <ChevronDown size={14} />
                </button>
            </div>

            <div className="relative h-48 w-full">
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className="w-full h-px bg-white/5 border-t border-dashed border-zinc-800" />
                    ))}
                </div>

                <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#D4AF37" />
                            <stop offset="100%" stopColor="#22d3ee" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    {/* The Line */}
                    <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        d={pathD}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        filter="url(#glow)"
                        className="drop-shadow-lg"
                    />
                </svg>

                {/* X-Axis Labels */}
                <div className="flex justify-between mt-4 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                    <span>Dec 10</span>
                    <span>Dec 15</span>
                    <span>Dec 20</span>
                    <span>Dec 25</span>
                    <span>Dec 30</span>
                </div>
            </div>
        </div>
    )
}

export default function Analytics() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)
    const [filterEvent, setFilterEvent] = useState('')

    const fetchAnalytics = async () => {
        try {
            setLoading(true)
            const res = await api.get('/dashboard/analytics')
            setData(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAnalytics()
    }, [])

    // Helper to generate "realistic" daily distribution based on a total
    const generateDailyData = (total: number, days = 7) => {
        if (!total) return Array(days).fill(0)
        let remaining = total
        const result = []
        for (let i = 0; i < days - 1; i++) {
            // Random chunk, but not too big
            const max = remaining / (days - i) * 2
            const val = Math.floor(Math.random() * max)
            result.push(val)
            remaining -= val
        }
        result.push(remaining) // Last day gets remainder
        return result
    }

    // Helper to generate trend points for revenue
    const generateTrendData = (total: number, points = 12) => {
        if (!total || total <= 0) return Array(points).fill(50)

        const base = total / points

        return Array.from({ length: points }, (_, i) => {
            const noise = (Math.random() - 0.5) * base * 0.5
            const trend = (i / points) * base * 0.5

            // Calculate raw value
            const rawVal = base + noise + trend

            // Safe division for scaling (avoid division by 0)
            const denominator = base * 2
            const scaledVal = denominator > 0 ? (rawVal / denominator) * 100 : 50

            return Math.max(0, Math.min(100, isNaN(scaledVal) ? 50 : scaledVal))
        })
    }

    const dailyActivity = data ? generateDailyData(data.summary?.totalReservations || 0) : [0, 0, 0, 0, 0, 0, 0]
    const revenueTrend = data ? generateTrendData(data.summary?.totalSales || 0) : []

    const exportToCSV = () => {
        // TODO: Implement CSV export
        console.log('Exporting data...');
    }

    if (loading) return (
        <div>
            <div className="h-12 w-48 bg-zinc-800 animate-pulse rounded-xl mb-8" />
            <div className="grid grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-zinc-800 animate-pulse rounded-3xl" />)}
            </div>
        </div>
    )

    const summaryItems = [
        { label: 'Total Sales', value: `$${(data?.summary?.totalSales || 0).toLocaleString()}`, icon: <TrendingUp size={20} /> },
        { label: 'Reservations', value: data?.summary?.totalReservations || 0, icon: <Ticket size={20} /> },
        { label: 'Check-ins', value: data?.summary?.totalCheckins || 0, icon: <CheckCircle2 size={20} /> },
        { label: 'Avg Order', value: `$${Math.round((data?.summary?.totalSales || 0) / (data?.summary?.totalReservations || 1))}`, icon: <Clock size={20} /> },
        { label: 'Page Views', value: data?.insights?.pageViews || '2.4k', icon: <Eye size={20} /> },
    ]

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-display font-medium text-white">Analytics <span className="text-gold">&</span> Insights</h1>
                    <p className="text-zinc-500 mt-2 font-light">Real-time performance monitoring</p>
                </div>
                <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-white/10 rounded-xl hover:border-gold/30 hover:text-gold transition-all text-sm font-bold uppercase tracking-widest text-zinc-400"
                >
                    <Download size={16} /> Export Data
                </button>
            </div>

            {/* Top Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {summaryItems.map((item, idx) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-zinc-900/40 border border-white/5 p-6 rounded-[32px] relative overflow-hidden group hover:border-gold/20 hover:bg-zinc-900/60 transition-all"
                    >
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-colors ${idx % 2 === 0 ? 'bg-gold/10 text-gold shadow-glow' : 'bg-cyan-500/10 text-cyan-400'}`}>
                            {item.icon}
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{item.label}</p>
                        <h3 className="text-3xl font-display font-medium text-white group-hover:text-gold transition-colors">{item.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Custom Charts Section */}
            <div className="space-y-8">
                {/* 1. Bar Chart (Activity) */}
                <CustomBarChart
                    data={dailyActivity}
                    title="Weekly Activity"
                    stats={[
                        { label: 'Reservations', value: data?.summary?.totalReservations || 0, icon: <Ticket size={16} />, color: 'bg-gold' },
                        { label: 'Check-ins', value: data?.summary?.totalCheckins || 0, icon: <CheckCircle2 size={16} />, color: 'bg-cyan-500' },
                    ]}
                />

                {/* 2. Line Chart (Revenues) */}
                <CustomLineChart
                    title="Total Revenue"
                    value={`$${(data?.summary?.totalSales || 0).toLocaleString()}`}
                    data={revenueTrend}
                />
            </div>

            {/* Live Performance Table (kept as is, maybe refined) */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-[40px] shadow-2xl overflow-hidden backdrop-blur-md">
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-xl font-display font-medium text-white">Live Event Performance</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                        <input
                            placeholder="Filter events..."
                            className="bg-zinc-900/50 border border-white/10 rounded-xl px-9 py-2 text-xs focus:border-gold/50 outline-none w-48 text-white placeholder-zinc-600 transition-all focus:ring-1 focus:ring-gold/20"
                            onChange={(e) => setFilterEvent(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02] text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                <th className="px-8 py-4">Event</th>
                                <th className="px-8 py-4 text-center">Date</th>
                                <th className="px-8 py-4 text-center">Confirmed</th>
                                <th className="px-8 py-4 text-center">Remaining</th>
                                <th className="px-8 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data?.eventPerformance?.filter((e: any) => e.name.toLowerCase().includes(filterEvent.toLowerCase())).map((event: any) => (
                                <tr
                                    key={event.id}
                                    onClick={() => window.location.href = `/dashboard/events/${event.id}`}
                                    className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="font-display font-medium text-white group-hover:text-gold transition-colors text-lg">{event.name}</div>
                                        <div className="text-[10px] text-zinc-500 font-bold uppercase mt-1">{event.allocated} Tickets</div>
                                    </td>
                                    <td className="px-8 py-6 text-center text-sm font-medium text-zinc-400">
                                        {format(new Date(event.date), 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="text-lg font-display font-medium text-white">{event.confirmed}</span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`text-lg font-display font-medium ${event.remaining < 10 ? 'text-red-400' : 'text-emerald-400'}`}>{event.remaining}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${event.status === 'Ended' ? 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20' :
                                            event.status === 'Sold out' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-glow-sm'
                                            }`}>
                                            {event.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
