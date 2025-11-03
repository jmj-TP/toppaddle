import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blogPosts";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <SEO
        title="Table Tennis Blog - Expert Tips, Reviews & Guides"
        description="Expert table tennis advice, equipment reviews, and tips. 8 years of experience helping players improve their game with honest recommendations."
        canonical="https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/blog"
      />
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
              Table Tennis Blog
            </h1>
            <p className="font-body mt-4 text-lg text-muted-foreground">
              Expert advice, reviews, and tips with 8 years of table tennis experience
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className="overflow-hidden">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                  <Link to={`/blog/${post.id}`}>
                    <Button variant="ghost" className="group/btn p-0 font-body">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
