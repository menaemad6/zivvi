
import React from 'react';
import { LayoutDashboard, ListChecks, User2, GraduationCap, Briefcase, Code, MessageSquare, Settings, HelpCircle, Sparkles, Zap, Star, Template, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Tool {
  label: string;
  icon: React.ComponentType<any>;
  action: () => void;
  className?: string;
  gradient?: string;
}

interface BuilderSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onAIAssist?: () => void;
  onAIOptimizer?: () => void;
  onAIEnhancer?: () => void;
  onTemplateNavigation?: () => void;
  onSave?: () => Promise<void>;
  onToolClick?: (toolId: string) => void;
}

const BuilderSidebar: React.FC<BuilderSidebarProps> = ({ 
  collapsed = false,
  onToggleCollapse,
  onAIAssist,
  onAIOptimizer,
  onAIEnhancer,
  onTemplateNavigation,
  onSave,
  onToolClick 
}) => {

  const tools: Tool[] = [
    {
      label: 'Personal Info',
      icon: User2,
      action: () => onToolClick?.('personalInfo'),
      gradient: 'from-blue-500 to-purple-500',
      className: 'hover:bg-blue-50 group-hover:from-blue-600 group-hover:to-purple-600'
    },
    {
      label: 'Experience',
      icon: Briefcase,
      action: () => onToolClick?.('experience'),
      gradient: 'from-orange-500 to-yellow-500',
      className: 'hover:bg-orange-50 group-hover:from-orange-600 group-hover:to-yellow-600'
    },
    {
      label: 'Education',
      icon: GraduationCap,
      action: () => onToolClick?.('education'),
      gradient: 'from-green-500 to-teal-500',
      className: 'hover:bg-green-50 group-hover:from-green-600 group-hover:to-teal-600'
    },
    {
      label: 'Skills',
      icon: Code,
      action: () => onToolClick?.('skills'),
      gradient: 'from-red-500 to-pink-500',
      className: 'hover:bg-red-50 group-hover:from-red-600 group-hover:to-pink-600'
    },
    {
      label: 'Projects',
      icon: ListChecks,
      action: () => onToolClick?.('projects'),
      gradient: 'from-cyan-500 to-blue-500',
      className: 'hover:bg-cyan-50 group-hover:from-cyan-600 group-hover:to-blue-600'
    },
    {
      label: 'References',
      icon: MessageSquare,
      action: () => onToolClick?.('references'),
      gradient: 'from-fuchsia-500 to-purple-500',
      className: 'hover:bg-fuchsia-50 group-hover:from-fuchsia-600 group-hover:to-purple-600'
    },
  ];

  return (
    <div className={`${collapsed ? 'w-16' : 'w-full md:w-64'} bg-white border-r border-gray-200 py-6 px-4 flex flex-col transition-all duration-300`}>
      {/* Collapse Toggle */}
      {onToggleCollapse && (
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      )}

      {!collapsed && <h2 className="text-lg font-semibold mb-4 text-gray-800">Add Sections</h2>}

      <div className="space-y-3">
        {tools.map((tool, index) => (
          <button
            key={index}
            onClick={tool.action}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group ${tool.className}`}
            title={collapsed ? tool.label : undefined}
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
              <tool.icon className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                {tool.label}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* AI Tools Section */}
      {onAIAssist && (
        <div className="mt-8 pt-4 border-t border-gray-200">
          {!collapsed && <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">AI Tools</h3>}
          <div className="space-y-2">
            <button 
              onClick={onAIAssist}
              className="btn-smart-generator w-full flex items-center gap-2 p-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 text-sm font-medium"
              title={collapsed ? "Smart Generator" : undefined}
            >
              <Sparkles className="w-4 h-4" />
              {!collapsed && "Smart Generator"}
            </button>
            
            {onAIOptimizer && (
              <button 
                onClick={onAIOptimizer}
                className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors text-sm text-gray-600"
                title={collapsed ? "AI Optimizer" : undefined}
              >
                <Zap className="w-4 h-4 text-gray-400" />
                {!collapsed && "AI Optimizer"}
              </button>
            )}
            
            {onAIEnhancer && (
              <button 
                onClick={onAIEnhancer}
                className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors text-sm text-gray-600"
                title={collapsed ? "AI Enhancer" : undefined}
              >
                <Star className="w-4 h-4 text-gray-400" />
                {!collapsed && "AI Enhancer"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Additional Tools */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        {!collapsed && <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">More</h3>}
        <div className="space-y-2">
          {onTemplateNavigation && (
            <button 
              onClick={onTemplateNavigation}
              className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors text-sm text-gray-600"
              title={collapsed ? "Templates" : undefined}
            >
              <Template className="w-4 h-4 text-gray-400" />
              {!collapsed && "Templates"}
            </button>
          )}
          
          <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors text-sm text-gray-600">
            <Settings className="w-4 h-4 text-gray-400" />
            {!collapsed && "Settings"}
          </button>
          
          <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors text-sm text-gray-600">
            <HelpCircle className="w-4 h-4 text-gray-400" />
            {!collapsed && "Help & Support"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuilderSidebar;
