
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wand2, Loader2 } from "lucide-react";
import { getGeminiResponse } from "@/utils/geminiApi";
import { toast } from "@/hooks/use-toast";

interface AIGenerateButtonProps {
  onGenerated: (text: string) => void;
  prompt: string;
  type: 'description' | 'summary';
  size?: 'sm' | 'default';
  disabled?: boolean;
}

export const AIGenerateButton = ({ onGenerated, prompt, type, size = 'sm', disabled }: AIGenerateButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in the required fields first to generate content.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await getGeminiResponse(prompt);
      
      // Clean up the response - remove quotes and extra formatting
      const cleanText = response
        .replace(/^["']|["']$/g, '')
        .replace(/^\*\*|\*\*$/g, '')
        .trim();
      
      onGenerated(cleanText);
      
      toast({
        title: "Content Generated!",
        description: `AI-generated ${type} has been added.`
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      onClick={handleGenerate}
      disabled={disabled || isGenerating}
      className="border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-700"
    >
      {isGenerating ? (
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
      ) : (
        <Wand2 className="h-3 w-3 mr-1" />
      )}
      AI Generate
    </Button>
  );
};
