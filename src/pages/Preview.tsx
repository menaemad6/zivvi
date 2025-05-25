import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Share2, FileText, Palette } from 'lucide-react';
import { useCV } from '@/hooks/useCV';
import { CVTemplateRenderer } from '@/components/cv/CVTemplateRenderer';
import { cvTemplates } from '@/data/templates';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Preview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cvData, setCVData] = useState(null);
  const [template, setTemplate] = useState('');
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem('previewCVData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setCVData(parsedData.cvData);
        setTemplate(parsedData.template || 'modern');
        setSections(parsedData.sections || []);
      } catch (error) {
        console.error('Error parsing stored CV data:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id && id !== 'new') {
      // Fetch CV data from Supabase if ID is available
      fetchCVData(id);
    }
  }, [id]);

  const fetchCVData = async (cvId: string) => {
    setIsLoading(true);
    try {
      // Simulate fetching data from Supabase (replace with actual Supabase fetch)
      const response = await fetch(`/api/cv/${cvId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      setCVData(data.cvData);
      setTemplate(data.template || 'modern');
      setSections(data.sections || []);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="glass border-b backdrop-blur-lg">
        <div className="container mx-auto py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="hover:bg-white/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gradient">CV Preview</h1>
                {currentTemplateInfo && (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {currentTemplateInfo.name}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {currentTemplateInfo.category}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                onClick={handleDownload}
                className="hover:shadow-lg transition-all duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              
              <Button 
                variant="outline"
                className="hover:shadow-lg transition-all duration-200"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              {cvId && (
                <Button 
                  onClick={() => navigate(`/builder/${cvId}`)}
                  className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-200 text-white"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Edit CV
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CV Preview */}
      <div className="container mx-auto py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl">
            <CardContent className="p-0">
              <div id="cv-content" className="bg-white">
                {cvData && sections ? (
                  <CVTemplateRenderer
                    cvData={cvData}
                    templateId={template || 'modern'}
                    sections={sections}
                  />
                ) : (
                  <div className="text-center py-20">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2 text-gray-600">No CV Data Available</p>
                    <p className="text-sm text-gray-500">Please build your CV first</p>
                    <Button 
                      className="mt-4"
                      onClick={() => navigate('/templates')}
                    >
                      Create New CV
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Preview;
