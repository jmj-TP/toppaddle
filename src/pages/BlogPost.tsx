import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { blogPosts } from "@/data/blogPosts";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="font-headline text-4xl font-bold">Post Not Found</h1>
            <Link to="/blog" className="mt-8 inline-block">
              <Button variant="accent">Back to Blog</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <SEO
        title={post.title}
        description={post.excerpt}
        canonical={`https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/blog/${post.id}`}
        ogType="article"
        ogImage={post.thumbnail}
        article={{
          publishedTime: post.date,
          author: post.author,
          section: 'Table Tennis',
        }}
      />
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
              { name: 'Home', url: 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/' },
              { name: 'Blog', url: 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/blog' },
              { name: post.title, url: `https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/blog/${post.id}` }
            ]
          }
        ]}
      />
      <Header />
      <main className="flex-1">
        <article className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Link to="/blog">
              <Button variant="ghost" className="mb-8 font-body">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            <img
              src={post.thumbnail}
              alt={post.title}
              className="mb-8 h-96 w-full rounded-lg object-cover shadow-lg"
            />

            <header className="mb-8">
              <h1 className="font-headline text-4xl font-bold text-foreground md:text-5xl">
                {post.title}
              </h1>
              <p className="font-body mt-4 text-muted-foreground">
                {post.date} • By {post.author}
              </p>
            </header>

            <div 
              className="prose prose-lg max-w-none font-body text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.relatedQuizLink && (
              <div className="mt-12 rounded-lg border border-border bg-secondary/30 p-8 text-center">
                <h3 className="font-headline text-2xl font-semibold text-foreground">
                  Ready to Find Your Perfect Racket?
                </h3>
                <p className="font-body mt-4 text-muted-foreground">
                  Take our quiz to get personalized recommendations based on your playing style
                </p>
                <Link to={post.relatedQuizLink}>
                  <Button
                    variant="accent"
                    size="lg"
                    className="mt-6 font-body shadow-[var(--shadow-accent)]"
                  >
                    Start the Quiz
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
