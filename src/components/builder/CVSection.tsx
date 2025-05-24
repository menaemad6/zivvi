
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, GripVertical } from 'lucide-react';

interface CVSectionProps {
  title: string;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  children: React.ReactNode;
}

export const CVSection: React.FC<CVSectionProps> = ({ title, onEdit, onDelete, onDragStart, children }) => {
  return (
    <div 
      className="group p-6 mb-4 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm animate-fade-in transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:bg-white/90"
      draggable={!!onDragStart}
      onDragStart={onDragStart}
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="cursor-grab p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </span>
          <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onEdit}
            className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
          >
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200" 
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
      <div className="transition-all duration-200">
        {children}
      </div>
    </div>
  );
};
