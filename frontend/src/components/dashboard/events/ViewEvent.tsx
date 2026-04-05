import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../../lib/api'
import { format } from 'date-fns'

export default function ViewEvent() {
    const { id } = useParams()
    const [event, setEvent] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get(`/events/${id}`)
            .then(res => setEvent(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <div className="p-8 text-center text-gray-400">Loading event details...</div>
    if (!event) return <div className="p-8 text-center text-gray-400">Event not found</div>

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.eventDate);
    const isPast = eventDate < now;

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                <Link to="/dashboard/events" className="text-zinc-500 hover:text-white flex items-center gap-3 font-medium text-sm transition-colors group">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Gallery
                </Link>
                <div className="flex gap-4 w-full md:w-auto">
                    {!isPast && (
                        <Link to={`/dashboard/events/${id}/edit`} className="flex-1 md:flex-none px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-sm hover:bg-white/10 transition-all text-center text-white">
                            Edit Event
                        </Link>
                    )}
                    <button className="flex-1 md:flex-none px-6 py-3 bg-gold text-midnight rounded-xl font-bold text-sm hover:bg-gold/90 transition-all shadow-glow hover:scale-[1.02]">
                        Share Link
                    </button>
                </div>
            </div>

            <div className="bg-zinc-900 border border-white/5 rounded-[40px] overflow-hidden mb-12 shadow-2xl relative group">
                <div className="relative h-[400px]">
                    {event.coverImageUrl ? (
                        <img
                            src={event.coverImageUrl.startsWith('/') ? `http://localhost:3001${event.coverImageUrl}` : event.coverImageUrl}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            alt={event.name}
                        />
                    ) : (
                        <div className="w-full h-full bg-zinc-800" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />

                    <div className="absolute bottom-10 left-10 right-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="flex gap-3 mb-4">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${event.isPublished ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                        {event.isPublished ? 'Live' : 'Draft'}
                                    </span>
                                    {isPast && (
                                        <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border bg-red-500/10 text-red-400 border-red-500/20">
                                            Past Event
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-5xl md:text-7xl font-display font-medium text-white tracking-tight leading-none">{event.name}</h1>
                            </div>
                            <div className="flex flex-col md:items-end text-left md:text-right">
                                <span className="text-gold font-display font-medium text-2xl italic">{format(new Date(event.eventDate), 'MMMM d, yyyy')}</span>
                                <span className="text-zinc-400 font-bold uppercase tracking-widest text-sm mt-1">{event.eventTime}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-10 grid lg:grid-cols-3 gap-12 bg-zinc-900/50 backdrop-blur-xl">
                    <div className="lg:col-span-2 space-y-10">
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">The Venue</h3>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold flex-shrink-0 text-xl border border-gold/20">📍</div>
                                <div>
                                    <p className="text-2xl font-display font-medium text-white mb-1">{event.venueName}</p>
                                    <p className="text-zinc-400 font-light">{event.venueAddress}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Event Details</h3>
                            <p className="text-zinc-300 leading-relaxed text-lg font-light whitespace-pre-wrap">{event.description || 'No description provided.'}</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white/5 p-8 rounded-[32px] border border-white/5">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6">RSVP Status</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="font-bold text-zinc-400 text-sm">Attendance</span>
                                        <span className="text-3xl font-display font-medium text-white">{event._count?.reservations || 0}</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-gold to-amber-200 w-[65%] shadow-[0_0_10px_rgba(212,175,55,0.3)]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-3xl font-display font-medium text-white mb-8">Active Passports</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {event.ticketTypes?.map((ticket: any) => (
                    <div key={ticket.id} className="group bg-zinc-900/40 border border-white/5 p-8 rounded-[32px] hover:border-gold/30 transition-all duration-500 hover:bg-zinc-900/60 hover:shadow-glow relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div>
                                <h3 className="font-display font-medium text-white text-xl mb-1 group-hover:text-gold transition-colors">{ticket.name}</h3>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Entry Level</p>
                            </div>
                            <p className="text-3xl font-display font-medium text-gold">${ticket.price}</p>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                <span>Utilization</span>
                                <span>{ticket.soldQuantity} / {ticket.totalQuantity}</span>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-gold h-full transition-all duration-1000 shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                                    style={{ width: `${((ticket.soldQuantity + ticket.reservedQuantity) / ticket.totalQuantity) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
