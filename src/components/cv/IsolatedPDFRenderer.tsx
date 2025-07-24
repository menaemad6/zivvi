
import React from 'react';
import { CVData } from '@/types/cv';
import { CVTemplateRenderer } from './CVTemplateRenderer';

interface IsolatedPDFRendererProps {
  cvData: Partial<CVData>;
  templateId: string;
  sections: string[];
}

export const IsolatedPDFRenderer: React.FC<IsolatedPDFRendererProps> = ({
  cvData,
  templateId,
  sections
}) => {
  // Fixed A4 dimensions in pixels (at 96dpi)
  const A4_WIDTH = 794;
  const A4_HEIGHT = 1123;

  return (
    <div
      className="isolated-pdf-container"
      style={{
        width: A4_WIDTH,
        height: A4_HEIGHT,
        position: 'absolute',
        left: '-9999px',
        top: 0,
        zIndex: -1,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        fontSize: '14px',
        lineHeight: '1.4',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <CVTemplateRenderer
        cvData={cvData}
        templateId={templateId}
        sections={sections}
      />
    </div>
  );
};
