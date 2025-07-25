
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  Save, 
  Palette, 
  Zap, 
  Brain, 
  Wand2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export interface BuilderSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onAIAssist: () => void;
  onAIOptimizer: () => void;
  onAIEnhancer: () => void;
  onTemplateNavigation: () => void;
  onSave: () => Promise<void>;
}

export const BuilderSidebar: React.FC<BuilderSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  onAIAssist,
  onAIOptimizer,
  onAIEnhancer,
  onTemplateNavigation,
  onSave
}) => {
  const aiFeatures = [
    {
      icon: Brain,
      label: 'AI Assistant',
      action: onAIAssist,
      gradient: 'from-blue-500 to-purple-600',
      className: 'hover:shadow-lg'
    },
    {
      icon: Zap,
      label: 'AI Optimizer',
      action: onAIOptimizer,
      gradient: 'from-emerald-500 to-teal-600',
      className: 'hover:shadow-lg'
    },
    {
      icon: Wand2,
      label: 'AI Enhancer',
      action: onAIEnhancer,
      gradient: 'from-purple-500 to-pink-600',
      className: 'hover:shadow-lg'
    }
  ];

  const quickActions = [
    {
      icon: Palette,
      label: 'Templates',
      action: onTemplateNavigation,
      gradient: 'from-orange-500 to-red-600',
      className: 'hover:shadow-lg'
    },
    {
      icon: Save,
      label: 'Save CV',
      action: onSave,
      gradient: 'from-green-500 to-emerald-600',
      className: 'hover:shadow-lg'
    }
  ];

  return (
    <div className={`${collapsed ? 'w-16' : 'w-80'} transition-all duration-300 bg-gradient-to-br from-slate-50 to-blue-50 border-r border-slate-200 flex flex-col h-full`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-slate-800">CV Builder</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="p-2 hover:bg-slate-200 transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* AI Features */}
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-4">
            {!collapsed && (
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">AI Features</span>
                <Badge variant="secondary" className="ml-auto text-xs">New</Badge>
              </div>
            )}
            <div className="space-y-2">
              {aiFeatures.map((feature) => (
                <Button
                  key={feature.label}
                  variant="ghost"
                  className={`w-full justify-start gap-3 h-auto p-3 bg-gradient-to-r ${feature.gradient} text-white hover:opacity-90 transition-all ${feature.className}`}
                  onClick={feature.action}
                >
                  <feature.icon className="h-4 w-4" />
                  {!collapsed && <span className="text-sm">{feature.label}</span>}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-4">
            {!collapsed && (
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">Quick Actions</span>
              </div>
            )}
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="ghost"
                  className={`w-full justify-start gap-3 h-auto p-3 bg-gradient-to-r ${action.gradient} text-white hover:opacity-90 transition-all ${action.className}`}
                  onClick={action.action}
                >
                  <action.icon className="h-4 w-4" />
                  {!collapsed && <span className="text-sm">{action.label}</span>}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {!collapsed && (
          <>
            <Separator className="my-4" />
            
            {/* Tips Section */}
            <Card className="shadow-sm border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Pro Tips</span>
                </div>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Use AI Assistant for content suggestions</li>
                  <li>• Optimize your CV for ATS systems</li>
                  <li>• Save regularly to avoid losing changes</li>
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
