
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CVSection } from '@/components/builder/CVSection';
import { SectionEditModal } from '@/components/builder/SectionEditModal';
import { CVSettingsModal } from '@/components/modals/CVSettingsModal';
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
  ChevronRight,
  FileCheck,
  Sparkles,
  TrendingUp,
  BarChart3,
  Clipboard,
  Share2,
  ImageIcon,
  Layers,
  Grid
} from 'lucide-react';
import { AICVOptimizer } from '@/components/builder/AICVOptimizer';
import { AIResumeEnhancer } from '@/components/builder/AIResumeEnhancer';
import { CVData } from '@/types/cv';

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
  { id: 'grammar', name: 'Grammar Check', icon: FileCheck, description: 'Check grammar & spelling' },
  { id: 'tone', name: 'Tone Optimizer', icon: Sparkles, description: 'Optimize tone & style' },
  { id: 'ats', name: 'ATS Scanner', icon: TrendingUp, description: 'ATS compatibility check' },
];

const designTools = [
  { id: 'colors', name: 'Color Themes', icon: Palette, description: 'Customize colors' },
  { id: 'fonts', name: 'Typography', icon: Type, description: 'Choose fonts' },
  { id: 'layout', name: 'Layout Options', icon: Layout, description: 'Change layout' },
  { id: 'spacing', name: 'Spacing', icon: Grid, description: 'Adjust spacing' },
  { id: 'images', name: 'Images', icon: ImageIcon, description: 'Add images' },
  { id: 'sections', name: 'Section Styles', icon: Layers, description: 'Style sections' },
];

const productivityTools = [
  { id: 'analytics', name: 'CV Analytics', icon: BarChart3, description: 'View CV performance' },
  { id: 'templates', name: 'Quick Templates', icon: Clipboard, description: 'Apply templates' },
  { id: 'export', name: 'Export Options', icon: Share2, description: 'Export in formats' },
];

export default function Builder() {
  const { id } = useParams<{ id: string }>();
  const { cvData, setCVData, isLoading, saveCV, updateCVMetadata } = useCV(id);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [activeAITool, setActiveAITool] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSections, setActiveSections] = useState<string[]>(['personal']);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>CV not found</p>
      </div>
    );
  }

  const addSectionToCV = (sectionType: string) => {
    if (!activeSections.includes(sectionType)) {
      setActiveSections(prev => [...prev, sectionType]);
    }
  };

  const removeSectionFromCV = (sectionType: string) => {
    setActiveSections(prev => prev.filter(s => s !== sectionType));
  };

  const updateSectionData = (sectionType: string, data: any) => {
    const newCVData = { ...cvData };
    
    // Update the specific section data
    switch (sectionType) {
      case 'personal':
        newCVData.personalInfo = { ...newCVData.personalInfo, ...data };
        break;
      case 'experience':
        newCVData.experience = data;
        break;
      case 'education':
        newCVData.education = data;
        break;
      case 'skills':
        newCVData.skills = data;
        break;
      case 'projects':
        newCVData.projects = data;
        break;
      case 'references':
        newCVData.references = data;
        break;
      default:
        break;
    }
    
    setCVData(newCVData);
    saveCV(newCVData, [], activeSections);
  };

  const getAvailableSections = () => {
    return availableSections.filter(section => !activeSections.includes(section.id));
  };

  const exportToPDF = () => {
    window.print();
  };

  const previewCV = () => {
    window.open(`/preview/${id}`, '_blank');
  };

  const renderSectionContent = (sectionType: string) => {
    switch (sectionType) {
      case 'personal':
        return (
          <div className="space-y-3">
            <p><strong>Name:</strong> {cvData.personalInfo.fullName || 'Not specified'}</p>
            <p><strong>Email:</strong> {cvData.personalInfo.email || 'Not specified'}</p>
            <p><strong>Phone:</strong> {cvData.personalInfo.phone || 'Not specified'}</p>
            <p><strong>Location:</strong> {cvData.personalInfo.location || 'Not specified'}</p>
            {cvData.personalInfo.summary && (
              <p><strong>Summary:</strong> {cvData.personalInfo.summary}</p>
            )}
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-3">
            {cvData.experience.length > 0 ? (
              cvData.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-blue-200 pl-4">
                  <h4 className="font-semibold">{exp.title} at {exp.company}</h4>
                  <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</p>
                  <p className="text-sm">{exp.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No experience added yet</p>
            )}
          </div>
        );
      case 'education':
        return (
          <div className="space-y-3">
            {cvData.education.length > 0 ? (
              cvData.education.map((edu, index) => (
                <div key={index} className="border-l-2 border-green-200 pl-4">
                  <h4 className="font-semibold">{edu.degree}</h4>
                  <p className="text-sm text-gray-600">{edu.school}</p>
                  <p className="text-sm">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No education added yet</p>
            )}
          </div>
        );
      case 'skills':
        return (
          <div className="space-y-3">
            {cvData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {cvData.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills added yet</p>
            )}
          </div>
        );
      case 'projects':
        return (
          <div className="space-y-3">
            {cvData.projects.length > 0 ? (
              cvData.projects.map((project, index) => (
                <div key={index} className="border-l-2 border-purple-200 pl-4">
                  <h4 className="font-semibold">{project.name}</h4>
                  <p className="text-sm">{project.description}</p>
                  <p className="text-xs text-gray-600">Tech: {project.technologies}</p>
                  {project.link && (
                    <a href={project.link} className="text-blue-500 text-sm hover:underline">
                      View Project
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No projects added yet</p>
            )}
          </div>
        );
      case 'references':
        return (
          <div className="space-y-3">
            {cvData.references.length > 0 ? (
              cvData.references.map((ref, index) => (
                <div key={index} className="border-l-2 border-cyan-200 pl-4">
                  <h4 className="font-semibold">{ref.name}</h4>
                  <p className="text-sm">{ref.position} at {ref.company}</p>
                  <p className="text-sm text-gray-600">{ref.email} | {ref.phone}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No references added yet</p>
            )}
          </div>
        );
      default:
        return <p className="text-gray-500">Section content</p>;
    }
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
        <ScrollArea className="h-[calc(100vh-180px)]">
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
                        ${sidebarCollapsed ? 'flex justify-center' : ''}
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
                        ${sidebarCollapsed ? 'flex justify-center' : ''}
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
                        ${sidebarCollapsed ? 'flex justify-center' : ''}
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

            {/* Productivity Tools */}
            <div>
              {!sidebarCollapsed && (
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Productivity
                </h3>
              )}
              <div className="space-y-2">
                {productivityTools.map((tool) => {
                  const IconComponent = tool.icon;
                  return (
                    <Card 
                      key={tool.id}
                      className={`
                        p-3 cursor-pointer transition-all duration-200 
                        hover:shadow-lg hover:scale-[1.02] border-slate-200/60
                        bg-gradient-to-r from-amber-50 to-orange-50
                        ${sidebarCollapsed ? 'flex justify-center' : ''}
                      `}
                    >
                      <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg shadow-sm">
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

        {/* Enhanced Collapse Handler */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`
            absolute top-1/2 -translate-y-1/2 -right-6 z-50
            w-12 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 
            hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700
            text-white rounded-r-2xl shadow-2xl
            flex items-center justify-center
            transition-all duration-300 ease-in-out
            hover:shadow-2xl hover:scale-105 hover:-translate-x-1
            border-4 border-white/30
            backdrop-blur-sm
            group
            before:absolute before:inset-0 before:rounded-r-2xl 
            before:bg-gradient-to-br before:from-white/20 before:to-transparent 
            before:opacity-0 before:transition-opacity before:duration-300
            hover:before:opacity-100
          `}
        >
          <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </div>
          
          {/* Animated border effect */}
          <div className="absolute inset-0 rounded-r-2xl border-2 border-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-r-2xl bg-gradient-to-br from-blue-400/30 to-indigo-400/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
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
                  <h1 className="text-3xl font-bold text-slate-800">My CV</h1>
                  <p className="text-slate-600">Build your professional CV</p>
                </div>
              </div>
            </div>

            {/* CV Sections */}
            <div className="space-y-6">
              {activeSections.map((sectionType) => {
                const section = availableSections.find(s => s.id === sectionType);
                if (!section) return null;

                return (
                  <CVSection
                    key={sectionType}
                    title={section.name}
                    onEdit={() => setEditingSection({ type: sectionType, data: cvData })}
                    onDelete={() => removeSectionFromCV(sectionType)}
                  >
                    {renderSectionContent(sectionType)}
                  </CVSection>
                );
              })}
            </div>

            {activeSections.length === 0 && (
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
          isOpen={!!editingSection}
          onClose={() => setEditingSection(null)}
          sectionType={editingSection.type}
          sectionData={editingSection.data}
          onSave={(data) => {
            updateSectionData(editingSection.type, data);
            setEditingSection(null);
          }}
        />
      )}

      {showSettings && (
        <CVSettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          cvId={id!}
          currentName="My CV"
          currentDescription=""
          onUpdate={updateCVMetadata}
        />
      )}

      {/* AI Tool Modals */}
      {activeAITool === 'optimizer' && (
        <AICVOptimizer
          isOpen={true}
          onClose={() => setActiveAITool(null)}
          cvData={cvData}
          onUpdate={(updatedData: CVData) => {
            setCVData(updatedData);
            saveCV(updatedData, [], activeSections);
          }}
        />
      )}

      {activeAITool === 'enhancer' && (
        <AIResumeEnhancer
          isOpen={true}
          onClose={() => setActiveAITool(null)}
          cvData={cvData}
          onUpdate={(updatedData: CVData) => {
            setCVData(updatedData);
            saveCV(updatedData, [], activeSections);
          }}
        />
      )}
    </div>
  );
}
