import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCV } from '@/hooks/useCV';
import { CVData } from '@/types/cv';
import { ArrowLeft, Save, Plus, User, Briefcase, GraduationCap, Award, FileText, Users, Eye, Download, Palette, Zap } from 'lucide-react';
import { SidebarSection } from '@/components/builder/SidebarSection';
import { CVSection } from '@/components/builder/CVSection';
import { cvTemplates } from '@/data/templates';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Builder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cvData, setCVData, isLoading, isSaving, saveCV } = useCV(id);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [cvSections, setCVSections] = useState([
    'personalInfo',
    'experience', 
    'education'
  ]);
  const [currentTemplate, setCurrentTemplate] = useState('modern');

  useEffect(() => {
    if (cvData && id && id !== 'new') {
      fetchCVTemplate();
    }
  }, [cvData, id]);

  const fetchCVTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('template')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data?.template) {
        setCurrentTemplate(data.template);
      }
    } catch (error) {
      console.error('Error fetching template:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading CV...</p>
        </div>
      </div>
    );
  }

  if (id === 'new') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-gradient">Choose a Template</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Please select a template first to start building your CV.
            </p>
            <Button onClick={() => navigate('/templates')} className="w-full bg-gradient">
              Browse Templates
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">CV not found</h2>
          <Button onClick={() => navigate('/dashboard')} className="bg-gradient">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const availableSections = [
    { id: 'personalInfo', title: 'Personal Info', icon: <User className="h-5 w-5" />, description: 'Your basic information' },
    { id: 'experience', title: 'Experience', icon: <Briefcase className="h-5 w-5" />, description: 'Work history and achievements' },
    { id: 'education', title: 'Education', icon: <GraduationCap className="h-5 w-5" />, description: 'Academic background' },
    { id: 'skills', title: 'Skills', icon: <Award className="h-5 w-5" />, description: 'Technical and soft skills' },
    { id: 'projects', title: 'Projects', icon: <FileText className="h-5 w-5" />, description: 'Portfolio and projects' },
    { id: 'references', title: 'References', icon: <Users className="h-5 w-5" />, description: 'Professional references' }
  ];

  const getTemplateStyles = (templateId: string) => {
    const styles = {
      modern: {
        bgGradient: 'from-blue-50 to-cyan-50',
        accentColor: 'text-blue-600',
        borderColor: 'border-blue-200',
        buttonColor: 'bg-blue-500 hover:bg-blue-600'
      },
      classic: {
        bgGradient: 'from-gray-50 to-slate-50',
        accentColor: 'text-slate-700',
        borderColor: 'border-slate-300',
        buttonColor: 'bg-slate-600 hover:bg-slate-700'
      },
      creative: {
        bgGradient: 'from-purple-50 to-pink-50',
        accentColor: 'text-purple-600',
        borderColor: 'border-purple-200',
        buttonColor: 'bg-purple-500 hover:bg-purple-600'
      },
      minimal: {
        bgGradient: 'from-gray-50 to-white',
        accentColor: 'text-gray-700',
        borderColor: 'border-gray-200',
        buttonColor: 'bg-gray-500 hover:bg-gray-600'
      },
      executive: {
        bgGradient: 'from-slate-900 to-gray-900',
        accentColor: 'text-yellow-400',
        borderColor: 'border-yellow-200',
        buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
      },
      tech: {
        bgGradient: 'from-emerald-50 to-teal-50',
        accentColor: 'text-emerald-600',
        borderColor: 'border-emerald-200',
        buttonColor: 'bg-emerald-500 hover:bg-emerald-600'
      },
      artistic: {
        bgGradient: 'from-orange-50 to-red-50',
        accentColor: 'text-orange-600',
        borderColor: 'border-orange-200',
        buttonColor: 'bg-orange-500 hover:bg-orange-600'
      },
      corporate: {
        bgGradient: 'from-indigo-50 to-blue-50',
        accentColor: 'text-indigo-600',
        borderColor: 'border-indigo-200',
        buttonColor: 'bg-indigo-500 hover:bg-indigo-600'
      },
      startup: {
        bgGradient: 'from-orange-50 to-amber-50',
        accentColor: 'text-orange-600',
        borderColor: 'border-orange-200',
        buttonColor: 'bg-orange-500 hover:bg-orange-600'
      }
    };
    
    return styles[templateId as keyof typeof styles] || styles.modern;
  };

  const templateStyle = getTemplateStyles(currentTemplate);
  const currentTemplateInfo = cvTemplates.find(t => t.id === currentTemplate);

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSection(sectionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedSection && !cvSections.includes(draggedSection)) {
      setCVSections([...cvSections, draggedSection]);
    }
    setDraggedSection(null);
  };

  const handleSectionEdit = (sectionId: string) => {
    console.log('Edit section:', sectionId);
    // TODO: Open edit modal for the section
  };

  const handleSectionDelete = (sectionId: string) => {
    setCVSections(cvSections.filter(id => id !== sectionId));
  };

  const handleSectionReorder = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    if (draggedSection && draggedSection !== sectionId) {
      const newSections = [...cvSections];
      const draggedIndex = newSections.indexOf(draggedSection);
      const targetIndex = newSections.indexOf(sectionId);
      
      newSections.splice(draggedIndex, 1);
      newSections.splice(targetIndex, 0, draggedSection);
      
      setCVSections(newSections);
    }
    setDraggedSection(null);
  };

  const handleSave = () => {
    saveCV(cvData);
  };

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'personalInfo':
        return (
          <div className="space-y-2">
            <p className={`font-medium ${templateStyle.accentColor}`}>{cvData.personalInfo.fullName || 'Your Name'}</p>
            <p className="text-sm text-gray-600">{cvData.personalInfo.email}</p>
            <p className="text-sm text-gray-600">{cvData.personalInfo.phone}</p>
            <p className="text-sm text-gray-600">{cvData.personalInfo.location}</p>
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-3">
            {cvData.experience.length > 0 ? (
              cvData.experience.map((exp) => (
                <div key={exp.id} className={`border-l-2 ${templateStyle.borderColor} pl-3`}>
                  <p className={`font-medium ${templateStyle.accentColor}`}>{exp.title}</p>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate || 'Present'}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No experience added yet</p>
            )}
          </div>
        );
      case 'education':
        return (
          <div className="space-y-3">
            {cvData.education.length > 0 ? (
              cvData.education.map((edu) => (
                <div key={edu.id} className={`border-l-2 ${templateStyle.borderColor} pl-3`}>
                  <p className={`font-medium ${templateStyle.accentColor}`}>{edu.degree}</p>
                  <p className="text-sm text-gray-600">{edu.school}</p>
                  <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No education added yet</p>
            )}
          </div>
        );
      default:
        return <p className="text-sm text-gray-500">Click edit to add content</p>;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${templateStyle.bgGradient}`}>
      {/* Enhanced Header */}
      <div className="glass border-b backdrop-blur-lg">
        <div className="container mx-auto py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="hover:bg-white/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gradient">CV Builder</h1>
                  {currentTemplateInfo && (
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {currentTemplateInfo.name}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {currentTemplateInfo.category}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={() => navigate('/preview')}
                className="hover:shadow-lg transition-all duration-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              
              <Button 
                variant="outline"
                className="hover:shadow-lg transition-all duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button 
                onClick={() => saveCV(cvData)} 
                disabled={isSaving} 
                className={`${templateStyle.buttonColor} hover:shadow-lg transition-all duration-200 text-white`}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save CV'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-card sticky top-8 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Palette className={`h-5 w-5 ${templateStyle.accentColor}`} />
                  <CardTitle className="text-lg">Add Sections</CardTitle>
                </div>
                <p className="text-xs text-gray-500">Drag sections to your CV</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {availableSections
                  .filter(section => !cvSections.includes(section.id))
                  .map((section) => (
                    <div key={section.id} className="group">
                      <SidebarSection
                        title={section.title}
                        icon={section.icon}
                        onDragStart={(e) => handleDragStart(e, section.id)}
                      />
                      <p className="text-xs text-gray-400 mt-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        {section.description}
                      </p>
                    </div>
                  ))}
                
                {availableSections.filter(section => !cvSections.includes(section.id)).length === 0 && (
                  <div className="text-center py-4">
                    <Award className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">All sections added!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced CV Builder Area */}
          <div className="lg:col-span-2">
            <Card className="glass-card shadow-xl">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">CV Structure</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Drag to reorder • Click to edit content
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {cvSections.length} sections
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div 
                  className="min-h-[600px] space-y-4 p-6 border-2 border-dashed border-gray-200 rounded-xl bg-white/40 backdrop-blur-sm transition-all duration-300 hover:border-gray-300"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {cvSections.map((sectionId, index) => {
                    const section = availableSections.find(s => s.id === sectionId);
                    return section ? (
                      <CVSection
                        key={sectionId}
                        title={section.title}
                        onEdit={() => handleSectionEdit(sectionId)}
                        onDelete={() => handleSectionDelete(sectionId)}
                        onDragStart={(e) => handleDragStart(e, sectionId)}
                      >
                        {renderSectionContent(sectionId)}
                      </CVSection>
                    ) : null;
                  })}
                  
                  {cvSections.length === 0 && (
                    <div className="text-center py-20">
                      <div className="text-gray-300 mb-6">
                        <Plus className="h-20 w-20 mx-auto mb-4" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        Start Building Your CV
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Drag sections from the sidebar to begin creating your professional CV
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Preview */}
          <div className="lg:col-span-2">
            <Card className="glass-card sticky top-8 shadow-xl">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className={`h-5 w-5 ${templateStyle.accentColor}`} />
                    <CardTitle className="text-lg">Live Preview</CardTitle>
                  </div>
                  {currentTemplateInfo && (
                    <Badge className={templateStyle.buttonColor}>
                      {currentTemplateInfo.name}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="bg-white rounded-xl shadow-inner min-h-[600px] p-8 space-y-6 border overflow-hidden">
                  {cvSections.map((sectionId, index) => {
                    const section = availableSections.find(s => s.id === sectionId);
                    return section ? (
                      <div key={sectionId} className="animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                        <h3 className={`font-semibold text-sm uppercase tracking-wide ${templateStyle.accentColor} mb-3 border-b ${templateStyle.borderColor} pb-2`}>
                          {section.title}
                        </h3>
                        {renderSectionContent(sectionId)}
                      </div>
                    ) : null;
                  })}
                  
                  {cvSections.length === 0 && (
                    <div className="text-center text-gray-400 py-20">
                      <FileText className="h-16 w-16 mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">Your CV Preview</p>
                      <p className="text-sm">Add sections to see your CV come to life</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
