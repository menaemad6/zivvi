import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navbar } from '@/components/layout/Navbar';
import { CVTemplateRenderer } from '@/components/cv/CVTemplateRenderer';
import { ModernSidebar } from '@/components/builder/ModernSidebar';
import { SectionEditModal } from '@/components/builder/SectionEditModal';
import { CVSettingsModal } from '@/components/modals/CVSettingsModal';
import { AIAssistDialog } from '@/components/builder/AIAssistDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CVData, CVSection } from '@/types/cv';
import { 
  Save, 
  Eye, 
  Download, 
  Settings, 
  Sparkles,
  Share2,
  History,
  Palette
} from 'lucide-react';

interface BuilderParams {
  id: string;
}

const Builder = () => {
  const { id } = useParams<BuilderParams>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const cvRef = useRef<HTMLDivElement>(null);

  const [cvData, setCvData] = useState<CVData>({
    id: '',
    user_id: '',
    template: 'default',
    personal: {
      name: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      github: '',
      website: '',
    },
    sections: [],
    settings: {
      font: 'Inter',
      color: 'slate',
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<CVSection | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Fetch CV data
  const { data: fetchedCvData, isLoading, isError } = useQuery({
    queryKey: ['cv', id],
    queryFn: async () => {
      if (!id) throw new Error("CV ID is required");
      const { data, error } = await supabase
        .from('cv_data')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching CV data:", error);
        throw new Error(error.message);
      }
      return data as CVData;
    },
    enabled: !!id,
    retry: false,
  });

  useEffect(() => {
    if (fetchedCvData) {
      setCvData(fetchedCvData);
    }
  }, [fetchedCvData]);

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: "Failed to load CV data.",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [isError, toast, navigate]);

  // Mutations for saving and updating CV data
  const updateCVMutation = useMutation({
    mutationFn: async (updates: Partial<CVData>) => {
      const { data, error } = await supabase
        .from('cv_data')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Error updating CV data:", error);
        throw new Error(error.message);
      }
      return data as CVData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cv', id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to save CV data.",
        variant: "destructive",
      });
    },
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateCVMutation.mutateAsync(cvData);
      toast({
        title: "Success",
        description: "CV saved successfully.",
      });
    } catch (error: any) {
      console.error("Error saving CV:", error);
      toast({
        title: "Error",
        description: "Failed to save CV.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const element = cvRef.current;
      if (!element) throw new Error("CV element not found");

      const opt = {
        margin: 0,
        filename: 'cv.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };

      const { default: html2pdf } = await import('html2pdf.js');
      await html2pdf().from(element).set(opt).save();

      toast({
        title: "Success",
        description: "CV exported successfully.",
      });
    } catch (error: any) {
      console.error("Error exporting CV:", error);
      toast({
        title: "Error",
        description: "Failed to export CV.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, sectionType: string) => {
    e.dataTransfer.setData('sectionType', sectionType);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const sectionType = e.dataTransfer.getData('sectionType');
    if (sectionType) {
      const newSection: CVSection = {
        id: Math.random().toString(36).substring(7),
        type: sectionType,
        title: sectionType.charAt(0).toUpperCase() + sectionType.slice(1),
        items: [],
      };

      setCvData(prev => ({
        ...prev,
        sections: [...prev.sections, newSection],
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSectionEdit = (section: CVSection) => {
    setEditingSection(section);
    setIsEditModalOpen(true);
  };

  const handleSectionUpdate = (updatedSection: CVSection) => {
    setCvData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === updatedSection.id ? updatedSection : section
      ),
    }));
    setIsEditModalOpen(false);
  };

  const handleCVUpdate = (updates: Partial<CVData>) => {
    setCvData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* New Modern Sidebar */}
        <ModernSidebar onDragStart={handleDragStart} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Toolbar */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-gray-900">CV Builder</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Auto-saved
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsHistoryOpen(true)}
                  className="gap-2"
                >
                  <History className="w-4 h-4" />
                  History
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSettingsOpen(true)}
                  className="gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAIDialogOpen(true)}
                  className="gap-2 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100"
                >
                  <Sparkles className="w-4 h-4" />
                  AI Assistant
                </Button>
                
                <div className="w-px h-6 bg-gray-300"></div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/preview/${id}`)}
                  className="gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? 'Exporting...' : 'Export PDF'}
                </Button>
                
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>

          {/* CV Preview Area */}
          <div 
            className="flex-1 overflow-auto bg-gray-100 p-6"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <CVTemplateRenderer
                  ref={cvRef}
                  data={cvData}
                  template={cvData.template}
                  onSectionEdit={handleSectionEdit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SectionEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        section={editingSection}
        onSave={handleSectionUpdate}
      />

      <CVSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        cvData={cvData}
        onUpdate={handleCVUpdate}
      />

      <AIAssistDialog
        isOpen={isAIDialogOpen}
        onClose={() => setIsAIDialogOpen(false)}
        cvData={cvData}
        onUpdate={handleCVUpdate}
      />
    </div>
  );
};

export default Builder;
