import { Shield } from 'lucide-react';

export default function VerifiedBadge({ className = "", size = 20, type = 'pr' }: { className?: string, size?: number, type?: 'pr' | 'admin' }) {
    if (type === 'admin') {
        return (
            <div
                className={`inline-flex items-center justify-center relative group select-none ${className}`}
                style={{ width: size, height: size }}
            >
                {/* Royal Gold Glow */}
                <div className="absolute inset-[-4px] rounded-full bg-amber-500 blur-[8px] opacity-20" />

                <div className="relative w-full h-full rounded-lg bg-gradient-to-br from-amber-400 via-yellow-200 to-amber-600 p-[1px] shadow-xl">
                    <div className="w-full h-full rounded-lg bg-[#1a1100] flex items-center justify-center">
                        <Shield size={size * 0.6} className="text-amber-400 fill-amber-400/20" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            className={`inline-flex items-center justify-center relative group select-none ${className}`}
            style={{ width: size, height: size }}
        >
            {/* Website Neon Glow */}
            <div className="absolute inset-[-2px] rounded-full bg-[#ff0080] blur-[4px] opacity-30 group-hover:opacity-60 transition-opacity" />

            <svg
                viewBox="0 0 24 24"
                fill="none"
                className="relative w-full h-full drop-shadow-[0_0_8px_rgba(255,0,128,0.4)]"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Precise 12-point rounded seal shape from the uploaded image */}
                <path
                    d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
                    fill="url(#theme_gradient)"
                />

                {/* Clean White Checkmark */}
                <path
                    d="M8.5 12.5L10.5 14.5L15.5 9.5"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                <defs>
                    <linearGradient id="theme_gradient" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#ff0080" /> {/* NightLink Neon Pink */}
                        <stop offset="1" stopColor="#8000ff" /> {/* NightLink Neon Purple */}
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}
