
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

    // Create a temporary container to measure content
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '794px';
    tempContainer.style.visibility = 'hidden';
    document.body.appendChild(tempContainer);

    // Render the CV content in the temporary container
    const tempDiv = document.createElement('div');
    tempContainer.appendChild(tempDiv);

    // Use React to render the content
    import('react-dom').then(({ createRoot }) => {
      const root = createRoot(tempDiv);
      root.render(
        <CVTemplateRenderer
          cvData={cvData}
          templateId={templateId}
          sections={sections}
        />
      );

      // Wait for rendering to complete
      setTimeout(() => {
        const contentHeight = tempDiv.scrollHeight;
        const numberOfPages = Math.ceil(contentHeight / A4_HEIGHT);
        
        setTotalPages(numberOfPages);
        onPagesChange?.(numberOfPages);

        // Generate pages
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
        root.unmount();
        document.body.removeChild(tempContainer);
      }, 100);
    });
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
