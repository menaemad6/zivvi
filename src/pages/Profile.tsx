
import React, { useEffect, useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { OnboardingModal } from '@/components/profile/OnboardingModal';
import { useProfile } from '@/hooks/useProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Calendar, MapPin, Briefcase, Shield, Settings, Edit3, Camera, Eye, Download, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { LOGO_NAME, WEBSITE_URL } from "@/lib/constants";
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const shouldShowOnboarding = searchParams.get('data') === 'true';
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [stats, setStats] = useState({
    totalCVs: 0,
    viewsThisMonth: 0,
    downloadsThisMonth: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  const { profile, isLoading: profileLoading, updateProfile } = useProfile();

  console.log('Profile page - user:', user?.id, 'shouldShowOnboarding:', shouldShowOnboarding, 'profile:', profile);

  useEffect(() => {
    if (shouldShowOnboarding && profile && profile.onboarding_completed === false) {
      setShowOnboarding(true);
    } else if (shouldShowOnboarding && profile && profile.onboarding_completed == null) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [shouldShowOnboarding, profile]);
  
  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    setIsLoadingStats(true);
    try {
      // Fetch user's CVs
      const { data: cvData, error: cvError } = await supabase
        .from('cvs')
        .select('id')
        .eq('user_id', user.id);

      if (cvError) throw cvError;
      
      const totalCVs = cvData?.length || 0;
      let viewsThisMonth = 0;
      let downloadsThisMonth = 0;

      if (cvData && cvData.length > 0) {
        // Get the first and last day of the current month
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        // Query analytics for all user's CVs
        const { data: analytics, error: analyticsError } = await supabase
          .from('cv_analytics')
          .select('action_type, timestamp, cv_id')
          .in('cv_id', cvData.map(cv => cv.id));
          
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
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  if (!authLoading && !user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (authLoading || profileLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleOnboardingComplete = async (data: Record<string, unknown>) => {
    console.log('Onboarding completed with data:', data);
    await updateProfile({
      profile_data: data,
      onboarding_completed: true,
      profile_completed: true
    });
    setShowOnboarding(false);
  };

  const userInitials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : profile?.email?.charAt(0).toUpperCase() || 'U';

  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  }) : 'Unknown';

  return (
    <>
      <Helmet>
        <title>{LOGO_NAME} | Profile</title>
        <meta name="description" content="Manage your profile, update your information, and track your CV stats on {WEBSITE_URL}." />
        <meta property="og:title" content="{LOGO_NAME} | Profile" />
        <meta property="og:description" content="Manage your profile, update your information, and track your CV stats on {WEBSITE_URL}." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-website-url.com/profile" />
        <meta property="og:image" content="/zivvi-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="{LOGO_NAME} | Profile" />
        <meta name="twitter:description" content="Manage your profile, update your information, and track your CV stats on {WEBSITE_URL}." />
        <meta name="twitter:image" content="/zivvi-logo.png" />
      </Helmet>
      <Navbar />
      <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
                  <AvatarFallback className="text-4xl font-bold bg-white text-gray-800">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 bg-white text-gray-800 hover:bg-gray-100 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  {profile?.full_name || profile?.email?.split('@')[0] || 'Your Profile'}
                </h1>
                <p className="text-xl text-blue-100 mb-4 flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-5 h-5" />
                  {profile?.email}
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined {joinDate}
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-100 border-green-300/30 backdrop-blur-sm">
                    <Shield className="w-4 h-4 mr-2" />
                    Verified Account
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Stats */}
            <div className="space-y-6">
              <Card className="bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <User className="w-5 h-5 text-blue-600" />
                    Profile Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingStats ? (
                    <div className="space-y-4">
                      <Skeleton className="h-12 w-full rounded-lg" />
                      <Skeleton className="h-12 w-full rounded-lg" />
                      <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-700 font-medium">CVs Created</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">{stats.totalCVs}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700 font-medium">Views This Month</span>
                        </div>
                        <span className="text-2xl font-bold text-green-600">{stats.viewsThisMonth}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Download className="w-4 h-4 text-purple-600" />
                          <span className="text-gray-700 font-medium">Downloads This Month</span>
                        </div>
                        <span className="text-2xl font-bold text-purple-600">{stats.downloadsThisMonth}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* <Card className="bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Settings className="w-5 h-5 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </CardContent>
              </Card> */}
            </div>

            {/* Main Profile Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-blue-600" />
                    Profile Settings
                  </CardTitle>
                  <p className="text-gray-600">Manage your account information and preferences</p>
                </CardHeader>
                <CardContent className="p-6">
                  <ProfileForm 
                    profile={profile} 
                    onUpdate={updateProfile}
                    onEditProfessionalInfo={() => setShowOnboarding(true)}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
        initialData={profile?.profile_data}
        continueDemo={shouldShowOnboarding}
      />
      
      <Footer />
    </>
  );
};

export default Profile;
