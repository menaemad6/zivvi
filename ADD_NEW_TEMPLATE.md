# How to Add a New CV Template

Follow these steps to add a new CV template to the project:

## 1. Create the Template Component
- Go to `src/components/cv/templates/PreBuiltTemplates.tsx`.
- Add your template as in `PreBuiltTemplates.tsx` as the other ones, add a new React component function inside that file (e.g., `const MyNewTemplate = ...`).
- Follow the structure and style conventions of existing templates.
- Make sure include all the sections ( even if not in the provided image ) , they are : "personalInfo", "summary", "experience", "projects", "education", , "skills" in the this order

## 2. Register the Template in the Template Switch
- In `src/components/cv/templates/PreBuiltTemplates.tsx`, add your template to the main switch in the `PreBuiltTemplates` component:

```tsx
switch (templateId) {
  ...
  case "myNewTemplate":
    return <MyNewTemplate cvData={cvData} sections={sections} />;
  ...
}
```

- If using `src/components/cv/templates/index.ts`, add your template to the registry:

```ts
export const templateComponentRegistry = {
  ...
  myNewTemplate: (props: any) => React.createElement(PreBuiltTemplates, { ...props, templateId: "myNewTemplate" }),
  ...
};
```

## 3. Add the Template Metadata
- Open `src/data/templates.ts`.
- Add an entry to the `cvTemplates` array:

```ts
{
  id: 'myNewTemplate',
  name: 'My New Template',
  description: 'A short description of your template.',
  thumbnail: '/templates/my-new-template.png', // See next step
  category: 'modern' // or 'classic', 'creative', etc.
}
```



**Tip:** Follow the code style and conventions of existing templates for consistency. 