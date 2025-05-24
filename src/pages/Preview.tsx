
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, LayoutTemplate, Edit, Maximize2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { CVData } from '@/types/cv';

type PreviewData = {
  cvData: CVData;
  template: string;
  sections: string[];
};

const Preview = () => {
  const navigate = useNavigate();
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  useEffect(() => {
    // Load CV data from localStorage
    const savedData = localStorage.getItem('previewCVData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setPreviewData(parsedData);
      } catch (error) {
        toast({
          title: "Error Loading CV",
          description: "Could not load your CV data.",
          variant: "destructive"
        });
        navigate('/dashboard');
      }
    } else {
      // If no data, redirect back to dashboard
      toast({
        title: "No CV Data",
        description: "Please create your CV first.",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [navigate]);
  
  // Template specific classes
  const templateStyles = {
    classic: "font-serif",
    modern: "font-sans",
    minimal: "font-sans tracking-wide",
    creative: "font-sans text-primary",
    executive: "font-serif tracking-tight",
    tech: "font-mono",
    artistic: "font-sans",
    corporate: "font-serif",
    startup: "font-sans"
  };
  
  const templateColors = {
    classic: "border-gray-300",
    modern: "border-blue-500",
    minimal: "border-gray-200",
    creative: "border-purple-500",
    executive: "border-slate-700",
    tech: "border-emerald-500",
    artistic: "border-orange-500",
    corporate: "border-indigo-500",
    startup: "border-orange-500"
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
    navigate(-1); // Go back to builder
  };
  
  if (!previewData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading CV data...</h2>
          <p className="text-muted-foreground">If this takes too long, try going back to the dashboard.</p>
          <Button onClick={() => navigate('/dashboard')} variant="outline" className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  const { cvData, template, sections } = previewData;
  
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'personalInfo':
        return (
          <div className="space-y-2">
            <div>
              <div className={`text-xl font-bold ${template === 'creative' ? 'text-purple-600' : ''}`}>
                {cvData.personalInfo.fullName || 'Your Name'}
              </div>
              <div className="text-muted-foreground text-sm">
                {cvData.personalInfo.email} • {cvData.personalInfo.phone} • {cvData.personalInfo.location}
              </div>
            </div>
            {cvData.personalInfo.summary && (
              <p className="text-sm">{cvData.personalInfo.summary}</p>
            )}
          </div>
        );
        
      case 'experience':
        return (
          <div className="space-y-3">
            {cvData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between">
                  <span className={`font-medium ${template === 'tech' ? 'text-emerald-600' : ''}`}>
                    {exp.company}
                  </span>
                  <span className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate || 'Present'}</span>
                </div>
                <div className="text-sm italic">{exp.title}</div>
                {exp.description && <p className="text-sm">{exp.description}</p>}
              </div>
            ))}
          </div>
        );
        
      case 'education':
        return (
          <div className="space-y-3">
            {cvData.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between">
                  <span className={`font-medium ${template === 'executive' ? 'text-slate-700' : ''}`}>
                    {edu.school}
                  </span>
                  <span className="text-xs text-muted-foreground">{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="text-sm italic">{edu.degree}</div>
              </div>
            ))}
          </div>
        );
        
      case 'skills':
        return (
          <div className="flex flex-wrap gap-2">
            {cvData.skills.map((skill, index) => (
              <span 
                key={index} 
                className={`text-sm ${
                  template === 'creative' ? 'bg-purple-100 text-purple-800' : 
                  template === 'tech' ? 'bg-emerald-100 text-emerald-800' : 
                  'bg-muted'
                } px-2 py-1 rounded-full`}
              >
                {skill}
              </span>
            ))}
          </div>
        );
        
      default:
        return null;
    }
  };

  const getSectionTitle = (sectionId: string) => {
    const titles = {
      personalInfo: 'Personal Information',
      experience: 'Work Experience',
      education: 'Education',
      skills: 'Skills',
      projects: 'Projects',
      references: 'References'
    };
    return titles[sectionId as keyof typeof titles] || sectionId;
  };

  return (
    <div className={`min-h-screen flex flex-col bg-background ${isFullScreen ? 'p-0' : ''}`}>
      {/* Top navigation - hide in fullscreen mode */}
      {!isFullScreen && (
        <header className="border-b bg-background/90 backdrop-blur-md fixed top-0 w-full z-50">
          <div className="flex items-center justify-between py-4 px-6">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" className="mr-2" onClick={handleEdit}>
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
                  <FileText className="h-4 w-4" />
                  Download CV
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
            {sections.map((sectionId) => (
              <div key={sectionId} className="mb-6">
                <h3 className={`font-bold text-lg ${template === 'minimal' ? '' : 'border-b'} pb-1 mb-3`}>
                  {getSectionTitle(sectionId)}
                </h3>
                {renderSectionContent(sectionId)}
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
