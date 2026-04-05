
import {
    ArrowRight,
    Play,
    Target,
    Crown,
    Star,
    // Brand Icons
    Hexagon,
    Triangle,
    Command,
    Ghost,
    Gem,
    Cpu
} from "lucide-react";

// --- MOCK BRANDS ---
// Replaced PNGs with Lucide icons to simulate tech logos
const CLIENTS = [
    { name: "Acme Corp", icon: Hexagon },
    { name: "Quantum", icon: Triangle },
    { name: "Command+Z", icon: Command },
    { name: "Phantom", icon: Ghost },
    { name: "Ruby", icon: Gem },
    { name: "Chipset", icon: Cpu },
];

// --- SUB-COMPONENTS ---
const StatItem = ({ value, label }: { value: string; label: string }) => (
    <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default">
        <span className="text-xl font-bold text-white sm:text-2xl font-display">{value}</span>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium sm:text-xs">{label}</span>
    </div>
);

// --- MAIN COMPONENT ---
interface HeroSectionProps {
    userName?: string;
}

export default function HeroSection({ userName = "Night Owl" }: HeroSectionProps) {
    return (
        <div className="relative w-full bg-midnight text-platinum overflow-hidden font-sans">
            {/* 
        SCOPED ANIMATIONS 
      */}
            <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-marquee {
          animation: marquee 40s linear infinite; /* Slower for readability */
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>

            {/* Background Image with Gradient Mask */}
            <div
                className="absolute inset-0 z-0 bg-[url(https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=80)] bg-cover bg-center opacity-20 saturate-0"
                style={{
                    maskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
                    WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
                }}
            />

            {/* Gold Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 pt-32 pb-12 sm:px-6 md:pt-40 md:pb-20 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">

                    {/* --- LEFT COLUMN --- */}
                    <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pt-8">

                        {/* Badge */}
                        <div className="animate-fade-in delay-100">
                            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 backdrop-blur-md transition-colors hover:bg-gold/10">
                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-2">
                                    Premium Nightlife Platform
                                    <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                                </span>
                            </div>
                        </div>

                        {/* Heading */}
                        <h1
                            className="animate-fade-in delay-200 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-medium tracking-tight leading-[0.9]"
                            style={{
                                maskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)",
                                WebkitMaskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)"
                            }}
                        >
                            Welcome Back<br />
                            <span className="bg-gradient-to-r from-white via-platinum to-zinc-500 bg-clip-text text-transparent italic">
                                {userName}
                            </span><br />
                            Let's Party
                        </h1>

                        {/* Description */}
                        <p className="animate-fade-in delay-300 max-w-xl text-lg text-zinc-400 leading-relaxed font-light">
                            Your dashboard is ready. Manage events, track bookings, and grow your nightlife empire with <span className="text-white font-medium">unmatched elegance</span>.
                        </p>

                        {/* CTA Buttons */}
                        <div className="animate-fade-in delay-400 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => window.location.href = '/dashboard'}
                                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-zinc-950 transition-all hover:scale-[1.02] hover:bg-zinc-200 active:scale-[0.98] shadow-glow"
                            >
                                Enter Dashboard
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>

                            <button
                                onClick={() => window.location.href = '/profile'}
                                className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-gold/30 hover:text-gold"
                            >
                                <Play className="w-4 h-4 fill-current" />
                                View Profile
                            </button>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN --- */}
                    <div className="lg:col-span-5 space-y-6 lg:mt-12">

                        {/* Stats Card */}
                        <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-8 backdrop-blur-xl shadow-2xl">
                            {/* Card Glow Effect */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-transparent ring-1 ring-gold/20">
                                        <Target className="h-6 w-6 text-gold" />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold tracking-tight text-white font-display">500+</div>
                                        <div className="text-sm text-zinc-500">Events Created</div>
                                    </div>
                                </div>

                                {/* Progress Bar Section */}
                                <div className="space-y-3 mb-8">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Guest Satisfaction</span>
                                        <span className="text-gold font-medium">98%</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                                        <div className="h-full w-[98%] rounded-full bg-gold-gradient shadow-lg" />
                                    </div>
                                </div>

                                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                                {/* Mini Stats Grid */}
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <StatItem value="24/7" label="Bookings" />
                                    <div className="w-px h-full bg-white/5 mx-auto" />
                                    <StatItem value="Live" label="Dashboard" />
                                    <div className="w-px h-full bg-white/5 mx-auto" />
                                    <StatItem value="100%" label="Uptime" />
                                </div>

                                {/* Tag Pills */}
                                <div className="mt-8 flex flex-wrap gap-2">
                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/5 px-3 py-1 text-[10px] font-medium tracking-wide text-green-400">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        ACTIVE
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-[10px] font-medium tracking-wide text-gold">
                                        <Crown className="w-3 h-3 text-gold" />
                                        PREMIUM
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Marquee Card */}
                        <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/30 py-8 backdrop-blur-xl">
                            <h3 className="mb-6 px-8 text-xs font-bold uppercase tracking-widest text-zinc-600 text-center">Trusted by Elite Promoters</h3>

                            <div
                                className="relative flex overflow-hidden"
                                style={{
                                    maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                                    WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)"
                                }}
                            >
                                <div className="animate-marquee flex gap-12 whitespace-nowrap px-4">
                                    {/* Triple list for seamless loop */}
                                    {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2 opacity-30 transition-all hover:opacity-80 hover:scale-105 cursor-default grayscale hover:grayscale-0 group"
                                        >
                                            {/* Brand Icon */}
                                            <client.icon className="h-5 w-5 text-white fill-current group-hover:text-gold transition-colors" />
                                            {/* Brand Name */}
                                            <span className="text-lg font-bold text-white tracking-tight group-hover:text-white transition-colors">
                                                {client.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
