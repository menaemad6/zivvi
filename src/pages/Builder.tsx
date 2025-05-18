
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarSection } from '@/components/builder/SidebarSection';
import { CVSection } from '@/components/builder/CVSection';
import { toast } from "sonner";

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

// Download icon
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" x2="12" y1="15" y2="3"></line>
  </svg>
);

// Sample CV sections
const initialSections = [
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
  const [sections, setSections] = useState(initialSections);
  
  const handleDragStart = (e: React.DragEvent, sectionType: string) => {
    e.dataTransfer.setData("sectionType", sectionType);
  };

  const handleDownload = () => {
    toast.success("CV saved and ready for download", {
      description: "Your CV has been generated as a PDF.",
    });
  };
  
  const handleAutoSave = () => {
    toast("CV automatically saved", {
      description: "All changes are saved in real-time.",
    });
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
            <div className="w-8 h-8 rounded-md bg-gradient flex items-center justify-center">
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
              <DownloadIcon />
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
        <div className="flex-1 p-6">
          <h2 className="font-semibold text-xl mb-6">Edit Your CV</h2>
          
          <div className="space-y-4">
            {sections.map((section) => (
              <CVSection 
                key={section.id} 
                title={section.title}
                onEdit={() => handleAutoSave()}
                onDelete={() => {
                  setSections(sections.filter(s => s.id !== section.id));
                  toast("Section removed", {
                    description: `${section.title} section has been removed.`,
                  });
                }}
              >
                {section.type === 'about' && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <input 
                        type="text" 
                        className="w-full text-xl font-bold border-none p-0 focus:ring-0 focus:outline-none" 
                        value={section.content.name}
                        onChange={() => handleAutoSave()}
                      />
                      <input 
                        type="text" 
                        className="w-full text-muted-foreground border-none p-0 focus:ring-0 focus:outline-none" 
                        value={section.content.role}
                        onChange={() => handleAutoSave()}
                      />
                    </div>
                    <div className="flex flex-wrap text-sm text-muted-foreground gap-3">
                      <span>{section.content.email}</span>
                      <span>•</span>
                      <span>{section.content.phone}</span>
                      <span>•</span>
                      <span>{section.content.location}</span>
                    </div>
                    <textarea 
                      className="w-full min-h-[100px] border-none p-0 focus:ring-0 focus:outline-none resize-none"
                      value={section.content.summary}
                      onChange={() => handleAutoSave()}
                    ></textarea>
                  </div>
                )}

                {section.type === 'experience' && (
                  <div className="space-y-4">
                    {section.content.map((exp: any) => (
                      <div key={exp.id} className="border-b pb-3 last:border-b-0">
                        <div className="flex justify-between">
                          <input 
                            type="text" 
                            className="font-medium border-none p-0 focus:ring-0 focus:outline-none" 
                            value={exp.company}
                            onChange={() => handleAutoSave()}
                          />
                          <input 
                            type="text" 
                            className="text-sm text-muted-foreground border-none p-0 focus:ring-0 focus:outline-none" 
                            value={exp.period}
                            onChange={() => handleAutoSave()}
                          />
                        </div>
                        <input 
                          type="text" 
                          className="text-sm italic border-none p-0 focus:ring-0 focus:outline-none" 
                          value={exp.role}
                          onChange={() => handleAutoSave()}
                        />
                        <textarea 
                          className="w-full text-sm border-none p-0 focus:ring-0 focus:outline-none resize-none mt-1"
                          value={exp.description}
                          onChange={() => handleAutoSave()}
                        ></textarea>
                      </div>
                    ))}
                  </div>
                )}

                {section.type === 'education' && (
                  <div className="space-y-4">
                    {section.content.map((edu: any) => (
                      <div key={edu.id} className="border-b pb-3 last:border-b-0">
                        <div className="flex justify-between">
                          <input 
                            type="text" 
                            className="font-medium border-none p-0 focus:ring-0 focus:outline-none" 
                            value={edu.institution}
                            onChange={() => handleAutoSave()}
                          />
                          <input 
                            type="text" 
                            className="text-sm text-muted-foreground border-none p-0 focus:ring-0 focus:outline-none" 
                            value={edu.period}
                            onChange={() => handleAutoSave()}
                          />
                        </div>
                        <input 
                          type="text" 
                          className="text-sm italic border-none p-0 focus:ring-0 focus:outline-none" 
                          value={edu.degree}
                          onChange={() => handleAutoSave()}
                        />
                        <textarea 
                          className="w-full text-sm border-none p-0 focus:ring-0 focus:outline-none resize-none mt-1"
                          value={edu.description}
                          onChange={() => handleAutoSave()}
                        ></textarea>
                      </div>
                    ))}
                  </div>
                )}
              </CVSection>
            ))}
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
                  
                  {section.type === 'about' && (
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

                  {section.type === 'experience' && (
                    <div className="space-y-3">
                      {section.content.map((exp: any) => (
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

                  {section.type === 'education' && (
                    <div className="space-y-3">
                      {section.content.map((edu: any) => (
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
