
import { useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { CVData } from '@/types/cv';

export const usePDFGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfGeneratorRef = useRef<any>(null);

  const generateAndDownloadPDF = async (
    cvData: Partial<CVData>,
    template: string,
    sections: string[],
    fileName: string = 'cv.pdf'
  ) => {
    try {
      setIsGenerating(true);
      
      // Create a temporary container for PDF generation
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '794px';
      tempContainer.style.height = 'auto';
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.fontSize = '14px';
      tempContainer.style.lineHeight = '1.4';
      tempContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      
      document.body.appendChild(tempContainer);

      // Import the PDF generation utility
      const { default: GeneratePdfFromHtml } = await import('@/utils/pdfGeneration/GeneratePdfFromHtml.jsx');
      
      // Create a React root for the temporary container
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(tempContainer);
      
      // Import the template renderer
      const { CVTemplateRenderer } = await import('@/components/cv/CVTemplateRenderer');
      const React = await import('react');
      
      // Render the CV template
      root.render(
        React.createElement(CVTemplateRenderer, {
          cvData,
          templateId: template,
          sections
        })
      );

      // Wait for rendering to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate PDF
      const pdfBlob = await new Promise<Blob>((resolve, reject) => {
        try {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (!context) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Use html2canvas to convert the content to canvas
          import('html2canvas').then(({ default: html2canvas }) => {
            html2canvas(tempContainer, {
              scale: 2,
              useCORS: true,
              backgroundColor: '#ffffff',
              width: 794,
              height: 1123
            }).then(canvas => {
              // Convert canvas to PDF using jsPDF
              import('jspdf').then(({ jsPDF }) => {
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgData = canvas.toDataURL('image/png');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                
                // Convert to blob
                const pdfBlob = pdf.output('blob');
                resolve(pdfBlob);
              });
            }).catch(reject);
          });
        } catch (error) {
          reject(error);
        }
      });

      // Clean up
      root.unmount();
      document.body.removeChild(tempContainer);

      // Download the PDF
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "PDF Downloaded",
        description: "Your CV has been downloaded successfully."
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading your CV. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateAndDownloadPDF
  };
};
