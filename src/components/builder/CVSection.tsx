
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
      className="group p-3 sm:p-6 mb-3 sm:mb-4 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm animate-fade-in transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:bg-white/90"
      draggable={!!onDragStart}
      onDragStart={onDragStart}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="cursor-grab p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <GripVertical className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          </span>
          <h3 className="font-semibold text-sm sm:text-lg text-gray-800 truncate">{title}</h3>
        </div>
        <div className="flex gap-1 sm:gap-2 transition-opacity duration-200">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onEdit}
            className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 h-7 sm:h-8 px-2 sm:px-3"
          >
            <Edit2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 h-7 sm:h-8 px-2 sm:px-3" 
            onClick={onDelete}
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>
      <div className="transition-all duration-200">
        {children}
      </div>
    </div>
  );
};
