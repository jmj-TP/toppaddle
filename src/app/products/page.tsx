import ProductsClient from './ProductsClient';
import type { Metadata } from 'next';
import { fetchBlades, fetchRubbers } from '@/lib/googleSheets';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Table Tennis Equipment — Blades & Rubbers | TopPaddle',
    description: 'Browse our complete range of table tennis blades and rubbers. Compare specs, read reviews, and find the perfect equipment for your playing style.',
    keywords: ['table tennis blade', 'table tennis rubber', 'ping pong equipment', 'table tennis gear'],
    alternates: {
        canonical: "https://toppaddle.com/products",
    },
};

export default async function ProductsPage() {
    const [blades, rubbers] = await Promise.all([fetchBlades(), fetchRubbers()]);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Table Tennis Equipment — Blades & Rubbers',
        description: 'Browse table tennis blades and rubbers with full specs and player reviews.',
        url: 'https://toppaddle.com/products',
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ProductsClient initialBlades={blades} initialRubbers={rubbers} />
        </>
    );
}
