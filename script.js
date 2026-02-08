const words = [
  { en: "apple", zh: "苹果", emoji: "🍎" },
  { en: "cat", zh: "猫", emoji: "🐱" },
  { en: "dog", zh: "狗", emoji: "🐶" },
  { en: "sun", zh: "太阳", emoji: "☀️" },
  { en: "car", zh: "汽车", emoji: "🚗" },
  { en: "book", zh: "书", emoji: "📚" },
  { en: "milk", zh: "牛奶", emoji: "🥛" },
  { en: "banana", zh: "香蕉", emoji: "🍌" }
];

const wordGrid = document.getElementById("word-grid");
const quizOptions = document.getElementById("quiz-options");
const quizHint = document.getElementById("quiz-word-hint");
const quizResult = document.getElementById("quiz-result");
const scoreNode = document.getElementById("score");
const streakNode = document.getElementById("streak");
const playWordBtn = document.getElementById("play-word");

let currentQuestion = null;
let score = 0;
let streak = 0;

function speak(text) {
  if (!window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function renderWordCards() {
  wordGrid.innerHTML = "";

  words.forEach((word) => {
    const card = document.createElement("button");
    card.className = "word-card";
    card.type = "button";
    card.role = "listitem";
    card.innerHTML = `
      <div class="emoji" aria-hidden="true">${word.emoji}</div>
      <p class="en">${word.en}</p>
      <p class="zh">${word.zh}</p>
    `;

    card.addEventListener("click", () => {
      speak(word.en);
    });

    wordGrid.appendChild(card);
  });
}

function getRandomItems(list, count) {
  const copied = [...list];
  const picked = [];

  while (picked.length < count && copied.length) {
    const index = Math.floor(Math.random() * copied.length);
    picked.push(copied.splice(index, 1)[0]);
  }

  return picked;
}

function createQuestion() {
  const answer = words[Math.floor(Math.random() * words.length)];
  const others = getRandomItems(
    words.filter((item) => item.en !== answer.en),
    2
  );

  const choices = [answer, ...others].sort(() => Math.random() - 0.5);
  return { answer, choices };
}

function renderQuestion() {
  currentQuestion = createQuestion();
  quizOptions.innerHTML = "";
  quizHint.textContent = "听一听：这个单词是哪一个？";
  quizResult.textContent = "";
  quizResult.className = "quiz-result";

  currentQuestion.choices.forEach((option) => {
    const optionBtn = document.createElement("button");
    optionBtn.type = "button";
    optionBtn.className = "option";
    optionBtn.innerHTML = `${option.emoji} ${option.zh} <small>(${option.en})</small>`;

    optionBtn.addEventListener("click", () => checkAnswer(option, optionBtn));

    quizOptions.appendChild(optionBtn);
  });

  speak(currentQuestion.answer.en);
}

function updateScore() {
  scoreNode.textContent = String(score);
  streakNode.textContent = String(streak);
}

function checkAnswer(option, selectedBtn) {
  if (!currentQuestion) return;

  const buttons = Array.from(quizOptions.querySelectorAll("button"));
  buttons.forEach((btn) => (btn.disabled = true));

  const isCorrect = option.en === currentQuestion.answer.en;

  if (isCorrect) {
    selectedBtn.classList.add("correct");
    quizResult.textContent = "太棒啦！答对了 🎉";
    quizResult.classList.add("ok");
    score += 10;
    streak += 1;
  } else {
    selectedBtn.classList.add("wrong");
    const correctBtn = buttons.find((btn) =>
      btn.textContent.includes(currentQuestion.answer.en)
    );
    if (correctBtn) correctBtn.classList.add("correct");
    quizResult.textContent = `再试一次～正确答案是 ${currentQuestion.answer.en}`;
    quizResult.classList.add("bad");
    streak = 0;
  }

  updateScore();
}

document.getElementById("next-question").addEventListener("click", renderQuestion);
playWordBtn.addEventListener("click", () => {
  if (currentQuestion) speak(currentQuestion.answer.en);
});

renderWordCards();
updateScore();
