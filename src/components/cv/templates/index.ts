import React from "react";
import PreBuiltTemplates from "./PreBuiltTemplates";

export const templateComponentRegistry: Record<string, any> = {
  classicTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "classicTemp" }),
  elegantTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "elegantTemp" }),
  timelineTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "timelineTemp" }),
  // Add more mappings as you add more templates
  compactTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "compactTemp" }),
  headerTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "headerTemp" }),
}; 