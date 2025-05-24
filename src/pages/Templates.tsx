
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cvTemplates } from '@/data/templates';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Sparkles, Briefcase, Palette, Zap } from 'lucide-react';

const Templates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
        title: "CV Created!",
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

  const getTemplatePreviewStyle = (templateId: string) => {
    const styles = {
      modern: 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white',
      classic: 'bg-gradient-to-br from-gray-700 to-slate-700 text-white',
      creative: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
      minimal: 'bg-gradient-to-br from-gray-100 to-white text-gray-800 border-2 border-gray-200',
      executive: 'bg-gradient-to-br from-slate-900 to-black text-yellow-400',
      academic: 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white',
      tech: 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white',
      artistic: 'bg-gradient-to-br from-orange-500 to-red-500 text-white',
      corporate: 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white',
      startup: 'bg-gradient-to-br from-orange-500 to-amber-500 text-white'
    };
    
    return styles[templateId as keyof typeof styles] || styles.modern;
  };

  const groupedTemplates = cvTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, typeof cvTemplates>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-6 hover:bg-white/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Choose Your Perfect Template
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Select from our collection of professionally designed templates, each crafted for different industries and career stages
            </p>
          </div>
        </div>

        {Object.entries(groupedTemplates).map(([category, templates]) => (
          <div key={category} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              {getCategoryIcon(category)}
              <h2 className="text-2xl font-bold text-gray-800 capitalize">{category} Templates</h2>
              <Badge variant="secondary" className="capitalize">
                {templates.length} templates
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className={`aspect-[3/4] rounded-lg mb-4 flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${getTemplatePreviewStyle(template.id)}`}>
                      <div className="text-center p-4">
                        <div className="text-2xl font-bold mb-2">{template.name}</div>
                        <div className="text-sm opacity-80">CV Template</div>
                        <div className="mt-4 space-y-1">
                          <div className="h-2 bg-current opacity-30 rounded"></div>
                          <div className="h-2 bg-current opacity-20 rounded w-3/4"></div>
                          <div className="h-2 bg-current opacity-20 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">{template.name}</CardTitle>
                      <Badge variant="outline" className="capitalize text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm text-gray-600 leading-relaxed">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      onClick={() => createCVFromTemplate(template.id, template.name)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Use This Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
