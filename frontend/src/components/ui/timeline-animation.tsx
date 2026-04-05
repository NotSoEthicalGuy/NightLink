'use client'

import { motion, Variants } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface TimelineContentProps {
    children: ReactNode
    animationNum?: number
    timelineRef?: React.RefObject<HTMLElement>
    customVariants?: Variants
    className?: string
    as?: keyof JSX.IntrinsicElements
}

export function TimelineContent({
    children,
    animationNum = 0,
    timelineRef,
    customVariants,
    className,
    as = "div",
    ...props
}: TimelineContentProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    const defaultVariants: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2,
                duration: 0.6,
                ease: "easeOut",
            },
        }),
    }

    const variants = customVariants || defaultVariants
    const Component = (motion as any)[as as any]

    return (
        <Component
            ref={ref}
            custom={animationNum}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            className={cn(className)}
            {...props}
        >
            {children}
        </Component>
    )
}
