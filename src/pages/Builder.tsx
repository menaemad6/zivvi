
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCV } from '@/hooks/useCV';
import { CVData } from '@/types/cv';
import BuilderSidebar from '@/components/builder/BuilderSidebar';
import { ScrollableSidebar } from '@/components/builder/ScrollableSidebar';
import { CVTemplateRenderer } from '@/components/cv/CVTemplateRenderer';
import { CVSection } from '@/components/builder/CVSection';
import { SectionEditModal } from '@/components/builder/SectionEditModal';
import { AISmartAssistant } from '@/components/builder/AISmartAssistant';
import JobMatcherModal from '@/components/builder/JobMatcherModal';
import { AICVOptimizer } from '@/components/builder/AICVOptimizer';
import { AIResumeEnhancer } from '@/components/builder/AIResumeEnhancer';
import { DesignOptionsModal } from '@/components/modals/DesignOptionsModal';
import TemplateSelectionModal from '@/components/modals/TemplateSelectionModal';
import { CVSettingsModal } from '@/components/modals/CVSettingsModal';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, Eye, Download, Share2, Settings, Palette, Layout, Save, Loader2, Sparkles, Target, Zap, ArrowLeft, FileText, User, Briefcase, GraduationCap, Award, FolderOpen, Users, Clock, BookOpen, Languages } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAnalytics } from '@/hooks/useAnalytics';
import { usePDFGeneration } from '@/hooks/usePDFGeneration';

export default function Builder() {
  const { cvId } = useParams<{ cvId: string }>();
  const navigate = useNavigate();
  const { cvData, setCVData, isLoading, isSaving, cvExists, saveCV, updateCVMetadata } = useCV(cvId);
  const [selectedTemplate, setSelectedTemplate] = useState('elegant');
  const [activeSections, setActiveSections] = useState<string[]>(['personalInfo']);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [sectionData, setSectionData] = useState<any>(null);
  const [cvName, setCVName] = useState('');
  const [cvDescription, setCVDescription] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [sidebarTab, setSidebarTab] = useState<'sections' | 'design' | 'ai'>('sections');
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isJobMatcherOpen, setIsJobMatcherOpen] = useState(false);
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);
  const [isEnhancerOpen, setIsEnhancerOpen] = useState(false);
  const [deletedSections, setDeletedSections] = useState<string[]>([]);
  const { trackEvent } = useAnalytics();
  const { isGenerating, generateAndDownloadPDF } = usePDFGeneration();

  useEffect(() => {
    if (cvId && cvId !== 'new') {
      // Load existing CV
      if (cvData) {
        setCVName(cvData.personalInfo.fullName || 'Untitled CV');
        setCVDescription('CV Description');
        // Set active sections based on available data
        const initialActiveSections = ['personalInfo'];
        if (cvData.experience && cvData.experience.length > 0) initialActiveSections.push('experience');
        if (cvData.education && cvData.education.length > 0) initialActiveSections.push('education');
        if (cvData.skills && cvData.skills.length > 0) initialActiveSections.push('skills');
        if (cvData.projects && cvData.projects.length > 0) initialActiveSections.push('projects');
        if (cvData.courses && cvData.courses.length > 0) initialActiveSections.push('courses');
        if (cvData.certificates && cvData.certificates.length > 0) initialActiveSections.push('certificates');
        if (cvData.languages && cvData.languages.length > 0) initialActiveSections.push('languages');
        if (cvData.references && cvData.references.length > 0) initialActiveSections.push('references');
        setActiveSections(initialActiveSections);
      }
    } else if (cvId === 'new') {
      // Create new CV
      setCVName('Untitled CV');
      setCVDescription('CV Description');
      setActiveSections(['personalInfo']);
    }
  }, [cvId, cvData]);

  useEffect(() => {
    // Auto-save functionality
    if (autoSaveEnabled && cvData) {
      handleAutoSave(cvData);
    }
    // Cleanup timeout on unmount
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [cvData, autoSaveEnabled]);

  const handleSectionToggle = (section: string) => {
    setActiveSections(prev => {
      if (prev.includes(section)) {
        return prev.filter(s => s !== section);
      } else {
        return [...prev, section];
      }
    });
  };

  const handleEditSection = (section: string) => {
    setEditingSection(section);
    setSectionData(getActiveSectionData(section));
  };

  const handleSaveSection = (section: string, data: any) => {
    setCVData(prev => {
      if (!prev) return prev;

      const updatedCVData: CVData = { ...prev };

      switch (section) {
        case 'personalInfo':
          updatedCVData.personalInfo = data;
          break;
        case 'experience':
          updatedCVData.experience = data;
          break;
        case 'education':
          updatedCVData.education = data;
          break;
        case 'skills':
          updatedCVData.skills = data;
          break;
        case 'projects':
          updatedCVData.projects = data;
          break;
        case 'courses':
          updatedCVData.courses = data;
          break;
        case 'certificates':
          updatedCVData.certificates = data;
          break;
        case 'languages':
          updatedCVData.languages = data;
          break;
        case 'references':
          updatedCVData.references = data;
          break;
        default:
          console.warn(`Unhandled section: ${section}`);
      }

      return updatedCVData;
    });

    setEditingSection(null);
    setSectionData(null);

    if (autoSaveEnabled) {
      handleAutoSave();
    }
  };

  const handleDeleteSection = (section: string) => {
    setDeletedSections(prev => [...prev, section]);
    setCVData(prev => {
      if (!prev) return prev;

      const updatedCVData: CVData = { ...prev };

      switch (section) {
        case 'experience':
          updatedCVData.experience = [];
          break;
        case 'education':
          updatedCVData.education = [];
          break;
        case 'skills':
          updatedCVData.skills = [];
          break;
        case 'projects':
          updatedCVData.projects = [];
          break;
        case 'courses':
          updatedCVData.courses = [];
          break;
        case 'certificates':
          updatedCVData.certificates = [];
          break;
        case 'languages':
          updatedCVData.languages = [];
          break;
        case 'references':
          updatedCVData.references = [];
          break;
        default:
          console.warn(`Unhandled section: ${section}`);
      }

      return updatedCVData;
    });
    setActiveSections(prev => prev.filter(s => s !== section));

    if (autoSaveEnabled) {
      handleAutoSave();
    }
  };

  const handleAISectionsGenerated = (updatedCVData: CVData, newSections: string[]) => {
    setCVData(updatedCVData);
    
    // Add new sections to active sections
    const sectionsToAdd = newSections.filter(section => !activeSections.includes(section));
    if (sectionsToAdd.length > 0) {
      setActiveSections(prev => [...prev, ...sectionsToAdd]);
    }
    
    // Auto-save the updated CV
    if (autoSaveEnabled) {
      handleAutoSave(updatedCVData);
    }
    
    trackEvent('ai_sections_generated', {
      sections: newSections,
      cv_id: cvId
    });
  };

  const handleAutoSave = (dataToSave: CVData = cvData) => {
    if (!dataToSave || !autoSaveEnabled) return;
    
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveCV(dataToSave, deletedSections, activeSections);
      setLastSaved(new Date());
    }, 2000);
  };

  const handleManualSave = async () => {
    if (cvData) {
      const success = await saveCV(cvData, deletedSections, activeSections);
      if (success) {
        setLastSaved(new Date());
        toast({
          title: "CV Saved!",
          description: "Your changes have been saved successfully."
        });
        trackEvent('manual_save', { cv_id: cvId });
      } else {
        toast({
          title: "Error saving CV",
          description: "Failed to save changes. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleUpdateMetadata = async () => {
    const success = await updateCVMetadata(cvName, cvDescription);
    if (success) {
      toast({
        title: "CV Updated",
        description: "CV name and description updated successfully."
      });
      trackEvent('update_metadata', { cv_id: cvId });
    } else {
      toast({
        title: "Error",
        description: "Failed to update CV details.",
        variant: "destructive"
      });
    }
  };

  const handleDesignUpdate = (designOptions: CVData['designOptions']) => {
    setCVData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        designOptions: designOptions
      };
    });
    if (autoSaveEnabled) {
      handleAutoSave();
    }
    trackEvent('design_update', { cv_id: cvId });
  };

  const handleTemplateChange = (templateId: string, templateName: string) => {
    setSelectedTemplate(templateId);
    trackEvent('template_change', { template_id: templateId, cv_id: cvId });
  };

  const handlePreview = () => {
    window.open(`/cv/${cvId}`, '_blank');
    trackEvent('preview_cv', { cv_id: cvId });
  };

  const handleDownload = async () => {
    if (cvData) {
      await generateAndDownloadPDF(cvData, selectedTemplate, activeSections, cvName);
      trackEvent('download_cv', { cv_id: cvId, template_id: selectedTemplate });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/cv/${cvId}`);
    toast({
      title: "CV Link Copied!",
      description: "Share this link to allow others to view your CV."
    });
    trackEvent('share_cv', { cv_id: cvId });
  };

  const getActiveSectionData = (section: string) => {
    if (!cvData) return null;

    switch (section) {
      case 'personalInfo':
        return cvData.personalInfo;
      case 'experience':
        return cvData.experience;
      case 'education':
        return cvData.education;
      case 'skills':
        return cvData.skills;
      case 'projects':
        return cvData.projects;
      case 'courses':
        return cvData.courses;
      case 'certificates':
        return cvData.certificates;
      case 'languages':
        return cvData.languages;
      case 'references':
        return cvData.references;
      default:
        return null;
    }
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'personalInfo':
        return <User className="h-4 w-4" />;
      case 'experience':
        return <Briefcase className="h-4 w-4" />;
      case 'education':
        return <GraduationCap className="h-4 w-4" />;
      case 'skills':
        return <Award className="h-4 w-4" />;
      case 'projects':
        return <FolderOpen className="h-4 w-4" />;
      case 'courses':
        return <BookOpen className="h-4 w-4" />;
      case 'certificates':
        return <Award className="h-4 w-4" />;
      case 'languages':
        return <Languages className="h-4 w-4" />;
      case 'references':
        return <Users className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'personalInfo':
        return 'Personal Information';
      case 'experience':
        return 'Work Experience';
      case 'education':
        return 'Education';
      case 'skills':
        return 'Skills';
      case 'projects':
        return 'Projects';
       case 'courses':
        return 'Courses';
      case 'certificates':
        return 'Certificates';
      case 'languages':
        return 'Languages';
      case 'references':
        return 'References';
      default:
        return 'Untitled Section';
    }
  };

  const getSectionDescription = (section: string) => {
    switch (section) {
      case 'personalInfo':
        return 'Add your contact details and a professional summary.';
      case 'experience':
        return 'Showcase your work history and achievements.';
      case 'education':
        return 'List your academic qualifications and certifications.';
      case 'skills':
        return 'Highlight your key skills and expertise.';
      case 'projects':
        return 'Display your personal and professional projects.';
      case 'courses':
        return 'List relevant courses and training programs.';
      case 'certificates':
        return 'Showcase your certifications and credentials.';
      case 'languages':
        return 'List languages you know and your proficiency.';
      case 'references':
        return 'Provide references from previous employers or colleagues.';
      default:
        return 'Customize this section to suit your needs.';
    }
  };

  const createEmptyCV = (): CVData => ({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      title: '',
      summary: '',
      personal_website: '',
      linkedin: '',
      github: ''
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
    courses: [],
    certificates: [],
    languages: [],
    references: []
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        Loading CV...
      </div>
    );
  }

  if (cvExists === false) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card>
          <CardHeader>
            <CardTitle>CV Not Found</CardTitle>
            <CardDescription>The requested CV does not exist or you do not have permission to view it.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleJobMatcherOptimize = (optimizedData: CVData) => {
    setCVData(optimizedData);
    if (autoSaveEnabled) {
      handleAutoSave(optimizedData);
    }
    trackEvent('job_matcher_optimize', { cv_id: cvId });
  };

  const handleOptimizerUpdate = (optimizedData: CVData) => {
    setCVData(optimizedData);
    if (autoSaveEnabled) {
      handleAutoSave(optimizedData);
    }
    trackEvent('cv_optimizer_update', { cv_id: cvId });
  };

  const handleEnhancerUpdate = (enhancedData: CVData) => {
    setCVData(enhancedData);
    if (autoSaveEnabled) {
      handleAutoSave(enhancedData);
    }
    trackEvent('cv_enhancer_update', { cv_id: cvId });
  };

  const currentData = cvData || createEmptyCV();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Builder Sidebar */}
      <BuilderSidebar
        isOpen={true}
        onClose={() => { }}
        defaultTab={sidebarTab}
      >
        <ScrollableSidebar className="w-full">
          <Tabs defaultValue={sidebarTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sections" onClick={() => setSidebarTab('sections')}>
                <FileText className="mr-2 h-4 w-4" />
                Sections
              </TabsTrigger>
              <TabsTrigger value="design" onClick={() => setSidebarTab('design')}>
                <Palette className="mr-2 h-4 w-4" />
                Design
              </TabsTrigger>
              <TabsTrigger value="ai" onClick={() => setSidebarTab('ai')}>
                <Zap className="mr-2 h-4 w-4" />
                AI
              </TabsTrigger>
            </TabsList>
            <Separator className="my-2" />

            {/* Sections Tab */}
            <TabsContent value="sections" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>CV Details</CardTitle>
                  <CardDescription>Update your CV name and description.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid w-full gap-2">
                    <Label htmlFor="name">CV Name</Label>
                    <Input type="text" id="name" value={cvName} onChange={(e) => setCVName(e.target.value)} />
                  </div>
                  <div className="grid w-full gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input type="text" id="description" value={cvDescription} onChange={(e) => setCVDescription(e.target.value)} />
                  </div>
                  <Button size="sm" className="mt-4" onClick={handleUpdateMetadata}>
                    Update Details
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>CV Sections</CardTitle>
                  <CardDescription>Add, edit, and manage your CV sections.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* List of Sections */}
                  <div className="space-y-3">
                    {['personalInfo', 'experience', 'education', 'skills', 'projects', 'courses', 'certificates', 'languages', 'references'].map((section) => (
                      <CVSection
                        key={section}
                        title={getSectionTitle(section)}
                        description={getSectionDescription(section)}
                        icon={getSectionIcon(section)}
                        active={activeSections.includes(section)}
                        onToggle={() => handleSectionToggle(section)}
                        onEdit={() => handleEditSection(section)}
                        onDelete={() => handleDeleteSection(section)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Design Tab */}
            <TabsContent value="design" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Design Options</CardTitle>
                  <CardDescription>Customize the look and feel of your CV.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={() => setIsDesignModalOpen(true)}>
                    <Palette className="mr-2 h-4 w-4" />
                    Edit Design Options
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Template Selection</CardTitle>
                  <CardDescription>Choose a template that suits your style.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={() => setIsTemplateModalOpen(true)}>
                    <Layout className="mr-2 h-4 w-4" />
                    Change Template
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Tab */}
            <TabsContent value="ai" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Smart Assistant</CardTitle>
                  <CardDescription>Generate CV sections automatically using AI.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={() => setIsAIAssistantOpen(true)}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Sections
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Matcher</CardTitle>
                  <CardDescription>Optimize your CV for a specific job description.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={() => setIsJobMatcherOpen(true)}>
                    <Target className="mr-2 h-4 w-4" />
                    Optimize for a Job
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI CV Optimizer</CardTitle>
                  <CardDescription>Get suggestions to improve your CV content.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={() => setIsOptimizerOpen(true)}>
                    <Zap className="mr-2 h-4 w-4" />
                    Optimize CV Content
                  </Button>
                </CardContent>
              </Card>

               <Card>
                <CardHeader>
                  <CardTitle>AI Resume Enhancer</CardTitle>
                  <CardDescription>Enhance your resume with AI-powered suggestions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={() => setIsEnhancerOpen(true)}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Enhance Resume
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollableSidebar>
      </BuilderSidebar>

      {/* CV Renderer */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">{cvName}</h2>
              {lastSaved && (
                <Badge variant="secondary">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button onClick={handleDownload} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Download
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button onClick={handleManualSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save
              </Button>
              <Button variant="ghost" onClick={() => setIsSettingsModalOpen(true)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-4">
            <CVTemplateRenderer templateId={selectedTemplate} cvData={currentData} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <SectionEditModal
        isOpen={!!editingSection}
        onClose={() => setEditingSection(null)}
        section={editingSection || 'personalInfo'}
        data={sectionData}
        onSave={handleSaveSection}
      />

      <DesignOptionsModal
        isOpen={isDesignModalOpen}
        onClose={() => setIsDesignModalOpen(false)}
        designOptions={cvData?.designOptions}
        onDesignUpdate={handleDesignUpdate}
      />

      <TemplateSelectionModal
        open={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        currentTemplate={selectedTemplate}
        onTemplateChange={handleTemplateChange}
      />

      <CVSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onAutoSaveToggle={setAutoSaveEnabled}
      />

      <AISmartAssistant
        open={isAIAssistantOpen}
        setOpen={setIsAIAssistantOpen}
        onSectionsGenerated={handleAISectionsGenerated}
        cvData={currentData}
      />

      <JobMatcherModal
        open={isJobMatcherOpen}
        setOpen={setIsJobMatcherOpen}
        cvData={currentData}
        onOptimize={handleJobMatcherOptimize}
      />

      <AICVOptimizer
        open={isOptimizerOpen}
        setOpen={setIsOptimizerOpen}
        cvData={currentData}
        onUpdate={handleOptimizerUpdate}
      />

      <AIResumeEnhancer
        open={isEnhancerOpen}
        setOpen={setIsEnhancerOpen}
        cvData={currentData}
        onUpdate={handleEnhancerUpdate}
      />

      <Toaster />
    </div>
  );
}
