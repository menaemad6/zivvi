
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
      className="cursor-grab active:cursor-grabbing hover:bg-muted/60 rounded-lg transition-all duration-200 group transform hover:scale-[1.02] hover:shadow-md"
    >
      <Button 
        variant="ghost" 
        className="w-full justify-start gap-3 py-4 h-auto transition-all duration-200 hover:translate-x-1 group-hover:bg-white/50"
      >
        <span className="text-primary group-hover:scale-110 transition-transform duration-200">
          {icon}
        </span>
        <div className="text-left">
          <span className="font-medium text-sm">{title}</span>
        </div>
      </Button>
    </div>
  );
};
