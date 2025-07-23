
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Plus, FileText, MoreVertical, Edit, Copy, Trash2, Download, Eye, Calendar, Clock, Sparkles, TrendingUp, Zap, Users, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getTimeAgo } from '@/utils/timeUtils';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AnalyticsSection } from '@/components/analytics/AnalyticsSection';
import { LOGO_NAME, WEBSITE_URL } from "@/lib/constants";

interface CV {
  id: string;
  title: string;
  name: string | null;
  description: string | null;
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
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { trackEvent } = useAnalytics();
  const analyticsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Check onboarding status after login (for Google and email signups)
      (async () => {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();
        if (!profile || !profile.onboarding_completed) {
          navigate('/profile?data=true');
        } else {
          fetchCVsAndAnalytics();
        }
      })();
    }
  }, [user, navigate]);

  // Scroll to analytics section when showing analytics
  useEffect(() => {
    if (showAnalytics && analyticsRef.current) {
      analyticsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showAnalytics]);

  const fetchCVsAndAnalytics = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('id, title, name, description, template, created_at, updated_at')
        .eq('user_id', user!.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setCvs(data || []);
      const totalCVs = data?.length || 0;
      let viewsThisMonth = 0;
      let downloadsThisMonth = 0;
      if (data && data.length > 0) {
        // Get the first and last day of the current month
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        // Query analytics for all user's CVs
        const { data: analytics, error: analyticsError } = await supabase
          .from('cv_analytics')
          .select('action_type, timestamp, cv_id')
          .in('cv_id', data.map((cv: CV) => cv.id));
        if (analyticsError) throw analyticsError;
        // Filter for current month
        const filtered = (analytics || []).filter((event) => {
          const eventDate = new Date(event.timestamp);
          return eventDate >= firstDay && eventDate <= lastDay;
        });
        viewsThisMonth = filtered.filter((event) => event.action_type === 'view').length;
        downloadsThisMonth = filtered.filter((event) => event.action_type === 'download').length;
      }
      setStats({
        totalCVs,
        viewsThisMonth,
        downloadsThisMonth
      });
    } catch (error) {
      toast({
        title: "Error fetching CVs or analytics",
        description: (error as Error).message,
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

      fetchCVsAndAnalytics();
      toast({
        title: "CV Duplicated!",
        description: "A copy of your CV has been created."
      });
    } catch (error) {
      toast({
        title: "Error duplicating CV",
        description: (error as Error).message,
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

      fetchCVsAndAnalytics();
      toast({
        title: "CV Deleted",
        description: "Your CV has been deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Error deleting CV",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center pt-16">
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
      <Helmet>
        <title>{LOGO_NAME} | Dashboard</title>
        <meta name="description" content="Manage your CVs, track analytics, and access professional tools on your {LOGO_NAME} dashboard." />
        <meta property="og:title" content={`${LOGO_NAME} Dashboard`} />
        <meta property="og:description" content="Manage your CVs, track analytics, and access professional tools on your {LOGO_NAME} dashboard." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${WEBSITE_URL}/dashboard`} />
        <meta property="og:image" content="/templates/elegant-template.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="{LOGO_NAME} Dashboard | {WEBSITE_URL}" />
        <meta name="twitter:description" content="Manage your CVs, track analytics, and access professional tools on your {LOGO_NAME} dashboard." />
        <meta name="twitter:image" content="/templates/elegant-template.png" />
      </Helmet>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
        <div className="container mx-auto py-12 px-6">
          {/* Enhanced Hero Section */}
          <div className="text-center mb-12 sm:mb-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/20 shadow-xl">
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Ready to create something amazing? Your professional journey continues here.
              </p>
              <Button 
                onClick={() => navigate('/templates')} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto"
              >
                <Plus className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                Create New CV
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            <Card className="group hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:-translate-y-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total CVs</CardTitle>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.totalCVs}</div>
                <p className="text-sm text-gray-500 mt-1">Active CVs in your account</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:-translate-y-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Views This Month</CardTitle>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.viewsThisMonth}</div>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:-translate-y-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Downloads</CardTitle>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Download className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.downloadsThisMonth}</div>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-r from-orange-500 to-red-500 border-0 shadow-lg hover:-translate-y-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Success Rate</CardTitle>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Award className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">94%</div>
                <p className="text-sm text-white/80 mt-1">Interview callback rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* CVs List */}
            <div className="lg:col-span-2">
              {showAnalytics ? (
                <div ref={analyticsRef}><AnalyticsSection showAllCVs /></div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Your CVs</h2>
                    <Button 
                      onClick={() => navigate('/templates')} 
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      New CV
                    </Button>
                  </div>
                  {cvs.length === 0 ? (
                    <Card className="text-center py-16 bg-white/80 backdrop-blur-lg border-0 shadow-lg">
                      <CardContent>
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
                          <FileText className="h-12 w-12 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">No CVs yet</h3>
                        <p className="text-gray-600 mb-8 text-lg">Create your first professional CV to get started on your career journey</p>
                        <Button 
                          onClick={() => navigate('/templates')}
                        >
                          <Plus className="mr-3 h-6 w-6" />
                          Create Your First CV
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-6">
                      {cvs.map((cv) => (
                        <Card key={cv.id} className="group hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:-translate-y-1">
                          <CardContent className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg flex-shrink-0">
                                  {(cv.name || cv.title).charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 line-clamp-1">
                                    {cv.name || cv.title}
                                  </h3>
                                  {cv.description && (
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                      {cv.description}
                                    </p>
                                  )}
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                    <Badge className="capitalize bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 px-2 py-1 text-xs sm:text-sm w-fit">
                                      {cv.template}
                                    </Badge>
                                    <span className="flex items-center text-xs sm:text-sm text-gray-500">
                                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                      {getTimeAgo(cv.updated_at)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-end gap-2 sm:gap-3">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/preview/${cv.id}`)}
                                  className="border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 rounded-lg sm:rounded-xl h-8 sm:h-9 px-2 sm:px-3"
                                >
                                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => navigate(`/builder/${cv.id}`)}
                                >
                                  <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="hidden sm:inline">Edit</span>
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="border-2 border-gray-200 hover:border-gray-300 rounded-lg sm:rounded-xl h-8 sm:h-9 px-2 sm:px-3">
                                      <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-white border-0 shadow-xl rounded-xl">
                                    <DropdownMenuItem onClick={() => duplicateCV(cv)} className="hover:bg-gray-50 rounded-lg">
                                      <Copy className="mr-2 h-4 w-4" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => deleteCV(cv.id)}
                                      className="text-red-600 hover:bg-red-50 rounded-lg"
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
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <Zap className="mr-3 h-6 w-6 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-gray-600">Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent >
                    <Button
                      onClick={() => navigate('/templates')}
                      className="w-full justify-start mb-2"
                    >
                      <Plus className="mr-3 h-5 w-5" />
                      Create New CV
                    </Button>
                  <Button 
                    onClick={() => navigate('/profile')}
                    variant="outline"
                    className="w-full mb-2 justify-start border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-300"
                  >
                    <Users className="mr-3 h-5 w-5" />
                    Update Profile
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full mb-2 justify-start border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 rounded-xl transition-all duration-300"
                  >
                    <Download className="mr-3 h-5 w-5" />
                    Export All CVs
                  </Button>
                  <button
                    onClick={() => setShowAnalytics((v) => !v)}
                    className={
                      `w-full mb-2 justify-start flex items-center px-4 py-3 rounded-2xl transition-all duration-300
                      ${showAnalytics
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:from-orange-600 hover:to-red-600'
                        : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-orange-500 hover:bg-orange-50'}
                      font-bold text-base`}
                    style={{ boxShadow: showAnalytics ? '0 4px 24px 0 rgba(255, 94, 0, 0.15)' : undefined }}
                  >
                    <Eye className={`mr-3 h-5 w-5 ${showAnalytics ? 'text-white' : 'text-orange-500'}`} />
                    {showAnalytics ? 'Hide Analytics' : 'View Analytics'}
                  </button>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <Sparkles className="mr-3 h-6 w-6 text-purple-600" />
                    Pro Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mt-2 flex-shrink-0" />
                      <p className="text-gray-600 leading-relaxed">Use action verbs to make your experience stand out and capture attention</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mt-2 flex-shrink-0" />
                      <p className="text-gray-600 leading-relaxed">Keep your CV to 1-2 pages for better readability and impact</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mt-2 flex-shrink-0" />
                      <p className="text-gray-600 leading-relaxed">Customize your CV for each job application to increase success</p>
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
