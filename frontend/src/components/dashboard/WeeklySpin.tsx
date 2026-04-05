import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gift, Sparkles, X, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react'
import api from '../../lib/api'

interface WeeklySpinProps {
    onClose: () => void
    onSuccess: () => void
}

export default function WeeklySpin({ onClose, onSuccess }: WeeklySpinProps) {
    const [spinStatus, setSpinStatus] = useState<any>(null)
    const [isSpinning, setIsSpinning] = useState(false)
    const [result, setResult] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        api.get('/spin/status').then(res => setSpinStatus(res.data))
    }, [])

    const handleSpin = async () => {
        setIsSpinning(true)
        setError(null)

        try {
            // Artificial delay for excitement
            await new Promise(resolve => setTimeout(resolve, 2000))
            const res = await api.post('/spin')
            setResult(res.data.rewardType)
            onSuccess()
            // Refresh status
            const statusRes = await api.get('/spin/status')
            setSpinStatus(statusRes.data)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to spin. Try again.')
            setIsSpinning(false)
        }
    }

    const getRewardLabel = (type: string) => {
        switch (type) {
            case 'SUB_3_DAYS': return '+3 Days Subscription'
            case 'SUB_5_DAYS': return '+5 Days Subscription'
            case 'BRANDING_7_DAYS': return '7 Days Custom Branding'
            case 'NONE': return 'Better luck next week!'
            default: return 'Reward'
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-full max-w-md bg-zinc-900 border border-gold/10 rounded-[40px] p-8 shadow-2xl shadow-gold/5 text-center overflow-hidden"
            >
                {/* Background ambient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[50px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-900/10 blur-[50px] rounded-full pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="mb-6 inline-flex p-4 rounded-3xl bg-gold/5 border border-gold/20 text-gold relative shadow-glow">
                    <Gift size={32} />
                    <div className="absolute inset-0 bg-gold/10 blur-xl rounded-full" />
                </div>

                <h2 className="text-3xl font-display font-medium text-white mb-2">Weekly Spin</h2>
                <div className="flex flex-col items-center gap-1 mb-8">
                    <p className="text-zinc-400 text-sm font-light">Try your luck once a week for exclusive rewards!</p>
                    {spinStatus?.availableSpins > 0 && (
                        <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/20 shadow-glow">
                            {spinStatus.availableSpins} Bonus Spin{spinStatus.availableSpins > 1 ? 's' : ''} Available
                        </span>
                    )}
                </div>

                {!result ? (
                    <div className="space-y-6 relative z-10">
                        <div className="relative h-48 flex items-center justify-center">
                            <motion.div
                                animate={isSpinning ? { rotate: 360 * 10 } : { rotate: 0 }}
                                transition={isSpinning ? { duration: 3, ease: "circIn" } : {}}
                                className="w-32 h-32 rounded-full border-4 border-dashed border-gold/30 flex items-center justify-center relative"
                            >
                                <Sparkles size={40} className="text-gold animate-pulse" />
                            </motion.div>

                            {/* Inner circle */}
                            <div className="absolute w-4 h-4 bg-white rounded-full shadow-lg shadow-gold/50" />
                        </div>

                        <button
                            onClick={handleSpin}
                            disabled={isSpinning}
                            className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 ${isSpinning
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                : 'bg-gold hover:bg-gold/90 text-black shadow-lg shadow-gold/20 active:scale-95'
                                }`}
                        >
                            {isSpinning ? 'Good Luck...' : 'Spin the Wheel'}
                            <RotateCcw size={16} className={isSpinning ? 'animate-spin' : ''} />
                        </button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="space-y-6 relative z-10"
                    >
                        <div className={`p-8 rounded-3xl border ${result === 'NONE' ? 'bg-white/5 border-white/5' : 'bg-gold/5 border-gold/20'}`}>
                            {result !== 'NONE' ? (
                                <>
                                    <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20 shadow-glow">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <h3 className="text-2xl font-display font-medium text-white mb-2">{getRewardLabel(result)}</h3>
                                    <p className="text-[10px] text-gold font-bold uppercase tracking-widest">Reward Granted</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-white/5 text-zinc-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                                        <AlertCircle size={24} />
                                    </div>
                                    <h3 className="text-xl font-display font-medium text-zinc-300 mb-2">{getRewardLabel(result)}</h3>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Better luck next time</p>
                                </>
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-xs transition-all border border-white/5 hover:border-white/10"
                        >
                            Back to Dashboard
                        </button>
                    </motion.div>
                )}

                {error && (
                    <p className="mt-4 text-red-400 text-[10px] font-bold uppercase tracking-widest bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                        {error}
                    </p>
                )}
            </motion.div>
        </div>
    )
}
