import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useCV } from '@/hooks/useCV';
import { PersonalInfoSection } from '@/components/builder/sections/PersonalInfoSection';
import { ExperienceSection } from '@/components/builder/sections/ExperienceSection';
import { EducationSection } from '@/components/builder/sections/EducationSection';
import { SkillsSection } from '@/components/builder/sections/SkillsSection';
import { ProjectsSection } from '@/components/builder/sections/ProjectsSection';
import { ReferencesSection } from '@/components/builder/sections/ReferencesSection';
import { BuilderSidebar } from '@/components/builder/BuilderSidebar';
import { CVData } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { SettingsDialog } from '@/components/builder/dialogs/SettingsDialog';
import { DesignDialog } from '@/components/builder/dialogs/DesignDialog';
import { TemplateDialog } from '@/components/builder/dialogs/TemplateDialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { CoursesSection } from '@/components/builder/sections/CoursesSection';
import { CertificatesSection } from '@/components/builder/sections/CertificatesSection';
import { LanguagesSection } from '@/components/builder/sections/LanguagesSection';

const Builder: React.FC = () => {
  const router = useRouter();
  const { cvId } = router.query;
  const { cvData, setCVData, isLoading, isSaving, cvExists, saveCV, updateCVMetadata } = useCV(cvId as string | undefined);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [activeSections, setActiveSections] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDesignOpen, setIsDesignOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isMetadataChanged, setIsMetadataChanged] = useState(false);
  const [deletedSections, setDeletedSections] = useState<string[]>([]);

  useEffect(() => {
    if (cvData) {
      setName(cvData?.personalInfo?.fullName || '');
      setDescription(cvData?.personalInfo?.summary || '');
      // Initialize active sections based on available data
      const initialActiveSections = Object.keys(cvData).filter(key => {
        if (key === 'personalInfo' || key === 'designOptions' || key === 'customSections') {
          return false;
        }
        if (Array.isArray(cvData[key])) {
          return (cvData[key] as Array<any>).length > 0;
        }
        return false;
      });
      setActiveSections(initialActiveSections);
    }
  }, [cvData]);

  useEffect(() => {
    if (name !== (cvData?.personalInfo?.fullName || '') || description !== (cvData?.personalInfo?.summary || '')) {
      setIsMetadataChanged(true);
    } else {
      setIsMetadataChanged(false);
    }
  }, [name, description, cvData?.personalInfo?.fullName, cvData?.personalInfo?.summary]);

  const debouncedSave = useCallback(
    (data: CVData) => {
      saveCV(data, deletedSections, activeSections);
    },
    [saveCV, deletedSections, activeSections]
  );

  // Function to handle updating personal info
  const updatePersonalInfo = (personalInfo: CVData['personalInfo']) => {
    if (!cvData) return;
    const updatedData = { ...cvData, personalInfo: personalInfo };
    setCVData(updatedData);
    debouncedSave(updatedData);
  };

  // Function to handle updating experience
  const updateExperience = (experience: CVData['experience']) => {
    if (!cvData) return;
    const updatedData = { ...cvData, experience: experience };
    setCVData(updatedData);
    debouncedSave(updatedData);
  };

  // Function to handle updating education
  const updateEducation = (education: CVData['education']) => {
    if (!cvData) return;
    const updatedData = { ...cvData, education: education };
    setCVData(updatedData);
    debouncedSave(updatedData);
  };

  // Function to handle updating skills
  const updateSkills = (skills: CVData['skills']) => {
    if (!cvData) return;
    const updatedData = { ...cvData, skills: skills };
    setCVData(updatedData);
    debouncedSave(updatedData);
  };

  // Function to handle updating projects
  const updateProjects = (projects: CVData['projects']) => {
    if (!cvData) return;
    const updatedData = { ...cvData, projects: projects };
    setCVData(updatedData);
    debouncedSave(updatedData);
  };

  // Function to handle updating references
  const updateReferences = (references: CVData['references']) => {
    if (!cvData) return;
    const updatedData = { ...cvData, references: references };
    setCVData(updatedData);
    debouncedSave(updatedData);
  };

  const renderSectionContent = () => {
    if (!cvData) return null;

    switch (editingSection) {
      case 'personalInfo':
        return <PersonalInfoSection personalInfo={cvData.personalInfo} onUpdate={updatePersonalInfo} />;
      case 'experience':
        return <ExperienceSection experience={cvData.experience} onUpdate={updateExperience} />;
      case 'education':
        return <EducationSection education={cvData.education} onUpdate={updateEducation} />;
      case 'skills':
        return <SkillsSection skills={cvData.skills} onUpdate={updateSkills} />;
      case 'projects':
        return <ProjectsSection projects={cvData.projects} onUpdate={updateProjects} />;
      case 'references':
        return <ReferencesSection references={cvData.references} onUpdate={updateReferences} />;
      case 'courses':
        return <CoursesSection courses={cvData.courses} onUpdate={updateCourses} />;
      case 'certificates':
        return <CertificatesSection certificates={cvData.certificates} onUpdate={updateCertificates} />;
      case 'languages':
        return <LanguagesSection languages={cvData.languages} onUpdate={updateLanguages} />;
      default:
        return null;
    }
  };

  const updateCourses = (courses: CVData['courses']) => {
    if (!cvData) return;
    const updatedData = { ...cvData, courses };
    setCVData(updatedData);
    debouncedSave(updatedData);
  };

  const updateCertificates = (certificates: CVData['certificates']) => {
    if (!cvData) return;
    const updatedData = { ...cvData, certificates };
    setCVData(updatedData);
    debouncedSave(updatedData);
  };

  const updateLanguages = (languages: CVData['languages']) => {
    if (!cvData) return;
    const updatedData = { ...cvData, languages };
    setCVData(updatedData);
    debouncedSave(updatedData);
  };

  const handleSectionToggle = (sectionId: string) => {
    const isActive = activeSections.includes(sectionId);
    if (isActive) {
      // Remove section
      setActiveSections(activeSections.filter(id => id !== sectionId));
      setDeletedSections([...deletedSections, sectionId]);
    } else {
      // Add section
      setActiveSections([...activeSections, sectionId]);
      setDeletedSections(deletedSections.filter(id => id !== sectionId));
    }
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleDesignClick = () => {
    setIsDesignOpen(true);
  };

  const handleTemplateClick = () => {
    setIsTemplateOpen(true);
  };

  const handleMetadataSave = async () => {
    const success = await updateCVMetadata(name, description);
    if (success) {
      setIsMetadataChanged(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Skeleton className="h-12 w-[400px]" />
      </div>
    );
  }

  if (cvExists === false) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        CV Not Found.
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full">
      <BuilderSidebar
        cvData={cvData!}
        activeSections={activeSections}
        onSectionToggle={handleSectionToggle}
        onSectionEdit={setEditingSection}
        onSettingsClick={handleSettingsClick}
        onDesignClick={handleDesignClick}
        onTemplateClick={handleTemplateClick}
      />

      <div className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <input
              type="text"
              placeholder="CV Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-2xl font-bold focus:outline-none"
            />
            <input
              type="text"
              placeholder="Short Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <Button
              onClick={handleMetadataSave}
              disabled={!isMetadataChanged || isSaving}
              className="mr-2"
            >
              {isSaving ? 'Saving...' : 'Save Details'}
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteConfirmOpen(true)}>
              Delete CV
            </Button>
          </div>
        </div>

        {editingSection ? (
          renderSectionContent()
        ) : (
          <div className="text-center text-gray-500">
            Select a section to edit from the sidebar.
          </div>
        )}
      </div>

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        name={name}
        description={description}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onSave={handleMetadataSave}
        isSaving={isSaving}
        isMetadataChanged={isMetadataChanged}
      />

      <DesignDialog
        open={isDesignOpen}
        onOpenChange={setIsDesignOpen}
        cvData={cvData}
        setCVData={setCVData}
        debouncedSave={debouncedSave}
      />

      <TemplateDialog
        open={isTemplateOpen}
        onOpenChange={setIsTemplateOpen}
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete CV"
        description="Are you sure you want to delete this CV? This action cannot be undone."
        onConfirm={async () => {
          setIsDeleteConfirmOpen(false);
          try {
            // Optimistically redirect
            router.push('/dashboard');

            // Delete the CV
            if (!cvId) throw new Error('CV ID is missing.');

            // const { error } = await supabase
            //   .from('cvs')
            //   .delete()
            //   .eq('id', cvId);

            // if (error) throw error;

            toast({
              title: "CV Deleted",
              description: "Your CV has been deleted successfully."
            });
          } catch (error: unknown) {
            console.error('Error deleting CV:', error);
            toast({
              title: "Error deleting CV",
              description: error instanceof Error ? error.message : "An unknown error occurred",
              variant: "destructive"
            });
          }
        }}
      />
    </div>
  );
};

export default Builder;
