import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchRubbers, fetchReviews, slugify } from '@/lib/googleSheets';
import { ArrowLeft, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductBackButton from '@/components/Navigation/ProductBackButton';

export const revalidate = 3600;

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
    const rubbers = await fetchRubbers();
    return rubbers.map(r => ({ slug: slugify(r.Rubber_Name) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const rubbers = await fetchRubbers();
    const rubber = rubbers.find(r => slugify(r.Rubber_Name) === slug);
    if (!rubber) return {};

    return {
        title: `${rubber.Rubber_Name} Review | Price & Specs`,
        description: `${rubber.Rubber_Name} table tennis rubber: ${(rubber.Rubber_Description || "").slice(0, 140)}. Speed ${rubber.Rubber_Speed}, Spin ${rubber.Rubber_Spin}. Price: $${rubber.Rubber_Price}.`,
        alternates: {
            canonical: `/product/rubber/${slug}`,
        },
        openGraph: {
            title: `${rubber.Rubber_Name} Review | TopTableTennisPaddle`,
            description: rubber.Rubber_Description,
            ...(rubber.Rubber_Image ? { images: [{ url: rubber.Rubber_Image }] } : {}),
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
                <div className="h-full bg-primary rounded-full" style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}

export default async function RubberPage({ params }: Props) {
    const { slug } = await params;
    const [rubbers, reviews] = await Promise.all([fetchRubbers(), fetchReviews()]);
    const rubber = rubbers.find(r => slugify(r.Rubber_Name) === slug);
    if (!rubber) notFound();

    const rubberReviews = reviews.filter(r =>
        r.fhRubber.toLowerCase().includes(rubber.Rubber_Name.toLowerCase()) ||
        r.bhRubber.toLowerCase().includes(rubber.Rubber_Name.toLowerCase()) ||
        rubber.Rubber_Name.toLowerCase().includes(r.fhRubber.toLowerCase()) ||
        rubber.Rubber_Name.toLowerCase().includes(r.bhRubber.toLowerCase())
    );
    const avgRating = rubberReviews.length
        ? rubberReviews.reduce((sum, r) => sum + r.rating, 0) / rubberReviews.length
        : null;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: rubber.Rubber_Name,
        description: rubber.Rubber_Description,
        image: rubber.Rubber_Image || undefined,
        offers: {
            '@type': 'Offer',
            price: rubber.Rubber_Price,
            priceCurrency: 'USD',
        },
        ...(avgRating && rubberReviews.length > 0 ? {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: avgRating.toFixed(1),
                reviewCount: rubberReviews.length,
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
                    <div className="product-img-wrap aspect-square bg-muted rounded-2xl flex items-center justify-center overflow-hidden">
                        {rubber.Rubber_Image ? (
                            <img src={rubber.Rubber_Image} alt={`${rubber.Rubber_Name} Table Tennis Rubber`} className="product-img w-full h-full object-contain p-4" />
                        ) : (
                            <span className="text-8xl">🏓</span>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex flex-wrap gap-2 mb-2">
                                <Badge variant="secondary">{rubber.Rubber_Level}</Badge>
                                <Badge variant="outline">{rubber.Rubber_Style}</Badge>
                            </div>
                            <h1 className="text-2xl font-bold">{rubber.Rubber_Name}</h1>
                            {avgRating && (
                                <div className="flex items-center gap-1 mt-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} className={`h-4 w-4 ${s <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                                    ))}
                                    <span className="text-sm text-muted-foreground ml-1">({rubberReviews.length} reviews)</span>
                                </div>
                            )}
                        </div>

                        <p className="text-2xl font-bold text-primary">${rubber.Rubber_Price.toFixed(2)}</p>

                        <div className="space-y-3">
                            <StatBar label="Speed" value={rubber.Rubber_Speed} />
                            <StatBar label="Spin" value={rubber.Rubber_Spin} />
                            <StatBar label="Control" value={rubber.Rubber_Control} />
                            <StatBar label="Power" value={rubber.Rubber_Power} />
                        </div>

                        <div className="pt-4 space-y-4">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Technical Specifications</h2>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground/60">Brand</p>
                                    <p className="text-sm font-medium">{rubber.Rubber_Brand || "Generic"}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground/60">Hardness</p>
                                    <p className="text-sm font-medium">{rubber.Rubber_Hardness || "Medium"}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground/60">Throw Angle</p>
                                    <p className="text-sm font-medium">{rubber.Rubber_ThrowAngle || "Medium"}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground/60">Surface</p>
                                    <p className="text-sm font-medium">{rubber.Rubber_Surface || "Grippy"}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground/60">Weight</p>
                                    <p className="text-sm font-medium">{rubber.Rubber_Weight ? `${rubber.Rubber_Weight}g` : "Standard"}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground/60">Sponge Sizes</p>
                                    <p className="text-sm font-medium">{rubber.Rubber_Sponge_Sizes?.join(", ") || "MAX"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {rubber.Rubber_Description && !rubber.Rubber_Description.includes('SEO') && (
                    <Card className="p-6 mt-8 border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
                        <h2 className="font-bold mb-3 flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-primary rounded-full" />
                            About this Rubber
                        </h2>
                        <p className="text-muted-foreground leading-relaxed text-sm">{rubber.Rubber_Description}</p>
                    </Card>
                )}

                {rubberReviews.length > 0 && (
                    <div className="mt-8 space-y-4">
                        <h2 className="text-lg font-semibold">Player Reviews</h2>
                        <div className="space-y-3">
                            {rubberReviews.map((r, i) => (
                                <Card key={i} className="p-4 space-y-2">
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                                        ))}
                                        <span className="text-xs text-muted-foreground">— {r.reviewerName}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground italic">&ldquo;{r.reviewText}&rdquo;</p>
                                    {r.blade && <p className="text-xs text-muted-foreground">Blade: {r.blade}</p>}
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
