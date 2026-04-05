import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Section } from '../../types/editor';

interface EventsSectionProps {
    section: Section;
    events: any[];
    theme: any;
    tenant?: any;
    onEdit?: (id: string, field: string) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ section, events, theme, tenant, onEdit }) => {
    const { title } = section.content;
    const accentColor = theme?.primaryColor || theme?.colorPalette || '#D4AF37';
    const isDark = theme?.isDark;

    return (
        <section className={`py-24 px-6 ${isDark ? 'bg-transparent text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-7xl mx-auto">
                <h3
                    className="text-3xl font-bold mb-12 border-l-4 pl-4"
                    style={{ borderColor: accentColor }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(section.id, 'title');
                    }}
                >
                    {title || 'Upcoming Events'}
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {events.map((event: any) => (
                        <motion.div
                            key={event.id}
                            whileHover={{ y: -5 }}
                            className="group cursor-pointer"
                        >
                            <div className={`aspect-[16/10] rounded-2xl mb-6 overflow-hidden relative ${isDark ? 'bg-white/5' : 'bg-gray-200'}`}>
                                {event.coverImageUrl && (
                                    <img
                                        src={event.coverImageUrl.startsWith('/') ? `http://localhost:3001${event.coverImageUrl}` : event.coverImageUrl}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        alt=""
                                    />
                                )}
                                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md ${isDark ? 'bg-black/60 text-white' : 'bg-white/90 text-gray-900'}`}>
                                    {new Date(event.eventDate).toLocaleDateString()}
                                </div>
                            </div>
                            <h4 className="text-xl font-bold mb-2">{event.name}</h4>
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1 line-clamp-2`}>{event.description}</p>
                            <Link
                                to={tenant?.slug ? `/pr/${tenant.slug}/event/${event.id}` : `/event/${event.id}`}
                                onClick={(e) => {
                                    if (onEdit) e.preventDefault();
                                }}
                                className={`text-sm font-bold uppercase tracking-widest transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black'}`}
                            >
                                View Details →
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
