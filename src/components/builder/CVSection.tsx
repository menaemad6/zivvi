
import React from 'react';
import { Button } from "@/components/ui/button";

interface CVSectionProps {
  title: string;
  onEdit: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}

// Drag handle icon
const DragHandleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="12" r="1"></circle>
    <circle cx="15" cy="12" r="1"></circle>
  </svg>
);

export const CVSection: React.FC<CVSectionProps> = ({ title, onEdit, onDelete, children }) => {
  return (
    <div 
      className="p-4 mb-4 border rounded-lg bg-white animate-fade-in"
      draggable
    >
      <div className="flex items-center justify-between mb-3 border-b pb-2">
        <div className="flex items-center gap-2">
          <span className="cursor-grab p-1 hover:bg-muted rounded">
            <DragHandleIcon />
          </span>
          <h3 className="font-medium">{title}</h3>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={onEdit}>Edit</Button>
          <Button size="sm" variant="ghost" className="text-destructive" onClick={onDelete}>Delete</Button>
        </div>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};
