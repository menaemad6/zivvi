
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// Icon components
const DragIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"></path>
    <path d="M14 18a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"></path>
    <path d="M14 12a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"></path>
    <path d="M6 12a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"></path>
    <path d="M22 12a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"></path>
  </svg>
);

const TemplateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
    <line x1="3" x2="21" y1="9" y2="9"></line>
    <line x1="9" x2="9" y1="21" y2="9"></line>
  </svg>
);

const ExportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" x2="12" y1="15" y2="3"></line>
  </svg>
);

// Feature card component
const FeatureCard = ({ title, description, icon }: { title: string, description: string, icon: React.ReactNode }) => (
  <div className="p-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow animate-fade-in">
    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 text-primary mb-4">
      {icon}
    </div>
    <h3 className="font-semibold text-xl mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

// Testimonial component
const Testimonial = ({ quote, author, role }: { quote: string, author: string, role: string }) => (
  <div className="p-6 glass-card">
    <p className="text-lg mb-4 italic text-foreground/90">"{quote}"</p>
    <div>
      <p className="font-semibold">{author}</p>
      <p className="text-sm text-muted-foreground">{role}</p>
    </div>
  </div>
);

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-24 relative bg-gradient-to-b from-background to-white">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.1]"></div>
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Build Your <span className="text-gradient">CV in Minutes</span>
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 mb-8">
                AI-powered, elegant, and export-ready.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="shadow-lg shadow-primary/20">
                    Start Building
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  See Templates
                </Button>
              </div>
            </div>

            {/* Mock-up Preview */}
            <div className="relative max-w-6xl mx-auto">
              <div className="shadow-2xl rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
                  alt="CV Builder Interface" 
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Powerful Features</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              Everything you need to create professional CVs that will impress recruiters.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                title="Drag & Drop Sections" 
                description="Easily arrange your CV sections in any order with our intuitive drag-and-drop editor."
                icon={<DragIcon />}
              />
              <FeatureCard 
                title="Pre-made Templates" 
                description="Choose from dozens of professionally designed templates to match your style and industry."
                icon={<TemplateIcon />}
              />
              <FeatureCard 
                title="Export to PDF" 
                description="Download your finished CV in high-quality PDF format, ready to share with employers."
                icon={<ExportIcon />}
              />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section-padding bg-muted">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">What Our Users Say</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              Join thousands of professionals who've built successful careers with our platform.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Testimonial
                quote="I landed my dream job within two weeks of using this CV builder. The templates are modern and truly stand out."
                author="Alex Johnson"
                role="Software Engineer"
              />
              <Testimonial
                quote="As someone who struggles with design, this tool was a lifesaver. Simple to use and produces professional results."
                author="Sarah Williams"
                role="Marketing Manager"
              />
              <Testimonial
                quote="The AI suggestions helped me emphasize my achievements in ways I hadn't thought of. Highly recommended!"
                author="Michael Chen"
                role="Project Manager"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Create Your <span className="text-gradient">Standout CV</span>?
            </h2>
            <p className="text-xl text-foreground/80 mb-8">
              Join thousands of job seekers who have successfully landed their dream jobs.
            </p>
            <Link to="/signup">
              <Button size="lg" className="shadow-lg shadow-primary/20">
                Get Started — It's Free
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
