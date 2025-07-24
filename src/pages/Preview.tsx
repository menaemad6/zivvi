import React, { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import type { CVData } from '@/types/cv';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Share2, FileText, Palette, Eye, Sparkles, Star, Heart, Edit } from 'lucide-react';
import { MultiPageCVRenderer } from '@/components/cv/MultiPageCVRenderer';
import { PDFGenerator } from '@/components/cv/PDFGenerator';
import { cvTemplates } from '@/data/templates';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/hooks/useAnalytics';
import { LOGO_NAME, WEBSITE_URL } from "@/lib/constants";
import Joyride, { CallBackProps as JoyrideCallBackProps } from 'react-joyride';

const Preview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trackCVView, trackCVDownload, trackCVShare } = useAnalytics();
  const [cvData, setCVData] = useState<Partial<CVData> | null>(null);
  const [template, setTemplate] = useState<string>('');
  const [sections, setSections] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [authorName, setAuthorName] = useState<string>('');
  const [cvName, setCVName] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(1);
  const lastTrackedCVId = useRef<string | null>(null);
  const location = useLocation();
  const [joyrideRun, setJoyrideRun] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('startPreviewDemo')) {
      setJoyrideRun(true);
    }
  }, [location]);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchCVData(id);
      localStorage.removeItem('previewCVData');
    } else {
      const storedData = localStorage.getItem('previewCVData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setCVData(parsedData.cvData);
          setTemplate(parsedData.template || 'modern');
          setSections(parsedData.sections || []);
          setIsOwner(true);
        } catch (error) {
          console.error('Error parsing stored CV data:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
  }, [id, user]);

  const fetchCVData = async (cvId: string) => {
    setIsLoading(true);
    try {
      const { data: cvDataResponse, error } = await supabase
        .from('cvs')
        .select(`
          *,
          profiles!cvs_user_id_fkey (
            full_name
          )
        `)
        .eq('id', cvId)
        .single();

      if (error || !cvDataResponse) {
        console.error('Error fetching CV data:', error);
        setIsLoading(false);
        return;
      }

      const currentUserId = user?.id;
      const cvOwnerId = cvDataResponse.user_id;
      setIsOwner(currentUserId === cvOwnerId);
      
      setAuthorName(cvDataResponse.profiles?.full_name || 'Unknown Author');
      setCVName(cvDataResponse.name || '');

      const content = cvDataResponse.content;
      if (content && typeof content === 'object' && !Array.isArray(content)) {
        setCVData(content);
        setTemplate(cvDataResponse.template || 'modern');
        const contentWithSections = content as { [key: string]: unknown };
        let contentSections: string[] = ['personalInfo', 'experience', 'education', 'skills', 'projects', 'references'];
        if (
          '_sections' in contentWithSections &&
          Array.isArray((contentWithSections as { _sections?: unknown })._sections)
        ) {
          contentSections = (contentWithSections as { _sections: unknown })._sections as string[];
        }
        setSections(contentSections);
      } else {
        console.error('Invalid CV content format');
      }

      if (cvId && lastTrackedCVId.current !== cvId) {
        trackCVView(cvId, {
          template: cvDataResponse.template,
          isOwner: currentUserId === cvOwnerId,
          viewerType: currentUserId ? 'authenticated' : 'anonymous'
        });
        lastTrackedCVId.current = cvId;
      }
    } catch (error) {
      console.error('Error fetching CV data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentTemplateInfo = cvTemplates.find(t => t.id === template);

  const handleShare = async () => {
    if (!id || id === 'new') {
      toast({
        title: "Cannot Share",
        description: "This CV cannot be shared.",
        variant: "destructive"
      });
      return;
    }

    const shareUrl = `${window.location.origin}/preview/${id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: cvName || 'CV',
          text: 'Check out this CV',
          url: shareUrl,
        });
        
        trackCVShare(id, 'native', { shareUrl, cvName });
      } catch (error) {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied",
          description: "CV link has been copied to clipboard."
        });
        
        trackCVShare(id, 'clipboard', { shareUrl, cvName });
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "CV link has been copied to clipboard."
      });
      
      trackCVShare(id, 'clipboard', { shareUrl, cvName });
    }
  };

  const handlePDFDownload = () => {
    if (id && id !== 'new') {
      trackCVDownload(id, 'pdf', { 
        fileName: cvName ? `${cvName}.pdf` : 'cv.pdf', 
        template,
        isOwner,
        pages: totalPages
      });
    }
  };

  const joyrideSteps = [
    {
      target: '.btn-download-cv',
      content: 'Download or print your CV here!',
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = (data: JoyrideCallBackProps) => {
    if (data.status === 'finished' || data.status === 'skipped') {
      setJoyrideRun(false);
      navigate(`/preview/${id}`, { replace: true });
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-purple-200 border-b-purple-600 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading CV</h3>
            <p className="text-gray-600">Preparing your preview...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{LOGO_NAME} | CV Preview</title>
        <meta name="description" content="Preview your professional CV before downloading or sharing. See your resume in a modern, optimized format." />
        <meta property="og:title" content={`${LOGO_NAME} CV Preview`} />
        <meta property="og:description" content="Preview your professional CV before downloading or sharing. See your resume in a modern, optimized format." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${WEBSITE_URL}/preview`} />
        <meta property="og:image" content="/zivvi-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${LOGO_NAME} CV Preview | ${WEBSITE_URL}`} />
        <meta name="twitter:description" content="Preview your professional CV before downloading or sharing. See your resume in a modern, optimized format." />
        <meta name="twitter:image" content="/zivvi-logo.png" />
      </Helmet>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full floating blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full floating blur-xl" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full floating blur-xl" style={{animationDelay: '4s'}}></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full floating blur-xl" style={{animationDelay: '1s'}}></div>
        </div>

        {/* Fixed Header */}
        <div className="fixed top-16 left-0 right-0 bg-white/90 backdrop-blur-2xl border-b border-gray-200/50 shadow-xl z-30">
          <div className="container mx-auto py-2 px-4 sm:px-6">
            <div className="flex items-center justify-between">
              {/* Left Section */}
              <div className="flex items-center gap-2 sm:gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="border border-gray-300 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-300 px-2 sm:px-3 py-1 h-7 text-xs sm:text-sm"
                >
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
                {/* Title Section */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md ring-1 ring-white/50 relative">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Sparkles className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-white" />
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                      {cvName || 'CV Preview'}
                    </h1>
                    <div className="flex items-center gap-2 mt-0.5">
                      {currentTemplateInfo && (
                        <>
                          <Badge className="bg-blue-50 text-blue-700 border-blue-200 shadow-sm px-2 py-0.5 text-xs font-semibold">
                            <Palette className="w-3 h-3 mr-1" />
                            {currentTemplateInfo.name}
                          </Badge>
                          <Badge variant="outline" className="border border-gray-300 px-2 py-0.5 text-xs">
                            {currentTemplateInfo.category}
                          </Badge>
                        </>
                      )}
                      {totalPages > 1 && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-2 py-0.5 text-xs">
                          {totalPages} pages
                        </Badge>
                      )}
                      {!isOwner && authorName && (
                        <Badge variant="outline" className="bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200 shadow-sm px-2 py-0.5 text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          by {authorName}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {/* Mobile Title */}
                  <div className="sm:hidden">
                    <h1 className="text-sm font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                      {cvName || 'CV Preview'}
                    </h1>
                  </div>
                </div>
              </div>
              {/* Right Section */}
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/print/${id}`)}
                  className="btn-download-cv border border-gray-300 hover:border-green-500 hover:bg-green-50 rounded-md px-2 py-1 h-7 text-xs"
                  title="Print CV"
                >
                  <FileText className="h-3 w-3 sm:mr-1" />
                  <span className="hidden sm:inline">Print</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="border border-gray-300 hover:border-blue-500 hover:bg-blue-50 rounded-md px-2 py-1 h-7 text-xs"
                  title="Share"
                >
                  <Share2 className="h-3 w-3 sm:mr-1" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
                {isOwner && id && id !== 'new' && (
                  <Button
                    onClick={() => navigate(`/builder/${id}`)}
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-300 px-2 sm:px-3 py-1 h-7 text-xs border-0"
                  >
                    <Edit className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline">Edit CV</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Download PDF Button */}
        <div className="fixed top-28 right-4 z-20">
          {cvData && (
            <PDFGenerator
              cvData={cvData}
              templateId={template}
              sections={sections}
              fileName={cvName ? `${cvName}.pdf` : 'cv.pdf'}
              onDownload={handlePDFDownload}
            />
          )}
        </div>

        {/* CV Preview Container */}
        <div className="flex flex-col items-center justify-center min-h-screen pt-16 pb-8">
          <div className="w-full max-w-4xl px-4">
            <div className="flex justify-center">
              <div className="transform-gpu" style={{ transformOrigin: 'center top' }}>
                {cvData && (
                  <MultiPageCVRenderer
                    cvData={cvData}
                    templateId={template}
                    sections={sections}
                    onPagesChange={setTotalPages}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Joyride
        steps={joyrideSteps}
        run={joyrideRun}
        continuous
        showSkipButton
        showProgress
        callback={handleJoyrideCallback}
        styles={{ options: { zIndex: 10000 } }}
      />
    </>
  );
};

export default Preview;
