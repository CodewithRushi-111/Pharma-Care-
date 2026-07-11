<div align="center">
  <img src="frontend/public/logo.png" alt="Pharma Care Logo" width="150" />
</div>

# Pharma Care - AI-Powered Smart Pharmacy & Telemedicine Platform

Welcome to the **Pharma Care Platform**, a unified digital ecosystem designed for medicine access, doctor consultation, and AI-guided healthcare. This project was developed as part of the IEEE Internship Program to showcase a modern, responsive, and robust full-stack web application.

## 🚀 Features

The application consolidates multiple healthcare tools into a single authenticated experience:

1. **AI Healthcare Assistant**
   - 24/7 informational companion powered by AI.
   - Provides safe guidance on medicine usage, dosage, and generic substitutes.
   - Intelligent catalog search and pre-filter safety interceptions for emergencies.

2. **Smart Pharmacy**
   - Browse medicines, compounding ingredients, and generics.
   - Cart and checkout flow.
   - Digital prescription uploads required for regulated (Schedule H) drugs.
   - Out-of-stock alternative generic suggestions.

3. **Telemedicine & Doctor Consultations**
   - Browse doctors by specialty, availability, and rating.
   - Interactive booking calendar and time slots.
   - Digital prescription generation and consultation history.

4. **Multi-Role Administration Dashboard**
   - **Pharmacy Admin**: Verify prescription uploads and triage incoming orders.
   - **Platform Admin**: Onboard new doctors, update medicine inventory, and review AI safety logs and emergency interceptions.

## 💻 Tech Stack

- **Frontend**: React 19, React Router DOM, Vite
- **Styling**: Vanilla CSS, Lucide React (Icons)
- **Tooling**: Oxlint for code linting

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/CodewithRushi-111/Pharma-Care-.git
   cd Pharma-Care-
   ```

2. Install dependencies:
   ```bash
   # Using the root script that installs all dependencies
   npm run install-all
   ```

### Running the Application

You can easily run the application from the root directory thanks to the configured `package.json`:

```bash
# Start the development server
npm run dev

# Or
npm start
```

The application will start, usually accessible at `http://localhost:5173`.

### Linting & Building

```bash
# Run the linter
npm run lint

# Build for production
npm run build
```

## 🔐 User Roles

The platform supports distinct experiences based on user roles:
- **Patient**: Default role for booking, ordering, and using the AI assistant.
- **Doctor**: Can manage availability, attend video calls, and issue digital prescriptions.
- **Pharmacy Admin**: Validates uploaded prescriptions and fulfills orders.
- **Platform Admin**: Manages system catalog, doctors, and reviews AI safety interventions.

## 📜 Project Documentation

- `prd.txt`: The official Product Requirements Document detailing scope, personas, functional requirements, and architecture.
- `design.md` & `formatted_design.md`: The design system specifications, color palettes, and Google Stitch generation prompts.

## 🎓 Acknowledgements
This project is built and prepared for the IEEE Internship Program (July 2026).
