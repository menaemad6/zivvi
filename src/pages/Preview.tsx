import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, LayoutTemplate, Edit, Maximize2, Share2, Eye, Lock } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { CVData } from '@/types/cv';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type PreviewData = {
  cvData: CVData;
  template: string;
  sections: string[];
  cvId?: string;
};

const Preview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isOwner, setIsOwner] = useState(true);
  const [isSharedView, setIsSharedView] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  useEffect(() => {
    const shared = searchParams.get('shared');
    if (shared === 'true' || id) {
      setIsSharedView(true);
      loadSharedCV();
    } else {
      loadLocalCV();
    }
  }, [id, searchParams]);

  const loadSharedCV = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Safely convert the content to CVData type
      const cvData = data.content as unknown as CVData;
      setPreviewData({
        cvData,
        template: data.template || 'modern',
        sections: ['personalInfo', 'experience', 'education', 'skills', 'projects', 'references'],
        cvId: id
      });

      // Check if current user is the owner
      if (user && data.user_id === user.id) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    } catch (error) {
      console.error('Error loading shared CV:', error);
      toast({
        title: "Error Loading CV",
        description: "Could not load the shared CV.",
        variant: "destructive"
      });
    }
  };

  const loadLocalCV = () => {
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
      toast({
        title: "No CV Data",
        description: "Please create your CV first.",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  };
  
  // Template specific layouts and styles
  const getTemplateLayout = (templateId: string) => {
    const layouts = {
      modern: {
        layout: 'single-column',
        headerStyle: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-t-lg',
        sectionStyle: 'border-l-4 border-blue-500 pl-4 mb-6',
        containerStyle: 'max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden'
      },
      classic: {
        layout: 'two-column',
        headerStyle: 'border-b-4 border-gray-700 pb-4 mb-6',
        sectionStyle: 'border-b border-gray-200 pb-4 mb-6',
        containerStyle: 'max-w-5xl mx-auto bg-white shadow-lg border'
      },
      creative: {
        layout: 'asymmetric',
        headerStyle: 'bg-gradient-to-br from-purple-600 to-pink-600 text-white p-8 rounded-tl-3xl rounded-br-3xl',
        sectionStyle: 'bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-4 border-l-4 border-purple-500',
        containerStyle: 'max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden'
      },
      minimal: {
        layout: 'clean',
        headerStyle: 'border-b border-gray-200 pb-6 mb-8',
        sectionStyle: 'mb-8',
        containerStyle: 'max-w-3xl mx-auto bg-white shadow-sm border border-gray-100 rounded-lg'
      },
      executive: {
        layout: 'executive',
        headerStyle: 'bg-gradient-to-r from-slate-900 to-black text-yellow-400 p-8',
        sectionStyle: 'border-l-8 border-yellow-400 pl-6 mb-8 bg-slate-50 p-4',
        containerStyle: 'max-w-5xl mx-auto bg-white shadow-2xl border-t-8 border-yellow-400'
      },
      tech: {
        layout: 'tech-grid',
        headerStyle: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-6 font-mono',
        sectionStyle: 'border border-emerald-200 rounded-lg p-4 mb-4 bg-emerald-50',
        containerStyle: 'max-w-4xl mx-auto bg-white shadow-lg rounded-lg border-2 border-emerald-200'
      },
      artistic: {
        layout: 'creative-flow',
        headerStyle: 'bg-gradient-to-br from-orange-500 to-red-500 text-white p-8 rounded-full mx-8 mt-8 text-center',
        sectionStyle: 'bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-full mb-6 mx-4',
        containerStyle: 'max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden'
      },
      corporate: {
        layout: 'corporate-formal',
        headerStyle: 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white p-6 border-b-4 border-gold-400',
        sectionStyle: 'border-b-2 border-indigo-100 pb-6 mb-6 pl-8',
        containerStyle: 'max-w-5xl mx-auto bg-white shadow-lg border-4 border-indigo-600'
      },
      startup: {
        layout: 'dynamic',
        headerStyle: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 transform -skew-y-1',
        sectionStyle: 'transform hover:scale-105 transition-transform bg-orange-50 p-4 rounded-lg mb-4 border-l-4 border-orange-500',
        containerStyle: 'max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden transform hover:scale-105 transition-transform'
      }
    };
    
    return layouts[templateId as keyof typeof layouts] || layouts.modern;
  };

  // Handle PDF download with real functionality
  const handleDownload = async () => {
    if (!previewData) return;
    
    setIsDownloading(true);
    try {
      const element = document.getElementById('cv-content');
      if (!element) throw new Error('CV content not found');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: pageSize === 'a4' ? 'portrait' : 'portrait',
        unit: 'mm',
        format: pageSize === 'a4' ? 'a4' : 'letter'
      });

      const imgWidth = pageSize === 'a4' ? 210 : 216;
      const pageHeight = pageSize === 'a4' ? 297 : 279;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${previewData.cvData.personalInfo.fullName || 'CV'}_${previewData.template}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "CV Downloaded",
        description: `Your CV has been saved as ${fileName}`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleShare = async () => {
    if (!previewData?.cvId) {
      toast({
        title: "Cannot Share",
        description: "Please save your CV first to generate a shareable link.",
        variant: "destructive"
      });
      return;
    }

    const shareUrl = `${window.location.origin}/preview/${previewData.cvId}?shared=true`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Shareable link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Share Link",
        description: shareUrl,
      });
    }
  };
  
  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  
  const handleEdit = () => {
    if (!isOwner) {
      toast({
        title: "Access Denied",
        description: "You can only view this CV.",
        variant: "destructive"
      });
      return;
    }
    if (previewData?.cvId) {
      navigate(`/builder/${previewData.cvId}`);
    } else {
      navigate(-1);
    }
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
  const templateLayout = getTemplateLayout(template);
  
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'personalInfo':
        return (
          <div className="space-y-3">
            <div>
              <div className={`text-3xl font-bold mb-2 ${template === 'creative' ? 'text-purple-600' : template === 'tech' ? 'text-emerald-600' : ''}`}>
                {cvData.personalInfo.fullName || 'Your Name'}
              </div>
              <div className="text-lg text-muted-foreground">
                {cvData.personalInfo.email} • {cvData.personalInfo.phone} • {cvData.personalInfo.location}
              </div>
            </div>
            {cvData.personalInfo.summary && (
              <p className="text-lg leading-relaxed">{cvData.personalInfo.summary}</p>
            )}
          </div>
        );
        
      case 'experience':
        return (
          <div className="space-y-6">
            {cvData.experience.map((exp) => (
              <div key={exp.id} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-semibold">{exp.title}</h4>
                    <h5 className="text-lg font-medium text-primary">{exp.company}</h5>
                  </div>
                  <span className="text-sm text-muted-foreground bg-gray-100 px-3 py-1 rounded-full">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </span>
                </div>
                {exp.description && <p className="text-gray-700 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        );
        
      case 'education':
        return (
          <div className="space-y-6">
            {cvData.education.map((edu) => (
              <div key={edu.id} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-semibold">{edu.degree}</h4>
                    <h5 className="text-lg font-medium text-primary">{edu.school}</h5>
                  </div>
                  <span className="text-sm text-muted-foreground bg-gray-100 px-3 py-1 rounded-full">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'skills':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {cvData.skills.map((skill, index) => (
              <span 
                key={index} 
                className={`text-center py-2 px-4 rounded-full text-sm font-medium ${
                  template === 'creative' ? 'bg-purple-100 text-purple-800' : 
                  template === 'tech' ? 'bg-emerald-100 text-emerald-800' : 
                  template === 'executive' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            {cvData.projects && cvData.projects.map((project) => (
              <div key={project.id} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-semibold">{project.name}</h4>
                    {project.technologies && (
                      <p className="text-sm text-primary font-medium">{project.technologies}</p>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground bg-gray-100 px-3 py-1 rounded-full">
                    {project.startDate} - {project.endDate || 'Present'}
                  </span>
                </div>
                {project.description && (
                  <p className="text-gray-700 leading-relaxed">{project.description}</p>
                )}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" 
                     className="text-primary hover:underline text-sm">
                    View Project →
                  </a>
                )}
              </div>
            ))}
          </div>
        );

      case 'references':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            {cvData.references && cvData.references.map((reference) => (
              <div key={reference.id} className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold">{reference.name}</h4>
                <p className="text-primary font-medium">{reference.position}</p>
                <p className="text-gray-600">{reference.company}</p>
                <div className="text-sm text-gray-500">
                  <p>{reference.email}</p>
                  {reference.phone && <p>{reference.phone}</p>}
                </div>
              </div>
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
    <div className={`min-h-screen flex flex-col bg-gray-50 ${isFullScreen ? 'p-0' : ''}`}>
      {/* Top navigation */}
      {!isFullScreen && (
        <header className="border-b bg-white/90 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm">
          <div className="flex items-center justify-between py-4 px-6">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" className="mr-2" onClick={() => navigate(isSharedView ? '/' : '/dashboard')}>
                <ArrowLeft className="h-5 w-5 mr-1" />
                {isSharedView ? 'Home' : 'Back to Dashboard'}
              </Button>
              <div className="w-8 h-8 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">CV</span>
              </div>
              <span className="font-bold text-xl">CV Preview</span>
              {!isOwner && (
                <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  <Eye className="h-4 w-4" />
                  View Only
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={handleFullScreen}
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </Button>
              
              {isOwner && (
                <Button 
                  variant="outline" 
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit CV
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={handleShare}
                disabled={!previewData?.cvId}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="secondary" 
                  onClick={() => setPageSize(pageSize === 'a4' ? 'letter' : 'a4')}
                >
                  <LayoutTemplate className="h-4 w-4 mr-2" />
                  {pageSize === 'a4' ? 'A4' : 'Letter'}
                </Button>
                
                <Button 
                  variant="default" 
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isDownloading ? 'Generating...' : 'Download PDF'}
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main content area */}
      <div className={`${isFullScreen ? 'pt-0' : 'pt-20'} flex flex-col items-center justify-center flex-1 p-6`}>
        <div 
          id="cv-content"
          className={`${templateLayout.containerStyle} ${pageSize === 'a4' ? 'w-[210mm] min-h-[297mm]' : 'w-[216mm] min-h-[279mm]'} p-8`}
        >
          {/* Header Section */}
          <div className={templateLayout.headerStyle}>
            {renderSectionContent('personalInfo')}
          </div>

          {/* Content Sections */}
          <div className="p-8 space-y-8">
            {sections.filter(s => s !== 'personalInfo').map((sectionId) => (
              <div key={sectionId} className={templateLayout.sectionStyle}>
                <h3 className="font-bold text-2xl mb-4 text-gray-800">
                  {getSectionTitle(sectionId)}
                </h3>
                {renderSectionContent(sectionId)}
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom actions */}
        <div className="mt-6 flex space-x-3">
          {isFullScreen && (
            <Button 
              variant="outline" 
              onClick={handleFullScreen}
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Exit Fullscreen
            </Button>
          )}
          
          <Button 
            variant="default" 
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? 'Generating PDF...' : 'Download PDF'}
          </Button>

          <Button 
            variant="outline" 
            onClick={handleShare}
            disabled={!previewData?.cvId}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share CV
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Preview;
