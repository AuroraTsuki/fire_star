
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: '燃星日志',
        short_name: '燃星日志',
        description: '您的专业烹饪助手',
        start_url: '/',
        display: 'standalone',
        background_color: '#f8f7f6',
        theme_color: '#ee8c2b',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
