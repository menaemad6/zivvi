
import React from 'react';
import { Button } from "@/components/ui/button";

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  onDragStart: (e: React.DragEvent) => void;
}

export const SidebarSection: React.FC<SectionProps> = ({ title, icon, onDragStart }) => {
  return (
    <div 
      draggable 
      onDragStart={onDragStart}
      className="cursor-grab active:cursor-grabbing hover:bg-muted/60 rounded-md transition-colors"
    >
      <Button variant="ghost" className="w-full justify-start gap-2 py-6">
        <span className="text-primary">{icon}</span>
        <span>{title}</span>
      </Button>
    </div>
  );
};
