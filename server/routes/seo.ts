import { Router } from 'express';

const router = Router();

// Generate Open Graph image
router.get('/og-image', (req, res) => {
  // Generate a simple SVG image for social sharing
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#DC2626;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#gradient)"/>
      <text x="600" y="250" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="64" font-weight="bold">
        National Fire Nepal
      </text>
      <text x="600" y="320" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="36">
        Fire Safety Equipment &amp; Emergency Vehicles
      </text>
      <text x="600" y="380" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24">
        Leading supplier in Kathmandu, Bhaktpur &amp; across Nepal
      </text>
      <text x="600" y="450" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="20">
        Fire Extinguishers • Ambulances • Fire Trucks • Electric Buses
      </text>
    </svg>
  `;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
  res.send(svg);
});

// Sitemap generation
router.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://nationalfire.com.np';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/products</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blogs</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/gallery</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/brands</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
  res.send(sitemap);
});

// Robots.txt
router.get('/robots.txt', (req, res) => {
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://nationalfire.com.np/sitemap.xml

# Fire Safety Equipment Nepal
# Emergency Vehicles Nepal 
# Fire Protection Services Nepal`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
  res.send(robots);
});

export default router;