import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Type,
    Palette,
    Eye,
    Save,
    EyeOff,
    ChevronRight,
    Smartphone,
    Monitor,
    Layers,
    Plus,
    ArrowUp,
    ArrowDown,
    Trash2,
    Settings,
    Image as ImageIcon,
    ArrowLeft,
    Lock
} from 'lucide-react';
import api from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import {
    isPremiumOnlyTemplate,
    isStandardPlanUser,
    isTemplateLockedForStandardUser,
} from '../../lib/templateAccess';
import PageRenderer from '../templates/PageRenderer';
import { migrateSections } from '../../utils/sectionMigration';
import { Section } from '../../types/editor';

class ErrorBoundary extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true, error };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center text-red-400 bg-red-900/10 h-full flex flex-col items-center justify-center">
                    <h2 className="text-xl font-bold mb-4">Preview Rendering Error</h2>
                    <p className="mb-4 text-sm opacity-80">Something went wrong while rendering the preview.</p>
                    <pre className="text-xs bg-black/50 p-4 rounded text-left overflow-auto max-w-full">
                        {this.state.error?.toString()}
                    </pre>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm font-bold uppercase tracking-widest transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

const EDITOR_TEMPLATES = [
    'minimalist',
    'vibrant',
    'neon',
    'dark-luxury',
    'neon-nights',
    'velvet-lounge',
    'block-party',
] as const;

export default function Editor() {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const [config, setConfig] = useState<any>(null);
    const [tenant, setTenant] = useState<any>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('design');
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [showSuccess, setShowSuccess] = useState(false);
    const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [configRes, profileRes, eventsRes] = await Promise.all([
                    api.get('/site-config'),
                    api.get('/profile'),
                    api.get('/events').catch(() => ({ data: [] })) // Events optional
                ]);

                if (!configRes.data) throw new Error('No configuration data received');

                // Migrate legacy sections to modular array
                const migratedSections = migrateSections(configRes.data);
                setConfig({ ...configRes.data, sectionsVisibility: migratedSections });

                setTenant(profileRes.data);
                setEvents(eventsRes.data);
            } catch (err: any) {
                console.error('Editor load failed', err);
                setError(err.message || 'Failed to load editor configuration');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const updateConfigLocal = (updates: any) => {
        setConfig((prev: any) => {
            const newConfig = { ...prev, ...updates };

            // Deep merge themeConfig
            if (updates.themeConfig) {
                newConfig.themeConfig = { ...prev.themeConfig, ...updates.themeConfig };
            }

            // Handle sectionsVisibility (Array replacement vs Object merge)
            if (updates.sectionsVisibility) {
                if (Array.isArray(updates.sectionsVisibility)) {
                    newConfig.sectionsVisibility = updates.sectionsVisibility;
                } else {
                    newConfig.sectionsVisibility = { ...prev.sectionsVisibility, ...updates.sectionsVisibility };
                }
            }

            return newConfig;
        });
    };

    const handleSave = async () => {
        if (isStandardPlanUser(user) && isPremiumOnlyTemplate(config.templateId)) {
            alert(
                'This theme is Premium-only. Pick a Standard theme below or upgrade on the Subscription page.'
            );
            return;
        }
        try {
            setSaving(true);
            const { id, tenantId, createdAt, updatedAt, tenant, ...payload } = config;
            await api.patch('/site-config', payload);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err: any) {
            console.error('Failed to save config:', err);
            const msg = err.response?.data?.message || 'Failed to save configuration';
            alert(`Error: ${msg}`);
        } finally {
            setSaving(false);
        }
    };

    const updateSection = (id: string, field: string, value: any) => {
        if (!Array.isArray(config.sectionsVisibility)) return;

        const newSections = config.sectionsVisibility.map((s: Section) => {
            if (s.id !== id) return s;
            return {
                ...s,
                content: { ...s.content, [field]: value }
            };
        });

        updateConfigLocal({ sectionsVisibility: newSections });
    };

    const toggleSectionVisibility = (id: string) => {
        if (!Array.isArray(config.sectionsVisibility)) return;
        const newSections = config.sectionsVisibility.map((s: Section) => {
            if (s.id !== id) return s;
            return { ...s, visible: !s.visible };
        });
        updateConfigLocal({ sectionsVisibility: newSections });
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        if (!Array.isArray(config.sectionsVisibility)) return;
        const sections = [...config.sectionsVisibility];
        if (direction === 'up' && index > 0) {
            [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]];
        } else if (direction === 'down' && index < sections.length - 1) {
            [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
        }
        // Update order property
        const reordered = sections.map((s, i) => ({ ...s, order: i }));
        updateConfigLocal({ sectionsVisibility: reordered });
    };

    const deleteSection = (id: string) => {
        if (!Array.isArray(config.sectionsVisibility)) return;
        if (!confirm('Are you sure you want to delete this section?')) return;
        const filtered = config.sectionsVisibility.filter((s: Section) => s.id !== id);
        updateConfigLocal({ sectionsVisibility: filtered });
        if (editingSectionId === id) setEditingSectionId(null);
    };

    const addSection = (type: Section['type']) => {
        if (!Array.isArray(config.sectionsVisibility)) return;
        const newSection: Section = {
            id: `${type}-${Date.now()}`,
            type,
            title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            visible: true,
            order: config.sectionsVisibility.length,
            content: {}
        };
        updateConfigLocal({ sectionsVisibility: [...config.sectionsVisibility, newSection] });
        setEditingSectionId(newSection.id);
        setActiveTab('content');
    };

    const getActiveSection = () => {
        if (!Array.isArray(config.sectionsVisibility)) return null;
        return config.sectionsVisibility.find((s: Section) => s.id === editingSectionId);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-black text-gray-400">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                <span>Entering Design Mode...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-gray-400 p-6 text-center">
            <Settings size={48} className="mb-4 text-red-500 opacity-50" />
            <p className="text-xl font-bold text-white mb-2">Editor Error</p>
            <p className="max-w-md mb-6">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold transition-colors"
            >
                Retry Editor
            </button>
        </div>
    );

    if (!config) return null;

    const activeSection = getActiveSection();

    return (
        <div className="relative h-screen flex flex-col bg-black overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center gap-4 px-5 py-3 bg-gray-950 border-b border-white/10 z-30 flex-shrink-0">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
                </button>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-purple-400">Website Editor</span>
            </div>

            {isTemplateLockedForStandardUser(user, config.templateId) && (
                <div className="flex-shrink-0 px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/30 text-amber-100 text-xs flex items-center justify-between gap-4">
                    <span>
                        This site uses a <strong className="text-white">Premium</strong> theme. Switch to a Standard
                        theme to save changes, or upgrade to unlock every theme.
                    </span>
                    <button
                        type="button"
                        onClick={() => navigate('/subscription')}
                        className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 font-bold uppercase tracking-wider text-amber-50 border border-amber-500/40"
                    >
                        Upgrade
                    </button>
                </div>
            )}

            {/* Editor Body */}
            <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Controls */}
            <div className="w-80 border-r border-white/10 flex flex-col bg-gray-950/50 backdrop-blur-xl z-20">
                {/* Tabs */}
                <div className="flex border-b border-white/10">
                    {[
                        { id: 'design', icon: <Palette size={18} />, label: 'Design' },
                        { id: 'sections', icon: <Layers size={18} />, label: 'Sections' },
                        { id: 'content', icon: <Settings size={18} />, label: 'Settings' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex flex-col items-center py-4 transition-all ${activeTab === tab.id ? 'bg-white/5 text-purple-500' : 'text-gray-500 hover:text-white'}`}
                        >
                            {tab.icon}
                            <span className="text-[10px] uppercase font-black mt-1 tracking-widest">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                    {activeTab === 'design' && (
                        <>
                            <ControlSection title="Template">
                                <div className="grid grid-cols-1 gap-2">
                                    {EDITOR_TEMPLATES.map((t) => {
                                        const locked = isTemplateLockedForStandardUser(user, t);
                                        return (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => {
                                                    if (locked) {
                                                        navigate('/subscription');
                                                        return;
                                                    }
                                                    updateConfigLocal({ templateId: t });
                                                }}
                                                className={`w-full p-4 rounded-xl border text-left flex justify-between items-center group transition-all ${config.templateId === t ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 hover:border-white/20'} ${locked && config.templateId !== t ? 'opacity-50 cursor-pointer' : ''}`}
                                            >
                                                <span className="capitalize text-sm font-bold flex items-center gap-2">
                                                    {t.replace(/-/g, ' ')}
                                                    {locked && (
                                                        <Lock size={14} className="text-amber-400 shrink-0" aria-hidden />
                                                    )}
                                                </span>
                                                {locked ? (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90">
                                                        Premium
                                                    </span>
                                                ) : (
                                                    <ChevronRight size={16} className={`group-hover:translate-x-1 transition-transform ${config.templateId === t ? 'text-purple-500' : 'text-gray-600'}`} />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </ControlSection>

                            <ControlSection title="Brand Accent">
                                <div className="flex flex-wrap gap-3">
                                    {['#a855f7', '#3b82f6', '#ec4899', '#eab308', '#22c55e', '#D4AF37', '#ff0000'].map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => updateConfigLocal({ colorPalette: c })}
                                            className={`w-10 h-10 rounded-full border-2 border-white/10 ${config.colorPalette === c ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : 'opacity-60 hover:opacity-100'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </ControlSection>

                            <ControlSection title="Background Style">
                                <div className="grid grid-cols-2 gap-2">
                                    {['dark', 'light', 'gradient', 'image'].map(style => (
                                        <button
                                            key={style}
                                            onClick={() => updateConfigLocal({ themeConfig: { ...config.themeConfig, backgroundStyle: style } })}
                                            className={`p-3 rounded-lg border text-xs font-bold uppercase ${config.themeConfig?.backgroundStyle === style ? 'border-purple-500 bg-purple-500/20' : 'border-white/10 hover:bg-white/5'}`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </ControlSection>

                            <ControlSection title="Button Style">
                                <div className="grid grid-cols-3 gap-2">
                                    {['rounded', 'sharp', 'pill'].map(style => (
                                        <button
                                            key={style}
                                            onClick={() => updateConfigLocal({ themeConfig: { ...config.themeConfig, buttonStyle: style } })}
                                            className={`p-3 rounded-lg border text-xs font-bold uppercase ${config.themeConfig?.buttonStyle === (style || 'rounded') ? 'border-purple-500 bg-purple-500/20' : 'border-white/10 hover:bg-white/5'}`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4 flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                    <span className="text-xs uppercase font-bold text-gray-400">Glow Effect</span>
                                    <button
                                        onClick={() => updateConfigLocal({ themeConfig: { ...config.themeConfig, buttonEffect: config.themeConfig?.buttonEffect === 'glow' ? 'none' : 'glow' } })}
                                        className={`w-10 h-6 rounded-full transition-colors flex items-center p-1 ${config.themeConfig?.buttonEffect === 'glow' ? 'bg-purple-500 justify-end' : 'bg-white/10 justify-start'}`}
                                    >
                                        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                                    </button>
                                </div>
                            </ControlSection>
                        </>
                    )}

                    {activeTab === 'sections' && Array.isArray(config.sectionsVisibility) && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                {config.sectionsVisibility.map((section: Section, index: number) => (
                                    <div
                                        key={section.id}
                                        onClick={() => { setEditingSectionId(section.id); setActiveTab('content'); }}
                                        className={`flex items-center justify-between p-3 bg-white/5 rounded-xl border transition-all cursor-pointer group ${editingSectionId === section.id ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 hover:border-white/20'}`}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="p-2 bg-black/40 rounded-lg text-gray-400">
                                                {section.type === 'hero' && <ImageIcon size={14} />}
                                                {section.type === 'about' && <Type size={14} />}
                                                {section.type === 'events' && <Layers size={14} />}
                                                {!['hero', 'about', 'events'].includes(section.type) && <Settings size={14} />}
                                            </div>
                                            <span className="text-sm font-bold truncate">{section.title || section.type}</span>
                                        </div>

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(section.id); }}
                                                className={`p-1.5 rounded hover:bg-white/10 ${section.visible ? 'text-green-400' : 'text-gray-600'}`}
                                            >
                                                {section.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                                            </button>
                                            <div className="flex flex-col">
                                                <button onClick={(e) => { e.stopPropagation(); moveSection(index, 'up'); }} disabled={index === 0} className="p-0.5 hover:text-white text-gray-500 disabled:opacity-30"><ArrowUp size={10} /></button>
                                                <button onClick={(e) => { e.stopPropagation(); moveSection(index, 'down'); }} disabled={index === config.sectionsVisibility.length - 1} className="p-0.5 hover:text-white text-gray-500 disabled:opacity-30"><ArrowDown size={10} /></button>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                                                className="p-1.5 hover:text-red-400 text-gray-600"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                className="w-full py-3 border border-dashed border-white/20 rounded-xl text-gray-500 hover:text-white hover:border-white/40 hover:bg-white/5 flex items-center justify-center gap-2 transition-all"
                                onClick={() => addSection('about')} // Default to adding generic section for MVP
                            >
                                <Plus size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest">Add Section</span>
                            </button>
                        </div>
                    )}

                    {activeTab === 'content' && (
                        <div className="space-y-6">
                            {activeSection ? (
                                <>
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <span className="text-xs font-black uppercase tracking-widest text-purple-400">{activeSection.type}</span>
                                        <span className="text-sm font-bold">{activeSection.title}</span>
                                    </div>

                                    {/* Generic Content Fields based on Type */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Section Title</label>
                                            <input
                                                value={activeSection.content.title || ''}
                                                onChange={(e) => updateSection(activeSection.id, 'title', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 outline-none"
                                            />
                                        </div>

                                        {activeSection.type === 'hero' && (
                                            <>
                                                <div>
                                                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Subtitle</label>
                                                    <textarea
                                                        value={activeSection.content.subtitle || ''}
                                                        onChange={(e) => updateSection(activeSection.id, 'subtitle', e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 outline-none h-20 resize-none"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Background Type</label>
                                                    <div className="flex gap-2 mt-1 mb-2">
                                                        <button
                                                            onClick={() => updateSection(activeSection.id, 'backgroundType', 'image')}
                                                            className={`flex-1 py-2 rounded text-xs border ${activeSection.content.backgroundType !== 'video' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'border-white/10 text-gray-500'}`}
                                                        >
                                                            Image
                                                        </button>
                                                        <button
                                                            onClick={() => updateSection(activeSection.id, 'backgroundType', 'video')}
                                                            className={`flex-1 py-2 rounded text-xs border ${activeSection.content.backgroundType === 'video' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'border-white/10 text-gray-500'}`}
                                                        >
                                                            Video
                                                        </button>
                                                    </div>
                                                </div>

                                                {activeSection.content.backgroundType === 'video' ? (
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Video URL</label>
                                                        <input
                                                            value={activeSection.content.videoUrl || ''}
                                                            onChange={(e) => updateSection(activeSection.id, 'videoUrl', e.target.value)}
                                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs focus:border-purple-500 outline-none"
                                                            placeholder="/uploads/video.mp4 or https://..."
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Background Image URL</label>
                                                        <input
                                                            value={activeSection.content.backgroundImageUrl || ''}
                                                            onChange={(e) => updateSection(activeSection.id, 'backgroundImageUrl', e.target.value)}
                                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs focus:border-purple-500 outline-none"
                                                            placeholder="/uploads/hero.jpg or https://..."
                                                        />
                                                    </div>
                                                )}

                                                <div>
                                                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Button Text</label>
                                                    <input
                                                        value={activeSection.content.ctaText || ''}
                                                        onChange={(e) => updateSection(activeSection.id, 'ctaText', e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 outline-none"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {activeSection.type === 'about' && (
                                            <>
                                                <div>
                                                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Text Content</label>
                                                    <textarea
                                                        value={activeSection.content.text || ''}
                                                        onChange={(e) => updateSection(activeSection.id, 'text', e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 outline-none h-32 resize-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Image URL</label>
                                                    <input
                                                        value={activeSection.content.imageUrl || ''}
                                                        onChange={(e) => updateSection(activeSection.id, 'imageUrl', e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs focus:border-purple-500 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Layout</label>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => updateSection(activeSection.id, 'layout', 'left')} className={`px-4 py-2 rounded border ${activeSection.content.layout !== 'right' ? 'bg-purple-500/20 border-purple-500' : 'border-white/10'}`}>Left</button>
                                                        <button onClick={() => updateSection(activeSection.id, 'layout', 'right')} className={`px-4 py-2 rounded border ${activeSection.content.layout === 'right' ? 'bg-purple-500/20 border-purple-500' : 'border-white/10'}`}>Right</button>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {activeSection.type === 'events' && (
                                            <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg text-xs text-purple-300">
                                                Event list is populated automatically from your events dashboard.
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-20 text-gray-500">
                                    <Layers size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-sm">Select a section from the "Sections" tab or click an element in the preview to edit its properties.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-4 border-t border-white/10 flex space-x-2">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 btn-primary py-3 flex items-center justify-center space-x-2"
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <><Save size={18} /> <span>Save Changes</span></>
                        )}
                    </button>
                </div>
            </div>

            {/* Right Side - Preview */}
            <div className="flex-1 bg-gray-900 overflow-hidden flex flex-col pt-4">
                {/* Device Selector */}
                <div className="flex justify-center mb-4 space-x-2">
                    <button
                        onClick={() => setViewMode('desktop')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'desktop' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                    >
                        <Monitor size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('mobile')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'mobile' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                    >
                        <Smartphone size={20} />
                    </button>
                </div>

                {/* Preview Container */}
                <div className="flex-1 flex justify-center p-4 pt-0 overflow-y-auto overflow-x-hidden relative">
                    <AnimatePresence>
                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="absolute top-10 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl pointer-events-none flex items-center space-x-2"
                            >
                                <Save size={18} />
                                <span>Changes Saved Successfully!</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div
                        className={`bg-white transition-all duration-500 origin-top shadow-2xl relative ${viewMode === 'mobile'
                            ? 'w-[375px] max-w-full h-full max-h-[820px] rounded-[30px] border border-black/80'
                            : 'w-full max-w-[1400px] h-full max-h-[900px] rounded-t-2xl'
                            }`}
                    >
                        <div 
                            className="absolute inset-0 overflow-y-auto scrollbar-hide rounded-[30px]"
                            style={{ transform: 'translateZ(0)' }}
                        >
                            <ErrorBoundary>
                                <PageRenderer
                                    config={config}
                                    tenant={tenant}
                                    events={events}
                                    onEdit={(id) => {
                                        setEditingSectionId(id);
                                        setActiveTab('content');
                                    }}
                                />
                            </ErrorBoundary>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}

function ControlSection({ title, children }: any) {
    return (
        <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5 pb-2">{title}</h3>
            {children}
        </div>
    );
}
