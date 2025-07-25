
import { useCallback, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from '@/hooks/use-toast';

export const usePDFGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = useCallback(async (elementId: string, filename: string = 'cv.pdf') => {
    setIsGenerating(true);
    
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Element not found');
      }

      // Create a temporary container with A4 dimensions
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '794px'; // A4 width in px at 96 DPI
      tempContainer.style.height = '1123px'; // A4 height in px at 96 DPI
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.overflow = 'hidden';
      
      // Clone the element
      const clonedElement = element.cloneNode(true) as HTMLElement;
      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);

      // Generate canvas
      const canvas = await html2canvas(tempContainer, {
        width: 794,
        height: 1123,
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        removeContainer: false,
        foreignObjectRendering: false,
        imageTimeout: 0,
        ignoreElements: () => false,
      });

      // Clean up temp container
      document.body.removeChild(tempContainer);

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [794, 1123],
        compress: true,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, 794, 1123, 'CV', 'FAST');

      // Save PDF
      pdf.save(filename);

      toast({
        title: "PDF Downloaded Successfully",
        description: "Your CV has been downloaded as a PDF.",
      });

    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generatePDF,
    isGenerating,
  };
};
