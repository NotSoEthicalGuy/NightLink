import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import VerifiedBadge from './VerifiedBadge';

export default function TemplateMinimalist({ config, tenant, events, onEdit }: any) {
    const theme = config.themeConfig || {};
    const accentColor = config.colorPalette || 'purple';

    const getEditableProps = (field: string) => ({
        onClick: (e: any) => {
            if (onEdit) {
                e.preventDefault();
                e.stopPropagation();
                onEdit(field);
            }
        },
        className: onEdit ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-dashed hover:outline-yellow-500 rounded relative transition-all duration-200' : '',
        title: onEdit ? 'Click to edit this content' : undefined
    });

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-100">
            {/* Header */}
            <header className="py-8 px-6 border-b border-gray-100 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight uppercase">{tenant?.name}</h1>
                    {tenant.role?.toUpperCase() === 'ADMIN' ? (
                        <VerifiedBadge size={16} type="admin" />
                    ) : tenant.isVerified ? (
                        <VerifiedBadge size={16} type="pr" />
                    ) : null}
                </div>
                <nav className="hidden md:flex space-x-8 text-sm font-medium">
                    <a href="#about" className="hover:text-gray-500 transition-colors">About</a>
                    <a href="#events" className="hover:text-gray-500 transition-colors">Events</a>
                    <a href="#contact" className="hover:text-gray-500 transition-colors">Contact</a>
                </nav>
            </header>

            {/* Hero */}
            <section className="py-16 sm:py-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl"
                >
                    <h2
                        onClick={getEditableProps('heroTitle').onClick}
                        title={getEditableProps('heroTitle').title}
                        className={`text-3xl sm:text-4xl md:text-6xl font-bold mb-6 sm:mb-8 leading-tight flex items-center justify-center gap-4 flex-wrap ${getEditableProps('heroTitle').className}`}
                    >
                        {theme.heroTitle || 'Experience the Night in its Purest Form'}
                        {tenant.role?.toUpperCase() === 'ADMIN' ? (
                            <VerifiedBadge size={32} type="admin" />
                        ) : tenant.isVerified ? (
                            <VerifiedBadge size={32} type="pr" />
                        ) : null}
                    </h2>
                    <p
                        onClick={getEditableProps('heroSubtitle').onClick}
                        title={getEditableProps('heroSubtitle').title}
                        className={`text-base sm:text-lg text-gray-500 mb-8 sm:mb-12 ${getEditableProps('heroSubtitle').className}`}
                    >
                        {theme.heroSubtitle || 'Exclusive events, premium venues, unforgettable memories.'}
                    </p>
                    <a
                        href="#events"
                        onClick={getEditableProps('heroButtonText').onClick}
                        title={getEditableProps('heroButtonText').title}
                        className={`inline-block px-10 py-4 text-white rounded-full font-semibold transition-all shadow-xl hover:shadow-2xl active:scale-95 ${getEditableProps('heroButtonText').className}`}
                        style={{ backgroundColor: accentColor === 'purple' ? '#111827' : accentColor }}
                    >
                        {theme.heroButtonText || 'View Events'}
                    </a>
                </motion.div>
            </section>

            {/* Events */}
            {config.sectionsVisibility?.events?.visible && (
                <section id="events" className="py-24 px-6 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <h3
                            className={`text-3xl font-bold mb-12 border-l-4 pl-4 ${getEditableProps('eventsTitle').className}`}
                            style={{ borderColor: accentColor === 'purple' ? '#111827' : accentColor }}
                            onClick={getEditableProps('eventsTitle').onClick}
                            title={getEditableProps('eventsTitle').title}
                        >
                            {theme.eventsTitle || 'Upcoming Events'}
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {events.map((event: any) => (
                                <motion.div
                                    key={event.id}
                                    whileHover={{ y: -5 }}
                                    className="group cursor-pointer"
                                >
                                    <div className="aspect-[16/10] bg-gray-200 rounded-2xl mb-6 overflow-hidden relative">
                                        {event.coverImageUrl && (
                                            <img
                                                src={event.coverImageUrl.startsWith('/') ? `http://localhost:3001${event.coverImageUrl}` : event.coverImageUrl}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                alt=""
                                            />
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-gray-900">
                                            {new Date(event.eventDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-bold mb-2">{event.name}</h4>
                                    <p className="text-gray-500 mb-1 line-clamp-2">{event.description}</p>
                                    <p className="text-xs text-gray-400 mb-3">
                                        {new Date(event.eventDate).toLocaleDateString()} • {event.eventTime}
                                    </p>
                                    <Link
                                        to={`/pr/${tenant.slug}/event/${event.id}`}
                                        className="text-sm font-bold uppercase tracking-widest text-gray-400 transition-colors"
                                        style={{ color: '#9ca3af' }}
                                        onMouseOver={(e) => e.currentTarget.style.color = accentColor === 'purple' ? '#111827' : accentColor}
                                        onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
                                    >
                                        View Details →
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* About */}
            {config.sectionsVisibility?.about?.visible && (
                <section id="about" className="py-20 sm:py-28 px-6 max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                        <div className="aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden shadow-2xl rotate-1 md:rotate-3 scale-100 hover:rotate-0 hover:scale-105 transition-all duration-700">
                            {theme.aboutImageUrl || tenant?.profile?.photoUrl ? (
                                <img
                                    src={(theme.aboutImageUrl || tenant.profile.photoUrl).startsWith('/') ? `http://localhost:3001${theme.aboutImageUrl || tenant.profile.photoUrl}` : (theme.aboutImageUrl || tenant.profile.photoUrl)}
                                    alt="About"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 uppercase tracking-[0.3em]">
                                    Identity Profile Image
                                </div>
                            )}
                        </div>
                        <div>
                            <h3
                                onClick={getEditableProps('aboutTitle').onClick}
                                title={getEditableProps('aboutTitle').title}
                                className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 ${getEditableProps('aboutTitle').className}`}
                            >
                                {theme.aboutTitle || 'Our Story'}
                            </h3>
                            <p
                                onClick={getEditableProps('aboutText').onClick}
                                title={getEditableProps('aboutText').title}
                                className={`text-base sm:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8 ${getEditableProps('aboutText').className}`}
                            >
                                {theme.aboutText || tenant?.profile?.bio || 'We curate the most exclusive night entertainment in the city. Our focus is on quality, atmosphere, and the joy of music.'}
                            </p>
                            <div className="flex space-x-6">
                                {tenant?.profile?.contactInfo?.instagram && (
                                    <a
                                        href={tenant.profile.contactInfo.instagram}
                                        className="text-gray-400 hover:text-gray-900 transition-colors text-sm uppercase font-bold tracking-widest"
                                        onMouseOver={(e) => e.currentTarget.style.color = accentColor === 'purple' ? '#111827' : accentColor}
                                        onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
                                    >
                                        Instagram
                                    </a>
                                )}
                                {tenant?.profile?.contactInfo?.whatsapp && (
                                    <a
                                        href={`https://wa.me/${tenant.profile.contactInfo.whatsapp}`}
                                        className="text-gray-400 hover:text-gray-900 transition-colors text-sm uppercase font-bold tracking-widest"
                                        onMouseOver={(e) => e.currentTarget.style.color = accentColor === 'purple' ? '#111827' : accentColor}
                                        onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
                                    >
                                        WhatsApp
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} {tenant?.name}. Powered by NightLink.</p>
                </div>
            </footer>
        </div>
    );
}
