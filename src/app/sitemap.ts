import { MetadataRoute } from 'next';
import { getAllPostIds } from '@/lib/blog';
import { fetchInventory } from '@/lib/googleSheets';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.toptabletennispaddle.com';

    // Static routes
    const staticRoutes = [
        '',
        '/configurator',
        '/quiz',
        '/blog',
        '/compare',
        '/about',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Blog routes
    const blogPosts = getAllPostIds().map((id) => ({
        url: `${baseUrl}/blog/${id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    // Dynamic Product routes
    let productRoutes: MetadataRoute.Sitemap = [];
    try {
        const inventory = await fetchInventory();

        const bladeRoutes = (inventory.blades || []).map((b) => ({
            url: `${baseUrl}/product/blade/${b.Blade_Name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        }));

        const rubberRoutes = (inventory.rubbers || []).map((r) => ({
            url: `${baseUrl}/product/rubber/${r.Rubber_Name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        }));

        const racketRoutes = (inventory.preAssembledRackets || []).map((r) => ({
            url: `${baseUrl}/product/racket/${r.Racket_Name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        }));

        productRoutes = [...bladeRoutes, ...rubberRoutes, ...racketRoutes];
    } catch (error) {
        console.error('Error fetching inventory for sitemap:', error);
    }

    return [...staticRoutes, ...blogPosts, ...productRoutes];
}
