import React from 'react';
import { Section } from '../../types/editor';

interface AboutSectionProps {
    section: Section;
    theme: any;
    tenant: any;
    onEdit?: (id: string, field: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ section, theme, tenant, onEdit }) => {
    const { title, text, imageUrl, layout = 'left' } = section.content;
    const isDark = theme?.isDark;

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
        <section className={`py-20 sm:py-28 px-6 max-w-7xl mx-auto ${isDark ? 'text-white' : ''}`}>
            <div className={`grid md:grid-cols-2 gap-12 md:gap-20 items-center ${layout === 'right' ? 'md:flex-row-reverse' : ''}`}> {/* Basic layout toggle support */}
                <div className={`aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative ${layout === 'right' ? 'order-2' : ''} ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                    {imageUrl || tenant?.profile?.photoUrl ? (
                        <img
                            src={(imageUrl || tenant?.profile?.photoUrl).startsWith('/') ? `http://localhost:3001${imageUrl || tenant?.profile?.photoUrl}` : (imageUrl || tenant?.profile?.photoUrl)}
                            alt="About"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 uppercase tracking-[0.3em]">
                            Upload Image
                        </div>
                    )}
                </div>
                <div className={layout === 'right' ? 'order-1' : ''}>
                    <h3
                        {...getEditableProps('title')}
                        className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 font-display ${getEditableProps('title').className}`}
                    >
                        {title || 'Our Story'}
                    </h3>
                    <p
                        {...getEditableProps('text')}
                        className={`text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 font-light ${isDark ? 'text-gray-300' : 'text-gray-600'} ${getEditableProps('text').className}`}
                    >
                        {text || tenant?.profile?.bio || 'We curate the most exclusive night entertainment.'}
                    </p>

                    <div className="flex space-x-6">
                        {tenant?.profile?.contactInfo?.instagram && (
                            <a
                                href={tenant.profile.contactInfo.instagram}
                                className={`text-gray-400 transition-colors text-sm uppercase font-bold tracking-widest ${isDark ? 'hover:text-white' : 'hover:text-black'}`}
                            >
                                Instagram
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
