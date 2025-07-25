
import React from "react";
import PreBuiltTemplates from "./PreBuiltTemplates";

export const templateComponentRegistry: Record<string, any> = {
  classicTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "classicTemp" }),
  visionaryProTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "visionaryProTemp" }),
  elegantProTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "elegantProTemp" }),
  highPerformerTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "highPerformerTemp" }),
  elegantTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "elegantTemp" }),
  timelineTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "timelineTemp" }),
  compactTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "compactTemp" }),
  headerTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "headerTemp" }),
  monochromeTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "monochromeTemp" }),
  singleColumnTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "singleColumnTemp" }),
}; 
