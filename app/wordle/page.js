"use client";

import { useState } from "react";

const PHONEMES = [
  {
    symbol: "/θ/",
    label: "TH",
    example: "thin",
  },
  {
    symbol: "/ð/",
    label: "TH",
    example: "this",
  },
  {
    symbol: "/ʃ/",
    label: "SH",
    example: "ship",
  },
  {
    symbol: "/tʃ/",
    label: "CH",
    example: "chair",
  },
  {
    symbol: "/ŋ/",
    label: "NG",
    example: "sing",
  },
  {
    symbol: "/ɪ/",
    label: "I",
    example: "sit",
  },
  {
    symbol: "/iː/",
    label: "EE",
    example: "see",
  },
  {
    symbol: "/æ/",
    label: "A",
    example: "cat",
  },
  {
    symbol: "/ʌ/",
    label: "U",
    example: "cup",
  },
  {
    symbol: "/ɑː/",
    label: "AR",
    example: "car",
  },
  {
    symbol: "/p/",
    label: "P",
    example: "pig",
  },
  {
    symbol: "/b/",
    label: "B",
    example: "bat",
  },
  {
    symbol: "/t/",
    label: "T",
    example: "top",
  },
  {
    symbol: "/d/",
    label: "D",
    example: "dog",
  },
  {
    symbol: "/k/",
    label: "K",
    example: "cat",
  },
  {
    symbol: "/g/",
    label: "G",
    example: "go",
  },
  {
    symbol: "/m/",
    label: "M",
    example: "man",
  },
  {
    symbol: "/n/",
    label: "N",
    example: "net",
  },
  {
    symbol: "/s/",
    label: "S",
    example: "sun",
  },
  {
    symbol: "/z/",
    label: "Z",
    example: "zoo",
  },
];

const TARGET_WORD = ["/θ/", "/ɪ/", "/n/"];

const ENGLISH_WORD = "THIN";

const MAX_GUESSES = 6;

export default function WordlePage() {
  const [targetWord, setTargetWord] = useState(TARGET_WORD);
  const [currentGuess, setCurrentGuess] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState("playing");
  const [difficulty, setDifficulty] = useState("medium");
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [message, setMessage] = useState("");

  function addPhoneme(phoneme) {
    if (gameStatus !== "playing") {
      return;
    }

    if (currentGuess.length >= targetWord.length) {
      setMessage("Your guess is already full.");
      return;
    }

    setCurrentGuess((previous) => [
      ...previous,
      phoneme,
    ]);

    setMessage("");
  }

  function removePhoneme() {
    if (gameStatus !== "playing") {
      return;
    }

    setCurrentGuess((previous) =>
      previous.slice(0, -1)
    );

    setMessage("");
  }

  function submitGuess() {
    if (currentGuess.length !== targetWord.length) {
      setMessage(
        `Please enter ${targetWord.length} phonemes.`
      );

      return;
    }

    const guess = [...currentGuess];

    setGuesses((previous) => [
      ...previous,
      guess,
    ]);

    setCurrentGuess([]);

    const correct = guess.every(
      (phoneme, index) =>
        phoneme === targetWord[index]
    );

    if (correct) {
      setGameStatus("won");
      setMessage("Correct!");
    } else if (
      guesses.length + 1 >= MAX_GUESSES
    ) {
      setGameStatus("lost");
      setMessage("Game over!");
    } else {
      setMessage("Try again.");
    }
  }

  function resetGame() {
    setCurrentGuess([]);
    setGuesses([]);
    setGameStatus("playing");
    setMessage("");
  }

  function getTileStatus(phoneme, index) {
    if (phoneme === targetWord[index]) {
      return "correct";
    }

    if (targetWord.includes(phoneme)) {
      return "present";
    }

    return "incorrect";
  }

  function getKeyboardStatus(phoneme) {
    let bestStatus = "";

    for (const guess of guesses) {
      guess.forEach((guessedPhoneme, index) => {
        if (guessedPhoneme !== phoneme) {
          return;
        }

        if (
          guessedPhoneme === targetWord[index]
        ) {
          bestStatus = "correct";
        } else if (
          bestStatus !== "correct" &&
          targetWord.includes(guessedPhoneme)
        ) {
          bestStatus = "present";
        } else if (bestStatus === "") {
          bestStatus = "incorrect";
        }
      });
    }

    return bestStatus;
  }

  function generateHTML() {
    const phonemeData = JSON.stringify(PHONEMES);
    const targetData = JSON.stringify(targetWord);
    const hintsData = JSON.stringify(hintsEnabled);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Phonoplay - Phoneme Wordle</title>

<style>
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 30px 20px;
    background: #f6f7fb;
    color: #18202f;
    font-family: Arial, Helvetica, sans-serif;
  }

  .game {
    width: min(100%, 700px);
    margin: 0 auto;
    background: white;
    border: 1px solid #e2e5ec;
    border-radius: 14px;
    box-shadow: 0 10px 30px rgba(25, 32, 50, 0.08);
    overflow: hidden;
  }

  .header {
    padding: 24px;
    border-bottom: 1px solid #e2e5ec;
  }

  .header h1 {
    margin: 0;
    font-size: 24px;
  }

  .header p {
    margin: 7px 0 0;
    color: #687083;
    font-size: 14px;
  }

  .game-area {
    padding: 30px 20px;
    text-align: center;
  }

  .instruction {
    margin-bottom: 25px;
    color: #687083;
    font-size: 14px;
  }

  .wordle-grid {
    display: grid;
    grid-template-columns: repeat(${targetWord.length}, 64px);
    gap: 7px;
    justify-content: center;
  }

  .wordle-tile {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border: 2px solid #e2e5ec;
    border-radius: 7px;
    background: white;
    color: #000000;
    font-size: 14px;
    font-weight: 700;
  }

  .wordle-tile.correct {
    background: #1a9b67;
    border-color: #1a9b67;
    color: white;
  }

  .wordle-tile.present {
    background: #d99b20;
    border-color: #d99b20;
    color: white;
  }

  .wordle-tile.incorrect {
    background: #747b88;
    border-color: #747b88;
    color: white;
  }

  .message {
    margin-top: 22px;
    color: #687083;
    font-size: 14px;
    font-weight: 600;
  }

  .message.success {
    color: #1a9b67;
  }

  .answer {
    margin-top: 30px;
    color: #687083;
    font-size: 13px;
  }

  .answer strong {
    display: block;
    margin-top: 5px;
    color: #635bff;
    font-size: 25px;
  }

  .answer small {
    display: block;
    margin-top: 3px;
    color: #8c94a5;
  }

  .keyboard-section {
    padding: 25px;
    border-top: 1px solid #e2e5ec;
  }

  .keyboard-heading {
    margin-bottom: 18px;
    text-align: left;
  }

  .keyboard-heading h2 {
    margin: 4px 0 0;
    font-size: 17px;
  }

  .phoneme-keyboard {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 7px;
  }

  .phoneme-key {
    position: relative;
    min-width: 54px;
    min-height: 42px;
    padding: 7px 10px;
    background: white;
    border: 1px solid #e2e5ec;
    border-radius: 8px;
    color: #18202f;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }

  .phoneme-key:hover:not(:disabled) {
    background: #eeecff;
    border-color: #635bff;
    color: #635bff;
  }

  .phoneme-key:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .phoneme-key.correct {
    background: #1a9b67;
    border-color: #1a9b67;
    color: white;
  }

  .phoneme-key.present {
    background: #d99b20;
    border-color: #d99b20;
    color: white;
  }

  .phoneme-key.incorrect {
    background: #747b88;
    border-color: #747b88;
    color: white;
  }

  .phoneme-key.correct:hover,
  .phoneme-key.present:hover,
  .phoneme-key.incorrect:hover {
    color: white;
  }

  .phoneme-tooltip {
    position: absolute;
    left: 50%;
    bottom: calc(100% + 9px);
    transform: translateX(-50%) translateY(5px);

    width: max-content;
    max-width: 180px;

    padding: 8px 10px;

    background: #171b24;
    color: #f1f3f7;

    border: 1px solid #303746;
    border-radius: 7px;

    font-size: 11px;
    font-weight: 500;

    opacity: 0;
    visibility: hidden;
    pointer-events: none;

    transition:
      opacity 0.15s ease,
      transform 0.15s ease;

    z-index: 20;
  }

  .phoneme-tooltip::after {
    content: "";

    position: absolute;
    left: 50%;
    top: 100%;

    transform: translateX(-50%);

    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #303746;
  }

  .phoneme-key:hover .phoneme-tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }

  .keyboard-actions {
    display: flex;
    gap: 8px;
    margin-top: 18px;
  }

  .keyboard-delete,
  .keyboard-submit {
    min-height: 42px;
    padding: 0 15px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }

  .keyboard-delete {
    border: 1px solid #e2e5ec;
    background: white;
    color: #18202f;
  }

  .keyboard-delete:hover {
    background: #f0f2f7;
  }

  .keyboard-submit {
    flex: 1;
    border: none;
    background: #635bff;
    color: white;
  }

  .keyboard-submit:hover {
    background: #5048d9;
  }

  @media (max-width: 600px) {
    body {
      padding: 15px 10px;
    }

    .wordle-grid {
      grid-template-columns: repeat(${targetWord.length}, 55px);
      gap: 5px;
    }

    .wordle-tile {
      width: 55px;
      height: 55px;
      font-size: 12px;
    }

    .keyboard-section {
      padding: 18px;
    }
  }
</style>
</head>

<body>

<div class="game">

  <div class="header">
    <h1>Phoneme Wordle</h1>
    <p>Guess the phoneme word</p>
  </div>

  <div class="game-area">

    <div class="instruction">
      Select phonemes from the keyboard below.
    </div>

    <div id="wordleGrid" class="wordle-grid"></div>

    <div id="message" class="message"></div>

    <div id="answer" class="answer"></div>

  </div>

  <div class="keyboard-section">

    <div class="keyboard-heading">
      <h2>Select a phoneme</h2>
    </div>

    <div id="keyboard" class="phoneme-keyboard"></div>

    <div class="keyboard-actions">

      <button
        id="deleteButton"
        class="keyboard-delete"
      >
        ← Delete
      </button>

      <button
        id="submitButton"
        class="keyboard-submit"
      >
        Submit Guess
      </button>

    </div>

  </div>

</div>

<script>
  const PHONEMES = ${phonemeData};
  const TARGET_WORD = ${targetData};
  const HINTS_ENABLED = ${hintsData};

  const MAX_GUESSES = 6;

  const ENGLISH_WORD = "THIN";

  let currentGuess = [];
  let guesses = [];
  let gameStatus = "playing";

  const grid = document.getElementById("wordleGrid");
  const keyboard = document.getElementById("keyboard");
  const message = document.getElementById("message");
  const answer = document.getElementById("answer");

  function getTileStatus(phoneme, index) {
    if (phoneme === TARGET_WORD[index]) {
      return "correct";
    }

    if (TARGET_WORD.includes(phoneme)) {
      return "present";
    }

    return "incorrect";
  }

  function getKeyboardStatus(phoneme) {
    let bestStatus = "";

    for (const guess of guesses) {
      guess.forEach((guessedPhoneme, index) => {

        if (guessedPhoneme !== phoneme) {
          return;
        }

        if (guessedPhoneme === TARGET_WORD[index]) {
          bestStatus = "correct";
        } else if (
          bestStatus !== "correct" &&
          TARGET_WORD.includes(guessedPhoneme)
        ) {
          bestStatus = "present";
        } else if (bestStatus === "") {
          bestStatus = "incorrect";
        }

      });
    }

    return bestStatus;
  }

  function renderGrid() {
    grid.innerHTML = "";

    for (let row = 0; row < MAX_GUESSES; row++) {

      const guess = guesses[row];

      for (let column = 0; column < TARGET_WORD.length; column++) {

        let phoneme = "";

        if (guess) {
          phoneme = guess[column] || "";
        } else if (row === guesses.length) {
          phoneme = currentGuess[column] || "";
        }

        let status = "";

        if (guess && phoneme) {
          status = getTileStatus(
            phoneme,
            column
          );
        }

        const tile = document.createElement("div");

        tile.className =
          "wordle-tile " + status;

        tile.textContent = phoneme;

        grid.appendChild(tile);
      }
    }
  }

  function renderKeyboard() {
    keyboard.innerHTML = "";

    PHONEMES.forEach((phoneme) => {

      const button =
        document.createElement("button");

      button.className =
        "phoneme-key " +
        getKeyboardStatus(phoneme.symbol);

      button.textContent = phoneme.symbol;

      button.disabled =
        gameStatus !== "playing";

      if (HINTS_ENABLED) {

        const tooltip =
          document.createElement("span");

        tooltip.className =
          "phoneme-tooltip";

        tooltip.textContent =
          phoneme.label +
          " (as in " +
          phoneme.example +
          ")";

        button.appendChild(tooltip);
      }

      button.addEventListener(
        "click",
        function () {
          addPhoneme(phoneme.symbol);
        }
      );

      keyboard.appendChild(button);
    });
  }

  function render() {
    renderGrid();
    renderKeyboard();
  }

  function addPhoneme(phoneme) {

    if (gameStatus !== "playing") {
      return;
    }

    if (
      currentGuess.length >=
      TARGET_WORD.length
    ) {
      message.textContent =
        "Your guess is already full.";

      return;
    }

    currentGuess.push(phoneme);

    message.textContent = "";

    render();
  }

  function removePhoneme() {

    if (gameStatus !== "playing") {
      return;
    }

    currentGuess.pop();

    message.textContent = "";

    render();
  }

  function submitGuess() {

    if (
      currentGuess.length !==
      TARGET_WORD.length
    ) {
      message.textContent =
        "Please enter " +
        TARGET_WORD.length +
        " phonemes.";

      return;
    }

    const guess = [...currentGuess];

    guesses.push(guess);

    currentGuess = [];

    const correct = guess.every(
      function (phoneme, index) {
        return phoneme === TARGET_WORD[index];
      }
    );

    if (correct) {

      gameStatus = "won";

      message.textContent = "Correct!";

      message.className =
        "message success";

      answer.innerHTML =
        "<span>English equivalent</span>" +
        "<strong>" +
        ENGLISH_WORD +
        "</strong>" +
        "<small>" +
        TARGET_WORD.join(" ") +
        "</small>";

    } else if (
      guesses.length >= MAX_GUESSES
    ) {

      gameStatus = "lost";

      message.textContent =
        "Game over!";

      answer.innerHTML =
        "<span>The answer was</span>" +
        "<strong>" +
        ENGLISH_WORD +
        "</strong>" +
        "<small>" +
        TARGET_WORD.join(" ") +
        "</small>";

    } else {

      message.textContent =
        "Try again.";

    }

    render();
  }

  document
    .getElementById("deleteButton")
    .addEventListener(
      "click",
      removePhoneme
    );

  document
    .getElementById("submitButton")
    .addEventListener(
      "click",
      submitGuess
    );

  render();
</script>

</body>
</html>`;

    const blob = new Blob(
      [html],
      { type: "text/html" }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "phonoplay-wordle.html";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <div className="builder-page">

      <section className="page-header">

        <span className="section-label-heading">
          ACTIVITY BUILDER
        </span>

        <h1>
          Phoneme Wordle
        </h1>

        <p>
          Configure a phoneme-based Wordle
          activity, preview the result and
          generate a standalone HTML file.
        </p>

      </section>

      <div className="builder-layout">

        {/* SETTINGS */}

        <section className="builder-panel">

          <div className="panel-heading">

            <span className="panel-number">
              01
            </span>

            <div>

              <h2>
                Activity Settings
              </h2>

              <p>
                Configure your Wordle activity.
              </p>

            </div>

          </div>

          <div className="form-group">

            <label htmlFor="target">
              Target phoneme word
            </label>

            <input
              id="target"
              type="text"
              value={targetWord.join(" ")}
              onChange={(event) => {

                const newWord =
                  event.target.value
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean);

                if (newWord.length > 0) {

                  setTargetWord(newWord);
                  setCurrentGuess([]);
                  setGuesses([]);
                  setGameStatus("playing");
                  setMessage("");

                }

              }}
            />

            <span className="form-help">
              Example: /θ/ /ɪ/ /n/
            </span>

          </div>

          <div className="form-group">

            <label>
              Difficulty
            </label>

            <div className="radio-group">

              {["easy", "medium", "hard"].map(
                (level) => (

                  <label
                    className="radio-option"
                    key={level}
                  >

                    <input
                      type="radio"
                      name="difficulty"
                      checked={
                        difficulty === level
                      }
                      onChange={() =>
                        setDifficulty(level)
                      }
                    />

                    <span>
                      {level
                        .charAt(0)
                        .toUpperCase() +
                        level.slice(1)}
                    </span>

                  </label>

                )
              )}

            </div>

          </div>

          <div className="form-group">

            <label>
              Hints
            </label>

            <label className="checkbox-option">

              <input
                type="checkbox"
                checked={hintsEnabled}
                onChange={(event) =>
                  setHintsEnabled(
                    event.target.checked
                  )
                }
              />

              <span>
                Enable phoneme-to-English hints
              </span>

            </label>

          </div>

          <div className="builder-actions">

            <button
              className="generate-button"
              onClick={generateHTML}
            >
              Generate HTML
              <span>↓</span>
            </button>

            <button
              className="reset-button"
              onClick={resetGame}
            >
              Reset Activity
            </button>

          </div>

        </section>

        {/* PREVIEW */}

        <section className="preview-panel">

          <div className="preview-header">

            <div>

              <span className="section-label">
                LIVE PREVIEW
              </span>

              <h2>
                Phoneme Wordle
              </h2>

            </div>

            <span className="preview-status">
              {gameStatus === "playing"
                ? "Playing"
                : gameStatus === "won"
                ? "Complete"
                : "Finished"}
            </span>

          </div>

          <div className="wordle-preview">

            <p className="preview-instruction">
              Guess the phoneme word
            </p>

            <div
              className="wordle-grid"
              style={{
                gridTemplateColumns:
                  `repeat(${targetWord.length}, 64px)`,
              }}
            >

              {Array.from(
                { length: MAX_GUESSES },
                (_, rowIndex) => {

                  const guess =
                    guesses[rowIndex];

                  return Array.from(
                    {
                      length:
                        targetWord.length,
                    },
                    (_, columnIndex) => {

                      const phoneme =
                        guess
                          ? guess[columnIndex]
                          : rowIndex ===
                              guesses.length
                          ? currentGuess[
                              columnIndex
                            ]
                          : "";

                      let status = "";

                      if (guess) {
                        status =
                          getTileStatus(
                            phoneme,
                            columnIndex
                          );
                      }

                      return (
                        <div
                          key={`${rowIndex}-${columnIndex}`}
                          className={`wordle-tile ${status}`}
                        >
                          {phoneme}
                        </div>
                      );

                    }
                  );

                }
              )}

            </div>

            {message && (

              <div
                className={`game-message ${
                  gameStatus === "won"
                    ? "success-message"
                    : ""
                }`}
              >
                {message}
              </div>

            )}

            {gameStatus === "won" && (

              <div className="preview-answer">

                <span>
                  English equivalent
                </span>

                <strong>
                  {ENGLISH_WORD}
                </strong>

                <small>
                  {targetWord.join(" ")}
                </small>

              </div>

            )}

            {gameStatus === "lost" && (

              <div className="preview-answer">

                <span>
                  The answer was
                </span>

                <strong>
                  {ENGLISH_WORD}
                </strong>

                <small>
                  {targetWord.join(" ")}
                </small>

              </div>

            )}

          </div>

          {/* PHONEME KEYBOARD */}

          <div className="phoneme-keyboard-section">

            <div className="keyboard-heading">

              <div>

                <span className="section-label">
                  PHONEME KEYBOARD
                </span>

                <h3>
                  Select a phoneme
                </h3>

              </div>

              <span className="keyboard-count">
                {currentGuess.length} /{" "}
                {targetWord.length}
              </span>

            </div>

            <div className="phoneme-keyboard">

              {PHONEMES.map((phoneme) => (

                <button
                  key={phoneme.symbol}
                  className={`phoneme-key ${getKeyboardStatus(
                    phoneme.symbol
                  )}`}
                  onClick={() =>
                    addPhoneme(
                      phoneme.symbol
                    )
                  }
                  disabled={
                    gameStatus !== "playing"
                  }
                >

                  {phoneme.symbol}

                  {hintsEnabled && (

                    <span className="phoneme-tooltip">
                      {phoneme.label}{" "}
                      (as in {phoneme.example})
                    </span>

                  )}

                </button>

              ))}

            </div>

            <div className="keyboard-actions">

              <button
                className="keyboard-delete"
                onClick={removePhoneme}
              >
                ← Delete
              </button>

              <button
                className="keyboard-submit"
                onClick={submitGuess}
              >
                Submit Guess
              </button>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}