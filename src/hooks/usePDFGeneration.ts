// usePdfGeneration 
import { useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { CVData } from '@/types/cv';

export const usePDFGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfGeneratorRef = useRef<unknown>(null);

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

      // Import the template renderer
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(tempContainer);
      
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

      // Generate PDF with multi-page support
      const pdfBlob = await new Promise<Blob>((resolve, reject) => {
        try {
          // Import jsPDF and html2canvas
          Promise.all([
            import('jspdf'),
            import('html2canvas')
          ]).then(([{ jsPDF }, { default: html2canvas }]) => {
            // A4 dimensions in mm
            const a4Width = 210;
            const a4Height = 297;
            
            // Create PDF document
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Get the rendered content height
            const contentHeight = tempContainer.scrollHeight;
            const contentWidth = tempContainer.scrollWidth;
            
            // Calculate scale to fit width to A4
            const scale = a4Width / contentWidth * 2.83; // Convert px to mm (approx 2.83 px per mm)
            
            // Calculate how many pages we need
            const pxPerPage = a4Height / scale * 2.83; // Page height in pixels
            const totalPages = Math.ceil(contentHeight / pxPerPage);
            
            console.log(`Content height: ${contentHeight}px, pages needed: ${totalPages}`);
            
            // Function to add a page to the PDF
            const addPage = async (pageNum: number) => {
              // Calculate the vertical position to capture
              const yPosition = pageNum * pxPerPage;
              
              // Set the container's scroll position
              tempContainer.scrollTop = yPosition;
              
              // Wait for any reflow/repaint
              await new Promise(resolve => setTimeout(resolve, 100));
              
              // Calculate the height to capture for this page
              // Add a larger overlap to prevent content from being cut off
              const overlap = 10; // Increased from 50px to 80px overlap between pages
              const captureHeight = Math.min(pxPerPage + overlap, contentHeight - yPosition);
              
              // Capture this portion of the content
              const canvas = await html2canvas(tempContainer, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                width: contentWidth,
                height: captureHeight,
                windowWidth: contentWidth,
                windowHeight: contentHeight,
                scrollY: -yPosition,
                scrollX: 0,
                x: 0,
                y: yPosition,
                allowTaint: true,
                logging: false,
                // Add these options to improve text rendering
                removeContainer: false,
                foreignObjectRendering: false,
                imageTimeout: 0
              });
              
              // Convert to image
              const imgData = canvas.toDataURL('image/png');
              const imgProps = pdf.getImageProperties(imgData);
              const pdfWidth = pdf.internal.pageSize.getWidth();
              
              // Calculate height while maintaining aspect ratio
              const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
              
              // Add new page if not the first page
              if (pageNum > 0) {
                pdf.addPage();
              }
              
              // Add image to PDF - adjust position to account for overlap
              // For pages after the first, position the image slightly higher to account for overlap
              const yOffset = pageNum > 0 ? -5 : 0; // Increased offset from -3mm to -5mm to prevent cutting off text
              pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, pdfHeight);
              
              // Process next page or finish
              if (pageNum < totalPages - 1) {
                return addPage(pageNum + 1);
              } else {
                // Convert to blob and resolve
                const pdfBlob = pdf.output('blob');
                resolve(pdfBlob);
              }
            };
            
            // Start with the first page
            addPage(0).catch(reject);
          }).catch(reject);
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
