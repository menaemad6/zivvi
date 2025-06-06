
export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
}

export interface CustomSection {
  id: string;
  title: string;
  type: 'custom';
  items: Array<{
    id: string;
    content: string;
    description?: string;
  }>;
}

export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
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
  references: Array<{
    id: string;
    name: string;
    position: string;
    company: string;
    email: string;
    phone: string;
  }>;
  customSections: CustomSection[];
}
