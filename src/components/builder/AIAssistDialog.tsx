
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getGeminiResponse, parseAIResponse } from "@/utils/geminiApi";

// Define the types for the props
interface AIAssistDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAIDataGenerated: (sectionType: string, data: any) => void;
}

export function AIAssistDialog({ open, setOpen, onAIDataGenerated }: AIAssistDialogProps) {
  const [loading, setLoading] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [sectionType, setSectionType] = useState("about");

  const generateSectionPrompt = (type: string, userInput: string) => {
    switch (type) {
      case 'about':
        return `Based on the following information, generate a CV "About Me" section in JSON format with the following fields: name, role, email, phone, location, and summary.
        Include ONLY these fields in your response. User information: ${userInput}
        
        Format your response as valid JSON:
        \`\`\`json
        {
          "name": "...",
          "role": "...",
          "email": "...",
          "phone": "...",
          "location": "...",
          "summary": "..."
        }
        \`\`\``;

      case 'experience':
        return `Based on the following work experience information, generate a structured array of work experiences in JSON format.
        Each experience should include: company, role, period, and description.
        User information: ${userInput}
        
        Format your response as valid JSON array:
        \`\`\`json
        [
          {
            "company": "...",
            "role": "...",
            "period": "...",
            "description": "..."
          }
        ]
        \`\`\``;

      case 'education':
        return `Based on the following education information, generate a structured array of education entries in JSON format.
        Each entry should include: institution, degree, period, and description.
        User information: ${userInput}
        
        Format your response as valid JSON array:
        \`\`\`json
        [
          {
            "institution": "...",
            "degree": "...",
            "period": "...",
            "description": "..."
          }
        ]
        \`\`\``;

      case 'skills':
        return `Based on the following background information, extract a list of professional skills for a CV.
        Format your response as a JSON array of skill names.
        User information: ${userInput}
        
        Format your response as valid JSON array:
        \`\`\`json
        ["Skill 1", "Skill 2", "Skill 3", ...]
        \`\`\``;

      default:
        return `Generate CV content for ${type} section based on this information: ${userInput}`;
    }
  };

  const handleGenerate = async () => {
    if (!userPrompt.trim()) {
      toast({
        title: "Input required",
        description: "Please provide some information about yourself.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const prompt = generateSectionPrompt(sectionType, userPrompt);
      const aiResponse = await getGeminiResponse(prompt);
      const parsedData = parseAIResponse(aiResponse, sectionType);
      
      if (parsedData) {
        onAIDataGenerated(sectionType, parsedData);
        toast({
          title: "Success!",
          description: `Your ${sectionType} section has been generated.`,
        });
        setOpen(false);
      } else {
        toast({
          title: "Processing error",
          description: "Failed to process AI response. Please try again with more specific information.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("AI generation error:", error);
      toast({
        title: "AI Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> 
            AI CV Assistant
          </DialogTitle>
          <DialogDescription>
            Tell us about yourself, and our AI will help fill in your CV details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="section-type">CV Section</Label>
            <select 
              id="section-type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={sectionType}
              onChange={(e) => setSectionType(e.target.value)}
            >
              <option value="about">About Me</option>
              <option value="experience">Work Experience</option>
              <option value="education">Education</option>
              <option value="skills">Skills</option>
            </select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="user-prompt">Provide your details</Label>
            <Textarea
              id="user-prompt"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder={
                sectionType === 'about' 
                  ? "My name is Jane Smith, I'm a senior software engineer with 8 years of experience..." 
                  : sectionType === 'experience'
                  ? "I worked at Google as a Senior Developer from 2018-2022 where I led a team..."
                  : sectionType === 'education'
                  ? "I studied Computer Science at MIT from 2014-2018..."
                  : "I'm proficient in Python, JavaScript, React, and machine learning..."
              }
              className="min-h-[150px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
