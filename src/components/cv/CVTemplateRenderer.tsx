
import React from 'react';
import { CVData } from '@/types/cv';

interface CVTemplateRendererProps {
  cvData: CVData;
  templateId: string;
  sections: string[];
}

export const CVTemplateRenderer: React.FC<CVTemplateRendererProps> = ({
  cvData,
  templateId,
  sections
}) => {
  const renderSection = (sectionId: string) => {
    const baseId = sectionId.split('_')[0];
    
    switch (baseId) {
      case 'personalInfo':
        return (
          <section key={sectionId} className="mb-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {cvData.personalInfo?.fullName || 'Your Name'}
              </h1>
              <div className="text-gray-600 space-y-1">
                {cvData.personalInfo?.email && <p>{cvData.personalInfo.email}</p>}
                {cvData.personalInfo?.phone && <p>{cvData.personalInfo.phone}</p>}
                {cvData.personalInfo?.location && <p>{cvData.personalInfo.location}</p>}
              </div>
              {cvData.personalInfo?.summary && (
                <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
                  {cvData.personalInfo.summary}
                </p>
              )}
            </div>
          </section>
        );

      case 'experience':
        if (!cvData.experience || cvData.experience.length === 0) return null;
        return (
          <section key={sectionId} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-500 pb-2">
              Experience
            </h2>
            <div className="space-y-4">
              {cvData.experience.map((exp) => (
                <div key={exp.id} className="border-l-4 border-blue-300 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                  <p className="text-blue-600 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-500">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </p>
                  {exp.description && (
                    <p className="mt-2 text-gray-700">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (!cvData.education || cvData.education.length === 0) return null;
        return (
          <section key={sectionId} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-green-500 pb-2">
              Education
            </h2>
            <div className="space-y-4">
              {cvData.education.map((edu) => (
                <div key={edu.id} className="border-l-4 border-green-300 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-green-600 font-medium">{edu.school}</p>
                  <p className="text-sm text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!cvData.skills || cvData.skills.length === 0) return null;
        return (
          <section key={sectionId} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-purple-500 pb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {cvData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!cvData.projects || cvData.projects.length === 0) return null;
        return (
          <section key={sectionId} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 pb-2">
              Projects
            </h2>
            <div className="space-y-4">
              {cvData.projects.map((project) => (
                <div key={project.id} className="border-l-4 border-orange-300 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-orange-600 font-medium">{project.technologies}</p>
                  <p className="text-sm text-gray-500">
                    {project.startDate} - {project.endDate || 'Present'}
                  </p>
                  {project.description && (
                    <p className="mt-2 text-gray-700">{project.description}</p>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-800 text-sm"
                    >
                      View Project →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'references':
        if (!cvData.references || cvData.references.length === 0) return null;
        return (
          <section key={sectionId} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-indigo-500 pb-2">
              References
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cvData.references.map((ref) => (
                <div key={ref.id} className="border-l-4 border-indigo-300 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">{ref.name}</h3>
                  <p className="text-indigo-600 font-medium">
                    {ref.position} at {ref.company}
                  </p>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>{ref.email}</p>
                    {ref.phone && <p>{ref.phone}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      default:
        // Handle custom sections
        const customSection = cvData.customSections?.find(cs => cs.id === sectionId);
        if (!customSection || !customSection.items || customSection.items.length === 0) return null;
        
        return (
          <section key={sectionId} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-pink-500 pb-2">
              {customSection.title}
            </h2>
            <div className="space-y-4">
              {customSection.items.map((item) => (
                <div key={item.id} className="border-l-4 border-pink-300 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">{item.content}</h3>
                  {item.description && (
                    <p className="mt-2 text-gray-700">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white min-h-full">
      {sections.map((sectionId) => renderSection(sectionId))}
    </div>
  );
};
