
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cvTemplates } from '@/data/templates';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Sparkles, Briefcase, Palette, Zap, Search, Filter, Star, Crown, Flame } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { LOGO_NAME, WEBSITE_URL } from "@/lib/constants";
import Joyride, { CallBackProps as JoyrideCallBackProps } from 'react-joyride';
import { useLocation } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';

const Templates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const location = useLocation();
  const [joyrideRun, setJoyrideRun] = useState(false);
  const [joyrideFinished, setJoyrideFinished] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const { profile, isLoading: profileLoading } = useProfile();
  
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('startDemo')) {
      setJoyrideRun(true);
      setJoyrideFinished(false);
      setIsDemo(true);
    }
  }, [location]);

  const joyrideSteps = [
    {
      target: '.template-card',
      content: 'Choose a template to get started!',
      disableBeacon: true,
    },
    {
      target: '.template-card .use-template-btn',
      content: 'Click here to use this template!',
    },
  ];

  const handleJoyrideCallback = (data: JoyrideCallBackProps) => {
    if (data.status === 'finished' || data.status === 'skipped') {
      setJoyrideRun(false);
      setJoyrideFinished(true);
      // Remove the flag from the URL
      navigate('/templates', { replace: true });
    }
  };

  

  const createCVFromTemplate = async (templateId: string, templateName: string) => {
    if (joyrideRun && !joyrideFinished) return; // Prevent navigation during demo
    if (!user) {
      navigate('/login');
      return;
    }



    try {
      const defaultCVData = {
        personalInfo: {
          fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Your Name',
          email: user.email || '',
          phone: '',
          location: '',
          title: '',
          summary: '',
          personal_website: profile?.profile_data?.personal_website || '',
          github: profile?.profile_data?.github || '',
          linkedin: profile?.profile_data?.linkedin || '',
        },
        designOptions: {
          primaryColor: '',
          secondaryColor: '',
          font: 'inter',
        },
        experience: [],
        education: [],
        skills: [],
        projects: [],
        references: []
      };

      const { data, error } = await supabase
        .from('cvs')
        .insert({
          user_id: user.id,
          title: `My ${templateName} CV`,
          template: templateId,
          content: defaultCVData
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "CV Created! ✨",
        description: `Your new ${templateName} CV has been created.`
      });

      if (isDemo) {
        navigate(`/builder/${data.id}?startBuilderDemo=true`);
      } else {
        navigate(`/builder/${data.id}`);
      }
    } catch (error: any) {
      toast({
        title: "Error creating CV",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'modern': return <Zap className="h-4 w-4" />;
      case 'classic': return <Briefcase className="h-4 w-4" />;
      case 'creative': return <Palette className="h-4 w-4" />;
      case 'minimal': return <Sparkles className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getTemplateGradient = (templateId: string) => {
    const gradients = {
      modern: 'from-blue-500 via-purple-500 to-cyan-500',
      classic: 'from-slate-600 via-gray-700 to-slate-800',
      creative: 'from-purple-500 via-pink-500 to-red-500',
      minimal: 'from-gray-400 via-gray-500 to-gray-600',
      executive: 'from-slate-800 via-black to-gray-900',
      academic: 'from-indigo-600 via-blue-600 to-cyan-600',
      tech: 'from-emerald-500 via-teal-500 to-green-600',
      artistic: 'from-orange-500 via-red-500 to-pink-500',
      corporate: 'from-indigo-600 via-blue-700 to-slate-800',
      startup: 'from-orange-500 via-amber-500 to-yellow-500'
    };
    
    return gradients[templateId as keyof typeof gradients] || gradients.modern;
  };

  const filteredTemplates = cvTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(cvTemplates.map(t => t.category)))];
  const featuredTemplates = cvTemplates.filter(t => ['modern', 'executive', 'creative'].includes(t.id));

  return (
    <>
      <Helmet>
        <title>{LOGO_NAME} | CV Templates </title>
        <meta name="description" content="Browse and choose from a wide range of modern, professional CV templates to kickstart your resume." />
        <meta property="og:title" content={`${LOGO_NAME} | CV Templates`} />
        <meta property="og:description" content="Browse and choose from a wide range of modern, professional CV templates to kickstart your resume." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${WEBSITE_URL}/templates`} />
        <meta property="og:image" content="/zivvi-logo.png" />
        <meta name="twitter:title" content={`{LOGO_NAME} | CV Templates`} />
        <meta name="twitter:image" content="/zivvi-logo.png" />
        {/* Twitter */}
        <meta name="twitter:card" content={`${LOGO_NAME} - Create Professional Resumes in Minutes`} />
        <meta property="twitter:url" content={WEBSITE_URL} />
        <meta name="twitter:title" content={`${LOGO_NAME} - Create Professional Resumes in Minutes`} />
        <meta name="twitter:description" content="Browse and choose from a wide range of modern, professional CV templates to kickstart your resume." />
        <meta name="twitter:image" content="/zivvi-logo.png" />
        <meta name="twitter:creator" content="@zivvi" />
        <meta name="twitter:site" content="@zivvi" />
      </Helmet>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
          <div className="container mx-auto py-6 px-6 relative">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="mb-8 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">
                Choose Your Perfect
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-2">
                  Template
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-6 max-w-3xl mx-auto">
                Professionally designed templates crafted for different industries and career stages. 
                Start with a template and customize it to match your unique style.
              </p>
              
              {/* Search and Filter */}
              <div className="flex flex-col gap-4 max-w-3xl mx-auto mb-12">
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 h-14 text-lg bg-white/80 backdrop-blur-lg border-0 shadow-lg rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 flex-wrap justify-center w-full">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="lg"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category 
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg" 
                        : "border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-300"
                      }
                    >
                      {category === 'all' ? <Filter className="h-4 w-4 mr-2" /> : getCategoryIcon(category)}
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-12 px-6">
          {/* Featured Templates */}
          {/* {selectedCategory === 'all' && searchTerm === '' && (
            <div className="mb-20">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Crown className="h-8 w-8 text-yellow-500" />
                  <h2 className="text-4xl font-bold text-gray-900">Featured Templates</h2>
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 px-4 py-2 text-lg">
                    Most Popular
                  </Badge>
                </div>
                <p className="text-xl text-gray-600">Hand-picked templates that stand out from the crowd</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {featuredTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-6 border-0 bg-white/80 backdrop-blur-lg overflow-hidden shadow-lg"
                    onMouseEnter={() => setHoveredTemplate(template.id)}
                    onMouseLeave={() => setHoveredTemplate(null)}
                  >
                    <div className="relative aspect-[3/4] flex items-center justify-center bg-white">
                      {template.thumbnail && template.thumbnail !== '/placeholder.svg' ? (
                        <img src={template.thumbnail} alt={template.name} className="object-cover w-full h-full" />
                      ) : (
                        <div className={`aspect-[3/4] bg-gradient-to-br ${getTemplateGradient(template.id)} flex items-center justify-center transition-all duration-500 ${hoveredTemplate === template.id ? 'scale-105' : ''}`}>
                          <div className="text-center p-8 text-white">
                            <Flame className="h-12 w-12 mx-auto mb-6 opacity-80" />
                            <div className="text-3xl font-bold mb-4">{template.name}</div>
                            <div className="text-lg opacity-90 mb-8">Premium Template</div>
                            <div className="space-y-3">
                              <div className="h-4 bg-white/30 rounded-full"></div>
                              <div className="h-4 bg-white/20 rounded-full w-3/4 mx-auto"></div>
                              <div className="h-4 bg-white/20 rounded-full w-1/2 mx-auto"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <Badge className="absolute top-6 right-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 px-3 py-2">
                      <Star className="h-4 w-4 mr-1" />
                      Featured
                    </Badge>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl text-gray-900">{template.name}</CardTitle>
                        <Badge variant="outline" className="text-sm text-gray-600 border-2 border-gray-200 px-3 py-1">
                          {template.category}
                        </Badge>
                      </div>
                      <CardDescription className="leading-relaxed text-gray-600 text-lg">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button
                        onClick={() => createCVFromTemplate(template.id, template.name)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-14 text-lg rounded-xl"
                      >
                        <Sparkles className="h-5 w-5 mr-3" />
                        Use This Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )} */}

          {/* All Templates */}
          <div>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-bold text-gray-900">
                {selectedCategory === 'all' ? 'All Templates' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Templates`}
              </h2>
              <Badge variant="outline" className="text-lg bg-white/80 text-gray-700 border-2 border-gray-200 px-4 py-2">
                {filteredTemplates.length} templates
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="template-card group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4 bg-white/80 backdrop-blur-lg border-0 shadow-lg overflow-hidden"
                  onMouseEnter={() => setHoveredTemplate(template.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                >
                  <div className="relative aspect-[3/4] flex items-center justify-center bg-white">
                    {template.thumbnail && template.thumbnail !== '/placeholder.svg' ? (
                      <img src={template.thumbnail} alt={template.name} className="object-cover w-full h-full" />
                    ) : (
                      <div className={`aspect-[3/4] bg-gradient-to-br ${getTemplateGradient(template.id)} flex items-center justify-center transition-all duration-300 ${hoveredTemplate === template.id ? 'scale-110' : ''}`}>
                        <div className="text-center p-6 text-white">
                          <div className="text-2xl font-bold mb-3">{template.name}</div>
                          <div className="text-sm opacity-80 mb-6">CV Template</div>
                          <div className="space-y-2">
                            <div className="h-3 bg-white/30 rounded"></div>
                            <div className="h-3 bg-white/20 rounded w-3/4 mx-auto"></div>
                            <div className="h-3 bg-white/20 rounded w-1/2 mx-auto"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-gray-900">{template.name}</CardTitle>
                      <Badge variant="outline" className="text-sm capitalize text-gray-600 border-2 border-gray-200">
                        {template.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm leading-relaxed text-gray-600">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      onClick={() => createCVFromTemplate(template.id, template.name)}
                      className="use-template-btn w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                      disabled={joyrideRun && !joyrideFinished}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredTemplates.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center mx-auto mb-8">
                  <Search className="h-12 w-12 text-gray-500" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-900">No templates found</h3>
                <p className="text-xl text-gray-600 mb-8">Try adjusting your search or filter criteria</p>
                <Button 
                  onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <Joyride
        steps={joyrideSteps}
        run={joyrideRun}
        continuous
        showSkipButton
        showProgress
        callback={handleJoyrideCallback}
        styles={{ 
          options: { zIndex: 10000 },
          buttonNext: { backgroundColor: 'hsl(var(--primary))', color: 'white' },
          buttonBack: { backgroundColor: 'hsl(var(--primary))', color: 'white' },
          buttonSkip: { color: 'hsl(var(--primary))' }
        }}
      />
    </>
  );
};

export default Templates;
