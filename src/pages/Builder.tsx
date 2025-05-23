
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCV } from '@/hooks/useCV';
import { CVData } from '@/types/cv';
import { ArrowLeft, Save, Plus, User, Briefcase, GraduationCap, Award, FileText, Users } from 'lucide-react';
import { SidebarSection } from '@/components/builder/SidebarSection';
import { CVSection } from '@/components/builder/CVSection';

const Builder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cvData, setCVData, isLoading, isSaving, saveCV } = useCV(id);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [cvSections, setCVSections] = useState([
    'personalInfo',
    'experience', 
    'education'
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading CV...</p>
        </div>
      </div>
    );
  }

  if (id === 'new') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-gradient">Choose a Template</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Please select a template first to start building your CV.
            </p>
            <Button onClick={() => navigate('/templates')} className="w-full bg-gradient">
              Browse Templates
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">CV not found</h2>
          <Button onClick={() => navigate('/dashboard')} className="bg-gradient">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const availableSections = [
    { id: 'personalInfo', title: 'Personal Info', icon: <User className="h-5 w-5" /> },
    { id: 'experience', title: 'Experience', icon: <Briefcase className="h-5 w-5" /> },
    { id: 'education', title: 'Education', icon: <GraduationCap className="h-5 w-5" /> },
    { id: 'skills', title: 'Skills', icon: <Award className="h-5 w-5" /> },
    { id: 'projects', title: 'Projects', icon: <FileText className="h-5 w-5" /> },
    { id: 'references', title: 'References', icon: <Users className="h-5 w-5" /> }
  ];

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSection(sectionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedSection && !cvSections.includes(draggedSection)) {
      setCVSections([...cvSections, draggedSection]);
    }
    setDraggedSection(null);
  };

  const handleSectionEdit = (sectionId: string) => {
    console.log('Edit section:', sectionId);
    // TODO: Open edit modal for the section
  };

  const handleSectionDelete = (sectionId: string) => {
    setCVSections(cvSections.filter(id => id !== sectionId));
  };

  const handleSectionReorder = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    if (draggedSection && draggedSection !== sectionId) {
      const newSections = [...cvSections];
      const draggedIndex = newSections.indexOf(draggedSection);
      const targetIndex = newSections.indexOf(sectionId);
      
      newSections.splice(draggedIndex, 1);
      newSections.splice(targetIndex, 0, draggedSection);
      
      setCVSections(newSections);
    }
    setDraggedSection(null);
  };

  const handleSave = () => {
    saveCV(cvData);
  };

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'personalInfo':
        return (
          <div className="space-y-2">
            <p className="font-medium">{cvData.personalInfo.fullName || 'Your Name'}</p>
            <p className="text-sm text-gray-600">{cvData.personalInfo.email}</p>
            <p className="text-sm text-gray-600">{cvData.personalInfo.phone}</p>
            <p className="text-sm text-gray-600">{cvData.personalInfo.location}</p>
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-3">
            {cvData.experience.length > 0 ? (
              cvData.experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-primary pl-3">
                  <p className="font-medium">{exp.title}</p>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate || 'Present'}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No experience added yet</p>
            )}
          </div>
        );
      case 'education':
        return (
          <div className="space-y-3">
            {cvData.education.length > 0 ? (
              cvData.education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-secondary pl-3">
                  <p className="font-medium">{edu.degree}</p>
                  <p className="text-sm text-gray-600">{edu.school}</p>
                  <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No education added yet</p>
            )}
          </div>
        );
      default:
        return <p className="text-sm text-gray-500">Click edit to add content</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="glass border-b">
        <div className="container mx-auto py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="hover:bg-white/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gradient">CV Builder</h1>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={isSaving} 
              className="bg-gradient hover:shadow-lg transition-all duration-200"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save CV'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-card sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Sections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {availableSections
                  .filter(section => !cvSections.includes(section.id))
                  .map((section) => (
                    <SidebarSection
                      key={section.id}
                      title={section.title}
                      icon={section.icon}
                      onDragStart={(e) => handleDragStart(e, section.id)}
                    />
                  ))}
              </CardContent>
            </Card>
          </div>

          {/* CV Builder Area */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Your CV Structure</CardTitle>
                <p className="text-sm text-gray-600">
                  Drag sections from the sidebar or reorder existing ones
                </p>
              </CardHeader>
              <CardContent>
                <div 
                  className="min-h-[600px] space-y-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-white/30"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {cvSections.map((sectionId) => {
                    const section = availableSections.find(s => s.id === sectionId);
                    return section ? (
                      <CVSection
                        key={sectionId}
                        title={section.title}
                        onEdit={() => handleSectionEdit(sectionId)}
                        onDelete={() => handleSectionDelete(sectionId)}
                        onDragStart={(e) => handleDragStart(e, sectionId)}
                      >
                        {renderSectionContent(sectionId)}
                      </CVSection>
                    ) : null;
                  })}
                  
                  {cvSections.length === 0 && (
                    <div className="text-center py-16">
                      <div className="text-gray-400 mb-4">
                        <FileText className="h-16 w-16 mx-auto" />
                      </div>
                      <p className="text-gray-500">
                        Drag sections here to start building your CV
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <Card className="glass-card sticky top-8">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-6 shadow-inner min-h-[600px] space-y-6">
                  {cvSections.map((sectionId) => {
                    const section = availableSections.find(s => s.id === sectionId);
                    return section ? (
                      <div key={sectionId} className="animate-fade-in">
                        <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-3 border-b border-gray-200 pb-1">
                          {section.title}
                        </h3>
                        {renderSectionContent(sectionId)}
                      </div>
                    ) : null;
                  })}
                  
                  {cvSections.length === 0 && (
                    <div className="text-center text-gray-400 py-16">
                      <p>Your CV preview will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
