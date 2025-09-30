import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blogPosts";
import { ArrowRight } from "lucide-react";

const BlogPreview = () => {
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold text-foreground md:text-4xl">
            Expert Tips & Insights
          </h2>
          <p className="font-body mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn from our experience and improve your table tennis game with actionable advice
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {latestPosts.map((post) => (
            <Card
              key={post.id}
              className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-accent/50"
            >
              <div className="overflow-hidden">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <CardHeader>
                <CardTitle className="font-headline text-lg group-hover:text-accent transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="font-body text-xs text-muted-foreground">
                  {post.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-body text-sm text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
                <Link to={`/blog/${post.id}`}>
                  <Button variant="ghost" className="group/btn p-0 font-body text-accent hover:text-accent">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/blog">
            <Button
              variant="outline"
              size="lg"
              className="font-body border-2 hover:border-accent hover:text-accent"
            >
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
