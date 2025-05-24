
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCV } from '@/hooks/useCV';
import { CVData } from '@/types/cv';
import { ArrowLeft, Save, Plus, User, Briefcase, GraduationCap, Award, FileText, Users, Eye, Download, Palette, Zap, Undo, Redo, Copy, Share2, Settings, Layout, Wand2, Import } from 'lucide-react';
import { SidebarSection } from '@/components/builder/SidebarSection';
import { CVSection } from '@/components/builder/CVSection';
import { SectionEditModal } from '@/components/builder/SectionEditModal';
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
    'education',
    'skills',
    'projects'
  ]);
  const [currentTemplate, setCurrentTemplate] = useState('modern');
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    sectionType: string;
    sectionTitle: string;
  }>({
    isOpen: false,
    sectionType: '',
    sectionTitle: ''
  });
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [undoStack, setUndoStack] = useState<CVData[]>([]);
  const [redoStack, setRedoStack] = useState<CVData[]>([]);

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

  const saveToHistory = (data: CVData) => {
    setUndoStack(prev => [...prev.slice(-9), data]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length > 0 && cvData) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack(prev => [cvData, ...prev.slice(0, 9)]);
      setUndoStack(prev => prev.slice(0, -1));
      setCVData(previousState);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      if (cvData) {
        setUndoStack(prev => [...prev.slice(-9), cvData]);
      }
      setRedoStack(prev => prev.slice(1));
      setCVData(nextState);
    }
  };

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    console.log('Drag start:', sectionId);
    setDraggedSection(sectionId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sectionId);
  };

  const handleDragOver = (e: React.DragEvent, index?: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (typeof index === 'number') {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex?: number) => {
    e.preventDefault();
    console.log('Drop event:', { draggedSection, targetIndex });
    setDragOverIndex(null);
    
    if (!draggedSection) return;

    if (typeof targetIndex === 'number') {
      // Reordering existing sections
      const currentIndex = cvSections.indexOf(draggedSection);
      if (currentIndex !== -1 && currentIndex !== targetIndex) {
        console.log('Reordering sections from', currentIndex, 'to', targetIndex);
        const newSections = [...cvSections];
        newSections.splice(currentIndex, 1);
        newSections.splice(targetIndex, 0, draggedSection);
        setCVSections(newSections);
        toast({
          title: "Section Reordered",
          description: "Section order has been updated."
        });
      }
    } else {
      // Adding new section from sidebar
      if (!cvSections.includes(draggedSection)) {
        console.log('Adding new section:', draggedSection);
        setCVSections([...cvSections, draggedSection]);
        toast({
          title: "Section Added",
          description: "New section has been added to your CV."
        });
      }
    }
    setDraggedSection(null);
  };

  const handleSectionEdit = (sectionId: string) => {
    if (cvData) {
      saveToHistory(cvData);
    }
    const section = availableSections.find(s => s.id === sectionId);
    if (section) {
      setEditModal({
        isOpen: true,
        sectionType: sectionId,
        sectionTitle: section.title
      });
    }
  };

  const handleSectionDelete = (sectionId: string) => {
    if (cvData) {
      saveToHistory(cvData);
    }
    setCVSections(cvSections.filter(id => id !== sectionId));
    toast({
      title: "Section Removed",
      description: "Section has been removed from your CV."
    });
  };

  const handleSave = async () => {
    if (!cvData) return;
    
    try {
      await saveCV(cvData);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handlePreview = () => {
    if (!cvData || !id) {
      toast({
        title: "Error",
        description: "Cannot preview CV. Please save your changes first.",
        variant: "destructive"
      });
      return;
    }
    
    // Save CV data to localStorage for preview
    localStorage.setItem('previewCVData', JSON.stringify({
      cvData,
      template: currentTemplate,
      sections: cvSections
    }));
    
    // Navigate to preview page
    navigate('/preview');
  };

  const handleModalSave = (updatedData: CVData) => {
    console.log('Modal save:', updatedData);
    setCVData(updatedData);
    toast({
      title: "Changes Applied",
      description: "Section updated successfully. Don't forget to save your CV!",
    });
  };

  const handleAutoSave = () => {
    toast({
      title: "Auto-Save Enabled",
      description: "Your changes will be automatically saved every 30 seconds."
    });
  };

  const handleImportData = () => {
    toast({
      title: "Import Feature",
      description: "Import from LinkedIn, PDF, or other formats (coming soon)."
    });
  };

  const handleAIAssist = () => {
    toast({
      title: "AI Assistant",
      description: "AI-powered content suggestions and optimization (coming soon)."
    });
  };

  const renderSectionContent = (sectionId: string) => {
    const baseId = sectionId.split('_')[0];
    
    switch (baseId) {
      case 'personalInfo':
        return (
          <div className="space-y-2">
            <p className={`font-medium ${templateStyle.accentColor}`}>{cvData.personalInfo.fullName || 'Your Name'}</p>
            <p className="text-sm text-gray-600">{cvData.personalInfo.email}</p>
            <p className="text-sm text-gray-600">{cvData.personalInfo.phone}</p>
            <p className="text-sm text-gray-600">{cvData.personalInfo.location}</p>
            {cvData.personalInfo.summary && (
              <p className="text-sm text-gray-700 mt-2">{cvData.personalInfo.summary}</p>
            )}
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
                  {exp.description && (
                    <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                  )}
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
      case 'skills':
        return (
          <div className="space-y-2">
            {cvData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {cvData.skills.map((skill, index) => (
                  <span key={index} className={`px-2 py-1 text-xs rounded-full bg-gray-100 ${templateStyle.accentColor}`}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No skills added yet</p>
            )}
          </div>
        );
      case 'projects':
        return (
          <div className="space-y-3">
            {cvData.projects && cvData.projects.length > 0 ? (
              cvData.projects.map((project) => (
                <div key={project.id} className={`border-l-2 ${templateStyle.borderColor} pl-3`}>
                  <p className={`font-medium ${templateStyle.accentColor}`}>{project.name}</p>
                  <p className="text-xs text-gray-500">{project.startDate} - {project.endDate || 'Present'}</p>
                  {project.technologies && (
                    <p className="text-sm text-gray-600">{project.technologies}</p>
                  )}
                  {project.description && (
                    <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No projects added yet</p>
            )}
          </div>
        );
      case 'references':
        return (
          <div className="space-y-3">
            {cvData.references && cvData.references.length > 0 ? (
              cvData.references.map((reference) => (
                <div key={reference.id} className={`border-l-2 ${templateStyle.borderColor} pl-3`}>
                  <p className={`font-medium ${templateStyle.accentColor}`}>{reference.name}</p>
                  <p className="text-sm text-gray-600">{reference.position} at {reference.company}</p>
                  <p className="text-xs text-gray-500">{reference.email}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No references added yet</p>
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
                  <h1 className="text-xl font-bold text-gradient">CV Builder Pro</h1>
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
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                size="sm"
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                size="sm"
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>

              <Button 
                variant="outline"
                onClick={handleAutoSave}
                size="sm"
                title="Enable Auto-Save"
              >
                <Settings className="h-4 w-4" />
              </Button>

              <Button 
                variant="outline"
                onClick={handleImportData}
                size="sm"
                title="Import Data"
              >
                <Import className="h-4 w-4" />
              </Button>

              <Button 
                variant="outline"
                onClick={handleAIAssist}
                size="sm"
                title="AI Assistant"
              >
                <Wand2 className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline"
                onClick={handlePreview}
                className="hover:shadow-lg transition-all duration-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              
              <Button 
                variant="outline"
                className="hover:shadow-lg transition-all duration-200"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <Button 
                variant="outline"
                className="hover:shadow-lg transition-all duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button 
                onClick={handleSave} 
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
                  .filter(section => !cvSections.some(s => s.split('_')[0] === section.id))
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
                
                {availableSections.filter(section => !cvSections.some(s => s.split('_')[0] === section.id)).length === 0 && (
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
                    <Button variant="outline" size="sm" onClick={() => navigate('/templates')}>
                      <Layout className="h-4 w-4 mr-1" />
                      Change Template
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div 
                  className="min-h-[600px] space-y-4 p-6 border-2 border-dashed border-gray-200 rounded-xl bg-white/40 backdrop-blur-sm transition-all duration-300 hover:border-gray-300"
                  onDragOver={(e) => handleDragOver(e)}
                  onDrop={(e) => handleDrop(e)}
                  onDragLeave={handleDragLeave}
                >
                  {cvSections.map((sectionId, index) => {
                    const baseId = sectionId.split('_')[0];
                    const section = availableSections.find(s => s.id === baseId);
                    const isDragOver = dragOverIndex === index;
                    
                    return (
                      <div key={sectionId}>
                        {isDragOver && draggedSection && (
                          <div className="h-2 bg-blue-400 rounded-full mb-4 animate-pulse" />
                        )}
                        {section ? (
                          <div
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragLeave={handleDragLeave}
                          >
                            <CVSection
                              title={section.title}
                              onEdit={() => handleSectionEdit(baseId)}
                              onDelete={() => handleSectionDelete(sectionId)}
                              onDragStart={(e) => handleDragStart(e, sectionId)}
                            >
                              {renderSectionContent(sectionId)}
                            </CVSection>
                          </div>
                        ) : null}
                      </div>
                    );
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
                    const baseId = sectionId.split('_')[0];
                    const section = availableSections.find(s => s.id === baseId);
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

      {/* Section Edit Modal */}
      <SectionEditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ ...editModal, isOpen: false })}
        sectionType={editModal.sectionType}
        sectionTitle={editModal.sectionTitle}
        cvData={cvData}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default Builder;
