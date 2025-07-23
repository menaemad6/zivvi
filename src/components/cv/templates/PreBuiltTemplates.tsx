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
    <section className="mb-6">
      <div className="text-center">
        <h1 className="text-2xl font-serif font-bold tracking-wide mb-1">{cvData.personalInfo?.fullName || "Your Name"}</h1>
        <div className="text-sm text-gray-700">
          {cvData.personalInfo?.location || "80 Gold Street, New York, NY 10038, United States"}, {cvData.personalInfo?.phone || "(917) 407-2179"}, {cvData.personalInfo?.email || "tim.stewart@gmail.com"}
        </div>
      </div>
      <div className="mt-6">
        <div className="uppercase text-xs tracking-widest text-gray-700 font-semibold mb-1">Profile</div>
        <div className="border-t border-gray-300 mb-2"></div>
        <p className="text-sm text-gray-800 leading-relaxed">
          {cvData.personalInfo?.summary || "Certified Accountant with five years of experience in account reconciliations, streamlining accounts, and financial planning. Highly motivated professional with a proven track record of delivering accurate reports and high quality service. Possess a comprehensive understanding of all aspects of accounting and financial planning. A dedicated leader with the ability to lead effective teams in attaining profit improvement."}
        </p>
      </div>
    </section>
  );

  const renderEmployment = () => (
    <section className="mb-6">
      <div className="uppercase text-xs tracking-widest text-gray-700 font-semibold mb-1">Employment History</div>
      <div className="border-t border-gray-300 mb-2"></div>
      <div className="space-y-6">
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx} className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div className="md:w-1/4 text-sm text-gray-700 mb-1 md:mb-0 whitespace-nowrap">{exp.startDate || ""} — {exp.endDate || ""}</div>
            <div className="md:w-3/4">
              <div className="flex justify-between items-baseline">
                <div className="font-semibold text-gray-900">{exp.title || "Job Title"}, {exp.company || "Company"}</div>
              </div>
              <ul className="list-disc pl-5 text-sm text-gray-800 mt-1">
                {exp.description && <li>{exp.description}</li>}
              </ul>
            </div>
          </div>
        )) : <div className="text-gray-500 italic">No employment history added yet</div>}
      </div>
    </section>
  );

  const renderEducation = () => (
    <section className="mb-6">
      <div className="uppercase text-xs tracking-widest text-gray-700 font-semibold mb-1">Education</div>
      <div className="border-t border-gray-300 mb-2"></div>
      <div className="space-y-6">
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx} className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div className="md:w-1/4 text-sm text-gray-700 mb-1 md:mb-0 whitespace-nowrap">{edu.startDate || ""} — {edu.endDate || ""}</div>
            <div className="md:w-3/4">
              <div className="flex justify-between items-baseline">
                <div className="font-semibold text-gray-900">{edu.degree || "Degree"}, {edu.school || "Institution"}</div>
              </div>
            </div>
          </div>
        )) : <div className="text-gray-500 italic">No education added yet</div>}
      </div>
    </section>
  );

  const renderSkills = () => (
    <section className="mb-6">
      <div className="uppercase text-xs tracking-widest text-gray-700 font-semibold mb-1">Skills</div>
      <div className="border-t border-gray-300 mb-2"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-800">
        {cvData.skills && cvData.skills.length > 0 ? cvData.skills.map((skill, idx) => (
          <div key={idx} className="flex justify-between border-b border-gray-200 py-1">
            <span>{typeof skill === "string" ? skill : "Skill"}</span>
          </div>
        )) : <div className="text-gray-500 italic">No skills added yet</div>}
      </div>
    </section>
  );

  const renderReferences = () => (
    <section className="mb-6">
      <div className="uppercase text-xs tracking-widest text-gray-700 font-semibold mb-1">References</div>
      <div className="border-t border-gray-300 mb-2"></div>
      <div className="space-y-2 text-sm text-gray-800">
        {cvData.references && cvData.references.length > 0 ? cvData.references.map((ref, idx) => (
          <div key={idx}>
            <span className="font-semibold">{ref.name || "Reference Name"}</span><br />
            <span className="text-gray-700">{ref.email || "email@example.com"}</span> {ref.phone && `- ${ref.phone}`}
          </div>
        )) : <div className="text-gray-500 italic">No references added yet</div>}
      </div>
    </section>
  );

  const renderProjects = () => (
    <section className="mb-8">
      <div className="uppercase text-xs tracking-widest text-gray-700 font-semibold mb-1">Projects</div>
      <div className="border-t border-gray-300 mb-2"></div>
      <div className="space-y-6">
        {cvData.projects && cvData.projects.length > 0 ? cvData.projects.map((proj, idx) => (
          <div key={idx} className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div className="md:w-1/4 text-sm text-gray-700 mb-1 md:mb-0 whitespace-nowrap">{proj.startDate || ""} — {proj.endDate || ""}</div>
            <div className="md:w-3/4">
              <div className="flex justify-between items-baseline">
                <div className="font-semibold text-gray-900">{proj.name || "Project Name"}</div>
              </div>
              <p className="text-sm text-gray-800 mt-1">{proj.description || ""}</p>
            </div>
          </div>
        )) : <div className="text-gray-500 italic">No projects added yet</div>}
      </div>
    </section>
  );

  return (
    <div id="cv-content" className="max-w-3xl mx-auto bg-white p-8 border border-gray-300 shadow-md font-serif text-gray-900 text-base">
      {(sectionMap["profile"] || sectionMap["personalInfo"]) && renderProfile()}
      {sectionMap["experience"] && renderEmployment()}
      {sectionMap["projects"] && renderProjects()}
      {sectionMap["education"] && renderEducation()}
      {sectionMap["skills"] && renderSkills()}
      {sectionMap["references"] && renderReferences()}
    </div>
  );
};

const ElegantTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  // Section mapping for compatibility
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "personalInfo", "summary", "experience", "education", "achievements", "skills", "courses", "passions"
  ]).forEach(s => { sectionMap[s] = true; });

  // Helper renderers for each section
  const renderHeader = () => (
    <div className="px-8 pt-8 pb-4 bg-white">
      <h1 className="text-3xl font-bold tracking-wide text-gray-900 mb-1 uppercase">{cvData.personalInfo?.fullName || "SAMUEL CAMPBELL"}</h1>
      {/* <div className="text-lg text-blue-700 font-semibold mb-2">{"Seasoned IT Project Manager | Agile & Waterfall Expertise"}</div> */}
      <div className="flex flex-wrap items-center gap-4 text-gray-700 text-sm mb-2">
        <span>📞 {cvData.personalInfo?.phone || "+44 20 7123 4567"}</span>
        <span>✉️ {cvData.personalInfo?.email || "help@enhancv.com"}</span>
        {/* <span>🔗 linkedin.com</span> */}
        <span>📍 {cvData.personalInfo?.location || "Manchester"}</span>
      </div>
    </div>
  );

  const renderSummary = () => (
    <section className="mb-8">
      <div className="uppercase text-xs tracking-widest text-blue-700 font-semibold mb-2">Summary</div>
      <div className="border-t border-blue-200 mb-2"></div>
      <p className="text-gray-800 text-base leading-relaxed">
        {cvData.personalInfo?.summary ||
          "With over a decade of IT project management experience, adept in Agile and Waterfall methodologies, I possess a robust track record of delivering sophisticated IT projects. My proactive approach has consistently driven projects to success against challenging timeframes, highlighting my strength in orchestrating application software and hardware upgrades to meet strategic business objectives. My biggest career achievement includes leading a large-scale cloud infrastructure project, underlining my commitment to cost-effectiveness and quality delivery."}
      </p>
    </section>
  );

  const renderExperience = () => (
    <section className="mb-8">
      <div className="uppercase text-xs tracking-widest text-blue-700 font-semibold mb-2">Experience</div>
      <div className="border-t border-blue-200 mb-2"></div>
      <div className="space-y-6">
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="font-bold text-gray-900 text-lg">{exp.title || "Senior IT Project Manager"}</div>
              <div className="text-sm text-gray-600">{exp.startDate || "06/2018"} - {exp.endDate || "Present"}</div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="text-blue-700 font-semibold">{exp.company || "TechWave Solutions"}</div>
            </div>
            <ul className="list-disc pl-6 text-gray-800 text-sm mt-2 space-y-1">
              {exp.description && <li>{exp.description}</li>}
            </ul>
          </div>
        )) : <div className="text-gray-500 italic">No experience added yet</div>}
      </div>
    </section>
  );

  const renderEducation = () => (
    <section className="mb-8">
      <div className="uppercase text-xs tracking-widest text-white font-semibold mb-2">Education</div>
      <div className="border-t border-blue-200 mb-2"></div>
      <div className="space-y-6">
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="font-bold text-white text-lg">{edu.degree || "MSc Information Technology Management"}</div>
              <div className="text-sm text-gray-200">{edu.startDate || "01/2010"} - {edu.endDate || "01/2011"}</div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="text-blue-200 font-semibold">{edu.school || "University of Manchester"}</div>
            </div>
          </div>
        )) : <div className="text-gray-200 italic">No education added yet</div>}
      </div>
    </section>
  );

  // Right sidebar renderers
  const renderAchievements = () => (
    <section className="mb-8">
      <div className="uppercase text-xs tracking-widest text-white font-semibold mb-2">Achievements</div>
      <div className="border-t border-blue-200 mb-2"></div>
      <ul className="space-y-4">
        <li>
          <div className="font-bold text-white">Successful Cloud Infrastructure Overhaul</div>
          <div className="text-gray-200 text-sm">Directed a complex cloud migration for a fintech client that led to a £2M project delivery under budget and on schedule.</div>
        </li>
        <li>
          <div className="font-bold text-white">ERP System Implementation</div>
          <div className="text-gray-200 text-sm">Steered the implementation of an enterprise-wide ERP system, positively impacting 1,000+ users' day-to-day operations.</div>
        </li>
        <li>
          <div className="font-bold text-white">Notable Budget Optimization</div>
          <div className="text-gray-200 text-sm">Spearheaded a vendor management strategy shift, reducing procurement costs by 15% without compromising service quality.</div>
        </li>
        <li>
          <div className="font-bold text-white">Exemplary Project Management</div>
          <div className="text-gray-200 text-sm">Through effective stakeholder negotiation and project planning, achieved a 95% on-time completion rate for IT projects.</div>
        </li>
      </ul>
    </section>
  );

  const renderSkills = () => (
    <section className="mb-8">
      <div className="uppercase text-xs tracking-widest text-white font-semibold mb-2">Skills</div>
      <div className="border-t border-blue-200 mb-2"></div>
      <div className="flex flex-wrap gap-2">
        {cvData.skills && cvData.skills.length > 0 ? (
          cvData.skills.map((skill, idx) => (
            <span key={idx} className="bg-blue-700 text-white px-3 py-1 rounded-full text-xs">
              {skill}
            </span>
          ))
        ) : (
          <span className="text-gray-200 italic">No skills added yet</span>
        )}
      </div>
    </section>
  );

  const renderCourses = () => (
    <section className="mb-8">
      <div className="uppercase text-xs tracking-widest text-white font-semibold mb-2">Courses</div>
      <div className="border-t border-blue-200 mb-2"></div>
      <ul className="space-y-2">
        <li>
          <div className="font-bold text-white">Certified ScrumMaster (CSM)</div>
          <div className="text-gray-200 text-sm">Gained expertise in Scrum principles, enhancing facilitation and leadership skills, provided by Scrum Alliance.</div>
        </li>
        <li>
          <div className="font-bold text-white">Prince2 Practitioner Certification</div>
          <div className="text-gray-200 text-sm">Advanced knowledge in Prince2 methodology for effective project management, offered by Axelos.</div>
        </li>
      </ul>
    </section>
  );

  const renderPassions = () => (
    <section className="mb-8">
      <div className="uppercase text-xs tracking-widest text-white font-semibold mb-2">Passions</div>
      <div className="border-t border-blue-200 mb-2"></div>
      <ul className="space-y-2">
        <li>
          <div className="font-bold text-white flex items-center gap-2">● Continuous Learning</div>
          <div className="text-gray-200 text-sm">Enjoy staying ahead of IT trends and obtaining new certifications to ensure peak professional performance.</div>
        </li>
        <li>
          <div className="font-bold text-white flex items-center gap-2">● Problem-Solving Through Technology</div>
          <div className="text-gray-200 text-sm">I am passionate about leveraging technology to solve complex business problems and drive efficiency.</div>
        </li>
      </ul>
    </section>
  );

  const renderProjects = () => (
    <section className="mb-8">
      <div className="uppercase text-xs tracking-widest text-blue-700 font-semibold mb-2">Projects</div>
      <div className="border-t border-blue-200 mb-2"></div>
      <div className="space-y-6">
        {cvData.projects && cvData.projects.length > 0 ? cvData.projects.map((proj, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="font-bold text-gray-900 text-lg">{proj.name || "Project Name"}</div>
              <div className="text-sm text-gray-600">{proj.startDate || ""} - {proj.endDate || ""}</div>
            </div>
            {proj.technologies && (
              <div className="text-blue-700 font-semibold">{proj.technologies}</div>
            )}
            <p className="text-gray-800 text-sm mt-1">{proj.description || ""}</p>
          </div>
        )) : <div className="text-gray-500 italic">No projects added yet</div>}
      </div>
    </section>
  );

  return (
    <div
      id="cv-content"
      className="elegant-cv-responsive grid grid-cols-[1fr_minmax(180px,28vw)] gap-0 bg-gray-100 w-full max-w-[100vw] min-h-[100vh]"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Left/Main Column */}
      <div className="bg-white min-w-0 flex flex-col px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-12 lg:py-12 xl:px-16 xl:py-16">
        {renderHeader()}
        <div className="flex-1 flex flex-col gap-6 pt-2">
          {cvData.personalInfo?.summary && renderSummary()}
          {sectionMap["experience"] && renderExperience()}
          {sectionMap["projects"] && renderProjects()}
        </div>
      </div>
      {/* Right/Sidebar */}
      <aside
        className="bg-blue-900 text-white flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-8 lg:py-12 xl:px-10 xl:py-16"
        style={{ minWidth: 0 }}
      >
        {sectionMap["achievements"] && renderAchievements()}
        {sectionMap["education"] && renderEducation()}
        {sectionMap["skills"] && renderSkills()}
        {sectionMap["courses"] && renderCourses()}
        {sectionMap["passions"] && renderPassions()}
      </aside>
    </div>
  );
};

const TimelineTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "header", "summary", "experience", "projects", "education", "achievements", "skills"
  ]).forEach(s => { sectionMap[s] = true; });

  // Helper for contact icons
  const ContactIcon = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <span className="flex items-center gap-1 text-gray-700 text-sm">
      {icon} {text}
    </span>
  );

  // Header
  const renderHeader = () => (
    <div className="mb-6">
      <h1 className="text-4xl font-bold tracking-wide text-gray-900 leading-tight">{cvData.personalInfo?.fullName || "STEVE GREEN"}</h1>
      <div className="text-xl font-semibold text-yellow-600 mt-1 mb-2">{"Data Scientist | Machine Learning | AI Innovation"}</div>
      <div className="flex flex-wrap gap-4 items-center text-gray-700 text-sm mb-2">
        <ContactIcon icon={<span>📞</span>} text={cvData.personalInfo?.phone || "+44 20 7123 4567"} />
        <ContactIcon icon={<span>✉️</span>} text={cvData.personalInfo?.email || "help@enhancv.com"} />
        <ContactIcon icon={<span>🔗</span>} text={"linkedin.com/in/"} />
        <ContactIcon icon={<span>📍</span>} text={cvData.personalInfo?.location || "Reading, UK"} />
      </div>
    </div>
  );

  // Summary
  const renderSummary = () => (
    <section className="mb-8">
      <div className="uppercase text-lg font-bold text-gray-900 mb-1">Summary</div>
      <p className="text-gray-800 text-base leading-relaxed">
        {cvData.personalInfo?.summary || "Dedicated Data Scientist with a proven track record in predictive analytics, machine learning, and AI innovation. Skilled in developing advanced models to drive strategic decision-making and enhance operational efficiency. Experienced in optimizing algorithms for improved performance and leading collaborative teams to achieve remarkable results. Strong background in data governance and visualization. Enthusiastic about utilizing data-driven insights to contribute to impactful projects that align with business objectives and societal well-being."}
      </p>
    </section>
  );

  // Experience
  const renderExperience = () => (
    <section className="mb-8">
      <div className="uppercase text-lg font-bold text-gray-900 mb-2">Experience</div>
      <div className="space-y-6">
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={exp.id || idx} className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
            <div className="sm:w-1/4 text-sm text-gray-700 font-medium mb-1 sm:mb-0 whitespace-nowrap">{exp.startDate || "MM/YYYY"} - {exp.endDate || "MM/YYYY"}</div>
            <div className="sm:w-3/4">
              <div className="font-bold text-gray-900 text-base mb-0.5">{exp.title || "Data Scientist"}</div>
              <div className="font-semibold text-yellow-700 text-sm mb-1">{exp.company || "Company"}</div>
              <ul className="list-disc pl-5 text-gray-800 text-sm space-y-0.5">
                {exp.description ? exp.description.split('\n').map((line, i) => <li key={i}>{line}</li>) : <li>Job description</li>}
              </ul>
            </div>
          </div>
        )) : <div className="text-gray-500 italic">No experience added yet</div>}
      </div>
    </section>
  );

  // Projects (like Education, before Education)
  const renderProjects = () => (
    <section className="mb-8">
      <div className="uppercase text-lg font-bold text-gray-900 mb-2">Projects</div>
      <div className="space-y-6">
        {cvData.projects && cvData.projects.length > 0 ? cvData.projects.map((proj, idx) => (
          <div key={proj.id || idx} className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
            <div className="sm:w-1/4 text-sm text-gray-700 font-medium mb-1 sm:mb-0 whitespace-nowrap">{proj.startDate || "MM/YYYY"} - {proj.endDate || "MM/YYYY"}</div>
            <div className="sm:w-3/4">
              <div className="font-bold text-gray-900 text-base mb-0.5">{proj.name || "Project Name"}</div>
              {proj.technologies && <div className="font-semibold text-yellow-700 text-sm mb-1">{proj.technologies}</div>}
              <div className="text-gray-800 text-sm mt-1">{proj.description || ""}</div>
            </div>
          </div>
        )) : <div className="text-gray-500 italic">No projects added yet</div>}
      </div>
    </section>
  );

  // Education
  const renderEducation = () => (
    <section className="mb-8">
      <div className="uppercase text-lg font-bold text-gray-900 mb-2">Education</div>
      <div className="space-y-6">
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={edu.id || idx} className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
            <div className="sm:w-1/4 text-sm text-gray-700 font-medium mb-1 sm:mb-0 whitespace-nowrap">{edu.startDate || "MM/YYYY"} - {edu.endDate || "MM/YYYY"}</div>
            <div className="sm:w-3/4">
              <div className="font-bold text-gray-900 text-base mb-0.5">{edu.degree || "Degree"}</div>
              <div className="font-semibold text-yellow-700 text-sm mb-1">{edu.school || "Institution"}</div>
            </div>
          </div>
        )) : <div className="text-gray-500 italic">No education added yet</div>}
      </div>
    </section>
  );

  // Achievements
  const renderAchievements = () => (
    <section className="mb-8">
      <div className="uppercase text-lg font-bold text-gray-900 mb-2">Achievements</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-start gap-2">
          <span className="text-yellow-500 text-xl mt-0.5">✔️</span>
          <div>
            <div className="font-bold text-gray-900 text-sm">Team Leadership</div>
            <div className="text-gray-700 text-sm">Successfully led a team of data scientists to improve productivity by 30% through strategic project management and mentoring.</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-yellow-500 text-xl mt-0.5">🏳️</span>
          <div>
            <div className="font-bold text-gray-900 text-sm">Machine Downtime Reduction</div>
            <div className="text-gray-700 text-sm">Developed a predictive maintenance model that reduced machine downtime by 20% and enhanced manufacturing efficiency.</div>
          </div>
        </div>
      </div>
    </section>
  );

  // Skills (yellow background, bold)
  const renderSkills = () => (
    <section className="mb-2">
      <div className="uppercase text-lg font-bold text-gray-900 mb-2">Skills</div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {cvData.skills && cvData.skills.length > 0 ? cvData.skills.map((skill, idx) => (
          <span key={idx} className="bg-yellow-100 text-yellow-800 font-bold px-3 py-1 rounded text-base">{skill}</span>
        )) : <span className="text-gray-400 italic">No skills added yet</span>}
      </div>
    </section>
  );

  return (
    <div id="cv-content" className="mx-auto bg-white w-[794px] min-h-[1123px] p-6 font-sans text-gray-900 text-base" style={{ boxShadow: "none", border: "none" }}>
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

  // Helper renderers for each section (unchanged)
  const renderHeader = () => (
    <div className="px-8 pt-8 pb-2 bg-white">
      <h1 className="text-4xl font-bold text-gray-900 mb-1">{cvData.personalInfo?.fullName || "Mia Ward"}</h1>
      <div className="text-xl font-semibold text-blue-600 mb-2">
        Data Scientist | Machine Learning | AI Innovation
      </div>
      <div className="flex flex-wrap items-center gap-4 text-gray-700 text-base mb-2">
        <span className="flex items-center gap-1"><span role="img" aria-label="phone">📞</span> {cvData.personalInfo?.phone || "+44 20 7123 4567"}</span>
        <span className="flex items-center gap-1"><span role="img" aria-label="email">✉️</span> {cvData.personalInfo?.email || "help@enhancv.com"}</span>
        <span className="flex items-center gap-1"><span role="img" aria-label="linkedin">🔗</span> linkedin.com</span>
        <span className="flex items-center gap-1"><span role="img" aria-label="location">📍</span> {cvData.personalInfo?.location || "Reading, UK"}</span>
      </div>
    </div>
  );

  const renderSummary = () => (
    <section className="px-8 mb-2">
      <div className="uppercase text-xs tracking-widest text-gray-700 font-semibold mb-1">Summary</div>
      <div className="border-t border-gray-300 mb-2"></div>
      <p className="text-base text-gray-800 leading-relaxed">
        {cvData.personalInfo?.summary || "Enthusiastic Data Scientist with a proven track record in leading innovative AI and machine learning projects. Experienced in developing predictive analytics models, improving data processing efficiency, and enhancing customer insights. Skilled in team leadership and collaborating across functions to drive strategic decision-making. MSc in Data Science from a prestigious university. Passionate about predictive analytics, AI for social good, and data-driven storytelling, aligning with the mission of leveraging data for impactful solutions."}
      </p>
    </section>
  );

  const renderExperience = () => (
    <section className="px-8 mb-2">
      <div className="uppercase text-xs tracking-widest text-gray-700 font-semibold mb-1">Experience</div>
      <div className="space-y-6">
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx} className="mb-2">
            <div className="font-bold text-lg text-gray-900 leading-tight">{exp.title || "Job Title"}</div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <a href="#" className="text-blue-600 font-medium hover:underline text-base">{exp.company || "Company"}</a>
              <span className="text-gray-500 text-sm">{exp.startDate || "MM/YYYY"} - {exp.endDate || "MM/YYYY"}</span>
            </div>
            <ul className="list-disc pl-5 text-gray-800 text-base space-y-0.5">
              {exp.description ? exp.description.split('\n').map((line, i) => <li key={i}>{line}</li>) : <li>Job description</li>}
            </ul>
          </div>
        )) : <div className="text-gray-500 italic">No experience added yet</div>}
      </div>
    </section>
  );

  const renderProjects = () => (
    <section className="px-8 mb-2">
      <div className="uppercase text-xs tracking-widest text-gray-700 font-semibold mb-1">Projects</div>
      <div className="space-y-6">
        {cvData.projects && cvData.projects.length > 0 ? cvData.projects.map((proj, idx) => (
          <div key={idx} className="mb-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="font-bold text-gray-900 text-base">{proj.name || "Project Name"}</div>
              <div className="text-sm text-gray-600">{proj.startDate || ""} - {proj.endDate || ""}</div>
            </div>
            <p className="text-gray-800 text-sm mt-1">{proj.description || ""}</p>
          </div>
        )) : <div className="text-gray-500 italic">No projects added yet</div>}
      </div>
    </section>
  );

  const renderEducation = () => (
    <section className="mb-6">
      <div className="uppercase text-xs tracking-widest text-blue-700 font-semibold mb-2">Education</div>
      <div className="border-t border-blue-200 mb-2"></div>
      <div className="space-y-4">
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx}>
            <div className="font-bold text-gray-900 text-base">{edu.degree || "MSc in Data Science"}</div>
            <div className="text-blue-700 font-semibold">{edu.school || "University College London"}</div>
            <div className="text-sm text-gray-600">{edu.startDate || "01/2014"} - {edu.endDate || "01/2015"}</div>
          </div>
        )) : <div className="text-gray-500 italic">No education added yet</div>}
      </div>
    </section>
  );

  const renderAchievements = () => (
    <section className="mb-6">
      <div className="uppercase text-xs tracking-widest text-blue-700 font-semibold mb-2">Achievements</div>
      <div className="border-t border-blue-200 mb-2"></div>
      <ul className="space-y-2">
        <li>
          <div className="font-bold text-gray-900">Team Leadership</div>
          <div className="text-gray-700 text-sm">Successfully led a team of data scientists to improve productivity by 30% through strategic project management and mentoring.</div>
        </li>
        <li>
          <div className="font-bold text-gray-900">Machine Downtime Reduction</div>
          <div className="text-gray-700 text-sm">Developed a predictive maintenance model that reduced machine downtime by 20% and enhanced manufacturing efficiency.</div>
        </li>
        <li>
          <div className="font-bold text-gray-900">Sales Campaign Enhancement</div>
          <div className="text-gray-700 text-sm">Applied cluster analysis in customer segmentation, increasing conversion rates by 17% in targeted marketing campaigns.</div>
        </li>
        <li>
          <div className="font-bold text-gray-900">Forecasting Model Development</div>
          <div className="text-gray-700 text-sm">Created an AI-driven forecast model that increased predictive accuracy by 20%, significantly impacting strategic planning.</div>
        </li>
      </ul>
    </section>
  );

  const renderSkills = () => (
    <section className="mb-6">
      <div className="uppercase text-xs tracking-widest text-blue-700 font-semibold mb-2">Skills</div>
      <div className="border-t border-blue-200 mb-2"></div>
      <div className="flex flex-wrap gap-2">
        {cvData.skills && cvData.skills.length > 0 ? cvData.skills.map((skill, idx) => (
          <span key={idx} className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded text-xs">{skill}</span>
        )) : <span className="text-gray-400 italic">No skills added yet</span>}
      </div>
    </section>
  );

  const renderCourses = () => (
    <section className="mb-6">
      <div className="uppercase text-xs tracking-widest text-blue-700 font-semibold mb-2">Courses</div>
      <div className="border-t border-blue-200 mb-2"></div>
      <ul className="space-y-2">
        <li>
          <div className="font-bold text-gray-900">Applied Data Science with Python</div>
          <div className="text-gray-700 text-sm">Acquired advanced Python programming skills for data science through this course offered by the University of Michigan.</div>
        </li>
        <li>
          <div className="font-bold text-gray-900">Machine Learning Specialization</div>
          <div className="text-gray-700 text-sm">Completed a series of courses focused on machine learning techniques, provided by Stanford University online.</div>
        </li>
      </ul>
    </section>
  );

  const renderPassions = () => (
    <section className="mb-6">
      <div className="uppercase text-xs tracking-widest text-blue-700 font-semibold mb-2">Passions</div>
      <div className="border-t border-blue-200 mb-2"></div>
      <ul className="space-y-2">
        <li>
          <div className="font-bold text-gray-900">Predictive Analytics</div>
          <div className="text-gray-700 text-sm">Passionate about uncovering trends and making accurate predictions that drive business success through data analysis.</div>
        </li>
        <li>
          <div className="font-bold text-gray-900">AI for Social Good</div>
          <div className="text-gray-700 text-sm">Interested in applying AI for solving complex societal challenges and contributing to community-centric projects.</div>
        </li>
        <li>
          <div className="font-bold text-gray-900">Data-Driven Storytelling</div>
          <div className="text-gray-700 text-sm">Enjoy exploring the narrative potential of data and translating complex insights into compelling stories for diverse audiences.</div>
        </li>
      </ul>
    </section>
  );

  return (
    <div
      id="cv-content"
      className="compact-cv-responsive grid grid-cols-[1fr_minmax(180px,28vw)] gap-0 bg-white w-full max-w-[100vw] min-h-[100vh]"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Main Column */}
      <div className="bg-white min-w-0 flex flex-col px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-12 lg:py-12 xl:px-16 xl:py-16">
        {renderHeader()}
        {cvData.personalInfo?.summary && renderSummary()}
        {sectionMap["experience"] && renderExperience()}
        {sectionMap["projects"] && renderProjects()}
      </div>
      {/* Right Sidebar */}
      <aside
        className="bg-gray-50 border-l border-gray-200 flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-8 lg:py-12 xl:px-10 xl:py-16"
        style={{ minWidth: 0 }}
      >
        {sectionMap["education"] && renderEducation()}
        {sectionMap["achievements"] && renderAchievements()}
        {sectionMap["skills"] && renderSkills()}
        {sectionMap["courses"] && renderCourses()}
        {sectionMap["passions"] && renderPassions()}
      </aside>
    </div>
  );
};

const HeaderTemplate = ({ cvData, sections }: { cvData: Partial<CVData>; sections?: string[] }) => {
  // Section order: personalInfo, summary, experience, projects, education, skills
  const sectionMap: Record<string, boolean> = {};
  (sections || [
    "personalInfo", "summary", "experience", "projects", "education", "skills"
  ]).forEach(s => { sectionMap[s] = true; });

  // Header (green background, left-aligned)
  const renderHeader = () => (
    <div className="rounded-t-lg bg-green-100 border border-green-200 px-8 pt-6 pb-2 flex flex-col md:flex-row md:justify-between md:items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{cvData.personalInfo?.fullName || "Kane Jones"}</h1>
        <div className="text-sm text-gray-700 mb-1">{cvData.personalInfo?.email || "kjn_77es14@yahoo.com"} &bull; {cvData.personalInfo?.phone || "(512)701-9215"}</div>
        <div className="text-sm text-gray-700">{cvData.personalInfo?.location || "88 Lorenzo Road, Austin, United States, TX 73301"}</div>
      </div>
    </div>
  );

  // Summary (Bookkeeper)
  const renderSummary = () => (
    <section className="mt-6 mb-8">
      <div className="uppercase text-xs tracking-widest text-green-700 font-semibold mb-2">Summary</div>
      <div className="border-t border-green-200 mb-2"></div>
      {/* Only render summary, do not attempt to show job title from profile_data to avoid linter errors */}
      <p className="text-gray-700 text-base leading-relaxed">
        {cvData.personalInfo?.summary ||
          "Knowledgeable and experienced Bookkeeper with extensive knowledge handling and documenting financial transactions according to policies and preferred procedures. Experienced in maintaining accounts, processing accounts payable and receivable, managing invoices, and delegating payroll. Bringing forth excellent customer service skills, strong organizational skills, and the ability to communicate well with others."}
      </p>
    </section>
  );

  // Experience
  const renderExperience = () => (
    <section className="mb-8">
      <div className="text-2xl font-semibold text-green-700 mb-2">Career Experience</div>
      <div className="space-y-6">
        {cvData.experience && cvData.experience.length > 0 ? cvData.experience.map((exp, idx) => (
          <div key={idx}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="font-semibold text-gray-800">
                {exp.title || "Bookkeeper"} at {exp.company || "Company"}
              </div>
              <div className="text-gray-500 text-sm mt-1 md:mt-0">{exp.startDate || "Start"} — {exp.endDate || "End"}</div>
            </div>
            <ul className="list-disc pl-6 text-gray-700 text-base mt-1 space-y-1">
              {exp.description ? exp.description.split('\n').map((line, i) => <li key={i}>{line}</li>) : <li>Job description</li>}
            </ul>
          </div>
        )) : <div className="text-gray-500 italic">No experience added yet</div>}
      </div>
    </section>
  );

  // Projects (empty state if none)
  const renderProjects = () => (
    <section className="mb-8">
      <div className="text-2xl font-semibold text-green-700 mb-2">Projects</div>
      <div className="space-y-6">
        {cvData.projects && cvData.projects.length > 0 ? cvData.projects.map((proj, idx) => (
          <div key={idx}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="font-semibold text-gray-800">{proj.name || "Project Name"}</div>
              <div className="text-gray-500 text-sm mt-1 md:mt-0">{proj.startDate || "Start"} — {proj.endDate || "End"}</div>
            </div>
            <p className="text-gray-700 text-base mt-1">{proj.description || ""}</p>
          </div>
        )) : <div className="text-gray-500 italic">No projects added yet</div>}
      </div>
    </section>
  );

  // Education
  const renderEducation = () => (
    <section className="mb-8">
      <div className="text-2xl font-semibold text-green-700 mb-2">Education</div>
      <div className="space-y-6">
        {cvData.education && cvData.education.length > 0 ? cvData.education.map((edu, idx) => (
          <div key={idx}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="font-semibold text-gray-800">{edu.degree || "Degree"}, {edu.school || "School"}</div>
              <div className="text-gray-500 text-sm mt-1 md:mt-0">{edu.startDate || "Start"} — {edu.endDate || "End"}</div>
            </div>
          </div>
        )) : <div className="text-gray-500 italic">No education added yet</div>}
      </div>
    </section>
  );

  // Skills
  const renderSkills = () => (
    <section className="mb-8">
      <div className="text-2xl font-semibold text-green-700 mb-2">Skills</div>
      <div className="flex flex-wrap gap-2">
        {cvData.skills && cvData.skills.length > 0 ? cvData.skills.map((skill, idx) => (
          <span key={idx} className="bg-green-100 text-green-900 px-3 py-1 rounded text-base">{typeof skill === "string" ? skill : "Skill"}</span>
        )) : <span className="text-gray-400 italic">No skills added yet</span>}
      </div>
    </section>
  );

  return (
    <div id="cv-content" className="max-w-3xl mx-auto bg-white border border-green-200 shadow font-sans text-gray-900 text-base rounded-lg overflow-hidden">
      {renderHeader()}
      <div className="px-8 pb-8">
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
    case "elegantTemp":
      return <ElegantTemplate cvData={cvData} sections={sections} />;
    case "timelineTemp":
      return <TimelineTemplate cvData={cvData} sections={sections} />;
    // Add more cases for other templates here
    case "compactTemp":
      return <CompactTemplate cvData={cvData} sections={sections} />;
    case "headerTemp":
      return <HeaderTemplate cvData={cvData} sections={sections} />;
    default:
      return <ClassicTemplate cvData={cvData} sections={sections} />;
  }
};

export default PreBuiltTemplates; 