import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCV } from '@/hooks/useCV';
import { CVData } from '@/types/cv';
import { ArrowLeft, Save, Plus, User, Briefcase, GraduationCap, Award, FileText, Users, Eye, Zap, Undo, Redo, Settings, Layout, Sparkles, Star } from 'lucide-react';
import { BuilderSidebar } from '@/components/builder/BuilderSidebar';
import { CVSection } from '@/components/builder/CVSection';
import { SectionEditModal } from '@/components/builder/SectionEditModal';
import { CVSettingsModal } from '@/components/modals/CVSettingsModal';
import { CVTemplateRenderer } from '@/components/cv/CVTemplateRenderer';
import { cvTemplates } from '@/data/templates';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Navbar } from '@/components/layout/Navbar';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { AISmartAssistant } from '@/components/builder/AISmartAssistant';
import { AICVOptimizer } from '@/components/builder/AICVOptimizer';
import { AIResumeEnhancer } from '@/components/builder/AIResumeEnhancer';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/hooks/useAnalytics';
import { LOGO_NAME, WEBSITE_URL } from "@/lib/constants";
import Joyride, { CallBackProps as JoyrideCallBackProps } from 'react-joyride';
import { useLocation } from 'react-router-dom';

const Builder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cvData, setCVData, isLoading, isSaving, cvExists, saveCV, updateCVMetadata } = useCV(id);
  const { trackCVDownload, trackCVShare, trackCVEdit } = useAnalytics();
  
  // Check if CV exists and redirect if not
  useEffect(() => {
    if (cvExists === false) {
      toast({
        title: "CV Not Found",
        description: "The requested CV could not be found or you don't have access to it.",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [cvExists, navigate]);

  const location = useLocation();
  const [joyrideRun, setJoyrideRun] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('startBuilderDemo')) {
      setJoyrideRun(true);
    }
  }, [location]);

  const joyrideSteps = [
    {
      target: '.btn-smart-generator',
      content: 'Start by using the Smart Generator to help build your CV!',
      disableBeacon: true,
    },
    {
      target: '.btn-generate-sections',
      content: 'Click here to generate recommended sections for your CV.',
    },
    {
      target: '.btn-apply-sections',
      content: 'Apply the generated sections to your CV.',
    },
    {
      target: '.btn-preview',
      content: 'Preview your CV here.',
    },
  ];

  const handleJoyrideCallback = (data: JoyrideCallBackProps) => {
    if (data.status === 'finished' || data.status === 'skipped') {
      // Remove the flag from the URL
      navigate(`/builder/${id}`, { replace: true });
    }
  };

  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  // Start with empty sections for new CVs
  const [cvSections, setCVSections] = useState<string[]>([]);
  const [deletedSections, setDeletedSections] = useState<string[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState('modern');
  const [cvMetadata, setCVMetadata] = useState({ name: '', description: '' });
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    sectionType: string;
    sectionTitle: string;
  }>({
    isOpen: false,
    sectionType: '',
    sectionTitle: ''
  });
  const [settingsModal, setSettingsModal] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [undoStack, setUndoStack] = useState<CVData[]>([]);
  const [redoStack, setRedoStack] = useState<CVData[]>([]);
  const [aiAssistantOpen, setAIAssistantOpen] = useState(false);
  const [aiOptimizerOpen, setAIOptimizerOpen] = useState(false);
  const [aiEnhancerOpen, setAIEnhancerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Check if we're on a mobile screen (width < 768px)
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    if (cvData && id && id !== 'new') {
      fetchCVMetadata();
      fetchCVTemplate();
      
      // Load sections configuration from database
      const content = cvData as CVData & { _deletedSections?: string[]; _sections?: string[] };
      if (content._deletedSections && Array.isArray(content._deletedSections)) {
        setDeletedSections(content._deletedSections);
      }
      
      // For existing CVs, determine active sections based on actual content and saved sections
      if (content._sections && Array.isArray(content._sections)) {
        setCVSections(content._sections);
      } else {
        // Determine sections based on actual content
        const activeSections: string[] = [];
        
        // Always include personalInfo as it should always be present
        if (cvData.personalInfo && (cvData.personalInfo.fullName || cvData.personalInfo.email)) {
          activeSections.push('personalInfo');
        }
        
        // Only include sections that have actual content
        if (cvData.experience && cvData.experience.length > 0) {
          activeSections.push('experience');
        }
        if (cvData.education && cvData.education.length > 0) {
          activeSections.push('education');
        }
        if (cvData.skills && cvData.skills.length > 0) {
          activeSections.push('skills');
        }
        if (cvData.projects && cvData.projects.length > 0) {
          activeSections.push('projects');
        }
        if (cvData.references && cvData.references.length > 0) {
          activeSections.push('references');
        }
        
        setCVSections(activeSections);
      }
    } else if (id === 'new') {
      // For new CVs, start completely empty except personalInfo
      setCVSections(['personalInfo']);
      setDeletedSections([]);
    }
  }, [cvData, id]);

  // Handle responsive sidebar collapse
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setSidebarCollapsed(isMobile);
    };

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-save preview data whenever cvData changes
  useEffect(() => {
    if (cvData && id && id !== 'new') {
      localStorage.setItem('previewCVData', JSON.stringify({
        cvData,
        template: currentTemplate,
        sections: cvSections,
        cvId: id
      }));
    }
  }, [cvData, currentTemplate, cvSections, id]);

  const fetchCVMetadata = async () => {
    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('name, description')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setCVMetadata({ 
          name: data.name || '', 
          description: data.description || '' 
        });
      }
    } catch (error) {
      console.error('Error fetching CV metadata:', error);
    }
  };

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

  const handleDownload = () => {
    const input = document.getElementById('cv-content');
    if (input) {
      html2canvas(input, { scale: 2, useCORS: true })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          const fileName = cvMetadata.name ? `${cvMetadata.name}.pdf` : 'cv.pdf';
          pdf.save(fileName);
          
          // Track download from builder
          if (id && id !== 'new') {
            trackCVDownload(id, 'pdf', { 
              fileName, 
              template: currentTemplate,
              source: 'builder'
            });
          }
        });
    }
  };

  const handleShare = async () => {
    if (!id || id === 'new') {
      toast({
        title: "Save CV First",
        description: "Please save your CV before sharing.",
        variant: "destructive"
      });
      return;
    }

    const shareUrl = `${window.location.origin}/preview/${id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: cvMetadata.name || 'My CV',
          text: 'Check out my CV',
          url: shareUrl,
        });
        
        // Track share from builder
        trackCVShare(id, 'native', { 
          shareUrl, 
          cvName: cvMetadata.name,
          source: 'builder' 
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied",
          description: "CV link has been copied to clipboard."
        });
        
        // Track share from builder
        trackCVShare(id, 'clipboard', { 
          shareUrl, 
          cvName: cvMetadata.name,
          source: 'builder' 
        });
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "CV link has been copied to clipboard."
      });
      
      // Track share from builder
      trackCVShare(id, 'clipboard', { 
        shareUrl, 
        cvName: cvMetadata.name,
        source: 'builder' 
      });
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target?.result as string);
            if (importedData && typeof importedData === 'object') {
              setCVData(importedData);
              toast({
                title: "Data Imported",
                description: "CV data has been imported successfully."
              });
            }
          } catch (error) {
            toast({
              title: "Import Failed",
              description: "Invalid file format.",
              variant: "destructive"
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    if (!cvData) {
      toast({
        title: "No Data",
        description: "No CV data to export.",
        variant: "destructive"
      });
      return;
    }

    const dataToExport = {
      ...cvData,
      template: currentTemplate,
      sections: cvSections,
      metadata: cvMetadata
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cvMetadata.name || 'cv-data'}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "CV data has been exported successfully."
    });
  };

  const handleAIAssist = () => {
    setAIAssistantOpen(true);
  };

  const handleAIOptimizer = () => {
    setAIOptimizerOpen(true);
  };

  const handleAIEnhancer = () => {
    setAIEnhancerOpen(true);
  };

  const handleAISectionsGenerated = (updatedCVData: CVData, newSectionIds: string[]) => {
    try {
      // Save current state to history
      if (cvData) {
        saveToHistory(cvData);
      }
      
      // Validate the updated CV data structure
      const validatedCVData: CVData = {
        personalInfo: updatedCVData.personalInfo || {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          summary: ''
        },
        experience: Array.isArray(updatedCVData.experience) ? updatedCVData.experience : [],
        education: Array.isArray(updatedCVData.education) ? updatedCVData.education : [],
        skills: Array.isArray(updatedCVData.skills) ? updatedCVData.skills : [],
        projects: Array.isArray(updatedCVData.projects) ? updatedCVData.projects : [],
        references: Array.isArray(updatedCVData.references) ? updatedCVData.references : []
      };
      
      // Update CV data
      setCVData(validatedCVData);
      
      // Add new sections to the CV structure if they're not already there
      const sectionsToAdd = newSectionIds.filter(sectionId => !cvSections.includes(sectionId));
      if (sectionsToAdd.length > 0) {
        setCVSections(prev => [...prev, ...sectionsToAdd]);
      }
      
      // Auto-save the changes
      if (validatedCVData) {
        saveCV(validatedCVData, deletedSections, [...cvSections, ...sectionsToAdd]);
      }
    } catch (error) {
      console.error('Error handling AI sections generated:', error);
      toast({
        title: "Error",
        description: "Failed to apply AI-generated sections. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">Loading CV Builder...</p>
          </div>
        </div>
      </>
    );
  }

  if (id === 'new') {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center pt-16">
          <Card className="w-full max-w-md bg-white/80 backdrop-blur-lg border-0 shadow-2xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Choose a Template</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6 text-lg">
                Please select a template first to start building your CV.
              </p>
              <Button 
                onClick={() => navigate('/templates')} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Browse Templates
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (!cvData || cvExists === false) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center pt-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">CV not found</h2>
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </>
    );
  }

  const currentTemplateInfo = cvTemplates.find(t => t.id === currentTemplate);

  // All available sections - these are always shown if not in the CV structure
  const allSections = [
    { id: 'personalInfo', title: 'Personal Info', icon: <User className="h-5 w-5" />, description: 'Your basic information' },
    { id: 'experience', title: 'Experience', icon: <Briefcase className="h-5 w-5" />, description: 'Work history and achievements' },
    { id: 'education', title: 'Education', icon: <GraduationCap className="h-5 w-5" />, description: 'Academic background' },
    { id: 'skills', title: 'Skills', icon: <Award className="h-5 w-5" />, description: 'Technical and soft skills' },
    { id: 'projects', title: 'Projects', icon: <FileText className="h-5 w-5" />, description: 'Portfolio and projects' },
    { id: 'references', title: 'References', icon: <Users className="h-5 w-5" />, description: 'Professional references' }
  ];

  // Available sections are those not currently in the CV structure and not deleted
  const availableSections = allSections.filter(section => 
    !cvSections.includes(section.id) && !deletedSections.includes(section.id)
  );

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
        // Remove from deleted sections if it was there
        setDeletedSections(prev => prev.filter(s => s !== draggedSection));
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
    const section = allSections.find(s => s.id === sectionId);
    if (section) {
      setEditModal({
        isOpen: true,
        sectionType: sectionId,
        sectionTitle: section.title
      });
      
      // Track section edit start
      if (id && id !== 'new') {
        trackCVEdit(id, sectionId, { action: 'start_edit' });
      }
    }
  };

  const handleSectionDelete = (sectionId: string) => {
    if (cvData) {
      saveToHistory(cvData);
    }
    const baseId = sectionId.split('_')[0];
    
    // Don't allow deleting personalInfo
    if (baseId === 'personalInfo') {
      toast({
        title: "Cannot Delete",
        description: "Personal Info section cannot be deleted.",
        variant: "destructive"
      });
      return;
    }
    
    // Remove from CV structure
    const newCVSections = cvSections.filter(id => id !== sectionId);
    setCVSections(newCVSections);
    
    // Add to deleted sections to persist the deletion
    const newDeletedSections = [...deletedSections, baseId];
    setDeletedSections(newDeletedSections);
    
    // Save to database immediately
    if (cvData) {
      saveCV(cvData, newDeletedSections, newCVSections);
    }
    
    toast({
      title: "Section Removed",
      description: "Section has been removed and is now available below.",
    });
  };

  const handleSave = async () => {
    if (!cvData) return;
    
    // Ensure data integrity before saving
    const sanitizedData: CVData = {
      personalInfo: cvData.personalInfo || {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: ''
      },
      experience: Array.isArray(cvData.experience) ? cvData.experience : [],
      education: Array.isArray(cvData.education) ? cvData.education : [],
      skills: Array.isArray(cvData.skills) ? cvData.skills : [],
      projects: Array.isArray(cvData.projects) ? cvData.projects : [],
      references: Array.isArray(cvData.references) ? cvData.references : []
    };
    
    try {
      await saveCV(sanitizedData, deletedSections, cvSections);
      setCVData(sanitizedData);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handlePreview = () => {
    if (!cvData) {
      toast({
        title: "Error",
        description: "Cannot preview CV. Please save your changes first.",
        variant: "destructive"
      });
      return;
    }
    
    // Save CV data to localStorage for preview with CV ID
    localStorage.setItem('previewCVData', JSON.stringify({
      cvData,
      template: currentTemplate,
      sections: cvSections,
      cvId: id !== 'new' ? id : undefined
    }));
    
    // Navigate to preview page
    if (id && id !== 'new') {
      navigate(`/preview/${id}`);
    } else {
      navigate('/preview');
    }
  };

  const handleModalSave = (updatedData: CVData) => {
    console.log('Modal save:', updatedData);
    
    // Ensure all array fields exist and are properly structured
    const sanitizedData: CVData = {
      personalInfo: updatedData.personalInfo || {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: ''
      },
      experience: Array.isArray(updatedData.experience) ? updatedData.experience : [],
      education: Array.isArray(updatedData.education) ? updatedData.education : [],
      skills: Array.isArray(updatedData.skills) ? updatedData.skills : [],
      projects: Array.isArray(updatedData.projects) ? updatedData.projects : [],
      references: Array.isArray(updatedData.references) ? updatedData.references : []
    };
    
    setCVData(sanitizedData);
    
    // Update localStorage immediately for preview sync
    if (id && id !== 'new') {
      localStorage.setItem('previewCVData', JSON.stringify({
        cvData: sanitizedData,
        template: currentTemplate,
        sections: cvSections,
        cvId: id
      }));
    }
    
    // Auto-save to database
    if (sanitizedData) {
      saveCV(sanitizedData, deletedSections, cvSections);
    }
    
    toast({
      title: "Changes Applied",
      description: "Section updated and saved successfully!",
    });
    
    // Track section edit completion
    if (id && id !== 'new') {
      trackCVEdit(id, 'section_updated', { action: 'complete_edit' });
    }
  };

  const handleCVMetadataUpdate = async (name: string, description: string): Promise<boolean> => {
    try {
      // Update local state immediately for real-time UI update
      setCVMetadata({ name, description });
      
      // Call the original update function
      const success = await updateCVMetadata(name, description);
      
      if (success) {
        // Refresh metadata from database to ensure consistency
        await fetchCVMetadata();
        toast({
          title: "CV Updated",
          description: "Your CV details have been saved successfully."
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error updating CV metadata:', error);
      toast({
        title: "Error",
        description: "Failed to update CV details.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleRealTimeMetadataUpdate = (name: string, description: string) => {
    // Only update local state for real-time UI update, don't persist yet
    // This will be reverted if the user cancels the modal
    setCVMetadata({ name, description });
  };

  const handleSettingsModalClose = () => {
    // Refresh metadata from database to restore original values if modal was cancelled
    fetchCVMetadata();
    setSettingsModal(false);
  };

  const renderSectionContent = (sectionId: string): React.ReactNode => {
    if (!cvData) return null;

    const baseId = sectionId.split('_')[0];
    
    switch (baseId) {
      case 'personalInfo':
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Name:</strong> {cvData.personalInfo?.fullName || 'Not provided'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {cvData.personalInfo?.email || 'Not provided'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Phone:</strong> {cvData.personalInfo?.phone || 'Not provided'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Location:</strong> {cvData.personalInfo?.location || 'Not provided'}
            </p>
            {cvData.personalInfo?.summary && (
              <p className="text-sm text-gray-600">
                <strong>Summary:</strong> {cvData.personalInfo.summary}
              </p>
            )}
          </div>
        );
      
      case 'experience':
        return (
          <div className="space-y-3">
            {cvData.experience && cvData.experience.length > 0 ? (
              cvData.experience.map((exp) => (
                <div key={exp.id} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">{exp.title}</h4>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-xs text-gray-500">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </p>
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
            {cvData.education && cvData.education.length > 0 ? (
              cvData.education.map((edu) => (
                <div key={edu.id} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">{edu.degree}</h4>
                  <p className="text-sm text-gray-600">{edu.school}</p>
                  <p className="text-xs text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </p>
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
            {cvData.skills && cvData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {cvData.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
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
                <div key={project.id} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">{project.name}</h4>
                  <p className="text-sm text-gray-600">{project.technologies}</p>
                  <p className="text-xs text-gray-500">
                    {project.startDate} - {project.endDate || 'Present'}
                  </p>
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
                <div key={reference.id} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">{reference.name}</h4>
                  <p className="text-sm text-gray-600">
                    {reference.position} at {reference.company}
                  </p>
                  <p className="text-xs text-gray-500">{reference.email}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No references added yet</p>
            )}
          </div>
        );
      
      default:
        return <p className="text-sm text-gray-500">Section content</p>;
    }
  };

  return (
    <>
      <Helmet>
        <title>{LOGO_NAME} CV Builder | AI CV Builder</title>
        <meta name="description" content="Use the AI-powered CV Builder to create, edit, and optimize your professional resume with modern templates." />
        <meta property="og:title" content={`${LOGO_NAME} CV Builder | AI CV Builder`} />
        <meta property="og:description" content="Use the AI-powered CV Builder to create, edit, and optimize your professional resume with modern templates." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${WEBSITE_URL}/builder`} />
        <meta property="og:image" content="/templates/elegant-template.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${LOGO_NAME} CV Builder | AI CV Builder`} />
        <meta name="twitter:description" content="Use the AI-powered CV Builder to create, edit, and optimize your professional resume with modern templates." />
        <meta name="twitter:image" content="/templates/elegant-template.png" />
      </Helmet>
      <Navbar />
      <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-white to-cyan-50 pt-8 sm:pt-14 md:pt-12 ">
        <TooltipProvider>
          {/* Enhanced Header */}
          <div className="fixed top-16 left-0 right-0 bg-white/90 backdrop-blur-2xl border-b border-gray-200/50 shadow-xl z-30">
            <div className="container mx-auto py-2 px-4 sm:px-6">
              <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-2 sm:gap-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="border border-gray-300 hover:border-violet-500 hover:bg-violet-50 rounded-lg transition-all duration-300 px-2 sm:px-3 py-1 h-7 text-xs sm:text-sm"
                  >
                    <ArrowLeft className="mr-1 h-3 w-3" />
                    <span className="hidden sm:inline">Back</span>
                  </Button>
                  
                  {/* Title Section - Responsive */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 flex items-center justify-center shadow-md ring-1 ring-white/50">
                      <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                    <div className="hidden sm:block">
                      <h1 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-violet-700 via-purple-700 to-blue-700 bg-clip-text text-transparent">
                        {cvMetadata.name || 'Professional CV Builder'}
                      </h1>
                      <div className="flex items-center gap-2 mt-0.5">
                        {cvMetadata.description && (
                          <span className="text-xs text-gray-600 max-w-xs truncate">
                            {cvMetadata.description}
                          </span>
                        )}
                        {currentTemplateInfo && (
                          <>
                            <Badge className="bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-0 px-2 py-0.5 text-xs font-semibold">
                              {currentTemplateInfo.name}
                            </Badge>
                            <Badge variant="outline" className="border border-gray-300 px-2 py-0.5 text-xs">
                              {currentTemplateInfo.category}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                    {/* Mobile Title */}
                    <div className="sm:hidden">
                      <h1 className="text-sm font-bold bg-gradient-to-r from-violet-700 via-purple-700 to-blue-700 bg-clip-text text-transparent">
                        {cvMetadata.name || 'CV Builder'}
                      </h1>
                    </div>
                  </div>
                </div>
                
                {/* Right Section - Responsive */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Undo/Redo - Hidden on very small screens */}
                  <div className="hidden sm:flex items-center gap-0.5 bg-gray-50 rounded-lg p-0.5">
                    <Button 
                      variant="outline"
                      onClick={handleUndo}
                      disabled={undoStack.length === 0}
                      size="sm"
                      title="Undo"
                      className="btn-undo border-0 hover:bg-white rounded-md h-6 w-6 p-0"
                    >
                      <Undo className="h-2.5 w-2.5" />
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={handleRedo}
                      disabled={redoStack.length === 0}
                      size="sm"
                      title="Redo"
                      className="btn-redo border-0 hover:bg-white rounded-md h-6 w-6 p-0"
                    >
                      <Redo className="h-2.5 w-2.5" />
                    </Button>
                  </div>

                  {/* Settings - Icon only on mobile */}
                  <Button 
                    variant="outline"
                    onClick={() => setSettingsModal(true)}
                    className="btn-settings border border-gray-300 hover:border-purple-500 hover:bg-purple-50 rounded-md px-2 py-1 h-7 text-xs"
                    title="Settings"
                  >
                    <Settings className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline">Settings</span>
                  </Button>

                  {/* Preview - Icon only on mobile */}
                  <Button 
                    variant="outline"
                    onClick={handlePreview}
                    className="btn-preview border border-gray-300 hover:border-blue-500 hover:bg-blue-50 rounded-md px-2 py-1 h-7 text-xs"
                    title="Preview"
                  >
                    <Eye className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline">Preview</span>
                  </Button>
                  
                  {/* Save - Compact on mobile */}
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving} 
                    className="btn-save bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-300 px-2 sm:px-3 py-1 h-7 text-xs"
                  >
                    <Save className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save CV'}</span>
                    <span className="sm:hidden">{isSaving ? '...' : 'Save'}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content with Sidebar */}
          <div className="flex w-full pt-20">
            {/* Left Sidebar */}
            <div className="transition-all duration-300 ease-in-out">
              <BuilderSidebar
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                onAIAssist={handleAIAssist}
                onAIOptimizer={handleAIOptimizer}
                onAIEnhancer={handleAIEnhancer}
                onTemplateNavigation={() => navigate('/templates')}
                onSave={handleSave}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* CV Builder Area */}
                <div className="xl:col-span-1">
                  {/* Add Sections Section - Moved from sidebar */}
                  <Card className="add-section bg-white/90 backdrop-blur-2xl border-0 shadow-2xl rounded-2xl overflow-hidden mb-4 sm:mb-6">
                    <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50 py-3 sm:py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg">
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-base sm:text-lg font-bold text-gray-900">Add Sections</CardTitle>
                            <p className="text-xs sm:text-sm text-gray-600">Drag to CV structure</p>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 border-0 px-2 sm:px-3 py-1 text-xs font-semibold">
                          {availableSections.length} available
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4">
                      {availableSections.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          {availableSections.map((section) => (
                            <div
                              key={section.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, section.id)}
                              className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 cursor-grab active:cursor-grabbing transition-all duration-200 group"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center shadow-sm">
                                  {React.cloneElement(section.icon as React.ReactElement, { className: "h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" })}
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-indigo-700 truncate">
                                  {section.title}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-3 sm:py-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                            <Star className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                          </div>
                          <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">All sections added!</h3>
                          <p className="text-gray-600 text-xs">Your CV is complete ✨</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* CV Structure Section */}
                  <Card className="bg-white/90 backdrop-blur-2xl border-0 shadow-2xl rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50 py-3 sm:py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg">
                            <Layout className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-base sm:text-lg font-bold text-gray-900">CV Structure</CardTitle>
                            <p className="text-xs sm:text-sm text-gray-600">Drag to reorder • Click to edit content</p>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-0 px-2 sm:px-3 py-1 text-xs font-semibold">
                          {cvSections.length} sections
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4">
                      <div 
                        className="min-h-[250px] sm:min-h-[300px] space-y-2 sm:space-y-3 p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 backdrop-blur-sm transition-all duration-300 hover:border-violet-400"
                        onDragOver={(e) => handleDragOver(e)}
                        onDrop={(e) => handleDrop(e)}
                        onDragLeave={handleDragLeave}
                      >
                        {cvSections.map((sectionId, index) => {
                          const baseId = sectionId.split('_')[0];
                          const section = allSections.find(s => s.id === baseId);
                          const isDragOver = dragOverIndex === index;
                          
                          return (
                            <div key={sectionId}>
                              {isDragOver && draggedSection && (
                                <div className="h-1.5 sm:h-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mb-2 sm:mb-3 animate-pulse shadow-lg" />
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
                          <div className="text-center py-8 sm:py-12">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-xl">
                              <Plus className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                              Start Building Your CV
                            </h3>
                            <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                              Drag sections from above to begin creating your professional CV
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Preview */}
                <div className="xl:col-span-1">
                  <Card className="bg-white/90 backdrop-blur-2xl border-0 shadow-2xl rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 py-3 sm:py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-4">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center shadow-lg">
                            <Eye className="h-3 w-3 sm:h-6 sm:w-6 text-white" />
                          </div>
                          <CardTitle className="text-base sm:text-2xl font-bold text-gray-900">Live Preview</CardTitle>
                        </div>
                        {currentTemplateInfo && (
                          <Badge className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0 px-3 sm:px-5 py-1 sm:py-2 text-xs sm:text-sm font-semibold">
                            {currentTemplateInfo.name}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <div className="bg-white rounded-2xl shadow-2xl min-h-[250px] sm:min-h-[400px] overflow-hidden border-2 border-gray-100">
                        <div id="cv-preview-outer">
                          <div className="cv-preview-scaler">

                          {cvData && cvSections.length > 0 ? (
                            <CVTemplateRenderer
                              cvData={cvData}
                              templateId={currentTemplate}
                              sections={cvSections}
                            />
                            
                          ) : (
                            <div className="text-center text-gray-400 py-8 sm:py-24">
                              <div className="w-12 h-12 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center mx-auto mb-4 sm:mb-8">
                                <FileText className="h-6 w-6 sm:h-12 sm:w-12 text-gray-500" />
                              </div>
                              <p className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4 text-gray-600">Your CV Preview</p>
                              <p className="text-gray-500 text-sm sm:text-lg">Add sections to see your CV come to life</p>
                            </div>
                          )}
                          </div>

                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>

        {/* AI CV Optimizer */}
        {cvData && (
          <AICVOptimizer
            open={aiOptimizerOpen}
            setOpen={setAIOptimizerOpen}
            cvData={cvData}
          />
        )}

        {/* AI Resume Enhancer */}
        {cvData && (
          <AIResumeEnhancer
            open={aiEnhancerOpen}
            setOpen={setAIEnhancerOpen}
            cvData={cvData}
            onEnhance={handleModalSave}
          />
        )}

        {/* AI Smart Assistant */}
        {cvData && (
          <AISmartAssistant
            open={aiAssistantOpen}
            setOpen={setAIAssistantOpen}
            onSectionsGenerated={handleAISectionsGenerated}
            cvData={cvData}
          />
        )}

        {/* Section Edit Modal */}
        <SectionEditModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ ...editModal, isOpen: false })}
          sectionType={editModal.sectionType}
          sectionTitle={editModal.sectionTitle}
          cvData={cvData}
          onSave={handleModalSave}
        />

        {/* CV Settings Modal */}
        {id && id !== 'new' && (
          <CVSettingsModal
            isOpen={settingsModal}
            onClose={handleSettingsModalClose}
            cvId={id}
            currentName={cvMetadata.name}
            currentDescription={cvMetadata.description}
            onUpdate={handleCVMetadataUpdate}
            onRealTimeUpdate={handleRealTimeMetadataUpdate}
          />
        )}
      </div>
      <Joyride
        steps={joyrideSteps}
        run={joyrideRun}
        continuous
        showSkipButton
        showProgress
        callback={handleJoyrideCallback}
        styles={{ options: { zIndex: 10000 } }}
      />
    </>
  );
};

export default Builder;
