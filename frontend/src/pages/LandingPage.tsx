import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import {
    Moon, Menu, X, Check, ChevronDown, Monitor,
    BarChart3, Users, QrCode, DollarSign, Star,
    ArrowRight, Globe, Layout, ShieldCheck, Lock
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import {
    LayoutDashboard,
    Palette,
    LogOut,
} from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuthStore();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [faqExpanded, setFaqExpanded] = useState<number | null>(0);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    // Scroll listener for sticky nav
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to section helper
    const scrollTo = (id: string) => {
        setMobileMenuOpen(false);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen font-sans bg-white text-brand-dark selection:bg-brand-primary/20 selection:text-brand-primary">
            {/* 1. NAVIGATION BAR */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-sm py-4' : 'bg-transparent py-6'
                }`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
                    {/* Logo */}
                    <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <Logo gold={scrolled} size="42" />
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <button onClick={() => scrollTo('templates')} className="text-brand-gray hover:text-brand-primary font-medium transition-colors">Templates</button>
                        <button onClick={() => scrollTo('features')} className="text-brand-gray hover:text-brand-primary font-medium transition-colors">Features</button>
                        <button onClick={() => scrollTo('pricing')} className="text-brand-gray hover:text-brand-primary font-medium transition-colors">Pricing</button>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated ? (
                            <div className="relative flex items-center gap-3">
                                {/* Dropdown Menu */}
                                <div 
                                    className="relative group"
                                    onMouseEnter={() => setIsUserMenuOpen(true)}
                                    onMouseLeave={() => setIsUserMenuOpen(false)}
                                >
                                    <button 
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="bg-brand-dark/5 hover:bg-brand-dark/10 text-brand-dark px-5 py-2.5 rounded-full font-bold transition-all flex items-center gap-2 border border-brand-dark/10"
                                    >
                                        Hi, {user?.name.split(' ')[0]}
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 py-2"
                                            >
                                                <button
                                                    onClick={() => navigate(user?.isSubscribed ? '/editor' : '/subscription')}
                                                    className="w-full px-5 py-3 hover:bg-gray-50 flex items-center gap-3 text-brand-dark font-bold transition-colors text-sm"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                                                        <Palette className="w-4 h-4" />
                                                    </div>
                                                    Website Editor
                                                </button>
                                                
                                                <button
                                                    onClick={() => navigate(user?.isSubscribed ? '/dashboard' : '/subscription')}
                                                    className="w-full px-5 py-3 hover:bg-gray-50 flex items-center gap-3 text-brand-gray font-bold transition-colors text-sm"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                        <LayoutDashboard className="w-4 h-4" />
                                                    </div>
                                                    Dashboard
                                                </button>

                                                <div className="h-px bg-gray-100 my-1 mx-2" />

                                                <button
                                                    onClick={logout}
                                                    className="w-full px-5 py-3 hover:bg-red-50 flex items-center gap-3 text-red-500 font-bold transition-colors text-sm"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                                                        <LogOut className="w-4 h-4" />
                                                    </div>
                                                    Sign Out
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Profile Picture */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 border-2 border-brand-primary p-0.5 shadow-md flex-shrink-0 group cursor-pointer" onClick={() => navigate('/settings')}>
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-brand-primary overflow-hidden">
                                        {user?.photoUrl ? (
                                            <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{user?.name.charAt(0)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <button onClick={() => navigate('/login')} className="text-brand-primary font-semibold hover:text-brand-primary/80 transition-colors px-4 py-2">
                                    Sign In
                                </button>
                                <button onClick={() => navigate('/signup')} className="bg-brand-dark text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:bg-black hover:-translate-y-0.5 transition-all">
                                    Get Started
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden text-brand-dark p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 p-6 flex flex-col gap-6 md:hidden"
                        >
                            <div className="flex flex-col gap-4">
                                <button onClick={() => scrollTo('templates')} className="text-left text-lg font-medium text-brand-dark">Templates</button>
                                <button onClick={() => scrollTo('features')} className="text-left text-lg font-medium text-brand-dark">Features</button>
                                <button onClick={() => scrollTo('pricing')} className="text-left text-lg font-medium text-brand-dark">Pricing</button>
                            </div>
                            <div className="h-px bg-gray-100 w-full" />
                            <div className="flex flex-col gap-3">
                                {isAuthenticated ? (
                                    <>
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-2">
                                            <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-lg">
                                                {user?.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-brand-dark">Hi, {user?.name}</p>
                                                <p className="text-xs text-zinc-500">{user?.email}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => { setMobileMenuOpen(false); navigate(user?.isSubscribed ? '/editor' : '/subscription'); }} className="w-full py-4 bg-purple-50 text-purple-600 font-bold rounded-xl flex items-center justify-center gap-3 border border-purple-100 shadow-sm transition-all active:scale-95">
                                            <Palette className="w-5 h-5" />
                                            Website Editor
                                        </button>
                                        <button onClick={() => { setMobileMenuOpen(false); navigate(user?.isSubscribed ? '/dashboard' : '/subscription'); }} className="w-full py-4 bg-brand-dark text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95">
                                            <LayoutDashboard className="w-5 h-5" />
                                            Dashboard
                                        </button>
                                        <button onClick={() => { setMobileMenuOpen(false); logout(); }} className="w-full py-3 text-red-500 font-bold flex items-center justify-center gap-2 mt-2">
                                            <LogOut className="w-5 h-5" />
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => navigate('/login')} className="w-full py-3 text-brand-primary font-semibold border-2 border-brand-primary rounded-lg">Sign In</button>
                                        <button onClick={() => navigate('/signup')} className="w-full py-3 bg-brand-primary text-white font-semibold rounded-lg shadow-md">Get Started Free</button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* 2. HERO SECTION */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden harmony-gradient min-h-[90vh] flex items-center">
                {/* Subtle gradient background accent */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-brand-primary/5 via-brand-accent/5 to-transparent rounded-full blur-3xl opacity-40 pointer-events-none -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-brand-accent/5 to-transparent rounded-full blur-3xl opacity-30 pointer-events-none translate-y-1/3 -translate-x-1/3" />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    {/* Left Column - Content */}
                    <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary font-medium text-sm mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                            No Commission • Keep 100% of Sales
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl sm:text-6xl lg:text-[64px] font-extrabold text-brand-dark leading-[1.1] tracking-tight mb-6"
                        >
                            Your Events,<br className="hidden sm:block" /> Your Website,<br className="hidden sm:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Your Success</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg sm:text-xl text-brand-gray mb-10 leading-relaxed"
                        >
                            Create stunning event websites and sell tickets online. Built specifically for nightclub promoters who want full control—zero commission.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            {!isAuthenticated ? (
                                <>
                                    <button onClick={() => navigate('/signup')} className="bg-brand-primary text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-[0_4px_24px_rgba(93,74,224,0.4)] hover:bg-brand-primary/95 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
                                        Start Free Trial
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button onClick={() => scrollTo('features')} className="bg-transparent border-2 border-brand-gray/20 text-brand-dark hover:border-brand-primary hover:text-brand-primary px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2">
                                        <Monitor className="w-5 h-5" />
                                        See How It Works
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => navigate(user?.isSubscribed ? '/dashboard' : '/subscription')} className="bg-brand-primary text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-[0_10px_30px_rgba(93,74,224,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-3 group">
                                    {user?.isSubscribed ? 'Enter My Dashboard' : 'Unlock Pro Access Now'}
                                    {!user?.isSubscribed ? <Lock className="w-6 h-6" /> : <ArrowRight className="w-6 h-6 group-hover:translate-x-1" />}
                                </button>
                            )}
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap justify-center lg:justify-start gap-8 sm:gap-12"
                        >
                            <div className="flex flex-col gap-1">
                                <span className="text-2xl font-bold text-brand-dark">500+</span>
                                <span className="text-sm font-medium text-brand-gray">Active Promoters</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-2xl font-bold text-brand-dark">2M+</span>
                                <span className="text-sm font-medium text-brand-gray">Tickets Sold</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <span className="text-2xl font-bold text-brand-dark">4.9</span>
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                                <span className="text-sm font-medium text-brand-gray">User Rating</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Visual Mockup built with Tailwind */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="relative hidden lg:block w-full h-full min-h-[500px] perspective-1000"
                        style={{ perspective: '1000px' }}
                    >
                        {/* Laptop Mockup */}
                        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[120%] h-auto rounded-xl shadow-2xl overflow-hidden bg-white border border-gray-200 transition-transform duration-500 hover:rotate-0 rotate-y-[-12deg] rotate-x-[5deg] origin-right" style={{ transform: 'rotateY(-12deg) rotateX(5deg)' }}>
                            {/* Browser Header */}
                            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="mx-4 flex-1 bg-white rounded-md py-1.5 px-3 flex items-center gap-2 text-xs text-gray-400 shadow-sm">
                                    <Globe className="w-3 h-3" />
                                    <span>nightlink.vip/neon-nights</span>
                                </div>
                            </div>
                            {/* Website Preview */}
                            <div className="bg-[#0f0f15] aspect-[16/10] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-blue-900/40" />
                                {/* Event Page Header */}
                                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
                                    <div className="text-white font-bold text-xl tracking-wider">NEON</div>
                                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-semibold">TICKETS</div>
                                </div>
                                {/* Event Content */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full z-10">
                                    <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4 tracking-tighter">UNDERGROUND</h2>
                                    <p className="text-gray-300 text-sm mb-6 flex items-center justify-center gap-4">
                                        <span>Friday, Sep 24</span>
                                        <span className="w-1 h-1 rounded-full bg-white" />
                                        <span>Warehouse 4A</span>
                                    </p>
                                    <button className="bg-cyan-500 text-black px-8 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,217,255,0.4)]">
                                        Buy Tickets - $25
                                    </button>
                                </div>
                                {/* Image accent */}
                                <img src="https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?auto=format&fit=crop&q=80&w=800" alt="Club" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50" />
                            </div>
                        </div>

                        {/* Mobile Phone Mockup (Floating) */}
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="absolute -bottom-10 -left-12 w-[180px] h-[380px] bg-white rounded-[2rem] shadow-2xl p-2 border-4 border-gray-900 overflow-hidden z-20"
                        >
                            <div className="w-full h-full rounded-[1.5rem] bg-gray-50 overflow-hidden relative flex flex-col">
                                {/* Dashboard App View */}
                                <div className="bg-brand-primary p-4 pb-6 text-white text-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="font-bold">Dashboard</span>
                                        <div className="w-6 h-6 rounded-full bg-white/20" />
                                    </div>
                                    <div className="text-white/70 text-xs">Total Sales Today</div>
                                    <div className="text-2xl font-bold mt-1">$4,250.00</div>
                                </div>
                                <div className="flex-1 p-3 flex flex-col gap-3 -mt-3 relative z-10">
                                    {/* Stat card */}
                                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                                <DollarSign className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-gray-500">Tickets (214)</div>
                                                <div className="font-bold text-xs">+$1,850</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Chart mock */}
                                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col">
                                        <div className="text-[10px] text-gray-500 mb-2">Live Activity</div>
                                        <div className="flex-1 flex items-end justify-between gap-1 pb-1">
                                            {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                                                <div key={i} className="w-full bg-brand-primary/20 rounded-t-sm" style={{ height: `${h}%` }}>
                                                    {i === 6 && <div className="w-full h-full bg-brand-primary rounded-t-sm" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* 3. SOCIAL PROOF SECTION */}
            <section className="harmony-bg py-12 border-y border-gray-200/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <p className="text-sm font-semibold text-brand-gray uppercase tracking-wider mb-8">
                        Trusted by the nightlife industry's best promoters & venues
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder Logos */}
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex items-center gap-2 font-black text-xl text-brand-dark/80 tracking-tighter hover:text-brand-primary transition-colors cursor-default">
                                <div className="w-6 h-6 rounded bg-brand-dark/20 flex items-center justify-center -rotate-12">
                                    <div className="w-3 h-3 bg-white" />
                                </div>
                                VENUE {i}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. PROBLEM/SOLUTION SECTION */}
            <section id="why" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-2xl mx-auto mb-16"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
                            The old way of selling tickets is broken.
                        </h2>
                        <p className="text-lg text-brand-gray">
                            Stop giving away your hard-earned revenue and settling for generic pages.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0 }}
                            className="bg-white border text-center border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                                    <X className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-brand-dark mb-2">High Commission Fees</h3>
                                <p className="text-brand-gray text-sm mb-6">Platforms eating 20-30% of your profits on every sale.</p>

                                <div className="w-px h-8 bg-gray-200 my-2" />

                                <div className="w-16 h-16 bg-brand-success/10 text-brand-success rounded-2xl flex items-center justify-center my-6 group-hover:scale-110 transition-transform">
                                    <Check className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-brand-dark mb-2">Zero Commission</h3>
                                <p className="text-brand-gray text-sm">Keep every single dollar you earn. Just pay a flat monthly fee.</p>
                            </div>
                        </motion.div>

                        {/* Card 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white border text-center border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                                    <Layout className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-brand-dark mb-2">Generic Event Pages</h3>
                                <p className="text-brand-gray text-sm mb-6">Boring pages that look identical to every other promoter's.</p>

                                <div className="w-px h-8 bg-gray-200 my-2" />

                                <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center my-6 group-hover:scale-110 transition-transform">
                                    <Palette className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-brand-dark mb-2">Stunning Custom Vibes</h3>
                                <p className="text-brand-gray text-sm">Beautifully designed templates that match your brand perfectly.</p>
                            </div>
                        </motion.div>

                        {/* Card 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white border text-center border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                                    <Users className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-brand-dark mb-2">Messy Guest Lists</h3>
                                <p className="text-brand-gray text-sm mb-6">Paper lists, long lines, and disorganized entry processes.</p>

                                <div className="w-px h-8 bg-gray-200 my-2" />

                                <div className="w-16 h-16 bg-brand-accent/10 text-brand-accent rounded-2xl flex items-center justify-center my-6 group-hover:scale-110 transition-transform">
                                    <QrCode className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-brand-dark mb-2">Digital Check-in</h3>
                                <p className="text-brand-gray text-sm">Instant QR code scanning and real-time attendance tracking.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 5. FEATURE SHOWCASE */}
            <section id="features" className="py-24 harmony-bg overflow-hidden relative">
                {/* 5A. Website Builder */}
                <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-2 lg:order-1 relative"
                        >
                            {/* Builder UI Mockup */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 p-3 border-b border-gray-200 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                                        <div className="w-32 h-8 bg-gray-200 rounded-lg" />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-24 h-8 bg-brand-primary rounded-lg" />
                                    </div>
                                </div>
                                <div className="flex h-80">
                                    {/* Sidebar */}
                                    <div className="w-48 bg-gray-50 border-r border-gray-200 p-4 space-y-4">
                                        <div className="w-full h-8 bg-gray-200 rounded" />
                                        <div className="w-3/4 h-8 bg-gray-200 rounded" />
                                        <div className="w-full h-8 bg-gray-200 rounded" />
                                        <div className="w-5/6 h-8 bg-gray-200 rounded" />
                                    </div>
                                    {/* Preview */}
                                    <div className="flex-1 p-6 bg-gray-100 flex items-center justify-center">
                                        <div className="w-full max-w-sm aspect-video bg-white rounded shadow-sm flex flex-col items-center justify-center p-4">
                                            <div className="w-16 h-16 rounded-full bg-brand-accent/20 mb-4" />
                                            <div className="w-3/4 h-6 bg-gray-200 rounded mb-2" />
                                            <div className="w-1/2 h-4 bg-gray-100 rounded" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1 lg:order-2 lg:pl-12"
                        >
                            <span className="text-brand-primary font-bold tracking-wider text-sm uppercase mb-4 block">Beautiful Templates</span>
                            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-6">Stunning Event Pages That Match Your Brand</h2>
                            <p className="text-brand-gray text-lg mb-8">
                                Choose from our professionally designed templates—from underground raves to upscale lounges. Customize everything: colors, fonts, images, layout. No coding needed.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    '10+ premium templates out of the box',
                                    'Visual drag-and-drop customization',
                                    'Automatically mobile-optimized',
                                    'Custom domains supported (yourname.com)'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-brand-success/10 text-brand-success flex items-center justify-center flex-shrink-0">
                                            <Check className="w-4 h-4 text-brand-success font-bold" />
                                        </div>
                                        <span className="text-brand-dark font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => scrollTo('templates')} className="text-brand-primary font-semibold hover:text-brand-primary/80 flex items-center gap-2 group">
                                Browse Templates <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* 5B. Ticket Selling */}
                <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:pr-12"
                        >
                            <span className="text-brand-success font-bold tracking-wider text-sm uppercase mb-4 block">Ticket Sales</span>
                            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-6">Sell Tickets. Keep 100% of Revenue.</h2>
                            <p className="text-brand-gray text-lg mb-8">
                                Most platforms take 20-30% commission. We don't. You pay a simple subscription and keep everything you earn. It's that simple.
                            </p>

                            {/* Comparison Table */}
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8 shadow-sm">
                                <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200">
                                    <div className="p-4 text-sm font-semibold text-brand-gray text-center border-r border-gray-200">Other Platforms</div>
                                    <div className="p-4 text-sm font-semibold text-brand-primary text-center">NightLink</div>
                                </div>
                                <div className="grid grid-cols-2 border-b border-gray-200">
                                    <div className="p-4 text-center border-r border-gray-200">
                                        <span className="block text-xl font-bold text-brand-dark">$700</span>
                                        <span className="text-xs text-brand-gray">from $1000 sales</span>
                                    </div>
                                    <div className="p-4 text-center bg-brand-success/5">
                                        <span className="block text-xl font-bold text-brand-success">$1000</span>
                                        <span className="text-xs text-brand-gray">from $1000 sales</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2">
                                    <div className="p-4 text-center border-r border-gray-200 text-brand-gray font-medium">10-30% Commission</div>
                                    <div className="p-4 text-center text-brand-success font-bold bg-brand-success/5">0% Commission</div>
                                </div>
                            </div>

                            <button onClick={() => scrollTo('pricing')} className="text-brand-primary font-semibold hover:text-brand-primary/80 flex items-center gap-2 group">
                                See Pricing Options <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            {/* Revenue mock */}
                            <div className="bg-brand-dark p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4">
                                    <div className="bg-brand-success text-brand-dark text-xs font-bold px-3 py-1 rounded-full animate-bounce shadow-lg shadow-brand-success/30">
                                        0% FEE
                                    </div>
                                </div>
                                <h3 className="text-white font-medium mb-1">Total Revenue</h3>
                                <div className="text-5xl font-black text-white mb-8 tracking-tight">$24,592<span className="text-gray-500 text-3xl">.00</span></div>

                                {/* Chart lines */}
                                <div className="h-40 flex items-end justify-between gap-2">
                                    {[20, 35, 25, 45, 60, 50, 80, 70, 90, 85, 100].map((h, i) => (
                                        <div key={i} className="flex-1 bg-brand-primary/30 rounded-t-sm hover:bg-brand-primary transition-colors cursor-pointer" style={{ height: `${h}%` }}></div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-4 text-gray-500 text-sm">
                                    <span>Mon</span>
                                    <span>Wed</span>
                                    <span>Fri</span>
                                    <span>Sun</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* 5C. Analytics & Control */}
                <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center text-brand-dark">
                    <span className="text-brand-accent font-bold tracking-wider text-sm uppercase mb-4 block">Insights & Control</span>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6">Know Your Numbers, Grow Your Business</h2>
                    <p className="text-brand-gray text-lg max-w-2xl mx-auto mb-16">
                        Track sales in real-time. Manage guest lists. Export data. Everything you need to run professional events and make data-driven decisions.
                    </p>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                        {[
                            { icon: BarChart3, label: "Real-time tracking" },
                            { icon: Users, label: "Guest list mgmt" },
                            { icon: QrCode, label: "QR check-in" },
                            { icon: ShieldCheck, label: "Secure payouts" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center gap-4 hover:-translate-y-1 transition-transform"
                            >
                                <div className="w-12 h-12 rounded-full bg-brand-offwhite flex items-center justify-center text-brand-primary">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <span className="font-semibold text-sm">{item.label}</span>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl shadow-xl border border-gray-200 p-2 overflow-hidden aspect-[16/9] lg:aspect-[21/9] relative max-w-4xl mx-auto flex flex-col"
                    >
                        {/* Fake Dashboard Topbar */}
                        <div className="h-12 border-b border-gray-100 flex items-center px-4 justify-between">
                            <div className="w-32 h-4 bg-gray-200 rounded" />
                            <div className="w-8 h-8 bg-brand-primary/10 rounded-full" />
                        </div>
                        <div className="flex-1 bg-gray-50 flex gap-4 p-4">
                            {/* Fake sidebar */}
                            <div className="w-48 bg-white border border-gray-200 rounded-xl hidden md:block opacity-50 space-y-3 p-4">
                                <div className="w-full h-4 bg-gray-200 rounded" />
                                <div className="w-3/4 h-4 bg-gray-200 rounded" />
                                <div className="w-5/6 h-4 bg-gray-200 rounded" />
                            </div>
                            {/* Fake Main View */}
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 h-24" />
                                    <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 h-24" />
                                    <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 h-24 hidden sm:block" />
                                </div>
                                <div className="flex-1 bg-white border border-gray-200 rounded-xl flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-primary via-transparent to-transparent" />
                                    <BarChart3 className="w-32 h-32 text-brand-primary/20" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 6. TEMPLATE SHOWCASE */}
            <section id="templates" className="py-24 bg-gradient-to-b from-white to-brand-offwhite relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-accent/5 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-16 relative z-10">
                    <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">Templates for Every Vibe</h2>
                    <p className="text-lg text-brand-gray max-w-2xl mx-auto">
                        From underground techno to rooftop jazz—we've got you covered. Start with a pro template and make it your own.
                    </p>
                </div>

                <div className="flex overflow-x-auto pb-12 pt-4 px-6 lg:px-8 gap-8 snap-x snap-mandatory hide-scrollbar relative z-10 w-full">
                    {/* Dummy padding element for left alignment in scroll */}
                    <div className="w-[10vw] flex-shrink-0 lg:hidden"></div>

                    {[
                        { name: "Neon Nights", cat: "Electronic / Rave", colors: "from-pink-500 to-purple-600" },
                        { name: "Velvet Lounge", cat: "Jazz / Upscale", colors: "from-amber-600 to-red-900" },
                        { name: "Block Party", cat: "Community / Outdoor", colors: "from-blue-400 to-emerald-400" },
                        { name: "Minimalist", cat: "Art / Gallery", colors: "from-gray-700 to-black" },
                        { name: "Summer Fest", cat: "Festival / Beach", colors: "from-orange-400 to-rose-400" },
                    ].map((tpl, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: i * 0.1 }}
                            className="flex-shrink-0 w-[300px] md:w-[400px] aspect-[4/5] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative group snap-center"
                        >
                            {/* Template visual mock */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${tpl.colors} opacity-80 group-hover:scale-105 transition-transform duration-700`} />

                            {/* Mock UI overlay */}
                            <div className="absolute inset-4 bg-black/40 backdrop-blur-[2px] rounded-xl border border-white/10 p-6 flex flex-col justify-end text-left text-white overflow-hidden group-hover:bg-black/20 transition-colors">
                                <div className="font-bold text-2xl tracking-tight mb-1">{tpl.name}</div>
                                <div className="text-sm text-white/80">{tpl.cat}</div>
                            </div>

                            {/* Hover CTA */}
                            <div className="absolute inset-0 bg-brand-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <button onClick={() => navigate(user?.isSubscribed ? '/editor' : '/subscription')} className="bg-white text-brand-dark px-6 py-3 rounded-xl font-bold translate-y-4 group-hover:translate-y-0 transition-all flex items-center gap-2">
                                    {user?.isSubscribed ? 'Use Template' : 'Unlock Premium'}
                                    {!user?.isSubscribed && <Lock className="w-4 h-4" />}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    <div className="w-[10vw] flex-shrink-0 lg:hidden"></div>
                </div>
            </section>

            {/* 7. PRICING SECTION */}
            <section id="pricing" className="py-24 bg-brand-dark text-white relative">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]" />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-lg text-gray-400 mb-16">No surprises. No commission. Cancel anytime.</p>

                    <div className="max-w-[400px] mx-auto bg-white rounded-3xl p-8 shadow-2xl relative">
                        <div className="absolute -top-4 inset-x-0 flex justify-center">
                            <span className="bg-brand-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                All Access
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold text-brand-dark mb-2">PROFESSIONAL</h3>
                        <div className="flex justify-center items-end gap-1 mb-6">
                            <span className="text-5xl font-black text-brand-dark">$29</span>
                            <span className="text-brand-gray mb-1">/month</span>
                        </div>
                        <p className="text-sm text-brand-success font-semibold mb-8 border-b border-gray-100 pb-8">
                            Or $290/year (Save $58)
                        </p>

                        <ul className="space-y-4 text-left mb-10">
                            {[
                                "Unlimited event websites",
                                "Unlimited ticket sales",
                                "All premium templates",
                                "Custom domain support",
                                "Analytics dashboard",
                                "Email support",
                                "0% commission forever"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0 text-brand-primary">
                                        <Check className="w-3 h-3 font-bold" />
                                    </div>
                                    <span className="text-brand-dark font-medium">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button onClick={() => navigate('/signup')} className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold text-lg hover:-translate-y-1 shadow-[0_4px_16px_rgba(93,74,224,0.4)] transition-all">
                            Start 14-Day Free Trial
                        </button>
                        <p className="text-xs text-brand-gray mt-4 text-center font-medium">
                            No credit card required
                        </p>
                    </div>
                </div>
            </section>

            {/* 8. TESTIMONIALS */}
            <section className="py-24 harmony-bg">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-16">Trusted by Top Promoters</h2>

                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        {[
                            { quote: "NightLink completely changed our business. We dropped Eventbrite, saved over $15,000 in fees this year, and our event pages look significantly more premium.", name: "Marcus T.", role: "Underground PR" },
                            { quote: "The template builder is incredible. I set up a fully custom, branded ticketing page in 15 minutes. The QR check-in feature at the door makes entry lightning fast.", name: "Sarah L.", role: "Event Director, Velvet" },
                            { quote: "Zero commission is a game changer. We keep every dollar we make from pre-sales. If you run weekly events, you are burning money without NightLink.", name: "David K.", role: "Club Owner" }
                        ].map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col"
                            >
                                <div className="flex gap-1 text-brand-gold mb-6">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 fill-current" />)}
                                </div>
                                <p className="text-brand-dark font-medium text-lg leading-relaxed flex-1 mb-8">
                                    "{t.quote}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-primary to-brand-accent p-[2px]">
                                        <div className="w-full h-full bg-white rounded-full border-2 border-white overflow-hidden">
                                            {/* generate fake avatar with initials */}
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-brand-primary font-bold text-sm">
                                                {t.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-brand-dark">{t.name}</div>
                                        <div className="text-sm text-brand-gray">{t.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9. FAQ SECTION */}
            <section className="py-24 bg-white">
                <div className="max-w-3xl mx-auto px-6 lg:px-8">
                    <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-12 text-center">Frequently Asked Questions</h2>

                    <div className="space-y-4">
                        {[
                            { q: "Do you take commission on ticket sales?", a: "No! You keep 100% of ticket revenue. We only charge a flat monthly or yearly subscription fee." },
                            { q: "Can I use my own domain?", a: "No. You can only use our free nightlink.vip subdomain for now, but we plan to add custom domain support in the future." },
                            { q: "Do I need coding skills?", a: "Nope! Our builder is completely visual and drag-and-drop simple. If you can use Instagram, you can build a NightLink site." },
                            { q: "How many events can I create?", a: "Unlimited. Create as many event pages as you need, all under one subscription." },
                            { q: "Can I cancel anytime?", a: "Absolutely. No contracts, no lock-in periods. You can cancel your subscription with one click." }
                        ].map((faq, i) => (
                            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                <button
                                    className="w-full px-6 py-5 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                                    onClick={() => setFaqExpanded(faqExpanded === i ? null : i)}
                                >
                                    <span className="font-semibold text-brand-dark text-lg">{faq.q}</span>
                                    <ChevronDown className={`w-5 h-5 text-brand-gray transition-transform duration-300 ${faqExpanded === i ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {faqExpanded === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden bg-brand-offwhite"
                                        >
                                            <div className="px-6 py-5 text-brand-gray border-t border-gray-200">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 10. FINAL CTA */}
            <section className="py-24 bg-gradient-to-br from-brand-primary to-brand-accent text-center px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80')] opacity-10 mix-blend-overlay bg-cover bg-center" />
                <div className="max-w-3xl mx-auto relative z-10">
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">Ready to Take Control of Your Events?</h2>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                        Join over 500 promoters who switched to NightLink and never looked back. Start building your brand today.
                    </p>
                    <button onClick={() => navigate('/signup')} className="bg-white text-brand-primary px-10 py-5 rounded-xl font-bold text-xl shadow-2xl hover:scale-105 transition-transform">
                        Start Your Free Trial
                    </button>
                    <p className="text-sm text-white/70 mt-4">
                        14 days free • No credit card required • Cancel anytime
                    </p>
                </div>
            </section>

            {/* 11. FOOTER */}
            <footer className="bg-brand-dark text-gray-400 py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4 text-white">
                                <Moon className="w-5 h-5" />
                                <span className="text-xl font-bold tracking-tight">NightLink</span>
                            </div>
                            <p className="text-sm mb-6 max-w-xs">Events Made Simple. The all-in-one platform for nightlife professionals.</p>
                            <div className="flex gap-4">
                                {/* Socials placeholders */}
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary transition-colors cursor-pointer text-white">IG</div>
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary transition-colors cursor-pointer text-white">TW</div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Product</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Resources</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                        <p>© 2026 NightLink. All rights reserved.</p>
                        <div className="flex gap-4">
                            <span>Built with ♥ for the nightlife industry</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
