import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchBlades, fetchReviews, slugify } from '@/lib/googleSheets';
import { ArrowLeft, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductBackButton from '@/components/Navigation/ProductBackButton';

export const revalidate = 3600; // ISR — refresh hourly

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
    const blades = await fetchBlades();
    return blades.map(b => ({ slug: slugify(b.Blade_Name) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const blades = await fetchBlades();
    const blade = blades.find(b => slugify(b.Blade_Name) === slug);
    if (!blade) return {};

    return {
        title: `${blade.Blade_Name} Blade Review | Price & Specs`,
        description: `${blade.Blade_Name} table tennis blade: ${(blade.Blade_Description || "").slice(0, 140)}. Speed ${blade.Blade_Speed}, Control ${blade.Blade_Control}. Price: $${blade.Blade_Price}.`,
        alternates: {
            canonical: `/product/blade/${slug}`,
        },
        openGraph: {
            title: `${blade.Blade_Name} Review | TopTableTennisPaddle`,
            description: blade.Blade_Description,
            ...(blade.Blade_Image ? { images: [{ url: blade.Blade_Image }] } : {}),
        },
    };
}

function StatBar({ label, value }: { label: string; value: number }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-semibold">{value}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}

export default async function BladePage({ params }: Props) {
    const { slug } = await params;
    const [blades, reviews] = await Promise.all([fetchBlades(), fetchReviews()]);
    const blade = blades.find(b => slugify(b.Blade_Name) === slug);
    if (!blade) notFound();

    const bladeReviews = reviews.filter(r =>
        r.blade.toLowerCase().includes(blade.Blade_Name.toLowerCase()) ||
        blade.Blade_Name.toLowerCase().includes(r.blade.toLowerCase())
    );
    const avgRating = bladeReviews.length
        ? bladeReviews.reduce((sum, r) => sum + r.rating, 0) / bladeReviews.length
        : null;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: blade.Blade_Name,
        description: blade.Blade_Description,
        image: blade.Blade_Image || undefined,
        offers: {
            '@type': 'Offer',
            price: blade.Blade_Price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
        },
        ...(avgRating && bladeReviews.length > 0 ? {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: avgRating.toFixed(1),
                reviewCount: bladeReviews.length,
            },
        } : {}),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-3xl">
                <ProductBackButton />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Image */}
                    <div className="product-img-wrap aspect-square bg-muted rounded-2xl flex items-center justify-center overflow-hidden">
                        {blade.Blade_Image ? (
                            <img src={blade.Blade_Image} alt={`${blade.Blade_Name} Table Tennis Blade`} className="product-img w-full h-full object-contain p-4" />
                        ) : (
                            <span className="text-8xl">🏓</span>
                        )}
                    </div>

                    {/* Info */}
                    <div className="space-y-4">
                        <div>
                            <div className="flex flex-wrap gap-2 mb-2">
                                <Badge variant="secondary">{blade.Blade_Level}</Badge>
                                <Badge variant="outline">{blade.Blade_Style}</Badge>
                            </div>
                            <h1 className="text-2xl font-bold">{blade.Blade_Name}</h1>
                            {avgRating && (
                                <div className="flex items-center gap-1 mt-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} className={`h-4 w-4 ${s <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                                    ))}
                                    <span className="text-sm text-muted-foreground ml-1">({bladeReviews.length} reviews)</span>
                                </div>
                            )}
                        </div>

                        <p className="text-2xl font-bold text-primary">${blade.Blade_Price.toFixed(2)}</p>

                        <div className="space-y-3">
                            <StatBar label="Speed" value={blade.Blade_Speed} />
                            <StatBar label="Spin" value={blade.Blade_Spin} />
                            <StatBar label="Control" value={blade.Blade_Control} />
                            <StatBar label="Power" value={blade.Blade_Power} />
                            {blade.Blade_Stiffness !== undefined && <StatBar label="Stiffness" value={blade.Blade_Stiffness} />}
                        </div>

                        <div className="pt-4 space-y-4">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Technical Specifications</h2>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground/60">Brand</p>
                                    <p className="text-sm font-medium">{blade.Blade_Brand || "Generic"}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground/60">Material</p>
                                    <p className="text-sm font-medium">{blade.Blade_Material || "All-Wood"}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground/60">Weight</p>
                                    <p className="text-sm font-medium">{blade.Blade_Weight ? `${blade.Blade_Weight}g` : "Standard"}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground/60">Grip Options</p>
                                    <p className="text-sm font-medium">{blade.Blade_Grip?.join(", ") || "FL"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {blade.Blade_Description && !blade.Blade_Description.includes('SEO') && (
                    <Card className="p-6 mt-8 border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
                        <h2 className="font-bold mb-3 flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-primary rounded-full" />
                            About this Blade
                        </h2>
                        <p className="text-muted-foreground leading-relaxed text-sm">{blade.Blade_Description}</p>
                    </Card>
                )}

                {/* Reviews */}
                {bladeReviews.length > 0 && (
                    <div className="mt-8 space-y-4">
                        <h2 className="text-lg font-semibold">Player Reviews</h2>
                        <div className="space-y-3">
                            {bladeReviews.map((r, i) => (
                                <Card key={i} className="p-4 space-y-2">
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                                        ))}
                                        <span className="text-xs text-muted-foreground">— {r.reviewerName}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground italic">&ldquo;{r.reviewText}&rdquo;</p>
                                    {(r.fhRubber || r.bhRubber) && (
                                        <p className="text-xs text-muted-foreground">Used with: {[r.fhRubber, r.bhRubber].filter(Boolean).join(' + ')}</p>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
