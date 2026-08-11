"use client";

export default function GenerateButton({
  gameType,
  settings = {},
  className = "",
}) {
  function generateHTML() {
    const html =
      gameType === "wordle"
        ? generateWordleHTML(settings)
        : generateWordSearchHTML(settings);

    const blob = new Blob(
      [html],
      {
        type: "text/html",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      gameType === "wordle"
        ? "phonoplay-wordle.html"
        : "phonoplay-word-search.html";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      className={`generate-button ${className}`}
      onClick={generateHTML}
    >
      <span>↓</span>
      Generate HTML
    </button>
  );
}


/* =========================================
   WORDLE HTML
   ========================================= */

function generateWordleHTML(settings) {

  const answer =
    settings.answer || "/θɪn/";

  const english =
    settings.english || "THIN";

  const difficulty =
    settings.difficulty || "Medium";

  return `
<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>
    PhonoPlay Wordle
  </title>

  <style>

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      background: #f6f7fb;

      color: #18202f;

      min-height: 100vh;

      display: flex;

      align-items: center;

      justify-content: center;

      padding: 30px;
    }

    .game {
      width: 100%;

      max-width: 600px;

      background: white;

      border: 1px solid #e2e5ec;

      border-radius: 16px;

      padding: 30px;

      box-shadow:
        0 10px 30px
        rgba(0, 0, 0, 0.06);

      text-align: center;
    }

    h1 {
      margin-top: 0;

      color: #635bff;
    }

    .phoneme {
      margin: 20px 0;

      font-size: 32px;

      font-weight: 700;

      letter-spacing: 3px;
    }

    .difficulty {
      display: inline-block;

      padding: 6px 12px;

      border-radius: 20px;

      background: #eeecff;

      color: #635bff;

      font-size: 12px;

      font-weight: bold;
    }

    .instructions {
      color: #687083;

      line-height: 1.6;
    }

    .input {
      width: 100%;

      padding: 14px;

      margin-top: 20px;

      border: 1px solid #d8dce5;

      border-radius: 8px;

      font-size: 16px;

      text-align: center;
    }

    .button {
      margin-top: 12px;

      padding: 12px 24px;

      border: none;

      border-radius: 8px;

      background: #635bff;

      color: white;

      font-weight: bold;

      cursor: pointer;
    }

    .button:hover {
      background: #5148e5;
    }

    .feedback {
      margin-top: 20px;

      min-height: 30px;

      font-weight: bold;
    }

    .answer {
      margin-top: 15px;

      padding: 15px;

      border-radius: 8px;

      background: #e7f7ef;

      color: #176b4a;

      display: none;
    }

  </style>

</head>

<body>

  <main
    class="game"
    aria-labelledby="game-title"
  >

    <h1 id="game-title">
      PhonoPlay Wordle
    </h1>

    <span class="difficulty">
      ${difficulty}
    </span>

    <p class="instructions">
      Identify the English word represented
      by the phoneme sequence.
    </p>

    <div
      class="phoneme"
      aria-label="Phoneme word"
    >
      ${answer}
    </div>

    <input
      id="guess"
      class="input"
      type="text"
      placeholder="Enter your answer"
      aria-label="Enter your answer"
    >

    <button
      class="button"
      onclick="checkAnswer()"
    >
      Check Answer
    </button>

    <div
      id="feedback"
      class="feedback"
      aria-live="polite"
    ></div>

    <div
      id="answer"
      class="answer"
    >
      Correct! The English equivalent is
      <strong>${english}</strong>.
    </div>

  </main>

  <script>

    const correctAnswer =
      "${english.toLowerCase()}";

    function checkAnswer() {

      const input =
        document
          .getElementById("guess")
          .value
          .trim()
          .toLowerCase();

      const feedback =
        document.getElementById(
          "feedback"
        );

      const answer =
        document.getElementById(
          "answer"
        );

      if (!input) {

        feedback.textContent =
          "Please enter an answer.";

        return;
      }

      if (
        input === correctAnswer
      ) {

        feedback.textContent =
          "Correct! Great work.";

        answer.style.display =
          "block";

      } else {

        feedback.textContent =
          "Not quite. Try again.";

        answer.style.display =
          "none";

      }

    }

  </script>

</body>

</html>
`;
}


/* =========================================
   WORD SEARCH HTML
   ========================================= */

function generateWordSearchHTML(settings) {

  const words =
    settings.words || [
      "/θɪn/",
      "/ʃɪp/",
      "/fɪʃ/",
      "/tʃɪp/",
      "/dɒg/",
    ];

  const wordList =
    words
      .map(
        (word) =>
          `<li>${word}</li>`
      )
      .join("");

  return `
<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>
    PhonoPlay Word Search
  </title>

  <style>

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      background: #f6f7fb;

      color: #18202f;

      min-height: 100vh;

      padding: 30px;
    }

    .game {
      width: 100%;

      max-width: 800px;

      margin: 0 auto;

      background: white;

      border: 1px solid #e2e5ec;

      border-radius: 16px;

      padding: 30px;

      box-shadow:
        0 10px 30px
        rgba(0, 0, 0, 0.06);

      text-align: center;
    }

    h1 {
      color: #635bff;
    }

    .instructions {
      color: #687083;

      line-height: 1.6;
    }

    .word-list {
      display: flex;

      flex-wrap: wrap;

      justify-content: center;

      gap: 10px;

      padding: 0;

      margin: 25px 0;

      list-style: none;
    }

    .word-list li {
      padding: 8px 14px;

      border-radius: 20px;

      background: #eeecff;

      color: #635bff;

      font-weight: bold;
    }

    .search-grid {
      display: grid;

      grid-template-columns:
        repeat(8, 1fr);

      max-width: 500px;

      margin: 30px auto;

      border: 1px solid #d8dce5;
    }

    .cell {
      aspect-ratio: 1;

      display: flex;

      align-items: center;

      justify-content: center;

      border: 1px solid #e2e5ec;

      font-weight: bold;

      cursor: pointer;

      user-select: none;
    }

    .cell:hover {
      background: #eeecff;
    }

    .cell.selected {
      background: #635bff;

      color: white;
    }

    @media (max-width: 600px) {

      body {
        padding: 15px;
      }

      .game {
        padding: 20px;
      }

    }

  </style>

</head>

<body>

  <main class="game">

    <h1>
      PhonoPlay Word Search
    </h1>

    <p class="instructions">
      Find the phoneme sequences in the grid.
    </p>

    <ul class="word-list">
      ${wordList}
    </ul>

    <div
      class="search-grid"
      id="grid"
    ></div>

  </main>

  <script>

    const letters =
      "θʃɪftdʒkpmbn";

    const grid =
      document.getElementById("grid");

    for (
      let i = 0;
      i < 64;
      i++
    ) {

      const cell =
        document.createElement("div");

      cell.className = "cell";

      cell.textContent =
        letters[
          Math.floor(
            Math.random() *
            letters.length
          )
        ];

      cell.onclick = function() {

        cell.classList.toggle(
          "selected"
        );

      };

      grid.appendChild(cell);

    }

  </script>

</body>

</html>
`;
}