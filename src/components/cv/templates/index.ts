
import React from "react";
import PreBuiltTemplates from "./PreBuiltTemplates";

export const templateComponentRegistry: Record<string, any> = {
  classicTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "classicTemp" }),
  visionaryPro: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "visionaryPro" }),
  elegantPro: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "elegantPro" }),
  highPerformer: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "highPerformer" }),
  elegantTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "elegantTemp" }),
  timelineTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "timelineTemp" }),
  compactTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "compactTemp" }),
  headerTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "headerTemp" }),
  monochromeTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "monochromeTemp" }),
  singleColumnTemp: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "singleColumnTemp" }),
}; 
