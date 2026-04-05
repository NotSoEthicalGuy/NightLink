import { motion } from "framer-motion";
import React from "react";

interface VaultoryHeroProps {
    logo: React.ReactNode;
    title: string;
    subtitle: string;
    description: string;
    emailPlaceholder?: string;
    ctaButton?: {
        label: string;
        onClick: () => void;
    };
    navItems?: Array<{ label: string; onClick: () => void }>;
    authButtons?: {
        login: { label: string; onClick: () => void };
        signup: { label: string; onClick: () => void };
    };
    cryptoCoins?: Array<{
        icon: React.ReactNode;
        size: number;
        position: { x: string; y: string };
        delay: number;
    }>;
    brands?: Array<{ name: string; logo: React.ReactNode }>;
    walletImage?: React.ReactNode;
    className?: string;
}

export default function VaultoryHero({
    logo,
    title,
    subtitle,
    description,
    emailPlaceholder = "name@email.com",
    ctaButton,
    navItems = [],
    authButtons,
    cryptoCoins = [],
    brands = [],
    walletImage,
    className = "",
}: VaultoryHeroProps) {
    return (
        <section
            className={`relative min-h-screen w-full overflow-hidden ${className}`}
            style={{
                background: "linear-gradient(180deg, #000000 0%, #0a0a1f 25%, #1a1a3e 50%, #4a3f8f 75%, #b5a3d9 100%)",
            }}
        >
            {/* Navigation */}
            <nav className="absolute top-0 left-0 right-0 z-50 border-b border-zinc-800/80 bg-black/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {logo}
                    </motion.div>

                    {/* Nav Items */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="hidden md:flex items-center gap-8"
                    >
                        {navItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={item.onClick}
                                className="text-xs tracking-[0.08em] uppercase text-zinc-400 hover:text-zinc-200 transition-colors"
                            >
                                {item.label}
                            </button>
                        ))}
                    </motion.div>

                    {/* Auth Buttons */}
                    {authButtons && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex items-center gap-4"
                        >
                            <button
                                onClick={authButtons.login.onClick}
                                className="text-xs tracking-[0.08em] uppercase text-zinc-400 hover:text-zinc-200 transition-colors"
                            >
                                {authButtons.login.label}
                            </button>
                            <button
                                onClick={authButtons.signup.onClick}
                                className="h-9 px-6 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-50 hover:bg-zinc-900/80 transition-all text-sm font-medium"
                            >
                                {authButtons.signup.label}
                            </button>
                        </motion.div>
                    )}
                </div>
            </nav>

            {/* Radial Glow Effect */}
            <motion.div
                className="absolute"
                style={{
                    top: "20%",
                    left: "30%",
                    width: "800px",
                    height: "800px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
                    filter: "blur(100px)",
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Content Container */}
            <div className="relative z-10 min-h-screen flex items-center px-6 py-20">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="space-y-8"
                    >
                        {/* Title */}
                        <h1
                            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                            style={{
                                fontFamily: "Inter, sans-serif",
                                color: "#FFFFFF",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            {title}
                            <br />
                            <span style={{ color: "#3b82f6" }}>{subtitle}</span>
                        </h1>

                        {/* Description */}
                        <p
                            className="text-lg md:text-xl max-w-xl"
                            style={{
                                fontFamily: "Inter, sans-serif",
                                color: "rgba(255, 255, 255, 0.7)",
                                lineHeight: "1.7",
                            }}
                        >
                            {description}
                        </p>

                        {/* Email Input & CTA */}
                        {ctaButton && (
                            <div className="flex items-center gap-4 max-w-md">
                                <input
                                    type="email"
                                    placeholder={emailPlaceholder}
                                    className="flex-1 px-5 py-3.5 rounded-lg text-white placeholder:text-white/40 outline-none"
                                    style={{
                                        background: "rgba(255, 255, 255, 0.1)",
                                        backdropFilter: "blur(10px)",
                                        border: "1px solid rgba(255, 255, 255, 0.2)",
                                        fontFamily: "Inter, sans-serif",
                                    }}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={ctaButton.onClick}
                                    className="px-8 py-3.5 rounded-lg font-semibold transition-all"
                                    style={{
                                        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                                        color: "#ffffff",
                                        fontFamily: "Inter, sans-serif",
                                        boxShadow: "0 8px 32px rgba(59, 130, 246, 0.4)"
                                    }}
                                >
                                    {ctaButton.label}
                                </motion.button>
                            </div>
                        )}
                    </motion.div>

                    {/* Right Content - Wallet & Coins */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="relative h-[500px]"
                    >
                        {/* Modern Feature Cards Mockup */}
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Main Card - Event Dashboard */}
                            <motion.div
                                className="absolute w-80 h-64 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-zinc-700/50 shadow-2xl overflow-hidden"
                                style={{
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                }}
                                initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                transition={{ duration: 0.8, delay: 0.7 }}
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                            <span className="text-white text-xl">🎉</span>
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold text-sm">Event Tonight</p>
                                            <p className="text-gray-400 text-xs">Club Paradise</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                            <span className="text-gray-300 text-xs">Guest List</span>
                                            <span className="text-blue-400 font-bold text-sm">247</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                            <span className="text-gray-300 text-xs">Tables Booked</span>
                                            <span className="text-purple-400 font-bold text-sm">12</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                            <span className="text-gray-300 text-xs">Revenue</span>
                                            <span className="text-green-400 font-bold text-sm">$8.2k</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Stat Card - Top Right */}
                            <motion.div
                                className="absolute w-40 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-xl p-4"
                                style={{
                                    top: '10%',
                                    right: '5%',
                                }}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{
                                    opacity: 1,
                                    y: [0, -10, 0],
                                }}
                                transition={{
                                    opacity: { duration: 0.6, delay: 0.9 },
                                    y: {
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }
                                }}
                            >
                                <p className="text-blue-200 text-xs font-medium">This Month</p>
                                <p className="text-white text-2xl font-bold mt-1">1,234</p>
                                <p className="text-blue-100 text-xs">Total Guests</p>
                            </motion.div>

                            {/* Floating Check-in Card - Bottom Left */}
                            <motion.div
                                className="absolute w-36 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-xl p-3"
                                style={{
                                    bottom: '15%',
                                    left: '10%',
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: 1,
                                    y: [0, 10, 0],
                                }}
                                transition={{
                                    opacity: { duration: 0.6, delay: 1.1 },
                                    y: {
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                        <span className="text-white text-sm">📱</span>
                                    </div>
                                    <div>
                                        <p className="text-purple-100 text-xs">QR Check-in</p>
                                        <p className="text-white text-sm font-bold">Active</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Website Design Card - Top Left */}
                            <motion.div
                                className="absolute w-44 h-28 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl shadow-xl p-4"
                                style={{
                                    top: '20%',
                                    left: '0%',
                                }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{
                                    opacity: 1,
                                    x: [0, -8, 0],
                                    rotate: [0, -2, 0],
                                }}
                                transition={{
                                    opacity: { duration: 0.6, delay: 1.3 },
                                    x: {
                                        duration: 3.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    },
                                    rotate: {
                                        duration: 3.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }
                                }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                        <span className="text-white text-sm">🎨</span>
                                    </div>
                                    <p className="text-emerald-100 text-xs font-medium">Custom Design</p>
                                </div>
                                <p className="text-white text-sm font-bold">Build Your</p>
                                <p className="text-white text-sm font-bold">Own Website</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Brand Logos */}
            {brands.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="absolute bottom-12 left-0 right-0 z-20"
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-center justify-center gap-12 flex-wrap opacity-40">
                            {brands.map((brand, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ opacity: 1, scale: 1.1 }}
                                    className="transition-all"
                                >
                                    {brand.logo}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </section>
    );
}
