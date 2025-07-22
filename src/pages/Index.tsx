
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Star, Users, Download, ArrowRight, Zap, Layout, FileText, Play, Shield, Clock, Sparkles, ChevronRight, Check, Globe, Award, TrendingUp } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const stats = [
    { label: "Active Users", value: "50K+", growth: "+12%", icon: Users },
    { label: "CVs Created", value: "2M+", growth: "+18%", icon: FileText },
    { label: "Success Rate", value: "94%", growth: "+5%", icon: Award },
    { label: "Countries", value: "180+", growth: "+23%", icon: Globe }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Create professional CVs in under 5 minutes with our AI-powered builder",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "ATS Optimized",
      description: "All templates are optimized for Applicant Tracking Systems",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Layout className="w-6 h-6" />,
      title: "50+ Templates",
      description: "Choose from our extensive collection of professional designs",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI Assistant",
      description: "Get intelligent suggestions to improve your CV content",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export Options",
      description: "Download your CV in PDF, Word, or other formats",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Analytics",
      description: "Track views and engagement on your CV",
      color: "from-red-500 to-orange-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      content: "CVBuilder helped me land my dream job. The templates are modern and the AI suggestions were spot-on.",
      avatar: "SC",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager at Meta",
      content: "Best CV builder I've used. Clean, professional, and incredibly easy to customize.",
      avatar: "MJ",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Designer at Airbnb",
      content: "The design templates are outstanding. Got multiple interview calls within a week!",
      avatar: "ER",
      rating: 5
    }
  ];

  const floatingElements = [
    { id: 1, size: 'w-16 h-16', position: 'top-20 left-10', delay: '0s', icon: FileText },
    { id: 2, size: 'w-12 h-12', position: 'top-40 right-20', delay: '2s', icon: Sparkles },
    { id: 3, size: 'w-20 h-20', position: 'top-60 left-1/4', delay: '1s', icon: Zap },
    { id: 4, size: 'w-14 h-14', position: 'bottom-40 right-10', delay: '3s', icon: Shield },
    { id: 5, size: 'w-18 h-18', position: 'bottom-60 left-20', delay: '1.5s', icon: Award }
  ];

  return (
    <>
      <Helmet>
        <title>AI CV Builder - Create Professional Resumes in Minutes</title>
        <meta name="description" content="Build and optimize beautiful, professional CVs in minutes with our AI-powered resume builder. Choose from modern templates and get AI-driven suggestions." />
        <meta name="keywords" content="CV builder, resume builder, AI resume, professional resume, online CV, resume templates, CV templates" />
        <meta name="author" content="CV Builder" />
        <meta name="theme-color" content="#ffffff" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-website-url.com/" />
        <meta property="og:title" content="AI CV Builder - Create Professional Resumes in Minutes" />
        <meta property="og:description" content="Build and optimize beautiful, professional CVs with our AI-powered resume builder. Choose from modern templates and get AI-driven suggestions." />
        <meta property="og:image" content="/templates/elegant-template.png" />
        <meta property="og:site_name" content="AI CV Builder" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://your-website-url.com/" />
        <meta name="twitter:title" content="AI CV Builder - Create Professional Resumes in Minutes" />
        <meta name="twitter:description" content="Build and optimize beautiful, professional CVs with our AI-powered resume builder. Choose from modern templates and get AI-driven suggestions." />
        <meta name="twitter:image" content="/templates/elegant-template.png" />
        <meta name="twitter:creator" content="@YourTwitterHandle" />
        <meta name="twitter:site" content="@YourTwitterHandle" />
      </Helmet>
      <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
        <Navbar />
        
        {/* Floating Elements */}
        <div className="fixed inset-0 pointer-events-none z-10">
          {floatingElements.map((element) => {
            const Icon = element.icon;
            return (
              <div
                key={element.id}
                className={`absolute ${element.size} ${element.position} opacity-5 floating`}
                style={{
                  animationDelay: element.delay,
                  transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
                }}
              >
                <Icon className="w-full h-full text-blue-500" />
              </div>
            );
          })}
        </div>
        
        {/* Hero Section with Enhanced Parallax */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-16">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
              background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
            }}
          />
          
          {/* Interactive Background Grid */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
            }}
          />
          
          <div className="container mx-auto px-6 relative z-20">
            <div className="text-center max-w-5xl mx-auto">
              <div className="fade-in-up">
                <Badge variant="secondary" className="mb-6 bg-blue-50 text-blue-700 border-blue-200 backdrop-blur-sm hover:bg-blue-100 transition-colors">
                  <Star className="w-4 h-4 mr-2" />
                  Trusted by 50,000+ professionals worldwide
                </Badge>
              </div>
              
              <h1 className="text-7xl md:text-9xl font-bold mb-8 text-gray-900 leading-tight fade-in-up stagger-1">
                Build CVs that
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent relative">
                  get you hired
                  <div className="absolute -bottom-4 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-30"></div>
                </span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto fade-in-up stagger-2 font-light">
                Create professional, ATS-optimized CVs in minutes with our AI-powered builder. 
                Stand out from the competition with stunning designs.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16 fade-in-up stagger-3">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-6 text-xl h-16 hover-glow shadow-2xl transform hover:scale-105 transition-all duration-300">
                    Start Building Free
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-10 py-6 text-xl h-16 backdrop-blur-sm hover:border-gray-400 transition-all duration-300">
                  <Play className="w-6 h-6 mr-3" />
                  Watch Demo
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 fade-in-up stagger-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center hover-glow p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                      <Icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                      <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 mb-1 font-medium">{stat.label}</div>
                      <div className="text-xs text-green-600 font-semibold flex items-center justify-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.growth}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </section>

        {/* Enhanced Features Section */}
        <section className="py-32 bg-white relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900">
                Everything you need to succeed
              </h2>
              <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-light">
                Professional tools designed to help you stand out from the competition
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white border-2 border-gray-100 hover:border-gray-200 hover-glow backdrop-blur-sm group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4">
                  <CardContent className="p-8 text-center">
                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials Section */}
        <section className="py-32 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900">
                Loved by professionals worldwide
              </h2>
              <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-light">
                Join thousands who've successfully landed their dream jobs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="hover-glow bg-white border-2 border-gray-100 hover:border-gray-200 group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-xl mr-4 shadow-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                        <div className="flex mt-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 italic text-lg leading-relaxed">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-32 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-5xl md:text-7xl font-bold mb-10 text-white leading-tight">
                Ready to land your
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  dream job?
                </span>
              </h2>
              <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                Join over 50,000 professionals who have successfully created stunning CVs with our platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link to="/signup">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-6 text-xl h-16 hover-glow shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold">
                    Start Building for Free
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </Link>
                <Link to="/templates">
                  <Button variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-6 text-xl h-16 backdrop-blur-sm hover:border-white/50 transition-all duration-300">
                    Explore Templates
                    <ChevronRight className="w-6 h-6 ml-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Index;
