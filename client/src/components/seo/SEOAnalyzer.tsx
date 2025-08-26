import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, Search } from 'lucide-react';
import { calculateSEOScore } from '@/utils/seo';

interface SEOAnalysisResult {
  score: number;
  suggestions: string[];
  details: {
    title: { exists: boolean; length: number; optimal: boolean };
    description: { exists: boolean; length: number; optimal: boolean };
    keywords: { exists: boolean; count: number; optimal: boolean };
    headings: { h1Count: number; hasH1: boolean; structure: string[] };
    images: { total: number; withAlt: number; optimized: boolean };
    links: { internal: number; external: number };
    performance: { loadTime?: number; mobile: boolean };
  };
}

const SEOAnalyzer: React.FC = () => {
  const [analysis, setAnalysis] = useState<SEOAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeCurrentPage = () => {
    setLoading(true);
    
    setTimeout(() => {
      // Analyze current page SEO
      const title = document.title;
      const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const metaKeywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
      const keywords = metaKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
      
      // Analyze headings
      const h1Elements = document.querySelectorAll('h1');
      const h2Elements = document.querySelectorAll('h2');
      const h3Elements = document.querySelectorAll('h3');
      const headings = [
        ...Array.from(h1Elements).map(el => `H1: ${el.textContent?.substring(0, 50) || ''}`),
        ...Array.from(h2Elements).map(el => `H2: ${el.textContent?.substring(0, 50) || ''}`),
        ...Array.from(h3Elements).map(el => `H3: ${el.textContent?.substring(0, 50) || ''}`)
      ];

      // Analyze images
      const images = document.querySelectorAll('img');
      const imagesWithAlt = Array.from(images).filter(img => img.alt && img.alt.trim().length > 0);

      // Analyze links
      const links = document.querySelectorAll('a[href]');
      const internalLinks = Array.from(links).filter(link => {
        const href = link.getAttribute('href') || '';
        return href.startsWith('/') || href.includes(window.location.hostname);
      });
      const externalLinks = Array.from(links).filter(link => {
        const href = link.getAttribute('href') || '';
        return href.startsWith('http') && !href.includes(window.location.hostname);
      });

      // Create analysis object
      const pageData = {
        title,
        description: metaDescription,
        keywords,
        content: document.body.textContent || '',
        images: Array.from(images).map(img => ({ alt: img.alt, title: img.title })),
        headings: headings
      };

      const seoScore = calculateSEOScore(pageData);

      const analysis: SEOAnalysisResult = {
        score: seoScore.score,
        suggestions: seoScore.suggestions,
        details: {
          title: {
            exists: title.length > 0,
            length: title.length,
            optimal: title.length >= 30 && title.length <= 60
          },
          description: {
            exists: metaDescription.length > 0,
            length: metaDescription.length,
            optimal: metaDescription.length >= 120 && metaDescription.length <= 160
          },
          keywords: {
            exists: keywords.length > 0,
            count: keywords.length,
            optimal: keywords.length >= 3 && keywords.length <= 10
          },
          headings: {
            h1Count: h1Elements.length,
            hasH1: h1Elements.length > 0,
            structure: headings
          },
          images: {
            total: images.length,
            withAlt: imagesWithAlt.length,
            optimized: images.length === 0 || imagesWithAlt.length === images.length
          },
          links: {
            internal: internalLinks.length,
            external: externalLinks.length
          },
          performance: {
            mobile: window.innerWidth <= 768
          }
        }
      };

      setAnalysis(analysis);
      setLoading(false);
    }, 1000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  const StatusIcon: React.FC<{ condition: boolean }> = ({ condition }) => {
    return condition ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">SEO Analysis Tool</h2>
        <Button onClick={analyzeCurrentPage} disabled={loading}>
          <Search className="h-4 w-4 mr-2" />
          {loading ? 'Analyzing...' : 'Analyze Current Page'}
        </Button>
      </div>

      {analysis && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                SEO Score
                {getScoreBadge(analysis.score)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}
                </div>
                <div className="text-gray-600">out of 100</div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <StatusIcon condition={analysis.details.title.optimal} />
                  <span>Page Title</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  Length: {analysis.details.title.length} characters
                </p>
                <p className="text-sm text-gray-600">
                  Optimal: 30-60 characters
                </p>
              </CardContent>
            </Card>

            {/* Description Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <StatusIcon condition={analysis.details.description.optimal} />
                  <span>Meta Description</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  Length: {analysis.details.description.length} characters
                </p>
                <p className="text-sm text-gray-600">
                  Optimal: 120-160 characters
                </p>
              </CardContent>
            </Card>

            {/* Keywords Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <StatusIcon condition={analysis.details.keywords.optimal} />
                  <span>Meta Keywords</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  Count: {analysis.details.keywords.count} keywords
                </p>
                <p className="text-sm text-gray-600">
                  Optimal: 3-10 keywords
                </p>
              </CardContent>
            </Card>

            {/* Images Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <StatusIcon condition={analysis.details.images.optimized} />
                  <span>Image Optimization</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  {analysis.details.images.withAlt} of {analysis.details.images.total} images have alt text
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span>Improvement Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>Technical SEO Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Heading Structure</h4>
                <p className="text-sm text-gray-600 mb-2">
                  H1 Count: {analysis.details.headings.h1Count} 
                  {analysis.details.headings.h1Count === 1 ? ' ✓' : ' (Should be exactly 1)'}
                </p>
                <div className="space-y-1">
                  {analysis.details.headings.structure.slice(0, 5).map((heading, index) => (
                    <p key={index} className="text-xs text-gray-500">{heading}</p>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Link Analysis</h4>
                <p className="text-sm text-gray-600">
                  Internal Links: {analysis.details.links.internal} | 
                  External Links: {analysis.details.links.external}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SEOAnalyzer;