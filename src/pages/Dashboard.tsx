
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// Mock data for CV list
const cvs = [
  { 
    id: '1', 
    title: 'Software Developer CV', 
    lastUpdated: '2 days ago', 
    template: 'Modern',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
  },
  { 
    id: '2', 
    title: 'Marketing Specialist CV', 
    lastUpdated: '1 week ago',
    template: 'Classic',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
  },
  { 
    id: '3', 
    title: 'UX Designer Portfolio', 
    lastUpdated: 'Just now',
    template: 'Minimal',
    thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7'
  }
];

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
  return (
    <>
      <Navbar />
      <main className="min-h-screen py-24 px-6 md:px-12 lg:px-24 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
              <p className="text-muted-foreground">Manage your CVs and create new ones.</p>
            </div>
            <Link to="/builder/new">
              <Button className="mt-4 md:mt-0">
                <PlusIcon />
                <span className="ml-2">Create New CV</span>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map((cv) => (
              <Card key={cv.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img 
                    src={cv.thumbnail}
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
                  <p className="text-sm text-muted-foreground">Last updated: {cv.lastUpdated}</p>
                </CardContent>
                <CardFooter className="flex justify-between gap-2 border-t pt-4">
                  <Link to={`/builder/${cv.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <EditIcon />
                      <span className="ml-2">Edit</span>
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon">
                    <DuplicateIcon />
                  </Button>
                  <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10">
                    <DeleteIcon />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;
