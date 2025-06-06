
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GripVertical, Edit2, Save, X } from 'lucide-react';
import { CustomSection } from '@/types/cv';
import { toast } from '@/hooks/use-toast';

interface CustomSectionManagerProps {
  sections: CustomSection[];
  onSectionsChange: (sections: CustomSection[]) => void;
}

export const CustomSectionManager: React.FC<CustomSectionManagerProps> = ({
  sections,
  onSectionsChange
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const createSection = () => {
    if (!newSectionTitle.trim()) {
      toast({
        title: "Error",
        description: "Section title is required",
        variant: "destructive"
      });
      return;
    }

    const newSection: CustomSection = {
      id: `custom_${Date.now()}`,
      title: newSectionTitle.trim(),
      type: 'custom',
      items: []
    };

    onSectionsChange([...sections, newSection]);
    setNewSectionTitle('');
    setIsCreating(false);
    
    toast({
      title: "Section Created",
      description: `"${newSection.title}" section has been created.`
    });
  };

  const deleteSection = (sectionId: string) => {
    const updatedSections = sections.filter(section => section.id !== sectionId);
    onSectionsChange(updatedSections);
    
    toast({
      title: "Section Deleted",
      description: "Custom section has been removed."
    });
  };

  const addItemToSection = (sectionId: string) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        const newItem = {
          id: `item_${Date.now()}`,
          content: 'New Item',
          description: ''
        };
        return {
          ...section,
          items: [...section.items, newItem]
        };
      }
      return section;
    });
    onSectionsChange(updatedSections);
  };

  const updateSectionTitle = (sectionId: string, newTitle: string) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return { ...section, title: newTitle };
      }
      return section;
    });
    onSectionsChange(updatedSections);
    setEditingSection(null);
  };

  const updateItem = (sectionId: string, itemId: string, content: string, description?: string) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.map(item => 
            item.id === itemId 
              ? { ...item, content, description: description || item.description }
              : item
          )
        };
      }
      return section;
    });
    onSectionsChange(updatedSections);
    setEditingItem(null);
  };

  const deleteItem = (sectionId: string, itemId: string) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.filter(item => item.id !== itemId)
        };
      }
      return section;
    });
    onSectionsChange(updatedSections);
  };

  const moveItem = (sectionId: string, fromIndex: number, toIndex: number) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        const newItems = [...section.items];
        const [removed] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, removed);
        return { ...section, items: newItems };
      }
      return section;
    });
    onSectionsChange(updatedSections);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Custom Sections</h3>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      {isCreating && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Input
                placeholder="Section title..."
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && createSection()}
              />
              <Button onClick={createSection} size="sm">
                <Save className="h-4 w-4" />
              </Button>
              <Button 
                onClick={() => {
                  setIsCreating(false);
                  setNewSectionTitle('');
                }} 
                variant="outline" 
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {sections.map((section) => (
        <Card key={section.id} className="bg-white border-purple-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              {editingSection === section.id ? (
                <div className="flex gap-2 flex-1">
                  <Input
                    defaultValue={section.title}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        updateSectionTitle(section.id, (e.target as HTMLInputElement).value);
                      }
                    }}
                    className="text-lg font-semibold"
                  />
                  <Button 
                    onClick={(e) => {
                      const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                      updateSectionTitle(section.id, input.value);
                    }}
                    size="sm"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <Badge variant="outline" className="bg-purple-100 text-purple-700">
                    Custom
                  </Badge>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addItemToSection(section.id)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteSection(section.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {section.items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg group"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', `${section.id}:${index}`);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const dragData = e.dataTransfer.getData('text/plain');
                    const [dragSectionId, dragIndex] = dragData.split(':');
                    if (dragSectionId === section.id) {
                      moveItem(section.id, parseInt(dragIndex), index);
                    }
                  }}
                >
                  <GripVertical className="h-4 w-4 text-gray-400 mt-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex-1">
                    {editingItem === item.id ? (
                      <div className="space-y-2">
                        <Input
                          defaultValue={item.content}
                          placeholder="Item content..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const content = (e.target as HTMLInputElement).value;
                              const description = (e.currentTarget.parentElement?.querySelector('textarea') as HTMLTextAreaElement)?.value || '';
                              updateItem(section.id, item.id, content, description);
                            }
                          }}
                        />
                        <Textarea
                          defaultValue={item.description}
                          placeholder="Description (optional)..."
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={(e) => {
                              const container = e.currentTarget.parentElement?.parentElement;
                              const content = (container?.querySelector('input') as HTMLInputElement).value;
                              const description = (container?.querySelector('textarea') as HTMLTextAreaElement).value;
                              updateItem(section.id, item.id, content, description);
                            }}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingItem(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-gray-900">{item.content}</p>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteItem(section.id, item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {section.items.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <p>No items yet. Click the + button to add items.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {sections.length === 0 && !isCreating && (
        <div className="text-center py-12 text-gray-500">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-200 to-pink-200 flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-lg font-medium mb-2">No custom sections yet</p>
          <p>Create custom sections to add personalized content to your CV</p>
        </div>
      )}
    </div>
  );
};
