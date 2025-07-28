
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { CVData } from '@/types/cv';

interface LanguagesSectionProps {
  languages: CVData['languages'];
  onUpdate: (languages: CVData['languages']) => void;
}

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({ languages, onUpdate }) => {
  const [expandedLanguage, setExpandedLanguage] = useState<string | null>(null);

  const proficiencyLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'native', label: 'Native' }
  ];

  const addLanguage = () => {
    const newLanguage = {
      id: Date.now().toString(),
      language: '',
      proficiency: 'intermediate' as const,
      description: ''
    };
    onUpdate([...languages, newLanguage]);
    setExpandedLanguage(newLanguage.id);
  };

  const updateLanguage = (id: string, field: keyof CVData['languages'][0], value: string) => {
    const updated = languages.map(language => 
      language.id === id ? { ...language, [field]: value } : language
    );
    onUpdate(updated);
  };

  const deleteLanguage = (id: string) => {
    onUpdate(languages.filter(language => language.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Languages</h3>
        <Button onClick={addLanguage} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Language
        </Button>
      </div>
      
      {languages.map((language) => (
        <Card key={language.id} className="border border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {language.language || 'New Language'}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteLanguage(language.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`lang-name-${language.id}`}>Language</Label>
                <Input
                  id={`lang-name-${language.id}`}
                  value={language.language}
                  onChange={(e) => updateLanguage(language.id, 'language', e.target.value)}
                  placeholder="e.g., English, Spanish, French"
                />
              </div>
              <div>
                <Label htmlFor={`lang-proficiency-${language.id}`}>Proficiency Level</Label>
                <Select
                  value={language.proficiency}
                  onValueChange={(value) => updateLanguage(language.id, 'proficiency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select proficiency level" />
                  </SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor={`lang-description-${language.id}`}>Description (Optional)</Label>
              <Textarea
                id={`lang-description-${language.id}`}
                value={language.description || ''}
                onChange={(e) => updateLanguage(language.id, 'description', e.target.value)}
                placeholder="Additional details about your language skills..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      ))}
      
      {languages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No languages added yet. Click "Add Language" to get started.</p>
        </div>
      )}
    </div>
  );
};
