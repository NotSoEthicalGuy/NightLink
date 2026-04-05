import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Clock,
    XCircle,
    MessageCircle,
    Info,
    CheckCircle2
} from 'lucide-react';
import api from '../../lib/api';

export default function ReservationStatus() {
    const { code } = useParams();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [cancelling, setCancelling] = useState(false);
    const expiresAtRef = useRef<Date | null>(null);

    const fetchStatus = async () => {
        try {
            const res = await api.get(`/reservations/code/${code}`);
            setReservation(res.data);

            // Store expiry time in ref for timer calculations
            if (res.data.expiresAt) {
                expiresAtRef.current = new Date(res.data.expiresAt);
            }

            // Calculate time left from server time
            const expiry = new Date(res.data.expiresAt).getTime();
            const now = new Date().getTime();
            const diff = Math.max(0, Math.floor((expiry - now) / 1000));
            setTimeLeft(diff);
        } catch (err) {
            console.error('Failed to load reservation status', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        
        // Timer that recalculates from server expiry time every second to prevent drift
        const interval = setInterval(() => {
            if (expiresAtRef.current) {
                const expiry = expiresAtRef.current.getTime();
                const now = new Date().getTime();
                const diff = Math.max(0, Math.floor((expiry - now) / 1000));
                setTimeLeft(diff);
            } else {
                setTimeLeft((prev) => prev > 0 ? prev - 1 : 0);
            }
        }, 1000);

        // Polling for status updates from PR (recalculates timer from server)
        const statusPoll = setInterval(() => {
            fetchStatus();
        }, 5000);

        return () => {
            clearInterval(interval);
            clearInterval(statusPoll);
        };
    }, [code]);

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
        try {
            setCancelling(true);
            await api.post(`/reservations/${reservation.id}/cancel`);
            fetchStatus();
        } catch (err) {
            alert('Failed to cancel');
        } finally {
            setCancelling(false);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!reservation) return <div>Not Found</div>;

    const isExpired = timeLeft <= 0 && reservation.status === 'PENDING_PAYMENT';
    const isPending = reservation.status === 'PENDING_PAYMENT';
    const isPaid = reservation.status === 'PAID_CONFIRMED';
    const isRejected = reservation.status === 'REJECTED';
    const isCancelled = reservation.status === 'CANCELLED';

    const config = reservation.tenant?.siteConfig || {};

    const getFontFamily = () => {
        switch (config.templateId) {
            case 'vibrant': return 'font-display italic';
            case 'dark-luxury': return 'font-serif';
            case 'premium': return 'font-display';
            default: return 'font-sans';
        }
    };

    const accentColor = config.colorPalette === 'purple' ? '#8b5cf6' :
        config.colorPalette === 'blue' ? '#3b82f6' :
            config.colorPalette === 'pink' ? '#ec4899' :
                config.colorPalette === 'gold' ? '#f59e0b' :
                    config.colorPalette === 'emerald' ? '#10b981' : '#8b5cf6';

    return (
        <div className={`min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden ${getFontFamily()}`}>
            {/* Ambient Background */}
            <div className={`absolute inset-0 transition-colors duration-1000 ${isPaid ? 'bg-green-500/5' : isPending ? 'bg-yellow-500/5' : 'bg-red-500/5'}`} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[48px] p-10 relative z-10 shadow-2xl"
            >
                {/* Status Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 relative">
                        <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 ${isPaid ? 'bg-green-500' : isPending ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ backgroundColor: isPaid ? '#22c55e' : isPending ? accentColor : '#ef4444' }} />
                        {isPaid && <CheckCircle2 size={64} className="text-green-500 relative" />}
                        {isPending && !isExpired && (
                            <div className="relative flex items-center justify-center">
                                <Clock size={64} style={{ color: accentColor }} />
                                <svg className="absolute w-32 h-32 -rotate-90">
                                    <circle
                                        cx="64" cy="64" r="60"
                                        className="stroke-white/5 fill-transparent" strokeWidth="4"
                                    />
                                    <circle
                                        cx="64" cy="64" r="60"
                                        className="fill-transparent" strokeWidth="4"
                                        style={{ stroke: accentColor }}
                                        strokeDasharray={377}
                                        strokeDashoffset={377 * (1 - timeLeft / 3600)}
                                    />
                                </svg>
                            </div>
                        )}
                        {(isExpired || isRejected || isCancelled) && <XCircle size={64} className="text-red-500 relative" />}
                    </div>

                    <h2 className="text-3xl font-black uppercase italic italic-shadow mb-2">
                        {isPaid ? 'Reservation Confirmed!' : isPending ? (isExpired ? 'Reservation Expired' : 'Action Required') : isRejected ? 'Reservation Declined' : 'Reservation Cancelled'}
                    </h2>
                    <p className="text-gray-400 font-semibold tracking-wide">Ref: <span className="text-white font-mono">{reservation.reservationCode}</span></p>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    {/* Timer / Expiry Info */}
                    {isPending && !isExpired && (
                        <div className="bg-white/5 rounded-3xl p-6 text-center border border-white/5">
                            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-500 mb-2">Time to complete payment</p>
                            <p className="text-5xl font-black font-mono tracking-tighter" style={{ color: accentColor }}>{formatTime(timeLeft)}</p>
                            <div className="flex items-center justify-center space-x-2 mt-4 text-xs font-bold text-gray-400">
                                <Info size={14} />
                                <span>Please send payment to the PR to secure your spot.</span>
                            </div>
                        </div>
                    )}

                    {/* Summary Card */}
                    <div className="bg-white/5 rounded-3xl p-8 border border-white/5">
                        <div className="flex justify-between items-start mb-6 pb-6 border-b border-white/5">
                            <div>
                                <h4 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-1">Event</h4>
                                <p className="text-xl font-black uppercase">{reservation.event.name}</p>
                            </div>
                            <div className="text-right">
                                <h4 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-1">Pass</h4>
                                <p className="text-xl font-black uppercase">{reservation.ticketType.name} x{reservation.quantity}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Final Price</span>
                            <span className="text-3xl font-black">${reservation.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3 pt-4">
                        {isPending && !isExpired && (
                            <a
                                href={`https://wa.me/${reservation.customerPhone}`}
                                className="w-full flex items-center justify-center space-x-3 bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all text-sm"
                            >
                                <MessageCircle size={18} />
                                <span>Contact PR via WhatsApp</span>
                            </a>
                        )}

                        {isPending && !isExpired && (
                            <button
                                onClick={handleCancel}
                                disabled={cancelling}
                                className="w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-gray-500 hover:text-red-400 flex items-center justify-center space-x-2 text-xs transition-colors"
                            >
                                <XCircle size={16} />
                                <span>{cancelling ? 'Cancelling...' : 'Cancel Reservation'}</span>
                            </button>
                        )}

                        {!isPending && (
                            <button
                                onClick={() => navigate(-1)}
                                className="w-full bg-white/5 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-colors text-sm"
                            >
                                Return to Site
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
