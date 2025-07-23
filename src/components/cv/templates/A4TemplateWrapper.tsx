
import React, { useEffect, useRef, useState } from 'react';

interface A4TemplateWrapperProps {
  children: React.ReactNode;
  templateId: string;
}

export const A4TemplateWrapper: React.FC<A4TemplateWrapperProps> = ({ children, templateId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      
      // A4 dimensions in pixels (210mm x 297mm at 96 DPI)
      const A4_WIDTH = 794; // 210mm
      const A4_HEIGHT = 1123; // 297mm

      // Calculate scale to fit width and height
      const scaleX = containerWidth / A4_WIDTH;
      const scaleY = containerHeight / A4_HEIGHT;
      
      // Use the smaller scale to ensure it fits completely
      const newScale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 1
      
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    
    return () => {
      window.removeEventListener('resize', calculateScale);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="a4-template-container"
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      <div
        className="a4-template-content"
        style={{
          width: '794px', // A4 width
          height: '1123px', // A4 height
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          backgroundColor: '#fff',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}
      >
        {children}
      </div>
    </div>
  );
};
