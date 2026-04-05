"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles as SparklesComp } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Check } from "lucide-react";

const plans = [
    {
        name: "Starter",
        description:
            "Perfect for individual promoters and small venues getting started",
        price: 29,
        yearlyPrice: 249,
        buttonText: "Get Started",
        buttonVariant: "outline" as const,
        includes: [
            "What's included:",
            "Up to 10 events per month",
            "Basic guest list management",
            "QR code check-in",
            "Email support",
            "Custom event pages",
            "Basic analytics",
        ],
    },
    {
        name: "Professional",
        description:
            "Best for serious promoters and growing nightlife businesses",
        price: 79,
        yearlyPrice: 699,
        buttonText: "Start Free Trial",
        buttonVariant: "default" as const,
        popular: true,
        includes: [
            "Everything in Starter, plus:",
            "Unlimited events",
            "Advanced analytics & insights",
            "Ticket sales & payments",
            "WhatsApp integration",
            "Priority support",
            "Team collaboration (up to  5)",
            "Custom branding",
        ],
    },
    {
        name: "Enterprise",
        description:
            "Complete solution for large venues and nightlife organizations",
        price: 199,
        yearlyPrice: 1799,
        buttonText: "Contact Sales",
        buttonVariant: "outline" as const,
        includes: [
            "Everything in Professional, plus:",
            "Unlimited team members",
            "Multi-venue management",
            "API access",
            "Dedicated account manager",
            "Custom integrations",
            "Advanced security",
            "SLA guarantee",
        ],
    },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
    const [selected, setSelected] = useState("0");

    const handleSwitch = (value: string) => {
        setSelected(value);
        onSwitch(value);
    };

    return (
        <div className="flex justify-center">
            <div className="relative z-10 mx-auto flex w-fit rounded-full bg-neutral-900 border border-gray-700 p-1">
                <button
                    onClick={() => handleSwitch("0")}
                    className={cn(
                        "relative z-10 w-fit h-10  rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
                        selected === "0" ? "text-white" : "text-gray-200",
                    )}
                >
                    {selected === "0" && (
                        <motion.span
                            layoutId={"switch"}
                            className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-500 to-blue-600"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                    <span className="relative">Monthly</span>
                </button>

                <button
                    onClick={() => handleSwitch("1")}
                    className={cn(
                        "relative z-10 w-fit h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
                        selected === "1" ? "text-white" : "text-gray-200",
                    )}
                >
                    {selected === "1" && (
                        <motion.span
                            layoutId={"switch"}
                            className="absolute top-0 left-0 h-10 w-full  rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-500 to-blue-600"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                    <span className="relative flex items-center gap-2">Yearly <span className="text-xs bg-blue-500/20 px-2 py-0.5 rounded-full">Save 20%</span></span>
                </button>
            </div>
        </div>
    );
};

export default function PricingSection() {
    const [isYearly, setIsYearly] = useState(false);
    const pricingRef = useRef<HTMLDivElement>(null);

    const revealVariants = {
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                delay: i * 0.15,
                duration: 0.5,
            },
        }),
        hidden: {
            filter: "blur(10px)",
            y: -20,
            opacity: 0,
        },
    };

    const togglePricingPeriod = (value: string) =>
        setIsYearly(Number.parseInt(value) === 1);

    return (
        <div
            className="min-h-screen mx-auto relative bg-black overflow-x-hidden py-20"
            ref={pricingRef}
            id="pricing"
        >
            <TimelineContent
                animationNum={4}
                timelineRef={pricingRef}
                customVariants={revealVariants}
                className="absolute top-0 h-96 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] "
            >
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2c_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)] bg-[size:70px_80px] "></div>
                <SparklesComp
                    density={1800}
                    direction="bottom"
                    speed={1}
                    color="#FFFFFF"
                    className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
                />
            </TimelineContent>

            <TimelineContent
                animationNum={5}
                timelineRef={pricingRef}
                customVariants={revealVariants}
                className="absolute left-0 top-[-114px] w-full h-[113.625vh] flex flex-col items-start justify-start content-start flex-none flex-nowrap gap-2.5 overflow-hidden p-0 z-0"
            >
                <div className="framer-1i5axl2">
                    <div
                        className="absolute left-[-568px] right-[-568px] top-0 h-[2053px] flex-none rounded-full"
                        style={{
                            border: "200px solid #3131f5",
                            filter: "blur(92px)",
                            WebkitFilter: "blur(92px)",
                        }}
                        data-border="true"
                    ></div>
                    <div
                        className="absolute left-[-568px] right-[-568px] top-0 h-[2053px] flex-none rounded-full"
                        style={{
                            border: "200px solid #3131f5",
                            filter: "blur(92px)",
                            WebkitFilter: "blur(92px)",
                        }}
                        data-border="true"
                    ></div>
                </div>
            </TimelineContent>

            <article className="text-center mb-12 pt-12 max-w-3xl mx-auto space-y-6 relative z-50 px-4">
                <h2 className="text-5xl font-bold text-white">
                    <VerticalCutReveal
                        splitBy="words"
                        staggerDuration={0.15}
                        staggerFrom="first"
                        reverse={true}
                        containerClassName="justify-center "
                        transition={{
                            type: "spring",
                            stiffness: 250,
                            damping: 40,
                            delay: 0,
                        }}
                    >
                        Plans that scale with your nightlife business
                    </VerticalCutReveal>
                </h2>

                <TimelineContent
                    as="p"
                    animationNum={0}
                    timelineRef={pricingRef}
                    customVariants={revealVariants}
                    className="text-gray-300 text-lg"
                >
                    Trusted by promoters worldwide. Choose the perfect plan for your events.
                </TimelineContent>

                <TimelineContent
                    as="div"
                    animationNum={1}
                    timelineRef={pricingRef}
                    customVariants={revealVariants}
                >
                    <PricingSwitch onSwitch={togglePricingPeriod} />
                </TimelineContent>
            </article>

            <div
                className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0"
                style={{
                    backgroundImage: `radial-gradient(circle at center, #206ce8 0%, transparent 70%)`,
                    opacity: 0.6,
                    mixBlendMode: "multiply",
                }}
            />

            <div className="grid md:grid-cols-3 max-w-6xl gap-6 py-6 mx-auto px-4 relative z-10">
                {plans.map((plan, index) => (
                    <TimelineContent
                        key={plan.name}
                        as="div"
                        animationNum={2 + index}
                        timelineRef={pricingRef}
                        customVariants={revealVariants}
                    >
                        <Card
                            className={`relative text-white border-neutral-800 h-full ${plan.popular
                                    ? "bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 shadow-[0px_-13px_300px_0px_#0900ff] z-20 scale-105"
                                    : "bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 z-10"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                    Most Popular
                                </div>
                            )}

                            <CardHeader className="text-left pb-8">
                                <div className="flex justify-between">
                                    <h3 className="text-2xl mb-3 font-bold">{plan.name}</h3>
                                </div>
                                <div className="flex items-baseline mb-4">
                                    <span className="text-5xl font-bold ">
                                        $
                                        <NumberFlow
                                            format={{
                                                currency: "USD",
                                            }}
                                            value={isYearly ? plan.yearlyPrice : plan.price}
                                            className="text-5xl font-bold"
                                        />
                                    </span>
                                    <span className="text-gray-400 ml-2 text-lg">
                                        /{isYearly ? "year" : "month"}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">{plan.description}</p>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <button
                                    className={`w-full mb-8 py-4 px-6 text-lg font-semibold rounded-xl transition-all hover:scale-105 ${plan.popular
                                            ? "bg-gradient-to-t from-blue-500 to-blue-600 shadow-lg shadow-blue-800/50 border border-blue-500 text-white"
                                            : "bg-gradient-to-t from-neutral-950 to-neutral-800 shadow-lg shadow-neutral-900 border border-neutral-700 text-white hover:border-neutral-600"
                                        }`}
                                >
                                    {plan.buttonText}
                                </button>

                                <div className="space-y-4 pt-6 border-t border-neutral-700">
                                    <h4 className="font-semibold text-base mb-4 text-gray-200">
                                        {plan.includes[0]}
                                    </h4>
                                    <ul className="space-y-3">
                                        {plan.includes.slice(1).map((feature, featureIndex) => (
                                            <li
                                                key={featureIndex}
                                                className="flex items-start gap-3"
                                            >
                                                <Check className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm text-gray-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </TimelineContent>
                ))}
            </div>
        </div>
    );
}
