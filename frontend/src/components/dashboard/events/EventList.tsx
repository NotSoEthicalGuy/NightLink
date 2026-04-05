import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../lib/api'
import { format } from 'date-fns'

export default function EventList() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/events')
            .then(res => {
                const now = new Date();
                // Set to beginning of today to include events happening today
                now.setHours(0, 0, 0, 0);

                const upcoming = res.data.filter((event: any) => {
                    // Check if event has explicitly ended or date has passed
                    const eventDate = new Date(event.eventDate);
                    // If eventDate is valid and >= today
                    const isFutureDate = !isNaN(eventDate.getTime()) && eventDate >= now;
                    // If there's a status field, ensure it's not 'Ended'
                    const isActiveStatus = event.status !== 'Ended';

                    return isFutureDate && isActiveStatus;
                });

                // Sort by date ascending (soonest first)
                upcoming.sort((a: any, b: any) =>
                    new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
                );

                setEvents(upcoming);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className="p-8 text-center text-gray-400">Loading events...</div>

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-display font-medium text-white mb-2">Upcoming Events</h1>
                    <p className="text-zinc-500 font-light">Manage your active and scheduled nightlife experiences</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <Link
                        to="history"
                        className="flex-1 md:flex-none px-6 py-3 bg-zinc-900 border border-white/5 rounded-xl font-medium text-zinc-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2"
                    >
                        History
                    </Link>
                    <Link
                        to="new"
                        className="flex-1 md:flex-none px-6 py-3 bg-gold text-midnight rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow flex items-center justify-center gap-2"
                    >
                        + Create Event
                    </Link>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="bg-zinc-900/20 border border-dashed border-white/10 rounded-[32px] text-center py-20 backdrop-blur-sm">
                    <div className="text-6xl mb-6 opacity-20 grayscale">🎧</div>
                    <p className="text-zinc-500 mb-8 text-xl font-light">You don't have any upcoming events.</p>
                    <div className="flex justify-center gap-4">
                        <Link to="new" className="px-8 py-4 bg-gold text-midnight rounded-xl font-bold uppercase tracking-wide hover:shadow-glow transition-all">Create Event</Link>
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map(event => (
                        <div key={event.id} className="group relative flex flex-col h-full">
                            <Link to={`${event.id}`} className="flex-1">
                                <div className="relative bg-zinc-900/40 border border-white/5 rounded-[32px] overflow-hidden transition-all duration-500 hover:border-gold/30 hover:shadow-2xl h-full flex flex-col backdrop-blur-md">
                                    <div className="aspect-[16/10] overflow-hidden relative">
                                        {event.coverImageUrl ? (
                                            <img
                                                src={event.coverImageUrl.startsWith('/') ? `http://localhost:3001${event.coverImageUrl}` : event.coverImageUrl}
                                                alt={event.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 desaturate-[0.2] group-hover:desaturate-0"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center text-5xl grayscale opacity-50">🎉</div>
                                        )}
                                        <div className="absolute top-6 left-6 flex gap-2">
                                            {event.isDraft && (
                                                <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md bg-zinc-800/80 text-zinc-400 border border-white/10">
                                                    Draft
                                                </div>
                                            )}
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${event.isPublished ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/20' : 'bg-zinc-900/80 text-zinc-500 border-white/10'}`}>
                                                {event.isPublished ? 'Public' : 'Hidden'}
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-90" />
                                    </div>

                                    <div className="p-8 flex-1 flex flex-col relative">
                                        <h3 className="text-2xl font-display font-medium text-white group-hover:text-gold transition-colors mb-4 leading-tight">{event.name}</h3>

                                        <div className="space-y-3 mb-8">
                                            <div className="flex items-center gap-3 text-platinum">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-glow" />
                                                <span className="text-sm font-medium uppercase tracking-wider">{format(new Date(event.eventDate), 'EEE. MMM d')}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-zinc-500">
                                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                                                <span className="text-sm font-medium">{event.eventTime}</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Bookings</span>
                                                <span className="text-xl font-display font-medium text-white">{event._count?.reservations || 0}</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold/50 group-hover:text-gold transition-all duration-300">
                                                <span className="text-lg">→</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* Action Buttons */}
                            <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        api.post(`/events/${event.id}/duplicate`).then(() => window.location.reload());
                                    }}
                                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl border border-white/10 transition-all active:scale-95"
                                    title="Duplicate Event"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                </button>
                                <button
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        const res = await api.get(`/reservations/export-csv/${event.id}`);
                                        const blob = new Blob([res.data], { type: 'text/csv' });
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `reservations-${event.name}.csv`;
                                        a.click();
                                    }}
                                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl border border-white/10 transition-all active:scale-95"
                                    title="Export Reservations"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
