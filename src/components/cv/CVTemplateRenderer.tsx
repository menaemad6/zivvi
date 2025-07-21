
import React from 'react';
import { CVData } from '@/types/cv';
import { templateComponentRegistry } from "./templates";

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
  // Check for file-based template
  if (templateComponentRegistry[templateId]) {
    const TemplateComponent = templateComponentRegistry[templateId];
    return <TemplateComponent cvData={cvData} sections={sections} />;
  }

  const getTemplateStyles = (templateId: string) => {
    const styles = {
      modern: {
        container: 'bg-white text-gray-900 shadow-2xl',
        header: 'bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8',
        headerName: 'text-4xl font-bold mb-3',
        headerContact: 'text-blue-100 space-y-2 text-lg',
        sectionTitle: 'text-2xl font-bold text-blue-600 border-b-3 border-blue-200 pb-3 mb-6',
        experienceItem: 'mb-6 border-l-4 border-blue-200 pl-6 bg-blue-50/30 py-4 rounded-r-lg',
        skillTag: 'bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium'
      },
      classic: {
        container: 'bg-white text-gray-900 shadow-2xl',
        header: 'border-b-4 border-gray-800 pb-8 mb-8 px-8 pt-8',
        headerName: 'text-5xl font-serif font-bold text-gray-800 mb-3',
        headerContact: 'text-gray-600 space-y-2 text-lg',
        sectionTitle: 'text-2xl font-serif font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-6',
        experienceItem: 'mb-6 border-l-3 border-gray-300 pl-6 py-3',
        skillTag: 'bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm font-medium'
      },
      creative: {
        container: 'bg-white text-gray-900 shadow-2xl',
        header: 'bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 text-white p-8 rounded-t-2xl',
        headerName: 'text-4xl font-bold mb-3',
        headerContact: 'text-purple-100 space-y-2 text-lg',
        sectionTitle: 'text-2xl font-bold text-purple-600 border-l-4 border-purple-400 pl-6 mb-6',
        experienceItem: 'mb-6 bg-purple-50 p-6 rounded-lg border-l-4 border-purple-300 shadow-sm',
        skillTag: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium'
      },
      minimal: {
        container: 'bg-white text-gray-900 shadow-lg',
        header: 'pb-8 mb-10 border-b border-gray-200 px-8 pt-8',
        headerName: 'text-4xl font-light text-gray-800 mb-3',
        headerContact: 'text-gray-500 space-y-2 text-base',
        sectionTitle: 'text-xl font-medium text-gray-700 mb-6 uppercase tracking-wide',
        experienceItem: 'mb-8 border-l border-gray-200 pl-6 py-2',
        skillTag: 'bg-gray-100 text-gray-700 px-3 py-2 text-sm font-medium'
      },
      executive: {
        container: 'bg-gray-900 text-white shadow-2xl',
        header: 'bg-gradient-to-r from-gray-800 to-black p-8 border-b-3 border-yellow-400',
        headerName: 'text-4xl font-bold mb-3 text-yellow-400',
        headerContact: 'text-gray-300 space-y-2 text-lg',
        sectionTitle: 'text-2xl font-bold text-yellow-400 border-b-2 border-yellow-400 pb-3 mb-6',
        experienceItem: 'mb-6 border-l-3 border-yellow-400 pl-6 py-4',
        skillTag: 'bg-yellow-400 text-gray-900 px-4 py-2 rounded text-sm font-bold'
      },
      tech: {
        container: 'bg-white text-gray-900 shadow-2xl',
        header: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8',
        headerName: 'text-4xl font-mono font-bold mb-3',
        headerContact: 'text-emerald-100 space-y-2 font-mono text-base',
        sectionTitle: 'text-2xl font-mono font-bold text-emerald-600 border-b-3 border-emerald-200 pb-3 mb-6',
        experienceItem: 'mb-6 bg-emerald-50 p-6 rounded border-l-4 border-emerald-400 shadow-sm',
        skillTag: 'bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-mono'
      },
      artistic: {
        container: 'bg-gradient-to-br from-orange-50 to-red-50 text-gray-900 shadow-2xl',
        header: 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white p-8',
        headerName: 'text-4xl font-bold mb-3',
        headerContact: 'text-orange-100 space-y-2 text-lg',
        sectionTitle: 'text-2xl font-bold text-orange-600 mb-6 relative',
        experienceItem: 'mb-6 bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-400',
        skillTag: 'bg-gradient-to-r from-orange-400 to-red-400 text-white px-4 py-2 rounded-full text-sm font-medium'
      },
      corporate: {
        container: 'bg-white text-gray-900 shadow-2xl',
        header: 'bg-gradient-to-r from-indigo-700 to-blue-800 text-white p-8',
        headerName: 'text-4xl font-bold mb-3',
        headerContact: 'text-indigo-100 space-y-2 text-lg',
        sectionTitle: 'text-2xl font-bold text-indigo-700 border-b-3 border-indigo-200 pb-3 mb-6',
        experienceItem: 'mb-6 border-l-4 border-indigo-200 pl-6 bg-indigo-50/30 py-4 rounded-r-lg',
        skillTag: 'bg-indigo-100 text-indigo-800 px-4 py-2 rounded text-sm font-medium'
      },
      startup: {
        container: 'bg-white text-gray-900 shadow-2xl',
        header: 'bg-gradient-to-r from-orange-600 to-amber-600 text-white p-8',
        headerName: 'text-4xl font-bold mb-3',
        headerContact: 'text-orange-100 space-y-2 text-lg',
        sectionTitle: 'text-2xl font-bold text-orange-600 border-b-3 border-orange-200 pb-3 mb-6',
        experienceItem: 'mb-6 bg-orange-50 p-6 rounded border-l-4 border-orange-400 shadow-sm',
        skillTag: 'bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium'
      }
    };
    
    return styles[templateId as keyof typeof styles] || styles.modern;
  };

  const styles = getTemplateStyles(templateId);

  const renderPersonalInfo = () => (
    <div className={styles.header}>
      <h1 className={styles.headerName}>{cvData.personalInfo.fullName || 'Your Name'}</h1>
      <div className={styles.headerContact}>
        {cvData.personalInfo.email && <div>📧 {cvData.personalInfo.email}</div>}
        {cvData.personalInfo.phone && <div>📱 {cvData.personalInfo.phone}</div>}
        {cvData.personalInfo.location && <div>📍 {cvData.personalInfo.location}</div>}
      </div>
      {cvData.personalInfo.summary && (
        <div className="mt-6 text-base opacity-90 leading-relaxed max-w-4xl">
          {cvData.personalInfo.summary}
        </div>
      )}
    </div>
  );

  const renderExperience = () => (
    <div className="mb-10 px-8">
      <h2 className={styles.sectionTitle}>💼 Experience</h2>
      {cvData.experience && cvData.experience.length > 0 ? (
        cvData.experience.map((exp) => (
          <div key={exp.id} className={styles.experienceItem}>
            <h3 className="font-bold text-xl mb-2">{exp.title}</h3>
            <div className="font-semibold text-lg text-gray-600 mb-1">{exp.company}</div>
            <div className="text-sm text-gray-500 mb-3 font-medium">
              {exp.startDate} - {exp.endDate || 'Present'}
            </div>
            {exp.description && (
              <p className="text-base text-gray-700 leading-relaxed">{exp.description}</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">No experience added yet</p>
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="mb-10 px-8">
      <h2 className={styles.sectionTitle}>🎓 Education</h2>
      {cvData.education && cvData.education.length > 0 ? (
        cvData.education.map((edu) => (
          <div key={edu.id} className={styles.experienceItem}>
            <h3 className="font-bold text-xl">{edu.degree}</h3>
            <div className="font-semibold text-lg text-gray-600">{edu.school}</div>
            <div className="text-sm text-gray-500 font-medium">
              {edu.startDate} - {edu.endDate}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">No education added yet</p>
      )}
    </div>
  );

  const renderSkills = () => (
    <div className="mb-10 px-8">
      <h2 className={styles.sectionTitle}>⚡ Skills</h2>
      {cvData.skills && cvData.skills.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {cvData.skills.map((skill, index) => (
            <span key={index} className={styles.skillTag}>
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No skills added yet</p>
      )}
    </div>
  );

  const renderProjects = () => (
    <div className="mb-10 px-8">
      <h2 className={styles.sectionTitle}>🚀 Projects</h2>
      {cvData.projects && cvData.projects.length > 0 ? (
        cvData.projects.map((project) => (
          <div key={project.id} className={styles.experienceItem}>
            <h3 className="font-bold text-xl">{project.name}</h3>
            <div className="text-sm text-gray-500 mb-2 font-medium">
              {project.startDate} - {project.endDate || 'Present'}
            </div>
            {project.technologies && (
              <div className="text-base font-semibold text-gray-600 mb-2">
                🛠️ Technologies: {project.technologies}
              </div>
            )}
            {project.description && (
              <p className="text-base text-gray-700 leading-relaxed mb-2">{project.description}</p>
            )}
            {project.link && (
              <a href={project.link} className="text-base text-blue-600 hover:underline font-medium">
                🔗 View Project
              </a>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">No projects added yet</p>
      )}
    </div>
  );

  const renderReferences = () => (
    <div className="mb-10 px-8">
      <h2 className={styles.sectionTitle}>👥 References</h2>
      {cvData.references && cvData.references.length > 0 ? (
        cvData.references.map((reference) => (
          <div key={reference.id} className={styles.experienceItem}>
            <h3 className="font-bold text-xl">{reference.name}</h3>
            <div className="text-base text-gray-600 mb-1">
              {reference.position} at {reference.company}
            </div>
            <div className="text-sm text-gray-500">📧 {reference.email}</div>
            {reference.phone && (
              <div className="text-sm text-gray-500">📱 {reference.phone}</div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">No references added yet</p>
      )}
    </div>
  );

  const sectionRenderers = {
    personalInfo: renderPersonalInfo,
    experience: renderExperience,
    education: renderEducation,
    skills: renderSkills,
    projects: renderProjects,
    references: renderReferences
  };

  return (
    <div className={`${styles.container} min-h-full rounded-lg overflow-hidden`}>
      {sections.map((sectionId, index) => {
        const baseId = sectionId.split('_')[0] as keyof typeof sectionRenderers;
        const renderer = sectionRenderers[baseId];
        return renderer ? (
          <div key={sectionId} className="animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
            {renderer()}
          </div>
        ) : null;
      })}
    </div>
  );
};
