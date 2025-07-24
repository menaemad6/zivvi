import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * GeneratePdfFromHtml
 *
 * Usage:
 * <GeneratePdfFromHtml
 *   htmlContent={<YourComponent ...props />}
 *   pdfFileName="output.pdf"
 *   options={{ resolution: 4, randomCrop: false, ... }}
 *   triggerRef={ref} // call ref.current() to trigger PDF generation
 * />
 */
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
    // Clone the node to avoid React re-render issues
    const node = containerRef.current.cloneNode(true);
    // Offscreen container
    const offscreen = document.createElement('div');
    offscreen.style.position = 'absolute';
    offscreen.style.left = '-9999px';
    offscreen.style.top = '0';
    offscreen.style.zIndex = '-1';
    offscreen.appendChild(node);
    document.body.appendChild(offscreen);

    try {
      const opts = { ...defaultOptions, ...options };
      // html2canvas
      const canvas = await html2canvas(node, {
        scale: Number(opts.resolution) * 1.5,
        backgroundColor: opts.randomCrop ? 'transparent' : '#fff',
        logging: false,
        useCORS: true,
        allowTaint: true,
        letterRendering: true,
        imageTimeout: 0,
        removeContainer: true,
        foreignObjectRendering: false,
        ignoreElements: () => false,
      });
      // PDF
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const doc = new jsPDF({
        orientation: canvasHeight > canvasWidth ? 'portrait' : 'landscape',
        unit: 'px',
        format: [canvasWidth, canvasHeight],
        putOnlyUsedFonts: true,
        compress: true,
      });
      const imgData = canvas.toDataURL('image/png', 1.0);
      doc.addImage(
        imgData,
        'PNG',
        0,
        0,
        canvas.width,
        canvas.height,
        'image-0',
        'FAST'
      );
      if (onPdfReady) {
        // Return Blob to parent
        const blob = doc.output('blob');
        onPdfReady(blob);
      } else {
        doc.save(pdfFileName);
      }
    } finally {
      // Clean up
      if (document.body.contains(offscreen)) {
        document.body.removeChild(offscreen);
      }
    }
  });

  // Render the content offscreen (hidden)
  return (
    <div style={{ position: 'absolute', left: '-9999px', top: 0, zIndex: -1 }}>
      <div ref={containerRef}>{htmlContent}</div>
    </div>
  );
};

export default React.forwardRef((props, ref) => <GeneratePdfFromHtml {...props} triggerRef={ref} />); 