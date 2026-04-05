import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Download,
    Calendar,
    User,
    Mail,
    Phone,
    XCircle,
    Ticket,
    Ban
} from 'lucide-react';
import api from '../../lib/api';

export default function CanceledReservations() {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const res = await api.get('/reservations/manage');
                setReservations(res.data);
            } catch (err) {
                console.error('Failed to fetch reservations', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReservations();
    }, []);

    // Filter to only show canceled/declined reservations
    const canceledReservations = reservations.filter(r => 
        r.status === 'CANCELLED' || r.status === 'REJECTED' || r.status === 'EXPIRED'
    );

    const filteredReservations = canceledReservations.filter(r =>
        r.customerName.toLowerCase().includes(search.toLowerCase()) ||
        r.reservationCode.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'REJECTED': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'CANCELLED': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'EXPIRED': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'REJECTED': return 'Declined by PR';
            case 'CANCELLED': return 'Canceled by Customer';
            case 'EXPIRED': return 'Expired';
            default: return status.replace('_', ' ');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold mb-1">Canceled Reservations</h1>
                    <p className="text-gray-500 font-medium">View all declined, canceled, and expired reservations.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search name or code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-full pl-11 pr-6 py-2.5 text-sm focus:border-purple-500 outline-none w-full md:w-64 transition-all font-semibold"
                        />
                    </div>
                    <button className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors text-gray-400">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Customer</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Event & pass</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredReservations.map((res) => (
                                <tr key={res.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-black text-xs text-red-400 group-hover:bg-red-500/20 transition-colors">
                                                {res.customerName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm tracking-tight">{res.customerName}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-1.5 py-0.5 rounded leading-none">{res.reservationCode}</span>
                                                    <span className="text-[10px] text-gray-600 font-bold uppercase">{res.customerPhone}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-sm line-clamp-1">{res.event.name}</p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{res.ticketType.name} x{res.quantity}</p>
                                    </td>
                                    <td className="px-8 py-6 font-black text-lg">${res.totalAmount.toFixed(2)}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyles(res.status)}`}>
                                            {getStatusLabel(res.status)}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold">{new Date(res.createdAt).toLocaleDateString()}</p>
                                        <p className="text-[10px] text-gray-600 font-bold uppercase">{new Date(res.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredReservations.length === 0 && (
                    <div className="text-center py-20">
                        <Ban size={48} className="mx-auto text-gray-800 mb-4 opacity-20" />
                        <h4 className="text-lg font-bold text-gray-600">No canceled reservations</h4>
                        <p className="text-gray-700">Canceled, declined, and expired reservations will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

