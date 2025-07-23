
import React, { useEffect, useState } from 'react';
import { LOGO_NAME, WEBSITE_URL } from '@/lib/constants';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with your first CV',
    features: [
      '1 CV template',
      'Basic customization',
      'PDF download',
      'Community support',
    ],
    limitations: [
      'No premium templates',
      'No AI assistance',
      'Watermark on CV',
    ],
    buttonText: 'Get Started',
    buttonVariant: 'outline' as const,
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    description: 'For professionals who want more customization',
    features: [
      'All premium templates',
      'Advanced customization',
      'AI-powered suggestions',
      'Multiple CV versions',
      'No watermark',
      'Priority support',
    ],
    limitations: [],
    buttonText: 'Start Free Trial',
    buttonVariant: 'default' as const,
    popular: true,
  },
  {
    name: 'Business',
    price: '$29',
    period: 'per month',
    description: 'For teams and organizations',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Brand customization',
      'Analytics dashboard',
      'API access',
      'Dedicated support',
    ],
    limitations: [],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline' as const,
    popular: false,
  },
];

function getTimeLeft() {
  const target = new Date('2025-08-01T00:00:00Z').getTime();
  const now = Date.now();
  let diff = Math.max(target - now, 0);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * 1000 * 60 * 60 * 24;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * 1000 * 60 * 60;
  const minutes = Math.floor(diff / (1000 * 60));
  return { days, hours, minutes };
}

function ModernCountdown() {
  const [time, setTime] = useState(getTimeLeft());
  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft()), 1000 * 10);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center mb-10 fade-in-up">
      <div className="flex gap-6 md:gap-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl px-8 py-4 shadow-xl text-white font-extrabold text-2xl md:text-3xl tracking-tight">
        <div className="flex flex-col items-center"><span>{time.days}</span><span className="text-xs font-medium mt-1">Days</span></div>
        <span className="text-2xl md:text-3xl font-bold">:</span>
        <div className="flex flex-col items-center"><span>{time.hours}</span><span className="text-xs font-medium mt-1">Hours</span></div>
        <span className="text-2xl md:text-3xl font-bold">:</span>
        <div className="flex flex-col items-center"><span>{time.minutes}</span><span className="text-xs font-medium mt-1">Minutes</span></div>
      </div>
      <div className="mt-6 text-lg md:text-xl font-semibold text-blue-900 bg-white/80 px-6 py-3 rounded-xl shadow border border-blue-100 max-w-2xl text-center">
        <span className="bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 bg-clip-text text-transparent font-extrabold">{LOGO_NAME}</span> is <span className="font-bold">totally free</span> for all users until <span className="font-bold">August 1, 2025</span>, in celebration of our grand opening. Enjoy unlimited access to all premium features!
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <>
      <Helmet>
        <title>Pricing | {LOGO_NAME}</title>
        <meta name="description" content={`See our simple, transparent pricing plans. ${LOGO_NAME} is free for all users until August 1, 2025!`} />
        <meta property="og:title" content={`Pricing | ${LOGO_NAME}`} />
        <meta property="og:description" content={`See our simple, transparent pricing plans. ${LOGO_NAME} is free for all users until August 1, 2025!`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${WEBSITE_URL}/pricing`} />
        <meta property="og:image" content="/templates/elegant-template.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Pricing | ${LOGO_NAME}`} />
        <meta name="twitter:description" content={`See our simple, transparent pricing plans. ${LOGO_NAME} is free for all users until August 1, 2025!`} />
        <meta name="twitter:image" content="/templates/elegant-template.png" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Enhanced Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full floating blur-2xl"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full floating blur-xl" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 left-1/4 w-28 h-28 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full floating blur-xl" style={{animationDelay: '4s'}}></div>
          <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full floating blur-2xl" style={{animationDelay: '1s'}}></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 left-1/2 w-24 h-24 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full floating blur-xl" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-1/3 left-1/6 w-20 h-20 bg-gradient-to-r from-yellow-400/15 to-orange-400/15 rounded-full floating blur-lg" style={{animationDelay: '5s'}}></div>
        </div>
        
        <Navbar />
        
        <main className="pt-24 pb-16 relative z-10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
            
            {/* Header */}
            <div className="text-center mb-16 fade-in-up">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Simple, transparent pricing
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the perfect plan for your CV building needs. Start free and upgrade when you're ready.
              </p>
            </div>

            <ModernCountdown />


            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {pricingTiers.map((tier, index) => (
                <Card 
                  key={tier.name} 
                  className={`relative transition-all duration-300 hover:shadow-2xl hover:scale-105 fade-in-up bg-white/80 backdrop-blur-xl border border-white/30 ${
                    tier.popular 
                      ? 'glow-border shadow-2xl scale-105' 
                      : 'hover:border-blue-200'
                  }`}
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                        <Star className="w-4 h-4" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl font-bold text-gray-900">{tier.name}</CardTitle>
                    <div className="mt-6">
                      <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {tier.price}
                      </span>
                      <span className="text-gray-600 text-lg">/{tier.period}</span>
                    </div>
                    <CardDescription className="mt-4 text-gray-600 text-base">
                      {tier.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {tier.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                      {tier.limitations.map((limitation) => (
                        <div key={limitation} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <X className="h-3 w-3 text-gray-400" />
                          </div>
                          <span className="text-sm text-gray-400">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-8">
                    <Button 
                      variant={tier.buttonVariant} 
                      className={`w-full h-12 font-semibold transition-all duration-200 ${
                        tier.popular 
                          ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 hover:shadow-xl hover:scale-105' 
                          : 'hover:bg-gradient-to-r hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:text-white hover:border-transparent'
                      }`}
                      size="lg"
                      asChild
                    >
                      <Link to="/signup">
                        {tier.buttonText}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto fade-in-up stagger-2">
              <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-8">
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/70 transition-all duration-200">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    Can I change my plan later?
                  </h3>
                  <p className="text-gray-600">
                    Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                  </p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/70 transition-all duration-200">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    Is there a free trial?
                  </h3>
                  <p className="text-gray-600">
                    Yes, we offer a 14-day free trial for the Pro plan. No credit card required to start.
                  </p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/70 transition-all duration-200">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-gray-600">
                    We accept all major credit cards, PayPal, and bank transfers for annual plans.
                  </p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/70 transition-all duration-200">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    Can I cancel anytime?
                  </h3>
                  <p className="text-gray-600">
                    Absolutely. You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-16 p-8 rounded-3xl bg-white/50 backdrop-blur-xl border border-white/30 shadow-2xl fade-in-up stagger-3">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Ready to create your perfect CV?
              </h2>
              <p className="text-gray-600 mb-6">
                Join thousands of professionals who have landed their dream jobs with CVBuilder.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 px-8 py-6 text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200"
                asChild
              >
                <Link to="/signup">
                  Start Building Today
                </Link>
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
