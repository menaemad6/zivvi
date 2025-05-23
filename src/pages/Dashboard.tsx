import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, FileText, MoreVertical, Edit, Copy, Trash2, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CV {
  id: string;
  title: string;
  template: string;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchCVs();
    }
  }, [user, navigate]);

  const fetchCVs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCvs(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching CVs",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const duplicateCV = async (cv: CV) => {
    try {
      const { data: originalCV } = await supabase
        .from('cvs')
        .select('content')
        .eq('id', cv.id)
        .single();

      const { data, error } = await supabase
        .from('cvs')
        .insert({
          user_id: user!.id,
          title: `${cv.title} (Copy)`,
          template: cv.template,
          content: originalCV?.content || {}
        })
        .select()
        .single();

      if (error) throw error;

      fetchCVs();
      toast({
        title: "CV Duplicated!",
        description: "A copy of your CV has been created."
      });
    } catch (error: any) {
      toast({
        title: "Error duplicating CV",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteCV = async (cvId: string) => {
    try {
      const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('id', cvId);

      if (error) throw error;

      fetchCVs();
      toast({
        title: "CV Deleted",
        description: "Your CV has been deleted successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error deleting CV",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My CVs</h1>
            <p className="text-lg text-gray-600">
              Welcome back, {user?.user_metadata?.full_name || user?.email}!
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New CV Card */}
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent 
              className="flex flex-col items-center justify-center h-48 text-center"
              onClick={() => navigate('/templates')}
            >
              <Plus className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Create New CV</h3>
              <p className="text-sm text-gray-500">Choose from our professional templates</p>
            </CardContent>
          </Card>

          {/* Existing CVs */}
          {cvs.map((cv) => (
            <Card key={cv.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{cv.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {cv.template}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/builder/${cv.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateCV(cv)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteCV(cv.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Created: {new Date(cv.created_at).toLocaleDateString()}
                  <br />
                  Updated: {new Date(cv.updated_at).toLocaleDateString()}
                </CardDescription>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => navigate(`/builder/${cv.id}`)}
                    className="flex-1"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/preview?id=${cv.id}`)}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {cvs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No CVs yet</h3>
            <p className="text-gray-500 mb-6">Create your first professional CV to get started</p>
            <Button onClick={() => navigate('/templates')}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First CV
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
