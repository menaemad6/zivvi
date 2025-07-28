
import { CVTemplate } from '@/types/cv';

export const cvTemplates: CVTemplate[] = [
  {
    id: 'classicTemp',
    name: 'Classic',
    description: 'A timeless, professional layout with clearly separated sections and traditional formatting. Ideal for formal job applications.',
    thumbnail: '/templates/classic-template.png',
    category: 'classic',
    options: {
      hasFont: true,
    }
  },
  {
    id: 'visionaryProTemp',
    name: 'Visionary Pro',
    description: 'Bold orange header design with structured sections and achievement highlights. Perfect for showcasing leadership and innovation.',
    thumbnail: '/templates/visionary-pro-template.png',
    category: 'modern',
    options: {
      hasFont: true,
      hasPrimaryColor: true,
    }
  },
  {
    id: 'elegantProTemp',
    name: 'Elegant Pro',
    description: 'Two-column layout with red sidebar containing strengths and achievements. Ideal for experienced professionals.',
    thumbnail: '/templates/elegant-pro-template.png',
    category: 'modern',
    options: {
      hasFont: true,
      hasPrimaryColor: true,
    }
  },
  {
    id: 'highPerformerTemp',
    name: 'High Performer',
    description: 'Clean blue-accented design with emphasis on achievements and project highlights. Great for project managers and directors.',
    thumbnail: '/templates/high-performer-template.png',
    category: 'creative',
    options: {
      hasFont: true,
      hasPrimaryColor: true,
    }
  },
  {
    id: 'elegantTemp',
    name: 'Elegant',
    description: 'A clean and refined design with subtle typography and spacious layout. Best suited for creative and corporate roles.',
    thumbnail: '/templates/elegant-template.png',
    category: 'modern',
    options: {
      hasFont: true,
      hasPrimaryColor: true,
    }
  },
  {
    id: 'timelineTemp',
    name: 'Timeline',
    description: 'Showcases your career path using a visual timeline. Perfect for emphasizing growth and progression over time.',
    thumbnail: '/templates/timeline-template.png',
    category: 'minimal',
    options: {
      hasFont: true,
      hasPrimaryColor: true,
    }
  },
  {
    id: 'compactTemp',
    name: 'Compact',
    description: 'A space-efficient layout that fits all essential information on a single page without clutter. Great for experienced professionals.',
    thumbnail: '/templates/compact-template.png',
    category: 'modern',
    options: {
      hasFont: true,
      hasPrimaryColor: true,
    }
  },
  {
    id: 'headerTemp',
    name: 'Header',
    description: 'Features a bold, modern header section that highlights your name and title. Ideal for personal branding and standout resumes.',
    thumbnail: '/templates/header-template.png',
    category: 'creative',
    options: {
      hasFont: true,
      hasPrimaryColor: true,
    }
  },
  {
    id: 'singleColumnTemp',
    name: 'Single Column',
    description: 'Clean single-column layout with blue accents and clear section divisions. Perfect for sales professionals and networking roles.',
    thumbnail: '/templates/single-column-template.png',
    category: 'modern',
    options: {
      hasFont: true,
      hasPrimaryColor: true,
    }
  },
  {
    id: 'monochromeTemp',
    name: 'Monochrome',
    description: 'Professional black and white design with strong typography. Ideal for project managers and technical professionals.',
    thumbnail: '/templates/monochrome-template.png',
    category: 'minimal',
    options: {
      hasFont: true,
    }
  },
];
