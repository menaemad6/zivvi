
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarSection } from '@/components/builder/SidebarSection';
import { CVSection } from '@/components/builder/CVSection';
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, Download, Check, X, ArrowLeft } from 'lucide-react';

// Define proper TypeScript types for different section contents
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

// Define a discriminated union type for CV sections
type CVSectionData = {
  id: string;
  title: string;
} & (
  | { type: 'about'; content: AboutContent }
  | { type: 'experience'; content: ExperienceItem[] }
  | { type: 'education'; content: EducationItem[] }
  | { type: 'skills'; content: SkillItem[] }
  | { type: 'projects'; content: ProjectItem[] }
  | { type: 'certifications'; content: CertificationItem[] }
);

// Template thumbnails
const templates = [
  { id: 'classic', name: 'Classic' },
  { id: 'modern', name: 'Modern' },
  { id: 'minimal', name: 'Minimal' },
];

// Icons for the sidebar sections
const AboutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const EducationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c0 3 5 5 5 5s5-2 5-5v-5"></path>
  </svg>
);

const ExperienceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const SkillsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
  </svg>
);

const ProjectsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <path d="M8 12h8M12 8v8"></path>
  </svg>
);

const CertificationsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4"></polyline>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);

// Sample CV sections
const initialSections: CVSectionData[] = [
  {
    id: '1',
    type: 'about',
    title: 'About Me',
    content: {
      name: 'John Doe',
      role: 'Software Engineer',
      email: 'john.doe@example.com',
      phone: '(123) 456-7890',
      location: 'New York, NY',
      summary: 'Experienced software engineer with a passion for building scalable, user-friendly applications.'
    }
  },
  {
    id: '2',
    type: 'experience',
    title: 'Work Experience',
    content: [
      {
        id: 'exp1',
        company: 'Tech Solutions Inc.',
        role: 'Senior Developer',
        period: 'Jan 2020 - Present',
        description: 'Led team of 5 developers, implemented CI/CD pipeline, reduced build times by 30%.'
      },
      {
        id: 'exp2',
        company: 'Digital Innovators',
        role: 'Web Developer',
        period: 'Mar 2017 - Dec 2019',
        description: 'Developed responsive web applications using React and Node.js.'
      }
    ]
  },
  {
    id: '3',
    type: 'education',
    title: 'Education',
    content: [
      {
        id: 'edu1',
        institution: 'University of Technology',
        degree: 'M.S. Computer Science',
        period: '2015 - 2017',
        description: 'Focus on software engineering and machine learning.'
      },
      {
        id: 'edu2',
        institution: 'State College',
        degree: 'B.S. Computer Science',
        period: '2011 - 2015',
        description: 'Graduated with honors.'
      }
    ]
  }
];

const Builder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');
  const [sections, setSections] = useState<CVSectionData[]>(initialSections);
  const [editedSections, setEditedSections] = useState<Record<string, any>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  // Function to create a new section based on the type
  const createNewSection = (sectionType: string): CVSectionData | null => {
    const id = uuidv4();
    
    switch (sectionType) {
      case 'about':
        return {
          id,
          type: 'about',
          title: 'About Me',
          content: {
            name: 'Your Name',
            role: 'Your Role',
            email: 'your.email@example.com',
            phone: 'Your Phone',
            location: 'Your Location',
            summary: 'Write a brief summary about yourself...'
          }
        };
      case 'experience':
        return {
          id,
          type: 'experience',
          title: 'Work Experience',
          content: [
            {
              id: uuidv4(),
              company: 'Company Name',
              role: 'Your Position',
              period: 'Start - End Date',
              description: 'Describe your responsibilities and achievements...'
            }
          ]
        };
      case 'education':
        return {
          id,
          type: 'education',
          title: 'Education',
          content: [
            {
              id: uuidv4(),
              institution: 'Institution Name',
              degree: 'Your Degree',
              period: 'Start - End Date',
              description: 'Describe your studies and achievements...'
            }
          ]
        };
      case 'skills':
        return {
          id,
          type: 'skills',
          title: 'Skills',
          content: ['Skill 1', 'Skill 2', 'Skill 3']
        };
      case 'projects':
        return {
          id,
          type: 'projects',
          title: 'Projects',
          content: [
            {
              id: uuidv4(),
              name: 'Project Name',
              description: 'Project description...',
              technologies: 'Technologies used',
              link: 'https://example.com'
            }
          ]
        };
      case 'certifications':
        return {
          id,
          type: 'certifications',
          title: 'Certifications',
          content: [
            {
              id: uuidv4(),
              name: 'Certification Name',
              issuer: 'Issuing Organization',
              date: 'Issue Date',
              description: 'Description of certification...'
            }
          ]
        };
      default:
        return null;
    }
  };
  
  const handleDragStart = (e: React.DragEvent, sectionType: string) => {
    e.dataTransfer.setData("sectionType", sectionType);
    setIsDragging(true);
    setDraggedSection(sectionType);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropZoneRef.current && dropZoneRef.current.contains(e.target as Node)) {
      e.currentTarget.classList.add('bg-primary/10');
    }
  };
  
  const handleDragEnter = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    setDragOverSection(sectionId);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-primary/10');
    setDragOverSection(null);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-primary/10');
    
    const sectionType = e.dataTransfer.getData("sectionType");
    
    if (sectionType) {
      const newSection = createNewSection(sectionType);
      
      if (newSection) {
        setSections([...sections, newSection]);
        toast({
          title: "Section Added",
          description: `${newSection.title} has been added to your CV.`,
        });
      }
    }
    
    setIsDragging(false);
    setDraggedSection(null);
    setDragOverSection(null);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedSection(null);
    setDragOverSection(null);
  };
  
  const handleSectionDragStart = (e: React.DragEvent, sectionId: string) => {
    e.dataTransfer.setData("sectionId", sectionId);
    setIsDragging(true);
    setDraggedSection(sectionId);
  };
  
  const handleSectionDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    const sourceId = e.dataTransfer.getData("sectionId");
    
    if (sourceId) {
      const sourceIndex = sections.findIndex(s => s.id === sourceId);
      if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
        const updatedSections = [...sections];
        const [movedSection] = updatedSections.splice(sourceIndex, 1);
        updatedSections.splice(targetIndex, 0, movedSection);
        
        setSections(updatedSections);
        toast({
          title: "Section Reordered",
          description: "Your CV sections have been reordered.",
        });
      }
    }
    
    setIsDragging(false);
    setDraggedSection(null);
    setDragOverSection(null);
  };
  
  const handleInputChange = (sectionId: string, field: string, value: string) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        if (section.type === 'about') {
          return {
            ...section,
            content: {
              ...section.content,
              [field]: value
            }
          };
        }
      }
      return section;
    });
    
    setSections(updatedSections);
    // Auto-save feature
    toast({
      title: "Changes Saved",
      description: "Your changes have been automatically saved.",
    });
  };
  
  const handleArrayItemChange = (sectionId: string, itemId: string, field: string, value: string) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        if (section.type === 'experience' || section.type === 'education' || section.type === 'projects' || section.type === 'certifications') {
          return {
            ...section,
            content: section.content.map((item: any) => 
              item.id === itemId ? { ...item, [field]: value } : item
            )
          };
        } else if (section.type === 'skills') {
          const index = parseInt(itemId);
          if (!isNaN(index)) {
            const updatedContent = [...section.content];
            updatedContent[index] = value;
            return {
              ...section,
              content: updatedContent
            };
          }
        }
      }
      return section;
    });
    
    setSections(updatedSections);
    toast({
      title: "Changes Saved",
      description: "Your changes have been automatically saved.",
    });
  };
  
  const addItemToSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    
    if (!section) return;
    
    const updatedSections = sections.map(s => {
      if (s.id === sectionId) {
        if (s.type === 'experience') {
          return {
            ...s,
            content: [
              ...s.content,
              {
                id: uuidv4(),
                company: 'New Company',
                role: 'New Position',
                period: 'Start - End Date',
                description: 'Describe your responsibilities and achievements...'
              }
            ]
          };
        } else if (s.type === 'education') {
          return {
            ...s,
            content: [
              ...s.content,
              {
                id: uuidv4(),
                institution: 'New Institution',
                degree: 'New Degree',
                period: 'Start - End Date',
                description: 'Describe your studies and achievements...'
              }
            ]
          };
        } else if (s.type === 'skills') {
          return {
            ...s,
            content: [...s.content, 'New Skill']
          };
        } else if (s.type === 'projects') {
          return {
            ...s,
            content: [
              ...s.content,
              {
                id: uuidv4(),
                name: 'New Project',
                description: 'Project description...',
                technologies: 'Technologies used',
                link: ''
              }
            ]
          };
        } else if (s.type === 'certifications') {
          return {
            ...s,
            content: [
              ...s.content,
              {
                id: uuidv4(),
                name: 'New Certification',
                issuer: 'Issuing Organization',
                date: 'Issue Date',
                description: 'Description of certification...'
              }
            ]
          };
        }
      }
      return s;
    });
    
    setSections(updatedSections);
    toast({
      title: "Item Added",
      description: `New item added to ${section.title}.`,
    });
  };
  
  const removeItemFromSection = (sectionId: string, itemId: string) => {
    const section = sections.find(s => s.id === sectionId);
    
    if (!section) return;
    
    if ((section.type === 'experience' || section.type === 'education' || section.type === 'projects' || section.type === 'certifications') && 
        Array.isArray(section.content) && section.content.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "You must keep at least one item in this section.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedSections = sections.map(s => {
      if (s.id === sectionId) {
        if (s.type === 'experience' || s.type === 'education' || s.type === 'projects' || s.type === 'certifications') {
          return {
            ...s,
            content: s.content.filter((item: any) => item.id !== itemId)
          };
        } else if (s.type === 'skills') {
          const index = parseInt(itemId);
          if (!isNaN(index)) {
            const updatedContent = [...s.content];
            updatedContent.splice(index, 1);
            return {
              ...s,
              content: updatedContent
            };
          }
        }
      }
      return s;
    });
    
    setSections(updatedSections);
    toast({
      title: "Item Removed",
      description: `Item removed from ${section.title}.`,
    });
  };

  const handleDownload = () => {
    toast({
      title: "CV Generated",
      description: "Your CV has been generated as a PDF and is ready to download.",
    });
  };
  
  const handleAutoSave = () => {
    toast({
      description: "All changes are automatically saved.",
    });
  };

  // Type guard to check if section is about section
  const isAboutSection = (section: CVSectionData): section is CVSectionData & { type: 'about'; content: AboutContent } => {
    return section.type === 'about';
  };
  
  // Type guard to check if section is experience section
  const isExperienceSection = (section: CVSectionData): section is CVSectionData & { type: 'experience'; content: ExperienceItem[] } => {
    return section.type === 'experience';
  };
  
  // Type guard to check if section is education section
  const isEducationSection = (section: CVSectionData): section is CVSectionData & { type: 'education'; content: EducationItem[] } => {
    return section.type === 'education';
  };
  
  // Type guard to check if section is skills section
  const isSkillsSection = (section: CVSectionData): section is CVSectionData & { type: 'skills'; content: string[] } => {
    return section.type === 'skills';
  };
  
  // Type guard to check if section is projects section
  const isProjectsSection = (section: CVSectionData): section is CVSectionData & { type: 'projects'; content: ProjectItem[] } => {
    return section.type === 'projects';
  };
  
  // Type guard to check if section is certifications section
  const isCertificationsSection = (section: CVSectionData): section is CVSectionData & { type: 'certifications'; content: CertificationItem[] } => {
    return section.type === 'certifications';
  };

  // Template specific classes
  const templateStyles = {
    classic: "font-serif",
    modern: "font-sans",
    minimal: "font-sans tracking-wide",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top navigation */}
      <header className="border-b bg-background/90 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="flex items-center justify-between py-4 px-6">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" className="mr-2" onClick={() => window.history.back()}>
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </Button>
            <div className="w-8 h-8 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <span className="font-bold text-xl">CVBuilder</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div>
              <Label htmlFor="template" className="mr-2 text-sm">Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Choose template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="pt-20 flex flex-col md:flex-row flex-1">
        {/* Left sidebar */}
        <div className="w-full md:w-64 lg:w-72 p-4 border-r bg-background">
          <div className="sticky top-20">
            <h3 className="font-semibold mb-4">CV Sections</h3>
            <p className="text-sm text-muted-foreground mb-4">Drag and drop sections into your CV</p>
            
            <div className="space-y-2">
              <SidebarSection 
                title="About Me" 
                icon={<AboutIcon />} 
                onDragStart={(e) => handleDragStart(e, 'about')}
              />
              <SidebarSection 
                title="Education" 
                icon={<EducationIcon />} 
                onDragStart={(e) => handleDragStart(e, 'education')}
              />
              <SidebarSection 
                title="Experience" 
                icon={<ExperienceIcon />} 
                onDragStart={(e) => handleDragStart(e, 'experience')}
              />
              <SidebarSection 
                title="Skills" 
                icon={<SkillsIcon />} 
                onDragStart={(e) => handleDragStart(e, 'skills')}
              />
              <SidebarSection 
                title="Projects" 
                icon={<ProjectsIcon />} 
                onDragStart={(e) => handleDragStart(e, 'projects')}
              />
              <SidebarSection 
                title="Certifications" 
                icon={<CertificationsIcon />} 
                onDragStart={(e) => handleDragStart(e, 'certifications')}
              />
            </div>
          </div>
        </div>

        {/* Main editor */}
        <div 
          className="flex-1 p-6 relative"
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <h2 className="font-semibold text-xl mb-6">Edit Your CV</h2>
          
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div 
                key={section.id}
                className={`transition-colors duration-200 ${dragOverSection === section.id ? 'bg-primary/10 border-primary/30' : ''}`}
                onDragEnter={(e) => handleDragEnter(e, section.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleSectionDrop(e, index)}
              >
                <CVSection 
                  title={section.title}
                  onDragStart={(e) => handleSectionDragStart(e, section.id)}
                  onEdit={() => handleAutoSave()}
                  onDelete={() => {
                    setSections(sections.filter(s => s.id !== section.id));
                    toast({
                      title: "Section Removed",
                      description: `${section.title} section has been removed.`,
                    });
                  }}
                >
                  {isAboutSection(section) && (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <input 
                          type="text" 
                          className="w-full text-xl font-bold border-none p-0 focus:ring-0 focus:outline-none" 
                          value={section.content.name}
                          onChange={(e) => handleInputChange(section.id, 'name', e.target.value)}
                        />
                        <input 
                          type="text" 
                          className="w-full text-muted-foreground border-none p-0 focus:ring-0 focus:outline-none" 
                          value={section.content.role}
                          onChange={(e) => handleInputChange(section.id, 'role', e.target.value)}
                        />
                      </div>
                      <div className="flex flex-wrap text-sm text-muted-foreground gap-3">
                        <input 
                          type="email" 
                          placeholder="Email" 
                          className="border-none p-0 focus:ring-0 focus:outline-none bg-transparent" 
                          value={section.content.email}
                          onChange={(e) => handleInputChange(section.id, 'email', e.target.value)}
                        />
                        <span>•</span>
                        <input 
                          type="text" 
                          placeholder="Phone" 
                          className="border-none p-0 focus:ring-0 focus:outline-none bg-transparent" 
                          value={section.content.phone}
                          onChange={(e) => handleInputChange(section.id, 'phone', e.target.value)}
                        />
                        <span>•</span>
                        <input 
                          type="text" 
                          placeholder="Location" 
                          className="border-none p-0 focus:ring-0 focus:outline-none bg-transparent" 
                          value={section.content.location}
                          onChange={(e) => handleInputChange(section.id, 'location', e.target.value)}
                        />
                      </div>
                      <textarea 
                        className="w-full min-h-[100px] border-none p-0 focus:ring-0 focus:outline-none resize-none"
                        value={section.content.summary}
                        onChange={(e) => handleInputChange(section.id, 'summary', e.target.value)}
                      ></textarea>
                    </div>
                  )}

                  {isExperienceSection(section) && (
                    <div className="space-y-4">
                      {section.content.map((exp) => (
                        <div key={exp.id} className="border-b pb-3 last:border-b-0">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <input 
                                type="text" 
                                className="font-medium border-none p-0 focus:ring-0 focus:outline-none w-full" 
                                value={exp.company}
                                onChange={(e) => handleArrayItemChange(section.id, exp.id, 'company', e.target.value)}
                              />
                            </div>
                            <div className="flex items-center">
                              <input 
                                type="text" 
                                className="text-sm text-muted-foreground border-none p-0 focus:ring-0 focus:outline-none" 
                                value={exp.period}
                                onChange={(e) => handleArrayItemChange(section.id, exp.id, 'period', e.target.value)}
                              />
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-destructive ml-2"
                                onClick={() => removeItemFromSection(section.id, exp.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <input 
                            type="text" 
                            className="text-sm italic border-none p-0 focus:ring-0 focus:outline-none" 
                            value={exp.role}
                            onChange={(e) => handleArrayItemChange(section.id, exp.id, 'role', e.target.value)}
                          />
                          <textarea 
                            className="w-full text-sm border-none p-0 focus:ring-0 focus:outline-none resize-none mt-1"
                            value={exp.description}
                            onChange={(e) => handleArrayItemChange(section.id, exp.id, 'description', e.target.value)}
                          ></textarea>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => addItemToSection(section.id)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Experience
                      </Button>
                    </div>
                  )}

                  {isEducationSection(section) && (
                    <div className="space-y-4">
                      {section.content.map((edu) => (
                        <div key={edu.id} className="border-b pb-3 last:border-b-0">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <input 
                                type="text" 
                                className="font-medium border-none p-0 focus:ring-0 focus:outline-none w-full" 
                                value={edu.institution}
                                onChange={(e) => handleArrayItemChange(section.id, edu.id, 'institution', e.target.value)}
                              />
                            </div>
                            <div className="flex items-center">
                              <input 
                                type="text" 
                                className="text-sm text-muted-foreground border-none p-0 focus:ring-0 focus:outline-none" 
                                value={edu.period}
                                onChange={(e) => handleArrayItemChange(section.id, edu.id, 'period', e.target.value)}
                              />
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-destructive ml-2"
                                onClick={() => removeItemFromSection(section.id, edu.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <input 
                            type="text" 
                            className="text-sm italic border-none p-0 focus:ring-0 focus:outline-none" 
                            value={edu.degree}
                            onChange={(e) => handleArrayItemChange(section.id, edu.id, 'degree', e.target.value)}
                          />
                          <textarea 
                            className="w-full text-sm border-none p-0 focus:ring-0 focus:outline-none resize-none mt-1"
                            value={edu.description}
                            onChange={(e) => handleArrayItemChange(section.id, edu.id, 'description', e.target.value)}
                          ></textarea>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => addItemToSection(section.id)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Education
                      </Button>
                    </div>
                  )}
                  
                  {isSkillsSection(section) && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {section.content.map((skill, index) => (
                          <div key={index} className="bg-muted px-3 py-1 rounded-full flex items-center">
                            <input 
                              type="text" 
                              className="border-none bg-transparent p-0 focus:ring-0 focus:outline-none text-sm w-full" 
                              value={skill}
                              onChange={(e) => handleArrayItemChange(section.id, index.toString(), '', e.target.value)}
                            />
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-muted-foreground hover:text-destructive p-0 ml-1 h-auto"
                              onClick={() => removeItemFromSection(section.id, index.toString())}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => addItemToSection(section.id)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Skill
                      </Button>
                    </div>
                  )}
                  
                  {isProjectsSection(section) && (
                    <div className="space-y-4">
                      {section.content.map((project) => (
                        <div key={project.id} className="border-b pb-3 last:border-b-0">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <input 
                                type="text" 
                                className="font-medium border-none p-0 focus:ring-0 focus:outline-none w-full" 
                                value={project.name}
                                onChange={(e) => handleArrayItemChange(section.id, project.id, 'name', e.target.value)}
                              />
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-destructive"
                              onClick={() => removeItemFromSection(section.id, project.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <textarea 
                            className="w-full text-sm border-none p-0 focus:ring-0 focus:outline-none resize-none mt-1"
                            placeholder="Project description"
                            value={project.description}
                            onChange={(e) => handleArrayItemChange(section.id, project.id, 'description', e.target.value)}
                          ></textarea>
                          <input 
                            type="text" 
                            className="text-xs italic border-none p-0 focus:ring-0 focus:outline-none w-full mt-1" 
                            placeholder="Technologies used"
                            value={project.technologies}
                            onChange={(e) => handleArrayItemChange(section.id, project.id, 'technologies', e.target.value)}
                          />
                          <input 
                            type="url" 
                            className="text-xs text-blue-500 border-none p-0 focus:ring-0 focus:outline-none w-full mt-1" 
                            placeholder="Project link (optional)"
                            value={project.link || ''}
                            onChange={(e) => handleArrayItemChange(section.id, project.id, 'link', e.target.value)}
                          />
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => addItemToSection(section.id)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Project
                      </Button>
                    </div>
                  )}
                  
                  {isCertificationsSection(section) && (
                    <div className="space-y-4">
                      {section.content.map((cert) => (
                        <div key={cert.id} className="border-b pb-3 last:border-b-0">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <input 
                                type="text" 
                                className="font-medium border-none p-0 focus:ring-0 focus:outline-none w-full" 
                                value={cert.name}
                                onChange={(e) => handleArrayItemChange(section.id, cert.id, 'name', e.target.value)}
                              />
                            </div>
                            <div className="flex items-center">
                              <input 
                                type="text" 
                                className="text-sm text-muted-foreground border-none p-0 focus:ring-0 focus:outline-none" 
                                placeholder="Date"
                                value={cert.date}
                                onChange={(e) => handleArrayItemChange(section.id, cert.id, 'date', e.target.value)}
                              />
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-destructive ml-2"
                                onClick={() => removeItemFromSection(section.id, cert.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <input 
                            type="text" 
                            className="text-sm italic border-none p-0 focus:ring-0 focus:outline-none" 
                            placeholder="Issuing organization"
                            value={cert.issuer}
                            onChange={(e) => handleArrayItemChange(section.id, cert.id, 'issuer', e.target.value)}
                          />
                          <textarea 
                            className="w-full text-sm border-none p-0 focus:ring-0 focus:outline-none resize-none mt-1"
                            placeholder="Description (optional)"
                            value={cert.description || ''}
                            onChange={(e) => handleArrayItemChange(section.id, cert.id, 'description', e.target.value)}
                          ></textarea>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => addItemToSection(section.id)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Certification
                      </Button>
                    </div>
                  )}
                </CVSection>
              </div>
            ))}
            
            {/* Drop zone indicator when dragging */}
            {isDragging && (
              <div className="border-2 border-dashed border-primary/40 rounded-lg p-8 text-center text-muted-foreground animate-pulse">
                Drop section here to add to your CV
              </div>
            )}
          </div>
        </div>

        {/* Preview pane */}
        <div className="hidden xl:block w-[450px] bg-muted/30 border-l p-8">
          <div className="sticky top-24">
            <h3 className="font-semibold mb-2">Preview</h3>
            <p className="text-sm text-muted-foreground mb-4">See how your CV looks in real-time</p>
            
            <div className={`bg-white shadow-lg rounded-md p-6 ${templateStyles[selectedTemplate as keyof typeof templateStyles]}`}>
              {sections.map((section) => (
                <div key={section.id} className="mb-6">
                  <h3 className="font-bold text-lg border-b pb-1 mb-3">{section.title}</h3>
                  
                  {isAboutSection(section) && (
                    <div className="space-y-2">
                      <div>
                        <div className="text-xl font-bold">{section.content.name}</div>
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
                            <span className="font-medium text-sm">{exp.company}</span>
                            <span className="text-xs text-muted-foreground">{exp.period}</span>
                          </div>
                          <div className="text-xs italic">{exp.role}</div>
                          <p className="text-xs">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {isEducationSection(section) && (
                    <div className="space-y-3">
                      {section.content.map((edu) => (
                        <div key={edu.id}>
                          <div className="flex justify-between">
                            <span className="font-medium text-sm">{edu.institution}</span>
                            <span className="text-xs text-muted-foreground">{edu.period}</span>
                          </div>
                          <div className="text-xs italic">{edu.degree}</div>
                          <p className="text-xs">{edu.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {isSkillsSection(section) && (
                    <div className="flex flex-wrap gap-2">
                      {section.content.map((skill, index) => (
                        <span key={index} className="text-xs bg-muted/50 px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {isProjectsSection(section) && (
                    <div className="space-y-3">
                      {section.content.map((project) => (
                        <div key={project.id}>
                          <div className="font-medium text-sm">{project.name}</div>
                          <p className="text-xs">{project.description}</p>
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
                            <span className="font-medium text-sm">{cert.name}</span>
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
        </div>
      </div>
    </div>
  );
};

export default Builder;
