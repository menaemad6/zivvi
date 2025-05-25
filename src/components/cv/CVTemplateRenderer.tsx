
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
  const getTemplateStyles = (templateId: string) => {
    const styles = {
      modern: {
        container: 'bg-white text-gray-900',
        header: 'bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8',
        headerName: 'text-3xl font-bold mb-2',
        headerContact: 'text-blue-100 space-y-1',
        sectionTitle: 'text-xl font-bold text-blue-600 border-b-2 border-blue-200 pb-2 mb-4',
        experienceItem: 'mb-4 border-l-4 border-blue-200 pl-4',
        skillTag: 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm'
      },
      classic: {
        container: 'bg-white text-gray-900',
        header: 'border-b-4 border-gray-800 pb-6 mb-6',
        headerName: 'text-4xl font-serif font-bold text-gray-800 mb-2',
        headerContact: 'text-gray-600 space-y-1',
        sectionTitle: 'text-lg font-serif font-bold text-gray-800 border-b border-gray-300 pb-1 mb-3',
        experienceItem: 'mb-4 border-l-2 border-gray-300 pl-4',
        skillTag: 'bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm'
      },
      creative: {
        container: 'bg-white text-gray-900',
        header: 'bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 text-white p-8 rounded-t-2xl',
        headerName: 'text-3xl font-bold mb-2',
        headerContact: 'text-purple-100 space-y-1',
        sectionTitle: 'text-xl font-bold text-purple-600 border-l-4 border-purple-400 pl-4 mb-4',
        experienceItem: 'mb-4 bg-purple-50 p-4 rounded-lg border-l-4 border-purple-300',
        skillTag: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm'
      },
      minimal: {
        container: 'bg-white text-gray-900',
        header: 'pb-6 mb-8 border-b border-gray-200',
        headerName: 'text-3xl font-light text-gray-800 mb-2',
        headerContact: 'text-gray-500 space-y-1 text-sm',
        sectionTitle: 'text-lg font-medium text-gray-700 mb-4 uppercase tracking-wide',
        experienceItem: 'mb-6 border-l border-gray-200 pl-4',
        skillTag: 'bg-gray-100 text-gray-700 px-2 py-1 text-sm'
      },
      executive: {
        container: 'bg-gray-900 text-white',
        header: 'bg-gradient-to-r from-gray-800 to-black p-8 border-b-2 border-yellow-400',
        headerName: 'text-3xl font-bold mb-2 text-yellow-400',
        headerContact: 'text-gray-300 space-y-1',
        sectionTitle: 'text-xl font-bold text-yellow-400 border-b border-yellow-400 pb-2 mb-4',
        experienceItem: 'mb-4 border-l-2 border-yellow-400 pl-4',
        skillTag: 'bg-yellow-400 text-gray-900 px-3 py-1 rounded text-sm font-medium'
      },
      tech: {
        container: 'bg-white text-gray-900',
        header: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8',
        headerName: 'text-3xl font-mono font-bold mb-2',
        headerContact: 'text-emerald-100 space-y-1 font-mono text-sm',
        sectionTitle: 'text-xl font-mono font-bold text-emerald-600 border-b-2 border-emerald-200 pb-2 mb-4',
        experienceItem: 'mb-4 bg-emerald-50 p-4 rounded border-l-4 border-emerald-400',
        skillTag: 'bg-emerald-500 text-white px-3 py-1 rounded-md text-sm font-mono'
      },
      artistic: {
        container: 'bg-gradient-to-br from-orange-50 to-red-50 text-gray-900',
        header: 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white p-8',
        headerName: 'text-3xl font-bold mb-2',
        headerContact: 'text-orange-100 space-y-1',
        sectionTitle: 'text-xl font-bold text-orange-600 mb-4 relative',
        experienceItem: 'mb-4 bg-white p-4 rounded-lg shadow border-l-4 border-orange-400',
        skillTag: 'bg-gradient-to-r from-orange-400 to-red-400 text-white px-3 py-1 rounded-full text-sm'
      },
      corporate: {
        container: 'bg-white text-gray-900',
        header: 'bg-gradient-to-r from-indigo-700 to-blue-800 text-white p-8',
        headerName: 'text-3xl font-bold mb-2',
        headerContact: 'text-indigo-100 space-y-1',
        sectionTitle: 'text-xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4',
        experienceItem: 'mb-4 border-l-4 border-indigo-200 pl-4',
        skillTag: 'bg-indigo-100 text-indigo-800 px-3 py-1 rounded text-sm'
      },
      startup: {
        container: 'bg-white text-gray-900',
        header: 'bg-gradient-to-r from-orange-600 to-amber-600 text-white p-8',
        headerName: 'text-3xl font-bold mb-2',
        headerContact: 'text-orange-100 space-y-1',
        sectionTitle: 'text-xl font-bold text-orange-600 border-b-2 border-orange-200 pb-2 mb-4',
        experienceItem: 'mb-4 bg-orange-50 p-4 rounded border-l-4 border-orange-400',
        skillTag: 'bg-orange-500 text-white px-3 py-1 rounded-lg text-sm'
      }
    };
    
    return styles[templateId as keyof typeof styles] || styles.modern;
  };

  const styles = getTemplateStyles(templateId);

  const renderPersonalInfo = () => (
    <div className={styles.header}>
      <h1 className={styles.headerName}>{cvData.personalInfo.fullName || 'Your Name'}</h1>
      <div className={styles.headerContact}>
        {cvData.personalInfo.email && <div>{cvData.personalInfo.email}</div>}
        {cvData.personalInfo.phone && <div>{cvData.personalInfo.phone}</div>}
        {cvData.personalInfo.location && <div>{cvData.personalInfo.location}</div>}
      </div>
      {cvData.personalInfo.summary && (
        <div className="mt-4 text-sm opacity-90">
          {cvData.personalInfo.summary}
        </div>
      )}
    </div>
  );

  const renderExperience = () => (
    <div className="mb-8">
      <h2 className={styles.sectionTitle}>Experience</h2>
      {cvData.experience && cvData.experience.length > 0 ? (
        cvData.experience.map((exp) => (
          <div key={exp.id} className={styles.experienceItem}>
            <h3 className="font-bold text-lg">{exp.title}</h3>
            <div className="font-medium text-gray-600">{exp.company}</div>
            <div className="text-sm text-gray-500 mb-2">
              {exp.startDate} - {exp.endDate || 'Present'}
            </div>
            {exp.description && (
              <p className="text-sm text-gray-700">{exp.description}</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No experience added yet</p>
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="mb-8">
      <h2 className={styles.sectionTitle}>Education</h2>
      {cvData.education && cvData.education.length > 0 ? (
        cvData.education.map((edu) => (
          <div key={edu.id} className={styles.experienceItem}>
            <h3 className="font-bold">{edu.degree}</h3>
            <div className="font-medium text-gray-600">{edu.school}</div>
            <div className="text-sm text-gray-500">
              {edu.startDate} - {edu.endDate}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No education added yet</p>
      )}
    </div>
  );

  const renderSkills = () => (
    <div className="mb-8">
      <h2 className={styles.sectionTitle}>Skills</h2>
      {cvData.skills && cvData.skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {cvData.skills.map((skill, index) => (
            <span key={index} className={styles.skillTag}>
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No skills added yet</p>
      )}
    </div>
  );

  const renderProjects = () => (
    <div className="mb-8">
      <h2 className={styles.sectionTitle}>Projects</h2>
      {cvData.projects && cvData.projects.length > 0 ? (
        cvData.projects.map((project) => (
          <div key={project.id} className={styles.experienceItem}>
            <h3 className="font-bold">{project.name}</h3>
            <div className="text-sm text-gray-500 mb-2">
              {project.startDate} - {project.endDate || 'Present'}
            </div>
            {project.technologies && (
              <div className="text-sm font-medium text-gray-600 mb-1">
                Technologies: {project.technologies}
              </div>
            )}
            {project.description && (
              <p className="text-sm text-gray-700">{project.description}</p>
            )}
            {project.link && (
              <a href={project.link} className="text-sm text-blue-600 hover:underline">
                View Project
              </a>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No projects added yet</p>
      )}
    </div>
  );

  const renderReferences = () => (
    <div className="mb-8">
      <h2 className={styles.sectionTitle}>References</h2>
      {cvData.references && cvData.references.length > 0 ? (
        cvData.references.map((reference) => (
          <div key={reference.id} className={styles.experienceItem}>
            <h3 className="font-bold">{reference.name}</h3>
            <div className="text-sm text-gray-600">
              {reference.position} at {reference.company}
            </div>
            <div className="text-sm text-gray-500">{reference.email}</div>
            {reference.phone && (
              <div className="text-sm text-gray-500">{reference.phone}</div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No references added yet</p>
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
    <div className={`${styles.container} min-h-full shadow-lg rounded-lg overflow-hidden`}>
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
