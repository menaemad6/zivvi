
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Plus, FileText, MoreVertical, Edit, Copy, Trash2, Download, Eye, Calendar, Clock, Sparkles, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CV {
  id: string;
  title: string;
  template: string;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCVs: 0,
    viewsThisMonth: 0,
    downloadsThisMonth: 0
  });

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
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setCvs(data || []);
      setStats({
        totalCVs: data?.length || 0,
        viewsThisMonth: Math.floor(Math.random() * 100) + 50,
        downloadsThisMonth: Math.floor(Math.random() * 50) + 20
      });
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
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto py-8 px-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
              <Button onClick={() => navigate('/templates')} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create New CV
              </Button>
            </div>
            <p className="text-lg text-gray-600">
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}! 👋
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total CVs</CardTitle>
                <FileText className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.totalCVs}</div>
                <p className="text-xs text-gray-500">Active CVs in your account</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Views This Month</CardTitle>
                <Eye className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.viewsThisMonth}</div>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Downloads</CardTitle>
                <Download className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.downloadsThisMonth}</div>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
                <Sparkles className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">94%</div>
                <p className="text-xs text-blue-600">Interview callback rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CVs List */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Your CVs</h2>
                <Button variant="outline" onClick={() => navigate('/templates')} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Plus className="mr-2 h-4 w-4" />
                  New CV
                </Button>
              </div>

              {cvs.length === 0 ? (
                <Card className="text-center py-12 bg-white border border-gray-200">
                  <CardContent>
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">No CVs yet</h3>
                    <p className="text-gray-600 mb-6">Create your first professional CV to get started</p>
                    <Button onClick={() => navigate('/templates')} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First CV
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {cvs.map((cv) => (
                    <Card key={cv.id} className="hover:shadow-lg transition-all duration-200 group bg-white border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {cv.title.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">{cv.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <Badge variant="secondary" className="capitalize bg-gray-100 text-gray-700">
                                  {cv.template}
                                </Badge>
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {getTimeAgo(cv.updated_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/preview?id=${cv.id}`)}
                              className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => navigate(`/builder/${cv.id}`)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-100">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white border border-gray-200">
                                <DropdownMenuItem onClick={() => duplicateCV(cv)} className="text-gray-700 hover:bg-gray-50">
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => deleteCV(cv.id)}
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions Sidebar */}
            <div className="space-y-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Quick Actions</CardTitle>
                  <CardDescription className="text-gray-600">Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => navigate('/templates')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New CV
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => navigate('/profile')}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Update Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Download className="mr-2 h-4 w-4" />
                    Export All CVs
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Tips & Tricks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <p className="text-gray-600">Use action verbs to make your experience stand out</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                      <p className="text-gray-600">Keep your CV to 1-2 pages for better readability</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                      <p className="text-gray-600">Customize your CV for each job application</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
