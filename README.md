# 🧮 Times Table Quiz

An interactive multiplication quiz app built with React and Vite. Practice your times tables with configurable difficulty, timed challenges, and instant feedback.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

## Features

- **Customizable tables** — Choose any combination of the 1–12 times tables to practice
- **Adjustable question count** — Pick 10, 20, 30, or 50 questions per session
- **Configurable timer** — Set a per-question time limit (5s, 10s, 15s, 30s) or play untimed
- **Multiple choice** — Four answer options with plausible distractors
- **Streak tracking** — Visual fire streak indicator when you get 3+ correct in a row
- **Instant feedback** — See correct/incorrect results immediately after each answer
- **Detailed results** — Full breakdown with score, accuracy percentage, total time, and per-question review table
- **Dark glassmorphism UI** — Modern dark theme with animated transitions and glow effects
- **Responsive design** — Works on desktop, tablet, and mobile
- **Accessible** — ARIA attributes on toggle buttons, keyboard navigable

## Tech Stack

| Tool | Purpose |
|------|---------|
| [React 19](https://react.dev) | UI components and state management |
| [Vite 8](https://vite.dev) | Build tool and dev server with HMR |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first styling |
| [ESLint](https://eslint.org) | Code linting with React hooks rules |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+ installed
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd demoOne

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Opens the app at [http://localhost:5173](http://localhost:5173) with hot module replacement.

### Build for Production

```bash
npm run build
```

Output goes to the `dist/` directory. Preview the production build locally:

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Project Structure

```
demoOne/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── SettingsScreen.jsx   # Table selection, question count, timer config
│   │   ├── QuizScreen.jsx      # Question display, choices, timer, streak
│   │   └── ResultsScreen.jsx   # Score summary and per-question breakdown
│   ├── App.jsx                  # Screen routing and state coordination
│   ├── main.jsx                 # React entry point
│   └── index.css                # Tailwind imports and custom styles
├── index.html                   # HTML shell
├── vite.config.js               # Vite + React + Tailwind plugin config
├── eslint.config.js             # ESLint flat config
├── package.json
└── README.md
```

## How It Works

1. **Settings Screen** — Select which times tables to practice, how many questions, and the time limit per question.
2. **Quiz Screen** — Answer multiple-choice questions. A progress bar and optional countdown timer track your progress. Correct answers build a streak counter.
3. **Results Screen** — View your final score, accuracy, total time, and a color-coded table showing each question with your answer vs. the correct answer.

## Customization

- **Add more tables** — Extend the `ALL_TABLES` array in `SettingsScreen.jsx`
- **Change number of choices** — Modify `generateChoices()` in `QuizScreen.jsx`
- **Adjust styling** — Edit `src/index.css` or use Tailwind utility classes directly in components
- **Add sound effects** — Hook into the `handleChoice` and `handleTimeout` functions in `QuizScreen.jsx`

## License

This project is private and not published under a specific license.
