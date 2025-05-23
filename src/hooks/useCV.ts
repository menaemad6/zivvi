
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CVData } from '@/types/cv';
import { toast } from '@/hooks/use-toast';

export const useCV = (cvId: string | undefined) => {
  const [cvData, setCVData] = useState<CVData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (cvId && cvId !== 'new') {
      fetchCV();
    } else {
      setIsLoading(false);
    }
  }, [cvId]);

  const fetchCV = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('id', cvId)
        .single();

      if (error) throw error;

      // Safely parse the content as CVData
      setCVData(data.content as CVData);
    } catch (error: any) {
      toast({
        title: "Error loading CV",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveCV = async (data: CVData) => {
    if (!cvId || cvId === 'new') return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('cvs')
        .update({
          content: data as any, // Cast to any for Json compatibility
          updated_at: new Date().toISOString()
        })
        .eq('id', cvId);

      if (error) throw error;

      setCVData(data);
      toast({
        title: "CV Saved!",
        description: "Your changes have been saved successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error saving CV",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    cvData,
    setCVData,
    isLoading,
    isSaving,
    saveCV
  };
};
