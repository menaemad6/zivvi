
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
}

interface QuestionData {
  industry?: string;
  experience_level?: string;
  job_title?: string;
  company?: string;
  skills?: string[];
  education_level?: string;
  career_goals?: string;
  preferred_cv_style?: string;
}

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing',
  'Sales', 'Engineering', 'Design', 'Management', 'Consulting',
  'Legal', 'Manufacturing', 'Retail', 'Real Estate', 'Other'
];

const EXPERIENCE_LEVELS = [
  'Entry Level (0-2 years)', 
  'Mid Level (3-5 years)', 
  'Senior Level (6-10 years)', 
  'Executive Level (10+ years)',
  'Student/Recent Graduate'
];

const EDUCATION_LEVELS = [
  'High School', 'Associates Degree', 'Bachelors Degree', 
  'Masters Degree', 'PhD/Doctorate', 'Professional Certification'
];

const COMMON_SKILLS = [
  'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL',
  'Project Management', 'Leadership', 'Communication', 'Problem Solving',
  'Data Analysis', 'Marketing', 'Sales', 'Design', 'Writing'
];

export const OnboardingModal = ({ isOpen, onClose, onComplete }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<QuestionData>({});
  const [customSkills, setCustomSkills] = useState('');

  const questions = [
    {
      id: 'industry',
      title: 'What industry do you work in?',
      description: 'This helps us recommend relevant CV templates and sections.',
      component: (
        <Select onValueChange={(value) => setData(prev => ({ ...prev, industry: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((industry) => (
              <SelectItem key={industry} value={industry}>{industry}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    },
    {
      id: 'experience_level',
      title: 'What\'s your experience level?',
      description: 'This helps us tailor suggestions for your career stage.',
      component: (
        <Select onValueChange={(value) => setData(prev => ({ ...prev, experience_level: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select your experience level" />
          </SelectTrigger>
          <SelectContent>
            {EXPERIENCE_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    },
    {
      id: 'job_title',
      title: 'What\'s your current or desired job title?',
      description: 'We\'ll use this to suggest relevant keywords and skills.',
      component: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="job_title">Job Title</Label>
            <Input
              id="job_title"
              placeholder="e.g., Software Engineer, Marketing Manager"
              value={data.job_title || ''}
              onChange={(e) => setData(prev => ({ ...prev, job_title: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="company">Company (Optional)</Label>
            <Input
              id="company"
              placeholder="e.g., Google, Startup Inc."
              value={data.company || ''}
              onChange={(e) => setData(prev => ({ ...prev, company: e.target.value }))}
            />
          </div>
        </div>
      )
    },
    {
      id: 'skills',
      title: 'What are your key skills?',
      description: 'Select skills relevant to your field. We\'ll suggest more based on your industry.',
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {COMMON_SKILLS
              .filter(skill => 
                !data.industry || 
                (data.industry === 'Technology' && ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL'].includes(skill)) ||
                (data.industry === 'Marketing' && ['Marketing', 'Communication', 'Data Analysis', 'Writing'].includes(skill)) ||
                (data.industry === 'Management' && ['Project Management', 'Leadership', 'Communication', 'Problem Solving'].includes(skill)) ||
                ['Communication', 'Problem Solving', 'Leadership'].includes(skill)
              )
              .map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={data.skills?.includes(skill) || false}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setData(prev => ({ 
                          ...prev, 
                          skills: [...(prev.skills || []), skill] 
                        }));
                      } else {
                        setData(prev => ({ 
                          ...prev, 
                          skills: prev.skills?.filter(s => s !== skill) || [] 
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={skill} className="text-sm">{skill}</Label>
                </div>
              ))}
          </div>
          <div>
            <Label htmlFor="custom_skills">Additional Skills (comma separated)</Label>
            <Input
              id="custom_skills"
              placeholder="e.g., Adobe Photoshop, Public Speaking"
              value={customSkills}
              onChange={(e) => setCustomSkills(e.target.value)}
            />
          </div>
        </div>
      )
    },
    {
      id: 'education',
      title: 'What\'s your education level?',
      description: 'This helps us format your education section appropriately.',
      component: (
        <Select onValueChange={(value) => setData(prev => ({ ...prev, education_level: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select your education level" />
          </SelectTrigger>
          <SelectContent>
            {EDUCATION_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    },
    {
      id: 'goals',
      title: 'What are your career goals?',
      description: 'We\'ll use this to suggest relevant CV content and focus areas.',
      component: (
        <Textarea
          placeholder="e.g., Transition to a senior role, Switch to tech industry, Start my own business..."
          value={data.career_goals || ''}
          onChange={(e) => setData(prev => ({ ...prev, career_goals: e.target.value }))}
          rows={4}
        />
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Merge custom skills with selected skills
    const allSkills = [...(data.skills || [])];
    if (customSkills.trim()) {
      const additionalSkills = customSkills.split(',').map(s => s.trim()).filter(s => s);
      allSkills.push(...additionalSkills);
    }

    const finalData = {
      ...data,
      skills: allSkills,
      completed_at: new Date().toISOString()
    };

    onComplete(finalData);
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Let's get to know you better</DialogTitle>
          <DialogDescription>
            Answer a few questions to help us create personalized CV recommendations.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Question {currentStep + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{currentQuestion.title}</h3>
              <p className="text-sm text-gray-600">{currentQuestion.description}</p>
            </div>
            
            {currentQuestion.component}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentStep === questions.length - 1 ? (
              <Button onClick={handleComplete}>
                Complete Setup
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
