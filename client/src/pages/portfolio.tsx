import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Heart } from 'lucide-react';
import type { Portfolio } from '@shared/schema';

export default function PortfolioPage() {
  const { data: socialWorks, isLoading: loadingSocial } = useQuery<{ portfolioItems: Portfolio[] }>({
    queryKey: ['/api/portfolio/category/social'],
  });

  const { data: governmentProjects, isLoading: loadingGov } = useQuery<{ portfolioItems: Portfolio[] }>({
    queryKey: ['/api/portfolio/category/government'],
  });

  if (loadingSocial || loadingGov) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Portfolio</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our impact through social works and governmental partnerships
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const socialWorksItems = socialWorks?.portfolioItems || [];
  const governmentProjectsItems = governmentProjects?.portfolioItems || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Portfolio</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our impact through social works and governmental partnerships that showcase our commitment to community safety and emergency preparedness.
          </p>
        </div>

        {/* Social Works Section */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <Heart className="w-8 h-8 text-red-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Social Works</h2>
          </div>
          <p className="text-gray-600 mb-8 text-lg">
            Community-focused initiatives that bring safety and emergency services to those who need them most.
          </p>
          
          {socialWorksItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No social work projects available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialWorksItems.map((item: Portfolio) => (
                <PortfolioCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* Government Projects Section */}
        <section>
          <div className="flex items-center mb-8">
            <Building2 className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Government Projects</h2>
          </div>
          <p className="text-gray-600 mb-8 text-lg">
            Strategic partnerships with governmental bodies to enhance emergency response infrastructure and public safety.
          </p>
          
          {governmentProjectsItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No government projects available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {governmentProjectsItems.map((item: Portfolio) => (
                <PortfolioCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

interface PortfolioCardProps {
  item: Portfolio;
}

function PortfolioCard({ item }: PortfolioCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="aspect-video overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant={item.category === 'social' ? 'destructive' : 'default'}>
            {item.category === 'social' ? 'Social Work' : 'Government Project'}
          </Badge>
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {item.title}
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {item.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/portfolio/${item.id}`}>
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
            View Project Details
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}