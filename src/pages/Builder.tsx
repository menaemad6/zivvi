import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Loader2, Sparkles, Target, Search } from "lucide-react";
import { useCV } from '@/hooks/useCV';
import { CVData } from '@/types/cv';
import { AICVOptimizer } from '@/components/builder/AICVOptimizer';
import { AIResumeEnhancer } from '@/components/builder/AIResumeEnhancer';
import { AIJobMatchAnalyzer } from '@/components/builder/AIJobMatchAnalyzer';

export default function Builder() {
  const [cvId, setCvId] = useState<string | undefined>('new');
  const { cvData, setCVData, isLoading, isSaving, cvExists, saveCV, updateCVMetadata } = useCV(cvId);
  const [activeSections, setActiveSections] = useState<string[]>(['personalInfo']);
  const [deletedSections, setDeletedSections] = useState<string[]>([]);
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [showResumeEnhancer, setShowResumeEnhancer] = useState(false);
  const [showJobMatchAnalyzer, setShowJobMatchAnalyzer] = useState(false);

  useEffect(() => {
    // Load active sections from local storage or default to ['personalInfo']
    const storedActiveSections = localStorage.getItem('activeSections');
    if (storedActiveSections) {
      setActiveSections(JSON.parse(storedActiveSections));
    }
  }, []);

  useEffect(() => {
    // Save active sections to local storage whenever they change
    localStorage.setItem('activeSections', JSON.stringify(activeSections));
  }, [activeSections]);

  const toggleSection = (section: string) => {
    const isActive = activeSections.includes(section);
    let updatedSections = [...activeSections];

    if (isActive) {
      updatedSections = updatedSections.filter(s => s !== section);
      setDeletedSections(prev => [...prev, section]);
    } else {
      updatedSections.push(section);
      setDeletedSections(prev => prev.filter(s => s !== section));
    }

    setActiveSections(updatedSections);
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCVData(prev => ({
      ...prev,
      personalInfo: {
        ...prev?.personalInfo,
        [name]: value
      }
    }));
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    setCVData(prev => {
      const updatedExperience = [...prev.experience];
      updatedExperience[index] = {
        ...updatedExperience[index],
        [field]: value
      };
      return { ...prev, experience: updatedExperience };
    });
  };

  const addExperience = () => {
    setCVData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', location: '', startDate: '', endDate: '', description: '' }]
    }));
  };

  const removeExperience = (index: number) => {
    setCVData(prev => {
      const updatedExperience = [...prev.experience];
      updatedExperience.splice(index, 1);
      return { ...prev, experience: updatedExperience };
    });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    setCVData(prev => {
      const updatedEducation = [...prev.education];
      updatedEducation[index] = {
        ...updatedEducation[index],
        [field]: value
      };
      return { ...prev, education: updatedEducation };
    });
  };

  const addEducation = () => {
    setCVData(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', location: '', startDate: '', endDate: '', description: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    setCVData(prev => {
      const updatedEducation = [...prev.education];
      updatedEducation.splice(index, 1);
      return { ...prev, education: updatedEducation };
    });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(s => s.trim());
    setCVData(prev => ({ ...prev, skills: skills }));
  };

  const handleProjectsChange = (index: number, field: string, value: string) => {
    setCVData(prev => {
      const updatedProjects = [...prev.projects];
      updatedProjects[index] = {
        ...updatedProjects[index],
        [field]: value
      };
      return { ...prev, projects: updatedProjects };
    });
  };

  const addProject = () => {
    setCVData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', link: '' }]
    }));
  };

  const removeProject = (index: number) => {
    setCVData(prev => {
      const updatedProjects = [...prev.projects];
      updatedProjects.splice(index, 1);
      return { ...prev, projects: updatedProjects };
    });
  };

  const handleReferencesChange = (index: number, field: string, value: string) => {
    setCVData(prev => {
      const updatedReferences = [...prev.references];
      updatedReferences[index] = {
        ...updatedReferences[index],
        [field]: value
      };
      return { ...prev, references: updatedReferences };
    });
  };

  const addReference = () => {
    setCVData(prev => ({
      ...prev,
      references: [...prev.references, { name: '', position: '', company: '', email: '', phone: '' }]
    }));
  };

  const removeReference = (index: number) => {
    setCVData(prev => {
      const updatedReferences = [...prev.references];
      updatedReferences.splice(index, 1);
      return { ...prev, references: updatedReferences };
    });
  };

  const handleCVUpdate = (updatedData: CVData) => {
    setCVData(updatedData);
    saveCV(updatedData, deletedSections, activeSections);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">shadcn</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">Download</Button>
            <Button size="sm">Save</Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">CV Builder</h1>
            <p className="text-muted-foreground">Create and customize your professional CV</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowJobMatchAnalyzer(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
            >
              <Search className="h-4 w-4 mr-2" />
              Job Match Analyzer
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowResumeEnhancer(true)}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Enhancer
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowOptimizer(true)}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700"
            >
              <Target className="h-4 w-4 mr-2" />
              AI Optimizer
            </Button>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline">Sections</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Toggle Sections</DrawerTitle>
                  <DrawerDescription>
                    Enable or disable sections to customize your CV layout.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="personalInfo">Personal Information</Label>
                      <Switch id="personalInfo" checked={activeSections.includes('personalInfo')} onCheckedChange={() => toggleSection('personalInfo')} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="experience">Experience</Label>
                      <Switch id="experience" checked={activeSections.includes('experience')} onCheckedChange={() => toggleSection('experience')} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="education">Education</Label>
                      <Switch id="education" checked={activeSections.includes('education')} onCheckedChange={() => toggleSection('education')} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="skills">Skills</Label>
                      <Switch id="skills" checked={activeSections.includes('skills')} onCheckedChange={() => toggleSection('skills')} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="projects">Projects</Label>
                      <Switch id="projects" checked={activeSections.includes('projects')} onCheckedChange={() => toggleSection('projects')} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="references">References</Label>
                      <Switch id="references" checked={activeSections.includes('references')} onCheckedChange={() => toggleSection('references')} />
                    </div>
                  </div>
                </div>
                <DrawerFooter>
                  <DrawerClose>Close</DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="h-6 w-6 text-muted-foreground animate-spin mx-auto mb-2" />
            Loading CV data...
          </div>
        ) : cvExists === false ? (
          <div className="text-center py-8">
            CV not found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            {activeSections.includes('personalInfo') && (
              <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input type="text" id="fullName" name="fullName" value={cvData?.personalInfo?.fullName || ''} onChange={handlePersonalInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input type="email" id="email" name="email" value={cvData?.personalInfo?.email || ''} onChange={handlePersonalInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input type="tel" id="phone" name="phone" value={cvData?.personalInfo?.phone || ''} onChange={handlePersonalInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input type="text" id="location" name="location" value={cvData?.personalInfo?.location || ''} onChange={handlePersonalInfoChange} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea id="summary" name="summary" value={cvData?.personalInfo?.summary || ''} onChange={handlePersonalInfoChange} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Experience */}
            {activeSections.includes('experience') && (
              <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cvData?.experience?.map((exp, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`title-${index}`}>Title</Label>
                            <Input type="text" id={`title-${index}`} value={exp.title} onChange={(e) => handleExperienceChange(index, 'title', e.target.value)} />
                          </div>
                          <div>
                            <Label htmlFor={`company-${index}`}>Company</Label>
                            <Input type="text" id={`company-${index}`} value={exp.company} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} />
                          </div>
                          <div>
                            <Label htmlFor={`location-${index}`}>Location</Label>
                            <Input type="text" id={`location-${index}`} value={exp.location} onChange={(e) => handleExperienceChange(index, 'location', e.target.value)} />
                          </div>
                          <div className="flex gap-2">
                            <div>
                              <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                              <Input type="date" id={`startDate-${index}`} value={exp.startDate} onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)} />
                            </div>
                            <div>
                              <Label htmlFor={`endDate-${index}`}>End Date</Label>
                              <Input type="date" id={`endDate-${index}`} value={exp.endDate} onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)} />
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`description-${index}`}>Description</Label>
                          <Textarea id={`description-${index}`} value={exp.description} onChange={(e) => handleExperienceChange(index, 'description', e.target.value)} />
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => removeExperience(index)}>Remove</Button>
                      </div>
                    ))}
                    <Button onClick={addExperience}>Add Experience</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {activeSections.includes('education') && (
              <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cvData?.education?.map((edu, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`institution-${index}`}>Institution</Label>
                            <Input type="text" id={`institution-${index}`} value={edu.institution} onChange={(e) => handleEducationChange(index, 'institution', e.target.value)} />
                          </div>
                          <div>
                            <Label htmlFor={`degree-${index}`}>Degree</Label>
                            <Input type="text" id={`degree-${index}`} value={edu.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} />
                          </div>
                          <div>
                            <Label htmlFor={`location-${index}`}>Location</Label>
                            <Input type="text" id={`location-${index}`} value={edu.location} onChange={(e) => handleEducationChange(index, 'location', e.target.value)} />
                          </div>
                          <div className="flex gap-2">
                            <div>
                              <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                              <Input type="date" id={`startDate-${index}`} value={edu.startDate} onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)} />
                            </div>
                            <div>
                              <Label htmlFor={`endDate-${index}`}>End Date</Label>
                              <Input type="date" id={`endDate-${index}`} value={edu.endDate} onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)} />
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`description-${index}`}>Description</Label>
                          <Textarea id={`description-${index}`} value={edu.description} onChange={(e) => handleEducationChange(index, 'description', e.target.value)} />
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => removeEducation(index)}>Remove</Button>
                      </div>
                    ))}
                    <Button onClick={addEducation}>Add Education</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {activeSections.includes('skills') && (
              <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input type="text" id="skills" value={cvData?.skills?.join(', ') || ''} onChange={handleSkillsChange} />
                </CardContent>
              </Card>
            )}

            {/* Projects */}
            {activeSections.includes('projects') && (
              <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cvData?.projects?.map((project, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`name-${index}`}>Name</Label>
                            <Input type="text" id={`name-${index}`} value={project.name} onChange={(e) => handleProjectsChange(index, 'name', e.target.value)} />
                          </div>
                          <div>
                            <Label htmlFor={`link-${index}`}>Link</Label>
                            <Input type="url" id={`link-${index}`} value={project.link} onChange={(e) => handleProjectsChange(index, 'link', e.target.value)} />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`description-${index}`}>Description</Label>
                          <Textarea id={`description-${index}`} value={project.description} onChange={(e) => handleProjectsChange(index, 'description', e.target.value)} />
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => removeProject(index)}>Remove</Button>
                      </div>
                    ))}
                    <Button onClick={addProject}>Add Project</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* References */}
            {activeSections.includes('references') && (
              <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>References</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cvData?.references?.map((reference, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`name-${index}`}>Name</Label>
                            <Input type="text" id={`name-${index}`} value={reference.name} onChange={(e) => handleReferencesChange(index, 'name', e.target.value)} />
                          </div>
                          <div>
                            <Label htmlFor={`position-${index}`}>Position</Label>
                            <Input type="text" id={`position-${index}`} value={reference.position} onChange={(e) => handleReferencesChange(index, 'position', e.target.value)} />
                          </div>
                          <div>
                            <Label htmlFor={`company-${index}`}>Company</Label>
                            <Input type="text" id={`company-${index}`} value={reference.company} onChange={(e) => handleReferencesChange(index, 'company', e.target.value)} />
                          </div>
                          <div>
                            <Label htmlFor={`email-${index}`}>Email</Label>
                            <Input type="email" id={`email-${index}`} value={reference.email} onChange={(e) => handleReferencesChange(index, 'email', e.target.value)} />
                          </div>
                          <div>
                            <Label htmlFor={`phone-${index}`}>Phone</Label>
                            <Input type="tel" id={`phone-${index}`} value={reference.phone} onChange={(e) => handleReferencesChange(index, 'phone', e.target.value)} />
                          </div>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => removeReference(index)}>Remove</Button>
                      </div>
                    ))}
                    <Button onClick={addReference}>Add Reference</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      <AIJobMatchAnalyzer
        open={showJobMatchAnalyzer}
        setOpen={setShowJobMatchAnalyzer}
        cvData={cvData}
        onOptimize={handleCVUpdate}
      />

      <AIResumeEnhancer
        open={showResumeEnhancer}
        setOpen={setShowResumeEnhancer}
        cvData={cvData}
        onEnhance={handleCVUpdate}
      />

      <AICVOptimizer
        open={showOptimizer}
        setOpen={setShowOptimizer}
        cvData={cvData}
        onOptimize={handleCVUpdate}
      />
    </div>
  );
}
