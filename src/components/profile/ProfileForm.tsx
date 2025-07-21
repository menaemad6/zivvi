
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Briefcase } from 'lucide-react';

interface ProfileFormProps {
  profile: any;
  onUpdate: (updates: any) => Promise<boolean>;
  onEditProfessionalInfo: () => void;
}

export const ProfileForm = ({ profile, onUpdate, onEditProfessionalInfo }: ProfileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || ''
  });

  const handleSave = async () => {
    const success = await onUpdate(formData);
    if (success) {
      setIsEditing(false);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      full_name: profile?.full_name || '',
      email: profile?.email || '',
    });
  };

  const profileData = profile?.profile_data || {};

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Your basic account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      {profileData && Object.keys(profileData).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Professional Information
            </CardTitle>
            <CardDescription>
              Information collected during onboarding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profileData.industry && (
              <div>
                <Label className="text-sm font-medium text-gray-700">Industry</Label>
                <p className="text-gray-900">{profileData.industry}</p>
              </div>
            )}
            
            {profileData.experience_level && (
              <div>
                <Label className="text-sm font-medium text-gray-700">Experience Level</Label>
                <Badge variant="secondary">{profileData.experience_level}</Badge>
              </div>
            )}
            
            {profileData.job_title && (
              <div>
                <Label className="text-sm font-medium text-gray-700">Current Job Title</Label>
                <p className="text-gray-900">{profileData.job_title}</p>
              </div>
            )}
            
            {profileData.skills && profileData.skills.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-700">Skills</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profileData.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {profileData.career_goals && (
              <div>
                <Label className="text-sm font-medium text-gray-700">Career Goals</Label>
                <p className="text-gray-900">{profileData.career_goals}</p>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={onEditProfessionalInfo}>
                Edit Professional Info
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Onboarding Status</p>
              <p className="text-sm text-gray-600">
                {profile?.onboarding_completed ? 'Completed' : 'Pending'}
              </p>
            </div>
            <Badge variant={profile?.onboarding_completed ? 'default' : 'secondary'}>
              {profile?.onboarding_completed ? 'Complete' : 'Incomplete'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
