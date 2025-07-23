import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { LOGO_NAME, WEBSITE_URL } from "@/lib/constants";

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
        <title>{LOGO_NAME} 404 Not Found</title>
        <meta name="description" content={`Sorry, the page you are looking for does not exist. Return to the ${LOGO_NAME} home page.`} />
        <meta property="og:title" content={`${LOGO_NAME} 404 Not Found`} />
        <meta property="og:description" content={`Sorry, the page you are looking for does not exist. Return to the ${LOGO_NAME} home page.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${WEBSITE_URL}/404`} />
        <meta property="og:image" content="/templates/elegant-template.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${LOGO_NAME} 404 Not Found`} />
        <meta name="twitter:description" content={`Sorry, the page you are looking for does not exist. Return to the ${LOGO_NAME} home page.`} />
        <meta name="twitter:image" content="/templates/elegant-template.png" />
      </Helmet>
      <Navbar />
      <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24">
        <div className="flex-1 flex items-center justify-center mb-16 px-4">
          <Card className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto bg-white/80 backdrop-blur-lg border-0 shadow-2xl">
            <CardContent className="py-10 sm:py-16 flex flex-col items-center px-2 sm:px-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-xl mb-6 sm:mb-8">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">404</h1>
              <p className="text-lg sm:text-2xl text-gray-700 mb-4 sm:mb-6 font-light text-center">Oops! Page not found</p>
              <p className="text-sm sm:text-md md:text-lg text-gray-500 mb-6 sm:mb-8 text-center max-w-xs sm:max-w-md md:max-w-lg">The page you are looking for does not exist or has been moved. Please check the URL or return to the home page.</p>
              <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 sm:px-10 py-4 sm:py-6 text-base sm:text-xl h-14 sm:h-16 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <a href="/">Return to Home</a>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default NotFound;
