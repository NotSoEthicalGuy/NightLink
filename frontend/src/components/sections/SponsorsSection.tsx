import React from 'react';
import { Section } from '../../types/editor';

interface SponsorsSectionProps {
    section: Section;
    theme: any;
    onEdit?: (id: string, field: string) => void;
}

export const SponsorsSection: React.FC<SponsorsSectionProps> = ({ section, theme, onEdit }) => {
    const { title, images } = section.content;
    const accentColor = theme?.primaryColor || '#D4AF37';

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
        <section className="py-16 px-6 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto text-center">
                <h4
                    {...getEditableProps('title')}
                    className={`text-sm font-bold uppercase tracking-widest text-gray-400 mb-10 ${getEditableProps('title').className}`}
                >
                    {title || 'Trusted Partners'}
                </h4>

                <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {(images || [
                        'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
                        'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
                        'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg'
                    ]).map((img: string, i: number) => (
                        <img
                            key={i}
                            src={img}
                            alt="Partner"
                            className="h-8 md:h-10 object-contain hover:scale-110 transition-transform"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
