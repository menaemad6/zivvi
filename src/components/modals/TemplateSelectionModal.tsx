
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Palette, Sparkles } from 'lucide-react';
import { cvTemplates } from '@/data/templates';
import { CVTemplate } from '@/types/cv';
import { toast } from '@/hooks/use-toast';

interface TemplateSelectionModalProps {
  open: boolean;
  onClose: () => void;
  currentTemplate: string;
  onTemplateChange: (templateId: string, templateName: string) => void;
}

const TemplateSelectionModal: React.FC<TemplateSelectionModalProps> = ({
  open,
  onClose,
  currentTemplate,
  onTemplateChange
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(currentTemplate);
  const [isChanging, setIsChanging] = useState(false);

  const handleTemplateSelect = (template: CVTemplate) => {
    setSelectedTemplate(template.id);
  };

  const handleApplyTemplate = async () => {
    if (selectedTemplate === currentTemplate) {
      toast({
        title: "No Changes",
        description: "You've selected the same template that's already in use."
      });
      return;
    }

    setIsChanging(true);
    try {
      const template = cvTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        await onTemplateChange(selectedTemplate, template.name);
        toast({
          title: "Template Changed!",
          description: `Your CV template has been updated to ${template.name}.`
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change template. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsChanging(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'modern': return 'bg-blue-100 text-blue-800';
      case 'classic': return 'bg-green-100 text-green-800';
      case 'creative': return 'bg-purple-100 text-purple-800';
      case 'minimal': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Change Template
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                Select a new template for your CV
              </p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cvTemplates.map((template) => (
              <div
                key={template.id}
                className={`relative group cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                  selectedTemplate === template.id
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                {/* Selection indicator */}
                {selectedTemplate === template.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center z-10">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Current template indicator */}
                {currentTemplate === template.id && (
                  <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-green-500 text-white">
                      Current
                    </Badge>
                  </div>
                )}

                {/* Template thumbnail */}
                <div className="aspect-[3/4] bg-gray-100 rounded-t-xl overflow-hidden">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Template info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {template.description}
                  </p>
                  
                  {/* Template features */}
                  {template.options && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.options.hasFont && (
                        <Badge variant="outline" className="text-xs">
                          Font Options
                        </Badge>
                      )}
                      {template.options.hasPrimaryColor && (
                        <Badge variant="outline" className="text-xs">
                          Color Themes
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-6 pt-0 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {selectedTemplate !== currentTemplate ? (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>Template will be changed and CV renamed</span>
                </div>
              ) : (
                <span>Select a different template to make changes</span>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isChanging}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplyTemplate}
                disabled={selectedTemplate === currentTemplate || isChanging}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isChanging ? 'Applying...' : 'Apply Template'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelectionModal;
