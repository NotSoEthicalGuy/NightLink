import React from 'react';
import TemplateMinimalist from './TemplateMinimalist';
import TemplateDarkLuxury from './TemplateDarkLuxury';
import TemplateVibrant from './TemplateVibrant';
import TemplateNeon from './TemplateNeon';
import TemplateNeonNights from './TemplateNeonNights';
import TemplateVelvetLounge from './TemplateVelvetLounge';
import TemplateBlockParty from './TemplateBlockParty';

// Modular Sections
import { HeroSection } from '../sections/HeroSection';
import { AboutSection } from '../sections/AboutSection';
import { EventsSection } from '../sections/EventsSection';
import { Header } from '../sections/Header';
import { SponsorsSection } from '../sections/SponsorsSection';

interface PageRendererProps {
    config: any;
    tenant: any;
    events: any[];
    onEdit?: (id: string, field: string) => void;
}

export default function PageRenderer({ config, tenant, events, onEdit }: PageRendererProps) {
    // Check if we are in modular mode (sectionsVisibility is array)
    const isModular = Array.isArray(config.sectionsVisibility);

    if (isModular) {
        const sections = config.sectionsVisibility as any[];
        const theme = config.themeConfig || {};
        const isDark = theme.backgroundStyle === 'dark' || config.templateId?.includes('dark') || config.templateId?.includes('neon');
        const childTheme = { 
            ...theme, 
            isDark, 
            primaryColor: config.colorPalette || theme.primaryColor || '#D4AF37',
            templateId: config.templateId || 'velvet-lounge'
        };

        // Differentiate templates by font vibe in modular mode
        let fontClass = 'font-sans';
        if (config.templateId?.includes('luxury') || config.templateId?.includes('velvet')) {
            fontClass = 'font-serif';
        }

        return (
            <div className={`min-h-screen ${fontClass} selection:bg-purple-500/30 ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
                {/* Global Header */}
                <Header sections={sections} tenant={tenant} theme={childTheme} />

                {sections.filter(s => s.visible).map((section: any) => {
                    switch (section.type) {
                        case 'hero':
                            return <HeroSection key={section.id} section={section} theme={childTheme} onEdit={onEdit} />;
                        case 'about':
                            return (
                                <AboutSection
                                    key={section.id}
                                    section={section}
                                    theme={childTheme}
                                    tenant={tenant}
                                    onEdit={onEdit}
                                />
                            );
                        case 'events':
                            return <EventsSection key={section.id} section={section} events={events} theme={childTheme} tenant={tenant} onEdit={onEdit} />;
                        case 'sponsors':
                            return <SponsorsSection key={section.id} section={section} theme={childTheme} onEdit={onEdit} />;
                        case 'contact':
                            return (
                                <footer key={section.id} className="py-20 px-6 border-t border-white/10 text-center">
                                    <p className="opacity-50 text-sm">{section.content?.footerText || `© ${new Date().getFullYear()} ${tenant?.name}`}</p>
                                </footer>
                            );
                        default:
                            return <div key={section.id} className="p-10 text-center opacity-50">Unknown Section Type: {section.type}</div>;
                    }
                })}
            </div>
        );
    }

    // Legacy Fallback
    const templates: Record<string, React.FC<any>> = {
        minimalist: TemplateMinimalist,
        'dark-luxury': TemplateDarkLuxury,
        vibrant: TemplateVibrant,
        neon: TemplateNeon,
        'neon-nights': TemplateNeonNights,
        'velvet-lounge': TemplateVelvetLounge,
        'block-party': TemplateBlockParty,
    };

    const SelectedTemplate = templates[config.templateId] || TemplateMinimalist;

    // Adapt legacy onEdit (field) -> (id, field)
    // We assume ID is 'legacy' or 'main' for legacy templates
    return <SelectedTemplate config={config} tenant={tenant} events={events} onEdit={onEdit ? (field: string) => onEdit('main', field) : undefined} />;
}
