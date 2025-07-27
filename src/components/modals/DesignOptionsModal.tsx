import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Type, Check } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

interface DesignOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  optionType: 'font' | 'color';
  currentValue?: string;
  onSave: (value: string) => void;
}

const FONT_OPTIONS = [
  { value: 'inter', label: 'Inter', preview: 'Inter' },
  { value: 'roboto', label: 'Roboto', preview: 'Roboto' },
  { value: 'open-sans', label: 'Open Sans', preview: 'Open Sans' },
  { value: 'lato', label: 'Lato', preview: 'Lato' },
  { value: 'poppins', label: 'Poppins', preview: 'Poppins' },
  { value: 'montserrat', label: 'Montserrat', preview: 'Montserrat' },
  { value: 'raleway', label: 'Raleway', preview: 'Raleway' },
  { value: 'source-sans-pro', label: 'Source Sans Pro', preview: 'Source Sans Pro' },
];

const COLOR_OPTIONS = [
  { value: 'blue', label: 'Blue', color: '#3B82F6', bgColor: '#DBEAFE' },
  { value: 'purple', label: 'Purple', color: '#8B5CF6', bgColor: '#EDE9FE' },
  { value: 'green', label: 'Green', color: '#10B981', bgColor: '#D1FAE5' },
  { value: 'red', label: 'Red', color: '#EF4444', bgColor: '#FEE2E2' },
  { value: 'orange', label: 'Orange', color: '#F97316', bgColor: '#FED7AA' },
  { value: 'pink', label: 'Pink', color: '#EC4899', bgColor: '#FCE7F3' },
  { value: 'indigo', label: 'Indigo', color: '#6366F1', bgColor: '#E0E7FF' },
  { value: 'teal', label: 'Teal', color: '#14B8A6', bgColor: '#CCFBF1' },
];

export const DesignOptionsModal = ({ 
  isOpen, 
  onClose, 
  optionType, 
  currentValue, 
  onSave 
}: DesignOptionsModalProps) => {
  const [selectedValue, setSelectedValue] = useState(currentValue || '');
  const [customColor, setCustomColor] = useState(currentValue && !COLOR_OPTIONS.find(c => c.value === currentValue) ? currentValue : '#3B82F6');
  const [useCustomColor, setUseCustomColor] = useState(currentValue && !COLOR_OPTIONS.find(c => c.value === currentValue) ? true : false);

  // Update selectedValue when currentValue prop changes
  useEffect(() => {
    if (currentValue) {
      setSelectedValue(currentValue);
      // Check if currentValue is a hex color and not in COLOR_OPTIONS
      const isCustomColor = currentValue.startsWith('#') && !COLOR_OPTIONS.find(c => c.value === currentValue);
      setUseCustomColor(isCustomColor);
      if (isCustomColor) {
        setCustomColor(currentValue);
      }
    } else {
      setSelectedValue('');
    }
  }, [currentValue]);

  const handleSave = () => {
    if (optionType === 'color' && useCustomColor) {
      onSave(customColor);
    } else {
      onSave(selectedValue);
    }
    onClose();
  };

  const handleColorChange = (color: string) => {
    setCustomColor(color);
    setSelectedValue(color);
  };

  const renderFontOptions = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {FONT_OPTIONS.map((font) => (
        <Card 
          key={font.value}
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedValue === font.value 
              ? 'ring-2 ring-blue-500 bg-blue-50' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => setSelectedValue(font.value)}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p 
                  className="text-base sm:text-lg font-medium mb-1 truncate"
                  style={{ fontFamily: font.value === 'inter' ? 'Inter' : font.value === 'roboto' ? 'Roboto' : font.value === 'open-sans' ? 'Open Sans' : font.value === 'lato' ? 'Lato' : font.value === 'poppins' ? 'Poppins' : font.value === 'montserrat' ? 'Montserrat' : font.value === 'raleway' ? 'Raleway' : 'Source Sans Pro' }}
                >
                  {font.preview}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 truncate">{font.label}</p>
              </div>
              {selectedValue === font.value && (
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 ml-2">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderColorOptions = () => (
    <div className="space-y-6">
      {/* Predefined color options */}
      <div>
        <h3 className="text-sm font-medium mb-3">Predefined Colors</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {COLOR_OPTIONS.map((color) => (
            <Card 
              key={color.value}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedValue === color.value && !useCustomColor
                  ? 'ring-2 ring-blue-500' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => {
                setSelectedValue(color.value);
                setUseCustomColor(false);
              }}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col items-center space-y-2">
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-200 flex items-center justify-center"
                    style={{ backgroundColor: color.bgColor }}
                  >
                    <div 
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                      style={{ backgroundColor: color.color }}
                    />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 text-center">{color.label}</p>
                  {selectedValue === color.value && !useCustomColor && (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Custom color picker */}
      <div>
        <h3 className="text-sm font-medium mb-3">Custom Color</h3>
        <Card className={`transition-all duration-200 ${useCustomColor ? 'ring-2 ring-blue-500' : ''}`}>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="use-custom-color" className="font-medium">Use custom color</Label>
                <input 
                  type="checkbox" 
                  id="use-custom-color"
                  checked={useCustomColor}
                  onChange={(e) => setUseCustomColor(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              
              {useCustomColor && (
                <div className="space-y-4">
                  <HexColorPicker color={customColor} onChange={handleColorChange} />
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-md border border-gray-300"
                      style={{ backgroundColor: customColor }}
                    />
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              {optionType === 'font' ? (
                <Type className="h-4 w-4 text-white" />
              ) : (
                <Palette className="h-4 w-4 text-white" />
              )}
            </div>
            {optionType === 'font' ? 'Choose Font' : 'Choose Color'}
          </DialogTitle>
          <DialogDescription>
            {optionType === 'font' 
              ? 'Select a font style for your CV to match your personal brand and industry.'
              : 'Choose a color scheme that reflects your personality and professional style.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {optionType === 'font' ? renderFontOptions() : renderColorOptions()}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!selectedValue && !useCustomColor}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Apply {optionType === 'font' ? 'Font' : 'Color'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};