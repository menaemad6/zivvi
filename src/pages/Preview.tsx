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

      const cvData = data.content as unknown as CVData;
      setPreviewData({
        cvData,
        template: data.template || 'modern',
        sections: ['personalInfo', 'experience', 'education', 'skills', 'projects', 'references'],
        cvId: id
      });

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

  const renderTemplateContent = (template: string, cvData: CVData) => {
    switch (template) {
      case 'modern':
        return (
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden max-w-4xl mx-auto">
            {/* Header with diagonal split */}
            <div className="relative bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
              <h1 className="text-4xl font-bold mb-2">{cvData.personalInfo.fullName || 'Your Name'}</h1>
              <p className="text-xl opacity-90">{cvData.personalInfo.email} • {cvData.personalInfo.phone}</p>
              {cvData.personalInfo.summary && <p className="mt-4 text-lg">{cvData.personalInfo.summary}</p>}
            </div>
            
            <div className="grid grid-cols-3 gap-8 p-8">
              <div className="col-span-2 space-y-6">
                {/* Experience */}
                <section>
                  <h2 className="text-2xl font-bold text-blue-600 border-b-2 border-blue-200 pb-2 mb-4">Experience</h2>
                  {cvData.experience.map((exp) => (
                    <div key={exp.id} className="mb-6 pl-4 border-l-4 border-blue-500">
                      <h3 className="font-semibold text-lg">{exp.title}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                      <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate || 'Present'}</p>
                      {exp.description && <p className="mt-2 text-gray-700">{exp.description}</p>}
                    </div>
                  ))}
                </section>
              </div>
              
              <div className="space-y-6">
                {/* Skills in circular badges */}
                <section>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {cvData.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
                
                {/* Education */}
                <section>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Education</h2>
                  {cvData.education.map((edu) => (
                    <div key={edu.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p className="text-blue-600">{edu.school}</p>
                      <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                    </div>
                  ))}
                </section>
              </div>
            </div>
          </div>
        );

      case 'classic':
        return (
          <div className="bg-white shadow-lg border max-w-5xl mx-auto">
            {/* Traditional header */}
            <div className="border-b-4 border-gray-700 p-6 text-center">
              <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">{cvData.personalInfo.fullName || 'Your Name'}</h1>
              <p className="text-gray-600">{cvData.personalInfo.email} | {cvData.personalInfo.phone} | {cvData.personalInfo.location}</p>
              {cvData.personalInfo.summary && (
                <p className="mt-4 text-gray-700 max-w-3xl mx-auto">{cvData.personalInfo.summary}</p>
              )}
            </div>
            
            {/* Two column layout */}
            <div className="grid grid-cols-4 gap-0">
              <div className="col-span-3 p-6 space-y-6">
                {/* Professional Experience */}
                <section>
                  <h2 className="text-xl font-serif font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4 uppercase tracking-wide">
                    Professional Experience
                  </h2>
                  {cvData.experience.map((exp) => (
                    <div key={exp.id} className="mb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-serif font-semibold text-lg">{exp.title}</h3>
                          <p className="font-medium text-gray-700">{exp.company}</p>
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {exp.startDate} - {exp.endDate || 'Present'}
                        </span>
                      </div>
                      {exp.description && <p className="text-gray-700 leading-relaxed">{exp.description}</p>}
                    </div>
                  ))}
                </section>

                {/* Projects */}
                {cvData.projects && cvData.projects.length > 0 && (
                  <section>
                    <h2 className="text-xl font-serif font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4 uppercase tracking-wide">
                      Projects
                    </h2>
                    {cvData.projects.map((project) => (
                      <div key={project.id} className="mb-4">
                        <h3 className="font-serif font-semibold">{project.name}</h3>
                        {project.description && <p className="text-gray-700">{project.description}</p>}
                        {project.technologies && <p className="text-sm text-gray-600 italic">Technologies: {project.technologies}</p>}
                      </div>
                    ))}
                  </section>
                )}
              </div>
              
              <div className="bg-gray-50 p-6 space-y-6">
                {/* Education */}
                <section>
                  <h2 className="text-lg font-serif font-bold text-gray-800 border-b border-gray-400 pb-2 mb-4 uppercase tracking-wide">
                    Education
                  </h2>
                  {cvData.education.map((edu) => (
                    <div key={edu.id} className="mb-4">
                      <h3 className="font-serif font-semibold text-sm">{edu.degree}</h3>
                      <p className="text-gray-700 text-sm">{edu.school}</p>
                      <p className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</p>
                    </div>
                  ))}
                </section>
                
                {/* Skills */}
                <section>
                  <h2 className="text-lg font-serif font-bold text-gray-800 border-b border-gray-400 pb-2 mb-4 uppercase tracking-wide">
                    Skills
                  </h2>
                  <div className="space-y-2">
                    {cvData.skills.map((skill, index) => (
                      <div key={index} className="text-sm text-gray-700 border-l-2 border-gray-400 pl-2">
                        {skill}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        );

      case 'creative':
        return (
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden max-w-4xl mx-auto relative">
            {/* Creative curved header */}
            <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white p-8 rounded-tl-3xl rounded-br-3xl mx-4 mt-4 mb-8">
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full"></div>
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-2">{cvData.personalInfo.fullName || 'Your Name'}</h1>
                <div className="bg-white bg-opacity-20 rounded-full px-6 py-2 inline-block">
                  <p className="text-lg">{cvData.personalInfo.email}</p>
                </div>
                {cvData.personalInfo.summary && (
                  <p className="mt-6 text-lg bg-white bg-opacity-10 rounded-2xl p-4">{cvData.personalInfo.summary}</p>
                )}
              </div>
            </div>
            
            {/* Asymmetric grid layout */}
            <div className="px-8 pb-8 space-y-8">
              {/* Experience in creative cards */}
              <section>
                <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">My Journey</h2>
                <div className="space-y-6">
                  {cvData.experience.map((exp, index) => (
                    <div key={exp.id} className={`transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform`}>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-l-8 border-purple-500 shadow-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-purple-800">{exp.title}</h3>
                            <p className="text-pink-600 font-semibold text-lg">{exp.company}</p>
                          </div>
                          <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                            {exp.startDate} - {exp.endDate || 'Present'}
                          </div>
                        </div>
                        {exp.description && <p className="mt-4 text-gray-700">{exp.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Skills in creative bubbles */}
              <section>
                <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">Skills Universe</h2>
                <div className="flex flex-wrap justify-center gap-4">
                  {cvData.skills.map((skill, index) => (
                    <div key={index} className={`transform hover:scale-110 transition-transform ${index % 3 === 0 ? 'bg-purple-500' : index % 3 === 1 ? 'bg-pink-500' : 'bg-orange-500'} text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg`}>
                      {skill}
                    </div>
                  ))}
                </div>
              </section>

              {/* Education in diamond shapes */}
              <section>
                <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">Learning Path</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cvData.education.map((edu) => (
                    <div key={edu.id} className="relative">
                      <div className="bg-gradient-to-br from-orange-100 to-pink-100 p-6 rounded-3xl transform rotate-3 hover:rotate-0 transition-transform shadow-lg">
                        <h3 className="text-xl font-bold text-orange-800">{edu.degree}</h3>
                        <p className="text-pink-700 font-semibold">{edu.school}</p>
                        <p className="text-gray-600 mt-2">{edu.startDate} - {edu.endDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        );

      case 'minimal':
        return (
          <div className="bg-white shadow-sm border border-gray-100 rounded-lg max-w-3xl mx-auto">
            {/* Ultra clean header */}
            <div className="p-12 text-center border-b border-gray-100">
              <h1 className="text-5xl font-light text-gray-900 mb-4 tracking-wide">{cvData.personalInfo.fullName || 'Your Name'}</h1>
              <p className="text-lg text-gray-600 mb-8">{cvData.personalInfo.email} • {cvData.personalInfo.phone}</p>
              {cvData.personalInfo.summary && (
                <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed font-light">{cvData.personalInfo.summary}</p>
              )}
            </div>
            
            <div className="p-12 space-y-16">
              {/* Experience */}
              <section>
                <h2 className="text-3xl font-light text-gray-900 mb-12 tracking-wide">Experience</h2>
                <div className="space-y-12">
                  {cvData.experience.map((exp) => (
                    <div key={exp.id} className="grid grid-cols-4 gap-8">
                      <div className="text-right">
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">
                          {exp.startDate} — {exp.endDate || 'Present'}
                        </p>
                      </div>
                      <div className="col-span-3">
                        <h3 className="text-2xl font-light text-gray-900 mb-2">{exp.title}</h3>
                        <p className="text-lg text-gray-600 mb-4">{exp.company}</p>
                        {exp.description && <p className="text-gray-700 leading-relaxed">{exp.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section>
                <h2 className="text-3xl font-light text-gray-900 mb-12 tracking-wide">Education</h2>
                <div className="space-y-8">
                  {cvData.education.map((edu) => (
                    <div key={edu.id} className="grid grid-cols-4 gap-8">
                      <div className="text-right">
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">
                          {edu.startDate} — {edu.endDate}
                        </p>
                      </div>
                      <div className="col-span-3">
                        <h3 className="text-xl font-light text-gray-900">{edu.degree}</h3>
                        <p className="text-lg text-gray-600">{edu.school}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Skills */}
              <section>
                <h2 className="text-3xl font-light text-gray-900 mb-12 tracking-wide">Skills</h2>
                <div className="grid grid-cols-3 gap-4">
                  {cvData.skills.map((skill, index) => (
                    <div key={index} className="text-center py-4 border border-gray-200 rounded text-gray-700 font-light">
                      {skill}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        );

      case 'executive':
        return (
          <div className="bg-white shadow-2xl border-t-8 border-yellow-400 max-w-5xl mx-auto">
            {/* Executive header with gold accents */}
            <div className="bg-gradient-to-r from-slate-900 to-black text-yellow-400 p-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{cvData.personalInfo.fullName || 'Your Name'}</h1>
                  <p className="text-xl text-yellow-300">{cvData.personalInfo.email} | {cvData.personalInfo.phone}</p>
                </div>
                <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-slate-900">CV</span>
                </div>
              </div>
              {cvData.personalInfo.summary && (
                <div className="mt-6 p-4 bg-slate-800 rounded border-l-4 border-yellow-400">
                  <p className="text-lg text-white">{cvData.personalInfo.summary}</p>
                </div>
              )}
            </div>
            
            <div className="p-8 space-y-8">
              {/* Executive Experience */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 border-b-4 border-yellow-400 pb-2 mb-6">EXECUTIVE EXPERIENCE</h2>
                {cvData.experience.map((exp) => (
                  <div key={exp.id} className="border-l-8 border-yellow-400 pl-6 mb-8 bg-slate-50 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{exp.title}</h3>
                        <p className="text-lg font-semibold text-yellow-600">{exp.company}</p>
                      </div>
                      <div className="bg-yellow-400 text-slate-900 px-4 py-2 rounded font-bold">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </div>
                    </div>
                    {exp.description && <p className="text-slate-700 text-lg leading-relaxed">{exp.description}</p>}
                  </div>
                ))}
              </section>

              {/* Two column layout for other sections */}
              <div className="grid grid-cols-2 gap-8">
                <section>
                  <h2 className="text-xl font-bold text-slate-900 border-b-2 border-yellow-400 pb-2 mb-4">EDUCATION</h2>
                  {cvData.education.map((edu) => (
                    <div key={edu.id} className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                      <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                      <p className="text-yellow-700 font-semibold">{edu.school}</p>
                      <p className="text-slate-600">{edu.startDate} - {edu.endDate}</p>
                    </div>
                  ))}
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 border-b-2 border-yellow-400 pb-2 mb-4">CORE COMPETENCIES</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {cvData.skills.map((skill, index) => (
                      <div key={index} className="bg-slate-900 text-yellow-400 p-3 text-center font-bold text-sm">
                        {skill}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white shadow-xl rounded-lg max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-4">{cvData.personalInfo.fullName || 'Your Name'}</h1>
            <p className="text-gray-600 mb-6">{cvData.personalInfo.email} • {cvData.personalInfo.phone}</p>
            {/* Basic fallback layout */}
          </div>
        );
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
  
  const { cvData, template } = previewData;

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
              <Button variant="outline" onClick={handleFullScreen}>
                <Maximize2 className="h-4 w-4 mr-2" />
                {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </Button>
              
              {isOwner && (
                <Button variant="outline" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit CV
                </Button>
              )}
              
              <Button variant="outline" onClick={handleShare} disabled={!previewData?.cvId}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button variant="secondary" onClick={() => setPageSize(pageSize === 'a4' ? 'letter' : 'a4')}>
                  <LayoutTemplate className="h-4 w-4 mr-2" />
                  {pageSize === 'a4' ? 'A4' : 'Letter'}
                </Button>
                
                <Button variant="default" onClick={handleDownload} disabled={isDownloading}>
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
        <div id="cv-content" className={`${pageSize === 'a4' ? 'w-[210mm] min-h-[297mm]' : 'w-[216mm] min-h-[279mm]'} p-8`}>
          {renderTemplateContent(template, cvData)}
        </div>
        
        {/* Bottom actions */}
        <div className="mt-6 flex space-x-3">
          {isFullScreen && (
            <Button variant="outline" onClick={handleFullScreen}>
              <Maximize2 className="h-4 w-4 mr-2" />
              Exit Fullscreen
            </Button>
          )}
          
          <Button variant="default" onClick={handleDownload} disabled={isDownloading}>
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? 'Generating PDF...' : 'Download PDF'}
          </Button>

          <Button variant="outline" onClick={handleShare} disabled={!previewData?.cvId}>
            <Share2 className="h-4 w-4 mr-2" />
            Share CV
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Preview;
