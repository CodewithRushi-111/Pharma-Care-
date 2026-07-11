# AI Agent Instructions (agent.md)

This file contains guidelines and context for AI coding assistants working on the **Pharma Care** codebase. 

## Project Context
Pharma Care is a React-based healthcare platform supporting AI-assisted triage, pharmacy operations, and telemedicine. It is a single-page application built with Vite and React 19.

## Codebase Guidelines

1. **Component Design System**
   - Use `lucide-react` for all iconography. Avoid introducing secondary icon libraries.
   - Emphasize the usage of reusable UI components found in `frontend/src/components/`, such as:
     - `LeftAccentCard`: Used for highlighting warnings, informational blocks, and AI messages.
     - `PrescriptionBadge`: Used to tag medicines that require a digital prescription (Rx).
     - `StatusStepper`: Used in OrderTracking to show order progress.
     - `InfoDisclaimer`: Used to append mandatory medical disclaimers.

2. **Styling & CSS**
   - The project uses Vanilla CSS with a global `index.css`.
   - Adhere to the established CSS variables for theming (e.g., `var(--color-primary)`, `var(--color-surface)`, `var(--radius-md)`).
   - Do NOT introduce Tailwind CSS or styled-components unless explicitly requested, as the project relies on semantic global CSS and inline styling for dynamic behaviors.

3. **Routing**
   - React Router DOM (`react-router-dom`) is utilized for all navigation.
   - Main routes are configured in `App.jsx`. Any new views must be registered there and added to the sidebar navigation.

4. **Linting**
   - The project uses `oxlint` for fast linting.
   - Before committing code, ensure no unused variables or unused imports exist. 
   - Avoid ignoring `exhaustive-deps` in `useEffect` unless absolutely necessary (e.g., preventing infinite loops when dealing with router location state).

5. **State Management**
   - Currently, global state (cart, orders, appointments, active lists) is managed via `useState` at the top level in `App.jsx` and passed down as props.
   - Ensure props are properly drilled to child components that need them (e.g., `medicinesList` passed to `Pharmacy`).

6. **Root Package Scripts**
   - Always map operations to the `frontend` folder. The root `package.json` contains scripts like `npm run dev --prefix frontend` to make the developer experience seamless. 
   - Do not create a separate Node server at the root level unless authorized; the project is currently a frontend-only React prototype.
