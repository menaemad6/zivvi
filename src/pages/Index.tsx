
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Star, Users, Download, ArrowRight, Zap, Layout, FileText, Play } from 'lucide-react';

// Template showcase data
const templates = [
  {
    id: 1,
    name: "Executive Pro",
    category: "Executive",
    price: "Free",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop",
    featured: true
  },
  {
    id: 2,
    name: "Modern Tech",
    category: "Technology", 
    price: "Free",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    featured: true
  },
  {
    id: 3,
    name: "Creative Designer",
    category: "Creative",
    price: "Free", 
    image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=300&fit=crop",
    featured: true
  },
  {
    id: 4,
    name: "Business Classic",
    category: "Business",
    price: "Free",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
    featured: true
  }
];

// Stats data
const stats = [
  { label: "CV Templates", value: "50+" },
  { label: "Happy Users", value: "10,000+" },
  { label: "Downloads", value: "25,000+" },
  { label: "Success Rate", value: "95%" }
];

// Feature cards
const features = [
  {
    icon: <Layout className="w-6 h-6" />,
    title: "Professional Templates",
    description: "Choose from our curated collection of modern, ATS-friendly templates"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "AI-Powered Builder", 
    description: "Smart suggestions and auto-formatting to create perfect CVs in minutes"
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Export Ready",
    description: "Download high-quality PDFs optimized for applicant tracking systems"
  }
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
        <div className="container-padding relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
              <Star className="w-4 h-4 mr-2" />
              50+ Professional Templates
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground leading-tight">
              The most comprehensive
              <br />
              <span className="text-gradient">CV Builder Platform</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              Need more than just a template? CVBuilder is a complete suite of tools,
              flexible templates, and smart features to create and manage your professional CV.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link to="/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg h-12">
                  Start building for free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-accent px-8 py-4 text-lg h-12">
                <Play className="w-5 h-5 mr-2" />
                Watch demo
                <span className="ml-2 text-muted-foreground">2 min</span>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-border">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by Section */}
      <section className="py-12 bg-muted/30">
        <div className="container-padding">
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground font-medium">
              Trusted by fast-growing companies around the world
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-lg font-semibold text-muted-foreground">Browserbase</div>
            <div className="text-lg font-semibold text-muted-foreground">Inngest</div>
            <div className="text-lg font-semibold text-muted-foreground">Braintrust</div>
            <div className="text-lg font-semibold text-muted-foreground">SUNO</div>
            <div className="text-lg font-semibold text-muted-foreground">Finary</div>
            <div className="text-lg font-semibold text-muted-foreground">OpenRouter</div>
          </div>
        </div>
      </section>

      {/* Template Grid */}
      <section className="py-20">
        <div className="container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Beautiful templates for every industry
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional designs that help you stand out from the competition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {templates.map((template) => (
              <Card key={template.id} className="bg-card border-border hover:shadow-lg transition-all duration-300 group overflow-hidden">
                <div className="relative">
                  <img 
                    src={template.image} 
                    alt={template.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {template.featured && (
                    <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{template.category}</span>
                    <span className="text-sm font-medium text-primary">{template.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Everything you need to
              <span className="text-gradient"> succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional tools and templates designed to help you stand out from the competition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <div className="text-primary">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-padding">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl p-12 border border-primary/10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Ready to build your
                <span className="text-gradient"> perfect CV</span>?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of professionals who have successfully landed their dream jobs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg">
                    Start Building for Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-accent px-8 py-4 text-lg">
                  View All Templates
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
