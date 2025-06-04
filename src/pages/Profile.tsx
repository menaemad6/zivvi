
import React, { useEffect, useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { OnboardingModal } from '@/components/profile/OnboardingModal';
import { useProfile } from '@/hooks/useProfile';
import { Skeleton } from '@/components/ui/skeleton';

const Profile = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const shouldShowOnboarding = searchParams.get('data') === 'true';
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const { profile, isLoading: profileLoading, updateProfile } = useProfile();

  useEffect(() => {
    if (shouldShowOnboarding && profile && !profile.onboarding_completed) {
      setShowOnboarding(true);
    }
  }, [shouldShowOnboarding, profile]);

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    return <Navigate to="/login" />;
  }

  if (authLoading || profileLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 px-4">
          <div className="max-w-4xl mx-auto">
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

  const handleOnboardingComplete = async (data: any) => {
    await updateProfile({
      profile_data: data,
      onboarding_completed: true,
      profile_completed: true
    });
    setShowOnboarding(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account and preferences</p>
          </div>
          
          <ProfileForm profile={profile} onUpdate={updateProfile} />
        </div>
      </div>
      
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
      
      <Footer />
    </>
  );
};

export default Profile;
