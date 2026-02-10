
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: '燃星日志',
        short_name: '燃星日志',
        description: '您的专业烹饪助手',
        start_url: '/',
        display: 'standalone',
        background_color: '#fef2f2',
        theme_color: '#fda4af',
        icons: [
            {
                src: '/icon',
                sizes: '32x32',
                type: 'image/png',
            },
            {
                src: '/icon?size=192',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable'
            },
            {
                src: '/icon?size=512',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
            },
            {
                src: '/apple-icon',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
    }
}
