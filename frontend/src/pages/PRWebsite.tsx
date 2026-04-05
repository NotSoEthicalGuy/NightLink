import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api'
import PageRenderer from '../components/templates/PageRenderer'

export default function PRWebsite() {
    const { username } = useParams()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // We use the full URL because this might be called without auth
                const res = await api.get(`/public/site/${username}`)
                setData(res.data)
            } catch (err) {
                console.error('Failed to load PR site', err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        if (username) fetchData()
    }, [username])

    useEffect(() => {
        if (data) {
            // SEO
            document.title = `${data.tenant.profile?.displayName || data.tenant.name} | NightLink PR`;

            // Branding Colors
            const root = document.documentElement;
            const primary = data.config?.colorPalette;
            const secondary = data.config?.secondaryColor;
            if (primary?.startsWith('#')) root.style.setProperty('--primary-color', primary);
            if (secondary?.startsWith('#')) root.style.setProperty('--secondary-color', secondary);
        }
    }, [data])

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (error || !data) return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-4xl font-display font-bold mb-4">Site Not Found</h1>
            <p className="text-gray-400 max-w-md">The PR website you're looking for doesn't exist or hasn't been published yet.</p>
            <a href="/" className="mt-8 btn-primary">Return Home</a>
        </div>
    )

    return (
        <PageRenderer
            config={data.config}
            tenant={data.tenant}
            events={data.events}
        />
    )
}
