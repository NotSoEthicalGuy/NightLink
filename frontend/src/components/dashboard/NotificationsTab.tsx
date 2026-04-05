import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Check,
    X,
    Clock,
    Ticket
} from 'lucide-react';
import api from '../../lib/api';

export default function NotificationsTab() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleAction = async (notif: any, status: string) => {
        try {
            const reservationId = notif.data?.reservationId;
            if (!reservationId) return;

            // Update reservation status
            await api.patch(`/reservations/${reservationId}/status`, { status });

            // Mark notification as read
            await api.patch(`/notifications/${notif.id}/read`);

            fetchNotifications();
        } catch (err) {
            alert('Action failed');
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-display font-bold mb-2">Notifications Center</h1>
                    <p className="text-gray-500 font-medium">Manage incoming requests and alerts in real-time.</p>
                </div>
                <button
                    onClick={() => api.patch('/notifications/read-all').then(fetchNotifications)}
                    className="text-xs font-bold uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5"
                >
                    Mark all as read
                </button>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode='popLayout'>
                    {notifications.map((notif) => (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={`group bg-white/[0.02] border ${notif.isRead ? 'border-white/5' : 'border-purple-500/30'} rounded-[32px] p-6 hover:bg-white/[0.04] transition-all relative overflow-hidden`}
                        >
                            {!notif.isRead && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                            )}

                            <div className="flex gap-6 items-start">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${notif.type === 'NEW_RESERVATION' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                                    {notif.type === 'NEW_RESERVATION' ? <Ticket size={28} /> : <Bell size={28} />}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold">{notif.title}</h3>
                                            <p className="text-gray-400 font-medium leading-relaxed">{notif.message}</p>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    {notif.type === 'NEW_RESERVATION' && (
                                        <>
                                            {notif.reservationStatus === 'PENDING_PAYMENT' ? (
                                                <div className="mt-6 flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleAction(notif, 'PAID_CONFIRMED')}
                                                        className="flex-1 bg-green-500 text-black py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Check size={14} />
                                                        Approve (Paid)
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(notif, 'PENDING_PAYMENT')}
                                                        className="flex-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-yellow-500/20 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Clock size={14} />
                                                        Awaiting
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(notif, 'REJECTED')}
                                                        className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <X size={14} />
                                                        Decline
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="mt-6">
                                                    <div className={`px-4 py-3 rounded-xl font-bold text-sm ${
                                                        notif.reservationStatus === 'PAID_CONFIRMED' 
                                                            ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                                                            : notif.reservationStatus === 'REJECTED'
                                                            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                            : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                                                    }`}>
                                                        Status: {notif.reservationStatus === 'PAID_CONFIRMED' ? 'Approved' : notif.reservationStatus === 'REJECTED' ? 'Declined' : notif.reservationStatus?.replace('_', ' ')}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {!notif.isRead && notif.type !== 'NEW_RESERVATION' && (
                                        <button
                                            onClick={() => markAsRead(notif.id)}
                                            className="mt-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                                        >
                                            Dismiss
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {notifications.length === 0 && (
                    <div className="text-center py-24 bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[40px]">
                        <Bell className="mx-auto text-gray-700 mb-4 opacity-20" size={64} />
                        <h3 className="text-xl font-bold text-gray-600">All caught up!</h3>
                        <p className="text-gray-700 font-medium">No new notifications at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
