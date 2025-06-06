
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Share2, FileText, Palette, Eye, Sparkles, Star, Heart } from 'lucide-react';
import { CVTemplateRenderer } from '@/components/cv/CVTemplateRenderer';
import { cvTemplates } from '@/data/templates';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Preview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cvData, setCVData] = useState(null);
  const [template, setTemplate] = useState('');
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    const storedData = localStorage.getItem('previewCVData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setCVData(parsedData.cvData);
        setTemplate(parsedData.template || 'modern');
        setSections(parsedData.sections || []);
        setIsOwner(true); // If from localStorage, it's the user's CV
      } catch (error) {
        console.error('Error parsing stored CV data:', error);
      } finally {
        setIsLoading(false);
      }
    } else if (id && id !== 'new') {
      fetchCVData(id);
    } else {
      setIsLoading(false);
    }
  }, [id, user]);

  const fetchCVData = async (cvId: string) => {
    setIsLoading(true);
    try {
      // Fetch CV data from Supabase
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

      // Check if current user is the owner
      const currentUserId = user?.id;
      const cvOwnerId = cvDataResponse.user_id;
      setIsOwner(currentUserId === cvOwnerId);
      
      // Set author name
      setAuthorName(cvDataResponse.profiles?.full_name || 'Unknown Author');

      // Parse CV content
      const content = cvDataResponse.content;
      if (content && typeof content === 'object') {
        setCVData(content);
        setTemplate(cvDataResponse.template || 'modern');
        // Extract sections from content or use default sections
        const contentSections = content._sections || ['personalInfo', 'experience', 'education', 'skills'];
        setSections(contentSections);
      } else {
        console.error('Invalid CV content format');
      }
    } catch (error) {
      console.error('Error fetching CV data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentTemplateInfo = cvTemplates.find(t => t.id === template);

  const handleDownload = () => {
    const input = document.getElementById('cv-content');
    if (input) {
      html2canvas(input, { scale: 2, useCORS: true })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save("cv.pdf");
        });
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
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-16">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full floating blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full floating blur-xl" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full floating blur-xl" style={{animationDelay: '4s'}}></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full floating blur-xl" style={{animationDelay: '1s'}}></div>
        </div>

        {/* Enhanced Header */}
        <div className="glass border-b backdrop-blur-xl sticky top-16 z-40 bg-white/60">
          <div className="container mx-auto py-6 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="hover:bg-white/30 group transition-all duration-200 border border-white/20 backdrop-blur-sm"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back
                </Button>
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Sparkles className="h-2 w-2 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                        CV Preview
                      </h1>
                      <p className="text-sm text-gray-600">Professional CV Showcase</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {currentTemplateInfo && (
                      <>
                        <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200 shadow-sm">
                          <Palette className="w-3 h-3 mr-1" />
                          {currentTemplateInfo.name}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-white/50 border-gray-200 shadow-sm">
                          {currentTemplateInfo.category}
                        </Badge>
                      </>
                    )}
                    {!isOwner && authorName && (
                      <Badge variant="outline" className="text-xs bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200 shadow-sm">
                        <Star className="w-3 h-3 mr-1" />
                        by {authorName}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline"
                  onClick={handleDownload}
                  className="hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:scale-105 group"
                >
                  <Download className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                  Download PDF
                </Button>
                
                {isOwner && (
                  <>
                    <Button 
                      variant="outline"
                      className="hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:scale-105 group"
                    >
                      <Share2 className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                      Share
                    </Button>
                    
                    {id && id !== 'new' && (
                      <Button 
                        onClick={() => navigate(`/builder/${id}`)}
                        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 hover:shadow-xl transition-all duration-200 text-white border-0 hover:scale-105 group"
                      >
                        <Palette className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                        Edit CV
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CV Preview */}
        <div className="container mx-auto py-12 px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Stats Bar */}
            {!isOwner && (
              <div className="mb-8 flex items-center justify-center gap-8 text-center">
                <div className="flex items-center gap-2 text-gray-600">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Professional CV</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Public Preview</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Download className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Downloadable</span>
                </div>
              </div>
            )}

            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-3xl transition-all duration-300">
              <CardContent className="p-0">
                <div id="cv-content" className="bg-white">
                  {cvData && sections && sections.length > 0 ? (
                    <CVTemplateRenderer
                      cvData={cvData}
                      templateId={template || 'modern'}
                      sections={sections}
                    />
                  ) : (
                    <div className="text-center py-24 px-8">
                      <div className="relative mb-8">
                        <div className="floating">
                          <FileText className="h-32 w-32 mx-auto text-gray-300" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                        No CV Data Available
                      </h3>
                      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                        This CV doesn't contain any content or the content couldn't be loaded properly.
                      </p>
                      {isOwner && (
                        <Button 
                          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 hover:shadow-xl transition-all duration-200 hover:scale-105"
                          onClick={() => navigate('/templates')}
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Create New CV
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Preview;
