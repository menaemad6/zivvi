
export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
  options?: {
    hasFont?: boolean;
    hasPrimaryColor?: boolean;
    hasSecondaryColor?: boolean;
  }
}

export interface CustomSection {
  id: string;
  title: string;
  items: Array<{
    id: string;
    content: string;
  }>;
}

export interface CVData {
  designOptions: {
    primaryColor: string;
    secondaryColor: string;
    font: string;
  };
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
    personal_website: string;
    linkedin: string;
    github: string;
  };
  experience: Array<{
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string;
    link: string;
    startDate: string;
    endDate: string;
  }>;
  courses: Array<{
    id: string;
    name: string;
    institution: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  certificates: Array<{
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate: string;
    credentialId: string;
    description: string;
  }>;
  languages: Array<{
    id: string;
    name: string;
    proficiency: string;
    description: string;
  }>;
  references: Array<{
    id: string;
    name: string;
    position: string;
    company: string;
    email: string;
    phone: string;
  }>;
  customSections?: CustomSection[];
}
