
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Search, CheckCircle, AlertTriangle, TrendingUp, Users, Award, Lightbulb } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CVData } from "@/types/cv";
import { getGeminiResponse } from "@/utils/geminiApi";

interface AIJobMatchAnalyzerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  cvData: CVData;
  onOptimize: (updatedData: CVData) => void;
}

interface JobMatchAnalysis {
  overallScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: JobMatchRecommendation[];
  keywordSuggestions: string[];
}

interface JobMatchRecommendation {
  type: 'skill' | 'experience' | 'keyword' | 'format';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  section: string;
  currentContent?: string;
  suggestedContent?: string;
  actionable: boolean;
}

export function AIJobMatchAnalyzer({ open, setOpen, cvData, onOptimize }: AIJobMatchAnalyzerProps) {
  const [loading, setLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<JobMatchAnalysis | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const generateJobMatchPrompt = (cvData: CVData, jobDescription: string) => {
    return `Analyze how well this CV matches the job description and provide optimization suggestions in JSON format:

    Job Description:
    ${jobDescription}

    CV Data: ${JSON.stringify(cvData, null, 2)}

    Provide analysis in this JSON format:
    {
      "overallScore": 85,
      "matchingSkills": ["JavaScript", "React", "Node.js"],
      "missingSkills": ["AWS", "Docker", "GraphQL"],
      "recommendations": [
        {
          "type": "skill|experience|keyword|format",
          "priority": "high|medium|low",
          "title": "Add missing technical skill",
          "description": "Include AWS experience to match job requirements",
          "section": "skills|experience|summary|projects",
          "currentContent": "current text if actionable",
          "suggestedContent": "improved version if actionable",
          "actionable": true|false
        }
      ],
      "keywordSuggestions": ["cloud computing", "agile methodology", "team leadership"]
    }

    Focus on:
    1. Skills alignment
    2. Experience relevance
    3. Keyword optimization
    4. Missing qualifications
    5. Specific improvements to increase match score`;
  };

  const parseJobMatchResponse = (response: string): JobMatchAnalysis | null => {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed as JobMatchAnalysis;
    } catch (error) {
      console.error('Error parsing job match response:', error);
      return null;
    }
  };

  const analyzeJobMatch = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please paste the job description to analyze the match.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setAnalysisComplete(false);
    
    try {
      const prompt = generateJobMatchPrompt(cvData, jobDescription);
      const aiResponse = await getGeminiResponse(prompt);
      const matchAnalysis = parseJobMatchResponse(aiResponse);
      
      if (matchAnalysis) {
        setAnalysis(matchAnalysis);
        setAnalysisComplete(true);
        
        toast({
          title: "Job Match Analysis Complete!",
          description: `Your CV has a ${matchAnalysis.overallScore}% match with this job.`
        });
      } else {
        throw new Error('Failed to parse analysis');
      }
    } catch (error) {
      console.error('Error analyzing job match:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze job match. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyRecommendation = (recommendation: JobMatchRecommendation) => {
    if (!recommendation.actionable || !recommendation.suggestedContent) return;

    const updatedCVData = { ...cvData };
    
    switch (recommendation.section) {
      case 'summary':
        if (updatedCVData.personalInfo) {
          updatedCVData.personalInfo.summary = recommendation.suggestedContent;
        }
        break;
      case 'experience':
        if (updatedCVData.experience && recommendation.currentContent) {
          const expIndex = updatedCVData.experience.findIndex(exp => 
            exp.description === recommendation.currentContent
          );
          if (expIndex !== -1) {
            updatedCVData.experience[expIndex].description = recommendation.suggestedContent;
          }
        }
        break;
      case 'skills':
        if (updatedCVData.skills && recommendation.suggestedContent) {
          const newSkills = recommendation.suggestedContent.split(',').map(s => s.trim());
          updatedCVData.skills = [...(updatedCVData.skills || []), ...newSkills];
        }
        break;
      case 'projects':
        if (updatedCVData.projects && recommendation.currentContent) {
          const projIndex = updatedCVData.projects.findIndex(proj => 
            proj.description === recommendation.currentContent
          );
          if (projIndex !== -1) {
            updatedCVData.projects[projIndex].description = recommendation.suggestedContent;
          }
        }
        break;
    }
    
    onOptimize(updatedCVData);
    toast({
      title: "Recommendation Applied!",
      description: "Your CV has been updated to better match the job."
    });
  };

  const applyAllRecommendations = () => {
    if (!analysis) return;
    
    let updatedCVData = { ...cvData };
    const actionableRecs = analysis.recommendations.filter(r => r.actionable && r.suggestedContent);
    
    actionableRecs.forEach(recommendation => {
      switch (recommendation.section) {
        case 'summary':
          if (updatedCVData.personalInfo) {
            updatedCVData.personalInfo.summary = recommendation.suggestedContent!;
          }
          break;
        case 'experience':
          if (updatedCVData.experience && recommendation.currentContent) {
            const expIndex = updatedCVData.experience.findIndex(exp => 
              exp.description === recommendation.currentContent
            );
            if (expIndex !== -1) {
              updatedCVData.experience[expIndex].description = recommendation.suggestedContent!;
            }
          }
          break;
        case 'skills':
          if (recommendation.suggestedContent) {
            const newSkills = recommendation.suggestedContent.split(',').map(s => s.trim());
            updatedCVData.skills = [...(updatedCVData.skills || []), ...newSkills];
          }
          break;
        case 'projects':
          if (updatedCVData.projects && recommendation.currentContent) {
            const projIndex = updatedCVData.projects.findIndex(proj => 
              proj.description === recommendation.currentContent
            );
            if (projIndex !== -1) {
              updatedCVData.projects[projIndex].description = recommendation.suggestedContent!;
            }
          }
          break;
      }
    });
    
    onOptimize(updatedCVData);
    toast({
      title: "All Recommendations Applied!",
      description: `Applied ${actionableRecs.length} job-matching improvements to your CV.`
    });
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'skill':
        return <Award className="h-4 w-4" />;
      case 'experience':
        return <TrendingUp className="h-4 w-4" />;
      case 'keyword':
        return <Search className="h-4 w-4" />;
      case 'format':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getRecommendationColors = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low':
        return 'border-green-200 bg-green-50 text-green-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const actionableRecommendationsCount = analysis?.recommendations.filter(r => r.actionable).length || 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <Search className="h-4 w-4 text-white" />
            </div>
            AI Job Match Analyzer
          </DialogTitle>
          <DialogDescription>
            Analyze how well your CV matches a specific job description and get optimization suggestions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description here to analyze how well your CV matches..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          {!analysisComplete && (
            <div className="text-center py-6">
              {loading ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Analyzing Job Match</h3>
                  <p className="text-gray-600">AI is comparing your CV with the job requirements...</p>
                </>
              ) : (
                <Button 
                  onClick={analyzeJobMatch}
                  disabled={!jobDescription.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Analyze Job Match
                </Button>
              )}
            </div>
          )}

          {analysisComplete && analysis && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Match Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                      {analysis.overallScore}%
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Matching Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {analysis.matchingSkills.length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      Missing Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {analysis.missingSkills.length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {analysis.missingSkills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Missing Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingSkills.map((skill, index) => (
                        <Badge key={index} variant="destructive">{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Optimization Recommendations</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={analyzeJobMatch}>
                    <Search className="h-4 w-4 mr-2" />
                    Re-analyze
                  </Button>
                  {actionableRecommendationsCount > 0 && (
                    <Button 
                      onClick={applyAllRecommendations}
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Apply All ({actionableRecommendationsCount})
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {analysis.recommendations.map((recommendation, index) => (
                  <Card key={index} className={`border-l-4 ${getRecommendationColors(recommendation.priority)}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getRecommendationIcon(recommendation.type)}
                          <CardTitle className="text-sm font-medium">{recommendation.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {recommendation.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {recommendation.type}
                          </Badge>
                          {recommendation.actionable && recommendation.suggestedContent && (
                            <Button 
                              size="sm"
                              onClick={() => applyRecommendation(recommendation)}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                            >
                              Apply
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600">{recommendation.description}</p>
                      {recommendation.actionable && recommendation.currentContent && recommendation.suggestedContent && (
                        <div className="space-y-2 mt-3">
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Current:</p>
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              {recommendation.currentContent}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Suggested:</p>
                            <p className="text-sm text-gray-800 bg-purple-50 p-2 rounded border-l-2 border-purple-400">
                              {recommendation.suggestedContent}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
