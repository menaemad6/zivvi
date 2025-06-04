
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface CVSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvId: string;
  currentName: string;
  currentDescription: string;
  onUpdate?: (name: string, description: string) => Promise<boolean>;
}

export const CVSettingsModal = ({ 
  isOpen, 
  onClose, 
  cvId, 
  currentName, 
  currentDescription, 
  onUpdate 
}: CVSettingsModalProps) => {
  const [name, setName] = useState(currentName);
  const [description, setDescription] = useState(currentDescription);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setDescription(currentDescription);
    }
  }, [isOpen, currentName, currentDescription]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (onUpdate) {
        const success = await onUpdate(name, description);
        if (success) {
          onClose();
        }
      } else {
        // Fallback to direct Supabase call
        const { error } = await supabase
          .from('cvs')
          .update({
            name: name,
            description: description,
            updated_at: new Date().toISOString()
          })
          .eq('id', cvId);

        if (error) throw error;

        toast({
          title: "CV Updated",
          description: "Your CV details have been saved successfully."
        });
        onClose();
      }
    } catch (error: any) {
      console.error('Error updating CV:', error);
      toast({
        title: "Error",
        description: "Failed to update CV details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this CV? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('id', cvId);

      if (error) throw error;

      toast({
        title: "CV Deleted",
        description: "Your CV has been deleted successfully."
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error deleting CV:', error);
      toast({
        title: "Error",
        description: "Failed to delete CV.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>CV Settings</DialogTitle>
          <DialogDescription>
            Edit your CV details or delete this CV.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="cv-name">CV Name</Label>
            <Input
              id="cv-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter CV name"
            />
          </div>
          
          <div>
            <Label htmlFor="cv-description">Description</Label>
            <Textarea
              id="cv-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter CV description"
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Deleting...' : 'Delete CV'}
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
