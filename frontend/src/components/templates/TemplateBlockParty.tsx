import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function TemplateBlockParty({ config, tenant, events }: any) {
    const contact = tenant?.profile?.contactInfo || {};

    return (
        <div className="min-h-screen bg-[#fff8f0] text-[#2d3436] font-sans selection:bg-[#ff6b6b] selection:text-white">
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Poppins:wght@400;600;800&display=swap');
                
                :root {
                    --coral: #ff6b6b;
                    --sunshine: #ffd93d;
                    --ocean: #4ecdc4;
                    --grape: #a06cd5;
                    --lime: #6bcf7f;
                }

                .fredoka { font-family: 'Fredoka', sans-serif; }
                .poppins { font-family: 'Poppins', sans-serif; }

                .blob {
                    position: absolute;
                    border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
                    opacity: 0.7;
                    animation: morph 20s ease-in-out infinite;
                }

                @keyframes morph {
                    0%, 100% {
                        border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
                        transform: rotate(0deg) scale(1);
                    }
                    25% {
                        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                        transform: rotate(90deg) scale(1.1);
                    }
                    50% {
                        border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
                        transform: rotate(180deg) scale(0.9);
                    }
                    75% {
                        border-radius: 60% 30% 40% 70% / 40% 70% 50% 30%;
                        transform: rotate(270deg) scale(1.05);
                    }
                }

                .ticket-card {
                    box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.1);
                }

                .ticket-card:hover {
                    transform: translate(-3px, -3px);
                    box-shadow: 11px 11px 0 rgba(0, 0, 0, 0.1);
                }

                .btn-bounce:hover {
                    transform: translate(-3px, -3px);
                    box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.1);
                }
            ` }} />

            {/* Navigation */}
            <nav className="py-6 px-[5%] flex justify-between items-center relative z-[100] poppins">
                <div className="fredoka text-3xl font-bold text-[#ff6b6b] -rotate-2">
                    {tenant?.name || 'BLOCK PARTY'} 🎉
                </div>
                <ul className="hidden md:flex gap-10 font-bold text-sm">
                    <li><a href="#events" className="hover:text-[#ff6b6b] transition-all relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-1 after:bg-[#ff6b6b] after:rounded-full hover:after:w-full after:transition-all">Events</a></li>
                    <li><a href="#lineup" className="hover:text-[#4ecdc4] transition-all relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-1 after:bg-[#4ecdc4] after:rounded-full hover:after:w-full after:transition-all">Lineup</a></li>
                    <li><a href="#about" className="hover:text-[#ffd93d] transition-all relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-1 after:bg-[#ffd93d] after:rounded-full hover:after:w-full after:transition-all">About</a></li>
                </ul>
            </nav>

            {/* Hero Section */}
            <section className="min-h-[90vh] px-[5%] py-16 relative overflow-hidden poppins">
                <div className="blob w-[400px] h-[400px] bg-gradient-to-br from-[#ff6b6b] to-[#ffd93d] -top-20 -right-20" />
                <div className="blob w-[350px] h-[350px] bg-gradient-to-br from-[#4ecdc4] to-[#6bcf7f] -bottom-20 -left-20 [animation-delay:5s]" />

                <div className="relative z-10 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="bg-[#ffd93d] text-[#2d3436] font-bold text-sm px-6 py-3 rounded-full inline-block shadow-[4px_4px_0_rgba(0,0,0,0.1)] -rotate-2 mb-10"
                    >
                        NIGHTLINK EXCLUSIVE • GOOD VIBES ONLY
                    </motion.div>

                    <h1 className="fredoka text-[clamp(50px,10vw,120px)] font-bold leading-[1.1] mb-8">
                        <span className="text-[#ff6b6b] block">Summer</span>
                        <span className="text-[#4ecdc4] block">Vibes</span>
                        <span className="text-[#a06cd5] block">Network</span>
                    </h1>

                    <p className="text-[clamp(20px,3vw,30px)] font-semibold mb-12 max-w-2xl leading-snug">
                        {tenant?.profile?.tagline || 'Music, community, art & pure summer energy.'}
                    </p>

                    <div className="flex flex-wrap gap-10 mb-14">
                        {[
                            { icon: '📅', label: 'NEXT UP', value: events[0]?.name || 'TBA', bg: '#ff6b6b' },
                            { icon: '📍', label: 'WHERE', value: 'Downtown Hub', bg: '#4ecdc4' },
                            { icon: '🕐', label: 'ACTIVE', value: '2PM - CLOSE', bg: '#ffd93d' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-[4px_4px_0_rgba(0,0,0,0.1)]" style={{ background: item.bg }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{item.label}</div>
                                    <div className="text-lg font-extrabold">{item.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-5">
                        <a href="#events" className="px-10 py-5 bg-[#ff6b6b] text-white font-black uppercase text-sm rounded-full btn-bounce shadow-[5px_5px_0_rgba(0,0,0,0.1)] transition-all">
                            Browse Events 🎊
                        </a>
                        <a href="#about" className="px-10 py-5 bg-white border-4 border-[#2d3436] text-[#2d3436] font-black uppercase text-sm rounded-full btn-bounce shadow-[4px_4px_0_rgba(0,0,0,0.1)] transition-all">
                            Our Story
                        </a>
                    </div>
                </div>
            </section>

            {/* Event Cards Section */}
            {config.sectionsVisibility?.events?.visible && (
                <section id="events" className="py-24 px-[5%] bg-gradient-to-br from-[#4ecdc4] to-[#6bcf7f] relative poppins">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="fredoka text-[clamp(40px,7vw,70px)] text-white font-bold tracking-tight">Upcoming Parties</h2>
                            <p className="text-xl text-white/90 font-medium">Grab your spot and join the collective!</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {events.map((event: any, i: number) => (
                                <motion.div
                                    key={event.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white rounded-[40px] p-10 ticket-card border-t-8 border-[#ff6b6b] relative overflow-hidden"
                                >
                                    <div className="text-5xl mb-6">
                                        {['🌞', '🍹', '🎈', '🎸', '🎨'][i % 5]}
                                    </div>
                                    <h3 className="fredoka text-3xl font-bold mb-3">{event.name}</h3>
                                    <div className="text-5xl font-black text-[#6bcf7f] mb-8">
                                        {event.eventTime}
                                        <span className="text-sm font-bold text-gray-400 block ml-1 uppercase">Door Time</span>
                                    </div>
                                    <ul className="mb-10 space-y-4 font-semibold text-gray-600">
                                        <li className="flex items-center gap-3">
                                            <span className="text-[#6bcf7f] text-xl font-black">✓</span>
                                            {new Date(event.eventDate).toLocaleDateString()}
                                        </li>
                                        <li className="flex items-start gap-3 line-clamp-2">
                                            <span className="text-[#6bcf7f] text-xl font-black mt-[-4px]">✓</span>
                                            {event.description}
                                        </li>
                                    </ul>
                                    <Link
                                        to={`/pr/${tenant.slug}/event/${event.id}`}
                                        className="block w-full text-center py-5 bg-[#ff6b6b] text-white font-black uppercase text-sm rounded-full shadow-[5px_5px_0_rgba(0,0,0,0.1)] hover:bg-[#ff4d4d] transition-all"
                                    >
                                        Get Passes Now
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Gallery Section */}
            {config.sectionsVisibility?.gallery?.visible && (
                <section id="gallery" className="py-24 px-[5%] bg-white poppins">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="fredoka text-[clamp(40px,7vw,70px)] text-[#ff6b6b] font-bold tracking-tight">Vibe Checks</h2>
                            <p className="text-xl text-gray-500 font-medium">Recaps of our previous gatherings!</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ rotate: i % 2 === 0 ? 3 : -3, scale: 1.05 }}
                                    className={`aspect-square rounded-3xl flex items-center justify-center text-4xl shadow-xl transition-all ${i === 1 ? 'bg-[#ff6b6b]/10' : i === 2 ? 'bg-[#4ecdc4]/10' : i === 3 ? 'bg-[#ffd93d]/10' : 'bg-[#a06cd5]/10'}`}
                                >
                                    {['📸', '🛹', '🍕', '🎡'][i - 1]}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* About Section */}
            {config.sectionsVisibility?.about?.visible && (
                <section id="about" className="py-24 px-[5%] bg-[#fff8f0] poppins">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="fredoka text-6xl font-bold mb-8 text-[#a06cd5]">Community First</h2>
                            <div className="space-y-6 text-xl text-gray-700 leading-relaxed font-medium capitalize">
                                <p className="text-[#ff6b6b] fredoka text-2xl mb-10 italic">
                                    "{tenant?.profile?.bio || 'We bring the summer heat to the streets.'}"
                                </p>
                                <p>
                                    This isn't just a list of events—it's a movement. We believe in the power
                                    of gathering, the joy of discovery, and the magic of a perfectly curated
                                    playlist.
                                </p>
                                <div className="grid grid-cols-2 gap-6 pt-10">
                                    <div className="bg-[#4ecdc4]/10 p-6 rounded-[30px] border-b-8 border-[#4ecdc4]">
                                        <div className="text-3xl mb-2">📞</div>
                                        <div className="text-sm font-bold opacity-60 m-auto">HOTLINE</div>
                                        <div className="font-black m-auto">{contact.whatsapp || 'N/A'}</div>
                                    </div>
                                    <div className="bg-[#ffd93d]/10 p-6 rounded-[30px] border-b-8 border-[#ffd93d]">
                                        <div className="text-3xl mb-2">📧</div>
                                        <div className="text-sm font-bold opacity-6 m-auto">INBOX</div>
                                        <div className="font-black m-auto overflow-hidden text-ellipsis">{tenant?.email?.split('@')[0]}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-[#ff6b6b] rounded-[60px] rotate-3" />
                            <div className="relative bg-white p-4 rounded-[60px] shadow-2xl overflow-hidden -rotate-3 transition-transform hover:rotate-0 duration-500">
                                <img src={tenant?.profile?.photoUrl || `https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800`} alt="" className="w-full rounded-[48px]" />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-20 px-[5%] bg-[#2d3436] text-white text-center poppins">
                <div className="flex justify-center gap-6 mb-12">
                    {[
                        { icon: '📷', bg: '#ff6b6b' },
                        { icon: '🐦', bg: '#4ecdc4' },
                        { icon: '📘', bg: '#ffd93d' },
                        { icon: '🎵', bg: '#a06cd5' }
                    ].map((item, i) => (
                        <a
                            key={i}
                            href="#"
                            className="w-16 h-16 rounded-[20px] flex items-center justify-center text-3xl shadow-[5px_5px_0_rgba(0,0,0,0.2)] hover:scale-110 transition-all font-bold"
                            style={{ background: item.bg }}
                        >
                            {item.icon}
                        </a>
                    ))}
                </div>
                <div className="fredoka text-4xl font-bold mb-4">{tenant?.name || 'BLOCK PARTY'} 🎉</div>
                <p className="opacity-40 text-sm font-bold uppercase tracking-[4px] mb-2">© 2026 {tenant?.name}. Stay Golden.</p>
                <p className="opacity-20 text-[10px] uppercase font-black tracking-[8px]">Powered by NightLink</p>
            </footer>
        </div>
    );
}
