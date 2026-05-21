(function () {
  'use strict';

  // --- DOM Elements ---
  const settingsScreen = document.getElementById('settings-screen');
  const quizScreen = document.getElementById('quiz-screen');
  const resultsScreen = document.getElementById('results-screen');

  const tableGrid = document.getElementById('table-grid');
  const selectAllBtn = document.getElementById('select-all-btn');
  const deselectAllBtn = document.getElementById('deselect-all-btn');
  const numQuestionsSelect = document.getElementById('num-questions');
  const timeLimitSelect = document.getElementById('time-limit');
  const startBtn = document.getElementById('start-btn');

  const progressEl = document.getElementById('progress');
  const scoreDisplayEl = document.getElementById('score-display');
  const timerDisplayEl = document.getElementById('timer-display');
  const questionEl = document.getElementById('question');
  const feedbackEl = document.getElementById('feedback');
  const choicesEl = document.getElementById('choices');
  const quitBtn = document.getElementById('quit-btn');

  const resultScore = document.getElementById('result-score');
  const resultTotal = document.getElementById('result-total');
  const resultPercent = document.getElementById('result-percent');
  const resultTime = document.getElementById('result-time');
  const resultsDetail = document.getElementById('results-detail');
  const retryBtn = document.getElementById('retry-btn');
  const homeBtn = document.getElementById('home-btn');

  // --- State ---
  let selectedTables = new Set([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  let questions = [];
  let currentIndex = 0;
  let score = 0;
  let results = [];
  let timeLimit = 10;
  let timerInterval = null;
  let timeRemaining = 0;
  let quizStartTime = 0;
  let waitingForNext = false;

  // --- Init ---
  function init() {
    buildTableGrid();
    bindEvents();
  }

  function buildTableGrid() {
    for (let i = 1; i <= 12; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'table-btn' + (selectedTables.has(i) ? ' selected' : '');
      btn.textContent = i;
      btn.dataset.value = i;
      btn.setAttribute('aria-pressed', selectedTables.has(i));
      btn.addEventListener('click', () => toggleTable(i, btn));
      tableGrid.appendChild(btn);
    }
  }

  function toggleTable(num, btn) {
    if (selectedTables.has(num)) {
      selectedTables.delete(num);
      btn.classList.remove('selected');
      btn.setAttribute('aria-pressed', 'false');
    } else {
      selectedTables.add(num);
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed', 'true');
    }
  }

  function bindEvents() {
    selectAllBtn.addEventListener('click', () => {
      document.querySelectorAll('.table-btn').forEach(btn => {
        const val = parseInt(btn.dataset.value);
        selectedTables.add(val);
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
      });
    });

    deselectAllBtn.addEventListener('click', () => {
      document.querySelectorAll('.table-btn').forEach(btn => {
        const val = parseInt(btn.dataset.value);
        selectedTables.delete(val);
        btn.classList.remove('selected');
        btn.setAttribute('aria-pressed', 'false');
      });
    });

    startBtn.addEventListener('click', startQuiz);
    quitBtn.addEventListener('click', endQuiz);
    retryBtn.addEventListener('click', startQuiz);
    homeBtn.addEventListener('click', () => showScreen(settingsScreen));
  }

  // --- Quiz Logic ---
  function startQuiz() {
    if (selectedTables.size === 0) {
      alert('Please select at least one times table.');
      return;
    }

    const numQuestions = parseInt(numQuestionsSelect.value);
    timeLimit = parseInt(timeLimitSelect.value);

    questions = generateQuestions(numQuestions);
    currentIndex = 0;
    score = 0;
    results = [];
    waitingForNext = false;
    quizStartTime = Date.now();

    showScreen(quizScreen);
    showQuestion();
  }

  function generateQuestions(count) {
    const pool = [];
    const tables = Array.from(selectedTables);

    for (const table of tables) {
      for (let i = 1; i <= 12; i++) {
        pool.push({ a: table, b: i, answer: table * i });
      }
    }

    shuffle(pool);
    return pool.slice(0, count);
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function generateChoices(correctAnswer) {
    const choices = new Set([correctAnswer]);

    // Generate plausible wrong answers near the correct one
    while (choices.size < 4) {
      let wrong;
      const strategy = Math.random();

      if (strategy < 0.4) {
        // Off by a small amount
        const offset = Math.floor(Math.random() * 10) + 1;
        wrong = correctAnswer + (Math.random() < 0.5 ? offset : -offset);
      } else if (strategy < 0.7) {
        // A nearby multiple
        const factor = Math.floor(Math.random() * 12) + 1;
        const base = Math.floor(Math.random() * 12) + 1;
        wrong = factor * base;
      } else {
        // Digit swap or percentage off
        wrong = correctAnswer + (Math.floor(Math.random() * 20) - 10);
      }

      if (wrong > 0 && wrong !== correctAnswer) {
        choices.add(wrong);
      }
    }

    const arr = Array.from(choices);
    shuffle(arr);
    return arr;
  }

  function showQuestion() {
    const q = questions[currentIndex];
    questionEl.textContent = `${q.a} × ${q.b} = ?`;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    waitingForNext = false;

    progressEl.textContent = `${currentIndex + 1} / ${questions.length}`;
    scoreDisplayEl.textContent = `Score: ${score}`;

    // Render choice buttons
    const choices = generateChoices(q.answer);
    choicesEl.innerHTML = '';

    choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn';
      btn.textContent = choice;
      btn.addEventListener('click', () => handleChoice(choice, btn));
      choicesEl.appendChild(btn);
    });

    startTimer();
  }

  function handleChoice(chosen, clickedBtn) {
    if (waitingForNext) return;

    clearInterval(timerInterval);
    waitingForNext = true;

    const q = questions[currentIndex];
    const isCorrect = chosen === q.answer;

    // Disable all buttons
    const allBtns = choicesEl.querySelectorAll('.choice-btn');
    allBtns.forEach(btn => {
      btn.disabled = true;
      // Highlight the correct answer
      if (parseInt(btn.textContent) === q.answer) {
        btn.classList.add('correct');
      }
    });

    if (isCorrect) {
      score++;
      feedbackEl.textContent = '✓ Correct!';
      feedbackEl.className = 'feedback correct';
    } else {
      clickedBtn.classList.add('incorrect');
      feedbackEl.textContent = `✗ Wrong — answer is ${q.answer}`;
      feedbackEl.className = 'feedback incorrect';
    }

    scoreDisplayEl.textContent = `Score: ${score}`;

    results.push({
      question: `${q.a} × ${q.b}`,
      correctAnswer: q.answer,
      userAnswer: chosen,
      correct: isCorrect
    });

    setTimeout(nextQuestion, 1200);
  }

  function startTimer() {
    clearInterval(timerInterval);
    timerDisplayEl.className = '';

    if (timeLimit === 0) {
      timerDisplayEl.textContent = '';
      return;
    }

    timeRemaining = timeLimit;
    timerDisplayEl.textContent = `${timeRemaining}s`;

    timerInterval = setInterval(() => {
      timeRemaining--;
      timerDisplayEl.textContent = `${timeRemaining}s`;

      if (timeRemaining <= 3) {
        timerDisplayEl.className = 'warning';
      }

      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        handleTimeout();
      }
    }, 1000);
  }

  function handleTimeout() {
    if (waitingForNext) return;
    waitingForNext = true;

    const q = questions[currentIndex];

    // Disable all buttons and highlight correct
    const allBtns = choicesEl.querySelectorAll('.choice-btn');
    allBtns.forEach(btn => {
      btn.disabled = true;
      if (parseInt(btn.textContent) === q.answer) {
        btn.classList.add('correct');
      }
    });

    feedbackEl.textContent = `⏱️ Time's up! Answer: ${q.answer}`;
    feedbackEl.className = 'feedback incorrect';

    results.push({
      question: `${q.a} × ${q.b}`,
      correctAnswer: q.answer,
      userAnswer: '—',
      correct: false
    });

    setTimeout(nextQuestion, 1500);
  }

  function nextQuestion() {
    currentIndex++;
    if (currentIndex >= questions.length) {
      endQuiz();
    } else {
      showQuestion();
    }
  }

  function endQuiz() {
    clearInterval(timerInterval);
    const totalTime = Math.round((Date.now() - quizStartTime) / 1000);
    const total = results.length;
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;

    resultScore.textContent = score;
    resultTotal.textContent = total;
    resultPercent.textContent = `${percent}%`;
    resultTime.textContent = `${totalTime}s`;

    renderResultsTable();
    showScreen(resultsScreen);
  }

  function renderResultsTable() {
    if (results.length === 0) {
      resultsDetail.innerHTML = '<p style="padding:1rem;text-align:center;color:var(--text-muted)">No questions answered.</p>';
      return;
    }

    let html = '<table><thead><tr><th>#</th><th>Question</th><th>Your Answer</th><th>Correct</th></tr></thead><tbody>';

    results.forEach((r, i) => {
      const rowClass = r.correct ? 'right' : 'wrong';
      html += `<tr class="${rowClass}">
        <td>${i + 1}</td>
        <td>${r.question}</td>
        <td>${r.userAnswer}</td>
        <td>${r.correctAnswer}</td>
      </tr>`;
    });

    html += '</tbody></table>';
    resultsDetail.innerHTML = html;
  }

  // --- Utilities ---
  function showScreen(screen) {
    [settingsScreen, quizScreen, resultsScreen].forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
  }

  // --- Start ---
  init();
})();
