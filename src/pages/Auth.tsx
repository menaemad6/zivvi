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
  
  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  // If user is logged in, redirect immediately
  if (!isLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }
  
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
                      CVBuilder
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
                <p className="text-gray-700 italic mb-3">"CVBuilder helped me land my dream job in just 2 weeks!"</p>
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
                    CVBuilder
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

</edits_to_apply>
