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
import { Separator } from "@/components/ui/separator";
import {
    Eye,
    EyeOff,
    Github,
    Lock,
    Mail,
    ArrowRight,
    Chrome,
    User,
    AtSign,
    Phone,
    CreditCard,
    ArrowLeft,
    RotateCcw,
    ShieldCheck,
} from "lucide-react";
import { Logo } from "./Logo";

interface SignupCardSectionProps {
    onEmailSubmit?: (email: string) => Promise<void>;
    onOtpSubmit?: (otp: string) => Promise<void>;
    onProfileSubmit?: (data: {
        name: string;
        slug: string;
        password: string;
        confirmPassword: string;
        whatsapp: string;
        preferredPaymentMethod: string;
    }) => Promise<void>;
    error?: string;
    loading?: boolean;
    onLoginClick?: () => void;
    onContactClick?: () => void;
    onHomeClick?: () => void;
    step?: number;
    email?: string;
    onBackToEmail?: () => void;
    resendCooldown?: number;
    onResendOtp?: () => void;
}

export default function SignupCardSection({
    onEmailSubmit,
    onOtpSubmit,
    onProfileSubmit,
    error,
    loading = false,
    onLoginClick,
    onContactClick,
    onHomeClick,
    step = 1,
    email = "",
    onBackToEmail,
    resendCooldown = 0,
    onResendOtp,
}: SignupCardSectionProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Step 1: Email
    const [emailValue, setEmailValue] = useState("");

    // Step 2: OTP
    const [otpValue, setOtpValue] = useState("");

    // Step 3: Profile
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [preferredPaymentMethod, setPreferredPaymentMethod] = useState("");

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (onEmailSubmit) {
            await onEmailSubmit(emailValue);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (onOtpSubmit) {
            await onOtpSubmit(otpValue);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (onProfileSubmit) {
            await onProfileSubmit({
                name,
                slug,
                password,
                confirmPassword,
                whatsapp,
                preferredPaymentMethod,
            });
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
        <section className="fixed inset-0 bg-obsidian text-platinum font-sans selection:bg-gold/30 overflow-y-auto">
            <style>{`
        .accent-lines{position:absolute;inset:0;pointer-events:none;opacity:.7}
        .hline,.vline{position:absolute;background:#27272a;will-change:transform,opacity}
        .hline{left:0;right:0;height:1px;transform:scaleX(0);transform-origin:50% 50%;animation:drawX .8s cubic-bezier(.22,.61,.36,1) forwards}
        .vline{top:0;bottom:0;width:1px;transform:scaleY(0);transform-origin:50% 0%;animation:drawY .9s cubic-bezier(.22,.61,.36,1) forwards}
        .hline:nth-child(1){top:18%;animation-delay:.12s}
        .hline:nth-child(2){top:50%;animation-delay:.22s}
        .hline:nth-child(3){top:82%;animation-delay:.32s}
        .vline:nth-child(4){left:22%;animation-delay:.42s}
        .vline:nth-child(5){left:50%;animation-delay:.54s}
        .vline:nth-child(6){left:78%;animation-delay:.66s}
        .hline::after,.vline::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(250,250,250,.24),transparent);opacity:0;animation:shimmer .9s ease-out forwards}
        .hline:nth-child(1)::after{animation-delay:.12s}
        .hline:nth-child(2)::after{animation-delay:.22s}
        .hline:nth-child(3)::after{animation-delay:.32s}
        .vline:nth-child(4)::after{animation-delay:.42s}
        .vline:nth-child(5)::after{animation-delay:.54s}
        .vline:nth-child(6)::after{animation-delay:.66s}
        @keyframes drawX{0%{transform:scaleX(0);opacity:0}60%{opacity:.95}100%{transform:scaleX(1);opacity:.7}}
        @keyframes drawY{0%{transform:scaleY(0);opacity:0}60%{opacity:.95}100%{transform:scaleY(1);opacity:.7}}
        @keyframes shimmer{0%{opacity:0}35%{opacity:.25}100%{opacity:0}}

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
        
        .progress-bar {
          position: absolute;
          top: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #ff0080, #00d9ff);
          transition: width 0.3s ease;
        }
      `}</style>

            <div className="absolute inset-0 pointer-events-none [background:radial-gradient(80%_60%_at_50%_30%,rgba(255,255,255,0.06),transparent_60%)]" />

            <div className="accent-lines">
                <div className="hline bg-white/5" />
                <div className="hline bg-white/5" />
                <div className="hline bg-white/5" />
                <div className="vline bg-white/5" />
                <div className="vline bg-white/5" />
                <div className="vline bg-white/5" />
            </div>

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-50 mix-blend-screen pointer-events-none"
            />

            <header className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-4 border-b border-zinc-800/80">
                <button
                    onClick={onHomeClick}
                    className="flex items-center gap-2 group p-2 rounded-lg"
                >
                    <Logo size="32" gold={true} />
                </button>
                <Button
                    onClick={onContactClick}
                    variant="outline"
                    className="h-9 rounded-lg border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80"
                >
                    <span className="mr-2">Contact</span>
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </header>

            <div className="h-full w-full grid place-items-center px-4 pt-20">
                <Card className="card-animate w-full max-w-2xl border-zinc-800 bg-zinc-900/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60 relative overflow-hidden">
                    {/* Progress bar */}
                    <div className="progress-bar" style={{ width: `${(step / 3) * 100}%` }} />

                    {step === 1 && (
                        <>
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl">Create your account</CardTitle>
                                <CardDescription className="text-zinc-400">
                                    Enter your email to get started
                                </CardDescription>
                            </CardHeader>

                            {error && (
                                <div className="px-6 pb-0">
                                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleEmailSubmit}>
                                <CardContent className="grid gap-5">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-zinc-300">
                                            Email
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={emailValue}
                                                onChange={(e) => setEmailValue(e.target.value)}
                                                placeholder="you@example.com"
                                                className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-10 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Sending..." : "Continue"}
                                    </Button>

                                    <div className="relative">
                                        <Separator className="bg-zinc-800" />
                                        <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-zinc-900/70 px-2 text-[11px] uppercase tracking-widest text-zinc-500">
                                            or
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            variant="outline"
                                            className="h-10 rounded-lg border-zinc-800 bg-zinc-950 text-zinc-50 hover:bg-zinc-900/80"
                                        >
                                            <Github className="h-4 w-4 mr-2" />
                                            GitHub
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-10 rounded-lg border-zinc-800 bg-zinc-950 text-zinc-50 hover:bg-zinc-900/80"
                                        >
                                            <Chrome className="h-4 w-4 mr-2" />
                                            Google
                                        </Button>
                                    </div>
                                </CardContent>
                            </form>

                            <CardFooter className="flex items-center justify-center text-sm text-zinc-400">
                                Already have an account?
                                <button
                                    onClick={onLoginClick}
                                    className="ml-1 text-zinc-200 hover:underline"
                                >
                                    Sign in
                                </button>
                            </CardFooter>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <CardHeader className="space-y-1">
                                <button
                                    onClick={onBackToEmail}
                                    className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors text-xs font-medium mb-4"
                                >
                                    <ArrowLeft className="h-3 w-3" /> Change Email
                                </button>
                                <CardTitle className="text-2xl">Verify your email</CardTitle>
                                <CardDescription className="text-zinc-400">
                                    Enter the 6-digit code sent to {email}
                                </CardDescription>
                            </CardHeader>

                            {error && (
                                <div className="px-6 pb-0">
                                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleOtpSubmit}>
                                <CardContent className="grid gap-5">
                                    <Input
                                        type="text"
                                        maxLength={6}
                                        value={otpValue}
                                        onChange={(e) => setOtpValue(e.target.value)}
                                        placeholder="000000"
                                        className="text-center text-3xl tracking-[0.5em] bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-800"
                                        required
                                        autoFocus
                                    />

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-10 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin mr-2" />
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck className="h-4 w-4 mr-2" />
                                                Verify Code
                                            </>
                                        )}
                                    </Button>

                                    <button
                                        type="button"
                                        onClick={onResendOtp}
                                        disabled={resendCooldown > 0}
                                        className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-30"
                                    >
                                        <RotateCcw className="h-3 w-3" />
                                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                                    </button>
                                </CardContent>
                            </form>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl">Complete your profile</CardTitle>
                                <CardDescription className="text-zinc-400">
                                    Set up your PR identity
                                </CardDescription>
                            </CardHeader>

                            {error && (
                                <div className="px-6 pb-0">
                                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleProfileSubmit}>
                                <CardContent className="grid gap-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name" className="text-zinc-300">
                                                Full Name
                                            </Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                                <Input
                                                    id="name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="John Doe"
                                                    className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-50"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="slug" className="text-zinc-300">
                                                Username
                                            </Label>
                                            <div className="relative">
                                                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                                <Input
                                                    id="slug"
                                                    value={slug}
                                                    onChange={(e) => setSlug(e.target.value.toLowerCase())}
                                                    placeholder="username"
                                                    className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-50"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="whatsapp" className="text-zinc-300">
                                                WhatsApp
                                            </Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                                <Input
                                                    id="whatsapp"
                                                    value={whatsapp}
                                                    onChange={(e) => setWhatsapp(e.target.value)}
                                                    placeholder="+1 234 567 8900"
                                                    className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-50"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="payment" className="text-zinc-300">
                                                Payment Method
                                            </Label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                                <select
                                                    id="payment"
                                                    value={preferredPaymentMethod}
                                                    onChange={(e) => setPreferredPaymentMethod(e.target.value)}
                                                    className="pl-10 h-9 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-50 focus-visible:border-zinc-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-zinc-800/20"
                                                    required
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="Whish Money">Whish Money</option>
                                                    <option value="OMT">OMT</option>
                                                    <option value="BoB Finance">BoB Finance</option>
                                                    <option value="Crypto">Crypto (USDT)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="password" className="text-zinc-300">
                                                Password
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="pl-10 pr-10 bg-zinc-950 border-zinc-800 text-zinc-50"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-zinc-200"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="confirmPassword" className="text-zinc-300">
                                                Confirm Password
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                                <Input
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="pl-10 pr-10 bg-zinc-950 border-zinc-800 text-zinc-50"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-zinc-200"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-10 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200 disabled:opacity-50"
                                    >
                                        {loading ? "Creating account..." : "Create Account"}
                                    </Button>
                                </CardContent>
                            </form>
                        </>
                    )}
                </Card>
            </div>
        </section>
    );
}
