import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/lib/blog";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Table Tennis Guides - Expert Tips, Reviews & Equipment Advice",
    description: "Expert table tennis guides, equipment comparisons, and setup advice helping players choose the right gear.",
    alternates: {
        canonical: "https://toppaddle.com/blog",
    },
};

export default function Blog() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
            <StructuredData
                data={{
                    type: 'BreadcrumbList',
                    items: [
                        { name: 'Home', url: 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/' },
                        { name: 'Blog', url: 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/blog' }
                    ]
                }}
            />
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h1 className="font-headline text-4xl font-bold text-foreground md:text-5xl">
                            Table Tennis Guides
                        </h1>
                        <p className="font-body mt-4 text-lg text-muted-foreground">
                            Expert guides, setup comparisons, and equipment advice
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {getAllPosts().map((post) => (
                            <Card
                                key={post.id}
                                className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="overflow-hidden">
                                    <img
                                        src={post.thumbnail}
                                        alt={post.title}
                                        className="h-48 w-full object-cover transition-all duration-300 group-hover:scale-105 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-primary/20"
                                    />
                                </div>
                                <CardHeader>
                                    <CardTitle className="font-headline text-xl group-hover:text-primary">
                                        {post.title}
                                    </CardTitle>
                                    <CardDescription className="font-body text-sm text-muted-foreground">
                                        {post.date} • {post.author}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="font-body text-sm text-muted-foreground">
                                        {post.excerpt}
                                    </p>
                                    <Button asChild variant="ghost" className="group/btn p-0 font-body">
                                        <Link href={`/blog/${post.id}`}>
                                            Read More
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
