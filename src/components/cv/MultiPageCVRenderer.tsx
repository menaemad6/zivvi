
import React, { useEffect, useRef, useState } from 'react';
import { CVData } from '@/types/cv';
import { CVTemplateRenderer } from './CVTemplateRenderer';

interface MultiPageCVRendererProps {
  cvData: Partial<CVData>;
  templateId: string;
  sections: string[];
  onPagesChange?: (pages: number) => void;
}

export const MultiPageCVRenderer: React.FC<MultiPageCVRendererProps> = ({
  cvData,
  templateId,
  sections,
  onPagesChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<React.ReactNode[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const A4_HEIGHT = 1123; // A4 height in pixels at 96dpi

  useEffect(() => {
    if (!containerRef.current) return;

    // Create a temporary container to measure content height
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '794px';
    tempContainer.style.visibility = 'hidden';
    document.body.appendChild(tempContainer);

    // Create the CV content to measure
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `
      <div style="width: 794px; font-size: 14px; line-height: 1.4; font-family: system-ui, -apple-system, sans-serif;">
        <div id="cv-content"></div>
      </div>
    `;
    tempContainer.appendChild(tempDiv);

    // Simulate content height calculation
    setTimeout(() => {
      // Calculate estimated content height based on sections
      let estimatedHeight = 0;
      
      // Header section (personalInfo)
      if (sections.includes('personalInfo')) {
        estimatedHeight += 200; // Estimated header height
      }
      
      // Experience section
      if (sections.includes('experience') && cvData.experience) {
        estimatedHeight += cvData.experience.length * 120; // ~120px per experience item
      }
      
      // Education section
      if (sections.includes('education') && cvData.education) {
        estimatedHeight += cvData.education.length * 100; // ~100px per education item
      }
      
      // Skills section
      if (sections.includes('skills') && cvData.skills) {
        estimatedHeight += 150; // Skills section height
      }
      
      // Projects section
      if (sections.includes('projects') && cvData.projects) {
        estimatedHeight += cvData.projects.length * 140; // ~140px per project
      }
      
      // References section
      if (sections.includes('references') && cvData.references) {
        estimatedHeight += cvData.references.length * 100; // ~100px per reference
      }

      // Add some padding
      estimatedHeight += 100;

      const numberOfPages = Math.max(1, Math.ceil(estimatedHeight / A4_HEIGHT));
      
      setTotalPages(numberOfPages);
      onPagesChange?.(numberOfPages);

      // Generate page elements
      const pageElements = [];
      for (let i = 0; i < numberOfPages; i++) {
        pageElements.push(
          <div
            key={i}
            className="cv-page"
            style={{
              width: '794px',
              height: '1123px',
              backgroundColor: '#ffffff',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: i < numberOfPages - 1 ? '20px' : '0',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          >
            <div
              style={{
                transform: `translateY(-${i * A4_HEIGHT}px)`,
                width: '100%',
                height: `${numberOfPages * A4_HEIGHT}px`
              }}
            >
              <CVTemplateRenderer
                cvData={cvData}
                templateId={templateId}
                sections={sections}
              />
            </div>
          </div>
        );
      }

      setPages(pageElements);
      document.body.removeChild(tempContainer);
    }, 100);
  }, [cvData, templateId, sections, onPagesChange]);

  return (
    <div ref={containerRef} className="multi-page-cv-container">
      {pages.length > 0 ? pages : (
        <div
          className="cv-page"
          style={{
            width: '794px',
            height: '1123px',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
        >
          <CVTemplateRenderer
            cvData={cvData}
            templateId={templateId}
            sections={sections}
          />
        </div>
      )}
    </div>
  );
};
