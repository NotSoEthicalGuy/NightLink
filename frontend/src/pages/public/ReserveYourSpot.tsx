import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    Ticket,
    User,
    Mail,
    Phone,
    ArrowRight,
    Calendar,
    MapPin,
    Plus,
    Minus
} from 'lucide-react';
import api from '../../lib/api';

export default function ReserveYourSpot() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        ticketTypeId: '',
        quantity: 1
    });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/public/event/${eventId}`);
                setEvent(res.data);
                if (res.data.ticketTypes?.length > 0) {
                    setFormData(prev => ({ ...prev, ticketTypeId: res.data.ticketTypes[0].id }));
                }
            } catch (err) {
                console.error('Failed to load event for reservation', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const res = await api.post('/reservations', formData);
            navigate(`/reserve/status/${res.data.reservationCode}`);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Reservation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const updateQuantity = (newQty: number) => {
        if (newQty < 1) return;
        if (newQty > 10) return;
        setFormData({ ...formData, quantity: newQty });
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const selectedTicket = event?.ticketTypes.find((t: any) => t.id === formData.ticketTypeId);
    const config = event?.tenant?.siteConfig || {};

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

    const fontClass = getFontFamily();

    return (
        <div className={`min-h-screen bg-[#050505] text-white ${fontClass}`}>
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-20 blur-[120px]" style={{ backgroundColor: accentColor }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-12 group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase tracking-widest text-xs">Back to Event</span>
                </button>

                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Left: Summary */}
                    <div className="space-y-8">
                        <div>
                            <span className="font-black uppercase tracking-[0.2em] text-[10px] mb-4 block" style={{ color: accentColor }}>Reservation</span>
                            <h1 className="text-5xl font-black tracking-tighter uppercase italic italic-shadow leading-none mb-6">Reserve Your Spot.</h1>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Experience the night at {event?.venueName}. Fill in your details below to lock in your tickets.
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Calendar style={{ color: accentColor }} size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Date & Time</p>
                                    <p className="font-bold">{new Date(event?.eventDate).toLocaleDateString()} at {event?.eventTime}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <MapPin className="text-blue-500" size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Venue</p>
                                    <p className="font-bold">{event?.venueName}</p>
                                    <p className="text-sm text-gray-400">{event?.venueAddress}</p>
                                </div>
                            </div>
                        </div>

                        {selectedTicket && (
                            <div className="rounded-3xl p-8 border" style={{ backgroundColor: `${accentColor}15`, borderColor: `${accentColor}30` }}>
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: accentColor }}>Selected Entry</p>
                                        <h3 className="text-2xl font-black uppercase italic">{selectedTicket.name}</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-white">${(selectedTicket.price * formData.quantity).toFixed(2)}</p>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Total Amount</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[40px] p-10 shadow-2xl"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                    <input
                                        required
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-semibold focus:border-white/20"
                                        style={{ borderBottomColor: formData.customerName ? accentColor : undefined }}
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                        <input
                                            required
                                            type="email"
                                            placeholder="john@example.com"
                                            value={formData.customerEmail}
                                            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-semibold focus:border-white/20"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                        <input
                                            required
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            value={formData.customerPhone}
                                            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-semibold focus:border-white/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Ticket Type</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {event?.ticketTypes.map((type: any) => {
                                        const isLow = (type.totalQuantity - type.reservedQuantity - type.soldQuantity) <= 10;
                                        const isSelected = formData.ticketTypeId === type.id;
                                        return (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, ticketTypeId: type.id })}
                                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${isSelected ? 'bg-white/5' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                                                style={{ borderColor: isSelected ? accentColor : undefined }}
                                            >
                                                <div className="flex items-center space-x-3 text-left">
                                                    <Ticket size={20} style={{ color: isSelected ? accentColor : '#4b5563' }} />
                                                    <div>
                                                        <p className="font-bold text-sm">{type.name}</p>
                                                        {isLow && <p className="text-[10px] text-red-500 font-bold uppercase">Limited Availability</p>}
                                                    </div>
                                                </div>
                                                <span className="font-black text-lg">${type.price}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">How many tickets?</label>
                                <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-2 h-16">
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(formData.quantity - 1)}
                                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white active:scale-95"
                                    >
                                        <Minus size={20} />
                                    </button>

                                    <input
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) => updateQuantity(parseInt(e.target.value) || 1)}
                                        className="bg-transparent text-center font-black text-2xl outline-none w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(formData.quantity + 1)}
                                        className="w-12 h-12 flex items-center justify-center rounded-xl transition-colors text-white active:scale-95"
                                        style={{ backgroundColor: accentColor }}
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="flex justify-between px-2">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Min: 1</span>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Max: 10</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded-2xl py-5 font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center space-x-3 shadow-xl"
                                style={{
                                    backgroundColor: accentColor,
                                    boxShadow: `0 10px 40px ${accentColor}40`
                                }}
                            >
                                {submitting ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Confirm Reservation</span>
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
