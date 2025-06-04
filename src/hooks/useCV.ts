
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CVData } from '@/types/cv';
import { toast } from '@/hooks/use-toast';

// Starter data for demonstration - now with empty projects
const getStarterData = (): CVData => ({
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: ''
  },
  experience: [],
  education: [],
  skills: [],
  projects: [], // Empty by default
  references: []
});

export const useCV = (cvId: string | undefined) => {
  const [cvData, setCVData] = useState<CVData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cvExists, setCVExists] = useState<boolean | null>(null);

  useEffect(() => {
    if (cvId && cvId !== 'new') {
      fetchCV();
    } else if (cvId === 'new') {
      // Set starter data for new CVs
      setCVData(getStarterData());
      setCVExists(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [cvId]);

  const fetchCV = async () => {
    try {
      setIsLoading(true);
      
      // First check if CV exists and belongs to current user
      const { data: cvCheck, error: checkError } = await supabase
        .from('cvs')
        .select('id, user_id')
        .eq('id', cvId)
        .single();

      if (checkError || !cvCheck) {
        setCVExists(false);
        setIsLoading(false);
        return;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || cvCheck.user_id !== user.id) {
        setCVExists(false);
        setIsLoading(false);
        return;
      }

      setCVExists(true);

      // Fetch full CV data
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('id', cvId)
        .single();

      if (error) throw error;

      // Safely parse and validate the content as CVData
      const content = data.content as unknown;
      if (content && typeof content === 'object' && content !== null) {
        const parsedData = content as CVData;
        // Ensure the data has the required structure with starter data as fallback
        const starterData = getStarterData();
        const cvData: CVData = {
          personalInfo: parsedData.personalInfo || starterData.personalInfo,
          experience: Array.isArray(parsedData.experience) ? parsedData.experience : [],
          education: Array.isArray(parsedData.education) ? parsedData.education : [],
          skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
          projects: Array.isArray(parsedData.projects) ? parsedData.projects : [],
          references: Array.isArray(parsedData.references) ? parsedData.references : []
        };
        setCVData(cvData);
      } else {
        // Create default structure with starter data
        setCVData(getStarterData());
      }
    } catch (error: any) {
      console.error('Error loading CV:', error);
      setCVExists(false);
      toast({
        title: "Error loading CV",
        description: "CV not found or access denied.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveCV = async (data: CVData, deletedSections?: string[]) => {
    if (!cvId || cvId === 'new') return;

    try {
      setIsSaving(true);
      console.log('Saving CV data:', data);
      
      // Prepare the content with deleted sections info
      const contentToSave = {
        ...data,
        _deletedSections: deletedSections || []
      };
      
      const { error } = await supabase
        .from('cvs')
        .update({
          content: contentToSave as any, // Cast to any for Json compatibility
          updated_at: new Date().toISOString()
        })
        .eq('id', cvId);

      if (error) throw error;

      setCVData(data);
      toast({
        title: "CV Saved!",
        description: "Your changes have been saved successfully."
      });
    } catch (error: any) {
      console.error('Error saving CV:', error);
      toast({
        title: "Error saving CV",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateCVMetadata = async (name: string, description: string) => {
    if (!cvId || cvId === 'new') return false;

    try {
      const { error } = await supabase
        .from('cvs')
        .update({
          name: name,
          description: description,
          updated_at: new Date().toISOString()
        })
        .eq('id', cvId);

      if (error) throw error;

      toast({
        title: "CV Updated",
        description: "CV name and description updated successfully."
      });
      return true;
    } catch (error: any) {
      console.error('Error updating CV metadata:', error);
      toast({
        title: "Error",
        description: "Failed to update CV details.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    cvData,
    setCVData,
    isLoading,
    isSaving,
    cvExists,
    saveCV,
    updateCVMetadata
  };
};
