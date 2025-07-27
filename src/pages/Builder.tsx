import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from '@/hooks/use-toast';
import { useCV } from '@/hooks/useCV';
import { CVData } from '@/types/cv';
import { supabase } from '@/integrations/supabase/client';

import BuilderSidebar from '@/components/builder/BuilderSidebar';
import DraggableSection from '@/components/builder/DraggableSection';
import DesignOptionsModal from '@/components/modals/DesignOptionsModal';
import CVSettingsModal from '@/components/modals/CVSettingsModal';
import AIAssistDialog from '@/components/modals/AIAssistDialog';
import AICVOptimizer from '@/components/modals/AICVOptimizer';
import AIResumeEnhancer from '@/components/modals/AIResumeEnhancer';
import JobMatcherModal from '@/components/modals/JobMatcherModal';
import TemplateWrapper from '@/components/cv/templates/TemplateWrapper';
import TemplateSelectionModal from '@/components/modals/TemplateSelectionModal';

const Builder = () => {
  const router = useRouter();
  const { cvId } = router.query;
  const [designModalOpen, setDesignModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [aiAssistOpen, setAiAssistOpen] = useState(false);
  const [optimizerOpen, setOptimizerOpen] = useState(false);
  const [enhancerOpen, setEnhancerOpen] = useState(false);
  const [jobMatcherOpen, setJobMatcherOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSections, setActiveSections] = useState<string[]>([]);
  const [deletedSections, setDeletedSections] = useState<string[]>([]);
  const [cvMetadata, setCvMetadata] = useState<any>(null);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);

  const {
    cvData,
    setCVData,
    isLoading,
    isSaving,
    cvExists,
    saveCV,
    updateCVMetadata
  } = useCV(cvId as string);

  const availableSections = [
    { id: 'personalInfo', title: 'Personal Info', icon: 'User', description: 'Your basic contact information.' },
    { id: 'experience', title: 'Experience', icon: 'Briefcase', description: 'Your work history and achievements.' },
    { id: 'education', title: 'Education', icon: 'School', description: 'Your academic background and qualifications.' },
    { id: 'skills', title: 'Skills', icon: 'Star', description: 'Your key skills and areas of expertise.' },
    { id: 'projects', title: 'Projects', icon: 'Code', description: 'Your personal projects and contributions.' },
    { id: 'references', title: 'References', icon: 'Users', description: 'Professional references who can vouch for you.' },
  ];

  useEffect(() => {
    if (!router.isReady) return;

    if (cvId === 'new') {
      setActiveSections(['personalInfo']);
    }
  }, [cvId, router.isReady]);

  useEffect(() => {
    if (cvData) {
      // Initialize active sections based on available data
      const sectionsWithData = Object.keys(cvData).filter(key => {
        if (key === 'designOptions' || key === 'personalInfo') return false;
        if (Array.isArray(cvData[key as keyof CVData])) {
          return (cvData[key as keyof CVData] as Array<any>).length > 0;
        }
        return false;
      });
      setActiveSections(['personalInfo', ...sectionsWithData]);
    }
  }, [cvData]);

  useEffect(() => {
    const fetchCVMetadata = async () => {
      if (!cvId || cvId === 'new') return;

      try {
        const { data, error } = await supabase
          .from('cvs')
          .select('template, name, description')
          .eq('id', cvId)
          .single();

        if (error) throw error;
        setCvMetadata(data);
      } catch (error) {
        console.error('Error fetching CV metadata:', error);
      }
    };

    fetchCVMetadata();
  }, [cvId]);

  const handleUpdateCV = (updatedData: CVData) => {
    setCVData(updatedData);
  };

  const handleSectionToggle = (sectionId: string) => {
    const isActive = activeSections.includes(sectionId);

    if (isActive) {
      // Remove section from activeSections
      setActiveSections(activeSections.filter(id => id !== sectionId));
      setDeletedSections([...deletedSections, sectionId]);
    } else {
      // Add section to activeSections
      setActiveSections([...activeSections, sectionId]);
      setDeletedSections(deletedSections.filter(id => id !== sectionId));
    }
  };

  const handleSave = useCallback(async () => {
    if (cvData) {
      try {
        await saveCV(cvData, deletedSections, activeSections);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save CV. Please try again.",
          variant: "destructive"
        });
      }
    }
  }, [cvData, saveCV, deletedSections, activeSections]);

  const handleAIAssist = () => {
    setAiAssistOpen(true);
  };

  const handleAIOptimizer = () => {
    setOptimizerOpen(true);
  };

  const handleAIEnhancer = () => {
    setEnhancerOpen(true);
  };

  const handleJobMatcher = () => {
    setJobMatcherOpen(true);
  };

  const handleTemplateChange = async (templateId: string, templateName: string) => {
    if (!cvId || cvId === 'new') return;

    try {
      // Update the CV template and name in the database
      const { error } = await supabase
        .from('cvs')
        .update({
          template: templateId,
          name: `My ${templateName} CV`,
          updated_at: new Date().toISOString()
        })
        .eq('id', cvId);

      if (error) throw error;

      // Update local state if needed
      // The template change will be reflected when the component re-renders
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  };

  const handleTemplateNavigation = () => {
    setTemplateModalOpen(true);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (cvExists === false) {
    return <div className="min-h-screen flex items-center justify-center">CV not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b py-2 px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="md:hidden p-2 rounded-full hover:bg-gray-100"
          >
            {sidebarCollapsed ? '☰' : '✖'}
          </button>
          <h1 className="text-xl font-semibold">CV Builder</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:bg-blue-300 transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      <div className="flex">
        <BuilderSidebar
          availableSections={availableSections}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onAIAssist={handleAIAssist}
          onAIOptimizer={handleAIOptimizer}
          onAIEnhancer={handleAIEnhancer}
          onJobMatcher={handleJobMatcher}
          onTemplateNavigation={handleTemplateNavigation}
          onSave={handleSave}
        />

        <main className="flex-1 p-4">
          <DndProvider backend={HTML5Backend}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="order-2 md:order-1">
                {availableSections.map(section => (
                  <DraggableSection
                    key={section.id}
                    sectionId={section.id}
                    title={section.title}
                    description={section.description}
                    isActive={activeSections.includes(section.id)}
                    onSectionToggle={handleSectionToggle}
                  />
                ))}
              </div>

              <div className="order-1 md:order-2">
                <TemplateWrapper
                  cvData={cvData}
                  sections={activeSections}
                  template={cvMetadata?.template}
                />
              </div>
            </div>
          </DndProvider>
        </main>
      </div>

      {/* Modals */}
      <DesignOptionsModal
        open={designModalOpen}
        onClose={() => setDesignModalOpen(false)}
        cvData={cvData}
        onUpdateCV={handleUpdateCV}
        onSave={handleSave}
      />

      <CVSettingsModal
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        cvData={cvData}
        onUpdateCV={handleUpdateCV}
        onSave={handleSave}
        onUpdateMetadata={updateCVMetadata}
      />

      <AIAssistDialog
        open={aiAssistOpen}
        onClose={() => setAiAssistOpen(false)}
        cvData={cvData}
        onUpdateCV={handleUpdateCV}
        onSave={handleSave}
      />

      <AICVOptimizer
        open={optimizerOpen}
        onClose={() => setOptimizerOpen(false)}
        cvData={cvData}
        onUpdateCV={handleUpdateCV}
        onSave={handleSave}
      />

      <AIResumeEnhancer
        open={enhancerOpen}
        onClose={() => setEnhancerOpen(false)}
        cvData={cvData}
        onUpdateCV={handleUpdateCV}
        onSave={handleSave}
      />

      <JobMatcherModal
        open={jobMatcherOpen}
        onClose={() => setJobMatcherOpen(false)}
        cvData={cvData}
        onUpdateCV={handleUpdateCV}
        onSave={handleSave}
      />

      <TemplateSelectionModal
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        currentTemplate={cvMetadata?.template || 'classicTemp'}
        onTemplateChange={handleTemplateChange}
      />
    </div>
  );
};

export default Builder;
