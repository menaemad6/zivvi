import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  ChevronLeft,
  ChevronRight,
  Crosshair
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BuilderSidebarProps {
  availableSections?: Array<{
    id: string;
    title: string;
    icon: React.ReactNode;
    description: string;
  }>;
  onDragStart?: (e: React.DragEvent, sectionId: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onAIAssist: () => void;
  onAIOptimizer: () => void;
  onAIEnhancer: () => void;
  onJobMatcher: () => void;
  onTemplateNavigation: () => void;
  onSave: () => void;
}

const BuilderSidebar: React.FC<BuilderSidebarProps> = ({
  availableSections,
  onDragStart,
  collapsed = false,
  onToggleCollapse,
  onAIAssist,
  onAIOptimizer,
  onAIEnhancer,
  onJobMatcher,
  onTemplateNavigation,
  onSave
}) => {
  return (
    <div className={`h-full bg-white/90 backdrop-blur-2xl border-r border-gray-200/50 shadow-xl transition-all duration-300 ease-in-out
      ${collapsed
        ? 'w-10 sm:w-12 md:w-14 lg:w-16 xl:w-16'
        : 'w-36 sm:w-44 md:w-52 lg:w-60 xl:w-64'}
    `}>
      {/* Toggle Button */}
      <div className="absolute -right-3 top-8 z-10">
        <Button
          onClick={onToggleCollapse}
          variant="outline"
          size="sm"
          className="h-6 w-6 rounded-full bg-white border border-gray-300 shadow-md hover:shadow-lg transition-all duration-200"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>

      <ScrollArea className="h-full">
        <div className={`
          ${collapsed
            ? 'p-1 sm:p-2 md:px-2 lg:px-2 xl:px-2 space-y-1 sm:space-y-2 md:space-y-2 lg:space-y-2 xl:space-y-2'
            : 'p-2 sm:p-3 md:px-4 lg:px-5 xl:px-6 space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-4 xl:space-y-5'}
        `}>
          {/* AI Tools Section */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className={`bg-gradient-to-r from-purple-50 to-pink-50 ${collapsed ? 'pb-2 px-2 sm:px-2' : 'pb-4 px-2 sm:px-3'}`}>
              <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2 sm:gap-3'}`}>
                <div className={`rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg ${
                  collapsed ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-10 sm:h-10'
                }`}>
                  <Bot className={`text-white ${collapsed ? 'h-4 w-4' : 'h-5 w-5'}`} />
                </div>
                {!collapsed && (
                  <div>
                    <CardTitle className="text-base sm:text-lg font-bold text-gray-900">AI Assistant</CardTitle>
                    <p className="text-xs sm:text-sm text-gray-600">Powered by AI</p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className={`p-2 sm:p-3 space-y-2 sm:space-y-3 ${collapsed ? 'p-1 sm:p-2' : ''}`}>
              {[
                { 
                  icon: Wand2, 
                  label: 'Smart Generator', 
                  action: onAIAssist, 
                  gradient: 'from-purple-600 to-indigo-600',
                  className: 'btn-smart-generator',
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
                  icon: Crosshair, 
                  label: 'Job Matcher', 
                  action: onJobMatcher, 
                  gradient: 'from-blue-600 to-cyan-600'
                },
                { 
                  icon: Lightbulb, 
                  label: 'Smart Tips', 
                  action: () => toast({ title: "Coming Soon!", description: "Smart tips feature is in development." }), 
                  gradient: 'from-yellow-600 to-orange-600'
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
                    w-full rounded-xl bg-gradient-to-r ${tool.gradient} 
                    hover:shadow-lg hover:scale-[1.02] transition-all duration-200 
                    text-white group text-left
                    ${collapsed ? 'p-1 sm:p-2' : 'p-2 sm:p-3'}
                    ${tool.className || ''}
                  `}
                  title={collapsed ? tool.label : undefined}
                >
                  <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2 sm:gap-3'}`}>
                    <div className={`rounded-lg bg-white/20 flex items-center justify-center ${
                      collapsed ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-6 h-6 sm:w-8 sm:h-8'
                    }`}>
                      <tool.icon className={`text-white ${collapsed ? 'h-3 w-3' : 'h-4 w-4'}`} />
                    </div>
                    {!collapsed && (
                      <span className="font-medium text-xs sm:text-sm">{tool.label}</span>
                    )}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Productivity Tools */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className={`bg-gradient-to-r from-green-50 to-emerald-50 ${collapsed ? 'pb-2 px-2 sm:px-2' : 'pb-4 px-2 sm:px-3'}`}>
              <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2 sm:gap-3'}`}>
                <div className={`rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg ${
                  collapsed ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-10 sm:h-10'
                }`}>
                  <Zap className={`text-white ${collapsed ? 'h-4 w-4' : 'h-5 w-5'}`} />
                </div>
                {!collapsed && (
                  <div>
                    <CardTitle className="text-base sm:text-lg font-bold text-gray-900">Quick Tools</CardTitle>
                    <p className="text-xs sm:text-sm text-gray-600">Boost productivity</p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className={`p-2 sm:p-3 space-y-2 sm:space-y-3 ${collapsed ? 'p-1 sm:p-2' : ''}`}>
              {[
                { 
                  icon: Shuffle, 
                  label: 'Change Template', 
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
                
              ].map((tool, index) => (
                <button
                  key={index}
                  onClick={tool.action}
                  className={`
                    w-full rounded-xl bg-gradient-to-r ${tool.color} 
                    hover:shadow-lg hover:scale-[1.02] transition-all duration-200 
                    text-white group text-left
                    ${collapsed ? 'p-1 sm:p-2' : 'p-2 sm:p-3'}
                  `}
                  title={collapsed ? tool.label : undefined}
                >
                  <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2 sm:gap-3'}`}>
                    <div className={`rounded-lg bg-white/20 flex items-center justify-center ${
                      collapsed ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-6 h-6 sm:w-8 sm:h-8'
                    }`}>
                      <tool.icon className={`text-white ${collapsed ? 'h-3 w-3' : 'h-4 w-4'}`} />
                    </div>
                    {!collapsed && (
                      <span className="font-medium text-xs sm:text-sm">{tool.label}</span>
                    )}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default BuilderSidebar;
