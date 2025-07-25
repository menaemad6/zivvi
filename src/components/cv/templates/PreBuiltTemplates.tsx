import React from "react";
import { CVData } from "@/types/cv";

interface PreBuiltTemplatesProps {
  cvData: Partial<CVData>;
  sections?: string[];
  templateId: string;
}

const ClassicTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "personalInfo", "experience", "education", "skills", "references"
  ]).forEach(s => { sectionMap[s] = true; });

  const renderProfile = () => (
    <section style={{ marginBottom: '10mm' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '18pt', fontFamily: 'serif', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '2mm' }}>{cvData.personalInfo?.fullName || "Your Name"}</h1>
        <div style={{ fontSize: '10pt', color: '#555' }}>
          {cvData.personalInfo?.location || "80 Gold Street, New York, NY 10038, United States"}, {cvData.personalInfo?.phone || "(917) 407-2179"}, {cvData.personalInfo?.email || "tim.stewart@gmail.com"}
        </div>
      </div>
      {cvData.personalInfo?.summary && 
      <div style={{ marginTop: '6mm' }}>
        <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#555', fontWeight: 600, marginBottom: '1mm' }}>Profile</div>
        <div style={{ borderTop: '1px solid #ccc', marginBottom: '2mm' }}></div>
        <p style={{ fontSize: '10pt', color: '#333', lineHeight: 1.5 }}>
          {cvData.personalInfo?.summary || null }
        </p>
      </div>
      }
    </section>
  );

  const renderEmployment = () => (
    <section style={{ marginBottom: '10mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#555', fontWeight: 600, marginBottom: '1mm' }}>Employment History</div>
      <div style={{ borderTop: '1px solid #ccc', marginBottom: '2mm' }}></div>
      <div>
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '6mm', overflow: 'hidden' ,  paddingBottom: '1mm' }}>
            <div style={{ float: 'left', width: '40mm', fontSize: '10pt', color: '#555', marginBottom: '1mm', whiteSpace: 'nowrap' }}>{exp.startDate || ""} — {exp.endDate || ""}</div>
            <div style={{ marginLeft: '45mm' }}>
              <div style={{ fontWeight: 600, color: '#222', fontSize: '11pt' }}>{exp.title || "Job Title"}, {exp.company || "Company"}</div>
              <ul style={{ paddingLeft: '5mm', fontSize: '10pt', color: '#333', marginTop: '1mm'   }}>
                {exp.description && <li>{exp.description}</li>}
              </ul>
            </div>
            <div style={{ clear: 'both' }}></div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No employment history added yet</div>}
      </div>
    </section>
  );

  const renderEducation = () => (
    <section style={{ marginBottom: '10mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#555', fontWeight: 600, marginBottom: '1mm' }}>Education</div>
      <div style={{ borderTop: '1px solid #ccc', marginBottom: '2mm' }}></div>
      <div>
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx} style={{ marginBottom: '6mm', overflow: 'hidden', paddingBottom: '1mm' }}>
            <div style={{ float: 'left', width: '40mm', fontSize: '10pt', color: '#555', marginBottom: '1mm', whiteSpace: 'nowrap' }}>{edu.startDate || ""} — {edu.endDate || ""}</div>
            <div style={{ marginLeft: '45mm' }}>
              <div style={{ fontWeight: 600, color: '#222', fontSize: '11pt' }}>{edu.degree || "Degree"}, {edu.school || "Institution"}</div>
            </div>
            <div style={{ clear: 'both' }}></div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );

  const renderSkills = () => (
    <section style={{ marginBottom: '10mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#555', fontWeight: 600, marginBottom: '1mm' }}>Skills</div>
      <div style={{ borderTop: '1px solid #ccc', marginBottom: '2mm' }}></div>
      <div style={{ columnCount: 3, fontSize: '10pt', color: '#333' }}>
        {cvData.skills && cvData.skills.length > 0 ? cvData.skills.map((skill, idx) => (
          <div key={idx} style={{ borderBottom: '1px solid #eee', padding: '1mm 0' , paddingBottom: '1mm' }}>
            <span>{typeof skill === "string" ? skill : "Skill"}</span>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No skills added yet</div>}
      </div>
    </section>
  );

  const renderReferences = () => (
    <section style={{ marginBottom: '10mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#555', fontWeight: 600, marginBottom: '1mm' }}>References</div>
      <div style={{ borderTop: '1px solid #ccc', marginBottom: '2mm' }}></div>
      <div style={{ fontSize: '10pt', color: '#333' }}>
        {cvData.references && cvData.references.length > 0 ? cvData.references.map((ref, idx) => (
          <div key={idx} style={{ marginBottom: '2mm' , paddingBottom: '1mm' }}>
            <span style={{ fontWeight: 600 }}>{ref.name || "Reference Name"}</span><br />
            <span style={{ color: '#555' }}>{ref.email || "email@example.com"}</span> {ref.phone && `- ${ref.phone}`}
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No references added yet</div>}
      </div>
    </section>
  );

  const renderProjects = () => (
    <section style={{ marginBottom: '10mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#555', fontWeight: 600, marginBottom: '1mm' }}>Projects</div>
      <div style={{ borderTop: '1px solid #ccc', marginBottom: '2mm' }}></div>
      <div>
        {cvData.projects && cvData.projects.length > 0 ? cvData.projects.map((proj, idx) => (
          <div key={idx} style={{ marginBottom: '6mm', overflow: 'hidden' , paddingBottom: '1mm' }}>
            <div style={{ float: 'left', width: '40mm', fontSize: '10pt', color: '#555', marginBottom: '1mm', whiteSpace: 'nowrap' }}>{proj.startDate || ""} — {proj.endDate || ""}</div>
            <div style={{ marginLeft: '45mm' }}>
              <div style={{ fontWeight: 600, color: '#222', fontSize: '11pt' }}>{proj.name || "Project Name"}</div>
              <p style={{ fontSize: '10pt', color: '#333', marginTop: '1mm' }}>{proj.description || ""}</p>
            </div>
            <div style={{ clear: 'both' }}></div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No projects added yet</div>}
      </div>
    </section>
  );

  return (
    <div className="cv-page" style={{
      width: '210mm',
      minHeight: '297mm',
      padding: '20mm',
      backgroundColor: '#fff',
      boxSizing: 'border-box',
      fontFamily: 'Inter, sans-serif',
      color: '#222',
      margin: '0 auto',
      boxShadow: '0 0 0.5mm rgba(0,0,0,0.05)',
      position: 'relative',
      overflow: 'visible',
      display: 'block',
    }}>
      {(sectionMap["profile"] || sectionMap["personalInfo"]) && renderProfile()}
      {sectionMap["experience"] && renderEmployment()}
      {sectionMap["projects"] && renderProjects()}
      {sectionMap["education"] && renderEducation()}
      {sectionMap["skills"] && renderSkills()}
      {sectionMap["references"] && renderReferences()}
    </div>
  );
};

const VisionaryProTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "header", "personalInfo", "experience", "projects", "education", "skills"
  ]).forEach(s => { sectionMap[s] = true; });

  const renderHeader = () => (
    <div style={{ 
      backgroundColor: '#ea580c',
      color: '#fff',
      padding: '15mm 15mm 10mm 15mm',
      margin: '-20mm -20mm 15mm -20mm',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: '24pt', fontWeight: 700, marginBottom: '3mm' }}>
          {cvData.personalInfo?.fullName || "Alicia Stephens"}
        </h1>
        <div style={{ fontSize: '11pt', marginBottom: '2mm' }}>
          I solve problems and help people overcome obstacles.
        </div>
        <div style={{ fontSize: '10pt', display: 'flex', gap: '8mm' }}>
          <span>📞 {cvData.personalInfo?.phone || "+1-000-000"}</span>
          <span>📧 {cvData.personalInfo?.email || "alicia@enhancv.com"}</span>
          <span>🔗 https://www.linkedin.com/isabelle</span>
          <span>📍 {cvData.personalInfo?.location || "New York City, NY"}</span>
        </div>
      </div>
      <div style={{ width: '50mm', height: '50mm', backgroundColor: '#fff', borderRadius: '2mm', marginLeft: '10mm' }}>
        <div style={{ 
          width: '100%', 
          height: '100%', 
          backgroundColor: '#ddd', 
          borderRadius: '2mm',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '9pt'
        }}>
          Photo
        </div>
      </div>
    </div>
  );

  const renderExperience = () => (
    <section style={{ marginBottom: '10mm' }}>
      <div style={{ 
        backgroundColor: '#fef3c7',
        color: '#b91c1c',
        padding: '2mm 4mm',
        marginBottom: '4mm',
        fontSize: '12pt',
        fontWeight: 700,
        textTransform: 'uppercase'
      }}>
        EXPERIENCE
      </div>
      <div>
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '8mm', backgroundColor: '#fef3c7', padding: '4mm', borderRadius: '2mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#b91c1c', marginBottom: '1mm' }}>
              {exp.title || "Senior IT Product Manager"}
            </div>
            <div style={{ fontSize: '10pt', color: '#ea580c', fontWeight: 600, marginBottom: '1mm' }}>
              {exp.company || "Lab Services"}
            </div>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '2mm' }}>
              📅 {exp.startDate || "02/2010"} - {exp.endDate || "04/2012"} 📍 {cvData.personalInfo?.location || "San Francisco, CA"}
            </div>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '2mm', fontStyle: 'italic' }}>
              Rover Games is a multi-play mobile game app development firm that has successful titles such as Drink Something, Trivia Tonight and King's Fight.
            </div>
            <ul style={{ fontSize: '9pt', color: '#333', paddingLeft: '5mm', lineHeight: 1.5 }}>
              {exp.description ? exp.description.split('\n').map((line, i) => <li key={i}>{line}</li>) : (
                <>
                  <li>Accelerated outbound sales cycle by 330% by designing and implementing customer acquisition platform for training and managing technical sales personnel</li>
                  <li>Established and curated strategic partnerships with 6 out of 10 top state manufacturing companies which resulted in $20M additional annual revenue</li>
                  <li>Led re-architect effort of a core SaaS product to reduce the platform deployment time for clients by 2 months</li>
                </>
              )}
            </ul>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No experience added yet</div>}
      </div>
    </section>
  );

  const renderKeyAchievements = () => (
    <section style={{ marginBottom: '10mm' }}>
      <div style={{ 
        backgroundColor: '#fef3c7',
        color: '#b91c1c',
        padding: '2mm 4mm',
        marginBottom: '4mm',
        fontSize: '12pt',
        fontWeight: 700,
        textTransform: 'uppercase'
      }}>
        KEY ACHIEVEMENTS
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4mm' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '3mm' }}>
            <span style={{ color: '#ea580c', fontSize: '12pt' }}>🚀</span>
            <div>
              <div style={{ fontWeight: 700, color: '#b91c1c', fontSize: '10pt', marginBottom: '1mm' }}>Record Project Delivery</div>
              <div style={{ fontSize: '9pt', color: '#666' }}>Facilitated the development of a full-featured SMB product in just 4 months.</div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '3mm' }}>
            <span style={{ color: '#ea580c', fontSize: '12pt' }}>👥</span>
            <div>
              <div style={{ fontWeight: 700, color: '#b91c1c', fontSize: '10pt', marginBottom: '1mm' }}>Mentoring</div>
              <div style={{ fontSize: '9pt', color: '#666' }}>Implemented 1-on-1 meeting rhythm within my team, reaching high employee happiness and the longest retention rate.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderCertifications = () => (
    <section style={{ marginBottom: '10mm' }}>
      <div style={{ 
        backgroundColor: '#fef3c7',
        color: '#b91c1c',
        padding: '2mm 4mm',
        marginBottom: '4mm',
        fontSize: '12pt',
        fontWeight: 700,
        textTransform: 'uppercase'
      }}>
        CERTIFICATIONS
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3mm' }}>
        <div>
          <div style={{ fontWeight: 700, color: '#b91c1c', fontSize: '10pt' }}>Certified Scrum Product Owner & Professional</div>
          <div style={{ fontSize: '9pt', color: '#666' }}>Scrum Alliance</div>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: '#b91c1c', fontSize: '10pt' }}>Agile Certified Practitioner</div>
          <div style={{ fontSize: '9pt', color: '#666' }}>Project Management Institute - PMI</div>
        </div>
      </div>
    </section>
  );

  const renderEducation = () => (
    <section style={{ marginBottom: '10mm' }}>
      <div style={{ 
        backgroundColor: '#fef3c7',
        color: '#b91c1c',
        padding: '2mm 4mm',
        marginBottom: '4mm',
        fontSize: '12pt',
        fontWeight: 700,
        textTransform: 'uppercase'
      }}>
        EDUCATION
      </div>
      <div>
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx} style={{ marginBottom: '4mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#b91c1c', marginBottom: '1mm' }}>
              {edu.degree || "MSc Project and Process Management"}
            </div>
            <div style={{ fontSize: '10pt', color: '#666' }}>
              {edu.school || "University of California, Berkeley"}
            </div>
            <div style={{ fontSize: '9pt', color: '#666' }}>
              📅 {edu.startDate || "10/2008"} - {edu.endDate || "01/2010"}
            </div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );

  const renderTechStack = () => (
    <section style={{ marginBottom: '10mm' }}>
      <div style={{ 
        backgroundColor: '#fef3c7',
        color: '#b91c1c',
        padding: '2mm 4mm',
        marginBottom: '4mm',
        fontSize: '12pt',
        fontWeight: 700,
        textTransform: 'uppercase'
      }}>
        TECH STACK
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '2mm' }}>
        {cvData.skills && cvData.skills.length > 0 ? cvData.skills.map((skill, idx) => (
          <div key={idx} style={{ 
            backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '2mm',
            textAlign: 'center',
            fontSize: '9pt',
            borderRadius: '1mm'
          }}>
            {skill}
          </div>
        )) : (
          <>
            <div style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '2mm', textAlign: 'center', fontSize: '9pt', borderRadius: '1mm' }}>Zoho Sprints</div>
            <div style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '2mm', textAlign: 'center', fontSize: '9pt', borderRadius: '1mm' }}>UserVoice</div>
            <div style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '2mm', textAlign: 'center', fontSize: '9pt', borderRadius: '1mm' }}>Amplitude</div>
            <div style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '2mm', textAlign: 'center', fontSize: '9pt', borderRadius: '1mm' }}>Intercom</div>
            <div style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '2mm', textAlign: 'center', fontSize: '9pt', borderRadius: '1mm' }}>VWO</div>
          </>
        )}
      </div>
    </section>
  );

  const renderPassions = () => (
    <section style={{ marginBottom: '10mm' }}>
      <div style={{ 
        backgroundColor: '#fef3c7',
        color: '#b91c1c',
        padding: '2mm 4mm',
        marginBottom: '4mm',
        fontSize: '12pt',
        fontWeight: 700,
        textTransform: 'uppercase'
      }}>
        PASSIONS
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3mm' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2mm' }}>
          <span style={{ color: '#ea580c', fontSize: '12pt' }}>🏃</span>
          <span style={{ fontSize: '10pt', color: '#333' }}>Running</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2mm' }}>
          <span style={{ color: '#ea580c', fontSize: '12pt' }}>🏂</span>
          <span style={{ fontSize: '10pt', color: '#333' }}>Adrenaline Sports</span>
        </div>
      </div>
    </section>
  );

  return (
    <div className="cv-page" style={{
      width: '210mm',
      minHeight: '297mm',
      padding: '20mm',
      backgroundColor: '#fff',
      boxSizing: 'border-box',
      fontFamily: 'Inter, sans-serif',
      color: '#222',
      margin: '0 auto',
      boxShadow: '0 0 0.5mm rgba(0,0,0,0.05)',
      position: 'relative',
      overflow: 'visible',
      display: 'block',
    }}>
      {(sectionMap["header"] || sectionMap["personalInfo"]) && renderHeader()}
      {sectionMap["experience"] && renderExperience()}
      {sectionMap["projects"] && renderProjects()}
      {renderKeyAchievements()}
      {renderCertifications()}
      {sectionMap["education"] && renderEducation()}
      {sectionMap["skills"] && renderTechStack()}
      {renderPassions()}
    </div>
  );
};

const ElegantProTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "header", "personalInfo", "experience", "projects", "education", "skills"
  ]).forEach(s => { sectionMap[s] = true; });

  const renderHeader = () => (
    <div style={{ display: 'flex', marginBottom: '12mm' }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: '24pt', fontWeight: 700, color: '#000', marginBottom: '3mm', textTransform: 'uppercase' }}>
          {cvData.personalInfo?.fullName || "JAMES MOORE"}
        </h1>
        <div style={{ fontSize: '12pt', color: '#666', marginBottom: '4mm' }}>
          Experienced Project Manager
        </div>
        <div style={{ fontSize: '10pt', color: '#666', marginBottom: '2mm' }}>
          📞 {cvData.personalInfo?.phone || "+1-000-000"} 
          📧 {cvData.personalInfo?.email || "james.moore@enhancv.com"}
        </div>
        <div style={{ fontSize: '10pt', color: '#666', marginBottom: '2mm' }}>
          🔗 https://www.linkedin.com/james-moore 
          📍 {cvData.personalInfo?.location || "New York City, NY"}
        </div>
      </div>
      <div style={{ 
        width: '60mm', 
        height: '60mm', 
        backgroundColor: '#b91c1c', 
        borderRadius: '5mm',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '20pt',
        fontWeight: 700,
        marginLeft: '10mm'
      }}>
        JM
      </div>
    </div>
  );

  const renderSummary = () => (
    <section style={{ marginBottom: '10mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm' }}>
        SUMMARY
      </h2>
      <p style={{ fontSize: '10pt', color: '#333', lineHeight: 1.6 }}>
        {cvData.personalInfo?.summary || "Result-orientated project team leader with 5 years of experience covering project and product management including developing, implementing and supporting complex infrastructures for fast growing startups. A fast and eager learner, I am detail orientated and adapt to changing project requirements quickly to meet business goals. Comfortable with ambiguity and thrive in fast-paced environment."}
      </p>
    </section>
  );

  const renderExperience = () => (
    <section style={{ marginBottom: '10mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm' }}>
        ENTREPRENEURIAL EXPERIENCE
      </h2>
      <div>
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '8mm' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1mm' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '11pt', color: '#000', marginBottom: '1mm' }}>
                  {exp.title || "Senior IT Product Manager"}
                </div>
                <div style={{ fontSize: '10pt', color: '#666', fontWeight: 600, marginBottom: '1mm' }}>
                  {exp.company || "Rover Games"}
                </div>
              </div>
              <div style={{ fontSize: '9pt', color: '#666', textAlign: 'right' }}>
                <div>{exp.startDate || "02/2019"} - {exp.endDate || "Present"}</div>
                <div>{cvData.personalInfo?.location || "San Francisco, CA"}</div>
              </div>
            </div>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '2mm', fontStyle: 'italic' }}>
              Rover Games is a multi-play mobile game app development firm that has successful titles such as Drink Something, Trivia Tonight and King's Fight.
            </div>
            <ul style={{ fontSize: '10pt', color: '#333', paddingLeft: '5mm', lineHeight: 1.5 }}>
              {exp.description ? exp.description.split('\n').map((line, i) => <li key={i}>{line}</li>) : (
                <>
                  <li>Accelerated outbound sales cycle by 330% by designing and implementing customer acquisition platform for training and managing technical sales personnel</li>
                  <li>Established and curated strategic partnerships with 6 out of 10 top state manufacturing companies which resulted in $20M additional annual revenue</li>
                  <li>Led re-architect effort of a core SaaS product to reduce the platform deployment time for clients by 2 months</li>
                </>
              )}
            </ul>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No experience added yet</div>}
      </div>
    </section>
  );

  const renderEducation = () => (
    <section style={{ marginBottom: '10mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm' }}>
        EDUCATION
      </h2>
      <div>
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx} style={{ marginBottom: '6mm' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '11pt', color: '#000', marginBottom: '1mm' }}>
                  {edu.degree || "Industrial Engineering, MSc"}
                </div>
                <div style={{ fontSize: '10pt', color: '#666', fontWeight: 600 }}>
                  {edu.school || "University of California, Berkeley"}
                </div>
              </div>
              <div style={{ fontSize: '9pt', color: '#666', textAlign: 'right' }}>
                <div>{edu.startDate || "2000"} - {edu.endDate || "2002"}</div>
                <div>Berkeley, CA</div>
              </div>
            </div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );

  const renderSkills = () => (
    <section style={{ marginBottom: '10mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm' }}>
        SKILLS
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3mm' }}>
        {cvData.skills && cvData.skills.length > 0 ? cvData.skills.map((skill, idx) => (
          <div key={idx} style={{ 
            backgroundColor: '#f0fdf4',
            color: '#166534',
            padding: '2mm',
            textAlign: 'center',
            fontSize: '10pt',
            borderRadius: '2mm',
            fontWeight: 600
          }}>
            {skill}
          </div>
        )) : (
          <>
            <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '2mm', textAlign: 'center', fontSize: '10pt', borderRadius: '2mm', fontWeight: 600 }}>Strategic Management</div>
            <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '2mm', textAlign: 'center', fontSize: '10pt', borderRadius: '2mm', fontWeight: 600 }}>Program Development</div>
            <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '2mm', textAlign: 'center', fontSize: '10pt', borderRadius: '2mm', fontWeight: 600 }}>Project Planning</div>
            <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '2mm', textAlign: 'center', fontSize: '10pt', borderRadius: '2mm', fontWeight: 600 }}>Stakeholder Engagement</div>
            <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '2mm', textAlign: 'center', fontSize: '10pt', borderRadius: '2mm', fontWeight: 600 }}>Financial Oversight</div>
          </>
        )}
      </div>
    </section>
  );

  const renderCourses = () => (
    <section style={{ marginBottom: '10mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm' }}>
        COURSES
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6mm' }}>
        <div>
          <div style={{ fontWeight: 700, color: '#000', fontSize: '10pt', marginBottom: '1mm' }}>Advanced Project Management Certification</div>
          <div style={{ fontSize: '9pt', color: '#666' }}>Focused on complex project management strategies, provided by the Project Management Institute.</div>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: '#000', fontSize: '10pt', marginBottom: '1mm' }}>Global Health Leadership and Management Certificate</div>
          <div style={{ fontSize: '9pt', color: '#666' }}>Covering leadership in international health contexts, provided by the University of Washington.</div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="cv-page" style={{
      width: '210mm',
      minHeight: '297mm',
      padding: '20mm',
      backgroundColor: '#fff',
      boxSizing: 'border-box',
      fontFamily: 'Inter, sans-serif',
      color: '#222',
      margin: '0 auto',
      boxShadow: '0 0 0.5mm rgba(0,0,0,0.05)',
      position: 'relative',
      overflow: 'visible',
      display: 'block',
    }}>
      {(sectionMap["header"] || sectionMap["personalInfo"]) && renderHeader()}
      {sectionMap["experience"] && renderExperience()}
      {renderSummary()}
      {renderKeyAchievements()}
      {renderProjects()}
      {sectionMap["education"] && renderEducation()}
      {renderCourses()}
      {sectionMap["skills"] && renderSkills()}
    </div>
  );
};

const HighPerformerTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "header", "personalInfo", "experience", "projects", "education", "skills"
  ]).forEach(s => { sectionMap[s] = true; });

  const renderHeader = () => (
    <div style={{ marginBottom: '10mm' }}>
      <h1 style={{ fontSize: '20pt', fontWeight: 700, color: '#0891b2', marginBottom: '2mm' }}>
        {cvData.personalInfo?.fullName || "ISAAC HALL"}
      </h1>
      <div style={{ fontSize: '12pt', color: '#0891b2', marginBottom: '3mm' }}>
        Project Director | Global Health | Strategic Planning
      </div>
      <div style={{ fontSize: '10pt', color: '#666', display: 'flex', flexWrap: 'wrap', gap: '6mm' }}>
        <span>📞 {cvData.personalInfo?.phone || "+1-(234)-555-1234"}</span>
        <span>📧 {cvData.personalInfo?.email || "help@enhancv.com"}</span>
        <span>🔗 linkedin.com</span>
        <span>📍 {cvData.personalInfo?.location || "Seattle, Washington"}</span>
      </div>
    </div>
  );

  const renderExperience = () => (
    <section style={{ marginBottom: '10mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #000', paddingBottom: '1mm' }}>
        EXPERIENCE
      </h2>
      <div>
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '8mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#000', marginBottom: '1mm' }}>
              {exp.title || "Project Director"}
            </div>
            <div style={{ fontSize: '10pt', color: '#0891b2', fontWeight: 600, marginBottom: '1mm' }}>
              {exp.company || "Global Health Initiative"}
            </div>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '2mm' }}>
              📅 {exp.startDate || "01/2017"} - {exp.endDate || "Present"} 📍 {cvData.personalInfo?.location || "Seattle, Washington"}
            </div>
            <ul style={{ fontSize: '10pt', color: '#333', paddingLeft: '5mm', lineHeight: 1.5 }}>
              {exp.description ? exp.description.split('\n').map((line, i) => <li key={i}>{line}</li>) : (
                <>
                  <li>Directed the execution of a $50M health project, aligning with international health security standards and increasing project scope by 20%.</li>
                  <li>Managed relationships with US Government stakeholders, resulting in a 15% increase in annual funding.</li>
                  <li>Led a cross-functional team of over 200 employees across 10 countries, enhancing project collaboration and efficiency.</li>
                </>
              )}
            </ul>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No experience added yet</div>}
      </div>
    </section>
  );

  const renderSummary = () => (
    <section style={{ marginBottom: '10mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #000', paddingBottom: '1mm' }}>
        SUMMARY
      </h2>
      <p style={{ fontSize: '10pt', color: '#333', lineHeight: 1.6 }}>
        {cvData.personalInfo?.summary || "Seasoned project director with a robust track record in global health, driven by a passion for enhancing healthcare systems and outcomes. With expertise in strategic planning and cross-functional team leadership, I have successfully managed multimillion-dollar initiatives and secured strategic partnerships. Excited to leverage my skills and experience to contribute to health innovations that positively impact communities worldwide, focusing on strategic management and program development to achieve transformative results."}
      </p>
    </section>
  );

  const renderProjects = () => (
    <section style={{ marginBottom: '10mm' }}>
      <div>
        {cvData.projects && cvData.projects.length > 0 ? cvData.projects.map((proj, idx) => (
          <div key={idx} style={{ marginBottom: '6mm' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2mm' }}>
              <div style={{ fontWeight: 700, fontSize: '10pt', color: '#000' }}>
                {proj.name || "Project name"}
              </div>
              <div style={{ fontSize: '10pt', color: '#0891b2', fontWeight: 600 }}>
                {proj.description || "Description"}
              </div>
            </div>
          </div>
        )) : null}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6mm' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '10pt', color: '#000', marginBottom: '1mm' }}>Global Health Security Initiative</div>
          <div style={{ fontSize: '9pt', color: '#0891b2', marginBottom: '2mm' }}>Enhanced health governance in 6 countries by driving evidence-based policy reforms, leading to improved healthcare outcomes.</div>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '10pt', color: '#000', marginBottom: '1mm' }}>Health Systems Strengthening Project</div>
          <div style={{ fontSize: '9pt', color: '#0891b2', marginBottom: '2mm' }}>Managed a $50M international health project, achieving 25% better healthcare outcomes through innovative technical strategies.</div>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '10pt', color: '#000', marginBottom: '1mm' }}>Community Health Outreach Program</div>
          <div style={{ fontSize: '9pt', color: '#0891b2', marginBottom: '2mm' }}>Launched preventive health campaigns, increasing community engagement and reducing disease rates by 15% in underserved areas.</div>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '10pt', color: '#000', marginBottom: '1mm' }}>International Partnership Project</div>
          <div style={{ fontSize: '9pt', color: '#0891b2', marginBottom: '2mm' }}>Negotiated five key international partnership agreements, expanding healthcare access and improving service delivery in multiple regions.</div>
        </div>
      </div>
    </section>
  );

  const renderKeyAchievements = () => (
    <section style={{ marginBottom: '10mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #000', paddingBottom: '1mm' }}>
        KEY ACHIEVEMENTS
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6mm' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2mm', marginBottom: '3mm' }}>
            <span style={{ color: '#0891b2', fontSize: '12pt' }}>✓</span>
            <div>
              <div style={{ fontWeight: 700, color: '#000', fontSize: '10pt', marginBottom: '1mm' }}>Led Policy Development Initiatives</div>
              <div style={{ fontSize: '9pt', color: '#666', lineHeight: 1.4 }}>Spearheaded health governance reforms in six countries, influencing policies and improving healthcare outcomes.</div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2mm', marginBottom: '3mm' }}>
            <span style={{ color: '#0891b2', fontSize: '12pt' }}>⭐</span>
            <div>
              <div style={{ fontWeight: 700, color: '#000', fontSize: '10pt', marginBottom: '1mm' }}>Optimized Project Execution</div>
              <div style={{ fontSize: '9pt', color: '#666', lineHeight: 1.4 }}>Directed a project valued at $50M, increasing scope and effectively maintaining high compliance with USG policies.</div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2mm', marginBottom: '3mm' }}>
            <span style={{ color: '#0891b2', fontSize: '12pt' }}>🎯</span>
            <div>
              <div style={{ fontWeight: 700, color: '#000', fontSize: '10pt', marginBottom: '1mm' }}>Enhanced Donor Relations</div>
              <div style={{ fontSize: '9pt', color: '#666', lineHeight: 1.4 }}>Secured an additional $5M in grant funding by establishing and nurturing key donor relationships.</div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2mm', marginBottom: '3mm' }}>
            <span style={{ color: '#0891b2', fontSize: '12pt' }}>⚡</span>
            <div>
              <div style={{ fontWeight: 700, color: '#000', fontSize: '10pt', marginBottom: '1mm' }}>Streamlined Reporting Mechanisms</div>
              <div style={{ fontSize: '9pt', color: '#666', lineHeight: 1.4 }}>Revised reporting practices, significantly cutting down reporting times and bolstering organizational decision-making.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderEducation = () => (
    <section style={{ marginBottom: '10mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #000', paddingBottom: '1mm' }}>
        EDUCATION
      </h2>
      <div>
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx} style={{ marginBottom: '4mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#000', marginBottom: '1mm' }}>
              {edu.degree || "Master's Degree in Public Health"}
            </div>
            <div style={{ fontSize: '10pt', color: '#0891b2', fontWeight: 600, marginBottom: '1mm' }}>
              {edu.school || "Johns Hopkins University"}
            </div>
            <div style={{ fontSize: '9pt', color: '#666' }}>
              📅 {edu.startDate || "01/2003"} - {edu.endDate || "01/2005"}
            </div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );

  const renderSkills = () => (
    <section style={{ marginBottom: '10mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #000', paddingBottom: '1mm' }}>
        SKILLS
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3mm' }}>
        {cvData.skills && cvData.skills.length > 0 ? cvData.skills.map((skill, idx) => (
          <div key={idx} style={{ 
            backgroundColor: '#f0fdf4',
            color: '#166534',
            padding: '2mm',
            textAlign: 'center',
            fontSize: '10pt',
            borderRadius: '2mm',
            fontWeight: 600
          }}>
            {skill}
          </div>
        )) : (
          <>
            <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '2mm', textAlign: 'center', fontSize: '10pt', borderRadius: '2mm', fontWeight: 600 }}>Strategic Management</div>
            <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '2mm', textAlign: 'center', fontSize: '10pt', borderRadius: '2mm', fontWeight: 600 }}>Program Development</div>
            <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '2mm', textAlign: 'center', fontSize: '10pt', borderRadius: '2mm', fontWeight: 600 }}>Project Planning</div>
            <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '2mm', textAlign: 'center', fontSize: '10pt', borderRadius: '2mm', fontWeight: 600 }}>Stakeholder Engagement</div>
            <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '2mm', textAlign: 'center', fontSize: '10pt', borderRadius: '2mm', fontWeight: 600 }}>Financial Oversight</div>
          </>
        )}
      </div>
    </section>
  );

  const renderCourses = () => (
    <section style={{ marginBottom: '10mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm' }}>
        COURSES
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6mm' }}>
        <div>
          <div style={{ fontWeight: 700, color: '#000', fontSize: '10pt', marginBottom: '1mm' }}>Advanced Project Management Certification</div>
          <div style={{ fontSize: '9pt', color: '#666' }}>Focused on complex project management strategies, provided by the Project Management Institute.</div>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: '#000', fontSize: '10pt', marginBottom: '1mm' }}>Global Health Leadership and Management Certificate</div>
          <div style={{ fontSize: '9pt', color: '#666' }}>Covering leadership in international health contexts, provided by the University of Washington.</div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="cv-page" style={{
      width: '210mm',
      minHeight: '297mm',
      padding: '20mm',
      backgroundColor: '#fff',
      boxSizing: 'border-box',
      fontFamily: 'Inter, sans-serif',
      color: '#222',
      margin: '0 auto',
      boxShadow: '0 0 0.5mm rgba(0,0,0,0.05)',
      position: 'relative',
      overflow: 'visible',
      display: 'block',
    }}>
      {(sectionMap["header"] || sectionMap["personalInfo"]) && renderHeader()}
      {sectionMap["experience"] && renderExperience()}
      {renderSummary()}
      {renderKeyAchievements()}
      {renderProjects()}
      {sectionMap["education"] && renderEducation()}
      {renderCourses()}
      {sectionMap["skills"] && renderSkills()}
    </div>
  );
};

const PreBuiltTemplates: React.FC<PreBuiltTemplatesProps> = ({ cvData, sections, templateId }) => {
  switch (templateId) {
    case "classicTemp":
      return <ClassicTemplate cvData={cvData} sections={sections} />;
    case "visionaryPro":
      return <VisionaryProTemplate cvData={cvData} sections={sections} />;
    case "elegantPro":
      return <ElegantProTemplate cvData={cvData} sections={sections} />;
    case "highPerformer":
      return <HighPerformerTemplate cvData={cvData} sections={sections} />;
    case "singleColumnTemp":
      return <SingleColumnTemplate cvData={cvData} sections={sections} />;
    case "monochromeTemp":
      return <MonochromeTemplate cvData={cvData} sections={sections} />;
    case "elegantTemp":
      return <ElegantTemplate cvData={cvData} sections={sections} />;
    case "timelineTemp":
      return <TimelineTemplate cvData={cvData} sections={sections} />;
    case "compactTemp":
      return <CompactTemplate cvData={cvData} sections={sections} />;
    case "headerTemp":
      return <HeaderTemplate cvData={cvData} sections={sections} />;
    default:
      return <ClassicTemplate cvData={cvData} sections={sections} />;
  }
};

export default PreBuiltTemplates;
