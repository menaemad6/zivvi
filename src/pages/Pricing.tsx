
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
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

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the perfect plan for your CV building needs. Start free and upgrade when you're ready.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {pricingTiers.map((tier, index) => (
              <Card 
                key={tier.name} 
                className={`relative transition-all duration-200 hover:shadow-lg ${
                  tier.popular 
                    ? 'border-primary shadow-lg scale-105' 
                    : 'border-border hover:border-primary/20'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                    <span className="text-muted-foreground">/{tier.period}</span>
                  </div>
                  <CardDescription className="mt-2">{tier.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {tier.limitations.map((limitation) => (
                      <div key={limitation} className="flex items-center gap-3">
                        <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button 
                    variant={tier.buttonVariant} 
                    className="w-full"
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
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Can I change my plan later?
                </h3>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Is there a free trial?
                </h3>
                <p className="text-muted-foreground">
                  Yes, we offer a 14-day free trial for the Pro plan. No credit card required to start.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  What payment methods do you accept?
                </h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards, PayPal, and bank transfers for annual plans.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Can I cancel anytime?
                </h3>
                <p className="text-muted-foreground">
                  Absolutely. You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Ready to create your perfect CV?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of professionals who have landed their dream jobs with CVBuilder.
            </p>
            <Button size="lg" asChild>
              <Link to="/signup">
                Start Building Today
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
