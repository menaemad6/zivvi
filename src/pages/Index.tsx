
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Star, Users, Download, ArrowRight, Zap, Layout, FileText } from 'lucide-react';

// Template showcase data
const templates = [
  {
    id: 1,
    name: "Executive Pro",
    category: "Executive",
    price: "Free",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop",
    featured: true,
    discount: "40% off"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-6 bg-blue-500/10 text-blue-300 border-blue-500/20">
              <Star className="w-4 h-4 mr-2" />
              50+ Professional Templates
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
              25,000 curated CV templates to
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                land your dream job.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Join a growing community of 10,000+ professionals who've built 
              careers with our AI-powered CV builder.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link to="/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Start Building
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg">
                Browse Templates
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-gray-700">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex justify-center mb-12">
            <div className="flex bg-gray-800/50 rounded-full p-1 border border-gray-700">
              <button className="px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-medium">
                Featured
              </button>
              <button className="px-6 py-3 rounded-full text-gray-400 hover:text-white text-sm font-medium transition-colors">
                Trending
              </button>
              <button className="px-6 py-3 rounded-full text-gray-400 hover:text-white text-sm font-medium transition-colors">
                Latest
              </button>
            </div>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {templates.map((template) => (
              <Card key={template.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group overflow-hidden">
                <div className="relative">
                  <img 
                    src={template.image} 
                    alt={template.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {template.discount && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                      {template.discount}
                    </Badge>
                  )}
                  {template.featured && (
                    <Badge className="absolute top-2 right-2 bg-blue-500 text-white">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{template.category}</span>
                    <span className="text-sm font-medium text-blue-400">{template.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> succeed</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Professional tools and templates designed to help you stand out from the competition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-blue-400">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-6 md:px-12 lg:px-24">
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl p-12 border border-gray-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to build your
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> perfect CV</span>?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of professionals who have successfully landed their dream jobs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Start Building for Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg">
                View All Templates
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
