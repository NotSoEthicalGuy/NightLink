import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function TemplateDarkLuxury({ config, tenant, events }: any) {
    const theme = config.themeConfig || {};
    const accentColor = config.colorPalette || 'purple';

    return (
        <div className="min-h-screen bg-black text-white font-serif selection:bg-yellow-500/20 selection:text-white">
            {/* Header */}
            <header className="py-8 sm:py-10 px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto w-full border-b border-white/5 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase italic mb-2 md:mb-0 text-center md:text-left">
                    {tenant?.name}
                </h1>
                <nav className="flex flex-wrap justify-center md:justify-end gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] opacity-60">
                    <a href="#about" className="hover:opacity-100 transition-opacity">Private</a>
                    <a href="#events" className="hover:opacity-100 transition-opacity">Nights</a>
                    <a href="#contact" className="hover:opacity-100 transition-opacity">Access</a>
                </nav>
            </header>

            {/* Hero */}
            <section className="relative min-h-[70vh] sm:h-[90vh] flex items-center justify-center text-center overflow-hidden px-4">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-matter.png")'
                }} />

                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="relative z-20 px-6"
                >
                    <span className="text-xs font-bold uppercase tracking-[0.5em] mb-6 block" style={{ color: accentColor === 'purple' ? '#ca8a04' : accentColor }}>Reserved for the Elite</span>
                    <h2 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-8 sm:mb-10 leading-[0.9] tracking-tighter break-words">
                        {theme.heroTitle || 'THE NIGHT IS YOURS'}
                    </h2>
                    <p className="text-xl md:text-2xl font-light italic mb-12 opacity-70 max-w-2xl mx-auto font-serif">
                        {theme.heroSubtitle || 'Indulge in an atmosphere of refined luxury and exquisite sound.'}
                    </p>
                    <a
                        href="#events"
                        className="inline-block px-12 py-5 text-white rounded-sm font-bold uppercase tracking-[0.2em] transition-all active:scale-95"
                        style={{
                            backgroundColor: accentColor === 'purple' ? '#ca8a04' : accentColor,
                            boxShadow: `0 0 20px ${accentColor === 'purple' ? '#ca8a044d' : accentColor + '4d'}`
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 30px ${accentColor === 'purple' ? '#ca8a0480' : accentColor + '80'}`;
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 20px ${accentColor === 'purple' ? '#ca8a044d' : accentColor + '4d'}`;
                        }}
                    >
                        {theme.heroButtonText || 'Enter the Night'}
                    </a>
                </motion.div>
            </section>

            {/* Events */}
            {config.sectionsVisibility?.events?.visible && (
                <section id="events" className="py-32 px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-end mb-16">
                            <div>
                                <span className="text-sm font-bold uppercase tracking-[0.3em] mb-4 block" style={{ color: accentColor === 'purple' ? '#ca8a04' : accentColor }}>Calendar</span>
                                <h3 className="text-5xl font-bold">UPCOMING</h3>
                            </div>
                        </div>
                        <div className="grid lg:grid-cols-2 gap-2">
                            {events.map((event: any, index: number) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="group relative h-[400px] overflow-hidden border border-white/5"
                                >
                                    <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-1000">
                                        {event.coverImageUrl && (
                                            <img src={event.coverImageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                                        )}
                                        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
                                    </div>
                                    <div className="absolute bottom-10 left-10 right-10 z-20">
                                        <span className="text-xs font-bold uppercase tracking-widest mb-1 block" style={{ color: accentColor === 'purple' ? '#ca8a04' : accentColor }}>{new Date(event.eventDate).toDateString()}</span>
                                        <h4 className="text-3xl font-bold mb-2 tracking-tight">{event.name}</h4>
                                        <p className="text-xs text-gray-200 mb-3">{event.eventTime}</p>
                                        <Link
                                            to={`/pr/${tenant.slug}/event/${event.id}`}
                                            className="text-xs font-bold uppercase tracking-widest border-b pb-1 transition-colors"
                                            style={{ borderColor: accentColor === 'purple' ? '#ca8a04' : accentColor }}
                                            onMouseOver={(e) => e.currentTarget.style.color = accentColor === 'purple' ? '#ca8a04' : accentColor}
                                            onMouseOut={(e) => e.currentTarget.style.color = 'white'}
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
                <section id="about" className="py-40 bg-white/[0.02] border-y border-white/5">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <div
                            className="w-px h-24 mx-auto mb-12"
                            style={{ background: `linear-gradient(to bottom, transparent, ${accentColor === 'purple' ? '#ca8a04' : accentColor})` }}
                        />
                        <h3 className="text-5xl font-bold mb-10 italic">{theme.aboutTitle || 'The Philosophy'}</h3>
                        <p className="text-2xl font-light leading-relaxed mb-12 opacity-80 serif italic">
                            {theme.aboutText || tenant?.profile?.bio || 'In a world that never sleeps, we provide the reason to stay awake. Beyond the music, it\'s the heartbeat of the modern aristocrat.'}
                        </p>
                        <div className="flex justify-center space-x-12">
                            {tenant?.profile?.contactInfo?.instagram && (
                                <a
                                    href={tenant.profile.contactInfo.instagram}
                                    className="opacity-40 hover:opacity-100 transition-opacity uppercase tracking-[0.3em] text-xs font-bold"
                                    onMouseOver={(e) => e.currentTarget.style.color = accentColor === 'purple' ? '#ca8a04' : accentColor}
                                    onMouseOut={(e) => e.currentTarget.style.color = 'white'}
                                >
                                    Instagram
                                </a>
                            )}
                            {tenant?.profile?.contactInfo?.whatsapp && (
                                <a
                                    href={`https://wa.me/${tenant.profile.contactInfo.whatsapp}`}
                                    className="opacity-40 hover:opacity-100 transition-opacity uppercase tracking-[0.3em] text-xs font-bold"
                                    onMouseOver={(e) => e.currentTarget.style.color = accentColor === 'purple' ? '#ca8a04' : accentColor}
                                    onMouseOut={(e) => e.currentTarget.style.color = 'white'}
                                >
                                    WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-32 px-8 text-center bg-black">
                <h1 className="text-2xl font-bold tracking-[0.5em] mb-12 opacity-20">{tenant?.name}</h1>
                <p className="text-xs font-bold tracking-[0.4em] opacity-40 uppercase">&copy; {new Date().getFullYear()} Private Concierge Service. All rights reserved.</p>
            </footer>
        </div>
    );
}
