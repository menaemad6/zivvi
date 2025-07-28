
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  Users, 
  Plus, 
  Trash2,
  Settings,
  Palette,
  FileText,
  BookOpen,
  Certificate,
  Languages
} from 'lucide-react';
import { CVData } from '@/types/cv';

interface BuilderSidebarProps {
  cvData: CVData;
  activeSections: string[];
  onSectionToggle: (sectionId: string) => void;
  onSectionEdit: (sectionId: string) => void;
  onSettingsClick: () => void;
  onDesignClick: () => void;
  onTemplateClick: () => void;
}

const availableSections = [
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Award },
  { id: 'projects', label: 'Projects', icon: Code },
  { id: 'references', label: 'References', icon: Users },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'certificates', label: 'Certificates', icon: Certificate },
  { id: 'languages', label: 'Languages', icon: Languages }
];

export const BuilderSidebar: React.FC<BuilderSidebarProps> = ({
  cvData,
  activeSections,
  onSectionToggle,
  onSectionEdit,
  onSettingsClick,
  onDesignClick,
  onTemplateClick
}) => {
  const getSectionItemCount = (sectionId: string) => {
    switch (sectionId) {
      case 'experience':
        return cvData.experience?.length || 0;
      case 'education':
        return cvData.education?.length || 0;
      case 'skills':
        return cvData.skills?.length || 0;
      case 'projects':
        return cvData.projects?.length || 0;
      case 'references':
        return cvData.references?.length || 0;
      case 'courses':
        return cvData.courses?.length || 0;
      case 'certificates':
        return cvData.certificates?.length || 0;
      case 'languages':
        return cvData.languages?.length || 0;
      default:
        return 0;
    }
  };

  const isSectionActive = (sectionId: string) => {
    return activeSections.includes(sectionId);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold">CV Builder</h2>
        </div>
        
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start" 
            onClick={onSettingsClick}
          >
            <Settings className="w-4 h-4 mr-2" />
            CV Settings
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start" 
            onClick={onDesignClick}
          >
            <Palette className="w-4 h-4 mr-2" />
            Design Options
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start" 
            onClick={onTemplateClick}
          >
            <FileText className="w-4 h-4 mr-2" />
            Change Template
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="space-y-4">
            {/* Personal Information - Always Active */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Personal Information
                  <Badge variant="secondary" className="ml-auto">Required</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => onSectionEdit('personalInfo')}
                >
                  Edit Personal Info
                </Button>
              </CardContent>
            </Card>

            {/* Available Sections */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-700">CV Sections</h3>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
              
              {availableSections.map((section) => {
                const Icon = section.icon;
                const isActive = isSectionActive(section.id);
                const itemCount = getSectionItemCount(section.id);
                
                return (
                  <Card key={section.id} className={`transition-all ${isActive ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{section.label}</span>
                          {itemCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {itemCount}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSectionToggle(section.id)}
                          className={`h-6 w-6 p-0 ${isActive ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}`}
                        >
                          {isActive ? <Trash2 className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        </Button>
                      </div>
                      
                      {isActive && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start text-xs"
                          onClick={() => onSectionEdit(section.id)}
                        >
                          Edit {section.label}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
