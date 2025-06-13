
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  Languages, 
  Target, 
  FileText,
  Plus,
  Settings
} from 'lucide-react';
import { SidebarSection } from './SidebarSection';

interface ModernSidebarProps {
  onDragStart: (e: React.DragEvent, sectionType: string) => void;
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({ onDragStart }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sections = [
    { type: 'personal', title: 'Personal Info', icon: <User className="w-5 h-5" /> },
    { type: 'experience', title: 'Work Experience', icon: <Briefcase className="w-5 h-5" /> },
    { type: 'education', title: 'Education', icon: <GraduationCap className="w-5 h-5" /> },
    { type: 'skills', title: 'Skills', icon: <Code className="w-5 h-5" /> },
    { type: 'projects', title: 'Projects', icon: <Target className="w-5 h-5" /> },
    { type: 'certifications', title: 'Certifications', icon: <Award className="w-5 h-5" /> },
    { type: 'languages', title: 'Languages', icon: <Languages className="w-5 h-5" /> },
    { type: 'summary', title: 'Summary', icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <div className={`bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-16' : 'w-80'
    } flex flex-col h-full relative`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Add Sections</h2>
              <p className="text-xs text-gray-500">Drag to add content</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0 hover:bg-white/50 rounded-lg"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 px-2 py-3">
        <div className="space-y-2">
          {sections.map((section) => (
            <div
              key={section.type}
              draggable
              onDragStart={(e) => onDragStart(e, section.type)}
              className={`group cursor-grab active:cursor-grabbing transition-all duration-200 ${
                isCollapsed ? 'px-2' : 'px-3'
              }`}
            >
              {isCollapsed ? (
                <div className="flex items-center justify-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-sm transition-all duration-200">
                  <div className="text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-200">
                    {section.icon}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-sm hover:scale-[1.02] transition-all duration-200 border border-transparent hover:border-blue-100">
                  <div className="text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-200">
                    {section.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm group-hover:text-blue-900 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                      Drag to add
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full group-hover:bg-blue-400 transition-colors" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="mt-6 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
            <h3 className="font-medium text-gray-900 text-sm mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs hover:bg-white/50"
              >
                Auto-fill from LinkedIn
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs hover:bg-white/50"
              >
                Import from PDF
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs hover:bg-white/50"
              >
                Save as Template
              </Button>
            </div>
          </div>
        )}

        {/* Tips */}
        {!isCollapsed && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
            <h4 className="font-medium text-yellow-800 text-xs mb-2">💡 Pro Tip</h4>
            <p className="text-xs text-yellow-700 leading-relaxed">
              Drag sections from here to your CV to add new content. You can reorder them later.
            </p>
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className={`border-t border-gray-200 p-3 bg-gray-50 ${isCollapsed ? 'text-center' : ''}`}>
        {isCollapsed ? (
          <div className="w-2 h-2 bg-green-400 rounded-full mx-auto" />
        ) : (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            All sections available
          </div>
        )}
      </div>
    </div>
  );
};
