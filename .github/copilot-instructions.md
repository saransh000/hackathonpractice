# Hackathon Helper Tool - Frontend Development Instructions

## Project Overview
Building a React frontend for a Hackathon Helper Tool - a lightweight Kanban board application similar to Trello but simpler. This is part of a MERN stack project.

## Checklist Progress
- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements - Building React frontend for Hackathon Helper Tool Kanban board
- [x] Scaffold the Project - Created React TypeScript project with Vite
- [x] Customize the Project - Added Kanban board components with drag & drop functionality
- [x] Install Required Extensions - No additional extensions needed
- [x] Compile the Project - Successfully built with npm run build
- [x] Create and Run Task - Development server task created and running
- [x] Launch the Project - Available at http://localhost:5175/
- [x] Ensure Documentation is Complete - README updated with project details
- [x] Implement Authentication - Login and signup pages with demo users
- [x] Enhance Typography - Added Poppins + Inter fonts with proper weight hierarchy
- [x] Team Messaging - Real-time messaging system for team communication

## Project Requirements
- **Tech Stack**: React frontend (part of MERN stack)
- **Features**: 
  - Kanban board with drag & drop functionality
  - Task assignment and tracking
  - Team progress sharing
  - Lightweight and simple interface
  - User authentication (login/signup)
  - Real-time team messaging system
  - Admin dashboard with analytics
- **Styling**: Tailwind CSS with custom design system
- **Typography**: Poppins for headings, Inter for body text
- **Language**: TypeScript for better development experience

## Design System

### Typography
- **Display/Headings**: Poppins (weights: 400-900)
  - Main headings: font-black (900) with tracking-tight
  - Section headings: font-bold (700)
  - Buttons/CTAs: font-semibold (600)
- **Body/UI**: Inter (weights: 300-700)
  - Body text: font-normal (400)
  - Subtitles: font-light (300)
  - Labels: font-medium (500)
  - User names: font-semibold (600)

### Visual Elements
- **Corner Radius**: Unified rounded-2xl
- **Shadows**: Two-tier hierarchy (shadow-sm for tasks, shadow-lg for containers)
- **Gradients**: Blue → Indigo → Purple theme
- **Glassmorphism**: Backdrop blur effects throughout
- **Animations**: float, glow, gradientShift, slideUp

## Components Created
- KanbanBoard: Main component with drag & drop functionality
- Column: Individual columns for task organization
- TaskCard: Individual task cards with priority indicators
- AddTaskModal: Modal for creating new tasks
- EnhancedHeader: Premium header with stats and CTA
- LoginPage: Beautiful authentication with demo accounts
- SignupPage: User registration with validation
- MessagingPanel: Real-time team messaging with floating UI
- Types: TypeScript interfaces for type safety