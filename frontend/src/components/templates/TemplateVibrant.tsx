import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function TemplateVibrant({ config, tenant, events }: any) {
    const theme = config.themeConfig || {};
    const accent = config.colorPalette || '#ec4899'; // Default pink-500

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-pink-500 selection:text-white">
            {/* Header */}
            <header className="py-6 px-6 sticky top-0 bg-black/50 backdrop-blur-xl z-50 border-b border-white/5">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1
                        className="text-3xl font-black bg-clip-text text-transparent"
                        style={{ backgroundImage: `linear-gradient(to right, ${accent}, #8b5cf6)` }}
                    >
                        {tenant?.name}
                    </h1>
                    <div className="hidden md:flex space-x-2">
                        {['Events', 'VIP', 'Contact'].map(item => (
                            <a key={item} href={`#${item.toLowerCase()}`} className="px-4 py-2 hover:bg-white/10 rounded-full text-sm font-bold transition-all uppercase tracking-tighter italic">
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-6 overflow-hidden">
                <div
                    className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] -mr-48 -mt-24 animate-pulse opacity-20"
                    style={{ backgroundColor: accent }}
                />
                <div
                    className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px] -ml-40 -mb-20 animate-pulse delay-700"
                />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 100 }}
                    >
                        <h2 className="text-4xl sm:text-6xl md:text-[7rem] lg:text-[9rem] font-black leading-[0.8] mb-8 sm:mb-12 tracking-tighter italic uppercase break-words">
                            {theme.heroTitle || 'WE OWN THE NIGHT'}
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-end">
                            <p className="text-lg sm:text-2xl font-bold italic opacity-60 uppercase tracking-tighter">
                                {theme.heroSubtitle || 'Join the most vibrant community of music lovers. Loud, proud, and absolutely unforgettable.'}
                            </p>
                            <div className="flex justify-end">
                                <a
                                    href="#events"
                                    className="group relative px-8 sm:px-12 py-4 sm:py-6 bg-white text-black font-black uppercase text-sm sm:text-xl italic transition-all transform -rotate-2 hover:rotate-0"
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = accent;
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = 'white';
                                        e.currentTarget.style.color = 'black';
                                    }}
                                >
                                    {theme.heroButtonText || 'Tickets Now 🔥'}
                                    <div className="absolute inset-0 border-2 border-white translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform -z-10" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Events */}
            {config.sectionsVisibility?.events?.visible && (
                <section id="events" className="py-24 px-6 relative">
                    <div className="max-w-7xl mx-auto">
                        <h3 className="text-5xl font-black italic uppercase mb-12 tracking-tighter">Next Up</h3>
                        <div className="grid md:grid-cols-2 gap-8">
                            {events.map((event: any) => (
                                <motion.div
                                    key={event.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="group bg-white/5 border border-white/10 p-6 flex gap-6 items-center"
                                >
                                    <div className="w-40 h-40 bg-gray-800 flex-shrink-0 relative overflow-hidden">
                                        {event.coverImageUrl && (
                                            <img src={event.coverImageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                        )}
                                        <div className="absolute inset-0 mix-blend-color opacity-20" style={{ backgroundColor: accent }} />
                                    </div>
                                    <div>
                                        <span className="font-bold uppercase text-sm mb-1 block tracking-tight" style={{ color: accent }}>{new Date(event.eventDate).toLocaleDateString()}</span>
                                        <h4 className="text-2xl font-black uppercase italic mb-4">{event.name}</h4>
                                        <p className="text-xs text-gray-300 mb-3">
                                            {event.eventTime}
                                        </p>
                                        <Link
                                            to={`/pr/${tenant.slug}/event/${event.id}`}
                                            className="px-6 py-2 border-2 border-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all italic block text-center"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* About */}
            {config.sectionsVisibility?.about?.visible && (
                <section className="py-32 px-6" style={{ backgroundColor: accent }}>
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            <div className="absolute inset-0 border-8 border-white -rotate-6" />
                            <div className="bg-black aspect-video relative z-10 flex items-center justify-center p-12">
                                <h2 className="text-5xl font-black italic text-center leading-none">{theme.aboutTitle || 'BORN IN THE DARK, LIVES IN THE LIGHT.'}</h2>
                            </div>
                        </div>
                        <div className="text-white">
                            <p className="text-3xl font-bold italic leading-tight mb-12 uppercase tracking-tighter">
                                {theme.aboutText || tenant?.profile?.bio || 'We are more than a brand. We are a movement. A collective of souls searching for the next high-voltage experience.'}
                            </p>
                            <div className="flex gap-4">
                                <a
                                    href={tenant?.profile?.contactInfo?.instagram}
                                    className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center font-bold italic transition-all hover:bg-white"
                                    onMouseOver={(e) => e.currentTarget.style.color = accent}
                                    onMouseOut={(e) => e.currentTarget.style.color = 'white'}
                                >
                                    IG
                                </a>
                                <a
                                    href={`https://wa.me/${tenant?.profile?.contactInfo?.whatsapp}`}
                                    className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center font-bold italic transition-all hover:bg-white"
                                    onMouseOver={(e) => e.currentTarget.style.color = accent}
                                    onMouseOut={(e) => e.currentTarget.style.color = 'white'}
                                >
                                    WA
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-white/5 text-center">
                <p className="text-7xl font-black opacity-10 italic uppercase select-none mb-8">{tenant?.name}</p>
                <p className="text-xs font-bold opacity-40 uppercase tracking-widest italic">&copy; {new Date().getFullYear()} NightLink Platform. Stay Wild.</p>
            </footer>
        </div>
    );
}
