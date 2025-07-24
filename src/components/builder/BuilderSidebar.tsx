
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Sparkles, Eye, Share2, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { CVData } from '@/types/cv';
import { cvTemplates } from '@/data/templates';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface BuilderSidebarProps {
  cvData: CVData;
  onSectionToggle: (sectionId: string, isActive: boolean) => void;
  onTemplateChange: (templateId: string) => void;
  template: string;
  sections: { id: string; label: string; isActive: boolean; }[];
  onSave: () => void;
  isSaving: boolean;
  onAIGenerate: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onAIAssist?: () => void;
  onAIOptimizer?: () => void;
  onAIEnhancer?: () => void;
  onTemplateNavigation?: () => void;
}

const BuilderSidebar = ({ 
  cvData, 
  onSectionToggle, 
  onTemplateChange, 
  template, 
  sections, 
  onSave, 
  isSaving, 
  onAIGenerate,
  collapsed = false,
  onToggleCollapse,
  onAIAssist,
  onAIOptimizer,
  onAIEnhancer,
  onTemplateNavigation
}: BuilderSidebarProps) => {
  const navigate = useNavigate();
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const quickActions = [
    {
      icon: FileText,
      label: 'Add Template',
      action: () => onTemplateNavigation ? onTemplateNavigation() : setShowTemplateSelector(true),
      gradient: 'from-blue-500 to-purple-500',
      className: 'hover:from-blue-600 hover:to-purple-600'
    },
    {
      icon: Sparkles,
      label: 'AI Generate',
      action: onAIAssist || onAIGenerate,
      gradient: 'from-purple-500 to-pink-500',
      className: 'hover:from-purple-600 hover:to-pink-600'
    },
    {
      icon: Eye,
      label: 'Preview',
      action: () => {
        localStorage.setItem('previewCVData', JSON.stringify({
          cvData,
          template,
          sections: sections.filter(s => s.isActive).map(s => s.id)
        }));
        navigate('/preview');
      },
      gradient: 'from-green-500 to-emerald-500',
      className: 'hover:from-green-600 hover:to-emerald-600'
    },
    {
      icon: Share2,
      label: 'Share',
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "CV link has been copied to clipboard."
        });
      },
      gradient: 'from-orange-500 to-red-500',
      className: 'hover:from-orange-600 hover:to-red-600'
    }
  ];

  const renderSectionManagement = () => (
    <div className="p-4 border-b border-gray-200/50">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <FileText className="h-4 w-4 text-blue-500" />
        Sections Management
      </h3>
      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.id} className="flex items-center justify-between">
            <Label htmlFor={section.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {section.label}
            </Label>
            <Switch
              id={section.id}
              checked={section.isActive}
              onCheckedChange={(checked) => onSectionToggle(section.id, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderTemplateSelector = () => (
    <Sheet open={showTemplateSelector} onOpenChange={setShowTemplateSelector}>
      <SheetTrigger asChild>
        <Button variant="outline">
          Change Template
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>Select a Template</SheetTitle>
          <SheetDescription>
            Choose the perfect template for your CV.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup defaultValue={template} onValueChange={onTemplateChange} className="grid grid-cols-2 gap-4">
            {cvTemplates.map((t) => (
              <div key={t.id} className="flex items-center space-x-2">
                <RadioGroupItem value={t.id} id={t.id} className="peer h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                <Label htmlFor={t.id} className="cursor-pointer peer-disabled:cursor-not-allowed">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={t.thumbnail} alt={t.name} />
                    <AvatarFallback>{t.name}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm font-medium leading-none">{t.name}</div>
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="button">Save</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );

  if (collapsed) {
    return (
      <div className="h-full w-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 border-r border-gray-200/50 shadow-xl flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="mb-4 p-2 hover:bg-white/50"
        >
          <FileText className="h-4 w-4" />
        </Button>
        <div className="space-y-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={action.action}
              className="p-2 hover:bg-white/50"
              title={action.label}
            >
              <action.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-80 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 border-r border-gray-200/50 shadow-xl">
      <div className="p-4 border-b border-gray-200/50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800">CV Builder</h2>
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="p-1 hover:bg-white/50"
            >
              <FileText className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-600">Customize your CV</p>
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isSaving ? 'Saving...' : 'Save CV'}
        </Button>
      </div>
      
      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-200/50">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-500" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={action.action}
              className={`bg-gradient-to-r ${action.gradient} ${action.className} text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 text-xs h-8`}
            >
              <action.icon className="h-3 w-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {renderSectionManagement()}

      <div className="p-4">
        {renderTemplateSelector()}
      </div>
    </div>
  );
};

export default BuilderSidebar;
