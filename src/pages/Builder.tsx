import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCV } from '@/hooks/useCV';
import { CVData } from '@/types/cv';
import { ArrowLeft, Save, Plus, User, Briefcase, GraduationCap, Award, FileText, Users, Eye, Download, Palette, Zap, Undo, Redo, Copy, Share2, Settings, Layout, Wand2, Import, Sparkles, Target, Bot, Mic, ChevronLeft, ChevronRight } from 'lucide-react';
import { SidebarSection } from '@/components/builder/SidebarSection';
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

const Builder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cvData, setCVData, isLoading, isSaving, cvExists, saveCV, updateCVMetadata } = useCV(id);
  
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (cvData && id && id !== 'new') {
      fetchCVMetadata();
      fetchCVTemplate();
      
      // Load sections configuration from database
      const content = cvData as any;
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
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied",
          description: "CV link has been copied to clipboard."
        });
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "CV link has been copied to clipboard."
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
    // Save current state to history
    if (cvData) {
      saveToHistory(cvData);
    }
    
    // Update CV data
    setCVData(updatedCVData);
    
    // Add new sections to the CV structure if they're not already there
    const sectionsToAdd = newSectionIds.filter(sectionId => !cvSections.includes(sectionId));
    if (sectionsToAdd.length > 0) {
      setCVSections(prev => [...prev, ...sectionsToAdd]);
    }
    
    // Auto-save the changes
    if (updatedCVData) {
      saveCV(updatedCVData, deletedSections, [...cvSections, ...sectionsToAdd]);
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

  // All available sections - these are always shown in the sidebar if not in the CV structure
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
    setCVSections(cvSections.filter(id => id !== sectionId));
    
    // Add to deleted sections to persist the deletion
    const newDeletedSections = [...deletedSections, baseId];
    setDeletedSections(newDeletedSections);
    
    // Save to database immediately
    if (cvData) {
      saveCV(cvData, newDeletedSections, cvSections.filter(id => id !== sectionId));
    }
    
    toast({
      title: "Section Removed",
      description: "Section has been removed and is now available in the sidebar."
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
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
        <TooltipProvider>
          <div className="min-h-screen flex w-full relative">
            {/* Modern Collapsible Sidebar */}
            <div 
              className={`
                fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white/95 backdrop-blur-xl border-r border-gray-200/60 
                shadow-2xl transition-all duration-300 ease-in-out z-30
                ${sidebarCollapsed ? 'w-20' : 'w-80'}
              `}
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-gray-100/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  {!sidebarCollapsed && (
                    <div className="animate-fade-in">
                      <h2 className="text-lg font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                        CV Builder Pro
                      </h2>
                      <p className="text-xs text-gray-500 font-medium">AI-Powered Tools</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-8">
                {/* AI Tools Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    {!sidebarCollapsed && (
                      <h3 className="text-sm font-bold text-gray-700 animate-fade-in">AI Assistant Tools</h3>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { icon: Wand2, label: 'AI Generator', desc: 'Generate CV sections', action: handleAIAssist, color: 'from-purple-500 to-violet-500' },
                      { icon: Target, label: 'CV Optimizer', desc: 'Optimize your CV', action: handleAIOptimizer, color: 'from-orange-500 to-red-500' },
                      { icon: Sparkles, label: 'Resume Enhancer', desc: 'Enhance content', action: handleAIEnhancer, color: 'from-pink-500 to-rose-500' }
                    ].map((tool, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={tool.action}
                            className={`
                              w-full p-4 rounded-2xl bg-gradient-to-br ${tool.color} 
                              hover:shadow-lg hover:scale-[1.02] transition-all duration-200 
                              text-white group border border-white/20
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <tool.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                              {!sidebarCollapsed && (
                                <div className="text-left animate-fade-in">
                                  <div className="font-medium text-sm">{tool.label}</div>
                                  <div className="text-xs opacity-90">{tool.desc}</div>
                                </div>
                              )}
                            </div>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className={sidebarCollapsed ? '' : 'hidden'}>
                          <p>{tool.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>

                {/* Available Sections */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Plus className="h-4 w-4 text-white" />
                    </div>
                    {!sidebarCollapsed && (
                      <h3 className="text-sm font-bold text-gray-700 animate-fade-in">Add Sections</h3>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {availableSections.map((section) => (
                      <Tooltip key={section.id}>
                        <TooltipTrigger asChild>
                          <div 
                            draggable 
                            onDragStart={(e) => handleDragStart(e, section.id)}
                            className="
                              p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white 
                              border border-gray-200/60 hover:border-blue-300/60 
                              hover:shadow-md hover:scale-[1.02] transition-all duration-200 
                              cursor-grab active:cursor-grabbing group
                            "
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                {React.cloneElement(section.icon as React.ReactElement, { 
                                  className: "h-4 w-4 text-white" 
                                })}
                              </div>
                              {!sidebarCollapsed && (
                                <div className="text-left animate-fade-in">
                                  <div className="font-medium text-sm text-gray-900">{section.title}</div>
                                  <div className="text-xs text-gray-500">{section.description}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className={sidebarCollapsed ? '' : 'hidden'}>
                          <p>{section.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                    
                    {availableSections.length === 0 && (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Award className="h-8 w-8 text-white" />
                        </div>
                        {!sidebarCollapsed && (
                          <div className="animate-fade-in">
                            <p className="text-sm text-gray-600 font-medium">All sections added!</p>
                            <p className="text-xs text-gray-400 mt-1">Your CV is complete</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Collapse Handle */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="
                  absolute -right-4 top-1/2 transform -translate-y-1/2 
                  w-8 h-12 bg-white border border-gray-200 rounded-r-xl 
                  shadow-lg hover:shadow-xl transition-all duration-200 
                  flex items-center justify-center group hover:bg-gray-50
                  z-10
                "
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                ) : (
                  <ChevronLeft className="h-4 w-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                )}
              </button>
            </div>

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-80'}`}>
              {/* Enhanced Header */}
              <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-lg">
                <div className="container mx-auto py-6 px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <Button
                        variant="outline"
                        onClick={() => navigate('/dashboard')}
                        className="border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-300"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                          <Zap className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {cvMetadata.name || 'CV Builder Pro'}
                          </h1>
                          {currentTemplateInfo && (
                            <div className="flex items-center gap-3 mt-2">
                              <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 px-3 py-1">
                                {currentTemplateInfo.name}
                              </Badge>
                              <Badge variant="outline" className="border-2 border-gray-200 px-3 py-1">
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
                        onClick={handleUndo}
                        disabled={undoStack.length === 0}
                        size="sm"
                        title="Undo"
                        className="border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-300"
                      >
                        <Undo className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={handleRedo}
                        disabled={redoStack.length === 0}
                        size="sm"
                        title="Redo"
                        className="border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-300"
                      >
                        <Redo className="h-4 w-4" />
                      </Button>

                      <Button 
                        variant="outline"
                        onClick={() => setSettingsModal(true)}
                        size="sm"
                        title="CV Settings"
                        className="border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 rounded-xl transition-all duration-300"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>

                      <Button 
                        variant="outline"
                        onClick={handleImportData}
                        size="sm"
                        title="Import Data"
                        className="border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 rounded-xl transition-all duration-300"
                      >
                        <Import className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={handlePreview}
                        className="border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-300"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={handleShare}
                        className="border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 rounded-xl transition-all duration-300"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={handleExport}
                        className="border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 rounded-xl transition-all duration-300"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      
                      <Button 
                        onClick={handleSave} 
                        disabled={isSaving} 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save CV'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="container mx-auto py-12 px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Enhanced CV Builder Area */}
                  <div className="lg:col-span-1">
                    <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl">
                      <CardHeader className="border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-2xl font-bold text-gray-900">CV Structure</CardTitle>
                            <p className="text-gray-600 mt-2">
                              Drag to reorder • Click to edit content
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 px-3 py-2">
                              {cvSections.length} sections
                            </Badge>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => navigate('/templates')}
                              className="border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-300"
                            >
                              <Layout className="h-4 w-4 mr-2" />
                              Change Template
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div 
                          className="min-h-[600px] space-y-6 p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-300"
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
                                  <div className="h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mb-6 animate-pulse shadow-lg" />
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
                            <div className="text-center py-24">
                              <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-8 shadow-xl">
                                <Plus className="h-12 w-12 text-white" />
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Start Building Your CV
                              </h3>
                              <p className="text-gray-600 text-lg max-w-md mx-auto">
                                Drag sections from the sidebar to begin creating your professional CV
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Enhanced Preview */}
                  <div className="lg:col-span-1">
                    <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl sticky top-8">
                      <CardHeader className="border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                              <Eye className="h-5 w-5 text-white" />
                            </div>
                            <CardTitle className="text-xl font-bold text-gray-900">Live Preview</CardTitle>
                          </div>
                          {currentTemplateInfo && (
                            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-2">
                              {currentTemplateInfo.name}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="bg-white rounded-2xl shadow-2xl min-h-[600px] overflow-hidden border-2 border-gray-100">
                          <div id="cv-content">
                            {cvData && cvSections.length > 0 ? (
                              <CVTemplateRenderer
                                cvData={cvData}
                                templateId={currentTemplate}
                                sections={cvSections}
                              />
                            ) : (
                              <div className="text-center text-gray-400 py-24">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center mx-auto mb-6">
                                  <FileText className="h-10 w-10 text-gray-500" />
                                </div>
                                <p className="text-xl font-semibold mb-3 text-gray-600">Your CV Preview</p>
                                <p className="text-gray-500">Add sections to see your CV come to life</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
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
            onClose={() => setSettingsModal(false)}
            cvId={id}
            currentName={cvMetadata.name}
            currentDescription={cvMetadata.description}
            onUpdate={updateCVMetadata}
          />
        )}
      </div>
    </>
  );
};

export default Builder;
