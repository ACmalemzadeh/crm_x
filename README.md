# CRM X

A modern, full-featured customer relationship management system built with React, TypeScript, and Vite. Designed for professional services firms to manage client relationships, track leads, oversee SOWs, and monitor team performance.

## Features

### 📊 Dashboard
- **Executive Metrics**: Real-time overview of revenue, costs, and resource utilization
- **Revenue vs Cost Charts**: Interactive line charts with 12-month historical data
- **Quick Stats**: Key performance indicators including SOWs, active leads, and employee metrics
- **Directors & Leadership**: Performance tracking for company directors with cost/revenue per lead
- **Track Updates**: Recent activity feed across all sections with pagination

### 👥 Contacts
- **Comprehensive Profiles**: Full contact details including personal preferences, family info, and LinkedIn
- **Activity Timeline**: Meeting notes and interactions with associated costs
- **Advanced Search**: Multi-field search with instant filtering
- **Related Information**: View associated SOWs and leads for each contact
- **Add/Edit Functionality**: Create new contacts and update existing profiles

### 🎯 Leads
- **Kanban Board**: Visual pipeline with drag-and-drop across stages (New, Qualified, Proposal, Negotiation, Won)
- **Lead Details**: Track client organizations, contacts, revenue estimates, project duration, and start dates
- **Team Management**: Link both client-side and company-side contacts to each lead
- **SOW Integration**: Automatic linking to SOWs when leads move to "Won" stage
- **Timeline Entries**: Meeting notes and activity tracking with cost attribution
- **Required Fields**: Validation for critical information including cost entries

### 📄 SOW Management
- **Contract Tracking**: Organized by phase (Lead, In Progress, Won, Completed)
- **Comprehensive Details**: SOW name, client POC, client PM, resource manager, signed date, and revenue
- **Team Assignment**: View and manage employees assigned to each SOW
- **Contract Access**: Direct links to SharePoint contracts (PDF/DOCX)
- **Activity Log**: Timeline of comments and updates related to each SOW
- **Search & Filter**: Quick access to SOWs by client, managers, or value

### 🚀 Projects
- **Status Tracking**: Visual indicators (Red, Yellow, Green) for project health
- **Phase Management**: Track projects through Planning, Financed, In Progress, Canceled, and Completed phases
- **Team & Budget**: Monitor team size, budget allocation, and external dependencies
- **Vendor Management**: Track external vendors and teams involved in projects

### 💼 Employees (Resources)
- **Resource Overview**: Complete employee roster with current account assignments
- **Bench Tracking**: Monitor available resources and bench time
- **Financial Metrics**: Salary, SOW valuation, and benefit tracking
- **Resume Access**: Direct links to employee resumes and contact information

### 🎨 Design & UX
- **Dark Mode**: Professional dark theme optimized for extended use
- **Responsive Design**: Mobile-first design with adaptive layouts for tablets and desktops
- **Modal System**: Full-page card expansions with backdrop dismiss
- **Smart Navigation**: Section-aware navigation with activity tracking
- **Custom Scrollbars**: Styled scrollbars for improved aesthetics

## Tech Stack

- **React 19** - Latest React with improved performance
- **TypeScript** - Type-safe development with full IntelliSense
- **Vite** - Lightning-fast HMR and optimized builds
- **CSS Custom Properties** - Dynamic theming system
- **Modular Architecture** - Component-based design with clear separation of concerns

## Project Structure

```
src/
├── components/
│   ├── sections/          # Main section components
│   │   ├── Dashboard.tsx
│   │   ├── ContactsSection.tsx
│   │   ├── LeadsSection.tsx
│   │   ├── SowSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   └── ResourcesSection.tsx
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Chip.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── SearchBar.tsx
│   ├── Header.tsx
│   └── Hero.tsx
├── data/
│   ├── mockData.ts        # Sample data for development
│   └── authData.ts        # Authentication mock
├── types/
│   ├── index.ts           # TypeScript type definitions
│   └── auth.ts
├── utils/
│   ├── dataGenerator.ts   # Utility for generating test data
│   ├── contactsFilters.ts
│   ├── leadsFilters.ts
│   ├── sowFilters.ts
│   ├── projectsFilters.ts
│   └── resourcesFilters.ts
├── App.tsx                # Main application component
├── App.css                # Global styles and theme
└── main.tsx               # Application entry point
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd crm_x

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` (or the port shown in terminal) to view the application.

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

## Key Features Implementation

### Contact Management
- Full CRUD operations with validation
- Rich timeline entries with cost tracking
- Personal and professional information capture
- Club memberships and social preferences

### Lead Pipeline
- Stage-based workflow with visual kanban
- Revenue estimation and project scoping
- Multi-contact relationship tracking (client and internal)
- Automatic SOW linking for won leads

### SOW Lifecycle
- Phase-based organization (Lead → Won → In Progress → Completed)
- Employee assignment and resource management
- Contract document management with SharePoint integration
- Activity timeline for updates and comments

### Dashboard Analytics
- Real-time metrics calculation
- 12-month revenue and cost trending
- Director performance tracking
- Employee utilization metrics

## Development

### Code Style
- TypeScript strict mode enabled
- Functional components with hooks
- Props interfaces for all components
- CSS modules pattern for styling

### State Management
- React useState for local component state
- Props drilling for shared data
- useMemo for expensive computations
- Future: Consider Redux or Context API for larger scale

## Future Enhancements

- [ ] Backend API integration
- [ ] Real-time collaboration features
- [ ] Advanced reporting and analytics
- [ ] Email integration for activity tracking
- [ ] Calendar integration for meetings
- [ ] Document management system
- [ ] Advanced role-based access control
- [ ] Mobile native apps (React Native)
- [ ] Export functionality (PDF, Excel)
- [ ] Advanced filtering and saved views

## License

MIT License - feel free to use this project for your own purposes.

## Contributors

Built with ❤️ by the CRM X team.
