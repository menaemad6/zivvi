
// AI SMART ASSISTANT
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, User, Briefcase, GraduationCap, Award, Check, RefreshCw, Settings, Globe, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { CVData } from "@/types/cv";
import { getGeminiResponse } from "@/utils/geminiApi";
import { v4 as uuidv4 } from 'uuid';
import { OnboardingModal } from "@/components/profile/OnboardingModal";

interface AISmartAssistantProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSectionsGenerated: (updatedCVData: CVData, newSections: string[]) => void;
  cvData: CVData;
}

interface GeneratedSection {
  type: string;
  title: string;
  data: any;
  preview: string;
  selected: boolean;
}

export function AISmartAssistant({ open, setOpen, onSectionsGenerated, cvData }: AISmartAssistantProps) {
  const { profile, updateProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [generatedSections, setGeneratedSections] = useState<GeneratedSection[]>([]);
  const [step, setStep] = useState<'analyzing' | 'generating' | 'reviewing'>('analyzing');
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setStep('analyzing');
    }
  }, [open]);

  const handleOnboardingComplete = async (data: any) => {
    try {
      const success = await updateProfile(data);
      if (success) {
        setOnboardingOpen(false);
        toast({
          title: "Profile Updated",
          description: "Your profile data has been updated successfully."
        });
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile data.",
        variant: "destructive"
      });
    }
  };

  const analyzeProfile = () => {
    if (!profile?.profile_data) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your profile first to use AI generation.",
        variant: "destructive"
      });
      return null;
    }

    const profileData = profile.profile_data;
    const missingInfo = [];
    
    if (!profileData.experience || profileData.experience.length === 0) {
      missingInfo.push("work experience");
    }
    if (!profileData.education || profileData.education.length === 0) {
      missingInfo.push("education");
    }
    if (!profileData.skills || profileData.skills.length === 0) {
      missingInfo.push("skills");
    }

    return {
      profileData,
      missingInfo,
      hasEnoughData: missingInfo.length < 3
    };
  };

  const generateSectionPrompt = (sectionType: string, profileData: any, existingData: any) => {
    const prompts = {
      experience: `Based on this profile data, generate professional work experience entries in JSON format:
        Profile: ${JSON.stringify(profileData)}
        Existing CV data: ${JSON.stringify(existingData?.experience || [])}
        
        Generate 2-4 work experiences that enhance the existing data. Format as:
        [{"id": "uuid", "title": "Job Title", "company": "Company Name", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "description": "Detailed description highlighting achievements"}]`,
      
      education: `Based on this profile data, generate education entries in JSON format:
        Profile: ${JSON.stringify(profileData)}
        Existing CV data: ${JSON.stringify(existingData?.education || [])}
        
        Generate 1-3 education entries. Format as:
        [{"id": "uuid", "degree": "Degree Name", "school": "Institution", "startDate": "YYYY-MM", "endDate": "YYYY-MM"}]`,
      
      skills: `Based on this profile data, generate a comprehensive skills list in JSON format:
        Profile: ${JSON.stringify(profileData)}
        Existing CV data: ${JSON.stringify(existingData?.skills || [])}
        
        Generate 8-15 relevant skills. Format as:
        ["Skill 1", "Skill 2", "Skill 3", ...]`,
      
      projects: `Based on this profile data, generate project entries in JSON format:
        Profile: ${JSON.stringify(profileData)}
        Existing CV data: ${JSON.stringify(existingData?.projects || [])}
        
        Generate 2-4 relevant projects. Format as:
        [{"id": "uuid", "name": "Project Name", "description": "Project description", "technologies": "Tech stack", "link": "https://example.com", "startDate": "YYYY-MM", "endDate": "YYYY-MM"}]`,
      
      summary: `Based on this profile data, generate a professional summary:
        Profile: ${JSON.stringify(profileData)}
        Current summary: ${existingData?.personalInfo?.summary || "None"}
        
        Generate a compelling 2-3 sentence professional summary that highlights key strengths and career focus.`,

      languages: `Based on this profile data, generate language proficiency entries in JSON format:
        Profile: ${JSON.stringify(profileData)}
        Existing CV data: ${JSON.stringify(existingData?.languages || [])}
        
        Generate 2-4 language entries. Format as:
        [{"id": "uuid", "name": "Language Name", "proficiency": "Proficiency Level (e.g., Native, Fluent, Intermediate, Basic)"}]`,
      
      courses: `Based on this profile data, generate relevant course entries in JSON format:
        Profile: ${JSON.stringify(profileData)}
        Existing CV data: ${JSON.stringify(existingData?.courses || [])}
        
        Generate 2-3 relevant courses. Format as:
        [{"id": "uuid", "name": "Course Name", "institution": "Institution Name", "date": "YYYY-MM", "description": "Brief description of the course and skills acquired"}]`,
      
      certificates: `Based on this profile data, generate certification entries in JSON format:
        Profile: ${JSON.stringify(profileData)}
        Existing CV data: ${JSON.stringify(existingData?.certificates || [])}
        
        Generate 2-3 relevant certifications. Format as:
        [{"id": "uuid", "name": "Certification Name", "issuer": "Issuing Organization", "date": "YYYY-MM", "description": "Brief description of the certification", "link": "https://example.com"}]`
    };

    return prompts[sectionType as keyof typeof prompts] || '';
  };

  // Enhanced data validation function
  const validateAndSanitizeData = (data: unknown, sectionType: string) => {
    try {
      switch (sectionType) {
        case 'experience':
          if (!Array.isArray(data)) return null;
          return data.map((item: unknown) => {
            const expItem = item as Record<string, unknown>;
            return {
              id: (expItem.id as string) || uuidv4(),
              title: (expItem.title as string) || 'Unknown Position',
              company: (expItem.company as string) || 'Unknown Company',
              startDate: (expItem.startDate as string) || '2020-01',
              endDate: (expItem.endDate as string) || 'Present',
              description: (expItem.description as string) || 'Responsibilities and achievements...'
            };
          }).filter((item: Record<string, unknown>) => item.title && item.company);

        case 'education':
          if (!Array.isArray(data)) return null;
          return data.map((item: unknown) => {
            const eduItem = item as Record<string, unknown>;
            return {
              id: (eduItem.id as string) || uuidv4(),
              degree: (eduItem.degree as string) || 'Unknown Degree',
              school: (eduItem.school as string) || 'Unknown Institution',
              startDate: (eduItem.startDate as string) || '2020-01',
              endDate: (eduItem.endDate as string) || '2024-01'
            };
          }).filter((item: Record<string, unknown>) => item.degree && item.school);

        case 'skills':
          if (!Array.isArray(data)) return null;
          return data
            .filter((skill: unknown) => typeof skill === 'string' && skill.trim().length > 0)
            .map((skill: string) => skill.trim())
            .filter((skill: string, index: number, arr: string[]) => arr.indexOf(skill) === index); // Remove duplicates

        case 'projects':
          if (!Array.isArray(data)) return null;
          return data.map((item: unknown) => {
            const projItem = item as Record<string, unknown>;
            return {
              id: (projItem.id as string) || uuidv4(),
              name: (projItem.name as string) || 'Unknown Project',
              description: (projItem.description as string) || 'Project description...',
              technologies: (projItem.technologies as string) || 'Various technologies',
              link: (projItem.link as string) || '',
              startDate: (projItem.startDate as string) || '2020-01',
              endDate: (projItem.endDate as string) || 'Present'
            };
          }).filter((item: Record<string, unknown>) => item.name);

        case 'languages':
          if (!Array.isArray(data)) return null;
          return data.map((item: unknown) => {
            const langItem = item as Record<string, unknown>;
            return {
              id: (langItem.id as string) || uuidv4(),
              name: (langItem.name as string) || 'Unknown Language',
              proficiency: (langItem.proficiency as string) || 'Intermediate'
            };
          }).filter((item: Record<string, unknown>) => item.name && item.proficiency);

        case 'courses':
          if (!Array.isArray(data)) return null;
          return data.map((item: unknown) => {
            const courseItem = item as Record<string, unknown>;
            return {
              id: (courseItem.id as string) || uuidv4(),
              name: (courseItem.name as string) || 'Unknown Course',
              institution: (courseItem.institution as string) || 'Unknown Institution',
              date: (courseItem.date as string) || '2020-01',
              description: (courseItem.description as string) || 'Course description...'
            };
          }).filter((item: Record<string, unknown>) => item.name && item.institution);

        case 'certificates':
          if (!Array.isArray(data)) return null;
          return data.map((item: unknown) => {
            const certItem = item as Record<string, unknown>;
            return {
              id: (certItem.id as string) || uuidv4(),
              name: (certItem.name as string) || 'Unknown Certificate',
              issuer: (certItem.issuer as string) || 'Unknown Issuer',
              date: (certItem.date as string) || '2020-01',
              description: (certItem.description as string) || 'Certificate description...',
              link: (certItem.link as string) || ''
            };
          }).filter((item: Record<string, unknown>) => item.name && item.issuer);

        case 'summary':
          if (typeof data === 'string') {
            return data.trim();
          }
          return null;

        default:
          return null;
      }
    } catch (error) {
      console.error(`Error validating ${sectionType} data:`, error);
      return null;
    }
  };

  const parseAIResponse = (response: string, sectionType: string) => {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate and sanitize the parsed data
      const validatedData = validateAndSanitizeData(parsed, sectionType);
      
      if (!validatedData) {
        throw new Error(`Invalid data structure for ${sectionType}`);
      }
      
      return validatedData;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return null;
    }
  };

  const generateSections = async () => {
    const analysis = analyzeProfile();
    if (!analysis) return;

    if (!analysis.hasEnoughData) {
      toast({
        title: "Insufficient Profile Data",
        description: `Please add more information to your profile: ${analysis.missingInfo.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setStep('generating');
    
    try {
      const sectionsToGenerate = [
        { type: 'experience', title: 'Work Experience', icon: <Briefcase className="h-4 w-4" /> },
        { type: 'education', title: 'Education', icon: <GraduationCap className="h-4 w-4" /> },
        { type: 'skills', title: 'Skills', icon: <Award className="h-4 w-4" /> },
        { type: 'projects', title: 'Projects', icon: <Award className="h-4 w-4" /> },
        { type: 'summary', title: 'Professional Summary', icon: <User className="h-4 w-4" /> },
        { type: 'languages', title: 'Languages', icon: <Globe className="h-4 w-4" /> },
        { type: 'courses', title: 'Courses', icon: <BookOpen className="h-4 w-4" /> },
        { type: 'certificates', title: 'Certificates', icon: <Award className="h-4 w-4" /> }
      ];

      const results: GeneratedSection[] = [];

      for (const section of sectionsToGenerate) {
        try {
          const prompt = generateSectionPrompt(section.type, analysis.profileData, cvData);
          const aiResponse = await getGeminiResponse(prompt);
          const parsedData = parseAIResponse(aiResponse, section.type);
          
          if (parsedData) {
            let preview = '';
            if (section.type === 'summary') {
              preview = typeof parsedData === 'string' ? parsedData : 'Professional summary generated';
            } else if (Array.isArray(parsedData)) {
              preview = `${parsedData.length} ${section.type} entries generated`;
            } else {
              preview = `${section.title} data generated`;
            }

            results.push({
              type: section.type,
              title: section.title,
              data: parsedData,
              preview,
              selected: true
            });
          }
        } catch (error) {
          console.error(`Error generating ${section.type}:`, error);
        }
      }

      setGeneratedSections(results);
      setStep('reviewing');
      
      if (results.length === 0) {
        toast({
          title: "Generation Failed",
          description: "Unable to generate sections. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sections Generated!",
          description: `${results.length} sections generated successfully.`
        });
      }
    } catch (error) {
      console.error('Error in AI generation:', error);
      toast({
        title: "Generation Error",
        description: "An error occurred during generation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSectionSelection = (index: number) => {
    setGeneratedSections(prev => 
      prev.map((section, i) => 
        i === index ? { ...section, selected: !section.selected } : section
      )
    );
  };

  const applySections = () => {
    const selectedSections = generatedSections.filter(s => s.selected);
    if (selectedSections.length === 0) {
      toast({
        title: "No Sections Selected",
        description: "Please select at least one section to apply.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create a deep copy of the current CV data
      const updatedCVData: CVData = {
        personalInfo: { ...cvData.personalInfo },
        experience: [...(cvData.experience || [])],
        education: [...(cvData.education || [])],
        skills: [...(cvData.skills || [])],
        projects: [...(cvData.projects || [])],
        references: [...(cvData.references || [])],
        courses: [...(cvData.courses || [])],
        certificates: [...(cvData.certificates || [])],
        languages: [...(cvData.languages || [])],
        designOptions: {
          primaryColor: cvData.designOptions?.primaryColor || '',
          secondaryColor: cvData.designOptions?.secondaryColor || '',
          font: cvData.designOptions?.font || 'inter'
        }
      };

      const newSectionIds: string[] = [];

      selectedSections.forEach(section => {
        try {
          switch (section.type) {
            case 'experience':
              if (Array.isArray(section.data)) {
                updatedCVData.experience = [...updatedCVData.experience, ...section.data];
                if (!newSectionIds.includes('experience')) newSectionIds.push('experience');
              }
              break;

            case 'education':
              if (Array.isArray(section.data)) {
                updatedCVData.education = [...updatedCVData.education, ...section.data];
                if (!newSectionIds.includes('education')) newSectionIds.push('education');
              }
              break;

            case 'skills':
              if (Array.isArray(section.data)) {
                const existingSkills = updatedCVData.skills || [];
                const newSkills = section.data.filter((skill: string) => 
                  typeof skill === 'string' && !existingSkills.includes(skill)
                );
                updatedCVData.skills = [...existingSkills, ...newSkills];
                if (!newSectionIds.includes('skills')) newSectionIds.push('skills');
              }
              break;

            case 'projects':
              if (Array.isArray(section.data)) {
                updatedCVData.projects = [...updatedCVData.projects, ...section.data];
                if (!newSectionIds.includes('projects')) newSectionIds.push('projects');
              }
              break;

            case 'languages':
              if (Array.isArray(section.data)) {
                updatedCVData.languages = [...updatedCVData.languages, ...section.data];
                if (!newSectionIds.includes('languages')) newSectionIds.push('languages');
              }
              break;

            case 'courses':
              if (Array.isArray(section.data)) {
                updatedCVData.courses = [...updatedCVData.courses, ...section.data];
                if (!newSectionIds.includes('courses')) newSectionIds.push('courses');
              }
              break;

            case 'certificates':
              if (Array.isArray(section.data)) {
                updatedCVData.certificates = [...updatedCVData.certificates, ...section.data];
                if (!newSectionIds.includes('certificates')) newSectionIds.push('certificates');
              }
              break;

            case 'summary':
              if (typeof section.data === 'string') {
                updatedCVData.personalInfo = {
                  ...updatedCVData.personalInfo,
                  summary: section.data
                };
              }
              break;

            default:
              console.warn(`Unknown section type: ${section.type}`);
          }
        } catch (error) {
          console.error(`Error applying section ${section.type}:`, error);
        }
      });

      // Validate the final CV data structure
      const finalCVData: CVData = {
        personalInfo: updatedCVData.personalInfo || {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          summary: '',
          title: '',
          personal_website: '',
          linkedin: '',
          github: ''
        },
        experience: Array.isArray(updatedCVData.experience) ? updatedCVData.experience : [],
        education: Array.isArray(updatedCVData.education) ? updatedCVData.education : [],
        skills: Array.isArray(updatedCVData.skills) ? updatedCVData.skills : [],
        projects: Array.isArray(updatedCVData.projects) ? updatedCVData.projects : [],
        references: Array.isArray(updatedCVData.references) ? updatedCVData.references : [],
        courses: Array.isArray(updatedCVData.courses) ? updatedCVData.courses : [],
        certificates: Array.isArray(updatedCVData.certificates) ? updatedCVData.certificates : [],
        languages: Array.isArray(updatedCVData.languages) ? updatedCVData.languages : [],
        designOptions: {
          primaryColor: updatedCVData.designOptions?.primaryColor || '',
          secondaryColor: updatedCVData.designOptions?.secondaryColor || '',
          font: updatedCVData.designOptions?.font || 'inter'
        }
      };

      onSectionsGenerated(finalCVData, newSectionIds);
      setOpen(false);
      setStep('analyzing');
      setGeneratedSections([]);
      
      toast({
        title: "Sections Applied!",
        description: `${selectedSections.length} sections have been added to your CV.`
      });
    } catch (error) {
      console.error('Error applying sections:', error);
      toast({
        title: "Application Failed",
        description: "An error occurred while applying the sections. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetGeneration = () => {
    setStep('analyzing');
    setGeneratedSections([]);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              AI Smart CV Generator
            </DialogTitle>
            <DialogDescription>
              Generate professional CV sections automatically using your profile data
            </DialogDescription>
          </DialogHeader>

          {step === 'analyzing' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile?.profile_data ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        AI will analyze your profile and generate relevant CV sections
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {profile.profile_data.experience && (
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            Experience Available
                          </Badge>
                        )}
                        {profile.profile_data.education && (
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            Education Available
                          </Badge>
                        )}
                        {profile.profile_data.skills && (
                          <Badge variant="outline" className="text-purple-600 border-purple-200">
                            Skills Available
                          </Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 mb-3">
                        No profile data found. Please complete your profile first.
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button variant="outline" onClick={() => window.open('/profile', '_blank')}>
                          Go to Profile
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setOnboardingOpen(true)}
                          className="border-purple-200 hover:border-purple-400 hover:bg-purple-50"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Update Profile Data
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {step === 'generating' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Generating CV Sections</h3>
              <p className="text-gray-600">AI is analyzing your profile and creating professional content...</p>
            </div>
          )}

          {step === 'reviewing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Generated Sections</h3>
                <Button variant="outline" size="sm" onClick={resetGeneration}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
              
              <div className="space-y-3 p-3 max-h-96 overflow-y-auto">
                {generatedSections.map((section, index) => (
                  <Card 
                    key={section.type} 
                    className={`cursor-pointer transition-all ${
                      section.selected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => toggleSectionSelection(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            section.selected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {section.selected ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                          </div>
                          <div>
                            <h4 className="font-medium">{section.title}</h4>
                            <p className="text-sm text-gray-600">{section.preview}</p>
                          </div>
                        </div>
                        <Badge variant={section.selected ? "default" : "outline"}>
                          {section.selected ? 'Selected' : 'Click to select'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            
            {step === 'analyzing' && (
              <Button 
                onClick={generateSections} 
                disabled={!profile?.profile_data || loading}
                className="btn-generate-sections bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Sections
              </Button>
            )}
            
            {step === 'reviewing' && (
              <Button 
                onClick={applySections}
                className="btn-apply-sections bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Apply Selected Sections
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onComplete={handleOnboardingComplete}
      />
    </>
  );
}
