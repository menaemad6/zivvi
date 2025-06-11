
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Sparkles, Shield, Zap, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    icon: Shield,
    gradient: 'from-gray-500 to-gray-600',
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
    icon: Zap,
    gradient: 'from-blue-600 via-purple-600 to-pink-600',
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
    icon: Crown,
    gradient: 'from-purple-600 to-pink-600',
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full floating blur-2xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full floating blur-xl" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-28 h-28 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full floating blur-xl" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full floating blur-2xl" style={{animationDelay: '1s'}}></div>
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
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              Simple, 
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                transparent pricing
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose the perfect plan for your CV building needs. Start free and upgrade when you're ready to unlock your career potential.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {pricingTiers.map((tier, index) => (
              <Card 
                key={tier.name} 
                className={`relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-4 bg-white/80 backdrop-blur-xl border border-white/30 ${
                  tier.popular 
                    ? 'border-2 border-blue-500/50 shadow-2xl scale-105 hover:scale-110' 
                    : 'border border-white/20 hover:border-blue-300/40'
                } fade-in-up stagger-${index + 1}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-2">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${tier.gradient} flex items-center justify-center shadow-lg mx-auto mb-4`}>
                    <tier.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">{tier.price}</span>
                    <span className="text-gray-600 ml-2">/{tier.period}</span>
                  </div>
                  <CardDescription className="mt-3 text-gray-600">{tier.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 px-6">
                  <div className="space-y-3">
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
                        <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                          <X className="h-3 w-3 text-gray-500" />
                        </div>
                        <span className="text-sm text-gray-500">{limitation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-4">
                  <Button 
                    variant={tier.buttonVariant} 
                    className={`w-full h-12 font-semibold text-base transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                      tier.popular 
                        ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-0' 
                        : ''
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
          <div className="max-w-4xl mx-auto fade-in-up stagger-4">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  question: "Can I change my plan later?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
                },
                {
                  question: "Is there a free trial?",
                  answer: "Yes, we offer a 14-day free trial for the Pro plan. No credit card required to start."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans."
                },
                {
                  question: "Can I cancel anytime?",
                  answer: "Absolutely. You can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16 p-12 rounded-3xl bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-xl border border-white/30 shadow-2xl fade-in-up stagger-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Ready to create your perfect CV?
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Join thousands of professionals who have landed their dream jobs with CVBuilder. Start building your future today.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 h-14 px-8 font-semibold text-base transition-all duration-200 hover:shadow-xl hover:scale-105" asChild>
                <Link to="/signup">
                  Start Building Today
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
