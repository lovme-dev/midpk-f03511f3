import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { SEO_BASE_URL } from "@/utils/seoConstants";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        {/* Critical: Tell search engines this is a real 404 page */}
        <title>404 - Page Not Found | Midasbuy</title>
        <meta name="description" content="The page you are looking for doesn't exist or has been moved. Return to Midasbuy homepage to find what you need." />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <link rel="canonical" href={`${SEO_BASE_URL}/404`} />
        
        {/* HTTP-equiv meta for additional signal */}
        <meta httpEquiv="status" content="404" />
        
        {/* Open Graph for sharing */}
        <meta property="og:title" content="404 - Page Not Found | Midasbuy" />
        <meta property="og:description" content="The page you are looking for doesn't exist or has been moved." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SEO_BASE_URL}/404`} />
        
        {/* Structured data for 404 page */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Page Not Found",
            "description": "The requested page does not exist on Midasbuy",
            "url": `${SEO_BASE_URL}${location.pathname}`,
            "isPartOf": {
              "@type": "WebSite",
              "name": "Midasbuy",
              "url": SEO_BASE_URL
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": SEO_BASE_URL
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "404 Not Found",
                  "item": `${SEO_BASE_URL}/404`
                }
              ]
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-midasbuy-darkBlue">
        <div className="glass-effect rounded-xl p-8 max-w-md w-full mx-4 text-center animate-fade-in">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto flex items-center justify-center rounded-full bg-midasbuy-navy border border-midasbuy-blue/30">
              <span className="text-5xl font-bold bg-gradient-to-r from-midasbuy-blue to-blue-400 bg-clip-text text-transparent">404</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-white">Page Not Found</h1>
          <p className="text-gray-300 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button className="bg-midasbuy-blue hover:bg-blue-600 text-white font-medium transition-all">
              Return to Home
            </Button>
          </Link>
          
          {/* Additional helpful links for SEO */}
          <div className="mt-8 pt-6 border-t border-midasbuy-blue/20">
            <p className="text-sm text-gray-400 mb-4">Popular pages:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link to="/midasbuy/buy/pubgm" className="text-sm text-midasbuy-blue hover:underline">
                PUBG UC
              </Link>
              <span className="text-gray-500">•</span>
              <Link to="/midasbuy/buy/freefire" className="text-sm text-midasbuy-blue hover:underline">
                Free Fire Diamonds
              </Link>
              <span className="text-gray-500">•</span>
              <Link to="/bgmi" className="text-sm text-midasbuy-blue hover:underline">
                BGMI
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
