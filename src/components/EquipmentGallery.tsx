import Link from "next/link";

const equipmentPhotos = [
    {
        url: "/blog-images/string_blades.png",
        alt: "Nittaku Acoustic vs Violin",
        label: "Nittaku Acoustic vs Violin",
        sublabel: "Blade Comparison",
        href: "/blog/nittaku-acoustic-vs-violin",
    },
    {
        url: "/blog-images/euro_tensors.png",
        alt: "Tibhar MX-P vs Rasanter R47",
        label: "Tibhar MX-P vs R47",
        sublabel: "Rubber Clash",
        href: "/blog/tibhar-evolution-mxp-vs-andro-rasanter-r47",
    },
    {
        url: "/blog-images/joola_rackets.png",
        alt: "JOOLA Carbon X Pro vs Infinity Carbon",
        label: "JOOLA Pre-Assembled",
        sublabel: "Racket Review",
        href: "/blog/joola-carbon-x-pro-vs-infinity-carbon",
    },
    {
        url: "/blog-images/clipper_wood.png",
        alt: "Stiga Clipper Wood Guide",
        label: "Stiga Clipper Wood",
        sublabel: "Classic Blades",
        href: "/blog/stiga-clipper-wood-guide",
    },
];

const EquipmentGallery = () => {
    return (
        <section className="py-16 lg:py-24 bg-muted/30" aria-label="Featured guides">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="text-center mb-10 space-y-3">
                    <h2 className="font-headline text-3xl lg:text-4xl font-bold text-foreground">
                        Latest Expert Reviews
                    </h2>
                    <p className="text-muted-foreground text-base lg:text-lg max-w-xl mx-auto">
                        Dive deep into our latest breakdowns, comparing top-tier equipment to help you build the perfect racket.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                    {equipmentPhotos.map((photo) => (
                        <Link
                            key={photo.href + photo.label}
                            href={photo.href}
                            className="group relative overflow-hidden rounded-xl aspect-[3/4] block"
                        >
                            <img
                                src={photo.url}
                                alt={photo.alt}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            {/* Labels */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1">
                                <span className="block text-xs font-semibold uppercase tracking-widest text-accent">
                                    {photo.sublabel}
                                </span>
                                <span className="block text-white font-semibold text-sm lg:text-base leading-tight drop-shadow">
                                    {photo.label}
                                </span>
                            </div>
                            {/* Hover accent border */}
                            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-accent/60 transition-colors duration-300" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EquipmentGallery;
