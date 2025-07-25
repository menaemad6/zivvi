
import { CVTemplate } from '@/types/cv';

export const cvTemplates: CVTemplate[] = [
  {
    id: 'classicTemp',
    name: 'Classic Template',
    description: 'A timeless, professional layout with clearly separated sections and traditional formatting. Ideal for formal job applications.',
    thumbnail: '/templates/classic-template.png',
    category: 'classic'
  },
  {
    id: 'singleColumn',
    name: 'Single Column',
    description: 'Clean single-column layout with blue accents and clear section divisions. Perfect for sales professionals and networking roles.',
    thumbnail: '/templates/classic-template.png',
    category: 'modern'
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Professional black and white design with strong typography. Ideal for project managers and technical professionals.',
    thumbnail: '/templates/classic-template.png',
    category: 'minimal'
  },
  {
    id: 'elegantTemp',
    name: 'Elegant Template',
    description: 'A clean and refined design with subtle typography and spacious layout. Best suited for creative and corporate roles.',
    thumbnail: '/zivvi-logo.png',
    category: 'modern'
  },
  {
    id: 'timelineTemp',
    name: 'Timeline Template',
    description: 'Showcases your career path using a visual timeline. Perfect for emphasizing growth and progression over time.',
    thumbnail: '/templates/timeline-template.png',
    category: 'minimal'
  },
  {
    id: 'compactTemp',
    name: 'Compact Template',
    description: 'A space-efficient layout that fits all essential information on a single page without clutter. Great for experienced professionals.',
    thumbnail: '/templates/compact-template.png',
    category: 'modern'
  },
  {
    id: 'headerTemp',
    name: 'Header Template',
    description: 'Features a bold, modern header section that highlights your name and title. Ideal for personal branding and standout resumes.',
    thumbnail: '/templates/header-template.png',
    category: 'creative'
  }
];
