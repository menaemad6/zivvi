
import { FileText } from 'lucide-react'
import React from 'react'
import { CVTemplateRenderer } from '../CVTemplateRenderer'

const TemplateWrapper = ({ cvData, sections, template }: { cvData: any, sections: any, template: any }) => {
  return (
    <div
      className="cv-wrapper"
      style={{
        width: '794px',
        height: '1123px',
        backgroundColor: '#ffffff',
        overflow: 'scroll',
        fontSize: '14px',
        lineHeight: '1.4',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        margin: '0 auto',
        boxShadow: '0 0 20px rgba(0,0,0,0.1)'
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
