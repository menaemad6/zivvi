
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CVSection } from '@/components/builder/CVSection';
import { SectionEditModal } from '@/components/builder/SectionEditModal';
import { CVSettingsModal } from '@/components/modals/CVSettingsModal';
import { AIGenerateButton } from '@/components/builder/AIGenerateButton';
import { CVTemplateRenderer } from '@/components/cv/CVTemplateRenderer';
import { useCV } from '@/hooks/useCV';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Settings, 
  Download, 
  Eye,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Languages,
  Heart,
  FileText,
  Contact,
  Target,
  Star,
  Plus,
  Bot,
  Zap,
  Palette,
  Type,
  Layout,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { AICVOptimizer } from '@/components/builder/AICVOptimizer';
import { AIResumeEnhancer } from '@/components/builder/AIResumeEnhancer';

const availableSections = [
  { id: 'personal', name: 'Personal Info', icon: User, color: 'bg-blue-500' },
  { id: 'summary', name: 'Professional Summary', icon: FileText, color: 'bg-green-500' },
  { id: 'experience', name: 'Work Experience', icon: Briefcase, color: 'bg-purple-500' },
  { id: 'education', name: 'Education', icon: GraduationCap, color: 'bg-orange-500' },
  { id: 'skills', name: 'Skills', icon: Code, color: 'bg-red-500' },
  { id: 'projects', name: 'Projects', icon: Target, color: 'bg-indigo-500' },
  { id: 'certifications', name: 'Certifications', icon: Award, color: 'bg-yellow-500' },
  { id: 'languages', name: 'Languages', icon: Languages, color: 'bg-pink-500' },
  { id: 'interests', name: 'Interests', icon: Heart, color: 'bg-teal-500' },
  { id: 'references', name: 'References', icon: Contact, color: 'bg-cyan-500' },
];

const aiTools = [
  { id: 'optimizer', name: 'CV Optimizer', icon: Bot, description: 'Optimize your CV with AI' },
  { id: 'enhancer', name: 'Content Enhancer', icon: Zap, description: 'Enhance your content' },
  { id: 'keywords', name: 'Keyword Analyzer', icon: Star, description: 'Analyze keywords' },
];

const designTools = [
  { id: 'colors', name: 'Color Themes', icon: Palette, description: 'Customize colors' },
  { id: 'fonts', name: 'Typography', icon: Type, description: 'Choose fonts' },
  { id: 'layout', name: 'Layout Options', icon: Layout, description: 'Change layout' },
];

export default function Builder() {
  const { id } = useParams<{ id: string }>();
  const { cv, updateCV, addSection, removeSection, updateSection, isLoading } = useCV(id);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [activeAITool, setActiveAITool] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>CV not found</p>
      </div>
    );
  }

  const addSectionToCV = (sectionType: string) => {
    const sectionData = {
      id: `${sectionType}-${Date.now()}`,
      type: sectionType,
      title: availableSections.find(s => s.id === sectionType)?.name || sectionType,
      content: {},
      order: cv.sections?.length || 0
    };
    addSection(sectionData);
  };

  const getAvailableSections = () => {
    const usedSectionTypes = cv.sections?.map(section => section.type) || [];
    return availableSections.filter(section => !usedSectionTypes.includes(section.id));
  };

  const exportToPDF = () => {
    window.print();
  };

  const previewCV = () => {
    window.open(`/preview/${id}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 flex relative">
      {/* Sidebar */}
      <div className={`
        relative bg-white/95 backdrop-blur-xl border-r border-slate-200/60 
        transition-all duration-300 ease-in-out shadow-xl
        ${sidebarCollapsed ? 'w-20' : 'w-80'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-200/60 bg-gradient-to-r from-blue-600 to-indigo-600">
          {!sidebarCollapsed && (
            <div>
              <h2 className="text-xl font-bold text-white mb-1">CV Builder</h2>
              <p className="text-blue-100 text-sm">Drag sections to build your CV</p>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="flex justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-4 space-y-6">
            {/* Available Sections */}
            <div>
              {!sidebarCollapsed && (
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Available Sections
                </h3>
              )}
              <div className="space-y-2">
                {getAvailableSections().map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <Card 
                      key={section.id}
                      className={`
                        p-3 cursor-pointer transition-all duration-200 
                        hover:shadow-lg hover:scale-[1.02] border-slate-200/60
                        bg-gradient-to-r from-white to-slate-50/50
                        ${sidebarCollapsed ? 'justify-center' : ''}
                      `}
                      onClick={() => addSectionToCV(section.id)}
                    >
                      <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                        <div className={`${section.color} p-2 rounded-lg shadow-sm`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        {!sidebarCollapsed && (
                          <div>
                            <h4 className="font-medium text-slate-800">{section.name}</h4>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* AI Tools */}
            <div>
              {!sidebarCollapsed && (
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  AI Tools
                </h3>
              )}
              <div className="space-y-2">
                {aiTools.map((tool) => {
                  const IconComponent = tool.icon;
                  return (
                    <Card 
                      key={tool.id}
                      className={`
                        p-3 cursor-pointer transition-all duration-200 
                        hover:shadow-lg hover:scale-[1.02] border-slate-200/60
                        bg-gradient-to-r from-purple-50 to-blue-50
                        ${sidebarCollapsed ? 'justify-center' : ''}
                      `}
                      onClick={() => setActiveAITool(tool.id)}
                    >
                      <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg shadow-sm">
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        {!sidebarCollapsed && (
                          <div>
                            <h4 className="font-medium text-slate-800">{tool.name}</h4>
                            <p className="text-xs text-slate-600">{tool.description}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Design Tools */}
            <div>
              {!sidebarCollapsed && (
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Design Tools
                </h3>
              )}
              <div className="space-y-2">
                {designTools.map((tool) => {
                  const IconComponent = tool.icon;
                  return (
                    <Card 
                      key={tool.id}
                      className={`
                        p-3 cursor-pointer transition-all duration-200 
                        hover:shadow-lg hover:scale-[1.02] border-slate-200/60
                        bg-gradient-to-r from-emerald-50 to-teal-50
                        ${sidebarCollapsed ? 'justify-center' : ''}
                      `}
                    >
                      <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg shadow-sm">
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        {!sidebarCollapsed && (
                          <div>
                            <h4 className="font-medium text-slate-800">{tool.name}</h4>
                            <p className="text-xs text-slate-600">{tool.description}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200/60 bg-slate-50/50">
          <div className={`flex gap-2 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <Button 
              variant="outline" 
              size={sidebarCollapsed ? "icon" : "sm"}
              onClick={() => setShowSettings(true)}
              className="bg-white/80 hover:bg-white shadow-sm"
            >
              <Settings className="w-4 h-4" />
              {!sidebarCollapsed && <span className="ml-2">Settings</span>}
            </Button>
            {!sidebarCollapsed && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={previewCV}
                  className="bg-white/80 hover:bg-white shadow-sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={exportToPDF}
                  className="bg-white/80 hover:bg-white shadow-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Collapse Handler */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`
            absolute top-1/2 -translate-y-1/2 -right-4 z-50
            w-8 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 
            hover:from-blue-600 hover:to-indigo-600
            text-white rounded-r-xl shadow-lg
            flex items-center justify-center
            transition-all duration-300 ease-in-out
            hover:shadow-xl hover:scale-105
            border-2 border-white/20
          `}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* CV Canvas */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">{cv.title}</h1>
                  <p className="text-slate-600">Build your professional CV</p>
                </div>
                <AIGenerateButton cvId={id!} />
              </div>
            </div>

            {/* CV Sections */}
            <div className="space-y-6">
              {cv.sections?.map((section) => (
                <CVSection
                  key={section.id}
                  section={section}
                  onEdit={() => setEditingSection(section)}
                  onDelete={() => removeSection(section.id)}
                  onUpdate={(updatedSection) => updateSection(section.id, updatedSection)}
                />
              ))}
            </div>

            {cv.sections?.length === 0 && (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">Start Building Your CV</h3>
                <p className="text-slate-500">Add sections from the sidebar to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {editingSection && (
        <SectionEditModal
          section={editingSection}
          onSave={(updatedSection) => {
            updateSection(editingSection.id, updatedSection);
            setEditingSection(null);
          }}
          onClose={() => setEditingSection(null)}
        />
      )}

      {showSettings && (
        <CVSettingsModal
          cv={cv}
          onSave={updateCV}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* AI Tool Modals */}
      {activeAITool === 'optimizer' && (
        <AICVOptimizer
          cv={cv}
          onClose={() => setActiveAITool(null)}
          onUpdate={updateCV}
        />
      )}

      {activeAITool === 'enhancer' && (
        <AIResumeEnhancer
          cv={cv}
          onClose={() => setActiveAITool(null)}
          onUpdate={updateCV}
        />
      )}
    </div>
  );
}
