
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const defaultOptions = {
  resolution: 4,
  randomCrop: false,
  pageEffect: 'shadows',
};

const GeneratePdfFromHtml = ({ htmlContent, pdfFileName = 'output.pdf', options = {}, triggerRef, onPdfReady }) => {
  const containerRef = useRef();

  // Expose the generatePDF function via ref
  React.useImperativeHandle(triggerRef, () => async () => {
    if (!containerRef.current) return;
    
    // Create isolated container with fixed dimensions
    const isolatedContainer = document.createElement('div');
    isolatedContainer.style.position = 'fixed';
    isolatedContainer.style.left = '-9999px';
    isolatedContainer.style.top = '0';
    isolatedContainer.style.zIndex = '-1';
    isolatedContainer.style.width = '794px';
    isolatedContainer.style.height = '1123px';
    isolatedContainer.style.backgroundColor = '#ffffff';
    isolatedContainer.style.overflow = 'hidden';
    isolatedContainer.style.fontSize = '14px';
    isolatedContainer.style.lineHeight = '1.4';
    isolatedContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    
    // Clone the content and append to isolated container
    const clonedContent = containerRef.current.cloneNode(true);
    isolatedContainer.appendChild(clonedContent);
    document.body.appendChild(isolatedContainer);

    try {
      const opts = { ...defaultOptions, ...options };
      
      // Generate canvas from isolated container
      const canvas = await html2canvas(isolatedContainer, {
        width: 794,
        height: 1123,
        scale: Number(opts.resolution),
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
        letterRendering: true,
        imageTimeout: 0,
        removeContainer: false,
        foreignObjectRendering: false,
        ignoreElements: () => false,
      });
      
      // Create PDF with A4 dimensions
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [794, 1123],
        putOnlyUsedFonts: true,
        compress: true,
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      doc.addImage(
        imgData,
        'PNG',
        0,
        0,
        794,
        1123,
        'image-0',
        'FAST'
      );
      
      if (onPdfReady) {
        const blob = doc.output('blob');
        onPdfReady(blob);
      } else {
        doc.save(pdfFileName);
      }
    } finally {
      // Clean up
      if (document.body.contains(isolatedContainer)) {
        document.body.removeChild(isolatedContainer);
      }
    }
  });

  // Render the content in a container that will be cloned
  return (
    <div style={{ position: 'absolute', left: '-9999px', top: 0, zIndex: -1 }}>
      <div 
        ref={containerRef}
        style={{
          width: '794px',
          height: '1123px',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          fontSize: '14px',
          lineHeight: '1.4',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        {htmlContent}
      </div>
    </div>
  );
};

export default React.forwardRef((props, ref) => <GeneratePdfFromHtml {...props} triggerRef={ref} />);
