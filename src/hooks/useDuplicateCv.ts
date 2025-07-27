import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface CV {
  id: string;
  title: string;
  name: string | null;
  description: string | null;
  template: string;
  created_at: string;
  updated_at: string;
}

const duplicateCvFunc = async (cv: CV, user): Promise<string | null> => {
  try {
    const { data: originalCV } = await supabase
      .from('cvs')
      .select('content')
      .eq('id', cv.id)
      .single();

    const hasName = cv.name && cv.name.length > 0;

    const { data, error } = await supabase
      .from('cvs')
      .insert({
        user_id: user!.id,
        title: `${cv.title} (Copy)`,
        template: cv.template,
        content: originalCV?.content || {},
        name: hasName ? `${cv.name} (Copy)` : null,
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "CV Duplicated!",
      description: "A copy of your CV has been created."
    });
    
    return data.id; // Return the new CV ID for navigation
  } catch (error) {
    toast({
      title: "Error duplicating CV",
      description: (error as Error).message,
      variant: "destructive"
    });
    return null;
  } 
};

const useDuplicateCV = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const duplicateCv = async (cv: CV) => {
    const newCvId = await duplicateCvFunc(cv, user);
    if (newCvId) {
      // Navigate to the builder page with the new CV ID
      navigate(`/builder/${newCvId}`);
    }
  }
  
  return { duplicateCv }
}

export { useDuplicateCV };

