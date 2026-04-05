import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Ticket,
    AlertCircle,
    CheckCircle2,
    Clock,
    BarChart2,
    Search,
    LucideIcon
} from 'lucide-react';
import api from '../../lib/api';



interface EventWithTickets {
    id: string;
    name: string;
    eventDate: string;
    ticketTypes: Array<{
        id: string;
        name: string;
        totalQuantity: number;
        reservedQuantity: number;
        soldQuantity: number;
    }>;
}

export default function TicketControl() {
    const [events, setEvents] = useState<EventWithTickets[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events');
                setEvents(res.data);
            } catch (err) {
                console.error('Failed to fetch events for ticket control', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold mb-1">Ticket Control</h1>
                    <p className="text-gray-500 font-medium">Monitor real-time sales and inventory across all your events.</p>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3 text-sm focus:border-purple-500 outline-none w-full md:w-80 transition-all font-semibold"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredEvents.map((event) => {
                    const stats = event.ticketTypes.reduce((acc, tt) => ({
                        total: acc.total + tt.totalQuantity,
                        reserved: acc.reserved + tt.reservedQuantity,
                        confirmed: acc.confirmed + tt.soldQuantity,
                        remaining: acc.remaining + (tt.totalQuantity - tt.reservedQuantity - tt.soldQuantity)
                    }), { total: 0, reserved: 0, confirmed: 0, remaining: 0 });

                    const soldOutPercentage = ((stats.total - stats.remaining) / stats.total) * 100;

                    let statusColor = 'text-green-500 bg-green-500/10';
                    let statusText = 'Healthy';
                    let progressColor = 'bg-green-500';

                    if (stats.remaining === 0) {
                        statusColor = 'text-red-500 bg-red-500/10';
                        statusText = 'Sold Out';
                        progressColor = 'bg-red-500';
                    } else if (stats.remaining <= 10 || (stats.remaining / stats.total) <= 0.2) {
                        statusColor = 'text-yellow-500 bg-yellow-500/10';
                        statusText = 'Low Stock';
                        progressColor = 'bg-yellow-500';
                    }

                    return (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all hover:bg-white/[0.04] group"
                        >
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Event Info */}
                                <div className="lg:w-1/3">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusColor}`}>
                                            {statusText}
                                        </span>
                                        <span className="text-xs text-gray-500 font-bold uppercase tracking-tight">
                                            {new Date(event.eventDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold group-hover:text-purple-400 transition-colors mb-4 line-clamp-1">{event.name}</h3>

                                    <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${soldOutPercentage}%` }}
                                            className={`absolute inset-y-0 left-0 ${progressColor} shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
                                        />
                                    </div>
                                    <p className="text-[10px] uppercase font-bold text-gray-500 mt-2 tracking-widest flex justify-between">
                                        <span>Capacity Utilization</span>
                                        <span>{Math.round(soldOutPercentage)}%</span>
                                    </p>
                                </div>

                                {/* Stats Grid */}
                                <div className="lg:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <StatCard
                                        label="Total"
                                        value={stats.total}
                                        icon={Ticket}
                                        color="text-blue-500 bg-blue-500/10"
                                    />
                                    <StatCard
                                        label="Remaining"
                                        value={stats.remaining}
                                        icon={AlertCircle}
                                        color={statusColor}
                                    />
                                    <StatCard
                                        label="Reserved"
                                        value={stats.reserved}
                                        icon={Clock}
                                        color="text-yellow-500 bg-yellow-500/10"
                                    />
                                    <StatCard
                                        label="Confirmed"
                                        value={stats.confirmed}
                                        icon={CheckCircle2}
                                        color="text-green-500 bg-green-500/10"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {filteredEvents.length === 0 && (
                    <div className="text-center py-20 bg-white/[0.02] border-2 border-dashed border-white/5 rounded-3xl">
                        <BarChart2 size={48} className="mx-auto text-gray-700 mb-4" />
                        <h4 className="text-lg font-bold">No events found</h4>
                        <p className="text-gray-500">Create an event to start managing tickets.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

interface StatCardProps {
    label: string;
    value: number;
    icon: LucideIcon;
    color: string;
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
    return (
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:bg-white/10 transition-colors">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                <Icon size={16} />
            </div>
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter mb-1">{label}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    );
}
