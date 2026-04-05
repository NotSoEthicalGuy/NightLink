import { useLocation, Link, Navigate } from 'react-router-dom'
import { ShieldAlert, Mail, ArrowLeft } from 'lucide-react'

export default function DeactivatedAccount() {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const reason = queryParams.get('reason')

    if (!reason) {
        return <Navigate to="/login" replace />
    }

    return (
        <div className="min-h-screen bg-[#050505] text-[#f0f0f0] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-30 select-none overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-red-600/10 blur-[120px] rounded-full" />
                <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-xl w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="bg-[#1a0005] border border-red-500/20 p-12 rounded-[48px] shadow-2xl text-center">
                    <div className="w-24 h-24 bg-red-600/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8 animate-pulse">
                        <ShieldAlert size={56} />
                    </div>

                    <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4" style={{ fontFamily: 'Archivo Black' }}>
                        Account Deactivated
                    </h1>

                    <p className="text-gray-400 font-medium mb-12 uppercase tracking-widest text-xs">
                        Administrative Action Taken
                    </p>

                    <div className="bg-red-950/20 border border-red-500/10 p-8 rounded-[32px] mb-12 text-left">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-4 flex items-center gap-2">
                            Reason from Administrator
                        </h3>
                        <p className="text-xl text-red-100 font-medium italic leading-relaxed">
                            "{reason}"
                        </p>
                    </div>

                    <div className="space-y-6">
                        <p className="text-gray-400 text-sm leading-relaxed">
                            If you believe this action was taken in error or if you have an opposite opinion regarding this deactivation, please contact our administrative team.
                        </p>

                        <a
                            href="mailto:nightlinkcorp@gmail.com"
                            className="flex items-center justify-center gap-3 w-full py-5 bg-white/5 border border-white/10 rounded-3xl font-black uppercase italic tracking-tighter hover:bg-white/10 transition-all text-white"
                        >
                            <Mail size={20} className="text-red-500" />
                            nightlinkcorp@gmail.com
                        </a>

                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors pt-4"
                        >
                            <ArrowLeft size={12} />
                            Back to Login
                        </Link>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <div className="flex items-center justify-center space-x-2 opacity-50">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-400 rounded-lg flex items-center justify-center">
                            <span className="text-xs">🌙</span>
                        </div>
                        <span className="text-lg font-black tracking-tighter uppercase italic">NightLink HQ</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
