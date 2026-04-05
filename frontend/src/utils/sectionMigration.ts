import { Section } from '../types/editor';

export const migrateSections = (config: any): Section[] => {
    // If already migrated (is array), return it
    if (Array.isArray(config.sectionsVisibility)) {
        return config.sectionsVisibility;
    }

    // Legacy format map: { "about": { visible: true, order: 1 }, ... }
    const sections: Section[] = [];

    // 1. Hero (Implicit in old templates, explicit in new builder)
    sections.push({
        id: 'hero-main',
        type: 'hero',
        title: 'Hero Section',
        visible: true,
        order: 0,
        content: {
            title: config.themeConfig?.heroTitle || 'Experience the Night',
            subtitle: config.themeConfig?.heroSubtitle || 'Exclusive events.',
            ctaText: config.themeConfig?.heroButtonText || 'View Events',
            backgroundImageUrl: config.themeConfig?.heroImageUrl || '',
            backgroundType: 'image',
            overlayOpacity: 0.5
        }
    });

    // 2. Events
    const eventsVis = config.sectionsVisibility?.events || { visible: true, order: 2 };
    sections.push({
        id: 'events-list',
        type: 'events',
        title: 'Events List',
        visible: eventsVis.visible !== false,
        order: eventsVis.order || 1,
        content: {
            title: config.themeConfig?.eventsTitle || 'Upcoming Events',
            layout: 'grid' // grid | list | carousel
        }
    });

    // 3. About
    const aboutVis = config.sectionsVisibility?.about || { visible: true, order: 2 };
    sections.push({
        id: 'about-us',
        type: 'about',
        title: 'About Us',
        visible: aboutVis.visible !== false,
        order: aboutVis.order || 2,
        content: {
            title: config.themeConfig?.aboutTitle || 'Our Story',
            text: config.themeConfig?.aboutText || '',
            imageUrl: config.themeConfig?.aboutImageUrl || ''
        }
    });

    // 4. Contact / Footer (Implicit often, but let's make it a section)
    const contactVis = config.sectionsVisibility?.contact || { visible: true, order: 3 };
    sections.push({
        id: 'contact-section',
        type: 'contact',
        title: 'Contact & Footer',
        visible: contactVis.visible !== false,
        order: contactVis.order || 3,
        content: {
            footerText: config.themeConfig?.footerText || ''
        }
    });

    return sections.sort((a, b) => a.order - b.order);
};
