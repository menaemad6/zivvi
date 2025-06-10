
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb,
  Zap,
  FileText,
  Star,
  ArrowRight
} from 'lucide-react';
import { CVData } from '@/types/cv';
import { toast } from '@/hooks/use-toast';

interface AICVOptimizerProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  onUpdate: (updatedData: CVData) => void;
}

interface OptimizationSuggestion {
  id: string;
  type: 'improvement' | 'warning' | 'success';
  category: 'content' | 'structure' | 'keywords' | 'formatting';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
}

export const AICVOptimizer = ({ isOpen, onClose, cvData, onUpdate }: AICVOptimizerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [optimizationScore, setOptimizationScore] = useState(0);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);

  const analyzCV = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis results
    const mockSuggestions: OptimizationSuggestion[] = [
      {
        id: '1',
        type: 'improvement',
        category: 'content',
        title: 'Enhance Professional Summary',
        description: 'Your summary could be more compelling. Consider adding specific achievements and quantifiable results.',
        impact: 'high',
        effort: 'medium'
      },
      {
        id: '2',
        type: 'warning',
        category: 'keywords',
        title: 'Missing Industry Keywords',
        description: 'Your CV lacks important industry-specific keywords that ATS systems look for.',
        impact: 'high',
        effort: 'low'
      },
      {
        id: '3',
        type: 'improvement',
        category: 'structure',
        title: 'Optimize Section Order',
        description: 'Consider reordering sections to highlight your strengths first.',
        impact: 'medium',
        effort: 'low'
      },
      {
        id: '4',
        type: 'success',
        category: 'formatting',
        title: 'Great Contact Information',
        description: 'Your contact details are complete and professional.',
        impact: 'low',
        effort: 'low'
      }
    ];

    setSuggestions(mockSuggestions);
    setOptimizationScore(72);
    setAnalysisComplete(true);
    setIsAnalyzing(false);

    toast({
      title: "Analysis Complete",
      description: "Your CV has been analyzed. Check the suggestions below."
    });
  };

  const applySuggestion = (suggestionId: string) => {
    // Mock applying suggestion
    setSuggestions(prev => 
      prev.map(s => 
        s.id === suggestionId 
          ? { ...s, type: 'success' as const }
          : s
      )
    );
    
    toast({
      title: "Suggestion Applied",
      description: "Your CV has been updated with the optimization."
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImpactBadgeColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'improvement': return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-500" />
            AI CV Optimizer
          </DialogTitle>
          <DialogDescription>
            Get AI-powered suggestions to improve your CV's effectiveness and ATS compatibility.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!analysisComplete ? (
            <div className="text-center py-8">
              <div className="mb-6">
                <Bot className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ready to Optimize Your CV?</h3>
                <p className="text-gray-600 mb-6">
                  Our AI will analyze your CV for content quality, structure, keywords, and ATS compatibility.
                </p>
              </div>

              {isAnalyzing ? (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="text-sm text-gray-600">Analyzing your CV...</p>
                  <Progress value={33} className="w-64 mx-auto" />
                </div>
              ) : (
                <Button onClick={analyzCV} className="bg-purple-600 hover:bg-purple-700">
                  <Zap className="h-4 w-4 mr-2" />
                  Start Analysis
                </Button>
              )}
            </div>
          ) : (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Optimization Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Optimization Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Overall Score</span>
                          <span className={`text-sm font-bold ${getScoreColor(optimizationScore)}`}>
                            {optimizationScore}/100
                          </span>
                        </div>
                        <Progress value={optimizationScore} className="h-3" />
                      </div>
                      <div className={`text-3xl font-bold ${getScoreColor(optimizationScore)}`}>
                        {optimizationScore}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Improvements Found</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {suggestions.filter(s => s.type === 'improvement').length}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">Issues Found</span>
                      </div>
                      <p className="text-2xl font-bold text-yellow-600">
                        {suggestions.filter(s => s.type === 'warning').length}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Strong Points</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        {suggestions.filter(s => s.type === 'success').length}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="suggestions" className="space-y-4">
                {suggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="transition-all hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getSuggestionIcon(suggestion.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{suggestion.title}</h4>
                            <Badge className={getImpactBadgeColor(suggestion.impact)}>
                              {suggestion.impact} impact
                            </Badge>
                            <Badge variant="outline">
                              {suggestion.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {suggestion.description}
                          </p>
                          {suggestion.type !== 'success' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => applySuggestion(suggestion.id)}
                              className="text-purple-600 border-purple-200 hover:bg-purple-50"
                            >
                              Apply Suggestion
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="keywords" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Keyword Analysis
                    </CardTitle>
                    <CardDescription>
                      Keywords help your CV get noticed by ATS systems and recruiters.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Recommended Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'MongoDB'].map((keyword) => (
                          <Badge key={keyword} variant="outline" className="cursor-pointer hover:bg-purple-50">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Missing Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Machine Learning', 'DevOps', 'Kubernetes', 'Redis'].map((keyword) => (
                          <Badge key={keyword} className="bg-red-100 text-red-800 cursor-pointer hover:bg-red-200">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {analysisComplete && (
            <Button className="bg-purple-600 hover:bg-purple-700">
              Export Analysis Report
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
