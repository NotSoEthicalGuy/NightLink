import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import VerifiedBadge from './VerifiedBadge';

export default function TemplateNeonNights({ config, tenant, events }: any) {
    const accent = config.colorPalette?.startsWith('#') ? config.colorPalette : (config.colorPalette === 'gold' ? '#ffee00' : (config.colorPalette === 'pink' ? '#ff0080' : (config.colorPalette === 'cyan' ? '#00fff5' : '#00fff5')));
    const secondary = config.secondaryColor || '#ff0080';

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-[#ff0080] selection:text-white">
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;600;800&display=swap');
                
                :root {
                    --neon-cyan: ${accent};
                    --neon-pink: ${secondary};
                    --neon-yellow: #ffee00;
                    --dark: #0a0a0f;
                    --darker: #050508;
                    --accent-main: ${accent};
                }

                .bebas { font-family: 'Bebas Neue', sans-serif; }
                .outfit { font-family: 'Outfit', sans-serif; }

                /* Scanlines effect */
                .scanlines::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: repeating-linear-gradient(
                        0deg,
                        rgba(0, 255, 245, 0.03) 0px,
                        transparent 1px,
                        transparent 2px,
                        rgba(0, 255, 245, 0.03) 3px
                    );
                    pointer-events: none;
                    z-index: 1000;
                    animation: scan 8s linear infinite;
                }

                @keyframes scan {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(4px); }
                }

                .hero-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0.3;
                    background: 
                        radial-gradient(circle at 20% 50%, var(--neon-cyan) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, var(--neon-pink) 0%, transparent 50%);
                    filter: blur(100px);
                }

                .diagonal-stripe {
                    position: absolute;
                    width: 200%;
                    height: 300px;
                    background: linear-gradient(90deg, transparent 0%, var(--neon-cyan) 50%, transparent 100%);
                    opacity: 0.1;
                    transform: rotate(-15deg);
                    top: 20%;
                    left: -50%;
                    animation: slide 20s linear infinite;
                }

                @keyframes slide {
                    0% { transform: translateX(0) rotate(-15deg); }
                    100% { transform: translateX(50%) rotate(-15deg); }
                }

                .hero-title-text {
                    background: linear-gradient(135deg, white 0%, var(--neon-cyan) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-shadow: 0 0 80px rgba(0, 255, 245, 0.5);
                }

                .ticket-card {
                    background: linear-gradient(135deg, rgba(0, 255, 245, 0.05) 0%, rgba(255, 0, 128, 0.05) 100%);
                    border: 2px solid rgba(0, 255, 245, 0.2);
                    transform: skew(-2deg);
                    transition: all 0.3s ease;
                }

                .ticket-card:hover {
                    transform: skew(-2deg) translateY(-10px);
                    border-color: var(--neon-cyan);
                    box-shadow: 0 20px 60px rgba(0, 255, 245, 0.3);
                }

                .ticket-content {
                    transform: skew(2deg);
                }
            ` }} />

            <div className="scanlines" />

            {/* Header / Logo */}
            <header className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-4">
                    {config.logoUrl ? (
                        <img src={config.logoUrl} alt={tenant.name} className="h-10 w-auto" />
                    ) : (
                        <div className="bebas text-2xl tracking-tighter text-[var(--neon-cyan)] flex items-center gap-2">
                            {tenant.name}
                            {tenant.role === 'ADMIN' && <VerifiedBadge size={16} />}
                        </div>
                    )}
                </div>
                <nav className="hidden md:flex gap-8 bebas text-xl tracking-widest uppercase">
                    <a href="#events" className="hover:text-[var(--neon-cyan)] transition-colors">Operations</a>
                    <a href="#about" className="hover:text-[var(--neon-cyan)] transition-colors">HQ</a>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-[#050508] to-[#1a0033] py-20 outfit">
                <div className="hero-bg" />
                <div className="diagonal-stripe" />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="text-[#00fff5] uppercase tracking-[0.3em] text-sm font-semibold mb-6">
                            {(tenant.isVerified || tenant.role?.toUpperCase() === 'ADMIN') ? 'Verified NightLink Command' : 'PR Channel'}
                        </div>
                        <h1 className="bebas text-[clamp(60px,12vw,160px)] leading-[0.9] tracking-tighter uppercase mb-6 hero-title-text flex items-center gap-4 flex-wrap">
                            {tenant?.profile?.displayName || tenant?.name}
                            {tenant.role?.toUpperCase() === 'ADMIN' ? (
                                <VerifiedBadge size={48} type="admin" className="mt-4" />
                            ) : tenant.isVerified ? (
                                <VerifiedBadge size={48} type="pr" className="mt-4" />
                            ) : null}
                        </h1>
                        <h2 className="text-[#ff0080] uppercase tracking-wider text-[clamp(20px,3vw,32px)] font-extrabold mb-8 italic">
                            {tenant?.profile?.bio?.split('.')[0] || 'The Ultimate Nightlife Experience'}
                        </h2>
                        <p className="text-white/70 text-lg max-w-xl leading-relaxed mb-10 font-light">
                            {tenant?.profile?.bio || 'Step into a world where bass drops shake your soul and neon lights paint the darkness.'}
                        </p>

                        <div className="flex gap-10 flex-wrap">
                            <div className="flex flex-col">
                                <span className="text-5xl font-extrabold text-[#00fff5] leading-none mb-2">{events.length}</span>
                                <span className="text-[11px] text-white/50 uppercase tracking-widest font-bold">Upcoming Missions</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-5xl font-extrabold text-[#00fff5] leading-none mb-2">24/7</span>
                                <span className="text-[11px] text-white/50 uppercase tracking-widest font-bold">Access Required</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Events Section */}
            {config.sectionsVisibility?.events?.visible && (
                <section id="events" className="relative py-24 bg-[#050508] outfit">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="bebas text-center text-7xl mb-16 tracking-wider uppercase">Active Operations</h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {events.map((event: any, i: number) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="ticket-card p-10 group"
                                >
                                    <div className="ticket-content">
                                        <div className="text-[#00fff5] text-xs uppercase tracking-widest font-bold mb-3">
                                            {event.eventTime}
                                        </div>
                                        <h3 className="bebas text-4xl mb-4 group-hover:text-[#00fff5] transition-colors uppercase leading-tight">
                                            {event.name}
                                        </h3>
                                        <div className="text-5xl font-black text-[#ff0080] mb-6">
                                            <span className="text-base font-bold text-white/50 mr-2 uppercase tracking-tighter">Starts At</span>
                                            FREE
                                        </div>
                                        <ul className="space-y-3 mb-10 text-white/70 text-sm">
                                            <li className="flex items-center gap-2">
                                                <span className="text-[#00fff5] font-black">→</span>
                                                {new Date(event.eventDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                            </li>
                                            <li className="flex items-center gap-2 line-clamp-2">
                                                <span className="text-[#00fff5] font-black">→</span>
                                                {event.description}
                                            </li>
                                        </ul>
                                        <Link
                                            to={`/pr/${tenant.slug}/event/${event.id}`}
                                            className="block w-full text-center py-5 bg-[#00fff5] text-[#050508] font-black uppercase text-sm tracking-widest hover:bg-[#ff0080] hover:text-white transition-all shadow-[0_10px_40px_rgba(0,255,245,0.4)] hover:shadow-[0_10px_40px_rgba(255,0,128,0.6)]"
                                        >
                                            Infiltrate Now
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Gallery Section */}
            {config.sectionsVisibility?.gallery?.visible && (
                <section id="gallery" className="py-24 bg-[#0a0a0f] outfit relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="bebas text-center text-7xl mb-16 tracking-wider uppercase text-[#ff0080]">Visual Evidence</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                                    className="aspect-square bg-white/5 border border-[#00fff5]/30 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.3em] text-white/20 overflow-hidden relative group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#00fff5]/10 to-transparent" />
                                    PHOTO_00{i}_INTEL
                                    <div className="absolute inset-0 border-2 border-[#ff0080] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Lineup / About Section */}
            {config.sectionsVisibility?.about?.visible && (
                <section id="about" className="py-24 bg-gradient-to-br from-[#0a0a0f] to-[#1a0033] outfit">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <h2 className="bebas text-7xl text-[#00fff5] mb-8 leading-none">The HQ Command</h2>
                                <p className="text-xl text-white/80 leading-relaxed mb-8 italic">
                                    "{tenant?.profile?.bio || 'This promoter moves in silence. No bio provided.'}"
                                </p>
                                <div className="space-y-6">
                                    <div className="bg-white/5 p-6 border-l-4 border-[#00fff5] hover:bg-[#00fff5]/5 hover:translate-x-3 transition-all">
                                        <div className="text-[10px] text-[#00fff5] uppercase font-bold tracking-[0.3em] mb-2">Primary Contact</div>
                                        <div className="bebas text-3xl">{tenant?.email}</div>
                                    </div>
                                    {tenant?.profile?.contactInfo?.whatsapp && (
                                        <div className="bg-white/5 p-6 border-l-4 border-[#ff0080] hover:bg-[#ff0080]/5 hover:translate-x-3 transition-all">
                                            <div className="text-[10px] text-[#ff0080] uppercase font-bold tracking-[0.3em] mb-2">WhatsApp Direct</div>
                                            <div className="bebas text-3xl">{tenant.profile.contactInfo.whatsapp}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute -inset-10 bg-[#00fff5]/20 blur-[100px] rounded-full animate-pulse" />
                                <div className="relative border-2 border-white/10 p-2 bg-[#050508]">
                                    <img
                                        src={tenant?.profile?.photoUrl ? (tenant.profile.photoUrl.startsWith('/') ? `http://localhost:3001${tenant.profile.photoUrl}` : tenant.profile.photoUrl) : `https://images.unsplash.com/photo-1557683316-973673baf926?w=800`}
                                        alt=""
                                        className="w-full hover:scale-105 transition-all duration-700"
                                    />
                                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#050508] to-transparent" />
                                    <div className="absolute bottom-6 left-6 bebas text-4xl">COMMANDER PROFILE</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-20 border-t border-[#00fff5]/20 bg-[#0a0a0f] text-center outfit">
                <div className="flex justify-center gap-6 mb-10">
                    {['📷', '🐦', '📘', '🎵'].map((icon, i) => (
                        <a
                            key={i}
                            href="#"
                            className="w-14 h-14 bg-[#00fff5]/10 border-2 border-[#00fff5]/30 flex items-center justify-center text-2xl hover:bg-[#00fff5] hover:text-[#0a0a0f] transition-all"
                        >
                            {icon}
                        </a>
                    ))}
                </div>
                <p className="text-white/40 text-sm font-bold uppercase tracking-[0.2em] mb-2">
                    © 2026 {tenant?.name || 'Neon Nights'}. System Operational.
                </p>
                <p className="text-[10px] text-white/20 uppercase tracking-[0.5em]">
                    Powered by NightLink Industrial Encryption
                </p>
            </footer>
        </div>
    );
}
