
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
import { Loader2, Sparkles, CheckCircle, TrendingUp, Lightbulb, Users, Award } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CVData } from "@/types/cv";
import { getGeminiResponse } from "@/utils/geminiApi";

interface AIResumeEnhancerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  cvData: CVData;
  onEnhance: (updatedData: CVData) => void;
}

interface Enhancement {
  type: 'experience' | 'skills' | 'summary' | 'projects' | 'languages' | 'courses' | 'certificates';
  title: string;
  originalText: string;
  enhancedText: string;
  improvement: string;
}

export function AIResumeEnhancer({ open, setOpen, cvData, onEnhance }: AIResumeEnhancerProps) {
  const [loading, setLoading] = useState(false);
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  const [enhancementComplete, setEnhancementComplete] = useState(false);

  const generateEnhancementPrompt = (cvData: CVData) => {
    return `Analyze this CV data and provide enhanced content suggestions in JSON format:
    
    CV Data: ${JSON.stringify(cvData, null, 2)}
    
    Provide enhanced versions of the content with improvements in this JSON format:
    [
      {
        "type": "experience|skills|summary|projects|languages|courses|certificates",
        "title": "Section title or job title",
        "originalText": "Current text content",
        "enhancedText": "Improved version with action verbs, metrics, and impact",
        "improvement": "Brief explanation of what was improved"
      }
    ]
    
    Focus on:
    1. Adding action verbs and power words
    2. Quantifying achievements with metrics
    3. Highlighting impact and results
    4. Using industry-specific keywords
    5. Improving clarity and readability
    6. Making content more compelling and professional
    7. Enhancing language proficiency descriptions
    8. Improving course and certificate descriptions with relevant skills gained
    
    Provide 3-6 enhancements covering different sections, including the new sections (languages, courses, certificates) if they exist.`;
  };

  const parseEnhancementResponse = (response: string): Enhancement[] => {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing enhancement response:', error);
      return [];
    }
  };

  const enhanceResume = async () => {
    setLoading(true);
    setEnhancementComplete(false);
    
    try {
      const prompt = generateEnhancementPrompt(cvData);
      const aiResponse = await getGeminiResponse(prompt);
      const enhancementSuggestions = parseEnhancementResponse(aiResponse);
      
      setEnhancements(enhancementSuggestions);
      setEnhancementComplete(true);
      
      toast({
        title: "Enhancement Complete!",
        description: `Generated ${enhancementSuggestions.length} enhancement suggestions.`
      });
    } catch (error) {
      console.error('Error enhancing resume:', error);
      toast({
        title: "Enhancement Failed",
        description: "Unable to enhance your resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyEnhancement = (enhancement: Enhancement) => {
    const updatedCVData = { ...cvData };
    
    switch (enhancement.type) {
      case 'summary':
        if (updatedCVData.personalInfo) {
          updatedCVData.personalInfo.summary = enhancement.enhancedText;
        }
        break;
      case 'experience':
        if (updatedCVData.experience) {
          const expIndex = updatedCVData.experience.findIndex(exp => 
            exp.title === enhancement.title || exp.description === enhancement.originalText
          );
          if (expIndex !== -1) {
            updatedCVData.experience[expIndex].description = enhancement.enhancedText;
          }
        }
        break;
      case 'projects':
        if (updatedCVData.projects) {
          const projIndex = updatedCVData.projects.findIndex(proj => 
            proj.name === enhancement.title || proj.description === enhancement.originalText
          );
          if (projIndex !== -1) {
            updatedCVData.projects[projIndex].description = enhancement.enhancedText;
          }
        }
        break;
      case 'languages':
        if (updatedCVData.languages) {
          const langIndex = updatedCVData.languages.findIndex(lang => 
            lang.name === enhancement.title || lang.proficiency === enhancement.originalText
          );
          if (langIndex !== -1) {
            updatedCVData.languages[langIndex].proficiency = enhancement.enhancedText;
          }
        }
        break;
      case 'courses':
        if (updatedCVData.courses) {
          const courseIndex = updatedCVData.courses.findIndex(course => 
            course.name === enhancement.title || course.description === enhancement.originalText
          );
          if (courseIndex !== -1) {
            updatedCVData.courses[courseIndex].description = enhancement.enhancedText;
          }
        }
        break;
      case 'certificates':
        if (updatedCVData.certificates) {
          const certIndex = updatedCVData.certificates.findIndex(cert => 
            cert.name === enhancement.title || cert.description === enhancement.originalText
          );
          if (certIndex !== -1) {
            updatedCVData.certificates[certIndex].description = enhancement.enhancedText;
          }
        }
        break;
    }
    
    onEnhance(updatedCVData);
    toast({
      title: "Enhancement Applied!",
      description: "Your CV has been updated with the enhanced content."
    });
  };

  const applyAllEnhancements = () => {
    const updatedCVData = { ...cvData };
    
    enhancements.forEach(enhancement => {
      switch (enhancement.type) {
        case 'summary':
          if (updatedCVData.personalInfo) {
            updatedCVData.personalInfo.summary = enhancement.enhancedText;
          }
          break;
        case 'experience':
          if (updatedCVData.experience) {
            const expIndex = updatedCVData.experience.findIndex(exp => 
              exp.title === enhancement.title || exp.description === enhancement.originalText
            );
            if (expIndex !== -1) {
              updatedCVData.experience[expIndex].description = enhancement.enhancedText;
            }
          }
          break;
        case 'projects':
          if (updatedCVData.projects) {
            const projIndex = updatedCVData.projects.findIndex(proj => 
              proj.name === enhancement.title || proj.description === enhancement.originalText
            );
            if (projIndex !== -1) {
              updatedCVData.projects[projIndex].description = enhancement.enhancedText;
            }
          }
          break;
        case 'languages':
          if (updatedCVData.languages) {
            const langIndex = updatedCVData.languages.findIndex(lang => 
              lang.name === enhancement.title || lang.proficiency === enhancement.originalText
            );
            if (langIndex !== -1) {
              updatedCVData.languages[langIndex].proficiency = enhancement.enhancedText;
            }
          }
          break;
        case 'courses':
          if (updatedCVData.courses) {
            const courseIndex = updatedCVData.courses.findIndex(course => 
              course.name === enhancement.title || course.description === enhancement.originalText
            );
            if (courseIndex !== -1) {
              updatedCVData.courses[courseIndex].description = enhancement.enhancedText;
            }
          }
          break;
        case 'certificates':
          if (updatedCVData.certificates) {
            const certIndex = updatedCVData.certificates.findIndex(cert => 
              cert.name === enhancement.title || cert.description === enhancement.originalText
            );
            if (certIndex !== -1) {
              updatedCVData.certificates[certIndex].description = enhancement.enhancedText;
            }
          }
          break;
      }
    });
    
    onEnhance(updatedCVData);
    toast({
      title: "All Enhancements Applied!",
      description: "Your entire CV has been enhanced with AI-powered improvements."
    });
  };

  const getEnhancementIcon = (type: string) => {
    switch (type) {
      case 'experience':
        return <TrendingUp className="h-4 w-4" />;
      case 'skills':
        return <Award className="h-4 w-4" />;
      case 'summary':
        return <Users className="h-4 w-4" />;
      case 'projects':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getEnhancementColors = (type: string) => {
    switch (type) {
      case 'experience':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'skills':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'summary':
        return 'border-purple-200 bg-purple-50 text-purple-800';
      case 'projects':
        return 'border-orange-200 bg-orange-50 text-orange-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            AI Resume Enhancer
          </DialogTitle>
          <DialogDescription>
            Enhance your CV content with AI-powered improvements for better impact and readability
          </DialogDescription>
        </DialogHeader>

        {!enhancementComplete && (
          <div className="text-center py-8">
            {loading ? (
              <>
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Enhancing Your Content</h3>
                <p className="text-gray-600">AI is analyzing and improving your CV content...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Enhance Your CV?</h3>
                <p className="text-gray-600 mb-6">Our AI will improve your content with powerful language, metrics, and professional phrasing.</p>
                <Button 
                  onClick={enhanceResume}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  Start Enhancement
                </Button>
              </>
            )}
          </div>
        )}

        {enhancementComplete && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Enhancement Suggestions</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={enhanceResume}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Re-enhance
                </Button>
                <Button 
                  onClick={applyAllEnhancements}
                  size="sm"
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  Apply All
                </Button>
              </div>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {enhancements.map((enhancement, index) => (
                <Card key={index} className={`border-l-4 ${getEnhancementColors(enhancement.type)}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getEnhancementIcon(enhancement.type)}
                        <CardTitle className="text-sm font-medium">{enhancement.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {enhancement.type}
                        </Badge>
                        <Button 
                          size="sm"
                          onClick={() => applyEnhancement(enhancement)}
                          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
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
                        {enhancement.originalText}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Enhanced:</p>
                      <p className="text-sm text-gray-800 bg-green-50 p-2 rounded border-l-2 border-green-400">
                        {enhancement.enhancedText}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Improvement:</p>
                      <p className="text-xs text-gray-600">{enhancement.improvement}</p>
                    </div>
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
