# 🧮 Times Table Quiz

An interactive multiplication quiz app to help users practice and master their times tables (1–12). Features configurable settings, timed questions with multiple-choice answers, streak tracking, and a detailed results breakdown.

## 📸 Features

- **Customizable Tables** — Select which multiplication tables (1–12) to practice
- **Adjustable Question Count** — Choose 10, 20, 30, or 50 questions per session
- **Timer Options** — Set a per-question time limit (5s, 10s, 15s, 30s) or play untimed
- **Multiple Choice** — 4 answer options with plausible distractors
- **Instant Feedback** — Correct/incorrect indicators after each answer
- **Streak Tracking** — Visual streak counter for consecutive correct answers
- **Results Summary** — Score, accuracy percentage, total time, and per-question breakdown

## 🏗️ Project Structure

```
times-table-quiz/
├── index.html              # Vanilla JS version (entry point)
├── app.js                  # Vanilla JS quiz logic
├── style.css               # Vanilla JS styles
└── times-table-quiz/       # React version
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── components/
    │       ├── SettingsScreen.jsx
    │       ├── QuizScreen.jsx
    │       └── ResultsScreen.jsx
    ├── public/
    ├── index.html
    ├── package.json
    └── vite.config.js
```

This repository contains **two implementations**:

| Version | Stack | Location |
|---------|-------|----------|
| Vanilla | HTML + CSS + JavaScript | Root (`index.html`, `app.js`, `style.css`) |
| React | React 19 + Vite + Tailwind CSS 4 | `times-table-quiz/` directory |

## 🚀 Getting Started

### Vanilla Version

Open `index.html` directly in a browser — no build step required.

### React Version

```bash
cd times-table-quiz
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts (React)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🎮 How to Play

1. **Settings** — Select which times tables to practice, number of questions, and time limit
2. **Quiz** — Answer each multiplication question by clicking one of the four choices
3. **Results** — Review your score, accuracy, time taken, and see which questions you got right or wrong

## 🛠️ Tech Stack (React Version)

- [React 19](https://react.dev/)
- [Vite 8](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [ESLint](https://eslint.org/)

## 📄 License

This project is private and not published under a public license.
