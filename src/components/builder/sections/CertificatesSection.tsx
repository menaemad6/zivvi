
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { CVData } from '@/types/cv';

interface CertificatesSectionProps {
  certificates: CVData['certificates'];
  onUpdate: (certificates: CVData['certificates']) => void;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({ certificates, onUpdate }) => {
  const [expandedCertificate, setExpandedCertificate] = useState<string | null>(null);

  const addCertificate = () => {
    const newCertificate = {
      id: Date.now().toString(),
      name: '',
      issuingOrganization: '',
      issueDate: '',
      expirationDate: '',
      certificateUrl: '',
      description: ''
    };
    onUpdate([...certificates, newCertificate]);
    setExpandedCertificate(newCertificate.id);
  };

  const updateCertificate = (id: string, field: keyof CVData['certificates'][0], value: string) => {
    const updated = certificates.map(certificate => 
      certificate.id === id ? { ...certificate, [field]: value } : certificate
    );
    onUpdate(updated);
  };

  const deleteCertificate = (id: string) => {
    onUpdate(certificates.filter(certificate => certificate.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Certificates</h3>
        <Button onClick={addCertificate} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Certificate
        </Button>
      </div>
      
      {certificates.map((certificate) => (
        <Card key={certificate.id} className="border border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {certificate.name || 'New Certificate'}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteCertificate(certificate.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`cert-name-${certificate.id}`}>Certificate Name</Label>
                <Input
                  id={`cert-name-${certificate.id}`}
                  value={certificate.name}
                  onChange={(e) => updateCertificate(certificate.id, 'name', e.target.value)}
                  placeholder="e.g., AWS Certified Developer"
                />
              </div>
              <div>
                <Label htmlFor={`cert-org-${certificate.id}`}>Issuing Organization</Label>
                <Input
                  id={`cert-org-${certificate.id}`}
                  value={certificate.issuingOrganization}
                  onChange={(e) => updateCertificate(certificate.id, 'issuingOrganization', e.target.value)}
                  placeholder="e.g., Amazon Web Services"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`cert-issue-${certificate.id}`}>Issue Date</Label>
                <Input
                  id={`cert-issue-${certificate.id}`}
                  type="date"
                  value={certificate.issueDate}
                  onChange={(e) => updateCertificate(certificate.id, 'issueDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`cert-expiry-${certificate.id}`}>Expiration Date (Optional)</Label>
                <Input
                  id={`cert-expiry-${certificate.id}`}
                  type="date"
                  value={certificate.expirationDate || ''}
                  onChange={(e) => updateCertificate(certificate.id, 'expirationDate', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor={`cert-url-${certificate.id}`}>Certificate URL (Optional)</Label>
              <Input
                id={`cert-url-${certificate.id}`}
                value={certificate.certificateUrl || ''}
                onChange={(e) => updateCertificate(certificate.id, 'certificateUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>
            
            <div>
              <Label htmlFor={`cert-description-${certificate.id}`}>Description (Optional)</Label>
              <Textarea
                id={`cert-description-${certificate.id}`}
                value={certificate.description || ''}
                onChange={(e) => updateCertificate(certificate.id, 'description', e.target.value)}
                placeholder="Brief description of the certification..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      ))}
      
      {certificates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No certificates added yet. Click "Add Certificate" to get started.</p>
        </div>
      )}
    </div>
  );
};
