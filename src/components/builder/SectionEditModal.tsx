import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, X } from 'lucide-react';
import { CVData } from '@/types/cv';

interface SectionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionType: string;
  sectionTitle: string;
  cvData: CVData;
  onSave: (updatedData: CVData) => void;
}

export const SectionEditModal: React.FC<SectionEditModalProps> = ({
  isOpen,
  onClose,
  sectionType,
  sectionTitle,
  cvData,
  onSave
}) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (sectionType === 'personalInfo') {
      setFormData(cvData.personalInfo || {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: ''
      });
    } else if (sectionType === 'experience') {
      setFormData(Array.isArray(cvData.experience) ? cvData.experience : []);
    } else if (sectionType === 'education') {
      setFormData(Array.isArray(cvData.education) ? cvData.education : []);
    } else if (sectionType === 'skills') {
      setFormData(Array.isArray(cvData.skills) ? cvData.skills : []);
    } else if (sectionType === 'projects') {
      setFormData(Array.isArray(cvData.projects) ? cvData.projects : []);
    } else if (sectionType === 'references') {
      setFormData(Array.isArray(cvData.references) ? cvData.references : []);
    }
  }, [sectionType, cvData, isOpen]);

  const handleSave = () => {
    const updatedCVData = { ...cvData };
    
    if (sectionType === 'personalInfo') {
      updatedCVData.personalInfo = formData;
    } else if (sectionType === 'experience') {
      updatedCVData.experience = formData;
    } else if (sectionType === 'education') {
      updatedCVData.education = formData;
    } else if (sectionType === 'skills') {
      updatedCVData.skills = formData;
    } else if (sectionType === 'projects') {
      updatedCVData.projects = formData;
    } else if (sectionType === 'references') {
      updatedCVData.references = formData;
    }
    
    onSave(updatedCVData);
    onClose();
  };

  const addExperienceItem = () => {
    const currentExperience = Array.isArray(formData) ? formData : [];
    const newItem = {
      id: Date.now().toString(),
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setFormData([...currentExperience, newItem]);
  };

  const addEducationItem = () => {
    const currentEducation = Array.isArray(formData) ? formData : [];
    const newItem = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      startDate: '',
      endDate: ''
    };
    setFormData([...currentEducation, newItem]);
  };

  const addSkill = () => {
    const currentSkills = Array.isArray(formData) ? formData : [];
    setFormData([...currentSkills, '']);
  };

  const addProjectItem = () => {
    const currentProjects = Array.isArray(formData) ? formData : [];
    const newItem = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: '',
      link: '',
      startDate: '',
      endDate: ''
    };
    setFormData([...currentProjects, newItem]);
  };

  const addReferenceItem = () => {
    const currentReferences = Array.isArray(formData) ? formData : [];
    const newItem = {
      id: Date.now().toString(),
      name: '',
      position: '',
      company: '',
      email: '',
      phone: ''
    };
    setFormData([...currentReferences, newItem]);
  };

  const updateExperienceItem = (index: number, field: string, value: string) => {
    const currentExperience = Array.isArray(formData) ? formData : [];
    const updated = [...currentExperience];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(updated);
  };

  const updateEducationItem = (index: number, field: string, value: string) => {
    const currentEducation = Array.isArray(formData) ? formData : [];
    const updated = [...currentEducation];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(updated);
  };

  const updateSkill = (index: number, value: string) => {
    const currentSkills = Array.isArray(formData) ? formData : [];
    const updated = [...currentSkills];
    updated[index] = value;
    setFormData(updated);
  };

  const updateProjectItem = (index: number, field: string, value: string) => {
    const currentProjects = Array.isArray(formData) ? formData : [];
    const updated = [...currentProjects];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(updated);
  };

  const updateReferenceItem = (index: number, field: string, value: string) => {
    const currentReferences = Array.isArray(formData) ? formData : [];
    const updated = [...currentReferences];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(updated);
  };

  const removeItem = (index: number) => {
    const currentData = Array.isArray(formData) ? formData : [];
    const updated = currentData.filter((_: any, i: number) => i !== index);
    setFormData(updated);
  };

  const renderPersonalInfoForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={formData.fullName || ''}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          placeholder="Enter your full name"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter your email"
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone || ''}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Enter your phone number"
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location || ''}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Enter your location"
        />
      </div>
      <div>
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          value={formData.summary || ''}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          placeholder="Enter a brief summary about yourself"
          rows={4}
        />
      </div>
    </div>
  );

  const renderExperienceForm = () => {
    const experienceArray = Array.isArray(formData) ? formData : [];
    
    return (
      <div className="space-y-6">
        {experienceArray.map((exp: any, index: number) => (
          <div key={exp.id || index} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Experience {index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Job Title</Label>
                <Input
                  value={exp.title || ''}
                  onChange={(e) => updateExperienceItem(index, 'title', e.target.value)}
                  placeholder="Job title"
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={exp.company || ''}
                  onChange={(e) => updateExperienceItem(index, 'company', e.target.value)}
                  placeholder="Company name"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  value={exp.startDate || ''}
                  onChange={(e) => updateExperienceItem(index, 'startDate', e.target.value)}
                  placeholder="MM/YYYY"
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  value={exp.endDate || ''}
                  onChange={(e) => updateExperienceItem(index, 'endDate', e.target.value)}
                  placeholder="MM/YYYY or Present"
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={exp.description || ''}
                onChange={(e) => updateExperienceItem(index, 'description', e.target.value)}
                placeholder="Describe your role and achievements"
                rows={3}
              />
            </div>
          </div>
        ))}
        <Button onClick={addExperienceItem} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>
    );
  };

  const renderEducationForm = () => {
    const educationArray = Array.isArray(formData) ? formData : [];
    
    return (
      <div className="space-y-6">
        {educationArray.map((edu: any, index: number) => (
          <div key={edu.id || index} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Education {index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Degree</Label>
                <Input
                  value={edu.degree || ''}
                  onChange={(e) => updateEducationItem(index, 'degree', e.target.value)}
                  placeholder="Degree name"
                />
              </div>
              <div>
                <Label>School</Label>
                <Input
                  value={edu.school || ''}
                  onChange={(e) => updateEducationItem(index, 'school', e.target.value)}
                  placeholder="School/University name"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  value={edu.startDate || ''}
                  onChange={(e) => updateEducationItem(index, 'startDate', e.target.value)}
                  placeholder="MM/YYYY"
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  value={edu.endDate || ''}
                  onChange={(e) => updateEducationItem(index, 'endDate', e.target.value)}
                  placeholder="MM/YYYY"
                />
              </div>
            </div>
          </div>
        ))}
        <Button onClick={addEducationItem} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>
    );
  };

  const renderSkillsForm = () => {
    const skillsArray = Array.isArray(formData) ? formData : [];
    
    return (
      <div className="space-y-4">
        {skillsArray.map((skill: string, index: number) => (
          <div key={index} className="flex gap-2">
            <Input
              value={skill || ''}
              onChange={(e) => updateSkill(index, e.target.value)}
              placeholder="Enter a skill"
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button onClick={addSkill} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>
    );
  };

  const renderProjectsForm = () => {
    const projectsArray = Array.isArray(formData) ? formData : [];
    
    return (
      <div className="space-y-6">
        {projectsArray.map((project: any, index: number) => (
          <div key={project.id || index} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Project {index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Project Name</Label>
                <Input
                  value={project.name || ''}
                  onChange={(e) => updateProjectItem(index, 'name', e.target.value)}
                  placeholder="Project name"
                />
              </div>
              <div>
                <Label>Link</Label>
                <Input
                  value={project.link || ''}
                  onChange={(e) => updateProjectItem(index, 'link', e.target.value)}
                  placeholder="Project URL"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  value={project.startDate || ''}
                  onChange={(e) => updateProjectItem(index, 'startDate', e.target.value)}
                  placeholder="MM/YYYY"
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  value={project.endDate || ''}
                  onChange={(e) => updateProjectItem(index, 'endDate', e.target.value)}
                  placeholder="MM/YYYY or Present"
                />
              </div>
            </div>
            <div>
              <Label>Technologies</Label>
              <Input
                value={project.technologies || ''}
                onChange={(e) => updateProjectItem(index, 'technologies', e.target.value)}
                placeholder="React, Node.js, MongoDB"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={project.description || ''}
                onChange={(e) => updateProjectItem(index, 'description', e.target.value)}
                placeholder="Describe the project and your role"
                rows={3}
              />
            </div>
          </div>
        ))}
        <Button onClick={addProjectItem} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>
    );
  };

  const renderReferencesForm = () => {
    const referencesArray = Array.isArray(formData) ? formData : [];
    
    return (
      <div className="space-y-6">
        {referencesArray.map((reference: any, index: number) => (
          <div key={reference.id || index} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Reference {index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={reference.name || ''}
                  onChange={(e) => updateReferenceItem(index, 'name', e.target.value)}
                  placeholder="Reference name"
                />
              </div>
              <div>
                <Label>Position</Label>
                <Input
                  value={reference.position || ''}
                  onChange={(e) => updateReferenceItem(index, 'position', e.target.value)}
                  placeholder="Job title"
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={reference.company || ''}
                  onChange={(e) => updateReferenceItem(index, 'company', e.target.value)}
                  placeholder="Company name"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={reference.email || ''}
                  onChange={(e) => updateReferenceItem(index, 'email', e.target.value)}
                  placeholder="Email address"
                />
              </div>
              <div className="col-span-2">
                <Label>Phone</Label>
                <Input
                  value={reference.phone || ''}
                  onChange={(e) => updateReferenceItem(index, 'phone', e.target.value)}
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>
        ))}
        <Button onClick={addReferenceItem} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Reference
        </Button>
      </div>
    );
  };

  const renderForm = () => {
    switch (sectionType) {
      case 'personalInfo':
        return renderPersonalInfoForm();
      case 'experience':
        return renderExperienceForm();
      case 'education':
        return renderEducationForm();
      case 'skills':
        return renderSkillsForm();
      case 'projects':
        return renderProjectsForm();
      case 'references':
        return renderReferencesForm();
      default:
        return <p>Section editing coming soon...</p>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Edit {sectionTitle}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {renderForm()}
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
