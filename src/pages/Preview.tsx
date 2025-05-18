
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FilePdf, LayoutTemplate, Edit, Share, Maximize2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

// Define types for CV data
type AboutContent = {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
};

type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
};

type EducationItem = {
  id: string;
  institution: string;
  degree: string;
  period: string;
  description: string;
};

type SkillItem = string;

type ProjectItem = {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link?: string;
};

type CertificationItem = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description?: string;
};

// Define CV section types
type CVSectionData = 
  | { id: string; title: string; type: 'about'; content: AboutContent }
  | { id: string; title: string; type: 'experience'; content: ExperienceItem[] }
  | { id: string; title: string; type: 'education'; content: EducationItem[] }
  | { id: string; title: string; type: 'skills'; content: SkillItem[] }
  | { id: string; title: string; type: 'projects'; content: ProjectItem[] }
  | { id: string; title: string; type: 'certifications'; content: CertificationItem[] };

// Type for CV data stored in localStorage
type CVData = {
  sections: CVSectionData[];
  template: string;
};

const Preview = () => {
  const navigate = useNavigate();
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  useEffect(() => {
    // Load CV data from localStorage
    const savedData = localStorage.getItem('cvData');
    if (savedData) {
      try {
        setCvData(JSON.parse(savedData));
      } catch (error) {
        toast({
          title: "Error Loading CV",
          description: "Could not load your CV data.",
          variant: "destructive"
        });
        navigate('/builder/new');
      }
    } else {
      // If no data, redirect back to builder
      toast({
        title: "No CV Data",
        description: "Please create your CV first.",
        variant: "destructive"
      });
      navigate('/builder/new');
    }
  }, [navigate]);
  
  // Template specific classes
  const templateStyles = {
    classic: "font-serif",
    modern: "font-sans",
    minimal: "font-sans tracking-wide",
    creative: "font-sans text-primary",
    executive: "font-serif tracking-tight",
    technical: "font-mono",
  };
  
  const templateColors = {
    classic: "border-gray-300",
    modern: "border-blue-500",
    minimal: "border-gray-200",
    creative: "border-purple-500",
    executive: "border-slate-700",
    technical: "border-emerald-500",
  };
  
  // Handle PDF download
  const handleDownload = () => {
    // In a real implementation, this would generate a PDF
    // For now, we'll show a toast notification
    toast({
      title: "CV Downloaded",
      description: "Your CV has been downloaded as a PDF.",
    });
  };
  
  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  
  const handleEdit = () => {
    navigate('/builder/new');
  };
  
  // Type guards to check section types
  const isAboutSection = (section: CVSectionData): section is { id: string; title: string; type: 'about'; content: AboutContent } => {
    return section.type === 'about';
  };
  
  const isExperienceSection = (section: CVSectionData): section is { id: string; title: string; type: 'experience'; content: ExperienceItem[] } => {
    return section.type === 'experience';
  };
  
  const isEducationSection = (section: CVSectionData): section is { id: string; title: string; type: 'education'; content: EducationItem[] } => {
    return section.type === 'education';
  };
  
  const isSkillsSection = (section: CVSectionData): section is { id: string; title: string; type: 'skills'; content: string[] } => {
    return section.type === 'skills';
  };
  
  const isProjectsSection = (section: CVSectionData): section is { id: string; title: string; type: 'projects'; content: ProjectItem[] } => {
    return section.type === 'projects';
  };
  
  const isCertificationsSection = (section: CVSectionData): section is { id: string; title: string; type: 'certifications'; content: CertificationItem[] } => {
    return section.type === 'certifications';
  };
  
  if (!cvData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading CV data...</h2>
          <p className="text-muted-foreground">If this takes too long, try going back to the builder.</p>
          <Button onClick={() => navigate('/builder/new')} variant="outline" className="mt-4">
            Back to Builder
          </Button>
        </div>
      </div>
    );
  }
  
  const { sections, template } = cvData;
  
  return (
    <div className={`min-h-screen flex flex-col bg-background ${isFullScreen ? 'p-0' : ''}`}>
      {/* Top navigation - hide in fullscreen mode */}
      {!isFullScreen && (
        <header className="border-b bg-background/90 backdrop-blur-md fixed top-0 w-full z-50">
          <div className="flex items-center justify-between py-4 px-6">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" className="mr-2" onClick={() => navigate('/builder/new')}>
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Editor
              </Button>
              <div className="w-8 h-8 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">CV</span>
              </div>
              <span className="font-bold text-xl">CV Preview</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleFullScreen}
              >
                <Maximize2 className="h-4 w-4" />
                {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4" />
                Edit CV
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="secondary" 
                  className="flex items-center gap-2"
                  onClick={() => setPageSize(pageSize === 'a4' ? 'letter' : 'a4')}
                >
                  <LayoutTemplate className="h-4 w-4" />
                  {pageSize === 'a4' ? 'A4' : 'Letter'}
                </Button>
                
                <Button 
                  variant="default" 
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                >
                  <FilePdf className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main content area */}
      <div className={`${isFullScreen ? 'pt-0' : 'pt-20'} flex flex-col items-center justify-center flex-1 p-6 bg-gray-100`}>
        <div className={`bg-white shadow-lg ${pageSize === 'a4' ? 'w-[210mm] h-[297mm]' : 'w-[216mm] h-[279mm]'} mx-auto ${templateStyles[template as keyof typeof templateStyles]} overflow-hidden`}>
          <div className={`p-8 h-full ${template === 'creative' || template === 'executive' ? 'border-t-8' : 'border-t-4'} ${templateColors[template as keyof typeof templateColors]}`}>
            {sections.map((section) => (
              <div key={section.id} className="mb-6">
                <h3 className={`font-bold text-lg ${template === 'minimal' ? '' : 'border-b'} pb-1 mb-3`}>{section.title}</h3>
                
                {isAboutSection(section) && (
                  <div className="space-y-2">
                    <div>
                      <div className={`text-xl font-bold ${template === 'creative' ? 'text-purple-600' : ''}`}>{section.content.name}</div>
                      <div className="text-muted-foreground">{section.content.role}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {section.content.email} • {section.content.phone} • {section.content.location}
                    </div>
                    <p className="text-sm">{section.content.summary}</p>
                  </div>
                )}

                {isExperienceSection(section) && (
                  <div className="space-y-3">
                    {section.content.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between">
                          <span className={`font-medium ${template === 'technical' ? 'text-emerald-600' : ''}`}>{exp.company}</span>
                          <span className="text-xs text-muted-foreground">{exp.period}</span>
                        </div>
                        <div className="text-sm italic">{exp.role}</div>
                        <p className="text-sm">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {isEducationSection(section) && (
                  <div className="space-y-3">
                    {section.content.map((edu) => (
                      <div key={edu.id}>
                        <div className="flex justify-between">
                          <span className={`font-medium ${template === 'executive' ? 'text-slate-700' : ''}`}>{edu.institution}</span>
                          <span className="text-xs text-muted-foreground">{edu.period}</span>
                        </div>
                        <div className="text-sm italic">{edu.degree}</div>
                        <p className="text-sm">{edu.description}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {isSkillsSection(section) && (
                  <div className="flex flex-wrap gap-2">
                    {section.content.map((skill, index) => (
                      <span 
                        key={index} 
                        className={`text-sm ${template === 'creative' ? 'bg-purple-100 text-purple-800' : template === 'technical' ? 'bg-emerald-100 text-emerald-800' : 'bg-muted'} px-2 py-1 rounded-full`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
                
                {isProjectsSection(section) && (
                  <div className="space-y-3">
                    {section.content.map((project) => (
                      <div key={project.id}>
                        <div className="font-medium">{project.name}</div>
                        <p className="text-sm">{project.description}</p>
                        <div className="text-xs italic mt-1">{project.technologies}</div>
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                            View Project
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {isCertificationsSection(section) && (
                  <div className="space-y-3">
                    {section.content.map((cert) => (
                      <div key={cert.id}>
                        <div className="flex justify-between">
                          <span className="font-medium">{cert.name}</span>
                          <span className="text-xs text-muted-foreground">{cert.date}</span>
                        </div>
                        <div className="text-xs italic">{cert.issuer}</div>
                        {cert.description && <p className="text-xs">{cert.description}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom actions - visible even in fullscreen */}
        <div className="mt-6 flex space-x-3">
          {isFullScreen && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleFullScreen}
            >
              <Maximize2 className="h-4 w-4" />
              Exit Fullscreen
            </Button>
          )}
          
          <Button 
            variant="default" 
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download CV as PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Preview;
