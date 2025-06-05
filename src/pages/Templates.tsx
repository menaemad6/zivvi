
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

const Templates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const createCVFromTemplate = async (templateId: string, templateName: string) => {
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
          summary: ''
        },
        experience: [],
        education: [],
        skills: []
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

      navigate(`/builder/${data.id}`);
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
      classic: 'from-gray-700 via-gray-800 to-slate-900',
      creative: 'from-purple-500 via-pink-500 to-red-500',
      minimal: 'from-gray-100 via-white to-gray-50',
      executive: 'from-slate-900 via-black to-gray-900',
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
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Hero Section */}
        <div className="bg-gray-900 text-white">
          <div className="container mx-auto py-16 px-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mb-8 text-gray-300 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-6xl font-bold mb-6">
                Choose Your Perfect
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Template
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Professionally designed templates crafted for different industries and career stages. 
                Start with a template and customize it to match your unique style.
              </p>
              
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category 
                        ? "bg-white text-black hover:bg-gray-100" 
                        : "border-white/20 text-white hover:bg-white/10"
                      }
                    >
                      {category === 'all' ? <Filter className="h-3 w-3 mr-1" /> : getCategoryIcon(category)}
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
          {selectedCategory === 'all' && searchTerm === '' && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <Crown className="h-6 w-6 text-yellow-500" />
                <h2 className="text-3xl font-bold text-gray-900">Featured Templates</h2>
                <Badge className="bg-yellow-50 text-yellow-600 border-yellow-200">
                  Most Popular
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border-0 bg-white overflow-hidden"
                    onMouseEnter={() => setHoveredTemplate(template.id)}
                    onMouseLeave={() => setHoveredTemplate(null)}
                  >
                    <div className="relative">
                      <div className={`aspect-[3/4] bg-gradient-to-br ${getTemplateGradient(template.id)} flex items-center justify-center transition-all duration-500 ${hoveredTemplate === template.id ? 'scale-105' : ''}`}>
                        <div className="text-center p-6 text-white">
                          <Flame className="h-8 w-8 mx-auto mb-4 opacity-80" />
                          <div className="text-3xl font-bold mb-3">{template.name}</div>
                          <div className="text-sm opacity-90 mb-6">Premium Template</div>
                          <div className="space-y-2">
                            <div className="h-3 bg-white/30 rounded-full"></div>
                            <div className="h-3 bg-white/20 rounded-full w-3/4 mx-auto"></div>
                            <div className="h-3 bg-white/20 rounded-full w-1/2 mx-auto"></div>
                          </div>
                        </div>
                      </div>
                      <Badge className="absolute top-4 right-4 bg-yellow-500 text-black">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl text-gray-900">{template.name}</CardTitle>
                        <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                          {template.category}
                        </Badge>
                      </div>
                      <CardDescription className="leading-relaxed text-gray-600">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button
                        onClick={() => createCVFromTemplate(template.id, template.name)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Use This Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Templates */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {selectedCategory === 'all' ? 'All Templates' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Templates`}
              </h2>
              <Badge variant="secondary" className="text-sm bg-gray-100 text-gray-700">
                {filteredTemplates.length} templates
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-gray-200 overflow-hidden"
                  onMouseEnter={() => setHoveredTemplate(template.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                >
                  <div className="relative">
                    <div className={`aspect-[3/4] bg-gradient-to-br ${getTemplateGradient(template.id)} flex items-center justify-center transition-all duration-300 ${hoveredTemplate === template.id ? 'scale-105' : ''}`}>
                      <div className="text-center p-4 text-white">
                        <div className="text-2xl font-bold mb-2">{template.name}</div>
                        <div className="text-sm opacity-80 mb-4">CV Template</div>
                        <div className="space-y-1">
                          <div className="h-2 bg-white/30 rounded"></div>
                          <div className="h-2 bg-white/20 rounded w-3/4 mx-auto"></div>
                          <div className="h-2 bg-white/20 rounded w-1/2 mx-auto"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-gray-900">{template.name}</CardTitle>
                      <Badge variant="outline" className="text-xs capitalize text-gray-600 border-gray-300">
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
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white transition-all duration-300"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredTemplates.length === 0 && (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No templates found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Templates;
