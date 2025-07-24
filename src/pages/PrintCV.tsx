
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CVTemplateRenderer } from '@/components/cv/CVTemplateRenderer';
import { cvTemplates } from '@/data/templates';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CVData } from '@/types/cv';

const PrintCV = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cvData, setCVData] = useState<Partial<CVData> | null>(null);
  const [template, setTemplate] = useState('');
  const [sections, setSections] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { dismiss } = useToast();

  useEffect(() => {
    if (id && id !== 'new') {
      fetchCVData(id);
    } else {
      // Fallback to localStorage for new/unsaved CVs
      const storedData = localStorage.getItem('previewCVData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setCVData(parsedData.cvData);
          setTemplate(parsedData.template || 'modern');
          setSections(parsedData.sections || []);
        } catch (error) {
          // ignore
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
  }, [id]);

  const fetchCVData = async (cvId: string) => {
    setIsLoading(true);
    try {
      const { data: cvDataResponse, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('id', cvId)
        .single();
      if (error || !cvDataResponse) {
        setIsLoading(false);
        return;
      }
      const content = cvDataResponse.content;
      if (content && typeof content === 'object' && !Array.isArray(content)) {
        setCVData(content as Partial<CVData>);
        setTemplate(cvDataResponse.template || 'modern');
        const contentWithSections = content as any;
        const contentSections = contentWithSections._sections || ['personalInfo', 'experience', 'education', 'skills', 'projects', 'references'];
        setSections(contentSections);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        dismiss(); // Remove all toasts before printing
        window.print();
      }, 1000);
      const handleAfterPrint = () => {
        navigate(`/preview/${id}`);
      };
      window.addEventListener('afterprint', handleAfterPrint);
      return () => {
        window.removeEventListener('afterprint', handleAfterPrint);
      };
    }
  }, [isLoading, id, navigate, dismiss]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="cv-preview-outer" style={{ minHeight: '100vh', background: '#fff' }}>
      <div className="cv-preview-scaler">
        {cvData && sections && sections.length > 0 ? (
          <CVTemplateRenderer
            cvData={cvData}
            templateId={template || 'modern'}
            sections={sections}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <h3>No CV Data Available</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintCV;
