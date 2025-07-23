
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
import { getGeminiResponse } from '@/utils/geminiApi';
import { useNavigate } from 'react-router-dom';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: Record<string, unknown>) => void;
  initialData?: Partial<QuestionData>;
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

export const OnboardingModal = ({ isOpen, onClose, onComplete, initialData }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<QuestionData>(initialData || {});
  const [customSkills, setCustomSkills] = useState('');
  const [recommendedSkills, setRecommendedSkills] = useState<string[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);
  const [lastClickedSkill, setLastClickedSkill] = useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isOpen) {
      const existingData = initialData || {};
      setData(existingData);
      const commonSkillSet = new Set(COMMON_SKILLS);
      const existingSkills = existingData.skills || [];
      const custom = existingSkills.filter(skill => !commonSkillSet.has(skill)).join(', ');
      setCustomSkills(custom);
      setLastClickedSkill(null);
      setCurrentStep(0);
      setRecommendedSkills([]);
      setLoadingRecommendations(false);
    }
  }, [isOpen, initialData]);

  // Debounced Gemini fetch for skill recommendations
  React.useEffect(() => {
    if (currentStep !== 3) return; // Only on skills step
    if (!lastClickedSkill) {
      setRecommendedSkills([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLoadingRecommendations(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const prompt = `Given the skill: "${lastClickedSkill}"${data.industry ? ` and industry: ${data.industry}` : ''}, recommend 5 more relevant professional skills as a JSON array of strings, no explanation.`;
        const response = await getGeminiResponse(prompt);
        let skills: string[] = [];
        try {
          // Extract JSON array from code block if present
          const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
          const jsonToParse = codeBlockMatch ? codeBlockMatch[1] : response;
          skills = JSON.parse(jsonToParse);
        } catch {
          // Fallback: try to split by comma
          skills = response.split(',').map(s => s.trim()).filter(Boolean);
        }
        // Remove already selected skills
        skills = skills.filter(s => !(data.skills || []).includes(s));
        setRecommendedSkills(skills.slice(0, 5));
      } catch (e) {
        setRecommendedSkills([]);
      } finally {
        setLoadingRecommendations(false);
      }
    }, 600);
    // Cleanup
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [lastClickedSkill, data.industry, currentStep]);

  const questions = [
    {
      id: 'industry',
      title: 'What industry do you work in?',
      description: 'This helps us recommend relevant CV templates and sections.',
      component: (
        <Select 
          onValueChange={(value) => setData(prev => ({ ...prev, industry: value }))}
          value={data.industry}
        >
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
        <Select 
          onValueChange={(value) => setData(prev => ({ ...prev, experience_level: value }))}
          value={data.experience_level}
        >
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
            {/* Render checked skills first, in order */}
            {(data.skills || []).map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox
                  id={skill}
                  checked={true}
                  onCheckedChange={(checked) => {
                    if (!checked) {
                      setData(prev => ({
                        ...prev,
                        skills: prev.skills?.filter(s => s !== skill) || []
                      }));
                      // Do not set lastClickedSkill when unchecking
                    }
                  }}
                />
                <Label htmlFor={skill} className="text-sm">{skill}</Label>
              </div>
            ))}
            {/* Insert recommended skills as checkboxes after checked ones */}
            {recommendedSkills.map((skill) => (
              <div key={skill} className="flex items-center space-x-2 opacity-90">
                <Checkbox
                  id={skill}
                  checked={false}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setData(prev => ({
                        ...prev,
                        skills: [...(prev.skills || []), skill]
                      }));
                      setRecommendedSkills(prev => prev.filter(s => s !== skill));
                      setLastClickedSkill(skill);
                    }
                  }}
                />
                <Label htmlFor={skill} className="text-sm font-medium text-blue-700">{skill}</Label>
              </div>
            ))}
            {/* Render remaining common skills that are not selected or recommended */}
            {COMMON_SKILLS
              .filter(skill =>
                !((data.skills || []).includes(skill)) &&
                !recommendedSkills.includes(skill) &&
                (!data.industry ||
                  (data.industry === 'Technology' && ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL'].includes(skill)) ||
                  (data.industry === 'Marketing' && ['Marketing', 'Communication', 'Data Analysis', 'Writing'].includes(skill)) ||
                  (data.industry === 'Management' && ['Project Management', 'Leadership', 'Communication', 'Problem Solving'].includes(skill)) ||
                  ['Communication', 'Problem Solving', 'Leadership'].includes(skill)
                )
              )
              .map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={false}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setData(prev => ({
                          ...prev,
                          skills: [...(prev.skills || []), skill]
                        }));
                        setLastClickedSkill(skill);
                      }
                    }}
                  />
                  <Label htmlFor={skill} className="text-sm">{skill}</Label>
                </div>
              ))}
          </div>
          {loadingRecommendations && (
            <div className="text-xs text-gray-500">Fetching recommendations...</div>
          )}
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
        <Select 
          onValueChange={(value) => setData(prev => ({ ...prev, education_level: value }))}
          value={data.education_level}
        >
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
    const allSkills = new Set(data.skills || []);
    if (customSkills.trim()) {
      const additionalSkills = customSkills.split(',').map(s => s.trim()).filter(s => s);
      additionalSkills.forEach(skill => allSkills.add(skill));
    }

    const finalData = {
      ...data,
      skills: Array.from(allSkills),
      completed_at: new Date().toISOString()
    };

    onComplete(finalData);
    // Redirect to templates with demo flag
    navigate('/templates?startDemo=true');
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
