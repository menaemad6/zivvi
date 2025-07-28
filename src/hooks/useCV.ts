
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CVData } from '@/types/cv';
import { toast } from '@/hooks/use-toast';

// Starter data for demonstration - only personalInfo for new CVs
const getStarterData = (): CVData => ({
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
  references: [],
  customSections: []
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
      // Set starter data for new CVs - only personalInfo
      const newCVData = {
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
        references: [],
        courses: [],
        certificates: [],
        languages: []
      };
      setCVData(newCVData);
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
          designOptions: parsedData.designOptions || starterData.designOptions,
          experience: Array.isArray(parsedData.experience) ? parsedData.experience : [],
          education: Array.isArray(parsedData.education) ? parsedData.education : [],
          skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
          projects: Array.isArray(parsedData.projects) ? parsedData.projects : [],
          references: Array.isArray(parsedData.references) ? parsedData.references : [],
          courses: Array.isArray(parsedData.courses) ? parsedData.courses : [],
          certificates: Array.isArray(parsedData.certificates) ? parsedData.certificates : [],
          languages: Array.isArray(parsedData.languages) ? parsedData.languages : [],
          customSections: Array.isArray(parsedData.customSections) ? parsedData.customSections : []
        };
        setCVData(cvData);
      } else {
        // Create default structure with starter data
        setCVData(getStarterData());
      }
    } catch (error: unknown) {
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

  const saveCV = async (data: CVData, deletedSections?: string[], activeSections?: string[]) => {
    if (!cvId || cvId === 'new') return;

    try {
      setIsSaving(true);
      console.log('Saving CV data:', data);
      
      // Only save sections that actually have content or are in activeSections
      const sectionsToSave = activeSections || [];
      
      // Prepare minimal content - only save what's needed
      const contentToSave: {
        personalInfo: CVData['personalInfo'];
        designOptions: CVData['designOptions'];
        experience?: CVData['experience'];
        education?: CVData['education'];
        skills?: CVData['skills'];
        projects?: CVData['projects'];
        references?: CVData['references'];
        courses?: CVData['courses'];
        certificates?: CVData['certificates'];
        languages?: CVData['languages'];
        _deletedSections?: string[];
        _sections?: string[];
      } = {
        personalInfo: data.personalInfo,
        designOptions: data.designOptions
      };

      // Only add sections if they're active and have content
      if (sectionsToSave.includes('experience') && data.experience.length > 0) {
        contentToSave.experience = data.experience;
      }
      if (sectionsToSave.includes('education') && data.education.length > 0) {
        contentToSave.education = data.education;
      }
      if (sectionsToSave.includes('skills') && data.skills.length > 0) {
        contentToSave.skills = data.skills;
      }
      if (sectionsToSave.includes('projects') && data.projects.length > 0) {
        contentToSave.projects = data.projects;
      }
      if (sectionsToSave.includes('courses') && data.courses.length > 0) {
        contentToSave.courses = data.courses;
      }
      if (sectionsToSave.includes('certificates') && data.certificates.length > 0) {
        contentToSave.certificates = data.certificates;
      }
      if (sectionsToSave.includes('languages') && data.languages.length > 0) {
        contentToSave.languages = data.languages;
      }
      if (sectionsToSave.includes('references') && data.references.length > 0) {
        contentToSave.references = data.references;
      }

      // Add metadata
      contentToSave._deletedSections = deletedSections || [];
      contentToSave._sections = sectionsToSave;
      
      const { error } = await supabase
        .from('cvs')
        .update({
          content: contentToSave,
          updated_at: new Date().toISOString()
        })
        .eq('id', cvId);

      if (error) throw error;

      setCVData(data);
      toast({
        title: "CV Saved!",
        description: "Your changes have been saved successfully."
      });
    } catch (error: unknown) {
      console.error('Error saving CV:', error);
      toast({
        title: "Error saving CV",
        description: error instanceof Error ? error.message : "An unknown error occurred",
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
    } catch (error: unknown) {
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
