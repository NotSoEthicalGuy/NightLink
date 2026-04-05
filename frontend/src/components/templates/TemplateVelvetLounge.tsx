import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import VerifiedBadge from './VerifiedBadge';

export default function TemplateVelvetLounge({ config, tenant, events }: any) {
    const contact = tenant?.profile?.contactInfo || {};

    return (
        <div className="min-h-screen bg-[#1c1c1c] text-[#f5f1e8] font-serif selection:bg-[#d4af37] selection:text-[#1c1c1c]">
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=Lato:wght@300;400;700&display=swap');
                
                :root {
                    --gold: #d4af37;
                    --cream: #f5f1e8;
                    --charcoal: #1c1c1c;
                    --deep-burgundy: #2d1b1b;
                    --soft-gold: #8b7355;
                }

                .playfair { font-family: 'Playfair Display', serif; }
                .lato { font-family: 'Lato', sans-serif; }

                .nav-blur {
                    background: linear-gradient(to bottom, rgba(28, 28, 28, 0.95), transparent);
                    backdrop-filter: blur(10px);
                }

                .hero-overlay::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        radial-gradient(circle at 30% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 70% 30%, rgba(139, 115, 85, 0.1) 0%, transparent 40%);
                }

                .reservation-card {
                    background: linear-gradient(145deg, rgba(45, 27, 27, 0.4), rgba(28, 28, 28, 0.4));
                    border: 1px solid rgba(212, 175, 55, 0.2);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .reservation-card:hover {
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    border-color: var(--gold);
                }

                .btn-gold {
                    border: 2px solid var(--gold);
                    transition: all 0.3s;
                }

                .btn-gold:hover {
                    background: var(--gold);
                    color: var(--charcoal);
                }
            ` }} />

            {/* Navigation */}
            <nav className="fixed top-0 w-full py-8 px-[7%] flex justify-between items-center z-50 nav-blur">
                <div className="playfair text-3xl font-extrabold tracking-[3px] text-[#d4af37]">
                    {tenant?.name?.split(' ')[0] || 'VELVET'}
                </div>
                <ul className="hidden md:flex gap-12 lato text-xs uppercase tracking-[2px] font-light">
                    <li><a href="#events" className="hover:text-[#d4af37] transition-colors">Evenings</a></li>
                    <li><a href="#about" className="hover:text-[#d4af37] transition-colors">Manifesto</a></li>
                    <li><a href="#contact" className="hover:text-[#d4af37] transition-colors">Contact</a></li>
                </ul>
            </nav>

            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#2d1b1b] to-[#1c1c1c] hero-overlay">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-center px-[7%] relative z-10 max-w-5xl"
                >
                    <div className="lato text-xs tracking-[5px] uppercase text-[#d4af37] mb-8 font-normal">
                        {(tenant.isVerified || tenant.role?.toUpperCase() === 'ADMIN') ? 'Verified Excellence' : 'Nightlife Curated'}
                    </div>
                    <h1 className="playfair text-[clamp(60px,10vw,140px)] font-extrabold leading-none mb-4 tracking-tighter flex items-center justify-center gap-4 flex-wrap">
                        {tenant?.profile?.displayName || tenant?.name}
                        {tenant.role?.toUpperCase() === 'ADMIN' ? (
                            <VerifiedBadge size={40} type="admin" />
                        ) : tenant.isVerified ? (
                            <VerifiedBadge size={40} type="pr" />
                        ) : null}
                    </h1>
                    <p className="playfair text-[clamp(20px,3vw,32px)] font-normal italic text-[#8b7355] mb-10">
                        {tenant?.profile?.tagline || 'Elegance Redefined'}
                    </p>
                    <div className="w-[100px] h-[1px] bg-[#d4af37] mx-auto mb-10" />
                    <div className="lato text-sm text-[#f5f1e8]/70 tracking-[2px] leading-8">
                        ESTABLISHED 2026 • MEMBER ONLY ACCESS<br />
                        {tenant?.profile?.bio?.split('.')[0] || 'High-end experiences, cocktails & conversation.'}
                    </div>
                </motion.div>
            </section>

            {/* Events Section */}
            {config.sectionsVisibility?.events?.visible && (
                <section id="events" className="py-28 px-[7%] bg-[#1c1c1c]">
                    <div className="text-center mb-20">
                        <h2 className="playfair text-[clamp(40px,6vw,70px)] font-semibold mb-4">Curated Evenings</h2>
                        <p className="lato text-sm text-[#f5f1e8]/50 uppercase tracking-[3px]">Strictly Limited Attendance</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
                        {events.map((event: any, i: number) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="reservation-card p-12 text-center group"
                            >
                                <div className="text-4xl mb-6 opacity-80 group-hover:scale-110 transition-transform duration-500">
                                    {['🍸', '🎷', '🥂', '👠', '🤵'][i % 5]}
                                </div>
                                <h3 className="playfair text-3xl font-semibold mb-4 text-[#d4af37]">
                                    {event.name}
                                </h3>
                                <div className="lato text-4xl font-light mb-8">
                                    {event.eventTime}
                                </div>
                                <ul className="lato text-sm text-[#f5f1e8]/60 space-y-4 mb-10 text-left">
                                    <li className="border-b border-[#d4af37]/10 pb-2 flex justify-between italic">
                                        <span>Sequence</span>
                                        <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                                    </li>
                                    <li className="border-b border-[#d4af37]/10 pb-2 line-clamp-2">
                                        {event.description}
                                    </li>
                                </ul>
                                <Link
                                    to={`/pr/${tenant.slug}/event/${event.id}`}
                                    className="lato text-xs tracking-[3px] font-bold uppercase py-4 px-10 btn-gold inline-block w-full"
                                >
                                    Reserve Entry
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Gallery Section */}
            {config.sectionsVisibility?.gallery?.visible && (
                <section id="gallery" className="py-28 px-[7%] bg-[#1c1c1c] border-t border-[#d4af37]/10">
                    <div className="text-center mb-20">
                        <h2 className="playfair text-[clamp(40px,6vw,70px)] font-semibold mb-4 text-[#d4af37]">Atmosphere</h2>
                        <p className="lato text-sm text-[#f5f1e8]/50 uppercase tracking-[3px]">Captured Elegance</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="aspect-[3/4] bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/20 flex items-center justify-center lato text-[10px] uppercase tracking-[4px] text-[#8b7355]"
                            >
                                FRAME_00{i}_INT
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Experience / About Section */}
            {config.sectionsVisibility?.about?.visible && (
                <section id="about" className="py-28 px-[7%] bg-gradient-to-br from-[#1c1c1c] to-[#2d1b1b]">
                    <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
                        <div className="aspect-[4/5] bg-gradient-to-br from-[#d4af37]/20 to-[#8b7355]/20 border border-[#d4af37]/30 flex items-center justify-center overflow-hidden">
                            {tenant?.profile?.photoUrl ? (
                                <img src={tenant.profile.photoUrl.startsWith('/') ? `http://localhost:3001${tenant.profile.photoUrl}` : tenant.profile.photoUrl} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-[120px]">{['🤵', '🎷', '🎭'][Math.floor(events.length % 3)]}</span>
                            )}
                        </div>
                        <div className="space-y-10">
                            <h2 className="playfair text-5xl font-semibold leading-tight flex flex-col gap-2">
                                <span className="text-[#d4af37] lato text-xs tracking-[5px] uppercase font-normal">Our Philosophy</span>
                                The Manifesto
                            </h2>
                            <div className="space-y-6 lato text-lg text-[#f5f1e8]/70 leading-relaxed font-light">
                                <p className="italic border-l-2 border-[#d4af37] pl-8">
                                    "{tenant?.profile?.bio || 'Elegance is not about being noticed, it is about being remembered.'}"
                                </p>
                                <p>
                                    Step into a world where time slows down. Where the quality of the crowd
                                    is curated with precision, and the atmosphere is crafted with intent.
                                    We return to an age of golden service and absolute discretion.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer id="contact" className="py-24 px-[7%] bg-[#2d1b1b] border-t border-[#d4af37]/20 text-center">
                <div className="max-w-4xl mx-auto space-y-10">
                    <div className="playfair text-5xl font-black tracking-[5px] text-[#d4af37]">
                        {tenant?.name || 'VELVET'}
                    </div>
                    <div className="lato text-sm text-[#f5f1e8]/50 uppercase tracking-[2px] leading-[2.5]">
                        Global Concierge: {tenant?.email}<br />
                        {contact.whatsapp && `Hotline: ${contact.whatsapp}`}
                    </div>
                    <div className="flex justify-center gap-10">
                        {['📷', '📘', '🐦'].map((icon, i) => (
                            <a
                                key={i}
                                href="#"
                                className="w-12 h-12 border border-[#d4af37]/30 flex items-center justify-center text-xl text-[#d4af37] hover:bg-[#d4af37] hover:text-[#1c1c1c] transition-all"
                            >
                                {icon}
                            </a>
                        ))}
                    </div>
                    <p className="lato text-[11px] text-[#f5f1e8]/30 uppercase tracking-[2px]">
                        © 2026 {tenant?.name || 'Velvet'}. Powered by NightLink Concierge
                    </p>
                </div>
            </footer>
        </div>
    );
}
