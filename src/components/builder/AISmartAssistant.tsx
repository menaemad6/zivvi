
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Wand2 } from 'lucide-react';
import { CVData } from '@/types/cv';
import { getGeminiResponse, parseAIResponse } from '@/utils/geminiApi';
import { OnboardingModal } from '@/components/profile/OnboardingModal';

interface AISmartAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  onUpdateCV: (data: CVData) => void;
}

const AISmartAssistant: React.FC<AISmartAssistantProps> = ({ 
  isOpen, 
  onClose, 
  cvData, 
  onUpdateCV 
}) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await getGeminiResponse(prompt);
      const parsedData = parseAIResponse(response, 'general');
      
      // Update CV with generated content
      const updatedCV: CVData = {
        ...cvData,
        designOptions: cvData.designOptions || {
          primaryColor: '',
          secondaryColor: '',
          font: 'inter'
        },
        personalInfo: {
          ...cvData.personalInfo,
          title: cvData.personalInfo.title || '',
          personal_website: cvData.personalInfo.personal_website || '',
          linkedin: cvData.personalInfo.linkedin || '',
          github: cvData.personalInfo.github || ''
        }
      };
      
      if (parsedData) {
        onUpdateCV(updatedCV);
      }
      
      onClose();
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              AI Smart Assistant
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt">What would you like to generate?</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to generate or improve in your CV..."
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={!prompt.trim() || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={async () => {}}
        continueDemo={() => setShowOnboarding(false)}
      />
    </>
  );
};

export default AISmartAssistant;
