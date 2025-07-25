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

const SingleColumnTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "personalInfo", "experience", "education", "skills", "projects"
  ]).forEach(s => { sectionMap[s] = true; });

  const renderHeader = () => (
    <section style={{ marginBottom: '12mm' }}>
      <h1 style={{ fontSize: '24pt', fontWeight: 700, color: '#333', marginBottom: '3mm' }}>
        {cvData.personalInfo?.fullName || "Mason Turner"}
      </h1>
      <div style={{ fontSize: '14pt', color: '#4A90E2', fontWeight: 600, marginBottom: '3mm' }}>
        Experienced Sales Professional | B2B | Networking
      </div>
      <div style={{ fontSize: '10pt', color: '#666', marginBottom: '2mm' }}>
        📞 {cvData.personalInfo?.phone || "+1-(234)-555-1234"} &nbsp;&nbsp;
        📧 {cvData.personalInfo?.email || "help@enhancv.com"} &nbsp;&nbsp;
        🔗 linkedin.com
      </div>
      <div style={{ fontSize: '10pt', color: '#666' }}>
        📍 {cvData.personalInfo?.location || "Denver, Colorado"}
      </div>
    </section>
  );

  const renderSummary = () => (
    <section style={{ marginBottom: '10mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #333', paddingBottom: '1mm' }}>
        Summary
      </h2>
      <p style={{ fontSize: '10pt', color: '#333', lineHeight: 1.6 }}>
        {cvData.personalInfo?.summary || "Accomplished sales professional with a proven track record in B2B environments, consistently driving sales growth and building lasting client relationships. Known for increasing sales and improving client retention, eager to apply expertise in strategic planning and client management to achieve further success. Passionate about innovative sales strategies and technology, with a strong commitment to fostering meaningful business connections and delivering transformative solutions."}
      </p>
    </section>
  );

  const renderExperience = () => (
    <section style={{ marginBottom: '10mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #333', paddingBottom: '1mm' }}>
        Experience
      </h2>
      <div>
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '8mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#333', marginBottom: '1mm' }}>
              {exp.title || "Senior Account Executive"}
            </div>
            <div style={{ fontSize: '10pt', color: '#4A90E2', fontWeight: 600, marginBottom: '1mm' }}>
              {exp.company || "TechSolutions Inc."}
            </div>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '2mm' }}>
              📅 {exp.startDate || "01/2020"} - {exp.endDate || "Present"} 📍 {cvData.personalInfo?.location || "Denver, Colorado"}
            </div>
            <ul style={{ fontSize: '10pt', color: '#333', paddingLeft: '5mm', lineHeight: 1.5 }}>
              {exp.description ? exp.description.split('\n').map((line, i) => <li key={i} style={{ marginBottom: '1mm' }}>{line}</li>) : 
                <>
                  <li style={{ marginBottom: '1mm' }}>Drove a 150% increase in B2B software solutions sales over a two-year period by leveraging a consultative sales approach, tailored demonstrations and strategic partnerships.</li>
                  <li style={{ marginBottom: '1mm' }}>Initiated and nurtured relationships with key decision-makers across 40+ national accounts in the tech sector, resulting in a 20% boost in client retention and 35% growth in referral business.</li>
                </>
              }
            </ul>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No experience added yet</div>}
      </div>
    </section>
  );

  const renderEducation = () => (
    <section style={{ marginBottom: '10mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #333', paddingBottom: '1mm' }}>
        Education
      </h2>
      <div>
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx} style={{ marginBottom: '6mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#333', marginBottom: '1mm' }}>
              {edu.degree || "Master of Business Administration"}
            </div>
            <div style={{ fontSize: '10pt', color: '#4A90E2', fontWeight: 600, marginBottom: '1mm' }}>
              {edu.school || "University of Denver"}
            </div>
            <div style={{ fontSize: '9pt', color: '#666' }}>
              📅 {edu.startDate || "01/2011"} - {edu.endDate || "01/2013"} 📍 {cvData.personalInfo?.location || "Denver, Colorado"}
            </div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );

  const renderAchievements = () => (
    <section style={{ marginBottom: '10mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #333', paddingBottom: '1mm' }}>
        Key Achievements
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4mm' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2mm', marginBottom: '3mm' }}>
            <span style={{ color: '#4A90E2', fontSize: '12pt' }}>📈</span>
            <div>
              <div style={{ fontWeight: 700, color: '#333', fontSize: '10pt', marginBottom: '1mm' }}>Maximized Referral Business</div>
              <div style={{ fontSize: '9pt', color: '#666', lineHeight: 1.4 }}>Initiated a client referral program that resulted in a sustained 10% YoY increase in business for Innov8.</div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2mm', marginBottom: '3mm' }}>
            <span style={{ color: '#4A90E2', fontSize: '12pt' }}>✏️</span>
            <div>
              <div style={{ fontWeight: 700, color: '#333', fontSize: '10pt', marginBottom: '1mm' }}>Strategic Account Growth</div>
              <div style={{ fontSize: '9pt', color: '#666', lineHeight: 1.4 }}>Successfully expanded key account portfolio by 40% within 12 months at Global Logistics Solutions.</div>
            </div>
          </div>
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
      {renderHeader()}
      {cvData.personalInfo?.summary && renderSummary()}
      {sectionMap["experience"] && renderExperience()}
      {sectionMap["education"] && renderEducation()}
      {renderAchievements()}
    </div>
  );
};

const MonochromeTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "personalInfo", "experience", "education", "skills", "projects"
  ]).forEach(s => { sectionMap[s] = true; });

  const renderHeader = () => (
    <section style={{ marginBottom: '12mm' }}>
      <h1 style={{ fontSize: '24pt', fontWeight: 700, color: '#000', marginBottom: '3mm', textTransform: 'uppercase' }}>
        {cvData.personalInfo?.fullName || "Isabelle Todd"}
      </h1>
      <div style={{ fontSize: '12pt', color: '#666', marginBottom: '4mm' }}>
        I solve problems and help people overcome obstacles.
      </div>
      <div style={{ fontSize: '10pt', color: '#666', marginBottom: '2mm' }}>
        📞 {cvData.personalInfo?.phone || "000-123-456"} &nbsp;&nbsp;
        📧 {cvData.personalInfo?.email || "todd@enhancv.com"} &nbsp;&nbsp;
        🔗 linkedin.com/isabelle
      </div>
      <div style={{ fontSize: '10pt', color: '#666' }}>
        📍 {cvData.personalInfo?.location || "New York City, NY"}
      </div>
    </section>
  );

  const renderSummary = () => (
    <section style={{ marginBottom: '10mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #000', paddingBottom: '1mm' }}>
        Summary of Qualifications
      </h2>
      <p style={{ fontSize: '10pt', color: '#333', lineHeight: 1.6 }}>
        {cvData.personalInfo?.summary || "Result-orientated project team leader with 5 years of experience covering project and product management including developing, implementing and supporting complex infrastructures for fast growing startups. A fast and eager learner, I am detail orientated and adapt to changing project requirements quickly to meet business goals. Comfortable with ambiguity and thrive in fast-paced environment."}
      </p>
    </section>
  );

  const renderExperience = () => (
    <section style={{ marginBottom: '10mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #000', paddingBottom: '1mm' }}>
        Experience
      </h2>
      <div>
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '8mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#000', marginBottom: '1mm' }}>
              {exp.title || "Unit Director"}
            </div>
            <div style={{ fontSize: '10pt', color: '#666', fontWeight: 600, marginBottom: '1mm' }}>
              {exp.company || "Rover Games"}
            </div>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '2mm' }}>
              📅 {exp.startDate || "2019"} - {exp.endDate || "Present"} 📍 {cvData.personalInfo?.location || "New York City, NY"}
            </div>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '2mm', fontStyle: 'italic' }}>
              Tesla is an electric vehicle manufacturer that is revolutionizing the automobile industry
            </div>
            <ul style={{ fontSize: '10pt', color: '#333', paddingLeft: '5mm', lineHeight: 1.5 }}>
              {exp.description ? exp.description.split('\n').map((line, i) => <li key={i} style={{ marginBottom: '1mm' }}>{line}</li>) : 
                <>
                  <li style={{ marginBottom: '1mm' }}>Accelerated outbound sales cycle by 330% by designing and implementing customer acquisition platform for training and managing technical sales personnel</li>
                  <li style={{ marginBottom: '1mm' }}>Established and curated strategic partnerships with 6 out of 10 top state manufacturing companies which resulted in $20M additional annual revenue</li>
                </>
              }
            </ul>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No experience added yet</div>}
      </div>
    </section>
  );

  const renderEducation = () => (
    <section style={{ marginBottom: '10mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #000', paddingBottom: '1mm' }}>
        Education
      </h2>
      <div>
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx} style={{ marginBottom: '6mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#000', marginBottom: '1mm' }}>
              {edu.degree || "MSc Project and Process Management"}
            </div>
            <div style={{ fontSize: '10pt', color: '#666', fontWeight: 600, marginBottom: '1mm' }}>
              {edu.school || "Van Hall Larenstein University"}
            </div>
            <div style={{ fontSize: '9pt', color: '#666' }}>
              📅 {edu.startDate || "2008"} - {edu.endDate || "2010"}
            </div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );

  const renderCertification = () => (
    <section style={{ marginBottom: '10mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #000', paddingBottom: '1mm' }}>
        Certification
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4mm' }}>
        <div>
          <div style={{ fontWeight: 700, color: '#000', fontSize: '10pt', marginBottom: '1mm' }}>Certified Scrum Product Owner & Professional</div>
          <div style={{ fontSize: '9pt', color: '#666' }}>Scrum Alliance</div>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: '#000', fontSize: '10pt', marginBottom: '1mm' }}>Agile Certified Practitioner</div>
          <div style={{ fontSize: '9pt', color: '#666' }}>Project Management Institute - PMI</div>
        </div>
      </div>
    </section>
  );

  const renderTechnicalSkills = () => (
    <section style={{ marginBottom: '10mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #000', paddingBottom: '1mm' }}>
        Technical Skills
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '3mm' }}>
        {cvData.skills && cvData.skills.length > 0 ? cvData.skills.map((skill, idx) => (
          <div key={idx} style={{ fontSize: '10pt', color: '#333', textAlign: 'center', padding: '2mm', backgroundColor: '#f5f5f5', borderRadius: '2mm' }}>
            {skill}
          </div>
        )) : (
          <>
            <div style={{ fontSize: '10pt', color: '#333', textAlign: 'center', padding: '2mm', backgroundColor: '#f5f5f5', borderRadius: '2mm' }}>Zoho Sprints</div>
            <div style={{ fontSize: '10pt', color: '#333', textAlign: 'center', padding: '2mm', backgroundColor: '#f5f5f5', borderRadius: '2mm' }}>UserVoice</div>
            <div style={{ fontSize: '10pt', color: '#333', textAlign: 'center', padding: '2mm', backgroundColor: '#f5f5f5', borderRadius: '2mm' }}>Amplitude</div>
            <div style={{ fontSize: '10pt', color: '#333', textAlign: 'center', padding: '2mm', backgroundColor: '#f5f5f5', borderRadius: '2mm' }}>Intercom</div>
            <div style={{ fontSize: '10pt', color: '#333', textAlign: 'center', padding: '2mm', backgroundColor: '#f5f5f5', borderRadius: '2mm' }}>VWO</div>
            <div style={{ fontSize: '10pt', color: '#333', textAlign: 'center', padding: '2mm', backgroundColor: '#f5f5f5', borderRadius: '2mm' }}>Taboola</div>
            <div style={{ fontSize: '10pt', color: '#333', textAlign: 'center', padding: '2mm', backgroundColor: '#f5f5f5', borderRadius: '2mm' }}>Maven</div>
            <div style={{ fontSize: '10pt', color: '#333', textAlign: 'center', padding: '2mm', backgroundColor: '#f5f5f5', borderRadius: '2mm' }}>Hotjar</div>
          </>
        )}
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
      {renderHeader()}
      {cvData.personalInfo?.summary && renderSummary()}
      {sectionMap["experience"] && renderExperience()}
      {sectionMap["education"] && renderEducation()}
      {renderCertification()}
      {renderTechnicalSkills()}
    </div>
  );
};

const ElegantTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "personalInfo", "summary", "experience", "education", "achievements", "skills", "courses", "passions"
  ]).forEach(s => { sectionMap[s] = true; });

  const renderHeader = () => (
    <div style={{ padding: '20mm 0 10mm 0', backgroundColor: '#fff' }}>
      <h1 style={{ fontSize: '18pt', fontWeight: 700, letterSpacing: '1px', color: '#222', lineHeight: 1.2, marginBottom: '2mm', textTransform: 'uppercase' }}>
        {cvData.personalInfo?.fullName || "SAMUEL CAMPBELL"}
      </h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10mm', alignItems: 'center', fontSize: '10pt', color: '#666', marginBottom: '2mm' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '2mm' }}>
          <span>📞</span> {cvData.personalInfo?.phone || "+44 20 7123 4567"}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '2mm' }}>
          <span>✉️</span> {cvData.personalInfo?.email || "help@enhancv.com"}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '2mm' }}>
          <span>📍</span> {cvData.personalInfo?.location || "Manchester"}
        </span>
      </div>
    </div>
  );

  const renderSummary = () => (
    <section style={{ marginBottom: '8mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#1e3a8a', fontWeight: 600, marginBottom: '1mm' }}>Summary</div>
      <div style={{ borderTop: '1px solid #93c5fd', marginBottom: '2mm' }}></div>
      <p style={{ fontSize: '10pt', color: '#333', lineHeight: 1.6 }}>
        {cvData.personalInfo?.summary ||
          "With over a decade of IT project management experience, adept in Agile and Waterfall methodologies, I possess a robust track record of delivering sophisticated IT projects. My proactive approach has consistently driven projects to success against challenging timeframes, highlighting my strength in orchestrating application software and hardware upgrades to meet strategic business objectives."}
      </p>
    </section>
  );

  const renderExperience = () => (
    <section style={{ marginBottom: '8mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#1e3a8a', fontWeight: 600, marginBottom: '1mm' }}>Experience</div>
      <div style={{ borderTop: '1px solid #93c5fd', marginBottom: '2mm' }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '4mm' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
              <div style={{ fontWeight: 700, color: '#222', fontSize: '11pt' }}>{exp.title || "Senior IT Project Manager"}</div>
              <div style={{ fontSize: '9pt', color: '#666' }}>{exp.startDate || "06/2018"} - {exp.endDate || "Present"}</div>
            </div>
            <div style={{ color: '#1e3a8a', fontWeight: 600, fontSize: '10pt', marginBottom: '1mm' }}>{exp.company || "TechWave Solutions"}</div>
            <ul style={{ listStyleType: 'disc', paddingLeft: '5mm', fontSize: '10pt', color: '#333', lineHeight: 1.5, marginTop: '2mm' }}>
              {exp.description && <li>{exp.description}</li>}
            </ul>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No experience added yet</div>}
      </div>
    </section>
  );

  const renderEducation = () => (
    <section style={{ marginBottom: '8mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#1e3a8a', fontWeight: 600, marginBottom: '1mm' }}>Education</div>
      <div style={{ borderTop: '1px solid #93c5fd', marginBottom: '2mm' }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
              <div style={{ fontWeight: 700, color: '#222', fontSize: '11pt' }}>{edu.degree || "MSc Information Technology Management"}</div>
              <div style={{ fontSize: '9pt', color: '#666' }}>{edu.startDate || "01/2010"} - {edu.endDate || "01/2011"}</div>
            </div>
            <div style={{ color: '#1e3a8a', fontWeight: 600, fontSize: '10pt' }}>{edu.school || "University of Manchester"}</div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );

  const renderSkills = () => (
    <section style={{ marginBottom: '8mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#1e3a8a', fontWeight: 600, marginBottom: '1mm' }}>Skills</div>
      <div style={{ borderTop: '1px solid #93c5fd', marginBottom: '2mm' }}></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2mm' }}>
        {cvData.skills && cvData.skills.length > 0 ? (
          cvData.skills.map((skill, idx) => (
            <span key={idx} style={{ backgroundColor: '#1e3a8a', color: '#fff', padding: '2mm 4mm', borderRadius: '10pt', fontSize: '9pt' }}>
              {skill}
            </span>
          ))
        ) : (
          <span style={{ color: '#aaa', fontStyle: 'italic' }}>No skills added yet</span>
        )}
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
      {renderHeader()}
      {cvData.personalInfo?.summary && renderSummary()}
      {sectionMap["experience"] && renderExperience()}
      {sectionMap["education"] && renderEducation()}
      {sectionMap["skills"] && renderSkills()}
    </div>
  );
};

const TimelineTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "header", "summary", "experience", "projects", "education", "achievements", "skills"
  ]).forEach(s => { sectionMap[s] = true; });

  const renderHeader = () => (
    <div style={{ marginBottom: '6mm' }}>
      <h1 style={{ fontSize: '16pt', fontWeight: 700, letterSpacing: '0.5px', color: '#333', lineHeight: 1.2, marginBottom: '2mm' }}>
        {cvData.personalInfo?.fullName || "STEVE GREEN"}
      </h1>
      <div style={{ fontSize: '12pt', fontWeight: 600, color: '#d97706', marginTop: '1mm', marginBottom: '2mm' }}>
        {"Data Scientist | Machine Learning | AI Innovation"}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4mm', alignItems: 'center', fontSize: '9pt', color: '#555' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '1mm' }}>
          <span>📞</span> {cvData.personalInfo?.phone || "+44 20 7123 4567"}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '1mm' }}>
          <span>✉️</span> {cvData.personalInfo?.email || "help@enhancv.com"}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '1mm' }}>
          <span>🔗</span> {"linkedin.com/in/"}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '1mm' }}>
          <span>📍</span> {cvData.personalInfo?.location || "Reading, UK"}
        </span>
      </div>
    </div>
  );

  const renderSummary = () => (
    <section style={{ marginBottom: '8mm' }}>
      <div style={{ fontSize: '11pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '1mm' }}>Summary</div>
      <p style={{ fontSize: '10pt', color: '#333', lineHeight: 1.5 }}>
        {cvData.personalInfo?.summary || "Dedicated Data Scientist with a proven track record in predictive analytics, machine learning, and AI innovation. Skilled in developing advanced models to drive strategic decision-making and enhance operational efficiency. Experienced in optimizing algorithms for improved performance and leading collaborative teams to achieve remarkable results. Strong background in data governance and visualization. Enthusiastic about utilizing data-driven insights to contribute to impactful projects that align with business objectives and societal well-being."}
      </p>
    </section>
  );

  const renderExperience = () => (
    <section style={{ marginBottom: '8mm' }}>
      <div style={{ fontSize: '11pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '2mm' }}>Experience</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={exp.id || idx} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '6mm' }}>
            <div style={{ width: '40mm', fontSize: '9pt', color: '#555', fontWeight: 500, whiteSpace: 'nowrap' }}>
              {exp.startDate || "MM/YYYY"} - {exp.endDate || "MM/YYYY"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#333', fontSize: '10pt', marginBottom: '0.5mm' }}>
                {exp.title || "Data Scientist"}
              </div>
              <div style={{ fontWeight: 600, color: '#d97706', fontSize: '9pt', marginBottom: '1mm' }}>
                {exp.company || "Company"}
              </div>
              <ul style={{ listStyleType: 'disc', paddingLeft: '5mm', fontSize: '9pt', color: '#333', lineHeight: 1.4 }}>
                {exp.description ? exp.description.split('\n').map((line, i) => <li key={i}>{line}</li>) : <li>Job description</li>}
              </ul>
            </div>
          </div>
        )) : <div style={{ color: '#777', fontStyle: 'italic', fontSize: '9pt' }}>No experience added yet</div>}
      </div>
    </section>
  );

  const renderProjects = () => (
    <section style={{ marginBottom: '8mm' }}>
      <div style={{ fontSize: '11pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '2mm' }}>Projects</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
        {cvData.projects && cvData.projects.length > 0 ? cvData.projects.map((proj, idx) => (
          <div key={proj.id || idx} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '6mm' }}>
            <div style={{ width: '40mm', fontSize: '9pt', color: '#555', fontWeight: 500, whiteSpace: 'nowrap' }}>
              {proj.startDate || "MM/YYYY"} - {proj.endDate || "MM/YYYY"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#333', fontSize: '10pt', marginBottom: '0.5mm' }}>
                {proj.name || "Project Name"}
              </div>
              {proj.technologies && (
                <div style={{ fontWeight: 600, color: '#d97706', fontSize: '9pt', marginBottom: '1mm' }}>
                  {proj.technologies}
                </div>
              )}
              <div style={{ fontSize: '9pt', color: '#333', marginTop: '1mm', lineHeight: 1.4 }}>
                {proj.description || ""}
              </div>
            </div>
          </div>
        )) : <div style={{ color: '#777', fontStyle: 'italic', fontSize: '9pt' }}>No projects added yet</div>}
      </div>
    </section>
  );

  const renderEducation = () => (
    <section style={{ marginBottom: '8mm' }}>
      <div style={{ fontSize: '11pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '2mm' }}>Education</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={edu.id || idx} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '6mm' }}>
            <div style={{ width: '40mm', fontSize: '9pt', color: '#555', fontWeight: 500, whiteSpace: 'nowrap' }}>
              {edu.startDate || "MM/YYYY"} - {edu.endDate || "MM/YYYY"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#333', fontSize: '10pt', marginBottom: '0.5mm' }}>
                {edu.degree || "Degree"}
              </div>
              <div style={{ fontWeight: 600, color: '#d97706', fontSize: '9pt', marginBottom: '1mm' }}>
                {edu.school || "Institution"}
              </div>
            </div>
          </div>
        )) : <div style={{ color: '#777', fontStyle: 'italic', fontSize: '9pt' }}>No education added yet</div>}
      </div>
    </section>
  );

  const renderAchievements = () => (
    <section style={{ marginBottom: '8mm' }}>
      <div style={{ fontSize: '11pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '2mm' }}>Achievements</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4mm' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2mm' }}>
          <span style={{ color: '#eab308', fontSize: '12pt', marginTop: '0.5mm' }}>✔️</span>
          <div>
            <div style={{ fontWeight: 700, color: '#333', fontSize: '9pt' }}>Team Leadership</div>
            <div style={{ color: '#555', fontSize: '9pt', lineHeight: 1.4 }}>Successfully led a team of data scientists to improve productivity by 30% through strategic project management and mentoring.</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2mm' }}>
          <span style={{ color: '#eab308', fontSize: '12pt', marginTop: '0.5mm' }}>🏳️</span>
          <div>
            <div style={{ fontWeight: 700, color: '#333', fontSize: '9pt' }}>Machine Downtime Reduction</div>
            <div style={{ color: '#555', fontSize: '9pt', lineHeight: 1.4 }}>Developed a predictive maintenance model that reduced machine downtime by 20% and enhanced manufacturing efficiency.</div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderSkills = () => (
    <section style={{ marginBottom: '2mm' }}>
      <div style={{ fontSize: '11pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '2mm' }}>Skills</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4mm' }}>
        {cvData.skills && cvData.skills.length > 0 ? cvData.skills.map((skill, idx) => (
          <span key={idx} style={{ backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 700, padding: '1mm 3mm', borderRadius: '1mm', fontSize: '10pt' }}>
            {skill}
          </span>
        )) : <span style={{ color: '#777', fontStyle: 'italic', fontSize: '9pt' }}>No skills added yet</span>}
      </div>
    </section>
  );

  return (
    <div id="cv-content" style={{
      width: '210mm',
      minHeight: '297mm',
      margin: '0 auto',
      backgroundColor: '#fff',
      padding: '16mm',
      fontFamily: 'Inter, sans-serif',
      color: '#333',
      boxSizing: 'border-box',
      boxShadow: 'none',
      border: 'none',
      position: 'relative',
      overflow: 'visible',
      display: 'block'
    }}>
      {renderHeader()}
      {cvData.personalInfo?.summary && renderSummary()}
      {sectionMap["experience"] && renderExperience()}
      {sectionMap["projects"] && renderProjects()}
      {sectionMap["education"] && renderEducation()}
      {sectionMap["achievements"] && renderAchievements()}
      {sectionMap["skills"] && renderSkills()}
    </div>
  );
};

const CompactTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "personalInfo", "summary", "experience", "projects", "education", "achievements", "skills", "courses", "passions"
  ]).forEach(s => { sectionMap[s] = true; });

  const renderHeader = () => (
    <div style={{ padding: '20mm 0 6mm 0', backgroundColor: '#fff' }}>
      <h1 style={{ fontSize: '20pt', fontWeight: 700, color: '#222', marginBottom: '2mm' }}>
        {cvData.personalInfo?.fullName || "Mia Ward"}
      </h1>
      <div style={{ fontSize: '14pt', fontWeight: 600, color: '#2563eb', marginBottom: '3mm' }}>
        Data Scientist | Machine Learning | AI Innovation
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10mm', alignItems: 'center', fontSize: '10pt', color: '#666', marginBottom: '2mm' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '2mm' }}>
          <span>📞</span> {cvData.personalInfo?.phone || "+44 20 7123 4567"}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '2mm' }}>
          <span>✉️</span> {cvData.personalInfo?.email || "help@enhancv.com"}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '2mm' }}>
          <span>🔗</span> linkedin.com
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '2mm' }}>
          <span>📍</span> {cvData.personalInfo?.location || "Reading, UK"}
        </span>
      </div>
    </div>
  );

  const renderSummary = () => (
    <section style={{ marginBottom: '6mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#666', fontWeight: 600, marginBottom: '1mm' }}>Summary</div>
      <div style={{ borderTop: '1px solid #ccc', marginBottom: '2mm' }}></div>
      <p style={{ fontSize: '10pt', color: '#333', lineHeight: 1.6 }}>
        {cvData.personalInfo?.summary || "Enthusiastic Data Scientist with a proven track record in leading innovative AI and machine learning projects. Experienced in developing predictive analytics models, improving data processing efficiency, and enhancing customer insights. Skilled in team leadership and collaborating across functions to drive strategic decision-making. MSc in Data Science from a prestigious university. Passionate about predictive analytics, AI for social good, and data-driven storytelling, aligning with the mission of leveraging data for impactful solutions."}
      </p>
    </section>
  );

  const renderExperience = () => (
    <section style={{ marginBottom: '6mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#666', fontWeight: 600, marginBottom: '1mm' }}>Experience</div>
      <div style={{ borderTop: '1px solid #ccc', marginBottom: '2mm' }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '2mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#222', lineHeight: 1.3 }}>{exp.title || "Job Title"}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4mm', marginBottom: '1mm' }}>
              <div style={{ color: '#2563eb', fontWeight: 600, fontSize: '10pt' }}>{exp.company || "Company"}</div>
              <span style={{ color: '#666', fontSize: '9pt' }}>{exp.startDate || "MM/YYYY"} - {exp.endDate || "MM/YYYY"}</span>
            </div>
            <ul style={{ listStyleType: 'disc', paddingLeft: '5mm', fontSize: '10pt', color: '#333', lineHeight: 1.5, marginTop: '1mm' }}>
              {exp.description ? exp.description.split('\n').map((line, i) => <li key={i}>{line}</li>) : <li>Job description</li>}
            </ul>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No experience added yet</div>}
      </div>
    </section>
  );

  const renderProjects = () => (
    <section style={{ marginBottom: '6mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#666', fontWeight: 600, marginBottom: '1mm' }}>Projects</div>
      <div style={{ borderTop: '1px solid #ccc', marginBottom: '2mm' }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
        {cvData.projects && cvData.projects.length > 0 ? cvData.projects.map((proj, idx) => (
          <div key={idx} style={{ marginBottom: '2mm' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
              <div style={{ fontWeight: 700, color: '#222', fontSize: '10pt' }}>{proj.name || "Project Name"}</div>
              <div style={{ fontSize: '9pt', color: '#666' }}>{proj.startDate || ""} - {proj.endDate || ""}</div>
            </div>
            <p style={{ fontSize: '10pt', color: '#333', marginTop: '1mm' }}>{proj.description || ""}</p>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No projects added yet</div>}
      </div>
    </section>
  );

  const renderEducation = () => (
    <section style={{ marginBottom: '6mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#2563eb', fontWeight: 600, marginBottom: '1mm' }}>Education</div>
      <div style={{ borderTop: '1px solid #93c5fd', marginBottom: '2mm' }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4mm' }}>
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx}>
            <div style={{ fontWeight: 700, color: '#222', fontSize: '10pt' }}>{edu.degree || "MSc in Data Science"}</div>
            <div style={{ color: '#2563eb', fontWeight: 600, fontSize: '10pt' }}>{edu.school || "University College London"}</div>
            <div style={{ fontSize: '9pt', color: '#666' }}>{edu.startDate || "01/2014"} - {edu.endDate || "01/2015"}</div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );

  const renderAchievements = () => (
    <section style={{ marginBottom: '6mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#2563eb', fontWeight: 600, marginBottom: '1mm' }}>Achievements</div>
      <div style={{ borderTop: '1px solid #93c5fd', marginBottom: '2mm' }}></div>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '2mm' }}>
        <li>
          <div style={{ fontWeight: 700, color: '#222', fontSize: '10pt' }}>Team Leadership</div>
          <div style={{ color: '#555', fontSize: '9pt' }}>Successfully led a team of data scientists to improve productivity by 30% through strategic project management and mentoring.</div>
        </li>
        <li>
          <div style={{ fontWeight: 700, color: '#222', fontSize: '10pt' }}>Machine Downtime Reduction</div>
          <div style={{ color: '#555', fontSize: '9pt' }}>Developed a predictive maintenance model that reduced machine downtime by 20% and enhanced manufacturing efficiency.</div>
        </li>
        <li>
          <div style={{ fontWeight: 700, color: '#222', fontSize: '10pt' }}>Sales Campaign Enhancement</div>
          <div style={{ color: '#555', fontSize: '9pt' }}>Applied cluster analysis in customer segmentation, increasing conversion rates by 17% in targeted marketing campaigns.</div>
        </li>
        <li>
          <div style={{ fontWeight: 700, color: '#222', fontSize: '10pt' }}>Forecasting Model Development</div>
          <div style={{ color: '#555', fontSize: '9pt' }}>Created an AI-driven forecast model that increased predictive accuracy by 20%, significantly impacting strategic planning.</div>
        </li>
      </ul>
    </section>
  );

  const renderSkills = () => (
    <section style={{ marginBottom: '6mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#2563eb', fontWeight: 600, marginBottom: '1mm' }}>Skills</div>
      <div style={{ borderTop: '1px solid #93c5fd', marginBottom: '2mm' }}></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2mm' }}>
        {cvData.skills && cvData.skills.length > 0 ? cvData.skills.map((skill, idx) => (
          <span key={idx} style={{ backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 700, padding: '2mm 3mm', borderRadius: '2mm', fontSize: '9pt' }}>
            {skill}
          </span>
        )) : <span style={{ color: '#aaa', fontStyle: 'italic' }}>No skills added yet</span>}
      </div>
    </section>
  );

  const renderCourses = () => (
    <section style={{ marginBottom: '6mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#2563eb', fontWeight: 600, marginBottom: '1mm' }}>Courses</div>
      <div style={{ borderTop: '1px solid #93c5fd', marginBottom: '2mm' }}></div>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '2mm' }}>
        <li>
          <div style={{ fontWeight: 700, color: '#222', fontSize: '10pt' }}>Applied Data Science with Python</div>
          <div style={{ color: '#555', fontSize: '9pt' }}>Acquired advanced Python programming skills for data science through this course offered by the University of Michigan.</div>
        </li>
        <li>
          <div style={{ fontWeight: 700, color: '#222', fontSize: '10pt' }}>Machine Learning Specialization</div>
          <div style={{ color: '#555', fontSize: '9pt' }}>Completed a series of courses focused on machine learning techniques, provided by Stanford University online.</div>
        </li>
      </ul>
    </section>
  );

  const renderPassions = () => (
    <section style={{ marginBottom: '6mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#2563eb', fontWeight: 600, marginBottom: '1mm' }}>Passions</div>
      <div style={{ borderTop: '1px solid #93c5fd', marginBottom: '2mm' }}></div>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '2mm' }}>
        <li>
          <div style={{ fontWeight: 700, color: '#222', fontSize: '10pt' }}>Predictive Analytics</div>
          <div style={{ color: '#555', fontSize: '9pt' }}>Passionate about uncovering trends and making accurate predictions that drive business success through data analysis.</div>
        </li>
        <li>
          <div style={{ fontWeight: 700, color: '#222', fontSize: '10pt' }}>AI for Social Good</div>
          <div style={{ color: '#555', fontSize: '9pt' }}>Interested in applying AI for solving complex societal challenges and contributing to community-centric projects.</div>
        </li>
        <li>
          <div style={{ fontWeight: 700, color: '#222', fontSize: '10pt' }}>Data-Driven Storytelling</div>
          <div style={{ color: '#555', fontSize: '9pt' }}>Enjoy exploring the narrative potential of data and translating complex insights into compelling stories for diverse audiences.</div>
        </li>
      </ul>
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
      {renderHeader()}
      {cvData.personalInfo?.summary && renderSummary()}
      {sectionMap["experience"] && renderExperience()}
      {sectionMap["projects"] && renderProjects()}
      {sectionMap["education"] && renderEducation()}
      {sectionMap["achievements"] && renderAchievements()}
      {sectionMap["skills"] && renderSkills()}
      {sectionMap["courses"] && renderCourses()}
      {sectionMap["passions"] && renderPassions()}
    </div>
  );
};

const HeaderTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "personalInfo", "summary", "experience", "projects", "education", "skills"
  ]).forEach(s => { sectionMap[s] = true; });

  const renderHeader = () => (
    <div style={{ 
      borderRadius: '5mm 5mm 0 0', 
      backgroundColor: '#f0fdf4', 
      border: '1px solid #bbf7d0', 
      padding: '16mm 20mm 6mm 20mm', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '2mm' 
    }}>
      <div>
        <h1 style={{ fontSize: '18pt', fontWeight: 700, color: '#222', marginBottom: '1mm' }}>
          {cvData.personalInfo?.fullName || "Kane Jones"}
        </h1>
        <div style={{ fontSize: '10pt', color: '#555', marginBottom: '1mm' }}>
          {cvData.personalInfo?.email || "kjn_77es14@yahoo.com"} • {cvData.personalInfo?.phone || "(512)701-9215"}
        </div>
        <div style={{ fontSize: '10pt', color: '#555' }}>
          {cvData.personalInfo?.location || "88 Lorenzo Road, Austin, United States, TX 73301"}
        </div>
      </div>
    </div>
  );

  const renderSummary = () => (
    <section style={{ marginTop: '6mm', marginBottom: '8mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#16a34a', fontWeight: 600, marginBottom: '1mm' }}>Summary</div>
      <div style={{ borderTop: '1px solid #bbf7d0', marginBottom: '2mm' }}></div>
      <p style={{ fontSize: '10pt', color: '#555', lineHeight: 1.6 }}>
        {cvData.personalInfo?.summary ||
          "Knowledgeable and experienced Bookkeeper with extensive knowledge handling and documenting financial transactions according to policies and preferred procedures. Experienced in maintaining accounts, processing accounts payable and receivable, managing invoices, and delegating payroll. Bringing forth excellent customer service skills, strong organizational skills, and the ability to communicate well with others."}
      </p>
    </section>
  );

  const renderExperience = () => (
    <section style={{ marginBottom: '8mm' }}>
      <div style={{ fontSize: '12pt', fontWeight: 600, color: '#16a34a', marginBottom: '2mm' }}>Career Experience</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
              <div style={{ fontWeight: 600, color: '#333', fontSize: '10pt' }}>
                {exp.title || "Bookkeeper"} at {exp.company || "Company"}
              </div>
              <div style={{ color: '#666', fontSize: '9pt' }}>{exp.startDate || "Start"} — {exp.endDate || "End"}</div>
            </div>
            <ul style={{ listStyleType: 'disc', paddingLeft: '6mm', fontSize: '10pt', color: '#555', lineHeight: 1.5, marginTop: '1mm' }}>
              {exp.description ? exp.description.split('\n').map((line, i) => <li key={i}>{line}</li>) : <li>Job description</li>}
            </ul>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No experience added yet</div>}
      </div>
    </section>
  );

  const renderProjects = () => (
    <section style={{ marginBottom: '8mm' }}>
      <div style={{ fontSize: '12pt', fontWeight: 600, color: '#16a34a', marginBottom: '2mm' }}>Projects</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
        {cvData.projects && cvData.projects.length > 0 ? cvData.projects.map((proj, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
              <div style={{ fontWeight: 600, color: '#333', fontSize: '10pt' }}>{proj.name || "Project Name"}</div>
              <div style={{ color: '#666', fontSize: '9pt' }}>{proj.startDate || "Start"} — {proj.endDate || "End"}</div>
            </div>
            <p style={{ fontSize: '10pt', color: '#555', lineHeight: 1.5, marginTop: '1mm' }}>{proj.description || ""}</p>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No projects added yet</div>}
      </div>
    </section>
  );

  const renderEducation = () => (
    <section style={{ marginBottom: '8mm' }}>
      <div style={{ fontSize: '12pt', fontWeight: 600, color: '#16a34a', marginBottom: '2mm' }}>Education</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
              <div style={{ fontWeight: 600, color: '#333', fontSize: '10pt' }}>{edu.degree || "Degree"}, {edu.school || "School"}</div>
              <div style={{ color: '#666', fontSize: '9pt' }}>{edu.startDate || "Start"} — {edu.endDate || "End"}</div>
            </div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );

  const renderSkills = () => (
    <section style={{ marginBottom: '8mm' }}>
      <div style={{ fontSize: '12pt', fontWeight: 600, color: '#16a34a', marginBottom: '2mm' }}>Skills</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2mm' }}>
        {cvData.skills && cvData.skills.length > 0 ? cvData.skills.map((skill, idx) => (
          <span key={idx} style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '2mm 3mm', borderRadius: '2mm', fontSize: '10pt' }}>
            {typeof skill === "string" ? skill : "Skill"}
          </span>
        )) : <span style={{ color: '#aaa', fontStyle: 'italic' }}>No skills added yet</span>}
      </div>
    </section>
  );

  return (
    <div className="cv-page" style={{
      width: '210mm',
      minHeight: '297mm',
      backgroundColor: '#fff',
      border: '1px solid #bbf7d0',
      boxShadow: '0 0 0.5mm rgba(0,0,0,0.05)',
      fontFamily: 'Inter, sans-serif',
      color: '#222',
      fontSize: '10pt',
      borderRadius: '5mm',
      overflow: 'hidden',
      margin: '0 auto',
      position: 'relative',
      display: 'block'
    }}>
      {renderHeader()}
      <div style={{ padding: '0 20mm 20mm 20mm' }}>
        {cvData.personalInfo?.summary && renderSummary()}
        {sectionMap["experience"] && renderExperience()}
        {sectionMap["projects"] && renderProjects()}
        {sectionMap["education"] && renderEducation()}
        {sectionMap["skills"] && renderSkills()}
      </div>
    </div>
  );
};

const PreBuiltTemplates: React.FC<PreBuiltTemplatesProps> = ({ cvData, sections, templateId }) => {
  switch (templateId) {
    case "classicTemp":
      return <ClassicTemplate cvData={cvData} sections={sections} />;
    case "singleColumn":
      return <SingleColumnTemplate cvData={cvData} sections={sections} />;
    case "monochrome":
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
