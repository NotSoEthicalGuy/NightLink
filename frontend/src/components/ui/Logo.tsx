import React from 'react';
import { Trefoil } from 'ldrs/react';
import 'ldrs/react/Trefoil.css';

interface LogoProps {
    className?: string;
    size?: string;
    gold?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = "40", gold = true }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <Trefoil
                size={size}
                stroke="4"
                strokeLength="0.15"
                bgOpacity="0.1"
                speed="5"
                color={gold ? "#D4AF37" : "black"}
            />
            <span className={`font-display font-bold tracking-tight uppercase ${gold ? 'text-gold' : 'text-brand-dark'}`}>
                NightLink
            </span>
        </div>
    );
};

export default Logo;
