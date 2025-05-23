
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cvTemplates } from '@/data/templates';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Choose Your Template</h1>
          <p className="text-lg text-gray-600">Select a professional template to start building your CV</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="secondary" className="capitalize">
                    {template.category}
                  </Badge>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  onClick={() => createCVFromTemplate(template.id, template.name)}
                  className="w-full"
                >
                  Use This Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Templates;
