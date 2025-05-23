
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useCV } from '@/hooks/useCV';
import { CVData } from '@/types/cv';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Builder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cvData, setCVData, isLoading, isSaving, saveCV } = useCV(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading CV...</p>
        </div>
      </div>
    );
  }

  if (id === 'new') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Choose a Template</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Please select a template first to start building your CV.
            </p>
            <Button onClick={() => navigate('/templates')} className="w-full">
              Browse Templates
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">CV not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const updatePersonalInfo = (field: string, value: string) => {
    setCVData({
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        [field]: value
      }
    });
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setCVData({
      ...cvData,
      experience: [...cvData.experience, newExperience]
    });
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setCVData({
      ...cvData,
      experience: cvData.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const removeExperience = (id: string) => {
    setCVData({
      ...cvData,
      experience: cvData.experience.filter(exp => exp.id !== id)
    });
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      startDate: '',
      endDate: ''
    };
    setCVData({
      ...cvData,
      education: [...cvData.education, newEducation]
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setCVData({
      ...cvData,
      education: cvData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const removeEducation = (id: string) => {
    setCVData({
      ...cvData,
      education: cvData.education.filter(edu => edu.id !== id)
    });
  };

  const handleSave = () => {
    saveCV(cvData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">CV Builder</h1>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save CV'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={cvData.personalInfo.fullName}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={cvData.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={cvData.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={cvData.personalInfo.location}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    value={cvData.personalInfo.summary}
                    onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Work Experience</CardTitle>
                <Button onClick={addExperience} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {cvData.experience.map((exp, index) => (
                  <div key={exp.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm text-gray-500">Experience {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(exp.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Job Title</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Education</CardTitle>
                <Button onClick={addEducation} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {cvData.education.map((edu, index) => (
                  <div key={edu.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm text-gray-500">Education {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(edu.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>School</Label>
                        <Input
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-8">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg p-6 min-h-[800px]">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">{cvData.personalInfo.fullName || 'Your Name'}</h1>
                    <div className="text-gray-600 mt-2 space-y-1">
                      {cvData.personalInfo.email && <p>{cvData.personalInfo.email}</p>}
                      {cvData.personalInfo.phone && <p>{cvData.personalInfo.phone}</p>}
                      {cvData.personalInfo.location && <p>{cvData.personalInfo.location}</p>}
                    </div>
                  </div>

                  {cvData.personalInfo.summary && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-2 border-b pb-1">Professional Summary</h2>
                      <p className="text-gray-700">{cvData.personalInfo.summary}</p>
                    </div>
                  )}

                  {cvData.experience.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-3 border-b pb-1">Work Experience</h2>
                      {cvData.experience.map((exp) => (
                        <div key={exp.id} className="mb-4">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-medium">{exp.title}</h3>
                            <span className="text-sm text-gray-500">
                              {exp.startDate} - {exp.endDate || 'Present'}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{exp.company}</p>
                          {exp.description && <p className="text-sm text-gray-700">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {cvData.education.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-3 border-b pb-1">Education</h2>
                      {cvData.education.map((edu) => (
                        <div key={edu.id} className="mb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{edu.degree}</h3>
                              <p className="text-gray-600">{edu.school}</p>
                            </div>
                            <span className="text-sm text-gray-500">
                              {edu.startDate} - {edu.endDate}
                            </span>
                          </div>
                        </div>
                      ))}
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
