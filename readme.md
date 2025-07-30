# <img src="https://img.icons8.com/color/48/000000/resume.png" width="32" height="32"/> Zivvi CV Builder

> **Your Modern CV Builder with AI-Powered Features**

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.50-3ECF8E?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

![Zivvi CV Builder](https://placehold.co/800x400/6366f1/FFFFFF/png?text=Zivvi+CV+Builder&font=montserrat)

## 📄 Overview

Zivvi CV Builder is a modern, intuitive application designed to help job seekers create professional, visually appealing CVs with ease. Powered by Google's Gemini AI, Zivvi offers smart content generation, multiple template options, and a user-friendly interface to streamline the CV creation process.

<b>🌟 Key Features</b>

- 🤖 **AI-Powered Content Generation** - Get tailored CV content suggestions using Google's Gemini AI model
- 🎨 **Multiple Professional Templates** - Choose from a variety of modern, classic, and creative CV templates
- 💼 **Comprehensive CV Sections** - Easily manage experience, education, skills, projects, and more
- 📱 **Responsive Design** - Create and edit your CV on any device with a seamless experience
- 🔒 **Secure Authentication** - User authentication and profile management with Supabase
- 🖨️ **PDF Export** - Generate high-quality, print-ready PDF versions of your CV
- 🎯 **Real-time Preview** - See changes to your CV in real-time as you edit
- 🌓 **Dark/Light Mode** - Choose your preferred theme for comfortable editing
- 🔄 **Version History** - Save and manage multiple versions of your CV
- 🧩 **Customizable Sections** - Add, remove, and reorder CV sections to match your needs


## 🔧 Tech Stack

<div align="center">
  <table>
    <tr>
      <td align="center" width="96">
        <img src="https://techstack-generator.vercel.app/react-icon.svg" alt="React" width="48" height="48" />
        <br/>React
      </td>
      <td align="center" width="96">
        <img src="https://techstack-generator.vercel.app/ts-icon.svg" alt="TypeScript" width="48" height="48" />
        <br/>TypeScript
      </td>
      <td align="center" width="96">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" alt="Vite" width="48" height="48" />
        <br/>Vite
      </td>
      <td align="center" width="96">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" alt="Tailwind" width="48" height="48" />
        <br/>Tailwind
      </td>
      <td align="center" width="96">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" alt="Supabase" width="48" height="48" />
        <br/>Supabase
      </td>
      <td align="center" width="96">
        <img src="https://www.vectorlogo.zone/logos/reactrouter/reactrouter-icon.svg" alt="React Router" width="48" height="48" />
        <br/>Router
      </td>
    </tr>
    <tr>
      <td align="center" width="96">
        <img src="https://avatars.githubusercontent.com/u/14957082" alt="Gemini AI" width="48" height="48" />
        <br/>Gemini AI
      </td>
      <td align="center" width="96">
        <img src="https://raw.githubusercontent.com/TanStack/query/main/media/logo.svg" alt="React Query" width="48" height="48" />
        <br/>React Query
      </td>
      <td align="center" width="96">
        <img src="https://cdn.worldvectorlogo.com/logos/zod.svg" alt="Zod" width="48" height="48" />
        <br/>Zod
      </td>
      <td align="center" width="96">
        <img src="https://avatars.githubusercontent.com/u/75042455" alt="Radix UI" width="48" height="48" />
        <br/>Radix UI
      </td>
      <td align="center" width="96">
        <img src="https://avatars.githubusercontent.com/u/139895814" alt="shadcn UI" width="48" height="48" />
        <br/>shadcn/ui
      </td>
      <td align="center" width="96">
        <img src="https://raw.githubusercontent.com/jspdf-yworks/jspdf/master/docs/module-logo.png" alt="jsPDF" width="48" height="48" />
        <br/>jsPDF
      </td>
    </tr>
  </table>
</div>

<b>⚛️ Frontend</b>

- React 18 - JavaScript library for building user interfaces
- TypeScript - Type-safe programming language
- Vite - Frontend build tool for rapid development
- Tailwind CSS - Utility-first CSS framework
- shadcn/ui - Beautifully designed components built with Radix UI and Tailwind
- Lucide React - Beautiful & consistent icon toolkit
- React Router DOM - Client-side routing for React applications
- React Query - Powerful data synchronization for React


<b>🗃️ Backend & Data</b>

- Supabase - Open-source Firebase alternative (database, auth, storage)
- Google Gemini API - Google's advanced language model for CV content generation


<b>🎭 UI/UX & Additional Libraries</b>

- Radix UI - Unstyled, accessible UI components
- Sonner - Toast notification component for React
- React Hook Form & Zod - Form validation and handling
- jsPDF & html2canvas - PDF generation tools
- Date-fns - Modern JavaScript date utility library
- Recharts - Composable charting library for analytics
- React Colorful - Color picker component


## 📂 Project Structure

```
canvas-cv/
├── public/                # Public assets
│   └── templates/         # Template preview images
├── src/
│   ├── components/
│   │   ├── analytics/     # Analytics components
│   │   ├── builder/       # CV builder components
│   │   ├── cv/            # CV template components
│   │   ├── layout/        # Layout components
│   │   ├── modals/        # Modal components
│   │   ├── profile/       # User profile components
│   │   └── ui/            # UI components from shadcn
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   ├── data/              # Static data
│   │   └── templates.ts   # CV template definitions
│   ├── hooks/             # Custom React hooks
│   │   ├── useCV.ts       # CV data management
│   │   ├── usePDFGeneration.ts # PDF export functionality
│   │   └── ...
│   ├── integrations/      # External service integrations
│   │   └── supabase/      # Supabase client and types
│   ├── lib/               # Utility functions
│   ├── pages/             # Application pages
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   │   ├── geminiApi.ts   # Gemini AI integration
│   │   └── pdfGeneration/ # PDF generation utilities
│   ├── App.tsx           # Main application component
│   ├── index.css         # Global styles
│   └── main.tsx          # Application entry point
├── index.html            # HTML entry point
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1️⃣ **Clone the repository:**
```sh
git clone https://github.com/yourusername/canvas-cv.git
cd canvas-cv
```

2️⃣ **Install dependencies:**
```sh
npm install
```

3️⃣ **Configure environment variables:**

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_API_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

4️⃣ **Start the development server:**
```sh
npm run dev
```

5️⃣ **Open your browser:**
Navigate to `http://localhost:5173`


## 🌐 Deployment

```sh
# Build the project
npm run build

# Preview the production build locally
npm run preview

# Deploy the dist folder to your preferred hosting service
# We recommend Netlify, Vercel, or GitHub Pages
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Google Gemini API for powering the AI content generation
- Supabase for providing backend services
- shadcn/ui for the beautiful component library
- All the open-source libraries that made this project possible

---

<div align="center">
  <img src="/public/zivvi-logo.png" width="24" height="24"/>
  <p>Made with ❤️ for job seekers worldwide</p>
</div>
