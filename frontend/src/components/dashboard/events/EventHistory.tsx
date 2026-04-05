import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../lib/api'
import { format } from 'date-fns'
import { BarChart3, Users, Ticket, ArrowLeft } from 'lucide-react'

export default function EventHistory() {
    const [pastEvents, setPastEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/events')
            .then(res => {
                const now = new Date();
                now.setHours(0, 0, 0, 0);

                // Only show events where eventDate is in the past OR status is Ended
                const history = res.data.filter((event: any) => {
                    const eventDate = new Date(event.eventDate);
                    const isPastDate = !isNaN(eventDate.getTime()) && eventDate < now;
                    const isEndedStatus = event.status === 'Ended';
                    return isPastDate || isEndedStatus;
                });

                // Sort by date descending (most recent first)
                history.sort((a: any, b: any) =>
                    new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
                );

                setPastEvents(history);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-[#00d9ff] border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-6 mb-12">
                <Link to=".." className="w-12 h-12 rounded-2xl bg-zinc-900/50 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-all shadow-lg">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-4xl font-display font-medium text-white mb-1">Event History</h1>
                    <p className="text-zinc-500 font-light">Archive of your past nightlife experiences</p>
                </div>
            </div>

            {pastEvents.length === 0 ? (
                <div className="bg-zinc-900/20 border-2 border-dashed border-white/5 rounded-[32px] text-center py-20">
                    <div className="text-6xl mb-6 opacity-20 grayscale">🎞️</div>
                    <p className="text-zinc-400 mb-2 text-xl font-medium">Your event history is empty.</p>
                    <p className="text-zinc-600 text-sm">Completed events will appear here automatically.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {pastEvents.map(event => (
                        <Link to={`/dashboard/events/${event.id}`} key={event.id} className="block group">
                            <div className="bg-zinc-900/40 border border-white/5 rounded-[32px] p-8 transition-all duration-500 hover:border-gold/30 hover:bg-zinc-900/60 hover:shadow-glow relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-[20px] overflow-hidden bg-zinc-800 flex-shrink-0 relative border border-white/5">
                                            {event.coverImageUrl ? (
                                                <img src={event.coverImageUrl} alt={event.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                            ) : (
                                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-3xl grayscale group-hover:grayscale-0 transition-all">🎉</div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-display font-medium text-white group-hover:text-gold transition-colors mb-2">{event.name}</h3>
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 border border-white/5 group-hover:border-gold/20 group-hover:text-gold/80 transition-colors">
                                                    Archived
                                                </span>
                                                <p className="text-zinc-500 text-sm font-medium">
                                                    {format(new Date(event.eventDate), 'MMM d, yyyy')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10 lg:bg-black/20 lg:p-6 lg:rounded-[24px] border border-transparent lg:border-white/5 transition-all">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 text-zinc-500 mb-1">
                                                <Users size={14} className="text-gold" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Attendance</span>
                                            </div>
                                            <span className="text-2xl font-display font-medium text-white">{event._count?.reservations || 0}</span>
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 text-zinc-500 mb-1">
                                                <Ticket size={14} className="text-emerald-500" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Revenue</span>
                                            </div>
                                            <span className="text-2xl font-display font-medium text-emerald-400">
                                                ${((event._count?.reservations || 0) * 45).toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="hidden md:flex flex-col">
                                            <div className="flex items-center gap-2 text-zinc-500 mb-1">
                                                <BarChart3 size={14} className="text-zinc-400" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Sell Thru</span>
                                            </div>
                                            <span className="text-2xl font-display font-medium text-platinum">88%</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold group-hover:text-midnight transition-all duration-300 shadow-lg">
                                            <ArrowLeft className="rotate-180" size={24} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
