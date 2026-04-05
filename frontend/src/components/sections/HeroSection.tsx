import React from 'react';
import { motion } from 'framer-motion';
import { Section, ThemeConfig } from '../../types/editor';

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600&auto=format&fit=crop';

const getMediaUrl = (url?: string) => {
    if (!url) return '';
    const cleanUrl = url.trim();
    if (!cleanUrl) return '';
    if (cleanUrl.startsWith('/')) return `http://localhost:3001${cleanUrl}`;
    return cleanUrl;
};

const TEMPLATE_STYLES: Record<string, any> = {
    minimalist: {
        bg: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop',
        align: 'text-left items-center',
        container: 'max-w-6xl w-full mx-auto px-6 md:px-12',
        title: 'text-4xl md:text-7xl font-sans tracking-tight mb-4',
        subtitle: 'text-sm uppercase tracking-[0.3em] opacity-60 mb-10',
        overlay: 'bg-black/40 backdrop-blur-sm'
    },
    'dark-luxury': {
        bg: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1600&auto=format&fit=crop',
        align: 'text-center items-center',
        container: 'max-w-4xl mx-auto px-6',
        title: 'text-5xl md:text-8xl font-serif italic mb-6 leading-[0.9]',
        subtitle: 'text-xl font-serif opacity-80 mb-10',
        overlay: 'bg-gradient-to-b from-black/20 to-black/80'
    },
    vibrant: {
        bg: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop',
        align: 'text-center items-center',
        container: 'max-w-5xl mx-auto px-6',
        title: 'text-6xl md:text-9xl font-black uppercase tracking-tighter drop-shadow-2xl mb-4',
        subtitle: 'text-2xl font-bold mb-10 text-white drop-shadow-lg',
        overlay: 'bg-gradient-to-br from-violet-900/60 to-fuchsia-900/60 mix-blend-multiply'
    },
    neon: {
        bg: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1600&auto=format&fit=crop',
        align: 'text-center items-center',
        container: 'max-w-4xl mx-auto px-6',
        title: 'text-5xl md:text-8xl font-sans font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]',
        subtitle: 'text-xl font-mono text-cyan-400 mb-10 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]',
        overlay: 'bg-black/80'
    },
    'neon-nights': {
        bg: 'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?w=1600&auto=format&fit=crop',
        align: 'text-left items-end pb-24',
        container: 'max-w-6xl w-full mx-auto px-6 md:px-12',
        title: 'text-6xl md:text-8xl font-black uppercase tracking-tighter text-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)] mb-6',
        subtitle: 'text-xl text-white mb-10 max-w-lg font-bold drop-shadow-md',
        overlay: 'bg-gradient-to-t from-black/90 via-black/40 to-black/20'
    },
    'velvet-lounge': {
        bg: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1600&auto=format&fit=crop',
        align: 'text-center items-center',
        container: 'max-w-4xl mx-auto px-6',
        title: 'text-6xl md:text-8xl font-serif font-black tracking-tighter text-[#D4AF37] mb-6',
        subtitle: 'text-2xl italic font-serif text-white/70 mb-10',
        overlay: 'bg-gradient-to-br from-[#2d1b1b]/80 to-[#1c1c1c]/90'
    },
    'block-party': {
        bg: 'https://images.unsplash.com/photo-1533174000243-cb82b9a101e1?w=1600&auto=format&fit=crop',
        align: 'text-center items-center',
        container: 'max-w-4xl mx-auto px-6',
        title: 'text-5xl md:text-8xl font-black uppercase transform -rotate-2 bg-yellow-400 text-black px-6 py-2 inline-block mb-6',
        subtitle: 'text-xl font-bold bg-black text-white px-4 py-2 inline-block mb-10 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]',
        overlay: 'bg-black/40 backdrop-blur-sm'
    }
};

interface HeroSectionProps {
    section: Section;
    theme: ThemeConfig;
    onEdit?: (id: string, field: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ section, theme, onEdit }) => {
    const { content } = section;
    const {
        backgroundImageUrl,
        backgroundType,
        videoUrl,
        overlayOpacity = 0.5,
        blurOverlay,
        title,
        subtitle,
        ctaText,
        ctaLink
    } = content;

    const templateId = (theme as any)?.templateId || 'velvet-lounge';
    const activeStyle = TEMPLATE_STYLES[templateId] || TEMPLATE_STYLES['velvet-lounge'];
    const accentColor = theme?.primaryColor || '#D4AF37';
    
    // Resolve which image to use - User uploaded > Template Default > Absolute Fallback
    const resolvedHeroImage = getMediaUrl(backgroundImageUrl) || activeStyle.bg || DEFAULT_HERO_IMAGE;

    // Helper for edit props
    const getEditableProps = (field: string) => ({
        onClick: (e: any) => {
            if (onEdit) {
                e.preventDefault();
                e.stopPropagation();
                onEdit(section.id, field);
            }
        },
        className: onEdit ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-dashed hover:outline-yellow-500 rounded relative transition-all duration-200' : '',
        title: onEdit ? 'Click to edit' : undefined
    });

    return (
        <section className={`relative min-h-[80vh] flex ${activeStyle.align} overflow-hidden`}>
            {/* Background */}
            <div className="absolute inset-0 z-0">
                {backgroundType === 'video' && videoUrl ? (
                    <video
                        src={getMediaUrl(videoUrl)}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img
                        src={resolvedHeroImage}
                        alt="Hero Background"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== activeStyle.bg) {
                                target.src = activeStyle.bg;
                            }
                        }}
                    />
                )}

                {/* Overlay */}
                <div
                    className={`absolute inset-0 ${activeStyle.overlay} ${blurOverlay ? 'backdrop-blur-sm' : ''}`}
                    style={!activeStyle.overlay.includes('gradient') ? { backgroundColor: `rgba(0,0,0,${overlayOpacity})` } : {}}
                />
            </div>

            {/* Content */}
            <div className={`relative z-10 text-white ${activeStyle.container}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div {...getEditableProps('title')} className={getEditableProps('title').className}>
                        <h2 className={activeStyle.title} style={templateId === 'velvet-lounge' ? { color: accentColor } : {}}>
                            {title || 'Experience the Night'}
                        </h2>
                    </div>

                    <div {...getEditableProps('subtitle')} className={getEditableProps('subtitle').className}>
                        <p className={activeStyle.subtitle}>
                            {subtitle || 'Unforgettable moments await.'}
                        </p>
                    </div>

                    <a
                        href={ctaLink || '#events'}
                        {...getEditableProps('ctaText')}
                        className={`inline-block px-12 py-4 font-bold uppercase tracking-widest text-sm transition-transform hover:scale-105 active:scale-95 shadow-xl ${getEditableProps('ctaText').className}`}
                        style={{
                            backgroundColor: accentColor,
                            color: templateId === 'block-party' ? '#fff' : '#000',
                            borderRadius: theme?.buttonStyle === 'sharp' ? '0px' : theme?.buttonStyle === 'rounded' ? '12px' : '9999px',
                            boxShadow: theme?.buttonEffect === 'glow' ? `0 0 20px ${accentColor}80` : 'none',
                            textShadow: templateId === 'block-party' ? '2px 2px 0px #000' : 'none'
                        }}
                    >
                        {ctaText || 'View Events'}
                    </a>
                </motion.div>
            </div>
        </section>
    );
};
