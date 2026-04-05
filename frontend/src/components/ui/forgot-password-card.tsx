"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Lock,
    Mail,
    ArrowLeft,
    Eye,
    EyeOff,
    RotateCcw
} from "lucide-react";
import { Logo } from "./Logo";

interface ForgotPasswordCardProps {
    onEmailSubmit?: (email: string) => Promise<void>;
    onOtpSubmit?: (otp: string) => Promise<void>;
    onResetSubmit?: (password: string) => Promise<void>;
    error?: string;
    loading?: boolean;
    onLoginClick?: () => void;
    onHomeClick?: () => void;
    step?: number;
    email?: string;
    resendCooldown?: number;
    onResendOtp?: () => void;
}

export default function ForgotPasswordCard({
    onEmailSubmit,
    onOtpSubmit,
    onResetSubmit,
    error,
    loading = false,
    onLoginClick,
    onHomeClick,
    step = 1,
    email = "",
    resendCooldown = 0,
    onResendOtp,
}: ForgotPasswordCardProps) {
    const [emailValue, setEmailValue] = useState("");
    const [otpValue, setOtpValue] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (onEmailSubmit) await onEmailSubmit(emailValue);
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (onOtpSubmit) await onOtpSubmit(otpValue);
    };

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (onResetSubmit) await onResetSubmit(newPassword);
    };

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const setSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setSize();

        type P = { x: number; y: number; v: number; o: number };
        let ps: P[] = [];
        let raf = 0;

        const make = () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            v: Math.random() * 0.25 + 0.05,
            o: Math.random() * 0.35 + 0.15,
        });

        const init = () => {
            ps = [];
            const count = Math.floor((canvas.width * canvas.height) / 9000);
            for (let i = 0; i < count; i++) ps.push(make());
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ps.forEach((p) => {
                p.y -= p.v;
                if (p.y < 0) {
                    p.x = Math.random() * canvas.width;
                    p.y = canvas.height + Math.random() * 40;
                    p.v = Math.random() * 0.25 + 0.05;
                    p.o = Math.random() * 0.35 + 0.15;
                }
                ctx.fillStyle = `rgba(250,250,250,${p.o})`;
                ctx.fillRect(p.x, p.y, 0.7, 2.2);
            });
            raf = requestAnimationFrame(draw);
        };

        const onResize = () => {
            setSize();
            init();
        };

        window.addEventListener("resize", onResize);
        init();
        raf = requestAnimationFrame(draw);
        return () => {
            window.removeEventListener("resize", onResize);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <section className="fixed inset-0 bg-obsidian text-platinum font-sans selection:bg-gold/30">
            <style>{`
        .accent-lines{position:absolute;inset:0;pointer-events:none;opacity:.7}
        .hline,.vline{position:absolute;background:#18181b;will-change:transform,opacity}
        .hline{left:0;right:0;height:1px;transform:scaleX(0);transform-origin:50% 50%;animation:drawX .8s cubic-bezier(.22,.61,.36,1) forwards}
        .vline{top:0;bottom:0;width:1px;transform:scaleY(0);transform-origin:50% 0%;animation:drawY .9s cubic-bezier(.22,.61,.36,1) forwards}
        .hline:nth-child(1){top:18%;animation-delay:.12s}
        .hline:nth-child(2){top:50%;animation-delay:.22s}
        .hline:nth-child(3){top:82%;animation-delay:.32s}
        .vline:nth-child(4){left:22%;animation-delay:.42s}
        .vline:nth-child(5){left:50%;animation-delay:.54s}
        .vline:nth-child(6){left:78%;animation-delay:.66s}
        .hline::after,.vline::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(212,175,55,.2),transparent);opacity:0;animation:shimmer .9s ease-out forwards}
        @keyframes drawX{0%{transform:scaleX(0);opacity:0}60%{opacity:.95}100%{transform:scaleX(1);opacity:.7}}
        @keyframes drawY{0%{transform:scaleY(0);opacity:0}60%{opacity:.95}100%{transform:scaleY(1);opacity:.7}}
        @keyframes shimmer{0%{opacity:0}35%{opacity:.25}100%{opacity:0}}
        .card-animate {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.8s cubic-bezier(.22,.61,.36,1) 0.4s forwards;
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

            <div className="absolute inset-0 pointer-events-none [background:radial-gradient(80%_60%_at_50%_30%,rgba(212,175,55,0.03),transparent_60%)]" />

            <div className="accent-lines">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className={`${i <= 3 ? "hline" : "vline"} bg-white/5`} />
                ))}
            </div>

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen pointer-events-none"
            />

            <header className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-4 border-b border-white/5 backdrop-blur-sm z-50">
                <button
                    onClick={onHomeClick}
                    className="flex items-center gap-2 group p-2 rounded-lg"
                >
                    <Logo size="32" gold={true} />
                </button>
                <button
                    onClick={onLoginClick}
                    className="text-xs tracking-widest uppercase text-zinc-500 hover:text-gold transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="h-3 w-3" /> Back to Login
                </button>
            </header>

            <div className="h-full w-full grid place-items-center px-4 relative z-10">
                <Card className="card-animate w-full max-w-md border-white/10 bg-midnight/80 backdrop-blur-2xl shadow-2xl overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-gold/20 via-gold to-gold/20" style={{ width: `${(step / 3) * 100}%`, transition: 'width 0.5s ease' }} />
                    
                    {step === 1 && (
                        <>
                            <CardHeader className="space-y-1 text-center pb-8 pt-10">
                                <CardTitle className="text-3xl font-display font-medium text-white tracking-tight">Forgot Password</CardTitle>
                                <CardDescription className="text-zinc-500">
                                    Enter your email to receive a recovery code
                                </CardDescription>
                            </CardHeader>

                            {error && (
                                <div className="px-6 pb-4">
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
                                        {error}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleEmailSubmit}>
                                <CardContent className="grid gap-5">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-zinc-400 font-medium">Email Address</Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-gold transition-colors" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={emailValue}
                                                onChange={(e) => setEmailValue(e.target.value)}
                                                placeholder="owner@nightlink.com"
                                                className="pl-10 h-12 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-700 focus:ring-gold/20 focus:border-gold/50"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 rounded-xl bg-gold text-midnight hover:bg-gold/90 transition-all font-bold mt-2"
                                    >
                                        {loading ? "Sending..." : "Send Reset Code"}
                                    </Button>
                                </CardContent>
                            </form>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <CardHeader className="space-y-1 text-center pb-8 pt-10">
                                <CardTitle className="text-3xl font-display font-medium text-white tracking-tight">Verify Identity</CardTitle>
                                <CardDescription className="text-zinc-500">
                                    A 6-digit code was sent to <span className="text-gold">{email}</span>
                                </CardDescription>
                            </CardHeader>

                            {error && (
                                <div className="px-6 pb-4">
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
                                        {error}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleOtpSubmit}>
                                <CardContent className="grid gap-6 text-center">
                                    <div className="flex justify-center">
                                        <Input
                                            type="text"
                                            maxLength={6}
                                            value={otpValue}
                                            onChange={(e) => setOtpValue(e.target.value)}
                                            placeholder="000000"
                                            className="h-16 w-full text-center text-4xl tracking-[0.5em] font-mono bg-zinc-900/50 border-white/10 text-gold placeholder:text-zinc-800"
                                            required
                                            autoFocus
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 rounded-xl bg-gold text-midnight hover:bg-gold/90 transition-all font-bold"
                                    >
                                        {loading ? "Verifying..." : "Verify Code"}
                                    </Button>

                                    <button
                                        type="button"
                                        onClick={onResendOtp}
                                        disabled={resendCooldown > 0}
                                        className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-30"
                                    >
                                        <RotateCcw className="h-3 w-3" />
                                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Didn't get the code? Resend"}
                                    </button>
                                </CardContent>
                            </form>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <CardHeader className="space-y-1 text-center pb-8 pt-10">
                                <CardTitle className="text-3xl font-display font-medium text-white tracking-tight">Set New Password</CardTitle>
                                <CardDescription className="text-zinc-500">
                                    Choose a strong password for your account
                                </CardDescription>
                            </CardHeader>

                            {error && (
                                <div className="px-6 pb-4">
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
                                        {error}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleResetSubmit}>
                                <CardContent className="grid gap-5">
                                    <div className="grid gap-2">
                                        <Label htmlFor="pass" className="text-zinc-400 font-medium">New Password</Label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-gold transition-colors" />
                                            <Input
                                                id="pass"
                                                type={showPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="pl-10 pr-10 h-12 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-700 focus:ring-gold/20 focus:border-gold/50"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-white"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 rounded-xl bg-gold text-midnight hover:bg-gold/90 transition-all font-bold mt-2"
                                    >
                                        {loading ? "Resetting..." : "Update Password"}
                                    </Button>
                                </CardContent>
                            </form>
                        </>
                    )}

                    <CardFooter className="flex flex-col items-center justify-center text-sm text-zinc-500 pb-10 pt-4 px-10">
                         <div className="w-full h-px bg-white/5 mb-6" />
                         <p className="text-center">
                            Need help? <a href="#" className="text-gold hover:underline">Contact Nightlink Support</a>
                         </p>
                    </CardFooter>
                </Card>
            </div>
        </section>
    );
}
