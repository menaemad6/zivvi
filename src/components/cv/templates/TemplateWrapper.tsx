import { FileText } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { CVTemplateRenderer } from '../CVTemplateRenderer'


const getResponsiveScale = () => {
    // A4 width in mm: 210mm, in px: 210mm * 3.78 = ~794px (at 96dpi)
    // But our template is 210mm wide, so we want to fit it in the viewport
    const A4_WIDTH_MM = 210;
    const MM_TO_PX = 3.78; // 1mm ≈ 3.78px at 96dpi
    const A4_WIDTH_PX = A4_WIDTH_MM * MM_TO_PX;
    const margin = 32; // px, some margin for shadow/air
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    // Fit to width, but never scale above 1
    let scale = Math.min(1, (viewportWidth - margin) / A4_WIDTH_PX);
    // On very short screens, fit to height
    const A4_HEIGHT_PX = 297 * MM_TO_PX;
    scale = Math.min(scale, (viewportHeight - margin) / A4_HEIGHT_PX);
    // Minimum scale for mobile
    scale = Math.max(scale, 0.45);
    return scale;
  };


const TemplateWrapper = ({ cvData, sections, template }: { cvData: any, sections: any, template: any }) => {
    const [scale, setScale] = useState(getResponsiveScale());

    useEffect(() => {
        const handleResize = () => {
          setScale(getResponsiveScale());
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);

    


  return (
    <div
    className="cv-wrapper"
    style={{
      transform: `scale(1)`,
      transformOrigin: 'top center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      boxSizing: 'content-box',
      overflow: 'visible',
      maxWidth: '100vw',
    }}
  >
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
      </div>
    )}
  </div>
  )
}

export default TemplateWrapper