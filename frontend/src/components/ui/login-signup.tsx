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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
    Eye,
    EyeOff,
    Github,
    Lock,
    Mail,
    ArrowRight,
    Chrome,
} from "lucide-react";
import { Logo } from "./Logo";

interface LoginCardSectionProps {
    onSubmit?: (email: string, password: string) => Promise<void>;
    error?: string;
    loading?: boolean;
    onSignupClick?: () => void;
    onForgotPasswordClick?: () => void;
    onContactClick?: () => void;
    onHomeClick?: () => void;
}

export default function LoginCardSection({
    onSubmit,
    error,
    loading = false,
    onSignupClick,
    onForgotPasswordClick,
    onContactClick,
    onHomeClick
}: LoginCardSectionProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            await onSubmit(email, password);
        }
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
        .hline:nth-child(1)::after{animation-delay:.12s}
        .hline:nth-child(2)::after{animation-delay:.22s}
        .hline:nth-child(3)::after{animation-delay:.32s}
        .vline:nth-child(4)::after{animation-delay:.42s}
        .vline:nth-child(5)::after{animation-delay:.54s}
        .vline:nth-child(6)::after{animation-delay:.66s}
        @keyframes drawX{0%{transform:scaleX(0);opacity:0}60%{opacity:.95}100%{transform:scaleX(1);opacity:.7}}
        @keyframes drawY{0%{transform:scaleY(0);opacity:0}60%{opacity:.95}100%{transform:scaleY(1);opacity:.7}}
        @keyframes shimmer{0%{opacity:0}35%{opacity:.25}100%{opacity:0}}

        /* === Card minimal fade-up animation === */
        .card-animate {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.8s cubic-bezier(.22,.61,.36,1) 0.4s forwards;
        }
        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

            {/* Subtle vignette */}
            <div className="absolute inset-0 pointer-events-none [background:radial-gradient(80%_60%_at_50%_30%,rgba(212,175,55,0.03),transparent_60%)]" />

            {/* Animated accent lines */}
            <div className="accent-lines">
                <div className="hline bg-white/5" />
                <div className="hline bg-white/5" />
                <div className="hline bg-white/5" />
                <div className="vline bg-white/5" />
                <div className="vline bg-white/5" />
                <div className="vline bg-white/5" />
            </div>

            {/* Particles */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen pointer-events-none"
            />

            {/* Header */}
            <header className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-4 border-b border-white/5 backdrop-blur-sm z-50">
                <button
                    onClick={onHomeClick}
                    className="flex items-center gap-2 group p-2 rounded-lg"
                >
                    <Logo size="32" gold={true} />
                </button>
                <Button
                    onClick={onContactClick}
                    variant="ghost"
                    className="text-zinc-400 hover:text-white hover:bg-white/5"
                >
                    <span className="mr-2">Contact Support</span>
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </header>

            {/* Centered Login Card */}
            <div className="h-full w-full grid place-items-center px-4 relative z-10">
                <Card className="card-animate w-full max-w-sm border-white/10 bg-midnight/80 backdrop-blur-2xl shadow-2xl">
                    <CardHeader className="space-y-1 text-center pb-8">
                        <CardTitle className="text-3xl font-display font-medium text-white tracking-tight">Welcome Return</CardTitle>
                        <CardDescription className="text-zinc-500">
                            Enter your credentials to access your dashboard
                        </CardDescription>
                    </CardHeader>

                    {error && (
                        <div className="px-6 pb-0 mb-4">
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center justify-center">
                                {error}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleFormSubmit}>
                        <CardContent className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-zinc-400 font-medium">
                                    Email Address
                                </Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-gold transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="owner@nightlink.com"
                                        className="pl-10 h-11 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-700 focus:ring-gold/20 focus:border-gold/50 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-zinc-400 font-medium">
                                    Password
                                </Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-gold transition-colors" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10 h-11 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-700 focus:ring-gold/20 focus:border-gold/50 transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-zinc-500 hover:text-white transition-colors"
                                        onClick={() => setShowPassword((v) => !v)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="remember"
                                        className="border-zinc-700 data-[state=checked]:bg-gold data-[state=checked]:text-midnight data-[state=checked]:border-gold rounded-[4px]"
                                    />
                                    <Label htmlFor="remember" className="text-zinc-500 font-normal cursor-pointer hover:text-zinc-300 transition-colors">
                                        Remember me
                                    </Label>
                                </div>
                                <button 
                                    type="button"
                                    onClick={onForgotPasswordClick}
                                    className="text-sm text-gold/80 hover:text-gold transition-colors font-medium"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 rounded-xl bg-gold text-midnight hover:bg-gold/90 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold shadow-glow mt-2"
                            >
                                {loading ? "Authenticating..." : "Sign In"}
                            </Button>

                            <div className="relative my-4">
                                <Separator className="bg-white/10" />
                                <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-midnight px-2 text-[10px] uppercase tracking-widest text-zinc-600 font-medium">
                                    or continue with
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 rounded-xl border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                                >
                                    <Github className="h-4 w-4 mr-2" />
                                    GitHub
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 rounded-xl border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                                >
                                    <Chrome className="h-4 w-4 mr-2" />
                                    Google
                                </Button>
                            </div>
                        </CardContent>
                    </form>

                    <CardFooter className="flex items-center justify-center text-sm text-zinc-500 pb-8">
                        Don't have an account?
                        <button
                            onClick={onSignupClick}
                            className="ml-1 text-gold hover:text-gold/80 hover:underline font-medium transition-colors"
                        >
                            Request Access
                        </button>
                    </CardFooter>
                </Card>
            </div>
        </section>
    );
}
