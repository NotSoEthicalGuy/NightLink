import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, ShieldCheck, Zap, Star } from 'lucide-react';
import { Logo } from '../components/ui/Logo';

export default function SubscriptionPage() {
    const navigate = useNavigate();

    const plans = [
        {
            id: 'STANDARD',
            name: 'Standard Plan',
            price: '$29.99',
            description: 'Essential tools for growing promoters.',
            features: [
                'Unlimited event websites',
                'Core website themes',
                'Unlimited ticket sales',
                'Basic analytics',
                '0% commission on sales',
                'Email support'
            ],
            cta: 'Choose Standard',
            popular: false,
            color: 'blue'
        },
        {
            id: 'PREMIUM',
            name: 'Premium Plan',
            price: '$39.99',
            description: 'The ultimate toolkit for nightlife masters.',
            features: [
                'Everything in Standard',
                'Access to ALL premium themes',
                'Advanced analytics & insights',
                'Priority email & chat support',
                'Custom branding options',
                'Early access to new features'
            ],
            cta: 'Choose Premium',
            popular: true,
            color: 'gold'
        }
    ];

    const handleSelectPlan = (planId: string) => {
        // Save selected plan temporarily (could use session storage or just pass via state)
        sessionStorage.setItem('selectedPlan', planId);
        navigate('/payment');
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-brand-primary/20">
            {/* Header */}
            <header className="p-6 flex justify-between items-center max-w-7xl mx-auto">
                <Logo gold size="42" />
                <button onClick={() => navigate(-1)} className="text-zinc-500 hover:text-zinc-900 font-medium transition-colors">
                    Back
                </button>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-6 text-zinc-900">
                        Unlock the full power of <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">NightLink</span>
                    </h1>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
                        Choose the plan that fits your ambition. No commissions, no hidden fees, total control.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative bg-zinc-50 rounded-[2.5rem] p-10 text-left border-2 transition-all hover:shadow-2xl ${
                                plan.popular 
                                    ? 'border-brand-primary shadow-xl scale-105 z-10' 
                                    : 'border-transparent hover:border-zinc-200'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-brand-primary text-white px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                                    <Star className="w-4 h-4 fill-current" />
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                                    {plan.name}
                                    {plan.popular && <Zap className="w-6 h-6 text-brand-primary fill-current" />}
                                </h2>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                                    <span className="text-zinc-400 font-medium">/month</span>
                                </div>
                                <p className="text-zinc-500">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                            plan.popular ? 'bg-brand-primary/10 text-brand-primary' : 'bg-zinc-200 text-zinc-500'
                                        }`}>
                                            <Check className="w-3 h-3 stroke-[3px]" />
                                        </div>
                                        <span className="text-zinc-700 font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSelectPlan(plan.id)}
                                className={`w-full py-5 rounded-[1.25rem] font-bold text-lg transition-all flex items-center justify-center gap-2 group ${
                                    plan.popular
                                        ? 'bg-brand-primary text-white shadow-lg hover:shadow-brand-primary/40 hover:-translate-y-1'
                                        : 'bg-white border-2 border-zinc-200 text-zinc-900 hover:border-brand-primary hover:text-brand-primary'
                                }`}
                            >
                                {plan.cta}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 pt-10 border-t border-zinc-100 flex flex-col items-center gap-8">
                    <p className="text-zinc-500 font-medium flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-brand-success" />
                        Safe & Secure Payment Processing
                    </p>
                    <div className="flex gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                        {/* Fake payment icons */}
                        <div className="font-bold text-xl italic tracking-tighter">VISA</div>
                        <div className="font-bold text-xl italic tracking-tighter">MasterCard</div>
                        <div className="font-bold text-xl italic tracking-tighter">ApplePay</div>
                        <div className="font-bold text-xl italic tracking-tighter">Stripe</div>
                    </div>
                </div>
            </main>
        </div>
    );
}
