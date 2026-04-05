import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowLeft, ArrowRight, Ticket } from 'lucide-react';
import api from '../../lib/api';

import VerifiedBadge from '../../components/templates/VerifiedBadge';

export default function EventDetails() {
    const { eventId, username } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/public/event/${eventId}`);
                setEvent(res.data);
            } catch (err) {
                console.error('Failed to load event details', err);
            } finally {
                setLoading(false);
            }
        };
        if (eventId) fetchEvent();
    }, [eventId]);

    useEffect(() => {
        if (event) {
            document.title = `${event.name} | NightLink Event`;
            const root = document.documentElement;
            const primary = event.tenant?.siteConfig?.colorPalette;
            const secondary = event.tenant?.siteConfig?.secondaryColor;
            if (primary?.startsWith('#')) root.style.setProperty('--primary-color', primary);
            if (secondary?.startsWith('#')) root.style.setProperty('--secondary-color', secondary);
        }
    }, [event]);

    const handleReserve = () => {
        if (!eventId || !username) return;
        navigate(`/pr/${username}/reserve/${eventId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white px-6 text-center">
                <h1 className="text-3xl font-black mb-3">Event Not Found</h1>
                <p className="text-gray-400 mb-6 max-w-md">This event may have been removed or is no longer available.</p>
                {username && (
                    <button
                        onClick={() => navigate(`/pr/${username}`)}
                        className="px-6 py-3 rounded-full bg-white text-black font-black uppercase tracking-[0.2em] text-xs"
                    >
                        Back to Website
                    </button>
                )}
            </div>
        );
    }

    const accentColor = event.tenant?.siteConfig?.colorPalette || '#8b5cf6';
    const logoUrl = event.tenant?.siteConfig?.logoUrl;

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                <div className="flex justify-between items-center mb-10">
                    <button
                        onClick={() => (username ? navigate(`/pr/${username}`) : navigate(-1))}
                        className="flex items-center text-gray-400 hover:text-white text-xs font-bold uppercase tracking-[0.2em]"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Events
                    </button>

                    <div className="flex items-center gap-3">
                        {logoUrl ? (
                            <img src={logoUrl} alt="" className="h-8 w-auto" />
                        ) : (
                            <span className="font-black uppercase tracking-widest text-sm">{event.tenant.name}</span>
                        )}
                        {event.tenant.isVerified && <VerifiedBadge />}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                >
                    {/* Cover */}
                    <div className="relative h-56 sm:h-72 md:h-80 bg-gradient-to-br from-purple-600/40 to-blue-600/40 overflow-hidden">
                        {event.coverImageUrl && (
                            <img
                                src={event.coverImageUrl.startsWith('/') ? `http://localhost:3001${event.coverImageUrl}` : event.coverImageUrl}
                                alt=""
                                className="w-full h-full object-cover opacity-70"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                        <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                            <div>
                                <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-purple-300 mb-2">
                                    Upcoming Event
                                </span>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight" style={{ color: accentColor.startsWith('#') ? '#fff' : accentColor }}>
                                    {event.name}
                                </h1>
                            </div>
                            <div className="bg-black/70 rounded-2xl px-4 py-3 text-right text-xs sm:text-sm">
                                <p className="font-bold">
                                    {new Date(event.eventDate).toLocaleDateString()}
                                </p>
                                <p className="text-gray-300 font-semibold">
                                    {event.eventTime}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-8 space-y-8">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <Calendar size={18} className="text-purple-400" style={{ color: accentColor.startsWith('#') ? accentColor : undefined }} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-black mb-1">
                                        Date & Time
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {new Date(event.eventDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-gray-300">
                                        {event.eventTime}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <MapPin size={18} className="text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-black mb-1">
                                        Venue
                                    </p>
                                    <p className="text-sm font-semibold">{event.venueName}</p>
                                    <p className="text-xs text-gray-300">{event.venueAddress}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <Ticket size={18} className="text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-black mb-1">
                                        Tickets
                                    </p>
                                    <p className="text-xs text-gray-300">
                                        {event.ticketTypes?.length
                                            ? `${event.ticketTypes.length} ticket option${event.ticketTypes.length > 1 ? 's' : ''} available`
                                            : 'Ticket information will be shared by your PR.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-sm font-black uppercase tracking-[0.25em] text-gray-500">
                                About this night
                            </h2>
                            <p className="text-sm sm:text-base text-gray-200 leading-relaxed whitespace-pre-line">
                                {event.description}
                            </p>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                            <p className="text-[11px] text-gray-400 max-w-md">
                                Secure your spot now. Your PR will confirm the reservation and share payment details.
                            </p>
                            <button
                                onClick={handleReserve}
                                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 rounded-full font-black uppercase tracking-[0.25em] text-xs bg-white text-black hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_40px_rgba(139,92,246,0.6)]"
                                style={{ color: '#000', backgroundColor: accentColor.startsWith('#') ? accentColor : '#fff' }}
                            >
                                Reserve Your Spot
                                <ArrowRight size={16} className="ml-2" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}


