
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight, Shield, Zap, Heart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { LOGO_NAME, WEBSITE_URL } from "@/lib/constants";
const Auth = () => {
  const { user, isLoading, signIn, signUp } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(location.pathname === '/signup' ? 'signup' : 'login');
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  
  console.log('Auth page - user:', user?.id, 'isLoading:', isLoading);
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  // If user is logged in, show loading or redirect
  if (!isLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsFormLoading(true);
      console.log('Starting Google sign in');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;
      
      console.log('Google sign in initiated:', data);
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setIsFormLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormLoading(true);
    try {
      await signUp(email, password, fullName);
      // Redirect to profile page for onboarding
      navigate('/profile?data=true');
    } finally {
      setIsFormLoading(false);
    }
  };
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormLoading(true);
    try {
      await signIn(email, password);
      // After sign in, check onboarding status
      const {
        data: { user: currentUser },
        error: userError
      } = await supabase.auth.getUser();
      if (userError || !currentUser) {
        navigate('/dashboard');
        return;
      }
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', currentUser.id)
        .single();
      if (!profile || !profile.onboarding_completed) {
        navigate('/profile?data=true');
      } else {
        navigate('/dashboard');
      }
    } finally {
      setIsFormLoading(false);
    }
  };
  
  return (
    <>
    <Helmet>
        <title>{LOGO_NAME} | Login or Sign Up</title>
        <meta name="description" content="Log in or create a free account to start building your professional, AI-optimized CV in minutes." />
        <meta property="og:title" content="Login or Sign Up | {LOGO_NAME}" />
        <meta property="og:description" content="Log in or create a free account to start building your professional, AI-optimized CV in minutes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${WEBSITE_URL}/login`} />
        <meta property="og:image" content="/zivvi-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Login or Sign Up" />
        <meta name="twitter:description" content="Log in or create a free account to start building your professional, AI-optimized CV in minutes." />
        <meta name="twitter:image" content="/zivvi-logo.png" />
      </Helmet>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Enhanced Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full floating blur-2xl"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full floating blur-xl" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 left-1/4 w-28 h-28 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full floating blur-xl" style={{animationDelay: '4s'}}></div>
          <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full floating blur-2xl" style={{animationDelay: '1s'}}></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 left-1/2 w-24 h-24 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full floating blur-xl" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-1/3 left-1/6 w-20 h-20 bg-gradient-to-r from-yellow-400/15 to-orange-400/15 rounded-full floating blur-lg" style={{animationDelay: '5s'}}></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-20 relative z-10">
          {/* Enhanced Left Side - Welcome Content */}
          <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-8 xl:px-16">
            <div className="max-w-lg mx-auto lg:mx-0">
              <div className="mb-10 fade-in-up">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-xl">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                      <Heart className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                      {LOGO_NAME}
                    </h1>
                    <p className="text-gray-600 font-medium">Professional CV Creation Platform</p>
                  </div>
                </div>
                <h2 className="text-5xl xl:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                  Create Your
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Perfect CV
                  </span>
                </h2>
                <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                  Join thousands of professionals who've landed their dream jobs with our AI-powered CV builder. 
                  Create stunning, ATS-friendly resumes in minutes.
                </p>
              </div>

              <div className="space-y-6 fade-in-up stagger-1">
                <div className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-200">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Professional Templates</h3>
                    <p className="text-gray-600 text-sm">Designed by industry experts</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-200">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">AI-Powered Suggestions</h3>
                    <p className="text-gray-600 text-sm">Smart content recommendations</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-200">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">ATS-Optimized</h3>
                    <p className="text-gray-600 text-sm">Better visibility with employers</p>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg fade-in-up stagger-2">
                <p className="text-gray-700 italic mb-3">"{LOGO_NAME} helped me land my dream job in just 2 weeks!"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">Sarah Johnson</p>
                    <p className="text-xs text-gray-600">Software Engineer at Google</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Right Side - Auth Form */}
          <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0 lg:pl-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 sm:p-12 fade-in-up stagger-2">
              {/* Mobile Header */}
              <div className="lg:hidden text-center mb-10">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    {LOGO_NAME}
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">Create your perfect CV today</p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-10 bg-gray-100 p-1.5 rounded-2xl h-14">
                  <TabsTrigger 
                    value="signup" 
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200 text-base font-medium"
                  >
                    Sign Up
                  </TabsTrigger>
                  <TabsTrigger 
                    value="login"
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200 text-base font-medium"
                  >
                    Log In
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signup" className="space-y-8 mt-0">
                  {/* Google Sign Up Button */}
                  <Button 
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    className="w-full h-14 border-2 border-gray-200 hover:border-gray-300 rounded-2xl font-semibold text-base group transition-all duration-200 hover:shadow-lg bg-white/70 backdrop-blur-sm"
                    disabled={isFormLoading}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </div>
                  </Button>

                  <div className="relative flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-sm text-gray-500 bg-white/80">or</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-base font-semibold text-gray-700">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input 
                          id="name" 
                          placeholder="John Doe" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-12 h-14 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-2xl bg-white/70 backdrop-blur-sm text-base"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-base font-semibold text-gray-700">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="john.doe@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-12 h-14 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-2xl bg-white/70 backdrop-blur-sm text-base"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="password" className="text-base font-semibold text-gray-700">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-12 pr-12 h-14 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-2xl bg-white/70 backdrop-blur-sm text-base"
                          minLength={6}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <Button 
                      className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 rounded-2xl font-semibold text-base group transition-all duration-200 hover:shadow-xl hover:scale-105" 
                      type="submit" 
                      disabled={isFormLoading}
                    >
                      {isFormLoading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating Account...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          Create Account
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="login" className="space-y-8 mt-0">
                  {/* Google Sign In Button */}
                  <Button 
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    className="w-full h-14 border-2 border-gray-200 hover:border-gray-300 rounded-2xl font-semibold text-base group transition-all duration-200 hover:shadow-lg bg-white/70 backdrop-blur-sm"
                    disabled={isFormLoading}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </div>
                  </Button>

                  <div className="relative flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-sm text-gray-500 bg-white/80">or</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  <form onSubmit={handleSignIn} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="login-email" className="text-base font-semibold text-gray-700">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input 
                          id="login-email" 
                          type="email" 
                          placeholder="john.doe@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-12 h-14 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-2xl bg-white/70 backdrop-blur-sm text-base"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password" className="text-base font-semibold text-gray-700">Password</Label>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline">
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input 
                          id="login-password" 
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-12 pr-12 h-14 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-2xl bg-white/70 backdrop-blur-sm text-base"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <Button 
                      className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 rounded-2xl font-semibold text-base group transition-all duration-200 hover:shadow-xl hover:scale-105" 
                      type="submit" 
                      disabled={isFormLoading}
                    >
                      {isFormLoading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Logging in...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          Log In
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 leading-relaxed">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Auth;
