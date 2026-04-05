import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Upload, Image as ImageIcon, X, Calendar } from 'lucide-react'
import api from '../../../lib/api'

export default function CreateEvent() {
    const navigate = useNavigate()
    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            eventDate: '',
            eventTime: '',
            venueName: '',
            venueAddress: '',
            description: '',
            coverImageUrl: '',
            isPublished: false,
            isDraft: true,
            ticketTypes: [] as any[]
        }
    })

    const isDraft = watch('isDraft')
    const isPublished = watch('isPublished')

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "ticketTypes"
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        // Fetch profile to get default ticket templates
        api.get('/profile').then(res => {
            if (res.data.defaultTicketTemplates && res.data.defaultTicketTemplates.length > 0) {
                replace(res.data.defaultTicketTemplates);
            } else {
                append({ name: 'General Admission', price: 0, totalQuantity: 100 });
            }
        });
    }, []);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                setUploadingImage(true);
                const formData = new FormData();
                formData.append('file', file);

                const res = await api.post('/profile/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                const imageUrl = res.data.url;
                setImagePreview(imageUrl);
                setValue('coverImageUrl', imageUrl);
            } catch (err) {
                alert('Failed to upload image');
            } finally {
                setUploadingImage(false);
            }
        }
    };

    const onSubmit = async (data: any) => {
        try {
            // Ensure numbers are numbers
            data.ticketTypes = data.ticketTypes.map((t: any) => ({
                ...t,
                price: parseFloat(t.price),
                totalQuantity: parseInt(t.totalQuantity)
            }))

            await api.post('/events', data)
            navigate('/dashboard/events')
        } catch (error) {
            console.error(error)
            alert('Failed to create event')
        }
    }

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900/50 flex items-center justify-center text-gold border border-white/10 shadow-glow">
                    <Calendar size={24} />
                </div>
                <div>
                    <h1 className="text-4xl font-display font-medium text-white mb-1">Create Event</h1>
                    <p className="text-zinc-500 font-light">Curate your next high-end nightlife experience</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Image Upload */}
                <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-[32px] shadow-2xl backdrop-blur-md">
                    <h2 className="text-xl font-display font-medium text-gold mb-6">Visual Identity</h2>

                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />

                        {uploadingImage ? (
                            <div className="border-2 border-dashed border-gold/30 rounded-[24px] p-12 flex flex-col items-center justify-center bg-gold/5 animate-pulse">
                                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" />
                                <p className="font-bold uppercase tracking-widest text-xs text-gold">Uploading Asset...</p>
                            </div>
                        ) : imagePreview ? (
                            <div className="relative group rounded-[24px] overflow-hidden aspect-video border border-white/10 shadow-lg">
                                <img src={imagePreview.startsWith('/') ? `http://localhost:3001${imagePreview}` : imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                    <div className="flex flex-col items-center">
                                        <Upload className="mb-2 text-gold" />
                                        <span className="font-bold uppercase text-xs tracking-widest text-white">Update Cover</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setImagePreview(null);
                                        setValue('coverImageUrl', '');
                                    }}
                                    className="absolute top-4 right-4 z-20 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-all shadow-lg backdrop-blur-sm"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-white/10 rounded-[24px] p-16 flex flex-col items-center justify-center bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-gold/30 transition-all group">
                                <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-all border border-white/5 group-hover:border-gold/30 group-hover:shadow-glow">
                                    <ImageIcon className="text-zinc-500 group-hover:text-gold transition-colors" size={32} />
                                </div>
                                <p className="font-medium text-lg text-white group-hover:text-gold transition-colors">Upload Cover Image</p>
                                <p className="text-zinc-600 text-xs mt-2 font-bold uppercase tracking-widest">Recommended: 1920x1080px</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Event Details */}
                <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-[32px] shadow-2xl backdrop-blur-md space-y-8">
                    <h2 className="text-xl font-display font-medium text-gold">Event Details</h2>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Event Name</label>
                        <input {...register('name', { required: true })} className="bg-zinc-900/50 border border-white/10 rounded-xl px-6 py-4 w-full focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all text-lg font-medium text-white placeholder-zinc-700" placeholder="e.g. Midnight Gala" />
                        {errors.name && <span className="text-red-400 text-xs font-medium mt-2 block">Event name is required</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Date</label>
                            <input type="date" {...register('eventDate', { required: true })} className="bg-zinc-900/50 border border-white/10 rounded-xl px-6 py-4 w-full focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all text-white font-medium" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Time</label>
                            <input type="time" {...register('eventTime', { required: true })} className="bg-zinc-900/50 border border-white/10 rounded-xl px-6 py-4 w-full focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all text-white font-medium" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Venue Name</label>
                            <input {...register('venueName', { required: true })} className="bg-zinc-900/50 border border-white/10 rounded-xl px-6 py-4 w-full focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all text-white font-medium placeholder-zinc-700" placeholder="e.g. The Grand Hall" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Address</label>
                            <input {...register('venueAddress', { required: true })} className="bg-zinc-900/50 border border-white/10 rounded-xl px-6 py-4 w-full focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all text-white font-medium placeholder-zinc-700" placeholder="Full address" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Description</label>
                        <textarea {...register('description')} className="bg-zinc-900/50 border border-white/10 rounded-xl px-6 py-4 w-full h-32 focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all text-zinc-300 font-medium placeholder-zinc-700 resize-none" placeholder="Describe the event details..." />
                    </div>

                    <div className="grid grid-cols-2 gap-6 p-6 bg-zinc-900/30 rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                            <div className="flex-1">
                                <p className="font-medium text-sm text-white">Draft Mode</p>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Internal only</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setValue('isDraft', !isDraft)}
                                className={`w-12 h-6 rounded-full transition-all relative ${isDraft ? 'bg-amber-500/80 shadow-glow' : 'bg-zinc-800'}`}
                            >
                                <motion.span
                                    animate={{ x: isDraft ? 24 : 0 }}
                                    className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                            <div className="flex-1">
                                <p className="font-medium text-sm text-white">Published</p>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Visible to public</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setValue('isPublished', !isPublished)
                                    if (!isPublished) setValue('isDraft', false)
                                }}
                                className={`w-12 h-6 rounded-full transition-all relative ${isPublished ? 'bg-emerald-500 shadow-glow' : 'bg-zinc-800'}`}
                            >
                                <motion.span
                                    animate={{ x: isPublished ? 24 : 0 }}
                                    className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ticket Types */}
                <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-[32px] shadow-2xl backdrop-blur-md">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-display font-medium text-gold">Ticket Types</h2>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Configure pricing tiers</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => append({ name: '', price: 0, totalQuantity: 100 })}
                            className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border border-white/10 transition-all hover:border-gold/30 hover:text-gold"
                        >
                            + Add Tier
                        </button>
                    </div>

                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={field.id}
                                className="flex gap-6 items-start p-6 bg-zinc-900/30 rounded-2xl border border-white/5 hover:border-gold/20 transition-all"
                            >
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Name</label>
                                        <input {...register(`ticketTypes.${index}.name` as const, { required: true })} className="bg-black/20 border border-white/10 rounded-lg px-4 py-3 w-full focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all text-sm font-medium text-white placeholder-zinc-700" placeholder="e.g. General Admission" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Price ($)</label>
                                            <input type="number" step="0.01" {...register(`ticketTypes.${index}.price` as const, { required: true, min: 0 })} className="bg-black/20 border border-white/10 rounded-lg px-4 py-3 w-full focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all text-sm font-medium text-white" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Quantity</label>
                                            <input type="number" {...register(`ticketTypes.${index}.totalQuantity` as const, { required: true, min: 1 })} className="bg-black/20 border border-white/10 rounded-lg px-4 py-3 w-full focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all text-sm font-medium text-white" />
                                        </div>
                                    </div>
                                </div>
                                <button type="button" onClick={() => remove(index)} className="p-2 bg-zinc-800 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all border border-white/5 self-center">
                                    <X size={18} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end items-center gap-6 pt-6">
                    <button type="button" onClick={() => navigate('/dashboard/events')} className="text-zinc-500 font-bold uppercase tracking-widest text-xs hover:text-white transition-all">Cancel</button>
                    <button type="submit" className="bg-gold hover:bg-gold/90 text-midnight px-10 py-4 rounded-xl font-bold text-sm tracking-wide shadow-glow transition-all active:scale-[0.98] flex items-center gap-2">
                        {isPublished ? 'Launch Event' : 'Save Draft'}
                        <span className="text-lg">→</span>
                    </button>
                </div>
            </form>
        </div>
    )
}
