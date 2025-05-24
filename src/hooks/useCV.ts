
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CVData } from '@/types/cv';
import { toast } from '@/hooks/use-toast';

// Starter data for demonstration
const getStarterData = (): CVData => ({
  personalInfo: {
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    summary: 'Experienced software developer with 5+ years in full-stack development, passionate about creating innovative solutions and leading technical teams.'
  },
  experience: [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      startDate: '01/2022',
      endDate: 'Present',
      description: 'Led development of microservices architecture, mentored junior developers, and improved system performance by 40%.'
    },
    {
      id: '2',
      title: 'Software Developer',
      company: 'StartupXYZ',
      startDate: '06/2020',
      endDate: '12/2021',
      description: 'Developed full-stack web applications using React and Node.js, collaborated with cross-functional teams.'
    }
  ],
  education: [
    {
      id: '1',
      degree: 'Bachelor of Computer Science',
      school: 'University of Technology',
      startDate: '09/2016',
      endDate: '05/2020'
    }
  ],
  skills: [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'AWS',
    'Docker',
    'MongoDB',
    'PostgreSQL',
    'Git'
  ],
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Built a full-stack e-commerce platform with payment integration and real-time inventory management.',
      technologies: 'React, Node.js, MongoDB, Stripe',
      link: 'https://github.com/johndoe/ecommerce',
      startDate: '03/2023',
      endDate: '08/2023'
    },
    {
      id: '2',
      name: 'Task Management App',
      description: 'Developed a collaborative task management application with real-time updates and team collaboration features.',
      technologies: 'React, Firebase, Material-UI',
      link: 'https://github.com/johndoe/taskapp',
      startDate: '10/2022',
      endDate: '02/2023'
    }
  ],
  references: [
    {
      id: '1',
      name: 'Sarah Johnson',
      position: 'Senior Engineering Manager',
      company: 'Tech Corp',
      email: 'sarah.johnson@techcorp.com',
      phone: '+1 (555) 987-6543'
    },
    {
      id: '2',
      name: 'Mike Chen',
      position: 'Lead Developer',
      company: 'StartupXYZ',
      email: 'mike.chen@startupxyz.com',
      phone: '+1 (555) 456-7890'
    }
  ]
});

export const useCV = (cvId: string | undefined) => {
  const [cvData, setCVData] = useState<CVData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (cvId && cvId !== 'new') {
      fetchCV();
    } else {
      // Set starter data for new CVs
      setCVData(getStarterData());
      setIsLoading(false);
    }
  }, [cvId]);

  const fetchCV = async () => {
    try {
      setIsLoading(true);
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
          experience: Array.isArray(parsedData.experience) ? parsedData.experience : starterData.experience,
          education: Array.isArray(parsedData.education) ? parsedData.education : starterData.education,
          skills: Array.isArray(parsedData.skills) ? parsedData.skills : starterData.skills,
          projects: Array.isArray(parsedData.projects) ? parsedData.projects : starterData.projects,
          references: Array.isArray(parsedData.references) ? parsedData.references : starterData.references
        };
        setCVData(cvData);
      } else {
        // Create default structure with starter data
        setCVData(getStarterData());
      }
    } catch (error: any) {
      console.error('Error loading CV:', error);
      // Set starter data on error
      setCVData(getStarterData());
      toast({
        title: "Error loading CV",
        description: "Using starter data instead. " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveCV = async (data: CVData) => {
    if (!cvId || cvId === 'new') return;

    try {
      setIsSaving(true);
      console.log('Saving CV data:', data);
      const { error } = await supabase
        .from('cvs')
        .update({
          content: data as any, // Cast to any for Json compatibility
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

  return {
    cvData,
    setCVData,
    isLoading,
    isSaving,
    saveCV
  };
};
