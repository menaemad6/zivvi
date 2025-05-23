
import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Types for CV data
interface CV {
  id: string;
  title: string;
  template: string;
  updated_at: string;
  thumbnail_url: string | null;
}

// Icons
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14"></path>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const DuplicateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="8" width="12" height="12" rx="2" ry="2"></rect>
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path>
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [fetchingCvs, setFetchingCvs] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        setProfile(profileData);
        
        // Fetch user's CVs
        const { data: cvsData, error: cvsError } = await supabase
          .from('cvs')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
          
        if (cvsError) throw cvsError;
        setCvs(cvsData || []);
      } catch (error: any) {
        toast({
          title: "Error fetching data",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setFetchingCvs(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      return `${Math.floor(diffInDays / 7)} ${Math.floor(diffInDays / 7) === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleDeleteCV = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setCvs(cvs.filter(cv => cv.id !== id));
      toast({
        title: "CV deleted",
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

  const handleDuplicateCV = async (cv: CV) => {
    try {
      const { data, error } = await supabase
        .from('cvs')
        .insert({
          title: `${cv.title} (Copy)`,
          template: cv.template,
          user_id: user?.id,
          content: {}, // You would want to fetch and copy the content here
          thumbnail_url: cv.thumbnail_url
        })
        .select();
        
      if (error) throw error;
      
      if (data) {
        setCvs([data[0], ...cvs]);
        toast({
          title: "CV duplicated",
          description: "Your CV has been duplicated successfully."
        });
      }
    } catch (error: any) {
      toast({
        title: "Error duplicating CV",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // If user is not logged in, redirect to login page
  if (!user && !isLoading) {
    return <Navigate to="/login" />;
  }

  // Default fallback images for CV thumbnails
  const defaultThumbnails = [
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7'
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-24 px-6 md:px-12 lg:px-24 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'User'}!
              </h1>
              <p className="text-muted-foreground">Manage your CVs and create new ones.</p>
            </div>
            <Link to="/builder/new">
              <Button className="mt-4 md:mt-0">
                <PlusIcon />
                <span className="ml-2">Create New CV</span>
              </Button>
            </Link>
          </div>

          {fetchingCvs ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : cvs.length === 0 ? (
            <div className="text-center py-16 space-y-6">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">No CVs Found</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                You haven't created any CVs yet. Get started by creating your first CV.
              </p>
              <Link to="/builder/new">
                <Button>
                  <PlusIcon />
                  <span className="ml-2">Create Your First CV</span>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvs.map((cv, index) => (
                <Card key={cv.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    <img 
                      src={cv.thumbnail_url || defaultThumbnails[index % defaultThumbnails.length]}
                      alt={cv.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                      <div className="p-4">
                        <p className="text-white text-sm font-semibold">{cv.template} Template</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-xl mb-1">{cv.title}</h3>
                    <p className="text-sm text-muted-foreground">Last updated: {formatDate(cv.updated_at)}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2 border-t pt-4">
                    <Link to={`/builder/${cv.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <EditIcon />
                        <span className="ml-2">Edit</span>
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDuplicateCV(cv)}
                    >
                      <DuplicateIcon />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteCV(cv.id)}
                    >
                      <DeleteIcon />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;
