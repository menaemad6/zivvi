
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Target, CheckCircle, TrendingUp, Users, Lightbulb, Award, Sparkles, RefreshCw } from 'lucide-react';
import { CVData } from '@/types/cv';
import { getGeminiResponse } from '@/utils/geminiApi';
import { toast } from '@/hooks/use-toast';

interface JobMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  onUpdateCV: (data: CVData) => void;
}

interface JobMatchSuggestion {
  type: 'experience' | 'skills' | 'summary' | 'projects' | 'education' | 'languages' | 'courses' | 'certificates';
  title: string;
  originalText: string;
  enhancedText: string;
  improvement: string;
  matchRelevance: string;
}

const JobMatcherModal: React.FC<JobMatcherModalProps> = ({ 
  isOpen, 
  onClose, 
  cvData, 
  onUpdateCV 
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<JobMatchSuggestion[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const generateJobMatchPrompt = (jobDescription: string, cvData: CVData) => {
    return `Analyze this job description and provide specific enhancement suggestions to optimize the CV content to better match the job requirements.

Job Description:
${jobDescription}

Current CV Data:
${JSON.stringify(cvData, null, 2)}

Provide a detailed analysis in JSON format:
{
  "matchScore": 85,
  "missingSkills": ["skill1", "skill2"],
  "suggestions": [
    {
      "type": "experience|skills|summary|projects|education|languages|courses|certificates",
      "title": "Job title or section name",
      "originalText": "Current text from CV",
      "enhancedText": "Optimized version with job-specific keywords and achievements",
      "improvement": "Explanation of what was improved",
      "matchRelevance": "How this change improves job match"
    }
  ]
}

Specific guidance for different sections:
- For education suggestions: Use the degree name as the "title" field and "originalText" field, provide an enhanced degree name in the "enhancedText" field
- For languages suggestions: Use the language name as the "title" field, the proficiency level as the "originalText" field, and an enhanced description in the "enhancedText" field
- For courses suggestions: Use the course name as the "title" field, the current description as the "originalText" field, and an enhanced description in the "enhancedText" field
- For certificates suggestions: Use the certificate name as the "title" field, the current description as the "originalText" field, and an enhanced description in the "enhancedText" field

Focus on:
1. Adding job-specific keywords naturally
2. Highlighting relevant achievements with metrics
3. Emphasizing transferable skills
4. Using industry terminology from the job description
5. Quantifying results where possible
6. Highlighting relevant languages, courses, and certificates that match job requirements

Provide 5-8 specific suggestions covering different CV sections, including the new sections (languages, courses, certificates) if they are relevant to the job.`;
  };

  const parseJobMatchResponse = (response: string) => {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        matchScore: parsed.matchScore || 70,
        missingSkills: parsed.missingSkills || [],
        suggestions: parsed.suggestions || []
      };
    } catch (error) {
      console.error('Error parsing job match response:', error);
      return {
        matchScore: 70,
        missingSkills: [],
        suggestions: []
      };
    }
  };

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
    setAnalysisComplete(false);
    
    try {
      const prompt = generateJobMatchPrompt(jobDescription, cvData);
      const response = await getGeminiResponse(prompt);
      const result = parseJobMatchResponse(response);
      
      setMatchScore(result.matchScore);
      setMissingSkills(result.missingSkills);
      setSuggestions(result.suggestions);
      setAnalysisComplete(true);
      
      toast({
        title: "Job Match Analysis Complete",
        description: `Generated ${result.suggestions.length} optimization suggestions.`
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

  const applySuggestion = (suggestion: JobMatchSuggestion) => {
    const updatedCV = { ...cvData };
    
    switch (suggestion.type) {
      case 'summary':
        if (updatedCV.personalInfo) {
          updatedCV.personalInfo.summary = suggestion.enhancedText;
        }
        break;
      case 'experience':
        if (updatedCV.experience) {
          const expIndex = updatedCV.experience.findIndex(exp => 
            exp.title === suggestion.title || exp.description === suggestion.originalText
          );
          if (expIndex !== -1) {
            updatedCV.experience[expIndex].description = suggestion.enhancedText;
          }
        }
        break;
      case 'projects':
        if (updatedCV.projects) {
          const projIndex = updatedCV.projects.findIndex(proj => 
            proj.name === suggestion.title || proj.description === suggestion.originalText
          );
          if (projIndex !== -1) {
            updatedCV.projects[projIndex].description = suggestion.enhancedText;
          }
        }
        break;
      case 'skills':
        if (updatedCV.skills) {
          const newSkills = suggestion.enhancedText.split(',').map(skill => skill.trim());
          const existingSkills = updatedCV.skills || [];
          const mergedSkills = [...new Set([...existingSkills, ...newSkills])];
          updatedCV.skills = mergedSkills;
        }
        break;
      case 'education':
        if (updatedCV.education) {
          // Log for debugging
          console.log('Education suggestion:', suggestion);
          console.log('Current education data:', updatedCV.education);
          
          // More flexible matching - try to find any education entry that might match
          const eduIndex = updatedCV.education.findIndex(edu => {
            // Try to match by degree or school, with more flexible comparison
            return (
              edu.degree.toLowerCase().includes(suggestion.title.toLowerCase()) || 
              suggestion.title.toLowerCase().includes(edu.degree.toLowerCase()) ||
              edu.school.toLowerCase().includes(suggestion.originalText.toLowerCase()) ||
              suggestion.originalText.toLowerCase().includes(edu.school.toLowerCase())
            );
          });
          
          console.log('Found education index:', eduIndex);
          
          if (eduIndex !== -1) {
            // Update the degree field with the enhanced text
            console.log('Updating education degree from:', updatedCV.education[eduIndex].degree, 'to:', suggestion.enhancedText);
            updatedCV.education[eduIndex].degree = suggestion.enhancedText;
          } else if (updatedCV.education.length > 0) {
            // If no match found but education entries exist, update the first one
            console.log('No exact match found, updating first education entry');
            updatedCV.education[0].degree = suggestion.enhancedText;
          }
        }
        break;
      case 'languages':
        if (updatedCV.languages) {
          const langIndex = updatedCV.languages.findIndex(lang => 
            lang.name === suggestion.title || lang.proficiency === suggestion.originalText
          );
          if (langIndex !== -1) {
            updatedCV.languages[langIndex].proficiency = suggestion.enhancedText;
          }
        }
        break;
      case 'courses':
        if (updatedCV.courses) {
          const courseIndex = updatedCV.courses.findIndex(course => 
            course.name === suggestion.title || course.description === suggestion.originalText
          );
          if (courseIndex !== -1) {
            updatedCV.courses[courseIndex].description = suggestion.enhancedText;
          }
        }
        break;
      case 'certificates':
        if (updatedCV.certificates) {
          const certIndex = updatedCV.certificates.findIndex(cert => 
            cert.name === suggestion.title || cert.description === suggestion.originalText
          );
          if (certIndex !== -1) {
            updatedCV.certificates[certIndex].description = suggestion.enhancedText;
          }
        }
        break;
    }
    
    onUpdateCV(updatedCV);
    toast({
      title: "Suggestion Applied!",
      description: "Your CV has been updated to better match the job requirements."
    });
  };

  const applyAllSuggestions = () => {
    const updatedCV = { ...cvData };
    
    suggestions.forEach(suggestion => {
      switch (suggestion.type) {
        case 'summary':
          if (updatedCV.personalInfo) {
            updatedCV.personalInfo.summary = suggestion.enhancedText;
          }
          break;
        case 'experience':
          if (updatedCV.experience) {
            const expIndex = updatedCV.experience.findIndex(exp => 
              exp.title === suggestion.title || exp.description === suggestion.originalText
            );
            if (expIndex !== -1) {
              updatedCV.experience[expIndex].description = suggestion.enhancedText;
            }
          }
          break;
        case 'projects':
          if (updatedCV.projects) {
            const projIndex = updatedCV.projects.findIndex(proj => 
              proj.name === suggestion.title || proj.description === suggestion.originalText
            );
            if (projIndex !== -1) {
              updatedCV.projects[projIndex].description = suggestion.enhancedText;
            }
          }
          break;
        case 'skills':
          if (updatedCV.skills) {
            const newSkills = suggestion.enhancedText.split(',').map(skill => skill.trim());
            const existingSkills = updatedCV.skills || [];
            const mergedSkills = [...new Set([...existingSkills, ...newSkills])];
            updatedCV.skills = mergedSkills;
          }
          break;
        case 'education':
          if (updatedCV.education) {
            const eduIndex = updatedCV.education.findIndex(edu => 
              edu.degree === suggestion.title || edu.school === suggestion.originalText
            );
            if (eduIndex !== -1) {
              // Update the degree field with the enhanced text
              updatedCV.education[eduIndex].degree = suggestion.enhancedText;
            }
          }
          break;
        case 'languages':
          if (updatedCV.languages) {
            const langIndex = updatedCV.languages.findIndex(lang => 
              lang.name === suggestion.title || lang.proficiency === suggestion.originalText
            );
            if (langIndex !== -1) {
              updatedCV.languages[langIndex].proficiency = suggestion.enhancedText;
            }
          }
          break;
        case 'courses':
          if (updatedCV.courses) {
            const courseIndex = updatedCV.courses.findIndex(course => 
              course.name === suggestion.title || course.description === suggestion.originalText
            );
            if (courseIndex !== -1) {
              updatedCV.courses[courseIndex].description = suggestion.enhancedText;
            }
          }
          break;
        case 'certificates':
          if (updatedCV.certificates) {
            const certIndex = updatedCV.certificates.findIndex(cert => 
              cert.name === suggestion.title || cert.description === suggestion.originalText
            );
            if (certIndex !== -1) {
              updatedCV.certificates[certIndex].description = suggestion.enhancedText;
            }
          }
          break;
      }
    });
    
    onUpdateCV(updatedCV);
    toast({
      title: "All Suggestions Applied!",
      description: "Your CV has been optimized to better match the job requirements."
    });
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'experience':
        return <TrendingUp className="h-4 w-4" />;
      case 'skills':
        return <Award className="h-4 w-4" />;
      case 'summary':
        return <Users className="h-4 w-4" />;
      case 'projects':
        return <Lightbulb className="h-4 w-4" />;
      case 'education':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getSuggestionColors = (type: string) => {
    switch (type) {
      case 'experience':
        return 'border-blue-200 bg-blue-50';
      case 'skills':
        return 'border-green-200 bg-green-50';
      case 'summary':
        return 'border-purple-200 bg-purple-50';
      case 'projects':
        return 'border-orange-200 bg-orange-50';
      case 'education':
        return 'border-indigo-200 bg-indigo-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const resetAnalysis = () => {
    setAnalysisComplete(false);
    setSuggestions([]);
    setMatchScore(null);
    setMissingSkills([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center">
              <Target className="h-4 w-4 text-white" />
            </div>
            Job Matcher
          </DialogTitle>
          <DialogDescription>
            Optimize your CV content to better match specific job requirements
          </DialogDescription>
        </DialogHeader>
        
        {!analysisComplete && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="min-h-[200px] mt-2"
              />
            </div>
            
            {isAnalyzing && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Analyzing Job Match</h3>
                <p className="text-gray-600">AI is comparing your CV with the job requirements...</p>
              </div>
            )}
          </div>
        )}

        {analysisComplete && (
          <div className="space-y-6">
            {/* Match Score Card */}
            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-600" />
                  Job Match Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className={`text-4xl font-bold rounded-full w-20 h-20 flex items-center justify-center ${getMatchScoreColor(matchScore || 0)}`}>
                        {matchScore}%
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Match Score</p>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${matchScore}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {matchScore && matchScore >= 80 ? 'Excellent match!' : 
                         matchScore && matchScore >= 60 ? 'Good match with room for improvement' : 
                         'Needs optimization for better match'}
                      </p>
                    </div>
                  </div>
                  
                  {missingSkills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Key Skills to Highlight:</p>
                      <div className="flex flex-wrap gap-2">
                        {missingSkills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-emerald-200 text-emerald-700">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Optimization Suggestions</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={resetAnalysis}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Re-analyze
                  </Button>
                  <Button 
                    onClick={applyAllSuggestions}
                    size="sm"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    Apply All
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <Card key={index} className={`border-l-4 ${getSuggestionColors(suggestion.type)}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getSuggestionIcon(suggestion.type)}
                          <CardTitle className="text-sm font-medium">{suggestion.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {suggestion.type}
                          </Badge>
                          <Button 
                            size="sm"
                            onClick={() => applySuggestion(suggestion)}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Original:</p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {suggestion.originalText}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Optimized:</p>
                        <p className="text-sm text-gray-800 bg-emerald-50 p-2 rounded border-l-2 border-emerald-400">
                          {suggestion.enhancedText}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Improvement:</p>
                        <p className="text-xs text-gray-600">{suggestion.improvement}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Job Relevance:</p>
                        <p className="text-xs text-emerald-600">{suggestion.matchRelevance}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          
          {!analysisComplete && (
            <Button 
              onClick={handleAnalyze} 
              disabled={!jobDescription.trim() || isAnalyzing}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Job Match'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobMatcherModal;
