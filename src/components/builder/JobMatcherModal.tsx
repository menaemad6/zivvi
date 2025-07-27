
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Target, CheckCircle2, AlertCircle } from 'lucide-react';
import { CVData } from '@/types/cv';
import { getGeminiResponse, parseAIResponse } from '@/utils/geminiApi';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface JobMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  onUpdateCV: (data: CVData) => void;
}

const JobMatcherModal: React.FC<JobMatcherModalProps> = ({ 
  isOpen, 
  onClose, 
  cvData, 
  onUpdateCV 
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please paste the job description to analyze.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const prompt = `
        Analyze this job description and provide recommendations to optimize the CV content to better match the job requirements.
        
        Job Description:
        ${jobDescription}
        
        Current CV Data:
        - Personal Info: ${JSON.stringify(cvData.personalInfo)}
        - Experience: ${JSON.stringify(cvData.experience)}
        - Skills: ${JSON.stringify(cvData.skills)}
        - Projects: ${JSON.stringify(cvData.projects)}
        - Education: ${JSON.stringify(cvData.education)}
        
        Please provide:
        1. A match score (0-100)
        2. Key missing skills/keywords
        3. Specific recommendations for each CV section
        4. Enhanced versions of existing content (don't create new entries, only enhance existing ones)
        
        Return the response in JSON format with the following structure:
        {
          "matchScore": 85,
          "missingSkills": ["skill1", "skill2"],
          "recommendations": {
            "personalInfo": {
              "title": "enhanced title",
              "summary": "enhanced summary"
            },
            "experience": [
              {
                "id": "existing_id",
                "enhancedDescription": "enhanced description"
              }
            ],
            "skills": ["enhanced", "skill", "list"],
            "projects": [
              {
                "id": "existing_id",
                "enhancedDescription": "enhanced description"
              }
            ]
          }
        }
      `;
      
      const response = await getGeminiResponse(prompt);
      const parsedResult = parseAIResponse(response, 'job_match');
      
      setAnalysisResult(parsedResult);
      
      toast({
        title: "Analysis Complete",
        description: "Job matching analysis has been completed. Review the recommendations below.",
      });
    } catch (error) {
      console.error('Error analyzing job match:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze job match. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyRecommendations = async () => {
    if (!analysisResult) return;
    
    setIsApplying(true);
    try {
      const updatedCV: CVData = { ...cvData };
      
      // Apply personal info enhancements
      if (analysisResult.recommendations?.personalInfo) {
        if (analysisResult.recommendations.personalInfo.title) {
          updatedCV.personalInfo.title = analysisResult.recommendations.personalInfo.title;
        }
        if (analysisResult.recommendations.personalInfo.summary) {
          updatedCV.personalInfo.summary = analysisResult.recommendations.personalInfo.summary;
        }
      }
      
      // Apply experience enhancements
      if (analysisResult.recommendations?.experience) {
        updatedCV.experience = updatedCV.experience.map(exp => {
          const enhancement = analysisResult.recommendations.experience.find(
            (e: any) => e.id === exp.id
          );
          if (enhancement?.enhancedDescription) {
            return { ...exp, description: enhancement.enhancedDescription };
          }
          return exp;
        });
      }
      
      // Apply skills enhancements
      if (analysisResult.recommendations?.skills) {
        updatedCV.skills = analysisResult.recommendations.skills;
      }
      
      // Apply projects enhancements
      if (analysisResult.recommendations?.projects) {
        updatedCV.projects = updatedCV.projects.map(proj => {
          const enhancement = analysisResult.recommendations.projects.find(
            (p: any) => p.id === proj.id
          );
          if (enhancement?.enhancedDescription) {
            return { ...proj, description: enhancement.enhancedDescription };
          }
          return proj;
        });
      }
      
      onUpdateCV(updatedCV);
      
      toast({
        title: "CV Updated",
        description: "Your CV has been optimized to better match the job requirements.",
      });
      
      onClose();
    } catch (error) {
      console.error('Error applying recommendations:', error);
      toast({
        title: "Update Failed",
        description: "Failed to apply recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Job Matcher
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="min-h-[150px]"
            />
          </div>
          
          {!analysisResult ? (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleAnalyze} disabled={!jobDescription.trim() || isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Match'
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Match Analysis
                  </CardTitle>
                  <CardDescription>
                    CV compatibility with job requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Match Score:</span>
                      <Badge variant={analysisResult.matchScore >= 80 ? "default" : analysisResult.matchScore >= 60 ? "secondary" : "destructive"}>
                        {analysisResult.matchScore}%
                      </Badge>
                    </div>
                    
                    {analysisResult.missingSkills && analysisResult.missingSkills.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">Missing Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {analysisResult.missingSkills.map((skill: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleApplyRecommendations} disabled={isApplying}>
                  {isApplying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    'Apply Recommendations'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobMatcherModal;
