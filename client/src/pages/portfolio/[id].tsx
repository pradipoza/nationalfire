import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, Heart, Calendar } from 'lucide-react';
import type { Portfolio } from '@shared/schema';

export default function PortfolioDetailPage() {
  const [match, params] = useRoute('/portfolio/:id');
  const portfolioId = params?.id;

  const { data, isLoading, error } = useQuery<{ portfolioItem: Portfolio }>({
    queryKey: [`/api/portfolio/${portfolioId}`],
    enabled: !!portfolioId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-96 bg-gray-200"></div>
              <div className="p-8">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-6 w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.portfolioItem) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Link href="/portfolio">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
          </Link>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Project Not Found</CardTitle>
              <CardDescription>
                The project you're looking for doesn't exist or has been removed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/portfolio">
                <Button>Return to Portfolio</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const portfolioItem: Portfolio = data.portfolioItem;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Link href="/portfolio">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Button>
        </Link>

        <Card className="max-w-4xl mx-auto overflow-hidden">
          <div className="aspect-video md:aspect-[2/1] overflow-hidden">
            <img
              src={portfolioItem.image}
              alt={portfolioItem.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {portfolioItem.category === 'social' ? (
                  <Heart className="w-5 h-5 text-red-600" />
                ) : (
                  <Building2 className="w-5 h-5 text-blue-600" />
                )}
                <Badge variant={portfolioItem.category === 'social' ? 'destructive' : 'default'}>
                  {portfolioItem.category === 'social' ? 'Social Work' : 'Government Project'}
                </Badge>
              </div>
              {portfolioItem.createdAt && (
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(portfolioItem.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {portfolioItem.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {portfolioItem.description}
            </p>

            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Details</h2>
              <div className="prose max-w-none text-gray-700 leading-relaxed">
                {portfolioItem.projectDetails.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="border-t pt-8 mt-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {portfolioItem.category === 'social' ? 'Community Impact' : 'Project Outcome'}
                </h3>
                <p className="text-gray-600">
                  {portfolioItem.category === 'social' 
                    ? 'This social initiative demonstrates our commitment to community safety and emergency preparedness, bringing essential services to those who need them most.'
                    : 'This government partnership showcases our capability to deliver large-scale emergency response solutions that enhance public safety infrastructure.'
                  }
                </p>
              </div>
            </div>

            <div className="border-t pt-8 mt-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Interested in Similar Projects?
                </h3>
                <p className="text-gray-600 mb-6">
                  Contact us to discuss how we can help with your emergency response needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button size="lg">
                      Get in Touch
                    </Button>
                  </Link>
                  <Link href="/portfolio">
                    <Button variant="outline" size="lg">
                      View More Projects
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}