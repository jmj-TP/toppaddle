import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPostIds, getPostById, extractToc } from "@/lib/blog";
import StructuredData from "@/components/StructuredData";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface BlogPostProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    return getAllPostIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
    const { id } = await params;
    const post = getPostById(id);
    if (!post) return {};

    return {
        title: post.title,
        description: post.excerpt,
        alternates: {
            canonical: `/blog/${post.id}`,
        },
        openGraph: {
            type: "article",
            images: [post.thumbnail],
            publishedTime: post.date,
            authors: [post.author],
        },
    };
}

export default async function BlogPost({ params }: BlogPostProps) {
    const { id } = await params;
    const post = getPostById(id);

    if (!post) {
        notFound();
    }

    const { modifiedHtml, toc } = extractToc(post.content);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
            <StructuredData
                data={[
                    {
                        type: 'Article',
                        headline: post.title,
                        description: post.excerpt,
                        image: post.thumbnail,
                        author: post.author,
                        datePublished: post.date,
                    },
                    {
                        type: 'BreadcrumbList',
                        items: [
                            { name: 'Home', url: 'https://www.toptabletennispaddle.com/' },
                            { name: 'Guides', url: 'https://www.toptabletennispaddle.com/blog' },
                            { name: post.title, url: `https://www.toptabletennispaddle.com/blog/${post.id}` }
                        ]
                    }
                ]}
            />
            <Header />
            <main className="flex-1">
                <article className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        <Button asChild variant="ghost" className="mb-8 font-body">
                            <Link href="/blog">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Guides
                            </Link>
                        </Button>

                        <img
                            src={post.thumbnail}
                            alt={post.title}
                            loading="lazy"
                            className="mb-8 h-96 w-full rounded-2xl object-cover shadow-2xl shadow-primary/10 border border-border/50"
                        />

                        <header className="mb-8">
                            <h1 className="font-headline text-4xl font-bold text-foreground md:text-5xl">
                                {post.title}
                            </h1>
                            <p className="font-body mt-4 text-muted-foreground">
                                {post.date} • By {post.author}
                            </p>
                        </header>

                        {toc.length > 1 && (
                            <nav className="mb-10 rounded-lg border border-border bg-secondary/20 p-6">
                                <p className="font-headline text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                                    In this guide
                                </p>
                                <ol className="space-y-2">
                                    {toc.map((item, i) => (
                                        <li key={item.id}>
                                            <a
                                                href={`#${item.id}`}
                                                className="font-body text-sm text-primary hover:underline"
                                            >
                                                {i + 1}. {item.text}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        )}

                        <div
                            className="prose prose-lg max-w-none font-body text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: modifiedHtml }}
                        />

                        {post.relatedQuizLink && (
                            <div className="mt-12 rounded-lg border border-border bg-secondary/30 p-8 text-center">
                                <h3 className="font-headline text-2xl font-semibold text-foreground">
                                    Ready to Find Your Perfect Racket?
                                </h3>
                                <p className="font-body mt-4 text-muted-foreground">
                                    Take our quiz to get personalized recommendations based on your playing style
                                </p>
                                <Button
                                    asChild
                                    variant="accent"
                                    size="lg"
                                    className="mt-6 font-body shadow-[var(--shadow-accent)]"
                                >
                                    <Link href={post.relatedQuizLink}>
                                        Start the Quiz
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
}
