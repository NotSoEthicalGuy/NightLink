import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, CheckCircle2, Lock, ArrowLeft, Loader2, Zap } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import api from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'sonner';

export default function PaymentMockPage() {
    const navigate = useNavigate();
    const { updateUser } = useAuthStore();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const plan = sessionStorage.getItem('selectedPlan');
        if (!plan) {
            navigate('/subscription');
            return;
        }
        setSelectedPlan(plan);
    }, [navigate]);

    const handleSimulateSuccess = async () => {
        if (!selectedPlan) return;
        
        setIsSimulating(true);
        
        // Add a fake delay for "processing" feel
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const response = await api.post('/auth/simulate-payment', { plan: selectedPlan });
            updateUser(response.data);
            setIsSuccess(true);
            toast.success('Subscription activated successfully!');
        } catch (error: any) {
            console.error('Payment simulation failed:', error);
            toast.error('Payment simulation failed. Please try again.');
        } finally {
            setIsSimulating(false);
        }
    };

    const handleContinue = () => {
        navigate('/');
    };

    const isPremium = selectedPlan === 'PREMIUM';

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 selection:bg-brand-primary/20">
            <div className="max-w-2xl w-full">
                {/* Header/Logo */}
                <div className="flex justify-center mb-10">
                    <Logo gold size="48" />
                </div>

                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="payment-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-zinc-100"
                        >
                            {/* Top Bar indicating plan */}
                            <div className={`p-8 text-center border-b ${isPremium ? 'bg-gradient-to-r from-brand-primary to-brand-accent text-white' : 'bg-zinc-900 text-white'}`}>
                                <h2 className="text-xl font-bold mb-1">{selectedPlan} Plan Activated</h2>
                                <p className={isPremium ? 'text-white/80' : 'text-zinc-400'}>Securing your membership for NightLink</p>
                            </div>

                            <div className="p-10">
                                {/* Plan Details Summary */}
                                <div className="bg-zinc-50 p-6 rounded-2xl mb-10 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPremium ? 'bg-brand-primary text-white shadow-lg' : 'bg-zinc-200 text-zinc-900 font-bold'}`}>
                                            {isPremium ? <Zap className="w-6 h-6 fill-current" /> : 'S'}
                                        </div>
                                        <div>
                                            <div className="font-black text-sm uppercase tracking-wider text-zinc-400">Selected Plan</div>
                                            <div className="font-bold text-lg text-zinc-900">{isPremium ? 'Premium Plan' : 'Standard Plan'}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-2xl text-zinc-900">{isPremium ? '$39.99' : '$29.99'}</div>
                                        <div className="text-xs text-zinc-400 font-bold uppercase tracking-widest">per month</div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 text-zinc-500 mb-2">
                                        <div className="h-px bg-zinc-200 flex-1" />
                                        <span className="text-xs font-black uppercase tracking-[0.2em]">Mock Payment Interface</span>
                                        <div className="h-px bg-zinc-200 flex-1" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Card Number</label>
                                            <div className="relative group">
                                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-brand-primary transition-colors" />
                                                <input
                                                    disabled
                                                    value="•••• •••• •••• 4242"
                                                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 border-transparent rounded-[1rem] font-mono text-lg text-zinc-400"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Expiry Date</label>
                                            <input
                                                disabled
                                                value="12 / 28"
                                                className="w-full px-4 py-4 bg-zinc-50 border-2 border-transparent rounded-[1rem] font-mono text-zinc-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">CVC</label>
                                            <div className="relative">
                                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                <input
                                                    disabled
                                                    value="•••"
                                                    className="w-full px-4 py-4 bg-zinc-50 border-2 border-transparent rounded-[1rem] font-mono text-zinc-400"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 space-y-4">
                                        <button
                                            onClick={handleSimulateSuccess}
                                            disabled={isSimulating}
                                            className={`w-full py-5 rounded-[1.25rem] font-bold text-lg flex items-center justify-center gap-3 transition-all relative overflow-hidden ${
                                                isSimulating 
                                                    ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border-2 border-zinc-200' 
                                                    : 'bg-zinc-900 text-white shadow-xl hover:-translate-y-1 hover:bg-black'
                                            }`}
                                        >
                                            {isSimulating ? (
                                                <>
                                                    <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
                                                    Processing Payment...
                                                </>
                                            ) : (
                                                <>
                                                    <ShieldCheck className="w-6 h-6 text-brand-success" />
                                                    Simulate Payment Success
                                                </>
                                            )}
                                        </button>
                                        
                                        <button
                                            onClick={() => navigate('/subscription')}
                                            disabled={isSimulating}
                                            className="w-full py-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 flex items-center justify-center gap-2 transition-colors disabled:opacity-0"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Change Plan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[3rem] p-12 shadow-[0_30px_60px_rgba(0,0,0,0.12)] text-center border border-zinc-100"
                        >
                            <div className="relative mb-8 inline-block">
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", damping: 10 }}
                                    className="w-24 h-24 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center mx-auto ring-[10px] ring-brand-success/5"
                                >
                                    <CheckCircle2 className="w-12 h-12" />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="absolute -top-2 -right-2 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg"
                                >
                                    <Zap className="w-4 h-4 fill-current" />
                                </motion.div>
                            </div>
                            
                            <h2 className="text-3xl font-black text-zinc-900 mb-4">Payment Successful!</h2>
                            <p className="text-zinc-500 text-lg mb-10 max-w-sm mx-auto">
                                Congratulations! Your <span className="font-bold text-zinc-900">{isPremium ? 'Premium' : 'Standard'}</span> subscription is now active. You have full access to NightLink.
                            </p>

                            <button
                                onClick={handleContinue}
                                className="w-full bg-brand-primary text-white py-5 rounded-[1.25rem] font-bold text-xl shadow-[0_10px_30px_rgba(93,74,224,0.3)] hover:shadow-brand-primary/50 hover:-translate-y-1 transition-all"
                            >
                                Enter Dashboard
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
