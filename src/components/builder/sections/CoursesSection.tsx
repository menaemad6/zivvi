
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { CVData } from '@/types/cv';

interface CoursesSectionProps {
  courses: CVData['courses'];
  onUpdate: (courses: CVData['courses']) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ courses, onUpdate }) => {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const addCourse = () => {
    const newCourse = {
      id: Date.now().toString(),
      name: '',
      provider: '',
      completionDate: '',
      certificateUrl: '',
      description: ''
    };
    onUpdate([...courses, newCourse]);
    setExpandedCourse(newCourse.id);
  };

  const updateCourse = (id: string, field: keyof CVData['courses'][0], value: string) => {
    const updated = courses.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    );
    onUpdate(updated);
  };

  const deleteCourse = (id: string) => {
    onUpdate(courses.filter(course => course.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Courses</h3>
        <Button onClick={addCourse} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </div>
      
      {courses.map((course) => (
        <Card key={course.id} className="border border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {course.name || 'New Course'}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteCourse(course.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`course-name-${course.id}`}>Course Name</Label>
                <Input
                  id={`course-name-${course.id}`}
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                  placeholder="e.g., Advanced React Development"
                />
              </div>
              <div>
                <Label htmlFor={`course-provider-${course.id}`}>Provider</Label>
                <Input
                  id={`course-provider-${course.id}`}
                  value={course.provider}
                  onChange={(e) => updateCourse(course.id, 'provider', e.target.value)}
                  placeholder="e.g., Coursera, Udemy"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`course-completion-${course.id}`}>Completion Date</Label>
                <Input
                  id={`course-completion-${course.id}`}
                  type="date"
                  value={course.completionDate}
                  onChange={(e) => updateCourse(course.id, 'completionDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`course-certificate-${course.id}`}>Certificate URL (Optional)</Label>
                <Input
                  id={`course-certificate-${course.id}`}
                  value={course.certificateUrl || ''}
                  onChange={(e) => updateCourse(course.id, 'certificateUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor={`course-description-${course.id}`}>Description (Optional)</Label>
              <Textarea
                id={`course-description-${course.id}`}
                value={course.description || ''}
                onChange={(e) => updateCourse(course.id, 'description', e.target.value)}
                placeholder="Brief description of what you learned..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      ))}
      
      {courses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No courses added yet. Click "Add Course" to get started.</p>
        </div>
      )}
    </div>
  );
};
