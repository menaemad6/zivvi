import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { CVData } from '@/types/cv';
import { v4 as uuidv4 } from 'uuid';
import { AIGenerateButton } from './AIGenerateButton';

interface SectionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionType: string;
  sectionTitle: string;
  cvData: CVData | null;
  onSave: (updatedData: CVData) => void;
}

export const SectionEditModal = ({ isOpen, onClose, sectionType, sectionTitle, cvData, onSave }: SectionEditModalProps) => {
  const [localData, setLocalData] = useState<CVData | null>(null);

  useEffect(() => {
    if (cvData && isOpen) {
      setLocalData({ ...cvData });
    }
  }, [cvData, isOpen]);

  if (!localData) return null;

  const handleSave = () => {
    onSave(localData);
    onClose();
  };

  const generateExperienceDescription = (experience: any) => {
    const prompt = `Generate a professional job description for this work experience:
    
    Position: ${experience.title || 'Not specified'}
    Company: ${experience.company || 'Not specified'}
    Start Date: ${experience.startDate || 'Not specified'}
    End Date: ${experience.endDate || 'Present'}
    
    Write a compelling 2-3 sentence description highlighting key responsibilities and achievements. Focus on measurable impact and relevant skills.`;
    
    return prompt;
  };

  const generateProjectDescription = (project: any) => {
    const prompt = `Generate a professional project description:
    
    Project Name: ${project.name || 'Not specified'}
    Technologies: ${project.technologies || 'Not specified'}
    Start Date: ${project.startDate || 'Not specified'}
    End Date: ${project.endDate || 'Present'}
    
    Write a compelling 2-3 sentence description highlighting the project's purpose, your role, and key achievements or technologies used.`;
    
    return prompt;
  };

  const generatePersonalSummary = () => {
    const prompt = `Generate a professional summary based on the following information:
    
    Name: ${localData.personalInfo?.fullName || 'Not specified'}
    ${localData.experience && localData.experience.length > 0 ? `
    Recent Experience: ${localData.experience.map(exp => `${exp.title} at ${exp.company}`).join(', ')}
    ` : ''}
    ${localData.skills && localData.skills.length > 0 ? `
    Key Skills: ${localData.skills.join(', ')}
    ` : ''}
    ${localData.education && localData.education.length > 0 ? `
    Education: ${localData.education.map(edu => `${edu.degree} from ${edu.school}`).join(', ')}
    ` : ''}
    
    Write a compelling 2-3 sentence professional summary that highlights key strengths, experience, and career focus.`;
    
    return prompt;
  };

  const renderPersonalInfoSection = () => (
    <div className="space-y-4">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={localData.personalInfo?.fullName || ''}
            onChange={(e) => setLocalData({
              ...localData,
              personalInfo: { ...localData.personalInfo!, fullName: e.target.value }
            })}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={localData.personalInfo?.email || ''}
            onChange={(e) => setLocalData({
              ...localData,
              personalInfo: { ...localData.personalInfo!, email: e.target.value }
            })}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={localData.personalInfo?.phone || ''}
            onChange={(e) => setLocalData({
              ...localData,
              personalInfo: { ...localData.personalInfo!, phone: e.target.value }
            })}
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={localData.personalInfo?.location || ''}
            onChange={(e) => setLocalData({
              ...localData,
              personalInfo: { ...localData.personalInfo!, location: e.target.value }
            })}
          />
        </div>
        <div className='col-span-2'>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={localData.personalInfo?.title || ''}
            onChange={(e) => setLocalData({
              ...localData,
              personalInfo: { ...localData.personalInfo!, title: e.target.value }
            })}
          />
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <AIGenerateButton
            onGenerated={(text) => setLocalData({
              ...localData,
              personalInfo: { ...localData.personalInfo!, summary: text }
            })}
            prompt={generatePersonalSummary()}
            type="summary"
            disabled={!localData.personalInfo?.fullName}
          />
        </div>
        <Textarea
          id="summary"
          value={localData.personalInfo?.summary || ''}
          onChange={(e) => setLocalData({
            ...localData,
            personalInfo: { ...localData.personalInfo!, summary: e.target.value }
          })}
          rows={4}
          placeholder="Write a brief professional summary..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
          <Label htmlFor="linkedin">Linkedin Account</Label>
          <Input
            id="linkedin"
            type="linkedin"
            value={localData.personalInfo?.linkedin || ''}
            onChange={(e) => setLocalData({
              ...localData,
              personalInfo: { ...localData.personalInfo!, linkedin: e.target.value }
            })}
          />
        </div>
        <div>
          <Label htmlFor="personal_website">Personal Website</Label>
          <Input
            id="personal_website"
            value={localData.personalInfo?.personal_website || ''}
            onChange={(e) => setLocalData({
              ...localData,
              personalInfo: { ...localData.personalInfo!, personal_website: e.target.value }
            })}
          />
        </div>
        <div>
          <Label htmlFor="github">Github Account</Label>
          <Input
            id="github"
            value={localData.personalInfo?.github || ''}
            onChange={(e) => setLocalData({
              ...localData,
              personalInfo: { ...localData.personalInfo!, github: e.target.value }
            })}
          />
        </div>
      </div>


    </div>
  );

  const renderExperienceSection = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button
          onClick={() => {
            const newExp = {
              id: uuidv4(),
              title: '',
              company: '',
              startDate: '',
              endDate: '',
              description: ''
            };
            setLocalData({
              ...localData,
              experience: [...(localData.experience || []), newExp]
            });
          }}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>
      
      {localData.experience?.map((exp, index) => (
        <Card key={exp.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">Experience {index + 1}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newExp = localData.experience?.filter((_, i) => i !== index) || [];
                  setLocalData({ ...localData, experience: newExp });
                }}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Job Title</Label>
                <Input
                  value={exp.title}
                  onChange={(e) => {
                    const newExp = [...(localData.experience || [])];
                    newExp[index] = { ...exp, title: e.target.value };
                    setLocalData({ ...localData, experience: newExp });
                  }}
                  placeholder="e.g., Software Engineer"
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => {
                    const newExp = [...(localData.experience || [])];
                    newExp[index] = { ...exp, company: e.target.value };
                    setLocalData({ ...localData, experience: newExp });
                  }}
                  placeholder="e.g., Google Inc."
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => {
                    const newExp = [...(localData.experience || [])];
                    newExp[index] = { ...exp, startDate: e.target.value };
                    setLocalData({ ...localData, experience: newExp });
                  }}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => {
                    const newExp = [...(localData.experience || [])];
                    newExp[index] = { ...exp, endDate: e.target.value };
                    setLocalData({ ...localData, experience: newExp });
                  }}
                  placeholder="Leave empty if current"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Job Description</Label>
                <AIGenerateButton
                  onGenerated={(text) => {
                    const newExp = [...(localData.experience || [])];
                    newExp[index] = { ...exp, description: text };
                    setLocalData({ ...localData, experience: newExp });
                  }}
                  prompt={generateExperienceDescription(exp)}
                  type="description"
                  disabled={!exp.title || !exp.company}
                />
              </div>
              <Textarea
                value={exp.description}
                onChange={(e) => {
                  const newExp = [...(localData.experience || [])];
                  newExp[index] = { ...exp, description: e.target.value };
                  setLocalData({ ...localData, experience: newExp });
                }}
                rows={3}
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
          </CardContent>
        </Card>
      ))}
      
      {(!localData.experience || localData.experience.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <p>No work experience added yet.</p>
          <p className="text-sm">Click "Add Experience" to get started.</p>
        </div>
      )}
    </div>
  );

  const renderProjectsSection = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Projects</h3>
        <Button
          onClick={() => {
            const newProject = {
              id: uuidv4(),
              name: '',
              description: '',
              technologies: '',
              link: '',
              startDate: '',
              endDate: ''
            };
            setLocalData({
              ...localData,
              projects: [...(localData.projects || []), newProject]
            });
          }}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>
      
      {localData.projects?.map((project, index) => (
        <Card key={project.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">Project {index + 1}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newProjects = localData.projects?.filter((_, i) => i !== index) || [];
                  setLocalData({ ...localData, projects: newProjects });
                }}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Project Name</Label>
                <Input
                  value={project.name}
                  onChange={(e) => {
                    const newProjects = [...(localData.projects || [])];
                    newProjects[index] = { ...project, name: e.target.value };
                    setLocalData({ ...localData, projects: newProjects });
                  }}
                  placeholder="e.g., E-commerce Platform"
                />
              </div>
              <div>
                <Label>Technologies</Label>
                <Input
                  value={project.technologies}
                  onChange={(e) => {
                    const newProjects = [...(localData.projects || [])];
                    newProjects[index] = { ...project, technologies: e.target.value };
                    setLocalData({ ...localData, projects: newProjects });
                  }}
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={project.startDate}
                  onChange={(e) => {
                    const newProjects = [...(localData.projects || [])];
                    newProjects[index] = { ...project, startDate: e.target.value };
                    setLocalData({ ...localData, projects: newProjects });
                  }}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={project.endDate}
                  onChange={(e) => {
                    const newProjects = [...(localData.projects || [])];
                    newProjects[index] = { ...project, endDate: e.target.value };
                    setLocalData({ ...localData, projects: newProjects });
                  }}
                  placeholder="Leave empty if ongoing"
                />
              </div>
            </div>
            
            <div>
              <Label>Project Link (Optional)</Label>
              <Input
                type="url"
                value={project.link}
                onChange={(e) => {
                  const newProjects = [...(localData.projects || [])];
                  newProjects[index] = { ...project, link: e.target.value };
                  setLocalData({ ...localData, projects: newProjects });
                }}
                placeholder="https://github.com/username/project"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Project Description</Label>
                <AIGenerateButton
                  onGenerated={(text) => {
                    const newProjects = [...(localData.projects || [])];
                    newProjects[index] = { ...project, description: text };
                    setLocalData({ ...localData, projects: newProjects });
                  }}
                  prompt={generateProjectDescription(project)}
                  type="description"
                  disabled={!project.name}
                />
              </div>
              <Textarea
                value={project.description}
                onChange={(e) => {
                  const newProjects = [...(localData.projects || [])];
                  newProjects[index] = { ...project, description: e.target.value };
                  setLocalData({ ...localData, projects: newProjects });
                }}
                rows={3}
                placeholder="Describe what the project does and your role..."
              />
            </div>
          </CardContent>
        </Card>
      ))}
      
      {(!localData.projects || localData.projects.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <p>No projects added yet.</p>
          <p className="text-sm">Click "Add Project" to get started.</p>
        </div>
      )}
    </div>
  );

  const renderEducationSection = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Education</h3>
        <Button
          onClick={() => {
            const newEdu = {
              id: uuidv4(),
              degree: '',
              school: '',
              startDate: '',
              endDate: ''
            };
            setLocalData({
              ...localData,
              education: [...(localData.education || []), newEdu]
            });
          }}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>
      
      {localData.education?.map((edu, index) => (
        <Card key={edu.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">Education {index + 1}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newEdu = localData.education?.filter((_, i) => i !== index) || [];
                  setLocalData({ ...localData, education: newEdu });
                }}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => {
                    const newEdu = [...(localData.education || [])];
                    newEdu[index] = { ...edu, degree: e.target.value };
                    setLocalData({ ...localData, education: newEdu });
                  }}
                  placeholder="e.g., Bachelor of Science"
                />
              </div>
              <div>
                <Label>School</Label>
                <Input
                  value={edu.school}
                  onChange={(e) => {
                    const newEdu = [...(localData.education || [])];
                    newEdu[index] = { ...edu, school: e.target.value };
                    setLocalData({ ...localData, education: newEdu });
                  }}
                  placeholder="e.g., University of California"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => {
                    const newEdu = [...(localData.education || [])];
                    newEdu[index] = { ...edu, startDate: e.target.value };
                    setLocalData({ ...localData, education: newEdu });
                  }}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => {
                    const newEdu = [...(localData.education || [])];
                    newEdu[index] = { ...edu, endDate: e.target.value };
                    setLocalData({ ...localData, education: newEdu });
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {(!localData.education || localData.education.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <p>No education added yet.</p>
          <p className="text-sm">Click "Add Education" to get started.</p>
        </div>
      )}
    </div>
  );

  const renderSkillsSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Skills</h3>
      
      <div>
        <Label htmlFor="skills">Skills (Enter skills separated by commas)</Label>
        <Textarea
          id="skills"
          value={localData.skills?.join(', ') || ''}
          onChange={(e) => {
            const skillsArray = e.target.value
              .split(',')
              .map(skill => skill.trim())
              .filter(skill => skill.length > 0);
            setLocalData({ ...localData, skills: skillsArray });
          }}
          rows={4}
          placeholder="e.g., JavaScript, React, Node.js, Python, SQL"
        />
      </div>
      
      {localData.skills && localData.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {localData.skills.map((skill, index) => (
            <Badge key={index} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );

  const renderReferencesSection = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">References</h3>
        <Button
          onClick={() => {
            const newRef = {
              id: uuidv4(),
              name: '',
              position: '',
              company: '',
              email: '',
              phone: ''
            };
            setLocalData({
              ...localData,
              references: [...(localData.references || []), newRef]
            });
          }}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Reference
        </Button>
      </div>
      
      {localData.references?.map((ref, index) => (
        <Card key={ref.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">Reference {index + 1}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newRefs = localData.references?.filter((_, i) => i !== index) || [];
                  setLocalData({ ...localData, references: newRefs });
                }}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={ref.name}
                  onChange={(e) => {
                    const newRefs = [...(localData.references || [])];
                    newRefs[index] = { ...ref, name: e.target.value };
                    setLocalData({ ...localData, references: newRefs });
                  }}
                  placeholder="e.g., John Smith"
                />
              </div>
              <div>
                <Label>Position</Label>
                <Input
                  value={ref.position}
                  onChange={(e) => {
                    const newRefs = [...(localData.references || [])];
                    newRefs[index] = { ...ref, position: e.target.value };
                    setLocalData({ ...localData, references: newRefs });
                  }}
                  placeholder="e.g., Senior Manager"
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={ref.company}
                  onChange={(e) => {
                    const newRefs = [...(localData.references || [])];
                    newRefs[index] = { ...ref, company: e.target.value };
                    setLocalData({ ...localData, references: newRefs });
                  }}
                  placeholder="e.g., Google Inc."
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={ref.email}
                  onChange={(e) => {
                    const newRefs = [...(localData.references || [])];
                    newRefs[index] = { ...ref, email: e.target.value };
                    setLocalData({ ...localData, references: newRefs });
                  }}
                  placeholder="john.smith@company.com"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={ref.phone}
                  onChange={(e) => {
                    const newRefs = [...(localData.references || [])];
                    newRefs[index] = { ...ref, phone: e.target.value };
                    setLocalData({ ...localData, references: newRefs });
                  }}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {(!localData.references || localData.references.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <p>No references added yet.</p>
          <p className="text-sm">Click "Add Reference" to get started.</p>
        </div>
      )}
    </div>
  );

  const renderCustomSections = () => {
    // Add custom sections here
  };

  const renderContent = () => {
    switch (sectionType) {
      case 'personalInfo':
        return renderPersonalInfoSection();
      case 'experience':
        return renderExperienceSection();
      case 'education':
        return renderEducationSection();
      case 'skills':
        return renderSkillsSection();
      case 'projects':
        return renderProjectsSection();
      case 'references':
        return renderReferencesSection();
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {sectionTitle}</DialogTitle>
          <DialogDescription>
            Update your {sectionTitle.toLowerCase()} information. Use the AI Generate buttons to create professional content automatically.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {renderContent()}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
