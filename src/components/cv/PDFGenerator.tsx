
import React, { useRef, useState } from 'react';
import { CVData } from '@/types/cv';
import { CVTemplateRenderer } from './CVTemplateRenderer';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface PDFGeneratorProps {
  cvData: Partial<CVData>;
  templateId: string;
  sections: string[];
  fileName?: string;
  onDownload?: () => void;
}

export const PDFGenerator: React.FC<PDFGeneratorProps> = ({
  cvData,
  templateId,
  sections,
  fileName = 'cv.pdf',
  onDownload
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!containerRef.current) return;

    setIsGenerating(true);
    onDownload?.();

    try {
      const A4_WIDTH = 794;
      const A4_HEIGHT = 1123;

      // Create isolated container for PDF generation
      const isolatedContainer = document.createElement('div');
      isolatedContainer.style.position = 'fixed';
      isolatedContainer.style.left = '-9999px';
      isolatedContainer.style.top = '0';
      isolatedContainer.style.zIndex = '-1';
      isolatedContainer.style.width = `${A4_WIDTH}px`;
      isolatedContainer.style.backgroundColor = '#ffffff';
      isolatedContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      
      // Clone the content
      const clonedContent = containerRef.current.cloneNode(true) as HTMLElement;
      isolatedContainer.appendChild(clonedContent);
      document.body.appendChild(isolatedContainer);

      // Measure content height
      const contentHeight = clonedContent.scrollHeight;
      const numberOfPages = Math.ceil(contentHeight / A4_HEIGHT);

      // Create PDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [A4_WIDTH, A4_HEIGHT],
        putOnlyUsedFonts: true,
        compress: true,
      });

      // Generate pages
      for (let i = 0; i < numberOfPages; i++) {
        if (i > 0) {
          doc.addPage();
        }

        // Set container height for current page
        isolatedContainer.style.height = `${A4_HEIGHT}px`;
        isolatedContainer.style.overflow = 'hidden';
        
        // Adjust content position for current page
        clonedContent.style.transform = `translateY(-${i * A4_HEIGHT}px)`;

        // Generate canvas for current page
        const canvas = await html2canvas(isolatedContainer, {
          width: A4_WIDTH,
          height: A4_HEIGHT,
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true,
          allowTaint: true,
        });

        const imgData = canvas.toDataURL('image/png', 1.0);
        doc.addImage(imgData, 'PNG', 0, 0, A4_WIDTH, A4_HEIGHT);
      }

      // Save PDF
      doc.save(fileName);

      // Clean up
      document.body.removeChild(isolatedContainer);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button
        onClick={generatePDF}
        disabled={isGenerating}
        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </>
        )}
      </Button>
      
      {/* Hidden container for PDF generation */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '0',
          zIndex: -1,
          width: '794px',
          backgroundColor: '#ffffff',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        <CVTemplateRenderer
          cvData={cvData}
          templateId={templateId}
          sections={sections}
        />
      </div>
    </>
  );
};
