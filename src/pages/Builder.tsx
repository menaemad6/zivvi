
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
import { SidebarSection } from '@/components/builder/SidebarSection';

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
  { id: 'keywords', name: 'Keyword Analyzer', icon: TrendingUp, description: 'Analyze keywords' },
  { id: 'grammar', name: 'Grammar Check', icon: FileCheck, description: 'Check grammar & spelling' },
  { id: 'tone', name: 'Tone Optimizer', icon: Sparkles, description: 'Optimize tone & style' },
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
  const { id } = useParams();
  const { cvData, setCVData, saveCV, isLoading } = useCV(id);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [showEnhancer, setShowEnhancer] = useState(false);
  const [activeSections, setActiveSections] = useState<string[]>([]);

  const handleDragStart = (e: React.DragEvent, sectionType: string) => {
    e.dataTransfer.setData('text/plain', sectionType);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const sectionType = e.dataTransfer.getData('text/plain');
    
    if (!activeSections.includes(sectionType)) {
      setActiveSections([...activeSections, sectionType]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSectionEdit = (sectionType: string) => {
    setEditingSection(sectionType);
  };

  const handleSectionDelete = (sectionType: string) => {
    setActiveSections(activeSections.filter(s => s !== sectionType));
  };

  const handleSectionUpdate = (updatedData: CVData) => {
    setCVData(updatedData);
    saveCV(updatedData);
  };

  const handleSave = () => {
    saveCV(cvData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Enhanced Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col relative`}>
        {/* Enhanced Collapse Handler */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-6 z-50 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>

        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h2 className="text-lg font-semibold">CV Builder</h2>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size={sidebarCollapsed ? "icon" : "sm"}
                onClick={() => setShowSettings(true)}
                className="hover:bg-muted"
              >
                <Settings className="h-4 w-4" />
                {!sidebarCollapsed && <span className="ml-2">Settings</span>}
              </Button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* CV Sections */}
            <div>
              {!sidebarCollapsed && (
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Sections
                </h3>
              )}
              <div className="space-y-2">
                {availableSections.map((section) => (
                  <SidebarSection
                    key={section.id}
                    title={sidebarCollapsed ? '' : section.name}
                    icon={
                      <section.icon 
                        className={`h-4 w-4 ${sidebarCollapsed ? 'mx-auto' : ''}`} 
                      />
                    }
                    onDragStart={(e) => handleDragStart(e, section.id)}
                  />
                ))}
              </div>
            </div>

            {/* AI Tools */}
            <div>
              {!sidebarCollapsed && (
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  AI Tools
                </h3>
              )}
              <div className="space-y-2">
                {aiTools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant="ghost"
                    size={sidebarCollapsed ? "icon" : "sm"}
                    className={`w-full ${sidebarCollapsed ? 'justify-center' : 'justify-start'} hover:bg-muted/60`}
                    onClick={() => {
                      if (tool.id === 'optimizer') setShowOptimizer(true);
                      if (tool.id === 'enhancer') setShowEnhancer(true);
                    }}
                  >
                    <tool.icon className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-2'}`} />
                    {!sidebarCollapsed && tool.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Design Tools */}
            <div>
              {!sidebarCollapsed && (
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Design
                </h3>
              )}
              <div className="space-y-2">
                {designTools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant="ghost"
                    size={sidebarCollapsed ? "icon" : "sm"}
                    className={`w-full ${sidebarCollapsed ? 'justify-center' : 'justify-start'} hover:bg-muted/60`}
                  >
                    <tool.icon className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-2'}`} />
                    {!sidebarCollapsed && tool.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Productivity Tools */}
            <div>
              {!sidebarCollapsed && (
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Productivity
                </h3>
              )}
              <div className="space-y-2">
                {productivityTools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant="ghost"
                    size={sidebarCollapsed ? "icon" : "sm"}
                    className={`w-full ${sidebarCollapsed ? 'justify-center' : 'justify-start'} hover:bg-muted/60`}
                  >
                    <tool.icon className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-2'}`} />
                    {!sidebarCollapsed && tool.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size={sidebarCollapsed ? "icon" : "sm"}
              className="flex-1 hover:bg-muted"
            >
              <Eye className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-2">Preview</span>}
            </Button>
            <Button
              variant="outline"
              size={sidebarCollapsed ? "icon" : "sm"}
              className="flex-1 hover:bg-muted"
            >
              <Download className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-2">Export</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* CV Builder Area */}
        <div
          className="flex-1 p-6 overflow-auto"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">CV Builder</h1>
                <p className="text-muted-foreground">Drag sections from the sidebar to build your CV</p>
              </div>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                Save CV
              </Button>
            </div>

            {/* Active Sections */}
            <div className="space-y-4">
              {activeSections.length === 0 ? (
                <Card className="border-dashed border-2 border-muted-foreground/25 p-8 text-center">
                  <div className="text-muted-foreground">
                    <Plus className="h-8 w-8 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Start Building Your CV</h3>
                    <p>Drag sections from the sidebar to begin creating your professional CV</p>
                  </div>
                </Card>
              ) : (
                activeSections.map((sectionType) => {
                  const section = availableSections.find(s => s.id === sectionType);
                  return (
                    <CVSection
                      key={sectionType}
                      sectionType={sectionType}
                      data={cvData}
                      onEdit={() => handleSectionEdit(sectionType)}
                      onDelete={() => handleSectionDelete(sectionType)}
                      onUpdate={handleSectionUpdate}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* CV Preview */}
        <div className="w-96 border-l border-border bg-muted/30 p-4 overflow-auto">
          <div className="sticky top-0 bg-muted/30 pb-4 mb-4 border-b border-border">
            <h3 className="font-semibold">Live Preview</h3>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 transform scale-75 origin-top">
            <CVTemplateRenderer cvData={cvData} templateId="modern" />
          </div>
        </div>
      </div>

      {/* Modals */}
      {editingSection && (
        <SectionEditModal
          isOpen={true}
          onClose={() => setEditingSection(null)}
          sectionType={editingSection}
          cvData={cvData}
          onSave={handleSectionUpdate}
        />
      )}

      {showSettings && (
        <CVSettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          cvData={cvData}
          onUpdate={handleSectionUpdate}
        />
      )}

      {showOptimizer && (
        <AICVOptimizer
          open={showOptimizer}
          setOpen={setShowOptimizer}
          cvData={cvData}
        />
      )}

      {showEnhancer && (
        <AIResumeEnhancer
          open={showEnhancer}
          onClose={() => setShowEnhancer(false)}
          cvData={cvData}
          onUpdate={handleSectionUpdate}
        />
      )}
    </div>
  );
}
