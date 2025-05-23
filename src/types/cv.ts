
export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
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
}
