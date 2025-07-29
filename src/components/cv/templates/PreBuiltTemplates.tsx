import React from "react";
import { CVData } from "@/types/cv";

interface PreBuiltTemplatesProps {
  cvData: Partial<CVData>;
  sections?: string[];
  templateId: string;
}

// Design options utility functions
const getFontFamily = (font?: string) => {
  switch (font) {
    case 'roboto': return 'Roboto, sans-serif';
    case 'open-sans': return 'Open Sans, sans-serif';
    case 'lato': return 'Lato, sans-serif';
    case 'poppins': return 'Poppins, sans-serif';
    case 'montserrat': return 'Montserrat, sans-serif';
    case 'raleway': return 'Raleway, sans-serif';
    case 'source-sans-pro': return 'Source Sans Pro, sans-serif';
    default: return 'Inter, sans-serif';
  }
};

const getColorStyles = (primaryColor?: string, secondaryColor?: string) => {
  const colorMap = {
    blue: { primary: '#3B82F6', secondary: '#1E40AF', bg: '#DBEAFE' },
    purple: { primary: '#8B5CF6', secondary: '#6D28D9', bg: '#EDE9FE' },
    green: { primary: '#10B981', secondary: '#059669', bg: '#D1FAE5' },
    red: { primary: '#EF4444', secondary: '#DC2626', bg: '#FEE2E2' },
    orange: { primary: '#F97316', secondary: '#EA580C', bg: '#FED7AA' },
    pink: { primary: '#EC4899', secondary: '#DB2777', bg: '#FCE7F3' },
    indigo: { primary: '#6366F1', secondary: '#4F46E5', bg: '#E0E7FF' },
    teal: { primary: '#14B8A6', secondary: '#0D9488', bg: '#CCFBF1' },
  };

  // Check if primaryColor is a hex color (starts with #)
  let primary;
  if (primaryColor && primaryColor.startsWith('#')) {
    // Create a slightly darker version for secondary shade
    const darkerShade = getDarkerShade(primaryColor);
    // Create a lighter version for background
    const lighterShade = getLighterShade(primaryColor);
    primary = { primary: primaryColor, secondary: darkerShade, bg: lighterShade };
  } else {
    primary = colorMap[primaryColor as keyof typeof colorMap] || colorMap.blue;
  }

  // Check if secondaryColor is a hex color (starts with #)
  let secondary;
  if (secondaryColor && secondaryColor.startsWith('#')) {
    // Create a slightly darker version for secondary shade
    const darkerShade = getDarkerShade(secondaryColor);
    // Create a lighter version for background
    const lighterShade = getLighterShade(secondaryColor);
    secondary = { primary: secondaryColor, secondary: darkerShade, bg: lighterShade };
  } else {
    secondary = colorMap[secondaryColor as keyof typeof colorMap] || colorMap.purple;
  }

  return { primary, secondary };
};

// Helper function to create a darker shade of a hex color
const getDarkerShade = (hexColor: string): string => {
  // Remove the # if present
  const hex = hexColor.replace('#', '');
  
  // Convert hex to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Make darker by reducing each component by 20%
  r = Math.max(0, Math.floor(r * 0.8));
  g = Math.max(0, Math.floor(g * 0.8));
  b = Math.max(0, Math.floor(b * 0.8));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Helper function to create a lighter shade of a hex color for background
const getLighterShade = (hexColor: string): string => {
  // Remove the # if present
  const hex = hexColor.replace('#', '');
  
  // Convert hex to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Make lighter by increasing each component and mixing with white
  r = Math.min(255, Math.floor(r + (255 - r) * 0.85));
  g = Math.min(255, Math.floor(g + (255 - g) * 0.85));
  b = Math.min(255, Math.floor(b + (255 - b) * 0.85));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};


const CV_PAGE_STYLE: React.CSSProperties = {
  width: '210mm',
  minHeight: '297mm',
  padding: '20mm',
  backgroundColor: '#fff',
  boxSizing: 'border-box',
  // fontFamily: 'Inter, sans-serif',
  color: '#222',
  margin: '0 auto',
  boxShadow: '0 0 0.5mm rgba(0,0,0,0.05)',
  position: 'relative',
  overflow: 'visible',
  display: 'block',
};

// Finished
const ClassicTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "personalInfo", "experience", "education", "skills", "references"
  ]).forEach(s => { sectionMap[s] = true; });

  const DesignFontFamily = getFontFamily(cvData.designOptions?.font);
  const designColors = getColorStyles(cvData.designOptions?.primaryColor, cvData.designOptions?.secondaryColor);

  const renderProfile = () => (
    <section style={{ marginBottom: '6mm' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '18pt',  fontWeight: 700, letterSpacing: '0.5px', marginBottom: '1mm' }}>{cvData.personalInfo?.fullName || "Your Name"}</h1>
        {cvData.personalInfo?.title &&
          <h1 style={{ fontSize: '12pt',  fontWeight: 500, letterSpacing: '0.5px', marginBottom: '1mm' }}>{cvData.personalInfo?.title}</h1>
        }
        <div style={{ fontSize: '10pt', color: '#555', marginBottom:'2mm' }}>
          {cvData.personalInfo?.location || "80 Gold Street, New York, NY 10038, United States"}, {cvData.personalInfo?.phone || "(917) 407-2179"}, {cvData.personalInfo?.email || "tim.stewart@gmail.com"}
        </div>
        <div style={{ fontSize: '10pt', color: '#555' }}>
          {cvData.personalInfo?.linkedin && 
      <span>
      {cvData.personalInfo?.linkedin?.includes("https://") ? cvData.personalInfo?.linkedin?.split('https://')[1] : cvData.personalInfo?.linkedin}
      </span>
      }
      {cvData.personalInfo?.personal_website &&
      <span>
      &nbsp;&nbsp; {cvData.personalInfo?.personal_website?.includes("https://") ? cvData.personalInfo?.personal_website?.split('https://')[1] : cvData.personalInfo?.personal_website}
      </span>
      }
      {cvData.personalInfo?.github &&
      <span>
      &nbsp;&nbsp; {cvData.personalInfo?.github?.includes("https://") ? cvData.personalInfo?.github?.split('https://')[1] : cvData.personalInfo?.github}
      </span>
      }
        </div>
      </div>
      {cvData.personalInfo?.summary && 
      <div style={{ marginTop: '6mm' }}>
        <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#555', fontWeight: 600, marginBottom: '1mm' }}>Profile</div>
        <div style={{ borderTop: '1px solid #ccc', marginBottom: '2mm' }}></div>
        <p style={{ fontSize: '10pt', color: '#333', lineHeight: 1.5, }}>
          {cvData.personalInfo?.summary || null }
        </p>
      </div>
      }
    </section>
  );

  const renderEmployment = () => (
    <section style={{ marginBottom: '6mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#555', fontWeight: 600, marginBottom: '1mm' }}>Employment History</div>
      <div style={{ borderTop: '1px solid #ccc', marginBottom: '2mm' }}></div>
      <div>
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '4mm', overflow: 'hidden' ,  paddingBottom: '1mm' }}>
            <div style={{ float: 'left', width: '40mm', fontSize: '10pt', color: '#555', marginBottom: '1mm', whiteSpace: 'nowrap', }}>{exp.startDate || ""} — {exp.endDate || ""}</div>
            <div style={{ marginLeft: '45mm' }}>
              <div style={{ fontWeight: 600, color: '#222', fontSize: '11pt' }}>{exp.title || "Job Title"}, {exp.company || "Company"}</div>
              <ul style={{ paddingLeft: '5mm', fontSize: '10pt', color: '#333', marginTop: '1mm', }}>
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
    <section style={{ marginBottom: '6mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#555', fontWeight: 600, marginBottom: '1mm' }}>Education</div>
      <div style={{ borderTop: '1px solid #ccc', marginBottom: '2mm' }}></div>
      <div>
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx} style={{ marginBottom: '4mm', overflow: 'hidden', paddingBottom: '1mm' }}>
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

    const renderLanguages = () => (
    <section style={{ marginBottom: '6mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#555', fontWeight: 600, marginBottom: '1mm' }}>Languages</div>
      <div style={{ borderTop: '1px solid #ccc', marginBottom: '2mm' }}></div>
      <div>
        {cvData.languages && cvData.languages.length > 0 ? cvData.languages.map((lan, idx) => (
          <div key={idx} style={{ marginBottom: '4mm', overflow: 'hidden', paddingBottom: '1mm' }}>
            <div style={{ float: 'left', width: '40mm', fontSize: '10pt', color: '#555', marginBottom: '1mm', whiteSpace: 'nowrap' }}>{lan.proficiency || ""}</div>
            <div style={{ marginLeft: '45mm' }}>
              <div style={{ fontWeight: 600, color: '#222', fontSize: '11pt' }}>{lan.name}</div>
            </div>
            <div style={{ clear: 'both' }}></div>
          </div>
        )) : null}
      </div>
    </section>
  );

  const renderCourses = () => (
    <section style={{ marginBottom: '6mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#555', fontWeight: 600, marginBottom: '1mm' }}>Courses</div>
      <div style={{ borderTop: '1px solid #ccc', marginBottom: '2mm' }}></div>
      <div>
        {cvData.courses && cvData.courses.length > 0 ? cvData.courses.map((course, idx) => (
          <div key={idx} style={{ marginBottom: '4mm', overflow: 'hidden', paddingBottom: '1mm' }}>
            <div style={{ float: 'left', width: '40mm', fontSize: '10pt', color: '#555', marginBottom: '1mm', whiteSpace: 'nowrap' }}>{course.date || ""}</div>
            <div style={{ marginLeft: '45mm' }}>
              <div style={{ fontWeight: 600, color: '#222', fontSize: '11pt' }}>{course.name}</div>
              <div style={{ fontWeight: 500, color: '#666', fontSize: '9pt' }}>{course.institution}</div>
              <div style={{ fontWeight: 400, color: '#333', fontSize: '7pt' }}>{course.description}</div>
            </div>
            <div style={{ clear: 'both' }}></div>
          </div>
        )) : null}
      </div>
    </section>
  );

    const renderCertificates = () => (
    <section style={{ marginBottom: '6mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#555', fontWeight: 600, marginBottom: '1mm' }}>Certificates</div>
      <div style={{ borderTop: '1px solid #ccc', marginBottom: '2mm' }}></div>
      <div>
        {cvData.certificates && cvData.certificates.length > 0 ? cvData.certificates.map((cer, idx) => (
          <div key={idx} style={{ marginBottom: '4mm', overflow: 'hidden', paddingBottom: '1mm' }}>
            <div style={{ float: 'left', width: '40mm', fontSize: '10pt', color: '#555', marginBottom: '1mm', whiteSpace: 'nowrap' }}>{cer.date || ""}</div>
            <div style={{ marginLeft: '45mm' }}>
              <div style={{ fontWeight: 600, color: '#222', fontSize: '11pt' }}>{cer.name}</div>
              <div style={{ fontWeight: 500, color: '#666', fontSize: '9pt' }}>{cer.issuer}</div>
              <div style={{ fontWeight: 500, color: '#666', fontSize: '8pt' }}>{cer.link}</div>
              <div style={{ fontWeight: 400, color: '#333', fontSize: '7pt' }}>{cer.description}</div>
            </div>
            <div style={{ clear: 'both' }}></div>
          </div>
        )) : null}
      </div>
    </section>
  );

  const renderSkills = () => (
    <section style={{ marginBottom: '6mm' }}>
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
    <section style={{ marginBottom: '6mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#555', fontWeight: 600, marginBottom: '1mm' }}>References</div>
      <div style={{ borderTop: '1px solid #ccc', marginBottom: '2mm' }}></div>
      <div style={{ fontSize: '10pt', color: '#333', }}>
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
    <section style={{ marginBottom: '6mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#555', fontWeight: 600, marginBottom: '1mm' }}>Projects</div>
      <div style={{ borderTop: '1px solid #ccc', marginBottom: '2mm' }}></div>
      <div>
        {cvData.projects && cvData.projects.length > 0 ? cvData.projects.map((proj, idx) => (
          <div key={idx} style={{ marginBottom: '4mm', overflow: 'hidden' , paddingBottom: '1mm' }}>
            <div style={{ float: 'left', width: '40mm', fontSize: '10pt', color: '#555', marginBottom: '1mm', whiteSpace: 'nowrap' }}>{proj.startDate || ""} — {proj.endDate || ""}</div>
            <div style={{ marginLeft: '45mm' }}>
              <div style={{ fontWeight: 600, color: '#222', fontSize: '11pt' }}>{proj.name || "Project Name"}</div>
              <div style={{ fontSize: '9pt', color: '#666', fontStyle: 'italic' }}>
                  {proj.technologies && (
                    <div style={{ fontWeight: 600, fontSize: '9pt', marginBottom: '1mm' }}>
                      {proj.technologies}
                    </div>
                  )}
            </div>
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
      ...CV_PAGE_STYLE,
      fontFamily: DesignFontFamily
    }}>
      {(sectionMap["profile"] || sectionMap["personalInfo"]) && renderProfile()}
      {sectionMap["experience"] && renderEmployment()}
      {sectionMap["projects"] && renderProjects()}
      {sectionMap["education"] && renderEducation()}
      {sectionMap["courses"] && renderCourses()}
      {sectionMap["certificates"] && renderCertificates()}
      {sectionMap["languages"] && renderLanguages()}
      {sectionMap["skills"] && renderSkills()}
      {sectionMap["references"] && renderReferences()}
    </div>
  );
};

// Finished
const VisionaryProTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "header", "personalInfo", "experience", "projects", "education", "skills"
  ]).forEach(s => { sectionMap[s] = true; });

  const DesignFontFamily = getFontFamily(cvData.designOptions?.font);
  const designColors = getColorStyles(cvData.designOptions?.primaryColor || 'orange', cvData.designOptions?.secondaryColor);

  // Background shapes rendering
  const renderBackgroundShapes = () => (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      zIndex: 0,
      pointerEvents: 'none',
    }}>
      {/* Original shapes */}
      {/* Small circle in top-left */}
      <div style={{
        position: 'absolute',
        top: '15mm',
        left: '10mm',
        width: '12mm',
        height: '12mm',
        borderRadius: '50%',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.4,
      }} />
      
      {/* Small rectangle in top-right */}
      <div style={{
        position: 'absolute',
        top: '25mm',
        right: '15mm',
        width: '10mm',
        height: '10mm',
        transform: 'rotate(15deg)',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.3,
      }} />
      
      {/* Small circle in middle-left */}
      <div style={{
        position: 'absolute',
        top: '80mm',
        left: '20mm',
        width: '8mm',
        height: '8mm',
        borderRadius: '50%',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.25,
      }} />
      
      {/* Small triangle in middle-right (using border trick) */}
      <div style={{
        position: 'absolute',
        top: '100mm',
        right: '25mm',
        width: 0,
        height: 0,
        borderLeft: '6mm solid transparent',
        borderRight: '6mm solid transparent',
        borderBottom: '10mm solid ' + designColors.primary.bg,
        opacity: 0.2,
      }} />
      
      {/* Small square in middle */}
      <div style={{
        position: 'absolute',
        top: '150mm',
        left: '50%',
        marginLeft: '-5mm',
        width: '10mm',
        height: '10mm',
        transform: 'rotate(45deg)',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.15,
      }} />
      
      {/* Small circle in bottom-left */}
      <div style={{
        position: 'absolute',
        bottom: '70mm',
        left: '15mm',
        width: '7mm',
        height: '7mm',
        borderRadius: '50%',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.3,
      }} />
      
      {/* Small rectangle in bottom-center */}
      <div style={{
        position: 'absolute',
        bottom: '40mm',
        left: '50%',
        marginLeft: '-4mm',
        width: '8mm',
        height: '8mm',
        transform: 'rotate(30deg)',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.25,
      }} />
      
      {/* Small rectangle in bottom-right */}
      <div style={{
        position: 'absolute',
        bottom: '30mm',
        right: '20mm',
        width: '15mm',
        height: '15mm',
        transform: 'rotate(30deg)',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.3,
      }} />
      
      {/* Extra small dots scattered around */}
      <div style={{
        position: 'absolute',
        top: '200mm',
        left: '30mm',
        width: '5mm',
        height: '5mm',
        borderRadius: '50%',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.2,
      }} />
      
      <div style={{
        position: 'absolute',
        top: '120mm',
        left: '70mm',
        width: '4mm',
        height: '4mm',
        borderRadius: '50%',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.3,
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '100mm',
        right: '40mm',
        width: '6mm',
        height: '6mm',
        borderRadius: '50%',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.25,
      }} />
      
      {/* ADDITIONAL SHAPES */}
      
      {/* Tiny dots cluster top-right */}
      <div style={{
        position: 'absolute',
        top: '40mm',
        right: '35mm',
        width: '3mm',
        height: '3mm',
        borderRadius: '50%',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.35,
      }} />
      
      <div style={{
        position: 'absolute',
        top: '38mm',
        right: '30mm',
        width: '2mm',
        height: '2mm',
        borderRadius: '50%',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.4,
      }} />
      
      <div style={{
        position: 'absolute',
        top: '43mm',
        right: '32mm',
        width: '1.5mm',
        height: '1.5mm',
        borderRadius: '50%',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.45,
      }} />
      
      {/* Tiny dots cluster bottom-left */}
      <div style={{
        position: 'absolute',
        bottom: '50mm',
        left: '25mm',
        width: '2.5mm',
        height: '2.5mm',
        borderRadius: '50%',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.35,
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '53mm',
        left: '28mm',
        width: '1.8mm',
        height: '1.8mm',
        borderRadius: '50%',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.4,
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '48mm',
        left: '30mm',
        width: '1.2mm',
        height: '1.2mm',
        borderRadius: '50%',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.45,
      }} />
      
      {/* Small hexagon (approximated with rotated square) */}
      <div style={{
        position: 'absolute',
        top: '60mm',
        right: '50mm',
        width: '8mm',
        height: '8mm',
        transform: 'rotate(30deg)',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.2,
      }} />
      
      {/* Small pentagon (approximated with rotated square and clip-path) */}
      <div style={{
        position: 'absolute',
        top: '170mm',
        left: '35mm',
        width: '9mm',
        height: '9mm',
        clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.25,
      }} />
      
      {/* Small star (approximated with clip-path) */}
      <div style={{
        position: 'absolute',
        bottom: '130mm',
        right: '60mm',
        width: '10mm',
        height: '10mm',
        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.2,
      }} />
      
      {/* Diagonal line (thin rectangle) */}
      <div style={{
        position: 'absolute',
        top: '90mm',
        left: '40mm',
        width: '20mm',
        height: '1mm',
        transform: 'rotate(45deg)',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.3,
      }} />
      
      {/* Diagonal line (thin rectangle) opposite direction */}
      <div style={{
        position: 'absolute',
        bottom: '90mm',
        right: '45mm',
        width: '15mm',
        height: '0.8mm',
        transform: 'rotate(-30deg)',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.25,
      }} />
      
      {/* Small cross (using two rectangles) */}
      <div style={{
        position: 'absolute',
        top: '130mm',
        right: '30mm',
      }}>
        <div style={{
          width: '8mm',
          height: '2mm',
          backgroundColor: `${designColors.primary.bg}`,
          opacity: 0.3,
          position: 'absolute',
          top: '3mm',
          left: 0,
        }} />
        <div style={{
          width: '2mm',
          height: '8mm',
          backgroundColor: `${designColors.primary.bg}`,
          opacity: 0.3,
          position: 'absolute',
          top: 0,
          left: '3mm',
        }} />
      </div>
      
      {/* Tiny triangles scattered */}
      <div style={{
        position: 'absolute',
        top: '220mm',
        left: '60mm',
        width: 0,
        height: 0,
        borderLeft: '3mm solid transparent',
        borderRight: '3mm solid transparent',
        borderBottom: '5mm solid ' + designColors.primary.bg,
        opacity: 0.3,
      }} />
      
      <div style={{
        position: 'absolute',
        top: '70mm',
        right: '70mm',
        width: 0,
        height: 0,
        borderLeft: '2mm solid transparent',
        borderRight: '2mm solid transparent',
        borderBottom: '4mm solid ' + designColors.primary.bg,
        opacity: 0.25,
        transform: 'rotate(30deg)',
      }} />
      
      {/* Curved line (arc) approximated with a partial circle */}
      <div style={{
        position: 'absolute',
        bottom: '150mm',
        left: '80mm',
        width: '20mm',
        height: '20mm',
        borderRadius: '50%',
        border: `1mm solid ${designColors.primary.bg}`,
        borderTop: 'none',
        borderLeft: 'none',
        opacity: 0.2,
      }} />
      
      {/* Curved line (arc) opposite direction */}
      <div style={{
        position: 'absolute',
        top: '180mm',
        right: '75mm',
        width: '15mm',
        height: '15mm',
        borderRadius: '50%',
        border: `0.8mm solid ${designColors.primary.bg}`,
        borderBottom: 'none',
        borderRight: 'none',
        opacity: 0.25,
      }} />
      
      {/* Diamond shapes */}
      <div style={{
        position: 'absolute',
        top: '50mm',
        left: '50mm',
        width: '6mm',
        height: '6mm',
        transform: 'rotate(45deg)',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.2,
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '60mm',
        right: '55mm',
        width: '4mm',
        height: '4mm',
        transform: 'rotate(45deg)',
        backgroundColor: `${designColors.primary.bg}`,
        opacity: 0.3,
      }} />
      
      {/* Dotted line (series of tiny dots) */}
      {[...Array(8)].map((_, i) => (
        <div key={`dotted-line-1-${i}`} style={{
          position: 'absolute',
          top: '240mm',
          left: `${45 + i * 5}mm`,
          width: '1mm',
          height: '1mm',
          borderRadius: '50%',
          backgroundColor: `${designColors.primary.bg}`,
          opacity: 0.35,
        }} />
      ))}
      
      {/* Dotted line (series of tiny dots) - vertical */}
      {[...Array(6)].map((_, i) => (
        <div key={`dotted-line-2-${i}`} style={{
          position: 'absolute',
          top: `${100 + i * 5}mm`,
          right: '15mm',
          width: '1mm',
          height: '1mm',
          borderRadius: '50%',
          backgroundColor: `${designColors.primary.bg}`,
          opacity: 0.3,
        }} />
      ))}
      
      {/* Dotted line (series of tiny dots) - diagonal */}
      {[...Array(5)].map((_, i) => (
        <div key={`dotted-line-3-${i}`} style={{
          position: 'absolute',
          top: `${30 + i * 5}mm`,
          left: `${80 + i * 5}mm`,
          width: '1mm',
          height: '1mm',
          borderRadius: '50%',
          backgroundColor: `${designColors.primary.bg}`,
          opacity: 0.25,
        }} />
      ))}
      
      {/* Wave pattern (series of circles with varying positions) */}
      {[...Array(6)].map((_, i) => (
        <div key={`wave-${i}`} style={{
          position: 'absolute',
          bottom: `${80 + Math.sin(i) * 5}mm`,
          left: `${100 + i * 8}mm`,
          width: '3mm',
          height: '3mm',
          borderRadius: '50%',
          backgroundColor: `${designColors.primary.bg}`,
          opacity: 0.2 + (i * 0.02),
        }} />
      ))}
    </div>
  );
  
  const renderSectionTitle = (title: string) => (
    <div style={{
      color: designColors.primary.secondary,
      padding: '0',
      marginBottom: '4mm',
      fontSize: '12pt',
      fontWeight: 700,
      textTransform: 'uppercase',
      borderBottom: `2px solid ${designColors.primary.secondary}`,
      paddingBottom: '2mm'
    }}>
      {title}
    </div>
  )
    
  // Header (with name, contact)
  const renderHeader = () => (
    <div style={{
      backgroundColor: designColors.primary.primary,
      color: '#fff',
      padding: '10mm',
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '10mm',
      alignItems: 'start',

    }}>
      
      <h1 style={{ fontSize: '22pt', fontWeight: 700, marginBottom: '2mm', textAlign: 'center' }}>
        {cvData.personalInfo?.fullName || "Alicia Stephens"}
      </h1>

      {cvData.personalInfo?.title && 
      <h3 style={{ fontSize: '16pt', fontWeight: 500, marginBottom: '2mm', textAlign: 'center' }}>
        {cvData.personalInfo?.title || "I BUILD"}
      </h3>
      }

      <div style={{ fontSize: '9.5pt', display: 'flex', flexDirection: 'row' }}>
        <span>📞 {cvData.personalInfo?.phone || "+1-000-000"}</span>
        &nbsp;&nbsp; <span>📧 {cvData.personalInfo?.email || "alicia@enhancv.com"}</span>
        &nbsp;&nbsp; <span>📍 {cvData.personalInfo?.location || "New York City, NY"}</span>
      </div>
      <div style={{ fontSize: '9.5pt', display: 'flex', flexDirection: 'row' }}>
      {cvData.personalInfo?.linkedin && 
      <span>
      🔗 {cvData.personalInfo?.linkedin?.includes("https://") ? cvData.personalInfo?.linkedin?.split('https://')[1] : cvData.personalInfo?.linkedin}
      </span>
      }
      {cvData.personalInfo?.personal_website &&
      <span>
      &nbsp;&nbsp; 🔗 {cvData.personalInfo?.personal_website?.includes("https://") ? cvData.personalInfo?.personal_website?.split('https://')[1] : cvData.personalInfo?.personal_website}
      </span>
      }
      {cvData.personalInfo?.github &&
      <span>
      &nbsp;&nbsp; 🔗 {cvData.personalInfo?.github?.includes("https://") ? cvData.personalInfo?.github?.split('https://')[1] : cvData.personalInfo?.github}
      </span>
      }
      </div>
    </div>
  );


  const renderSummary = () => (
      <section style={{ marginBottom: '3mm', padding : '2mm 0mm'}}>
        {renderSectionTitle("SUMMARY")}
        <div style={{
          padding: '0mm 2mm',
          marginBottom: '2mm',
          color: '#666',
        }}>
        {cvData.personalInfo?.summary || 'I solve problems and help people overcome obstacles.'}
        </div>
      </section>
    );
  // Skills (Tech Stack)
  const renderSkills = () => (
    <section style={{ marginBottom: '4mm' }}>
      {renderSectionTitle("SKILLS")}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3mm' }}>
        {cvData.skills && cvData.skills.length > 0 ? cvData.skills.map((skill, idx) => (
          <div key={idx} style={{
            backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '2mm',
            paddingBottom: '4mm',
            textAlign: 'center',
            fontSize: '9pt',
            borderRadius: '1mm',
            fontWeight: 500,
          }}>
            {skill}
          </div>
        )) : (
          <>
            <div style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '2mm 6mm', textAlign: 'center', fontSize: '9pt', borderRadius: '1mm' }}>Zoho Sprints</div>
            <div style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '2mm 6mm', textAlign: 'center', fontSize: '9pt', borderRadius: '1mm' }}>UseVoice</div>
            <div style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '2mm 6mm', textAlign: 'center', fontSize: '9pt', borderRadius: '1mm' }}>Intercom</div>
            <div style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '2mm 6mm', textAlign: 'center', fontSize: '9pt', borderRadius: '1mm' }}>VWO</div>
            <div style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '2mm 6mm', textAlign: 'center', fontSize: '9pt', borderRadius: '1mm' }}>Taboola</div>
          </>
        )}
      </div>
    </section>
  );

  // Experience
  const renderExperience = () => (
    <section style={{ marginBottom: '3mm', }}>
      {renderSectionTitle("EXPERIENCE")}
      <div>
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '2mm', padding: '0.1mm 2mm', borderRadius: '2mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: designColors.primary.secondary, marginBottom: '1mm' }}>
              {exp.title || "Senior IT Product Manager"}
            </div>
            <div style={{ fontSize: '10pt', color: designColors.primary.primary, fontWeight: 600, marginBottom: '1mm' }}>
              {exp.company || "Lab Services"}
            </div>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '2mm' }}>
              📅 {exp.startDate || "02/2010"} - {exp.endDate || "04/2012"} 📍 {cvData.personalInfo?.location || "San Francisco, CA"}
            </div>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '2mm', fontStyle: 'italic' }}>
              {exp.description?.split('\n')[0] || 'Description...'}
            </div>
            <ul style={{ fontSize: '9pt', color: '#333', paddingLeft: '5mm', lineHeight: 1.5 }}>
              {exp.description ? exp.description.split('\n').slice(1).map((line, i) => <li key={i}>{line}</li>) : (
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

  // Projects
  const renderProjects = () => (
    <section style={{ marginBottom: '3mm' }}>
      {renderSectionTitle("PROJECTS")}
      <div>
        {cvData.projects && cvData.projects.length > 0 ? cvData.projects.map((proj, idx) => (
          <div key={idx} style={{ marginBottom: '2mm', backgroundColor: '#fff', borderRadius: '2mm', padding: '0.1mm 2mm', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: designColors.primary.secondary, marginBottom: '1mm' }}>{proj.name || "Project Name"}</div>
            <div style={{ fontSize: '10pt', color: designColors.primary.primary, fontWeight: 600, marginBottom: '1mm' , fontStyle: 'italic' }}>{proj.technologies || "Tech Stack"}</div>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '2mm' }}>{proj.description || "Project description..."}</div>
            {/* {proj.link && <a href={proj.link} style={{ color: '#ea580c', fontSize: '9pt' }}>{proj.link}</a>} */}
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No projects added yet</div>}
      </div>
    </section>
  );

  // Education
  const renderEducation = () => (
    <section style={{ marginBottom: '2mm', padding : '0mm' }}>
      {renderSectionTitle("EDUCATION")}
      <div>
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx} style={{ marginBottom: '2mm', backgroundColor: '#fff', borderRadius: '2mm', padding: '0mm', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: designColors.primary.secondary, marginBottom: '1mm' }}>{edu.degree || "MSc Project and Process Management"}</div>
            <div style={{ fontSize: '10pt', color: '#666' }}>{edu.school || "University of California, Berkeley"}</div>
            <div style={{ fontSize: '9pt', color: '#666' }}>{edu.startDate || "10/2008"} - {edu.endDate || "01/2010"}</div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );

    // Languages
  const renderLanguages = () => (
    <section style={{ marginBottom: '2mm', padding : '0mm' }}>
      {renderSectionTitle("Languages")}
      <div>
        {cvData.languages && cvData.languages.length > 0 ? cvData.languages.map((lan, idx) => (
          <div key={idx} style={{ marginBottom: '2mm', backgroundColor: '#fff', borderRadius: '2mm', padding: '0mm 0mm', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: designColors.primary.secondary, marginBottom: '1mm' }}>{lan.name || ""}</div>
            <div style={{ fontSize: '10pt', color: '#666' }}>{lan.proficiency || ""}</div>

          </div>
        )) : null}
      </div>
    </section>
  );

    // Courses
  const renderCourses = () => (
    <section style={{ marginBottom: '2mm', padding : '0mm' }}>
      {renderSectionTitle("Courses")}
      <div>
        {cvData.courses && cvData.courses.length > 0 ? cvData.courses.map((course, idx) => (
          <div key={idx} style={{ marginBottom: '2mm', backgroundColor: '#fff', borderRadius: '2mm', padding: '0mm', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: designColors.primary.secondary, marginBottom: '1mm' }}>{course.name || ""}</div>
            <div style={{ fontSize: '10pt', color: '#666' }}>{course.institution || "="}</div>
            <div style={{ fontSize: '9pt', color: '#666' }}>{course.date || ""} </div>
            <div style={{ fontSize: '8pt', color: '#666', marginBottom: '2mm', fontStyle: 'italic' }}>
              {course.description|| ''}
            </div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );


      // Certificates
  const renderCertificates = () => (
    <section style={{ marginBottom: '2mm', padding : '0mm' }}>
      {renderSectionTitle("Certificates")}
      <div>
        {cvData.certificates && cvData.certificates.length > 0 ? cvData.certificates.map((cer, idx) => (
          <div key={idx} style={{ marginBottom: '2mm', backgroundColor: '#fff', borderRadius: '2mm', padding: '0mm', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: designColors.primary.secondary, marginBottom: '1mm' }}>{cer.name || ""}</div>
            <div style={{ fontSize: '10pt', color: '#666' }}>{cer.issuer || "="}</div>
            <div style={{ fontSize: '9pt', color: '#666' }}>{cer.date || ""} </div>
            <div style={{ fontSize: '9pt', color: '#666' }}>{cer.link || ""} </div>
            <div style={{ fontSize: '8pt', color: '#666', marginBottom: '2mm', fontStyle: 'italic' }}>
              {cer.description|| ''}
            </div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );


  // Layout: Two columns
  return (
    <div className="cv-page" style={{
      ...CV_PAGE_STYLE,
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: DesignFontFamily,
      position: 'relative', // Ensure this is set for absolute positioning of shapes
      overflow: 'hidden', // Ensure shapes don't get cut off
    }}>
      {/* Add background shapes */}
      {renderBackgroundShapes()}
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative', // For proper stacking
        zIndex: 1, // Ensure content is above background shapes
      }}>
        {/* Header (Top) */}
        <div>
          {sectionMap["personalInfo"] && renderHeader()}
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '3mm',
          position: 'relative', // Important for z-index to work
          zIndex: 1, // Ensure this content is above background shapes
          backgroundColor: 'transparent', // Make sure background is transparent
        }}>
          {/* Main (left) */}
          <div style={{ 
            flex: 1, 
            paddingLeft: '6mm', 
            paddingRight: '7mm', 
            minHeight: '297mm', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0',
            position: 'relative', // Important for z-index to work
            zIndex: 1, // Ensure content is above background shapes
            backgroundColor: 'transparent', // Make sure background is transparent
          }}>
            {cvData.personalInfo?.summary && renderSummary()}
            {sectionMap["experience"] && renderExperience()}
            {sectionMap["projects"] && renderProjects()}
          </div>
          {/* Main (left) */}

          {/* Sidebar (right) */}
          <div style={{ 
            width: '80mm', 
            paddingRight: '6mm', 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '297mm',
            position: 'relative', // Important for z-index to work
            zIndex: 1, // Ensure content is above background shapes
            backgroundColor: 'transparent', // Make sure background is transparent
          }}>
            {sectionMap["education"] && renderEducation()}
            {sectionMap["languages"] && renderLanguages()}
            {sectionMap["certificates"] && renderCertificates()}
            {sectionMap["courses"] && renderCourses()}
            {sectionMap["skills"] && renderSkills()}
          </div>
          {/* Sidebar (right) */}
        </div>
      </div>
    </div>
  );
};

// Finished
const ElegantProTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "header", "personalInfo", "experience", "projects", "education", "skills"
  ]).forEach(s => { sectionMap[s] = true; });

  const DesignFontFamily = getFontFamily(cvData.designOptions?.font);
  // Get color styles and provide fallback to 'red' if primaryColor is not defined
  const designColors = getColorStyles(cvData.designOptions?.primaryColor || '#cb6d61', cvData.designOptions?.secondaryColor);


const renderSectionTitle = (title: string , rightSidebar?: boolean) => {
    // Use designColors for text color, with white as fallback for sidebar
    const textColor = rightSidebar ? "white" : designColors.primary.secondary;
    return (
    <div style={{
      color: textColor,
      padding: '0',
      marginBottom: '1mm',
      fontSize: '12pt',
      fontWeight: 700,
      textTransform: 'uppercase',
      borderBottom: `2px solid ${textColor}`,
      paddingBottom: '2mm'
    }}>
      {title}
    </div>
  )
}

  const renderHeader = () => (
    <div style={{ display: 'flex', marginBottom: '12mm' }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: '24pt', fontWeight: 700, color: '#000', marginBottom: '1mm', textTransform: 'uppercase' }}>
          {cvData.personalInfo?.fullName || "JAMES MOORE"}
        </h1>
        {cvData.personalInfo?.title && 
          <div style={{ fontSize: '12pt', color: '#666', marginBottom: '2mm' }}>
          {cvData.personalInfo?.title}
        </div>
        }
        <div style={{ fontSize: '10pt', color: '#666', marginBottom: '2mm' }}>
          📞 {cvData.personalInfo?.phone || "+1-000-000"} 
          📧 {cvData.personalInfo?.email || "james.moore@enhancv.com"}
          📍 {cvData.personalInfo?.location || "New York City, NY"}
        </div>
        <div style={{ fontSize: '10pt', color: '#666', marginBottom: '2mm' }}>
        {cvData.personalInfo?.linkedin && 
      <span>
      🔗 {cvData.personalInfo?.linkedin?.includes("https://") ? cvData.personalInfo?.linkedin?.split('https://')[1] : cvData.personalInfo?.linkedin}
      </span>
      }
      {cvData.personalInfo?.personal_website &&
      <span>
      &nbsp;&nbsp; 🔗 {cvData.personalInfo?.personal_website?.includes("https://") ? cvData.personalInfo?.personal_website?.split('https://')[1] : cvData.personalInfo?.personal_website}
      </span>
      }
        </div>

        <div style={{ fontSize: '10pt', color: '#666', marginBottom: '2mm' }}>
      {cvData.personalInfo?.github &&
      <span>
      🔗 {cvData.personalInfo?.github?.includes("https://") ? cvData.personalInfo?.github?.split('https://')[1] : cvData.personalInfo?.github}
      </span>
      }
        </div>

      </div>

    </div>
  );

  const renderSummary = () => (
    <section style={{ marginBottom: '4mm' }}>
      {renderSectionTitle("Summary")}
      <p style={{ fontSize: '10pt', color: '#333', lineHeight: 1.6 }}>
        {cvData.personalInfo?.summary || "Result-orientated project team leader with 5 years of experience covering project and product management including developing, implementing and supporting complex infrastructures for fast growing startups. A fast and eager learner, I am detail orientated and adapt to changing project requirements quickly to meet business goals. Comfortable with ambiguity and thrive in fast-paced environment."}
      </p>
    </section>
  );

  const renderExperience = () => (
    <section style={{ marginBottom: '4mm' }}>
      {renderSectionTitle("EXPERIENCE")}
      <div>
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '2mm' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1mm' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '11pt', color: '#000', marginBottom: '1mm' }}>
                  {exp.title || "Senior IT Product Manager"}
                </div>
                <div style={{ fontSize: '10pt', color: designColors.primary.secondary, fontWeight: 600, marginBottom: '1mm' }}>
                  {exp.company || "Rover Games"}
                </div>
              </div>
              <div style={{ fontSize: '9pt', color: '#666', textAlign: 'right' }}>
                <div>{exp.startDate || "02/2019"} - {exp.endDate || "Present"}</div>
              </div>
            </div>
            {/* <div style={{ fontSize: '9pt', color: '#666', marginBottom: '2mm', fontStyle: 'italic' }}>
              Rover Games is a multi-play mobile game app development firm that has successful titles such as Drink Something, Trivia Tonight and King's Fight.
            </div> */}
            <ul style={{ fontSize: '10pt', color: '#333', paddingLeft: '5mm', lineHeight: 1.5 , fontStyle: 'italic' }}>
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

  const renderProjects = () => (
    <section style={{ marginBottom: '4mm' }}>
      {renderSectionTitle("PROJECTS")}
      <div>
        {cvData.projects && cvData.projects.length > 0 ? cvData.projects.map((prj, idx) => (
          <div key={idx} style={{ marginBottom: '2mm' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1mm' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '11pt', color: '#000', marginBottom: '1mm' }}>
                  {prj.name || "Senior IT Product Manager"}
                </div>
                {/* <div style={{ fontSize: '10pt', color: '#b91c1c', fontWeight: 600, marginBottom: '1mm' }}>
                  {prj.company || "Rover Games"}
                </div> */}
              </div>
              <div style={{ fontSize: '9pt', color: '#666', textAlign: 'right' }}>
                <div>{prj.startDate || "02/2019"} - {prj.endDate || "Present"}</div>
              </div>
            </div>
            <div style={{ fontSize: '9pt', color: designColors.primary.secondary, marginBottom: '2mm', fontStyle: 'italic', paddingLeft: '5mm' }}>
            {prj.technologies && (
                <div style={{ fontWeight: 600}}>
                  {prj.technologies}
                </div>
              )}
            </div>
            <ul style={{ fontSize: '10pt', color: '#333', paddingLeft: '5mm', lineHeight: 1.5 , fontStyle: 'italic' }}>
              {prj.description ? prj.description.split('\n').map((line, i) => <li key={i}>{line}</li>) : (
                <>
                  <li>Accelerated outbound sales cycle by 330% by designing and implementing customer acquisition platform for training and managing technical sales personnel</li>
                  <li>Established and curated strategic partnerships with 6 out of 10 top state manufacturing companies which resulted in $20M additional annual revenue</li>
                  <li>Led re-architect effort of a core SaaS product to reduce the platform deployment time for clients by 2 months</li>
                </>
              )}
            </ul>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No Projects added yet</div>}
      </div>
    </section>
  );

  const renderEducation = () => (
    <section style={{ marginBottom: '3mm', paddingTop: '20mm' }}>
      {renderSectionTitle("EDUCATION" , true)}
      <div>
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx} style={{ marginBottom: '1mm' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '11pt', color: 'white', marginBottom: '1mm' }}>
                  {edu.degree || "Industrial Engineering, MSc"}
                </div>
                <div style={{ fontSize: '10pt', color: 'white', fontWeight: 600 }}>
                  {edu.school || "University of California, Berkeley"}
                </div>
              </div>
              <div style={{ fontSize: '9pt', color: 'white', textAlign: 'right' }}>
                <div>{edu.startDate || "2000"} - {edu.endDate || "2002"}</div>
              </div>
            </div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );

    const renderLanguages = () => (
    <section style={{ marginBottom: '3mm' }}>
      {renderSectionTitle("Languages" , true)}
      <div>
        {cvData.languages && cvData.languages.length > 0 ? cvData.languages.map((lan, idx) => (
          <div key={idx} style={{ marginBottom: '1mm' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '11pt', color: 'white', marginBottom: '1mm' }}>
                  {lan.name || ""}
                </div>
              </div>
              <div style={{ fontSize: '9pt', color: 'white', textAlign: 'right' }}>
                <div>{lan.proficiency || ""}</div>
              </div>
            </div>
          </div>
        )) : null}
      </div>
    </section>
  );

    const renderCertificates = () => (
    <section style={{ marginBottom: '3mm' }}>
      {renderSectionTitle("Certificates" , true)}
      <div>
        {cvData.certificates && cvData.certificates.length > 0 ? cvData.certificates.map((cer, idx) => (
          <div key={idx} style={{ marginBottom: '1mm' }}>
            <div style={{ display: 'flex', flexDirection:"column", alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '11pt', color: 'white', marginBottom: '1mm' }}>
                  {cer.name || ""}
                </div>
                <div style={{ fontSize: '10pt', color: 'white', fontWeight: 500 }}>
                  {cer.issuer || ""}
                </div>
                <div style={{ fontSize: '9pt', color: 'white', fontWeight: 500 }}>
                  {cer.link || ""}
                </div>
              </div>
              <div style={{ fontSize: '9pt', color: 'white' }}>
                <div>{cer.date || ""}</div>
              </div>
              <div style={{ fontSize: '9pt', color: 'white', lineHeight: 1.5 , fontStyle: 'italic'}}>
                <div>{cer.description || ""}</div>
              </div>
            </div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );

    const renderCourses = () => (
    <section style={{ marginBottom: '3mm' }}>
      {renderSectionTitle("Courses" , true)}
      <div>
        {cvData.courses && cvData.courses.length > 0 ? cvData.courses.map((course, idx) => (
          <div key={idx} style={{ marginBottom: '1mm' }}>
            <div style={{ display: 'flex', flexDirection:"column", alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '11pt', color: 'white', marginBottom: '1mm' }}>
                  {course.name || ""}
                </div>
                <div style={{ fontSize: '10pt', color: 'white', fontWeight: 500 }}>
                  {course.institution || ""}
                </div>
              </div>
              <div style={{ fontSize: '9pt', color: 'white' }}>
                <div>{course.date || ""}</div>
              </div>
              <div style={{ fontSize: '9pt', color: 'white', lineHeight: 1.5 , fontStyle: 'italic'}}>
                <div>{course.description || ""}</div>
              </div>
            </div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );


  const renderSkills = () => (
    <section style={{ marginBottom: '4mm', overflow: 'hidden' }}>
      {renderSectionTitle("SKILLS" , true)}
      <div style={{ display: 'flex',flexWrap: 'wrap', gap: '2mm' }}>
        {cvData.skills && cvData.skills.length > 0 ? cvData.skills.map((skill, idx) => (
          <div key={idx} style={{ 
            backgroundColor: 'white',
            color: designColors.primary.secondary,
            padding: '1mm',
            paddingBottom: '3mm',
            textAlign: 'center',
            fontSize: '10pt',
            borderRadius: '2mm',
            fontWeight: 600,
            width: 'fit-content'
          }}>
            {skill}
          </div>
        )) : (
          <>
            <div style={{ backgroundColor: '#f0fdf4', color: designColors.primary.primary, padding: '2mm', textAlign: 'center', fontSize: '10pt', borderRadius: '2mm', fontWeight: 600 }}>Strategic Management</div>
            <div style={{ backgroundColor: '#f0fdf4', color: designColors.primary.primary, padding: '2mm', textAlign: 'center', fontSize: '10pt', borderRadius: '2mm', fontWeight: 600 }}>Program Development</div>
            <div style={{ backgroundColor: '#f0fdf4', color: designColors.primary.primary, padding: '2mm', textAlign: 'center', fontSize: '10pt', borderRadius: '2mm', fontWeight: 600 }}>Project Planning</div>
            <div style={{ backgroundColor: '#f0fdf4', color: designColors.primary.primary, padding: '2mm', textAlign: 'center', fontSize: '10pt', borderRadius: '2mm', fontWeight: 600 }}>Stakeholder Engagement</div>
            <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '2mm', textAlign: 'center', fontSize: '10pt', borderRadius: '2mm', fontWeight: 600 }}>Financial Oversight</div>
          </>
        )}
      </div>
    </section>
  );



  const renderProfileImage = () => ( 
    <div style={{width: '100%' , display: 'flex' , justifyContent: 'center' , marginBottom: '10mm'  }}>
    <div style={{ 
      width: '30mm', 
      height: '30mm', 
      backgroundColor: designColors.primary.secondary, 
      borderRadius: '5mm',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '20pt',
      fontWeight: 700,
      marginLeft: '10mm'
    }}>
      {cvData.personalInfo?.fullName.split(' ')[0]}
    </div>
    </div>
  );

  return (
    <div className="cv-page" style={{
      ...CV_PAGE_STYLE ,
      
      padding: '0mm',
      display: 'flex',
      flexDirection: 'row',
      fontFamily: DesignFontFamily,
    }}>



      {/* Main (left) */}
      <div style={{ flex: 1, padding: '6mm', minHeight: '297mm', display: 'flex', flexDirection: 'column', gap: '0' }}>
        {sectionMap["personalInfo"] && renderHeader()}
        {cvData.personalInfo?.summary && renderSummary()}
        {sectionMap["experience"] && renderExperience()}
        {sectionMap["projects"] && renderProjects()}
      </div>
      {/* Main (left) */}

      {/* Sidebar (right) */}
      <div style={{ width: '70mm', padding: '4mm 4mm', display: 'flex', flexDirection: 'column', minHeight: '295mm' , backgroundColor: designColors.primary.primary }}>
        {renderProfileImage()}
        {sectionMap["education"] && renderEducation()}
        {sectionMap["languages"] && renderLanguages()}
        {sectionMap["certificates"] && renderCertificates()}
        {sectionMap["courses"] && renderCourses()}
        {sectionMap["skills"] && renderSkills()}
      </div>
      {/* Sidebar (right) */}


    </div>
  );
};

// Finished
const HighPerformerTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "header", "personalInfo", "experience", "projects", "education", "skills"
  ]).forEach(s => { sectionMap[s] = true; });

  const DesignFontFamily = getFontFamily(cvData.designOptions?.font);
  const designColors = getColorStyles(cvData.designOptions?.primaryColor || '#0891b2', cvData.designOptions?.secondaryColor);


  const renderHeader = () => (
    <div style={{ marginBottom: '10mm' }}>
      <h1 style={{ fontSize: '20pt', fontWeight: 700, color: '#000', marginBottom: '1mm' }}>
        {cvData.personalInfo?.fullName || "ISAAC HALL"}
      </h1>
      {cvData.personalInfo.title && 
      <h1 style={{ fontSize: '14pt', fontWeight: 600, color: designColors.primary.primary, marginBottom: '2mm' }}>
        {cvData.personalInfo?.title || ""}
      </h1>
      }

      <div style={{ fontSize: '10pt', color: '#666', display: 'flex', flexWrap: 'wrap', gap: '6mm' }}>
        <span>📞 {cvData.personalInfo?.phone || "+1-(234)-555-1234"}</span>
        <span>📧 {cvData.personalInfo?.email || "help@enhancv.com"}</span>
        <span>📍 {cvData.personalInfo?.location || "Seattle, Washington"}</span>
      </div>

      <div style={{ fontSize: '10pt', color: '#666', display: 'flex', flexWrap: 'wrap', gap: '6mm' }}>
      {cvData.personalInfo?.linkedin && 
      <span>
      🔗 {cvData.personalInfo?.linkedin?.includes("https://") ? cvData.personalInfo?.linkedin?.split('https://')[1] : cvData.personalInfo?.linkedin}
      </span>
      }
      {cvData.personalInfo?.personal_website &&
      <span>
      &nbsp;&nbsp; 🔗 {cvData.personalInfo?.personal_website?.includes("https://") ? cvData.personalInfo?.personal_website?.split('https://')[1] : cvData.personalInfo?.personal_website}
      </span>
      }
      {cvData.personalInfo?.github &&
      <span>
      &nbsp;&nbsp; 🔗 {cvData.personalInfo?.github?.includes("https://") ? cvData.personalInfo?.github?.split('https://')[1] : cvData.personalInfo?.github}
      </span>
      }
      </div>


    </div>
  );

  const renderExperience = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '1mm', borderBottom: '2px solid #000', paddingBottom: '2mm' }}>
        EXPERIENCE
      </h2>
      <div>
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '3mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#000', marginBottom: '1mm' }}>
              {exp.title || "Project Director"}
            </div>
            <div style={{ fontSize: '10pt', color: designColors.primary.primary, fontWeight: 600, marginBottom: '1mm' }}>
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
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '1mm', borderBottom: '2px solid #000', paddingBottom: '2mm' }}>
        SUMMARY
      </h2>
      <p style={{ fontSize: '10pt', color: '#333', lineHeight: 1.6 }}>
        {cvData.personalInfo?.summary || "Seasoned project director with a robust track record in global health, driven by a passion for enhancing healthcare systems and outcomes. With expertise in strategic planning and cross-functional team leadership, I have successfully managed multimillion-dollar initiatives and secured strategic partnerships. Excited to leverage my skills and experience to contribute to health innovations that positively impact communities worldwide, focusing on strategic management and program development to achieve transformative results."}
      </p>
    </section>
  );

  const renderProjects = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '1mm', borderBottom: '2px solid #000', paddingBottom: '2mm' }}>
        PROJECTS
      </h2>
      <div>
        {cvData.projects && cvData.projects.length > 0 ? cvData.projects.map((proj, idx) => (
          <div key={idx} style={{ marginBottom: '3mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#000', marginBottom: '1mm' }}>
              {proj.name || "Project Name"}
            </div>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '2mm' }}>
              {proj.startDate && proj.endDate && (
                <span>📅 {proj.startDate} - {proj.endDate}</span>
              )}
            </div>
            <div style={{ fontSize: '10pt', color: designColors.primary.primary, fontWeight: 600, marginBottom: '1mm' , paddingLeft: '4mm', fontStyle: 'italic' }}>
              {proj.technologies || "Technologies Used"}
            </div>
            <p style={{ fontSize: '10pt', color: '#333', lineHeight: 1.5, paddingLeft: '4mm' }}>
              {proj.description || "Project description"}
            </p>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No projects added yet</div>}
      </div>
    </section>
  );

  const renderKeyAchievements = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#fff', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #fff', paddingBottom: '2mm' }}>
        KEY ACHIEVEMENTS
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6mm' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2mm', marginBottom: '3mm' }}>
            <span style={{ color: designColors.primary.primary, fontSize: '12pt' }}>✓</span>
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '10pt', marginBottom: '1mm' }}>Led Policy Development Initiatives</div>
              <div style={{ fontSize: '9pt', color: '#f0fdf4', lineHeight: 1.4 }}>Spearheaded health governance reforms in six countries, influencing policies and improving healthcare outcomes.</div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2mm', marginBottom: '3mm' }}>
            <span style={{ color: designColors.primary.primary, fontSize: '12pt' }}>⭐</span>
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '10pt', marginBottom: '1mm' }}>Optimized Project Execution</div>
              <div style={{ fontSize: '9pt', color: '#f0fdf4', lineHeight: 1.4 }}>Directed a project valued at $50M, increasing scope and effectively maintaining high compliance with USG policies.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderEducation = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '1mm', borderBottom: '2px solid #000', paddingBottom: '2mm' }}>
        EDUCATION
      </h2>
      <div>
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx} style={{ marginBottom: '2mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#000', marginBottom: '1mm' }}>
              {edu.degree || "Master's Degree in Public Health"}
            </div>
            <div style={{ fontSize: '10pt', color: designColors.primary.primary, fontWeight: 600, marginBottom: '1mm' }}>
              {edu.school || "Johns Hopkins University"}
            </div>
            <div style={{ fontSize: '9pt', color: '#333' }}>
              📅 {edu.startDate || "01/2003"} - {edu.endDate || "01/2005"}
            </div>
          </div>
        )) : <div style={{ color: '#000', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );

    const renderCertificates = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '1mm', borderBottom: '2px solid #000', paddingBottom: '2mm' }}>
        Certificates
      </h2>
      <div>
        {cvData.certificates && cvData.certificates.length > 0 ? cvData.certificates.map((cer, idx) => (
          <div key={idx} style={{ marginBottom: '2mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#000', marginBottom: '1mm' }}>
              {cer.name || "Master's Degree in Public Health"}
            </div>
            <div style={{ fontSize: '10pt', color: designColors.primary.primary, fontWeight: 600 }}>
              {cer.issuer || "Johns Hopkins University"}
            </div>
            <div style={{ fontSize: '9pt', color: '#333' }}>
              {cer.link || ""}
            </div>
            <div style={{ fontSize: '9pt', color: '#333' }}>
              📅 {cer.date || ""}
            </div>
            <div style={{ fontSize: '10pt', color: '#333', lineHeight: 1.5 }}>
              {cer.description || ""}
            </div>
          </div>
        )) : <div style={{ color: '#000', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );


    const renderCourses = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '1mm', borderBottom: '2px solid #000', paddingBottom: '2mm' }}>
        Courses
      </h2>
      <div>
        {cvData.courses && cvData.courses.length > 0 ? cvData.courses.map((course, idx) => (
          <div key={idx} style={{ marginBottom: '2mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#000', marginBottom: '1mm' }}>
              {course.name || "Master's Degree in Public Health"}
            </div>
            <div style={{ fontSize: '10pt', color: designColors.primary.primary, fontWeight: 600 }}>
              {course.institution || "Johns Hopkins University"}
            </div>
            <div style={{ fontSize: '9pt', color: '#333' }}>
              📅 {course.date || ""}
            </div>
            <div style={{ fontSize: '10pt', color: '#333', lineHeight: 1.5 }}>
              {course.description || ""}
            </div>
          </div>
        )) : <div style={{ color: '#000', fontStyle: 'italic' }}>No Courses added yet</div>}
      </div>
    </section>
  );


    const renderLanguages = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '1mm', borderBottom: '2px solid #000', paddingBottom: '2mm' }}>
        Languages
      </h2>
      <div>
        {cvData.languages && cvData.languages.length > 0 ? cvData.languages.map((lan, idx) => (
          <div key={idx} style={{ marginBottom: '2mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#000', marginBottom: '1mm' }}>
              {lan.name || "Master's Degree in Public Health"}
            </div>
            <div style={{ fontSize: '10pt', color: designColors.primary.primary, fontWeight: 600, marginBottom: '1mm' }}>
              {lan.proficiency || "Johns Hopkins University"}
            </div>
          </div>
        )) : <div style={{ color: '#000', fontStyle: 'italic' }}>No Languages added yet</div>}
      </div>
    </section>
  );
  

  const renderSkills = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '2mm', borderBottom: '2px solid #000', paddingBottom: '2mm' }}>
        SKILLS
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3mm' }}>
        {cvData.skills && cvData.skills.length > 0 ? cvData.skills.map((skill, idx) => (
          <div key={idx} style={{ 
            backgroundColor: '#ededed',
            color: designColors.primary.primary,
            padding: '2mm',
            paddingBottom: '3mm',
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
          </>
        )}
      </div>
    </section>
  );

  // Updated return statement with two-sided layout
  return (
    <div className="cv-page" style={{
      ...CV_PAGE_STYLE,
      padding: '6mm',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: DesignFontFamily,
    }}>

        {/* Header  */}
        {(sectionMap["header"] || sectionMap["personalInfo"]) && renderHeader()}


        <div style={{display: 'flex' ,flexDirection: 'row'}}>

            {/* Main (left) */}
            <div style={{ flex: 1,  minHeight: '297mm', display: 'flex', flexDirection: 'column', gap: '0', paddingRight: '7mm' }}>
              {cvData.personalInfo?.summary && renderSummary()}
              {sectionMap["experience"] && renderExperience()}
              {sectionMap["projects"] && renderProjects()}
            </div>
      
            {/* Sidebar (right) */}
            <div style={{ width: '70mm', display: 'flex', flexDirection: 'column', minHeight: '295mm' }}>
              {sectionMap["education"] && renderEducation()}
              {sectionMap["languages"] && renderLanguages()}
              {sectionMap["certificates"] && renderCertificates()}
              {sectionMap["courses"] && renderCourses()}
              {sectionMap["skills"] && renderSkills()}
              {/* {sectionMap["achievements"] && renderKeyAchievements()} */}
            </div>

        </div>



    </div>
  );
};

// Finished
const SingleColumnTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "personalInfo", "experience", "education", "skills", "projects"
  ]).forEach(s => { sectionMap[s] = true; });

  const DesignFontFamily = getFontFamily(cvData.designOptions?.font);
  // Initialize designColors with primaryColor, defaulting to amber if not provided
  const designColors = getColorStyles(cvData.designOptions?.primaryColor || '#4A90E2', cvData.designOptions?.secondaryColor);
  // Default color to use as fallback
  const defaultColor = '#4A90E2';

  const renderHeader = () => (
    <section style={{ marginBottom: '12mm' }}>
      <h1 style={{ fontSize: '24pt', fontWeight: 700, color: '#333', marginBottom: '3mm' }}>
        {cvData.personalInfo?.fullName || "Mason Turner"}
      </h1>
      { cvData.personalInfo?.title && 
      <div style={{ fontSize: '14pt', color: designColors.primary.primary, fontWeight: 600, marginBottom: '3mm' }}>
        {cvData.personalInfo?.title}
      </div>
      }
      <div style={{ fontSize: '10pt', color: '#666', marginBottom: '2mm' }}>
        📞 {cvData.personalInfo?.phone || "+1-(234)-555-1234"} &nbsp;&nbsp;
        📧 {cvData.personalInfo?.email || "help@enhancv.com"} &nbsp;&nbsp;
        📍 {cvData.personalInfo?.location || "Denver, Colorado"}
        {/* 🔗 linkedin.com */}
      </div>
      <div style={{ fontSize: '10pt', color: '#666' }}>
      {cvData.personalInfo?.linkedin && 
      <span>
      🔗 {cvData.personalInfo?.linkedin?.includes("https://") ? cvData.personalInfo?.linkedin?.split('https://')[1] : cvData.personalInfo?.linkedin}
      </span>
      }
      {cvData.personalInfo?.personal_website &&
      <span>
      &nbsp;&nbsp; 🔗 {cvData.personalInfo?.personal_website?.includes("https://") ? cvData.personalInfo?.personal_website?.split('https://')[1] : cvData.personalInfo?.personal_website}
      </span>
      }
      {cvData.personalInfo?.github &&
      <span>
      &nbsp;&nbsp; 🔗 {cvData.personalInfo?.github?.includes("https://") ? cvData.personalInfo?.github?.split('https://')[1] : cvData.personalInfo?.github}
      </span>
      }
      </div>
    </section>
  );

  const renderSummary = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #333', paddingBottom: '2mm' }}>
        Summary
      </h2>
      <p style={{ fontSize: '10pt', color: '#333', lineHeight: 1.6 }}>
        {cvData.personalInfo?.summary || "Accomplished sales professional with a proven track record in B2B environments, consistently driving sales growth and building lasting client relationships. Known for increasing sales and improving client retention, eager to apply expertise in strategic planning and client management to achieve further success. Passionate about innovative sales strategies and technology, with a strong commitment to fostering meaningful business connections and delivering transformative solutions."}
      </p>
    </section>
  );

  const renderExperience = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #333', paddingBottom: '2mm' }}>
        Experience
      </h2>
      <div>
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '2mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#333', marginBottom: '1mm' }}>
              {exp.title || "Senior Account Executive"}
            </div>
            <div style={{ fontSize: '10pt', color: designColors.primary.primary, fontWeight: 600, marginBottom: '1mm' }}>
              {exp.company || "TechSolutions Inc."}
            </div>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '2mm' }}>
              📅 {exp.startDate || "01/2020"} - {exp.endDate || "Present"}
            </div>
            <ul style={{ fontSize: '10pt', color: '#333', paddingLeft: '5mm', lineHeight: 1.5 }}>
              {exp.description ? exp.description.split('\n').map((line, i) => <li key={i} style={{ marginBottom: '1mm' }}>{line}</li>) : 
                <>
                  <li style={{ marginBottom: '1mm' }}>Drove a 150% increase in B2B software solutions sales over a two-year period by leveraging a consultative sales approach, tailored demonstrations and strategic partnerships.</li>
                  <li style={{ marginBottom: '1mm' }}>Initiated and nurtured relationships with key decision-makers across 40+ national accounts in the tech sector, resulting in a 20% boost in client retention and 35% growth in referral business.</li>
                </>
              }
            </ul>
            {/* Add dashed line separator between experience items except for the last one */}
            {idx < (cvData.experience?.length || 0) - 1 && (
              <div style={{ 
                borderBottom: '1px dashed #ccc', 
                margin: '0 0 3mm 0',
                width: '100%',
                paddingTop:'3mm'
              }} />
            )}
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No experience added yet</div>}
      </div>
    </section>
  );

  const renderProjects = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #333', paddingBottom: '2mm' }}>
        Projects
      </h2>
      <div>
        {cvData.projects && cvData.projects.length > 0 ? cvData.projects.map((prj, idx) => (
          <div key={idx} style={{ marginBottom: '2mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#333', marginBottom: '1mm' }}>
              {prj.name || "Senior Account Executive"}
            </div>
            {/* <div style={{ fontSize: '10pt', color: designColors.primary.primary, fontWeight: 600, marginBottom: '1mm' }}>
              {prj.company || "TechSolutions Inc."}
            </div> */}
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '2mm' }}>
              📅 {prj.startDate || "01/2020"} - {prj.endDate || "Present"}
            </div>
            <div style={{ fontSize: '9pt', color: designColors.primary.primary,paddingLeft: '5mm', marginBottom: '2mm', fontStyle: 'italic' }}>
            {prj.technologies && (
                <div style={{ fontWeight: 600, fontSize: '9pt', marginBottom: '1mm' }}>
                  {prj.technologies}
                </div>
              )}
            </div>
            <ul style={{ fontSize: '10pt', color: '#333', paddingLeft: '5mm', lineHeight: 1.5 }}>
              {prj.description ? prj.description.split('\n').map((line, i) => <li key={i} style={{ marginBottom: '1mm' }}>{line}</li>) : 
                <>
                  <li style={{ marginBottom: '1mm' }}>Drove a 150% increase in B2B software solutions sales over a two-year period by leveraging a consultative sales approach, tailored demonstrations and strategic partnerships.</li>
                  <li style={{ marginBottom: '1mm' }}>Initiated and nurtured relationships with key decision-makers across 40+ national accounts in the tech sector, resulting in a 20% boost in client retention and 35% growth in referral business.</li>
                </>
              }
            </ul>
            {/* Add dashed line separator between experience items except for the last one */}
            {idx < (cvData.experience?.length || 0) - 1 && (
              <div style={{ 
                borderBottom: '1px dashed #ccc', 
                margin: '0 0 3mm 0',
                width: '100%',
                // padding: '1mm 0mm', 
                paddingTop: '3mm'
              }} />
            )}
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No Projects added yet</div>}
      </div>
    </section>
  );

  const renderEducation = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #333', paddingBottom: '2mm' }}>
        Education
      </h2>
      <div>
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx} style={{ marginBottom: '2mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#333', marginBottom: '1mm' }}>
              {edu.degree || "Master of Business Administration"}
            </div>
            <div style={{ fontSize: '10pt', color: designColors.primary.primary, fontWeight: 600, marginBottom: '1mm' }}>
              {edu.school || "University of Denver"}
            </div>
            <div style={{ fontSize: '9pt', color: '#666' }}>
              📅 {edu.startDate || "01/2011"} - {edu.endDate || "01/2013"} 📍 {cvData.personalInfo?.location || "Denver, Colorado"}
            </div>
            {/* Add dashed line separator between experience items except for the last one */}
            {idx < (cvData.education?.length || 0) - 1 && (
              <div style={{ 
                borderBottom: '1px dashed #ccc', 
                margin: '0 0 3mm 0',
                width: '100%',
                paddingTop:'3mm'
              }} />
            )}
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );

    const renderCertificates = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #333', paddingBottom: '2mm' }}>
        Certificates
      </h2>
      <div>
        {cvData.certificates && cvData.certificates.length > 0 ? cvData.certificates.map((cer, idx) => (
          <div key={idx} style={{ marginBottom: '2mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#333', marginBottom: '1mm' }}>
              {cer.name || "Senior Account Executive"}
            </div>
            <div style={{ fontSize: '10pt', color: designColors.primary.primary, fontWeight: 600,  }}>
              {cer.issuer || "TechSolutions Inc."}
            </div>
            <div style={{ fontSize: '9pt', color: '#666', fontWeight: 600}}>
              {cer.link || "TechSolutions Inc."}
            </div>
            <div style={{ fontSize: '8pt', color: '#666', marginBottom: '2mm' }}>
              📅 {cer.date || ""}
            </div>
            <ul style={{ fontSize: '10pt', color: '#333', lineHeight: 1.5 }}>
              {cer.description.split('\n').map((line, i) => <li key={i}>{line}</li>)} 
            </ul>
            {/* Add dashed line separator between experience items except for the last one */}
            {idx < (cvData.certificates?.length || 0) - 1 && (
              <div style={{ 
                borderBottom: '1px dashed #ccc', 
                margin: '0 0 3mm 0',
                width: '100%',
                paddingTop:'3mm'
              }} />
            )}
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No experience added yet</div>}
      </div>
    </section>
  );

      const renderCourses = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #333', paddingBottom: '2mm' }}>
        Courses
      </h2>
      <div>
        {cvData.courses && cvData.courses.length > 0 ? cvData.courses.map((course, idx) => (
          <div key={idx} style={{ marginBottom: '2mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#333', marginBottom: '1mm' }}>
              {course.name || "Senior Account Executive"}
            </div>
            <div style={{ fontSize: '10pt', color: designColors.primary.primary, fontWeight: 600,  }}>
              {course.institution || "TechSolutions Inc."}
            </div>
            <div style={{ fontSize: '8pt', color: '#666', marginBottom: '2mm' }}>
              📅 {course.date || ""}
            </div>
            <ul style={{ fontSize: '10pt', color: '#333',lineHeight: 1.5 }}>
              {course.description.split('\n').map((line, i) => <li key={i}>{line}</li>)} 
            </ul>
            {/* Add dashed line separator between experience items except for the last one */}
            {idx < (cvData.courses?.length || 0) - 1 && (
              <div style={{ 
                borderBottom: '1px dashed #ccc', 
                margin: '0 0 3mm 0',
                width: '100%',
                paddingTop:'3mm'
              }} />
            )}
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No experience added yet</div>}
      </div>
    </section>
  );

    const renderLanguages = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #333', paddingBottom: '2mm' }}>
        Languages
      </h2>
      <div>
        {cvData.languages && cvData.languages.length > 0 ? cvData.languages.map((lan, idx) => (
          <div key={idx} style={{ marginBottom: '2mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#333', marginBottom: '1mm' }}>
              {lan.name || "Senior Account Executive"}
            </div>
            <div style={{ fontSize: '10pt', color: designColors.primary.primary, fontWeight: 600, marginBottom: '1mm' }}>
              {lan.proficiency || "TechSolutions Inc."}
            </div>

            {/* Add dashed line separator between experience items except for the last one */}
            {idx < (cvData.languages?.length || 0) - 1 && (
              <div style={{ 
                borderBottom: '1px dashed #ccc', 
                margin: '0 0 3mm 0',
                width: '100%',
                paddingTop:'3mm'
              }} />
            )}
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No languages added yet</div>}
      </div>
    </section>
  );

  const renderAchievements = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #333', paddingBottom: '2mm' }}>
        Key Achievements
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4mm' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2mm', marginBottom: '3mm' }}>
            <span style={{ color: designColors.primary.primary, fontSize: '12pt' }}>📈</span>
            <div>
              <div style={{ fontWeight: 700, color: '#333', fontSize: '10pt', marginBottom: '1mm' }}>Maximized Referral Business</div>
              <div style={{ fontSize: '9pt', color: '#666', lineHeight: 1.4 }}>Initiated a client referral program that resulted in a sustained 10% YoY increase in business for Innov8.</div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2mm', marginBottom: '3mm' }}>
            <span style={{ color: designColors.primary.primary, fontSize: '12pt' }}>✏️</span>
            <div>
              <div style={{ fontWeight: 700, color: '#333', fontSize: '10pt', marginBottom: '1mm' }}>Strategic Account Growth</div>
              <div style={{ fontSize: '9pt', color: '#666', lineHeight: 1.4 }}>Successfully expanded key account portfolio by 40% within 12 months at Global Logistics Solutions.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderSkills = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #000', paddingBottom: '2mm' }}>
        Skills
      </h2>
      <div style={{ display: 'flex',flexWrap: 'wrap', gap: '3mm' }}>
        {cvData.skills && cvData.skills.length > 0 ? cvData.skills.map((skill, idx) => (
          <div key={idx} style={{ fontSize: '10pt', color: designColors.primary.primary, textAlign: 'center', padding: '2mm', paddingBottom:'3mm',backgroundColor: '#f5f5f5', borderRadius: '2mm' }}>
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
      ...CV_PAGE_STYLE,
      fontFamily: DesignFontFamily,
      // Custom for the template


      padding: '10mm',
    }}>
      {renderHeader()}
      {cvData.personalInfo?.summary && renderSummary()}
      {sectionMap["experience"] && renderExperience()}
      {sectionMap["projects"] && renderProjects()}
      {sectionMap["education"] && renderEducation()}
      {sectionMap["languages"] && renderLanguages()}
      {sectionMap["certificates"] && renderCertificates()}
      {sectionMap["courses"] && renderCourses()}
      {/* {sectionMap["achievements"] && renderAchievements()} */}
      {sectionMap["skills"] && renderSkills()}
    </div>
  );
};

// Finished
const MonochromeTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "personalInfo", "experience", "education", "skills", "projects"
  ]).forEach(s => { sectionMap[s] = true; });

  const DesignFontFamily = getFontFamily(cvData.designOptions?.font);
  const designColors = getColorStyles(cvData.designOptions?.primaryColor, cvData.designOptions?.secondaryColor);

  const renderHeader = () => (
    <section style={{ marginBottom: '12mm' }}>
      <h1 style={{ fontSize: '24pt', fontWeight: 700, color: '#000', marginBottom: '3mm', textTransform: 'uppercase' }}>
        {cvData.personalInfo?.fullName || "Isabelle Todd"}
      </h1>
      { cvData.personalInfo?.title && 
      <div style={{ fontSize: '12pt', color: '#666', marginBottom: '4mm' }}>
        {cvData.personalInfo?.title}
      </div>
      }
      <div style={{ fontSize: '10pt', color: '#666', marginBottom: '2mm' }}>
        📞 {cvData.personalInfo?.phone || "000-123-456"} &nbsp;&nbsp;
        📧 {cvData.personalInfo?.email || "todd@enhancv.com"} &nbsp;&nbsp;
        📍 {cvData.personalInfo?.location || "New York City, NY"} &nbsp;&nbsp;
      </div>
      <div style={{ fontSize: '10pt', color: '#666', marginBottom: '2mm', }}>
      {cvData.personalInfo?.linkedin && 
      <span>
      🔗 {cvData.personalInfo?.linkedin?.includes("https://") ? cvData.personalInfo?.linkedin?.split('https://')[1] : cvData.personalInfo?.linkedin}
      </span>
      }
      {cvData.personalInfo?.personal_website &&
      <span>
      &nbsp;&nbsp; 🔗 {cvData.personalInfo?.personal_website?.includes("https://") ? cvData.personalInfo?.personal_website?.split('https://')[1] : cvData.personalInfo?.personal_website}
      </span>
      }
      {cvData.personalInfo?.github &&
      <span>
      &nbsp;&nbsp; 🔗 {cvData.personalInfo?.github?.includes("https://") ? cvData.personalInfo?.github?.split('https://')[1] : cvData.personalInfo?.github}
      </span>
      }
      </div>
    </section>
  );

  const renderSummary = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #000', paddingBottom: '2mm' }}>
        Summary
      </h2>
      <p style={{ fontSize: '10pt', color: '#333', lineHeight: 1.6 }}>
        {cvData.personalInfo?.summary || "Result-orientated project team leader with 5 years of experience covering project and product management including developing, implementing and supporting complex infrastructures for fast growing startups. A fast and eager learner, I am detail orientated and adapt to changing project requirements quickly to meet business goals. Comfortable with ambiguity and thrive in fast-paced environment."}
      </p>
    </section>
  );

  const renderExperience = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #000', paddingBottom: '2mm' }}>
        Experience
      </h2>
      <div>
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '3mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#000', marginBottom: '1mm' }}>
              {exp.title || "Unit Director"}
            </div>
            <div style={{ fontSize: '10pt', color: '#666', fontWeight: 600, marginBottom: '1mm' }}>
              {exp.company || "Rover Games"}
            </div>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '2mm' }}>
              📅 {exp.startDate || "2019"} - {exp.endDate || "Present"} 
            </div>
            {/* <div style={{ fontSize: '9pt', color: '#666', marginBottom: '2mm', fontStyle: 'italic' }}>
              Tesla is an electric vehicle manufacturer that is revolutionizing the automobile industry
            </div> */}
            <ul style={{ fontSize: '10pt', color: '#333', paddingLeft: '5mm', lineHeight: 1.5 }}>
              {exp.description ? exp.description.split('\n').map((line, i) => <li key={i} style={{ marginBottom: '1mm' }}>{line}</li>) : 
                <>
                  <li style={{ marginBottom: '1mm' }}>Accelerated outbound sales cycle by 330% by designing and implementing customer acquisition platform for training and managing technical sales personnel</li>
                  <li style={{ marginBottom: '1mm' }}>Established and curated strategic partnerships with 6 out of 10 top state manufacturing companies which resulted in $20M additional annual revenue</li>
                </>
              }
            </ul>
            {/* Add dashed line separator between experience items except for the last one */}
            {idx < (cvData.experience?.length || 0) - 1 && (
              <div style={{ 
                borderBottom: '1px dashed #ccc', 
                margin: '0 0 3mm 0',
                width: '100%',
                padding: '2mm 0mm' 
              }} />
            )}
          </div>
          
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No experience added yet</div>}
      </div>
    </section>
  );

  const renderProjects = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #000', paddingBottom: '2mm' }}>
        Projects
      </h2>
      <div>
        {cvData.projects && cvData.projects.length > 0 ? cvData.projects.map((prj, idx) => (
          <div key={idx} style={{ marginBottom: '3mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#000', marginBottom: '1mm' }}>
              {prj.name || "Unit Director"}
            </div>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '2mm' }}>
              📅 {prj.startDate || "2019"} - {prj.endDate || "Present"}
            </div>
            <div style={{ fontSize: '9pt', color: '#666',paddingLeft: '5mm', marginBottom: '2mm', fontStyle: 'italic' }}>
            {prj.technologies && (
                <div style={{ fontWeight: 600, fontSize: '9pt', marginBottom: '1mm' }}>
                  {prj.technologies}
                </div>
              )}
            </div>
            <ul style={{ fontSize: '10pt', color: '#333', paddingLeft: '5mm', lineHeight: 1.5 }}>
              {prj.description ? prj.description.split('\n').map((line, i) => <li key={i} style={{ marginBottom: '1mm' }}>{line}</li>) : 
                <>
                  <li style={{ marginBottom: '1mm' }}>Accelerated outbound sales cycle by 330% by designing and implementing customer acquisition platform for training and managing technical sales personnel</li>
                  <li style={{ marginBottom: '1mm' }}>Established and curated strategic partnerships with 6 out of 10 top state manufacturing companies which resulted in $20M additional annual revenue</li>
                </>
              }
            </ul>
            {/* Add dashed line separator between experience items except for the last one */}
            {idx < (cvData.experience?.length || 0) - 1 && (
              <div style={{ 
                borderBottom: '1px dashed #ccc', 
                margin: '0 0 3mm 0',
                width: '100%',
                padding: '2mm 0mm' 
              }} />
            )}

          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No Projects added yet</div>}
      </div>
    </section>
  );

  const renderEducation = () => (
    <section style={{ marginBottom: '5mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #000', paddingBottom: '2mm' }}>
        Education
      </h2>
      <div>
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx} style={{ marginBottom: '1mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#000', marginBottom: '1mm' }}>
              {edu.degree || "MSc Project and Process Management"}
            </div>
            <div style={{ fontSize: '10pt', color: '#666', fontWeight: 600, marginBottom: '1mm' }}>
              {edu.school || "Van Hall Larenstein University"}
            </div>
            <div style={{ fontSize: '9pt', color: '#666' }}>
              📅 {edu.startDate || "2008"} - {edu.endDate || "2010"}
            </div>

            {/* Add dashed line separator between experience items except for the last one */}
            {idx < (cvData.education?.length || 0) - 1 && (
              <div style={{ 
                borderBottom: '1px dashed #ccc', 
                margin: '0 0 3mm 0',
                width: '100%',
                padding: '2mm 0mm' 
              }} />
            )}
            
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );

  const renderCertificates = () => (
    <section style={{ marginBottom: '5mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #000', paddingBottom: '2mm' }}>
        Certificates
      </h2>
      <div>
        {cvData.certificates && cvData.certificates.length > 0 ? cvData.certificates.map((cer, idx) => (
          <div key={idx} style={{ marginBottom: '1mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#000', }}>
              {cer.name || "Unit Director"}
            </div>
            <div style={{ fontSize: '10pt', color: '#666', fontWeight: 600,  }}>
              {cer.issuer || "Rover Games"}
            </div>
            <div style={{ fontSize: '9pt', color: '#666', fontWeight: 600,  }}>
              {cer.link || "Rover Games"}
            </div>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '2mm' }}>
              📅 {cer.date || ""} 
            </div>
              {cer.description.split('\n').map((line, i) => <div key={i}>{line}</div>)}
            {/* Add dashed line separator between experience items except for the last one */}
            {idx < (cvData.certificates?.length || 0) - 1 && (
              <div style={{ 
                borderBottom: '1px dashed #ccc', 
                margin: '0 0 3mm 0',
                width: '100%',
                padding: '2mm 0mm' 
              }} />
            )}
          </div>
          
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No certificates added yet</div>}
      </div>
    </section>
  );

    const renderCourses = () => (
    <section style={{ marginBottom: '5mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #000', paddingBottom: '2mm' }}>
        Courses
      </h2>
      <div>
        {cvData.courses && cvData.courses.length > 0 ? cvData.courses.map((course, idx) => (
          <div key={idx} style={{ marginBottom: '1mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#000', }}>
              {course.name || "Unit Director"}
            </div>
            <div style={{ fontSize: '10pt', color: '#666', fontWeight: 600,  }}>
              {course.institution || "Rover Games"}
            </div>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '2mm' }}>
              📅 {course.date || ""} 
            </div>
              {course.description.split('\n').map((line, i) => <div key={i}>{line}</div>)}
            {/* Add dashed line separator between experience items except for the last one */}
            {idx < (cvData.courses?.length || 0) - 1 && (
              <div style={{ 
                borderBottom: '1px dashed #ccc', 
                margin: '0 0 3mm 0',
                width: '100%',
                padding: '2mm 0mm' 
              }} />
            )}
          </div>
          
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No certificates added yet</div>}
      </div>
    </section>
  );


    const renderLanguages = () => (
    <section style={{ marginBottom: '5mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #000', paddingBottom: '2mm' }}>
        Languages
      </h2>
      <div>
        {cvData.languages && cvData.languages.length > 0 ? cvData.languages.map((lan, idx) => (
          <div key={idx} style={{ marginBottom: '1mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#000', marginBottom: '1mm' }}>
              {lan.name || "Unit Director"}
            </div>
            <div style={{ fontSize: '10pt', color: '#666', fontWeight: 600, marginBottom: '1mm' }}>
              {lan.proficiency || "Rover Games"}
            </div>

            {/* <div style={{ fontSize: '9pt', color: '#666', marginBottom: '2mm', fontStyle: 'italic' }}>
              Tesla is an electric vehicle manufacturer that is revolutionizing the automobile industry
            </div> */}
            {/* Add dashed line separator between experience items except for the last one */}
            {idx < (cvData.languages?.length || 0) - 1 && (
              <div style={{ 
                borderBottom: '1px dashed #ccc', 
                margin: '0 0 3mm 0',
                width: '100%',
                padding: '2mm 0mm' 
              }} />
            )}
          </div>
          
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No experience added yet</div>}
      </div>
    </section>
  );

  const renderSkills = () => (
    <section style={{ marginBottom: '4mm' }}>
      <h2 style={{ fontSize: '12pt', fontWeight: 700, color: '#000', textTransform: 'uppercase', marginBottom: '3mm', borderBottom: '2px solid #000', paddingBottom: '2mm' }}>
        Skills
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3mm' }}>
        {cvData.skills && cvData.skills.length > 0 ? cvData.skills.map((skill, idx) => (
          <div key={idx} style={{ fontSize: '10pt', color: '#333', textAlign: 'center', padding: '2mm',paddingBottom:'3mm', backgroundColor: '#f5f5f5', borderRadius: '2mm' }}>
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
      ...CV_PAGE_STYLE,
      fontFamily: DesignFontFamily,

      // Custom for the templates
      padding: '10mm',

    }}>
      {renderHeader()}
      {cvData.personalInfo?.summary && renderSummary()}
      {sectionMap["experience"] && renderExperience()}
      {sectionMap["projects"] && renderProjects()}
      {sectionMap["education"] && renderEducation()}
      {sectionMap["languages"] && renderLanguages()}
      {sectionMap["certificates"] && renderCertificates()}
      {sectionMap["courses"] && renderCourses()}
      {sectionMap["skills"] && renderSkills()}
    </div>
  );
};

// Finished
const ElegantTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "personalInfo", "experience", "education", "skills"
  ]).forEach(s => { sectionMap[s] = true; });

  const DesignFontFamily = getFontFamily(cvData.designOptions?.font);
  // Initialize designColors with primaryColor, defaulting to amber if not provided
  const designColors = getColorStyles(cvData.designOptions?.primaryColor || '#48acff', cvData.designOptions?.secondaryColor);
  // Default color to use as fallback
  const defaultColor = '#48acff';

  const renderSectionTitle = (title: string, rightSidebar?: boolean) => {
    const textColor = rightSidebar ? 'white' : '#666';
    return (
      <>
      <div style={{
        textTransform: 'uppercase',
        fontSize: '8pt',
        letterSpacing: '1.5px',
        color: textColor,
        fontWeight: 600,
        marginBottom: '0mm',
        paddingBottom:'2mm'
      }}>
        {title}
      </div>
      <div style={{ borderTop: '2px solid #ededed', marginBottom: '2mm' }}></div>
        </>
    );
  }

  const renderHeader = () => (
    <div style={{ padding: '10mm 0mm', backgroundColor: '#fff' }}>
      <h1 style={{ fontSize: '18pt', fontWeight: 700, letterSpacing: '0.5px', color: '#333', lineHeight: 1.2, marginBottom: '2mm' }}>
        {cvData.personalInfo?.fullName || "SAMUEL CAMPBELL"}
      </h1>
      {cvData.personalInfo?.title && 
      <h2 style={{ fontSize: '14pt', fontWeight: 600, letterSpacing: '0.5px', color: designColors.primary.primary, lineHeight: 1.2, marginBottom: '2mm' }}>
        {cvData.personalInfo?.title}
      </h2>}
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

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0mm', fontSize: '10pt', color: '#666', marginBottom: '2mm' }}>
        {cvData.personalInfo?.linkedin && 
      <span>
      🔗 {cvData.personalInfo?.linkedin?.includes("https://") ? cvData.personalInfo?.linkedin?.split('https://')[1] : cvData.personalInfo?.linkedin}
      </span>
      }
      {cvData.personalInfo?.personal_website &&
      <span>
      &nbsp; 🔗 {cvData.personalInfo?.personal_website?.includes("https://") ? cvData.personalInfo?.personal_website?.split('https://')[1] : cvData.personalInfo?.personal_website}
      </span>
      }
      {cvData.personalInfo?.github &&
      <span>
      🔗 {cvData.personalInfo?.github?.includes("https://") ? cvData.personalInfo?.github?.split('https://')[1] : cvData.personalInfo?.github}
      </span>
      }
      </div>

    </div>
  );

  const renderSummary = () => (
    <section style={{ marginBottom: '5mm' }}>
      {renderSectionTitle("Summary")}
      <p style={{ fontSize: '10pt', color: '#333', lineHeight: 1.6 }}>
        {cvData.personalInfo?.summary ||
          "With over a decade of IT project management experience, adept in Agile and Waterfall methodologies, I possess a robust track record of delivering sophisticated IT projects. My proactive approach has consistently driven projects to success against challenging timeframes, highlighting my strength in orchestrating application software and hardware upgrades to meet strategic business objectives."}
      </p>
    </section>
  );

  const renderExperience = () => (
    <section style={{ marginBottom: '5mm' }}>
      {renderSectionTitle("Experience")}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '2mm' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
              <div style={{ fontWeight: 700, color: '#222', fontSize: '11pt' }}>{exp.title || "Senior IT Project Manager"}</div>
              <div style={{ fontSize: '9pt', color: '#666' }}>{exp.startDate || "06/2018"} - {exp.endDate || "Present"}</div>
            </div>
            <div style={{ color: designColors.primary.primary, fontWeight: 600, fontSize: '10pt', marginBottom: '1mm' }}>{exp.company || "TechWave Solutions"}</div>
            <div style={{  paddingLeft: '4mm', fontSize: '10pt', color: '#333', lineHeight: 1.5, marginTop: '2mm' }}>
              {exp.description && <p>{exp.description}</p>}
            </div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No experience added yet</div>}
      </div>
    </section>
  );

    const renderProjects = () => (
    <section style={{ marginBottom: '5mm' }}>
      {renderSectionTitle("Projects")}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
        {cvData.projects && cvData.projects.length > 0 ? cvData.projects.map((proj, idx) => (
          <div key={idx} style={{ marginBottom: '2mm' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
              <div style={{ fontWeight: 700, color: '#222', fontSize: '11pt' }}>{proj.name || "Senior IT Project Manager"}</div>
              <div style={{ fontSize: '9pt', color: '#666' }}>{proj.startDate || "06/2018"} - {proj.endDate || "Present"}</div>
            </div>
            <div style={{ color: designColors.primary.primary, fontWeight: 600, fontSize: '9pt' , fontStyle:'italic' , paddingLeft:'4mm'}}>
              {proj.technologies && (
                <div>
                  {proj.technologies}
                </div>
              )}
              </div>
            <div style={{ listStyleType: 'disc', paddingLeft: '4mm', fontSize: '10pt', color: '#333', lineHeight: 1.5 }}>
              {proj.description && <p>{proj.description}</p>}
            </div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No Projects added yet</div>}
      </div>
    </section>
  );

  const renderEducation = () => (
    <section style={{ marginBottom: '5mm' }}>
      {renderSectionTitle("Education", true)}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '11pt' }}>{edu.degree || "MSc Information Technology Management"}</div>
              <div style={{ fontSize: '9pt', color: '#fff' }}>{edu.startDate || "01/2010"} - {edu.endDate || "01/2011"}</div>
            </div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '10pt' }}>{edu.school || "University of Manchester"}</div>
          </div>
        )) : <div style={{ color: '#fff', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );

    const renderCertificates = () => (
    <section style={{ marginBottom: '5mm' }}>
      {renderSectionTitle("Certificates", true)}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
        {cvData.certificates && cvData.certificates.length > 0 ? cvData.certificates.map((cer, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '11pt' }}>{cer.name || "MSc Information Technology Management"}</div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '10pt' }}>{cer.issuer || ""}</div>
              <div style={{ fontSize: '9pt', color: '#fff' }}>{cer.date || ""}</div>
              <div style={{ fontSize: '8pt', color: '#fff' }}>{cer.link || ""}</div>
              <div style={{  fontSize: '7pt', color: '#fff', lineHeight: 1.5, }}>
                {cer.description}
              </div>
            </div>
          </div>
        )) : <div style={{ color: '#fff', fontStyle: 'italic' }}>No certificates added yet</div>}
      </div>
    </section>
  );

      const renderCourses = () => (
    <section style={{ marginBottom: '5mm' }}>
      {renderSectionTitle("Courses", true)}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
        {cvData.courses && cvData.courses.length > 0 ? cvData.courses.map((course, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '11pt' }}>{course.name || "MSc Information Technology Management"}</div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '10pt' }}>{course.institution || ""}</div>
              <div style={{ fontSize: '9pt', color: '#fff' }}>{course.date || ""}</div>
              <div style={{  fontSize: '7pt', color: '#fff', lineHeight: 1.5, }}>
                {course.description}
              </div>
            </div>
          </div>
        )) : <div style={{ color: '#fff', fontStyle: 'italic' }}>No certificates added yet</div>}
      </div>
    </section>
  );

    const renderLanguages = () => (
    <section style={{ marginBottom: '5mm' }}>
      {renderSectionTitle("Languages", true)}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
        {cvData.languages && cvData.languages.length > 0 ? cvData.languages.map((lan, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '11pt' }}>{lan.name || "MSc Information Technology Management"}</div>
            </div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '10pt' }}>{lan.proficiency || "University of Manchester"}</div>
          </div>
        )) : <div style={{ color: '#fff', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );

  const renderSkills = () => (
    <section style={{ marginBottom: '5mm' }}>
      {renderSectionTitle("Skills", true)}
      <div style={{ display: 'flex',flexWrap:'wrap', gap: '2mm' }}>
        {cvData.skills && cvData.skills.length > 0 ? (
          cvData.skills.map((skill, idx) => (
            <span key={idx} style={{ backgroundColor: '#fff', color: designColors.primary.secondary, padding: '2mm',paddingBottom: '3mm', borderRadius: '10pt', fontSize: '9pt', textAlign: 'center', fontWeight: 600 }}>
              {skill}
            </span>
          ))
        ) : (
          <span style={{ color: '#dbeafe', fontStyle: 'italic' }}>No skills added yet</span>
        )}
      </div>
    </section>
  );

  return (
    <div className="cv-page" style={{
      ...CV_PAGE_STYLE,
      fontFamily: DesignFontFamily,
      padding: '0mm',
      display: 'flex',
      flexDirection: 'row',
    }}>
      {/* Main (left) */}
      <div style={{ flex: 1, padding: '0mm 6mm', minHeight: '297mm', display: 'flex', flexDirection: 'column', gap: '0' }}>
        {renderHeader()}
        {cvData.personalInfo?.summary && renderSummary()}
        {sectionMap["experience"] && renderExperience()}
        {sectionMap["projects"] && renderProjects()}
      </div>
      {/* Main (left) */}

      {/* Sidebar (right) */}
      <div style={{ width: '70mm', padding: '0mm 4mm', display: 'flex', flexDirection: 'column', minHeight: '297mm', backgroundColor: designColors.primary.secondary }}>
        <div style={{ marginTop: '52mm' }}></div>
        {sectionMap["education"] && renderEducation()}
        {sectionMap["languages"] && renderLanguages()}
        {sectionMap["certificates"] && renderCertificates()}
        {sectionMap["courses"] && renderCourses()}
        {sectionMap["skills"] && renderSkills()}
      </div>
      {/* Sidebar (right) */}
    </div>
  );
};

// Finished
const TimelineTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "header", "summary", "experience", "projects", "education", "achievements", "skills"
  ]).forEach(s => { sectionMap[s] = true; });

  const DesignFontFamily = getFontFamily(cvData.designOptions?.font);
  // Initialize designColors with primaryColor, defaulting to amber if not provided
  const designColors = getColorStyles(cvData.designOptions?.primaryColor || '#d97706', cvData.designOptions?.secondaryColor);
  // Default color to use as fallback
  const defaultColor = '#d97706';

  const renderHeader = () => (
    <div style={{ marginBottom: '6mm' }}>
      <h1 style={{ fontSize: '16pt', fontWeight: 700, letterSpacing: '0.5px', color: '#333', lineHeight: 1.2, marginBottom: '2mm' }}>
        {cvData.personalInfo?.fullName || "STEVE GREEN"}
      </h1>
      {cvData.personalInfo?.title && 
      <div style={{ fontSize: '12pt', fontWeight: 600, color: designColors.primary.primary, marginTop: '1mm', marginBottom: '2mm' }}>
        {cvData.personalInfo?.title || ""}
      </div>
        }
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4mm', alignItems: 'center', fontSize: '9pt', color: '#555' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '1mm' }}>
          <span>📞</span> {cvData.personalInfo?.phone || "+44 20 7123 4567"}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '1mm' }}>
          <span>✉️</span> {cvData.personalInfo?.email || "help@enhancv.com"}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '1mm' }}>
          <span>📍</span> {cvData.personalInfo?.location || "Reading, UK"}
        </span>
        <div style={{marginBottom: '2.5mm' }}>
        {cvData.personalInfo?.linkedin && 
      <span>
      🔗 {cvData.personalInfo?.linkedin?.includes("https://") ? cvData.personalInfo?.linkedin?.split('https://')[1] : cvData.personalInfo?.linkedin}
      </span>
      }
      {cvData.personalInfo?.personal_website &&
      <span>
      &nbsp;&nbsp; 🔗 {cvData.personalInfo?.personal_website?.includes("https://") ? cvData.personalInfo?.personal_website?.split('https://')[1] : cvData.personalInfo?.personal_website}
      </span>
      }
      {cvData.personalInfo?.github &&
      <span>
      &nbsp;&nbsp; 🔗 {cvData.personalInfo?.github?.includes("https://") ? cvData.personalInfo?.github?.split('https://')[1] : cvData.personalInfo?.github}
      </span>
      }
        </div>
      </div>
    </div>
  );

  const renderSummary = () => (
    <section style={{ marginBottom: '4mm' }}>
      <div style={{ fontSize: '11pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '1mm' }}>Summary</div>
      <p style={{ fontSize: '10pt', color: '#333', lineHeight: 1.5 }}>
        {cvData.personalInfo?.summary || "Dedicated Data Scientist with a proven track record in predictive analytics, machine learning, and AI innovation. Skilled in developing advanced models to drive strategic decision-making and enhance operational efficiency. Experienced in optimizing algorithms for improved performance and leading collaborative teams to achieve remarkable results. Strong background in data governance and visualization. Enthusiastic about utilizing data-driven insights to contribute to impactful projects that align with business objectives and societal well-being."}
      </p>
    </section>
  );

  const renderExperience = () => (
    <section style={{ marginBottom: '4mm' }}>
      <div style={{ fontSize: '11pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '2mm' }}>Experience</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm', position: 'relative' }}>
        {/* Timeline vertical line */}
        <div style={{ 
          position: 'absolute',
          left: '36mm', /* Positioned after the date column (40mm) plus half of the gap (6mm) */
          top: '10px',
          bottom: '10px',
          width: '2px',
          backgroundColor: designColors.primary.primary,
          opacity: 0.5,
          zIndex: 1
        }}></div>
        
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={exp.id || idx} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '6mm', position: 'relative' }}>
            <div style={{ width: '40mm', fontSize: '9pt', color: '#555', fontWeight: 500, whiteSpace: 'nowrap' }}>
              {exp.startDate || "MM/YYYY"} - {exp.endDate || "MM/YYYY"}
            </div>
            {/* Timeline dot for each experience item */}
            <div style={{
              position: 'absolute',
              left: '35.3mm',
              top: '5px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: designColors.primary.primary,
              zIndex: 2
            }}></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#333', fontSize: '10pt', marginBottom: '0.5mm' }}>
                {exp.title || "Data Scientist"}
              </div>
              <div style={{ fontWeight: 600, color: designColors.primary.primary, fontSize: '9pt', marginBottom: '1mm' }}>
                {exp.company || "Company"}
              </div>
              <div style={{ listStyleType: 'disc',  fontSize: '9pt', color: '#333', lineHeight: 1.4 }}>
                {exp.description ? exp.description.split('\n').map((line, i) => <div key={i}>{line}</div>) : <li>Job description</li>}
              </div>
            </div>
          </div>
        )) : <div style={{ color: '#777', fontStyle: 'italic', fontSize: '9pt' }}>No experience added yet</div>}
      </div>
    </section>
  );

  const renderProjects = () => (
    <section style={{ marginBottom: '4mm' }}>
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
                <div style={{ fontWeight: 600, color: designColors.primary.primary, fontSize: '9pt', marginBottom: '1mm' }}>
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
    <section style={{ marginBottom: '4mm' }}>
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
              <div style={{ fontWeight: 600, color: designColors.primary.primary, fontSize: '9pt', marginBottom: '1mm' }}>
                {edu.school || "Institution"}
              </div>
            </div>
          </div>
        )) : <div style={{ color: '#777', fontStyle: 'italic', fontSize: '9pt' }}>No education added yet</div>}
      </div>
    </section>
  );

    const renderCertificates = () => (
    <section style={{ marginBottom: '4mm' }}>
      <div style={{ fontSize: '11pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '2mm' }}>Certificates</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
        {cvData.certificates && cvData.certificates.length > 0 ? cvData.certificates.map((cer, idx) => (
          <div key={cer.id || idx} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '6mm' }}>
            <div style={{ width: '40mm', fontSize: '9pt', color: '#555', fontWeight: 500, whiteSpace: 'nowrap' }}>
              {cer.date || ""}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#333', fontSize: '10pt', marginBottom: '0.5mm' }}>
                {cer.name || "Project Name"}
              </div>
                <div style={{ fontWeight: 600, color: designColors.primary.primary, fontSize: '9pt' }}>
                  {cer.issuer}
                </div>
                <div style={{ fontWeight: 600, color: '#333', fontSize: '8pt', marginBottom: '1mm' }}>
                  {cer.link}
                </div>
              <div style={{ fontSize: '9pt', color: '#333', marginTop: '1mm', lineHeight: 1.4 }}>
                {cer.description || ""}
              </div>
            </div>
          </div>
        )) : <div style={{ color: '#777', fontStyle: 'italic', fontSize: '9pt' }}>No certificates added yet</div>}
      </div>
    </section>
  );

      const renderCourses = () => (
    <section style={{ marginBottom: '4mm' }}>
      <div style={{ fontSize: '11pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '2mm' }}>Courses</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
        {cvData.courses && cvData.courses.length > 0 ? cvData.courses.map((course, idx) => (
          <div key={course.id || idx} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '6mm' }}>
            <div style={{ width: '40mm', fontSize: '9pt', color: '#555', fontWeight: 500, whiteSpace: 'nowrap' }}>
              {course.date || ""}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#333', fontSize: '10pt', marginBottom: '0.5mm' }}>
                {course.name || "Project Name"}
              </div>
                <div style={{ fontWeight: 600, color: designColors.primary.primary, fontSize: '9pt' }}>
                  {course.institution}
                </div>
              <div style={{ fontSize: '9pt', color: '#333', marginTop: '1mm', lineHeight: 1.4 }}>
                {course.description || ""}
              </div>
            </div>
          </div>
        )) : <div style={{ color: '#777', fontStyle: 'italic', fontSize: '9pt' }}>No courses added yet</div>}
      </div>
    </section>
  );
    const renderLanguages = () => (
    <section style={{ marginBottom: '4mm' }}>
      <div style={{ fontSize: '11pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '2mm' }}>Languages</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
        {cvData.languages && cvData.languages.length > 0 ? cvData.languages.map((lan, idx) => (
          <div key={lan.id || idx} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '6mm' }}>
            <div style={{ width: '40mm', fontSize: '9pt', color: '#555', fontWeight: 500, whiteSpace: 'nowrap' }}>
              {lan.proficiency || ""}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#333', fontSize: '10pt', marginBottom: '0.5mm' }}>
                {lan.name || ""}
              </div>
            </div>
          </div>
        )) : <div style={{ color: '#777', fontStyle: 'italic', fontSize: '9pt' }}>No Languages added yet</div>}
      </div>
    </section>
  );

  const renderAchievements = () => (
    <section style={{ marginBottom: '4mm' }}>
      <div style={{ fontSize: '11pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '2mm' }}>Achievements</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4mm' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2mm' }}>
          <span style={{ color: designColors.primary.primary, fontSize: '12pt', marginTop: '0.5mm' }}>✔️</span>
          <div>
            <div style={{ fontWeight: 700, color: '#333', fontSize: '9pt' }}>Team Leadership</div>
            <div style={{ color: '#555', fontSize: '9pt', lineHeight: 1.4 }}>Successfully led a team of data scientists to improve productivity by 30% through strategic project management and mentoring.</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2mm' }}>
          <span style={{ color: designColors.primary.primary, fontSize: '12pt', marginTop: '0.5mm' }}>🏳️</span>
          <div>
            <div style={{ fontWeight: 700, color: '#333', fontSize: '9pt' }}>Machine Downtime Reduction</div>
            <div style={{ color: '#555', fontSize: '9pt', lineHeight: 1.4 }}>Developed a predictive maintenance model that reduced machine downtime by 20% and enhanced manufacturing efficiency.</div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderSkills = () => (
    <section style={{ marginBottom: '4mm' }}>
      <div style={{ fontSize: '11pt', fontWeight: 700, color: '#333', textTransform: 'uppercase', marginBottom: '2mm' }}>Skills</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4mm' }}>
        {cvData.skills && cvData.skills.length > 0 ? cvData.skills.map((skill, idx) => (
          <span key={idx} style={{ backgroundColor: designColors.primary.bg, color: designColors.primary.secondary, fontWeight: 700, padding: '1mm 3mm', borderRadius: '1mm', fontSize: '10pt' }}>
            {skill}
          </span>
        )) : <span style={{ color: '#777', fontStyle: 'italic', fontSize: '9pt' }}>No skills added yet</span>}
      </div>
    </section>
  );

  return (
    <div id="cv-content" style={{
      ...CV_PAGE_STYLE,
      fontFamily: DesignFontFamily,

      // Custom For The Template
      padding: '10mm',
      color: '#333',
      boxShadow: 'none',
      border: 'none',
      overflow: 'visible',

    }}>
      {renderHeader()}
      {cvData.personalInfo?.summary && renderSummary()}
      {sectionMap["experience"] && renderExperience()}
      {sectionMap["projects"] && renderProjects()}
      {sectionMap["education"] && renderEducation()}
      {sectionMap["languages"] && renderLanguages()}
      {sectionMap["certificates"] && renderCertificates()}
      {sectionMap["courses"] && renderCourses()}
      {sectionMap["achievements"] && renderAchievements()}
      {sectionMap["skills"] && renderSkills()}
    </div>
  );
};

// Finished
const CompactTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "personalInfo", "summary", "experience", "projects", "education", "achievements", "skills", "courses", "passions"
  ]).forEach(s => { sectionMap[s] = true; });

  const DesignFontFamily = getFontFamily(cvData.designOptions?.font);
  // Initialize designColors with primaryColor, defaulting to amber if not provided
  const designColors = getColorStyles(cvData.designOptions?.primaryColor || '#2563eb', cvData.designOptions?.secondaryColor);
  // Default color to use as fallback
  const defaultColor = '#2563eb';

  const renderTitle = (title : string) => (
    <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#666', fontWeight: 600, marginBottom: '1mm' }}>{title}</div>
  )
  const renderHeader = () => (
    <div style={{ padding: '0mm 0 6mm 0', backgroundColor: '#fff' }}>
      <h1 style={{ fontSize: '20pt', fontWeight: 700, color: '#222', marginBottom: '2mm' }}>
        {cvData.personalInfo?.fullName || "Mia Ward"}
      </h1>
      {cvData.personalInfo?.title && 
      <div style={{ fontSize: '14pt', fontWeight: 600, color: designColors.primary.primary, marginBottom: '3mm' }}>
        {cvData.personalInfo?.title}
      </div>
      }
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10mm', alignItems: 'center', fontSize: '10pt', color: '#666', marginBottom: '2mm' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '2mm' }}>
          <span>📞</span> {cvData.personalInfo?.phone || "+44 20 7123 4567"}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '2mm' }}>
          <span>✉️</span> {cvData.personalInfo?.email || "help@enhancv.com"}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '2mm' }}>
          <span>📍</span> {cvData.personalInfo?.location || "Reading, UK"}
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10mm', alignItems: 'center', fontSize: '10pt', color: '#666', marginBottom: '2mm' }}>
        {cvData.personalInfo?.linkedin && 
      <span>
      🔗 {cvData.personalInfo?.linkedin?.includes("https://") ? cvData.personalInfo?.linkedin?.split('https://')[1] : cvData.personalInfo?.linkedin}
      </span>
      }
      {cvData.personalInfo?.personal_website &&
      <span>
      &nbsp;&nbsp; 🔗 {cvData.personalInfo?.personal_website?.includes("https://") ? cvData.personalInfo?.personal_website?.split('https://')[1] : cvData.personalInfo?.personal_website}
      </span>
      }
      {cvData.personalInfo?.github &&
      <span>
      &nbsp;&nbsp; 🔗 {cvData.personalInfo?.github?.includes("https://") ? cvData.personalInfo?.github?.split('https://')[1] : cvData.personalInfo?.github}
      </span>
      }
      </div>


    </div>
  );

  const renderSummary = () => (
    <section style={{ marginBottom: '5mm' }}>
      {renderTitle("SUMMARY")}
      <p style={{ fontSize: '10pt', color: '#333', lineHeight: 1.6 }}>
        {cvData.personalInfo?.summary || "Enthusiastic Data Scientist with a proven track record in leading innovative AI and machine learning projects. Experienced in developing predictive analytics models, improving data processing efficiency, and enhancing customer insights. Skilled in team leadership and collaborating across functions to drive strategic decision-making. MSc in Data Science from a prestigious university. Passionate about predictive analytics, AI for social good, and data-driven storytelling, aligning with the mission of leveraging data for impactful solutions."}
      </p>
    </section>
  );

  const renderExperience = () => (
    <section style={{ marginBottom: '5mm' }}>
      {renderTitle("EXPERIENCE")}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '2mm' }}>
            <div style={{ fontWeight: 700, fontSize: '11pt', color: '#222', lineHeight: 1.3 }}>{exp.title || "Job Title"}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center', gap: '4mm', marginBottom: '1mm' }}>
              <div style={{ color: designColors.primary.primary, fontWeight: 600, fontSize: '10pt' }}>{exp.company || "Company"}</div>
              <span style={{ color: '#666', fontSize: '9pt' }}>{exp.startDate || "MM/YYYY"} - {exp.endDate || "MM/YYYY"}</span>
            </div>
            <div style={{ paddingLeft: '4mm', fontSize: '10pt', color: '#333', lineHeight: 1.5, marginTop: '1mm' }}>
              {exp.description ? exp.description.split('\n').map((line, i) => <div key={i}>{line}</div>) : <li>Job description</li>}
            </div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No experience added yet</div>}
      </div>
    </section>
  );

  const renderProjects = () => (
    <section style={{ marginBottom: '5mm' }}>
      {renderTitle("PROJECTS")}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
        {cvData.projects && cvData.projects.length > 0 ? cvData.projects.map((proj, idx) => (
          <div key={idx} style={{ marginBottom: '2mm' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
              <div style={{ fontWeight: 700, color: '#222', fontSize: '10pt' }}>{proj.name || "Project Name"}</div>
              <div style={{ fontSize: '9pt', color: '#666' }}>{proj.startDate || ""} - {proj.endDate || ""}</div>
            </div>
              <p style={{ fontSize: '9pt',  paddingLeft:'4mm', color:designColors.primary.primary }}>
                {proj.technologies && (
                <div style={{ fontWeight: 600, fontStyle:'italic'}}>
                  {proj.technologies}
                </div>
              )}
              </p>
            <p style={{ fontSize: '10pt', color: '#333' ,paddingLeft:'4mm' }}>{proj.description || ""}</p>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No projects added yet</div>}
      </div>
    </section>
  );

  const renderEducation = () => (
    <section style={{ marginBottom: '5mm' }}>
      {renderTitle("EDUCATION")}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2mm' }}>
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx}>
            <div style={{ fontWeight: 700, color: '#000', fontSize: '10pt' }}>{edu.degree || "MSc in Data Science"}</div>
            <div style={{ color: designColors.primary.primary, fontWeight: 600, fontSize: '10pt' }}>{edu.school || "University College London"}</div>
            <div style={{ fontSize: '9pt', color: '#666' }}>{edu.startDate || "01/2014"} - {edu.endDate || "01/2015"}</div>
          </div>
        )) : <div style={{ color: '#000', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );

    const renderCertificates = () => (
    <section style={{ marginBottom: '5mm' }}>
      {renderTitle("Certificates")}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2mm' }}>
        {cvData.certificates && cvData.certificates.length > 0 ? cvData.certificates.map((cer, idx) => (
          <div key={idx}>
            <div style={{ fontWeight: 700, color: '#000', fontSize: '10pt' }}>{cer.name || "MSc in Data Science"}</div>
            <div style={{ color: designColors.primary.primary, fontWeight: 600, fontSize: '10pt' }}>{cer.issuer || "University College London"}</div>
            <div style={{ fontSize: '9pt', color: '#666' }}>{cer.link || ""}</div>
            <div style={{ fontSize: '9pt', color: '#666' }}>{cer.date || ""}</div>
            <div style={{ fontSize: '7pt', color: '#666' }}>{cer.description || ""}</div>
          </div>
        )) : <div style={{ color: '#000', fontStyle: 'italic' }}>No education added yet</div>}
      </div>
    </section>
  );

      const renderCourses = () => (
    <section style={{ marginBottom: '5mm' }}>
      {renderTitle("Courses")}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2mm' }}>
        {cvData.courses && cvData.courses.length > 0 ? cvData.courses.map((course, idx) => (
          <div key={idx}>
            <div style={{ fontWeight: 700, color: '#000', fontSize: '10pt' }}>{course.name || "MSc in Data Science"}</div>
            <div style={{ color: designColors.primary.primary, fontWeight: 600, fontSize: '10pt' }}>{course.institution || "University College London"}</div>
            <div style={{ fontSize: '9pt', color: '#666' }}>{course.date || ""}</div>
            <div style={{ fontSize: '7pt', color: '#666' }}>{course.description || ""}</div>
          </div>
        )) : <div style={{ color: '#000', fontStyle: 'italic' }}>No courses added yet</div>}
      </div>
    </section>
  );

    const renderLanguages = () => (
    <section style={{ marginBottom: '5mm' }}>
      {renderTitle("Languages")}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2mm' }}>
        {cvData.languages && cvData.languages.length > 0 ? cvData.languages.map((lan, idx) => (
          <div key={idx}>
            <div style={{ fontWeight: 700, color: '#000', fontSize: '10pt' }}>{lan.name || ""}</div>
            <div style={{ color: designColors.primary.primary, fontWeight: 600, fontSize: '10pt' }}>{lan.proficiency || "University College London"}</div>
          </div>
        )) : <div style={{ color: '#000', fontStyle: 'italic' }}>No languages added yet</div>}
      </div>
    </section>
  );

  const renderAchievements = () => (
    <section style={{ marginBottom: '6mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#fff', fontWeight: 600, marginBottom: '1mm' }}>Achievements</div>
      <div style={{ borderTop: '1px solid #93c5fd', marginBottom: '2mm' }}></div>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '2mm' }}>
        <li>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '10pt' }}>Team Leadership</div>
          <div style={{ color: '#dbeafe', fontSize: '9pt' }}>Successfully led a team of data scientists to improve productivity by 30% through strategic project management and mentoring.</div>
        </li>
        <li>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '10pt' }}>Machine Downtime Reduction</div>
          <div style={{ color: '#dbeafe', fontSize: '9pt' }}>Developed a predictive maintenance model that reduced machine downtime by 20% and enhanced manufacturing efficiency.</div>
        </li>
        <li>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '10pt' }}>Sales Campaign Enhancement</div>
          <div style={{ color: '#dbeafe', fontSize: '9pt' }}>Applied cluster analysis in customer segmentation, increasing conversion rates by 17% in targeted marketing campaigns.</div>
        </li>
        <li>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '10pt' }}>Forecasting Model Development</div>
          <div style={{ color: '#dbeafe', fontSize: '9pt' }}>Created an AI-driven forecast model that increased predictive accuracy by 20%, significantly impacting strategic planning.</div>
        </li>
      </ul>
    </section>
  );

  const renderSkills = () => (
    <section style={{ marginBottom: '5mm' }}>
      {renderTitle("SKILLS")}
      <div style={{ display: 'flex',flexWrap: 'wrap' , gap: '2mm' }}>
        {cvData.skills && cvData.skills.length > 0 ? cvData.skills.map((skill, idx) => (
          <span key={idx} style={{ backgroundColor: '#ededed', color: designColors.primary.primary, fontWeight: 700, padding: '2mm' ,paddingBottom:'3mm', borderRadius: '2mm', fontSize: '9pt', textAlign: 'center' }}>
            {skill}
          </span>
        )) : <span style={{ color: '#dbeafe', fontStyle: 'italic' }}>No skills added yet</span>}
      </div>
    </section>
  );

  const renderPassions = () => (
    <section style={{ marginBottom: '6mm' }}>
      <div style={{ textTransform: 'uppercase', fontSize: '8pt', letterSpacing: '1.5px', color: '#fff', fontWeight: 600, marginBottom: '1mm' }}>Passions</div>
      <div style={{ borderTop: '1px solid #93c5fd', marginBottom: '2mm' }}></div>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '2mm' }}>
        <li>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '10pt' }}>Predictive Analytics</div>
          <div style={{ color: '#dbeafe', fontSize: '9pt' }}>Passionate about uncovering trends and making accurate predictions that drive business success through data analysis.</div>
        </li>
        <li>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '10pt' }}>AI for Social Good</div>
          <div style={{ color: '#dbeafe', fontSize: '9pt' }}>Interested in applying AI for solving complex societal challenges and contributing to community-centric projects.</div>
        </li>
        <li>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '10pt' }}>Data-Driven Storytelling</div>
          <div style={{ color: '#dbeafe', fontSize: '9pt' }}>Enjoy exploring the narrative potential of data and translating complex insights into compelling stories for diverse audiences.</div>
        </li>
      </ul>
    </section>
  );

  return (
    <div className="cv-page" style={{
      ...CV_PAGE_STYLE,
      fontFamily: DesignFontFamily,
      padding: '6mm',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Header ( Center ) */}
        {renderHeader()}

        <div style={{display: 'flex' , flexDirection:'row'}}>
          {/* Main (left) */}
          <div style={{ flex: 1, paddingRight: '6mm', minHeight: '297mm', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {cvData.personalInfo?.summary && renderSummary()}
            {sectionMap["experience"] && renderExperience()}
            {sectionMap["projects"] && renderProjects()}
          </div>
          {/* Main (left) */}

          {/* Sidebar (right) */}
          <div style={{ width: '70mm', display: 'flex', flexDirection: 'column', minHeight: '297mm' }}>
            {sectionMap["education"] && renderEducation()}
            {sectionMap["languages"] && renderLanguages()}
            {sectionMap["certificates"] && renderCertificates()}
            {sectionMap["courses"] && renderCourses()}
            {sectionMap["skills"] && renderSkills()}
            {/* {sectionMap["achievements"] && renderAchievements()} */}
            {/* {sectionMap["courses"] && renderCourses()} */}
            {/* {sectionMap["passions"] && renderPassions()} */}
          </div>
          {/* Sidebar (right) */}
        </div>

    </div>
  );
};

// Finished
const HeaderTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "personalInfo", "summary", "experience", "projects", "education", "skills"
  ]).forEach(s => { sectionMap[s] = true; });

  const DesignFontFamily = getFontFamily(cvData.designOptions?.font);
  // Initialize designColors with primaryColor, defaulting to amber if not provided
  const designColors = getColorStyles(cvData.designOptions?.primaryColor || '#16a34a', cvData.designOptions?.secondaryColor);
  // Default color to use as fallback
  const defaultColor = '#16a34a';

  const renderHeader = () => (
    <div style={{padding: '2mm'}}>
      <div style={{ 
      borderRadius: '5mm', 
      backgroundColor: designColors.primary.bg, 
      border: `1px solid ${designColors.primary.bg}`, 
      padding: '10mm', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '2mm', 
    }}>
      <div>
        <h1 style={{ fontSize: '18pt', fontWeight: 700, color: '#222', marginBottom: '1mm' }}>
          {cvData.personalInfo?.fullName || "Kane Jones"}
        </h1>
        {cvData.personalInfo?.title && 
          <h1 style={{ fontSize: '12pt', fontWeight: 600, color: '#222', marginBottom: '1mm' }}>
          {cvData.personalInfo?.title}
        </h1>
        }
        <div style={{ fontSize: '10pt', color: '#555', marginBottom: '1mm' }}>
          {cvData.personalInfo?.email || "kjn_77es14@yahoo.com"} • {cvData.personalInfo?.phone || "(512)701-9215"}
        </div>
        <div style={{ fontSize: '10pt', color: '#555' }}>
          {cvData.personalInfo?.location || "88 Lorenzo Road, Austin, United States, TX 73301"}
        </div>
        <div style={{ fontSize: '10pt', color: '#555' }}>
        {cvData.personalInfo?.linkedin && 
      <span>
      🔗 {cvData.personalInfo?.linkedin?.includes("https://") ? cvData.personalInfo?.linkedin?.split('https://')[1] : cvData.personalInfo?.linkedin}
      </span>
      }
      {cvData.personalInfo?.personal_website &&
      <span>
      &nbsp;&nbsp; 🔗 {cvData.personalInfo?.personal_website?.includes("https://") ? cvData.personalInfo?.personal_website?.split('https://')[1] : cvData.personalInfo?.personal_website}
      </span>
      }
      {cvData.personalInfo?.github &&
      <span>
      &nbsp;&nbsp; 🔗 {cvData.personalInfo?.github?.includes("https://") ? cvData.personalInfo?.github?.split('https://')[1] : cvData.personalInfo?.github}
      </span>
      }
        </div>
        
      </div>
      </div>
    </div>
  );

  const renderSummary = () => (
    <section style={{ marginTop: '4mm', marginBottom: '8mm' }}>
      <div style={{ fontSize: '12pt', fontWeight: 600, color: designColors.primary.secondary, marginBottom: '2mm' }}>Summary</div>
      {/* <div style={{ borderTop: '1px solid #bbf7d0', marginBottom: '2mm' }}></div> */}
      <p style={{ fontSize: '10pt', color: '#555', lineHeight: 1.6 }}>
        {cvData.personalInfo?.summary ||
          "Knowledgeable and experienced Bookkeeper with extensive knowledge handling and documenting financial transactions according to policies and preferred procedures. Experienced in maintaining accounts, processing accounts payable and receivable, managing invoices, and delegating payroll. Bringing forth excellent customer service skills, strong organizational skills, and the ability to communicate well with others."}
      </p>
    </section>
  );

  const renderExperience = () => (
    <section style={{ marginBottom: '4mm' }}>
      <div style={{ fontSize: '12pt', fontWeight: 600, color: designColors.primary.secondary, marginBottom: '2mm' }}>Career Experience</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4mm' }}>
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
              <div style={{ fontWeight: 600, color: '#333', fontSize: '10pt' }}>
                {exp.title || "Bookkeeper"} at {exp.company || "Company"}
              </div>
              <div style={{ color: '#666', fontSize: '9pt' }}>{exp.startDate || "Start"} — {exp.endDate || "End"}</div>
            </div>
            <div style={{ listStyleType: 'disc', paddingLeft: '6mm', fontSize: '10pt', color: '#555', lineHeight: 1.5, marginTop: '1mm' }}>
              {exp.description ? exp.description.split('\n').map((line, i) => <p key={i}>{line}</p>) : <p>Job description</p>}
            </div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No experience added yet</div>}
      </div>
    </section>
  );

  const renderProjects = () => (
    <section style={{ marginBottom: '4mm' }}>
      <div style={{ fontSize: '12pt', fontWeight: 600, color: designColors.primary.secondary, marginBottom: '2mm' }}>Projects</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6mm' }}>
        {cvData.projects && cvData.projects.length > 0 ? cvData.projects.map((proj, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
              <div style={{ display: 'flex' , justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: '#333', fontSize: '10pt' }}>{proj.name || "Project Name"}</span>
                 <span style={{ color: '#666', fontSize: '9pt' }}>{proj.startDate || "Start"} — {proj.endDate || "End"}</span>
                 </div>
              
                {proj.technologies && (
                <div style={{ fontWeight: 600, color: designColors.primary.secondary, fontSize: '9pt', marginBottom: '1mm' ,fontStyle:'italic' , paddingLeft:'4mm' }}>
                  {proj.technologies}
                </div>
              )}
            </div>
            <p style={{ fontSize: '10pt', color: '#555', lineHeight: 1.5, paddingLeft:'4mm' }}>{proj.description || ""}</p>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No projects added yet</div>}
      </div>
    </section>
  );

  const renderEducation = () => (
    <section style={{ marginBottom: '4mm' }}>
      <div style={{ fontSize: '12pt', fontWeight: 600, color: designColors.primary.secondary, marginBottom: '2mm' }}>Education</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3mm' }}>
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

    const renderCertificates = () => (
    <section style={{ marginBottom: '4mm' }}>
      <div style={{ fontSize: '12pt', fontWeight: 600, color: designColors.primary.secondary, marginBottom: '2mm' }}>Certificates</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3mm' }}>
        {cvData.certificates && cvData.certificates.length > 0 ? cvData.certificates.map((cer, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
              <div style={{ display: 'flex' , justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: '#333', fontSize: '10pt' }}>{cer.name || "Project Name"}</span>
                 <span style={{ color: '#666', fontSize: '9pt' }}>{cer.date || "Start"}</span>
                 </div>
                <div style={{ fontWeight: 600, color: designColors.primary.secondary, fontSize: '9pt' }}>
                  {cer.issuer}
                </div>
                <div style={{ fontWeight: 600, color:'#666', fontSize: '8pt' }}>
                  {cer.link}
                </div>
            </div>
            <p style={{ fontSize: '10pt', color: '#555', lineHeight: 1.5 }}>{cer.description || ""}</p>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No certificates added yet</div>}
      </div>
    </section>
  );

      const renderCourses = () => (
    <section style={{ marginBottom: '4mm' }}>
      <div style={{ fontSize: '12pt', fontWeight: 600, color: designColors.primary.secondary, marginBottom: '2mm' }}>Courses</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3mm' }}>
        {cvData.courses && cvData.courses.length > 0 ? cvData.courses.map((course, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
              <div style={{ display: 'flex' , justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: '#333', fontSize: '10pt' }}>{course.name || "Project Name"}</span>
                 <span style={{ color: '#666', fontSize: '9pt' }}>{course.date || "Start"}</span>
                 </div>
                <div style={{ fontWeight: 600, color: designColors.primary.secondary, fontSize: '9pt' }}>
                  {course.institution}
                </div>
            </div>
            <p style={{ fontSize: '10pt', color: '#555', lineHeight: 1.5 }}>{course.description || ""}</p>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No courses added yet</div>}
      </div>
    </section>
  );


    const renderLanguages = () => (
    <section style={{ marginBottom: '4mm' }}>
      <div style={{ fontSize: '12pt', fontWeight: 600, color: designColors.primary.secondary, marginBottom: '2mm' }}>Languages</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3 mm' }}>
        {cvData.languages && cvData.languages.length > 0 ? cvData.languages.map((lan, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
              <div style={{ display: 'flex' , justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: '#333', fontSize: '10pt' }}>{lan.name || "Project Name"}</span>
                 </div>
                <div style={{ fontWeight: 600, color: designColors.primary.secondary, fontSize: '9pt' }}>
                  {lan.proficiency}
                </div>
            </div>
          </div>
        )) : <div style={{ color: '#aaa', fontStyle: 'italic' }}>No projects added yet</div>}
      </div>
    </section>
  );

  const renderSkills = () => (
    <section style={{ marginBottom: '8mm' }}>
      <div style={{ fontSize: '12pt', fontWeight: 600, color: designColors.primary.secondary, marginBottom: '2mm' }}>Skills</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2mm' }}>
        {cvData.skills && cvData.skills.length > 0 ? cvData.skills.map((skill, idx) => (
          <span key={idx} style={{ backgroundColor: designColors.primary.bg, color: designColors.primary.secondary, padding: '2mm 3mm', borderRadius: '2mm', fontSize: '10pt' }}>
            {typeof skill === "string" ? skill : "Skill"}
          </span>
        )) : <span style={{ color: '#aaa', fontStyle: 'italic' }}>No skills added yet</span>}
      </div>
    </section>
  );

  return (
    <div className="cv-page" style={{
      ...CV_PAGE_STYLE,
      fontFamily: DesignFontFamily,

      // Custom for the template
      padding: '3mm',
      // border: '1px solid #bbf7d0',
      fontSize: '10pt',
      borderRadius: '5mm',
      overflow: 'hidden',
    }}>
      {renderHeader()}
      <div style={{ padding: '0 5mm 20mm 5mm' }}>
        {cvData.personalInfo?.summary && renderSummary()}
        {sectionMap["experience"] && renderExperience()}
        {sectionMap["projects"] && renderProjects()}
        {sectionMap["education"] && renderEducation()}
        {sectionMap["languages"] && renderLanguages()}
        {sectionMap["certificates"] && renderCertificates()}
        {sectionMap["courses"] && renderCourses()}
        {sectionMap["skills"] && renderSkills()}
      </div>
    </div>
  );
};



const PreBuiltTemplates: React.FC<PreBuiltTemplatesProps> = ({ cvData, sections, templateId }) => {
  switch (templateId) {
    case "classicTemp":
      return <ClassicTemplate cvData={cvData} sections={sections} />;
    case "visionaryProTemp":
      return <VisionaryProTemplate cvData={cvData} sections={sections} />;
    case "elegantProTemp":
      return <ElegantProTemplate cvData={cvData} sections={sections} />;
    case "highPerformerTemp":
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
