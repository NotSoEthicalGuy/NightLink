import React, { useState, useEffect } from 'react';
import { Section } from '../../types/editor';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';

interface HeaderProps {
    sections: Section[];
    tenant: any;
    theme: any;
}

export const Header: React.FC<HeaderProps> = ({ sections, theme }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const visibleSections = sections.filter(s => s.visible && s.type !== 'hero' && s.type !== 'contact'); // Don't link hero or contact in the navbar

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="transition-transform hover:scale-105 active:scale-95 duration-200">
                    <Logo size="36" gold={true} />
                </Link>

                <nav className="hidden md:flex items-center space-x-8">
                    {visibleSections.map(section => (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            className="text-sm font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors"
                        >
                            {section.title}
                        </a>
                    ))}
                    <button 
                        className="px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full transition-all"
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = theme?.primaryColor || '#a855f7'; e.currentTarget.style.color = '#fff'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#000'; }}
                    >
                        Reserve
                    </button>
                </nav>

                {/* Mobile Menu Toggle (Simplified) */}
                <button className="md:hidden text-white">
                    <div className="space-y-1.5">
                        <span className="block w-6 h-0.5 bg-white"></span>
                        <span className="block w-6 h-0.5 bg-white"></span>
                        <span className="block w-6 h-0.5 bg-white"></span>
                    </div>
                </button>
            </div>
        </header>
    );
};
