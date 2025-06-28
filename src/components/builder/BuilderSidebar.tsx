
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarSection } from './SidebarSection';
import { 
  Bot, 
  Wand2, 
  Target, 
  Sparkles, 
  Lightbulb, 
  Scan, 
  Languages,
  Zap,
  Shuffle,
  Copy,
  Camera,
  RefreshCw,
  Plus,
  Star
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BuilderSidebarProps {
  availableSections: Array<{
    id: string;
    title: string;
    icon: React.ReactNode;
    description: string;
  }>;
  onDragStart: (e: React.DragEvent, sectionId: string) => void;
  onAIAssist: () => void;
  onAIOptimizer: () => void;
  onAIEnhancer: () => void;
  onTemplateNavigation: () => void;
  onSave: () => void;
}

export const BuilderSidebar: React.FC<BuilderSidebarProps> = ({
  availableSections,
  onDragStart,
  onAIAssist,
  onAIOptimizer,
  onAIEnhancer,
  onTemplateNavigation,
  onSave
}) => {
  return (
    <div className="w-80 bg-white/90 backdrop-blur-2xl border-r border-gray-200/50 shadow-xl">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          {/* AI Tools Section */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">AI Assistant</CardTitle>
                  <p className="text-sm text-gray-600">Powered by AI</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[
                { 
                  icon: Wand2, 
                  label: 'Smart Generator', 
                  action: onAIAssist, 
                  gradient: 'from-purple-600 to-indigo-600'
                },
                { 
                  icon: Target, 
                  label: 'CV Optimizer', 
                  action: onAIOptimizer, 
                  gradient: 'from-orange-600 to-pink-600'
                },
                { 
                  icon: Sparkles, 
                  label: 'Content Enhancer', 
                  action: onAIEnhancer, 
                  gradient: 'from-pink-600 to-red-600'
                },
                { 
                  icon: Lightbulb, 
                  label: 'Smart Tips', 
                  action: () => toast({ title: "Coming Soon!", description: "Smart tips feature is in development." }), 
                  gradient: 'from-yellow-600 to-orange-600'
                },
                { 
                  icon: Scan, 
                  label: 'CV Analyzer', 
                  action: () => toast({ title: "Coming Soon!", description: "CV analyzer feature is in development." }), 
                  gradient: 'from-emerald-600 to-cyan-600'
                },
                { 
                  icon: Languages, 
                  label: 'Multi-Language', 
                  action: () => toast({ title: "Coming Soon!", description: "Multi-language support is in development." }), 
                  gradient: 'from-blue-600 to-purple-600'
                }
              ].map((tool, index) => (
                <button
                  key={index}
                  onClick={tool.action}
                  className={`
                    w-full p-3 rounded-xl bg-gradient-to-r ${tool.gradient} 
                    hover:shadow-lg hover:scale-[1.02] transition-all duration-200 
                    text-white group text-left
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <tool.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-sm">{tool.label}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Productivity Tools */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">Quick Tools</CardTitle>
                  <p className="text-sm text-gray-600">Boost productivity</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[
                { 
                  icon: Shuffle, 
                  label: 'Templates', 
                  action: onTemplateNavigation,
                  color: 'from-blue-500 to-cyan-500'
                },
                { 
                  icon: Copy, 
                  label: 'Duplicate', 
                  action: () => toast({ title: "Coming Soon!", description: "CV duplication feature is in development." }),
                  color: 'from-green-500 to-emerald-500'
                },
                { 
                  icon: Camera, 
                  label: 'Photos', 
                  action: () => toast({ title: "Coming Soon!", description: "Photo manager feature is in development." }),
                  color: 'from-purple-500 to-pink-500'
                },
                { 
                  icon: RefreshCw, 
                  label: 'Auto-Save', 
                  action: onSave,
                  color: 'from-orange-500 to-red-500'
                }
              ].map((tool, index) => (
                <button
                  key={index}
                  onClick={tool.action}
                  className={`
                    w-full p-3 rounded-xl bg-gradient-to-r ${tool.color} 
                    hover:shadow-lg hover:scale-[1.02] transition-all duration-200 
                    text-white group text-left
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <tool.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-sm">{tool.label}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Available Sections */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">Add Sections</CardTitle>
                  <p className="text-sm text-gray-600">Drag to CV structure</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {availableSections.length > 0 ? (
                <div className="space-y-2">
                  {availableSections.map((section) => (
                    <SidebarSection
                      key={section.id}
                      title={section.title}
                      icon={section.icon}
                      onDragStart={(e) => onDragStart(e, section.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">All sections added!</h3>
                  <p className="text-gray-600 text-sm">Your CV is complete ✨</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};
