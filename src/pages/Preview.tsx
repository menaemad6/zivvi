
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Share2, FileText, Palette, Eye } from 'lucide-react';
import { useCV } from '@/hooks/useCV';
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
        setSections(cvDataResponse.sections || []);
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-600">Loading CV...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
        {/* Header */}
        <div className="glass border-b backdrop-blur-lg sticky top-16 z-40">
          <div className="container mx-auto py-4 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="hover:bg-white/20 group"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back
                </Button>
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <Eye className="h-4 w-4 text-white" />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      CV Preview
                    </h1>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    {currentTemplateInfo && (
                      <>
                        <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          {currentTemplateInfo.name}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {currentTemplateInfo.category}
                        </Badge>
                      </>
                    )}
                    {!isOwner && authorName && (
                      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                        by {authorName}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  onClick={handleDownload}
                  className="hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                
                {isOwner && (
                  <>
                    <Button 
                      variant="outline"
                      className="hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    
                    {id && id !== 'new' && (
                      <Button 
                        onClick={() => navigate(`/builder/${id}`)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transition-all duration-200 text-white border-0"
                      >
                        <Palette className="h-4 w-4 mr-2" />
                        Edit CV
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CV Preview */}
        <div className="container mx-auto py-8 px-6">
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                <div id="cv-content" className="bg-white">
                  {cvData && sections && sections.length > 0 ? (
                    <CVTemplateRenderer
                      cvData={cvData}
                      templateId={template || 'modern'}
                      sections={sections}
                    />
                  ) : (
                    <div className="text-center py-20">
                      <div className="floating">
                        <FileText className="h-24 w-24 mx-auto mb-6 text-gray-300" />
                      </div>
                      <p className="text-xl font-semibold mb-3 text-gray-700">No CV Data Available</p>
                      <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                        This CV doesn't contain any content or the content couldn't be loaded properly.
                      </p>
                      {isOwner && (
                        <Button 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                          onClick={() => navigate('/templates')}
                        >
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
