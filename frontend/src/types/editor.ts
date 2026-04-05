export interface Section {
    id: string;
    type: 'hero' | 'gallery' | 'events' | 'about' | 'contact' | 'faq' | 'video' | 'sponsors' | 'testimonials';
    title: string;
    visible: boolean;
    order: number;
    content: Record<string, any>;
    style?: SectionStyle;
}

export interface SectionStyle {
    paddingTop?: string; // 'none', 'sm', 'md', 'lg', 'xl'
    paddingBottom?: string;
    backgroundColor?: string;
    textColor?: string;
    theme?: 'dark' | 'light' | 'custom';
    fullWidth?: boolean;
    alignment?: 'left' | 'center' | 'right';
}

export interface ThemeConfig {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    fontHeading: string;
    fontBody: string;
    buttonStyle: 'rounded' | 'sharp' | 'pill';
    buttonEffect: 'none' | 'glow' | 'outline' | 'fill';
    backgroundStyle: 'dark' | 'gradient' | 'image';
    backgroundImageUrl?: string;
    overlayOpacity?: number;
    blurOverlay?: boolean;
}
