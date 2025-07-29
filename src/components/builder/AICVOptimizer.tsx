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
import { Loader2, Target, CheckCircle, AlertCircle, TrendingUp, Lightbulb } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CVData } from "@/types/cv";
import { getGeminiResponse } from "@/utils/geminiApi";

interface AICVOptimizerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  cvData: CVData;
}

interface OptimizationSuggestion {
  type: 'improvement' | 'missing' | 'strength';
  category: string;
  section?: 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'languages' | 'courses' | 'certificates';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export function AICVOptimizer({ open, setOpen, cvData }: AICVOptimizerProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const analyzeCVData = () => {
    const analysis = {
      hasPersonalInfo: !!cvData.personalInfo?.fullName && !!cvData.personalInfo?.email,
      hasSummary: !!cvData.personalInfo?.summary && cvData.personalInfo.summary.length > 20,
      experienceCount: cvData.experience?.length || 0,
      educationCount: cvData.education?.length || 0,
      skillsCount: cvData.skills?.length || 0,
      projectsCount: cvData.projects?.length || 0,
      languagesCount: cvData.languages?.length || 0,
      coursesCount: cvData.courses?.length || 0,
      certificatesCount: cvData.certificates?.length || 0,
      hasDescriptions: cvData.experience?.some(exp => exp.description && exp.description.length > 50) || false,
      avgDescriptionLength: cvData.experience?.reduce((acc, exp) => acc + (exp.description?.length || 0), 0) / Math.max(cvData.experience?.length || 1, 1) || 0
    };

    return analysis;
  };

  const generateOptimizationPrompt = (analysis: any, cvData: CVData) => {
    return `Analyze this CV data and provide optimization suggestions in JSON format:
    
    CV Analysis:
    - Personal Info Complete: ${analysis.hasPersonalInfo}
    - Has Professional Summary: ${analysis.hasSummary}
    - Work Experience Entries: ${analysis.experienceCount}
    - Education Entries: ${analysis.educationCount}
    - Skills Listed: ${analysis.skillsCount}
    - Projects Listed: ${analysis.projectsCount}
    - Languages Listed: ${analysis.languagesCount}
    - Courses Listed: ${analysis.coursesCount}
    - Certificates Listed: ${analysis.certificatesCount}
    - Has Detailed Descriptions: ${analysis.hasDescriptions}
    - Average Description Length: ${Math.round(analysis.avgDescriptionLength)}
    
    CV Data: ${JSON.stringify(cvData, null, 2)}
    
    Provide 5-8 specific, actionable suggestions in this JSON format:
    [
      {
        "type": "improvement|missing|strength",
        "category": "Content|Format|Keywords|Structure",
        "title": "Brief suggestion title",
        "description": "Detailed explanation and specific action to take",
        "priority": "high|medium|low"
      }
    ]
    
    Focus on:
    1. Missing essential sections
    2. Weak or missing descriptions
    3. Lack of quantifiable achievements
    4. Industry-specific keywords
    5. Professional summary quality
    6. Skills organization
    7. Language proficiency descriptions
    8. Course and certificate relevance
    9. Overall structure and flow`;
  };

  const parseOptimizationResponse = (response: string): OptimizationSuggestion[] => {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing optimization response:', error);
      return [];
    }
  };

  const analyzeCV = async () => {
    setLoading(true);
    setAnalysisComplete(false);
    
    try {
      const analysis = analyzeCVData();
      const prompt = generateOptimizationPrompt(analysis, cvData);
      const aiResponse = await getGeminiResponse(prompt);
      const optimizationSuggestions = parseOptimizationResponse(aiResponse);
      
      setSuggestions(optimizationSuggestions);
      setAnalysisComplete(true);
      
      toast({
        title: "CV Analysis Complete!",
        description: `Found ${optimizationSuggestions.length} optimization suggestions.`
      });
    } catch (error) {
      console.error('Error analyzing CV:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze your CV. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return <TrendingUp className="h-4 w-4" />;
      case 'missing':
        return <AlertCircle className="h-4 w-4" />;
      case 'strength':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getSuggestionColors = (type: string) => {
    switch (type) {
      case 'improvement':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'missing':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'strength':
        return 'border-green-200 bg-green-50 text-green-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return (
      <Badge className={`${colors[priority as keyof typeof colors]} text-white text-xs`}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center">
              <Target className="h-4 w-4 text-white" />
            </div>
            AI CV Optimizer
          </DialogTitle>
          <DialogDescription>
            Get AI-powered suggestions to improve your CV and make it stand out
          </DialogDescription>
        </DialogHeader>

        {!analysisComplete && (
          <div className="text-center py-8">
            {loading ? (
              <>
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Analyzing Your CV</h3>
                <p className="text-gray-600">AI is reviewing your content and identifying optimization opportunities...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Optimize Your CV?</h3>
                <p className="text-gray-600 mb-6">Our AI will analyze your CV structure, content, and provide personalized suggestions for improvement.</p>
                <Button 
                  onClick={analyzeCV}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  Start CV Analysis
                </Button>
              </>
            )}
          </div>
        )}

        {analysisComplete && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Optimization Suggestions</h3>
              <Button variant="outline" size="sm" onClick={analyzeCV}>
                <Target className="h-4 w-4 mr-2" />
                Re-analyze
              </Button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <Card key={index} className={`border-l-4 ${getSuggestionColors(suggestion.type)}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getSuggestionIcon(suggestion.type)}
                        <CardTitle className="text-sm font-medium">{suggestion.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(suggestion.priority)}
                        <Badge variant="outline" className="text-xs">
                          {suggestion.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600">{suggestion.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
