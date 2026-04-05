import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function TemplateNeon({ config, tenant, events }: any) {
    const theme = config.themeConfig || {};
    const accent = config.colorPalette || '#22c55e';

    return (
        <div className="min-h-screen bg-black text-white font-sans" style={{ '--accent-color': accent } as any}>
            {/* Header */}
            <header className="py-5 px-5 border-b border-white/10 sticky top-0 z-40 bg-black/70 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-black text-lg shadow-[0_0_25px_rgba(45,212,191,0.6)]"
                            style={{ background: `linear-gradient(to top right, ${accent}, #10b981)`, boxShadow: `0 0 25px ${accent}66` }}
                        >
                            NL
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
                                {tenant?.name}
                            </h1>
                            {tenant?.profile?.tagline && (
                                <p className="text-[10px] uppercase tracking-[0.25em] opacity-70" style={{ color: accent }}>
                                    {tenant.profile.tagline}
                                </p>
                            )}
                        </div>
                    </div>
                    <nav className="hidden sm:flex items-center gap-6 text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                        {config.sectionsVisibility?.events?.visible && (
                            <a href="#events" className="hover:text-white transition-colors">Events</a>
                        )}
                        {config.sectionsVisibility?.about?.visible && (
                            <a href="#about" className="hover:text-white transition-colors">About</a>
                        )}
                        {config.sectionsVisibility?.contact?.visible && (
                            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
                        )}
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <section className="relative overflow-hidden">
                {/* Optional hero background image */}
                {theme.heroImageUrl && (
                    <div className="absolute inset-0 opacity-60">
                        <img
                            src={theme.heroImageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
                    </div>
                )}
                {!theme.heroImageUrl && (
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${accent}26, #0ea5e91a, black)` }} />
                )}

                {/* Neon grid */}
                <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none opacity-60">
                    <div
                        className="absolute inset-0"
                        style={{ background: `radial-gradient(circle at 50% -20%, ${accent}99, transparent 60%), linear-gradient(rgba(15,23,42,0.9), black)` }}
                    />
                </div>

                <div className="relative max-w-6xl mx-auto px-5 pt-20 pb-16 sm:pt-24 sm:pb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="max-w-3xl"
                    >
                        <p className="text-[11px] uppercase tracking-[0.35em] mb-4" style={{ color: `${accent}cc` }}>
                            {theme.heroBadge || 'NightLink Exclusive'}
                        </p>
                        <h2 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6">
                            {theme.heroTitle || 'Neon Nights, Electric Energy.'}
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-slate-200/80 mb-8 max-w-xl">
                            {theme.heroSubtitle || 'Curated events in the city’s most iconic clubs. Lights, bass, and memories that last beyond sunrise.'}
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <a
                                href="#events"
                                className="px-7 py-3 rounded-full text-black font-black text-xs uppercase tracking-[0.25em] transition-colors"
                                style={{
                                    backgroundColor: accent,
                                    boxShadow: `0 0 30px ${accent}e6`
                                }}
                            >
                                {theme.heroButtonText || 'View Events'}
                            </a>
                            {tenant?.profile?.contactInfo?.whatsapp && (
                                <a
                                    href={`https://wa.me/${tenant.profile.contactInfo.whatsapp}`}
                                    className="px-6 py-3 rounded-full border text-[11px] font-bold uppercase tracking-[0.2em] transition-colors"
                                    style={{
                                        borderColor: `${accent}80`,
                                        color: accent,
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = `${accent}1a`}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    WhatsApp
                                </a>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Events */}
            {config.sectionsVisibility?.events?.visible && (
                <section id="events" className="py-16 sm:py-20 px-5 bg-black">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                            <div>
                                <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400 mb-2">
                                    {theme.eventsBadge || 'Upcoming'}
                                </p>
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black">
                                    {theme.eventsTitle || 'Events & Bookings'}
                                </h3>
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event: any) => (
                                <motion.div
                                    key={event.id}
                                    whileHover={{ y: -4 }}
                                    className="bg-slate-900/70 border rounded-2xl overflow-hidden flex flex-col"
                                    style={{ borderColor: `${accent}33` }}
                                >
                                    <div className="relative aspect-[4/3] bg-slate-800">
                                        {event.coverImageUrl && (
                                            <img
                                                src={event.coverImageUrl}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <div
                                            className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 text-[10px] uppercase tracking-[0.2em]"
                                            style={{ color: accent }}
                                        >
                                            {new Date(event.eventDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="p-4 sm:p-5 flex-1 flex flex-col">
                                        <h4 className="text-lg font-bold mb-1 line-clamp-1">{event.name}</h4>
                                        <p className="text-xs text-slate-300/80 mb-3 line-clamp-2">{event.description}</p>
                                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
                                            <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                                                {event.eventTime}
                                            </span>
                                            <Link
                                                to={`/pr/${tenant.slug}/event/${event.id}`}
                                                className="text-[11px] uppercase tracking-[0.2em] hover:text-white font-bold"
                                                style={{ color: accent }}
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* About */}
            {config.sectionsVisibility?.about?.visible && (
                <section id="about" className="py-16 sm:py-24 px-5 bg-gradient-to-b from-black to-slate-950">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                        <div className="order-2 md:order-1 space-y-5">
                            <p className="text-[11px] uppercase tracking-[0.35em]" style={{ color: `${accent}b3` }}>
                                {theme.aboutBadge || 'About'}
                            </p>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black">
                                {theme.aboutTitle || 'The Circuit Behind the City.'}
                            </h3>
                            <p className="text-sm sm:text-base text-slate-200/80 leading-relaxed">
                                {theme.aboutText || tenant?.profile?.bio || 'We move the crowd between laser beams and basslines. Our nights are built on trust, precision, and access to the most exclusive rooms in town.'}
                            </p>
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="relative max-w-md mx-auto">
                                <div
                                    className="absolute -inset-4 rounded-3xl blur-2xl opacity-20"
                                    style={{ backgroundColor: accent }}
                                />
                                <div
                                    className="relative rounded-3xl overflow-hidden border bg-slate-900"
                                    style={{ borderColor: `${accent}66` }}
                                >
                                    {theme.aboutImageUrl ? (
                                        <img
                                            src={theme.aboutImageUrl}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="aspect-[4/5] flex items-center justify-center text-xs text-slate-500 uppercase tracking-[0.3em]">
                                            Upload a hero image in the editor
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Contact */}
            {config.sectionsVisibility?.contact?.visible && (
                <section id="contact" className="py-14 px-5 bg-black">
                    <div className="max-w-4xl mx-auto text-center space-y-4">
                        <h3 className="text-2xl sm:text-3xl font-black">
                            {theme.contactTitle || 'Direct Access.'}
                        </h3>
                        <p className="text-sm sm:text-base text-slate-300/80 max-w-xl mx-auto">
                            {theme.contactText || 'Reach out for VIP tables, collaborations, or private bookings.'}
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 pt-2">
                            {tenant?.profile?.contactInfo?.instagram && (
                                <a
                                    href={tenant.profile.contactInfo.instagram}
                                    className="px-5 py-2 rounded-full border text-[11px] uppercase tracking-[0.25em] transition-colors"
                                    style={{ borderColor: `${accent}66`, color: `${accent}cc` }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = `${accent}1a`}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    Instagram
                                </a>
                            )}
                            {tenant?.profile?.contactInfo?.whatsapp && (
                                <a
                                    href={`https://wa.me/${tenant.profile.contactInfo.whatsapp}`}
                                    className="px-5 py-2 rounded-full border text-[11px] uppercase tracking-[0.25em] transition-colors"
                                    style={{ borderColor: `${accent}66`, color: `${accent}cc` }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = `${accent}1a`}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-10 px-5 border-t border-white/5 bg-black/90">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
                        {theme.footerText || `© ${new Date().getFullYear()} ${tenant?.name || 'NightLink PR'}`}
                    </p>
                    <p className="text-[10px] text-slate-600 uppercase tracking-[0.25em]">
                        Powered by NightLink
                    </p>
                </div>
            </footer>
        </div>
    );
}


