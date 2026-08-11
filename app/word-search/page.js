"use client";

import { useMemo, useState } from "react";

const WORDS = [
  {
    phonemes: ["/θ/", "/ɪ/", "/n/"],
    english: "THIN",
  },
  {
    phonemes: ["/ʃ/", "/ɪ/", "/p/"],
    english: "SHIP",
  },
  {
    phonemes: ["/tʃ/", "/ɛ/", "/k/"],
    english: "CHECK",
  },
  {
    phonemes: ["/s/", "/iː/", "/t/"],
    english: "SEAT",
  },
  {
    phonemes: ["/k/", "/æ/", "/t/"],
    english: "CAT",
  },
];

const PHONEME_HINTS = {
  "/θ/": "TH (as in thin)",
  "/ɪ/": "I (as in sit)",
  "/ʃ/": "SH (as in ship)",
  "/p/": "P (as in pen)",
  "/tʃ/": "CH (as in check)",
  "/ɛ/": "E (as in bed)",
  "/k/": "K (as in cat)",
  "/s/": "S (as in sun)",
  "/iː/": "EE (as in see)",
  "/t/": "T (as in top)",
  "/æ/": "A (as in cat)",
  "/b/": "B (as in bat)",
  "/d/": "D (as in dog)",
  "/g/": "G (as in go)",
  "/m/": "M (as in man)",
  "/n/": "N (as in no)",
  "/z/": "Z (as in zoo)",
  "/f/": "F (as in fish)",
  "/v/": "V (as in van)",
};

const GRID_SIZE = 10;

const DIRECTIONS = [
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 1, col: 1 },
  { row: 0, col: -1 },
  { row: -1, col: 0 },
  { row: -1, col: -1 },
  { row: 1, col: -1 },
  { row: -1, col: 1 },
];

function createEmptyGrid() {
  return Array.from(
    { length: GRID_SIZE },
    () => Array.from({ length: GRID_SIZE }, () => "")
  );
}

function canPlaceWord(grid, word, row, col, direction) {
  for (let i = 0; i < word.length; i++) {
    const currentRow = row + direction.row * i;
    const currentCol = col + direction.col * i;

    if (
      currentRow < 0 ||
      currentRow >= GRID_SIZE ||
      currentCol < 0 ||
      currentCol >= GRID_SIZE
    ) {
      return false;
    }

    const existing = grid[currentRow][currentCol];

    if (existing !== "" && existing !== word[i]) {
      return false;
    }
  }

  return true;
}

function placeWord(grid, word, row, col, direction) {
  word.forEach((phoneme, index) => {
    const currentRow = row + direction.row * index;
    const currentCol = col + direction.col * index;

    grid[currentRow][currentCol] = phoneme;
  });
}

function generatePuzzle(words) {
  const grid = createEmptyGrid();
  const placements = [];

  words.forEach((word) => {
    let placed = false;

    for (let attempt = 0; attempt < 500; attempt++) {
      const direction =
        DIRECTIONS[
          Math.floor(Math.random() * DIRECTIONS.length)
        ];

      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);

      if (
        canPlaceWord(
          grid,
          word.phonemes,
          row,
          col,
          direction
        )
      ) {
        placeWord(
          grid,
          word.phonemes,
          row,
          col,
          direction
        );

        placements.push({
          word,
          row,
          col,
          direction,
        });

        placed = true;
        break;
      }
    }

    if (!placed) {
      console.warn(
        `Could not place ${word.english}`
      );
    }
  });

  const fillerPhonemes = [
    "/p/",
    "/b/",
    "/t/",
    "/d/",
    "/k/",
    "/g/",
    "/m/",
    "/n/",
    "/s/",
    "/z/",
    "/f/",
    "/v/",
    "/ʃ/",
    "/θ/",
    "/ɪ/",
    "/æ/",
    "/ɛ/",
    "/iː/",
  ];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === "") {
        grid[row][col] =
          fillerPhonemes[
            Math.floor(
              Math.random() * fillerPhonemes.length
            )
          ];
      }
    }
  }

  return {
    grid,
    placements,
  };
}

export default function WordSearchPage() {
  const [difficulty, setDifficulty] =
    useState("medium");

  const [hintsEnabled, setHintsEnabled] =
    useState(true);

  const [foundWords, setFoundWords] =
    useState([]);

  const [selectedCells, setSelectedCells] =
    useState([]);

  const [puzzle, setPuzzle] =
    useState(() => generatePuzzle(WORDS));

  const [message, setMessage] = useState("");

  const regeneratePuzzle = () => {
    setPuzzle(generatePuzzle(WORDS));
    setFoundWords([]);
    setSelectedCells([]);
    setMessage("");
  };

  const phonemePositions = useMemo(() => {
    const positions = {};

    puzzle.placements.forEach((placement) => {
      const cells = [];

      placement.word.phonemes.forEach((_, index) => {
        cells.push({
          row:
            placement.row +
            placement.direction.row * index,

          col:
            placement.col +
            placement.direction.col * index,
        });
      });

      positions[placement.word.english] =
        cells;
    });

    return positions;
  }, [puzzle]);

  function handleCellClick(row, col) {
    const clickedKey = `${row}-${col}`;

    const existingIndex =
      selectedCells.findIndex(
        (cell) => cell.key === clickedKey
      );

    if (existingIndex !== -1) {
      setSelectedCells(
        selectedCells.filter(
          (_, index) =>
            index !== existingIndex
        )
      );

      return;
    }

    setSelectedCells([
      ...selectedCells,
      {
        row,
        col,
        key: clickedKey,
      },
    ]);

    setMessage("");
  }

  function checkSelection() {
    if (selectedCells.length < 2) {
      setMessage(
        "Select at least two phonemes."
      );
      return;
    }

    const selectedSet = selectedCells
      .map(
        (cell) =>
          `${cell.row}-${cell.col}`
      )
      .sort()
      .join("|");

    let matchedWord = null;

    Object.entries(
      phonemePositions
    ).forEach(([english, cells]) => {
      const wordSet = cells
        .map(
          (cell) =>
            `${cell.row}-${cell.col}`
        )
        .sort()
        .join("|");

      if (wordSet === selectedSet) {
        matchedWord = english;
      }
    });

    if (matchedWord) {
      if (
        !foundWords.includes(matchedWord)
      ) {
        setFoundWords([
          ...foundWords,
          matchedWord,
        ]);

        setMessage(
          `Found ${matchedWord}!`
        );
      } else {
        setMessage(
          `${matchedWord} has already been found.`
        );
      }

      setSelectedCells([]);
      return;
    }

    setMessage(
      "That selection does not match a word. Try again."
    );

    setSelectedCells([]);
  }

  function isSelected(row, col) {
    return selectedCells.some(
      (cell) =>
        cell.row === row &&
        cell.col === col
    );
  }

  function generateHTML() {
    const gridData =
      JSON.stringify(puzzle.grid);

    const wordsData =
      JSON.stringify(WORDS);

    const positionsData =
      JSON.stringify(phonemePositions);

    const hintsData =
      JSON.stringify(hintsEnabled);

    const difficultyData =
      JSON.stringify(difficulty);

    const phonemeHintsData =
      JSON.stringify(PHONEME_HINTS);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>PhonoPlay - Phoneme Word Search</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 20px;

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      background: #f5f7fb;
      color: #1f2937;
    }

    .container {
      width: 100%;
      max-width: 900px;

      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 25px;
    }

    .header h1 {
      margin: 0 0 8px;

      font-size: 28px;
    }

    .header p {
      margin: 0;

      color: #6b7280;
    }

    .game-panel {
      background: white;

      border: 1px solid #dfe3eb;
      border-radius: 14px;

      padding: 25px;

      box-shadow:
        0 4px 16px
        rgba(0, 0, 0, 0.05);
    }

    .status {
      display: flex;

      justify-content: space-between;
      align-items: center;

      gap: 15px;

      margin-bottom: 20px;

      flex-wrap: wrap;
    }

    .difficulty {
      color: #6b7280;

      font-size: 13px;
    }

    .progress {
      font-weight: 700;

      color: #4f46e5;
    }

    .grid {
      width: 100%;
      max-width: 620px;

      margin: 0 auto;

      display: grid;

      grid-template-columns:
        repeat(10, minmax(0, 1fr));

      border: 1px solid #dfe3eb;

      overflow: hidden;
    }

    .cell {
      width: 100%;

      min-width: 0;
      min-height: 0;

      aspect-ratio: 1 / 1;

      padding: 0;

      display: grid;
      place-items: center;

      border: 1px solid #dfe3eb;

      background: white;

      color: #1f2937;

      font-size: clamp(
        10px,
        2.2vw,
        18px
      );

      font-weight: 700;

      line-height: 1;

      cursor: pointer;

      overflow: hidden;
    }

    .cell:hover {
      background: #eef2ff;
      color: #4f46e5;
    }

    .cell.selected {
      background: #4f46e5;
      color: white;
    }

    .cell.found {
      background: #dcfce7;
      color: #15803d;
    }

    .message {
      min-height: 24px;

      margin: 18px auto 0;

      max-width: 620px;

      text-align: center;

      font-size: 14px;

      font-weight: 600;
    }

    .hint-box {
      max-width: 620px;

      margin: 18px auto 0;

      padding: 14px;

      border: 1px solid #dfe3eb;

      border-radius: 10px;

      background: #f8fafc;
    }

    .hint-title {
      margin-bottom: 10px;

      font-weight: 700;

      font-size: 13px;
    }

    .hint-list {
      display: flex;

      flex-wrap: wrap;

      gap: 7px;
    }

    .hint-item {
      display: inline-flex;

      align-items: center;

      gap: 6px;

      padding: 6px 9px;

      border-radius: 7px;

      background: white;

      border: 1px solid #dfe3eb;

      font-size: 11px;
    }

    .hint-item strong {
      color: #4f46e5;

      font-size: 13px;
    }

    .controls {
      display: flex;

      justify-content: center;

      gap: 10px;

      margin-top: 20px;

      flex-wrap: wrap;
    }

    button.control {
      padding: 10px 16px;

      border: 0;

      border-radius: 8px;

      cursor: pointer;

      font-weight: 600;

      font-size: 13px;
    }

    .clear {
      background: #eef2f7;
      color: #374151;
    }

    .check {
      background: #4f46e5;
      color: white;
    }

    .new-puzzle {
      background: #111827;
      color: white;
    }

    .word-list {
      max-width: 620px;

      margin: 30px auto 0;
    }

    .word-list h2 {
      font-size: 17px;

      margin: 0 0 12px;
    }

    .word {
      display: flex;

      align-items: center;

      justify-content: space-between;

      gap: 15px;

      padding: 12px;

      margin-bottom: 7px;

      border: 1px solid #dfe3eb;

      border-radius: 8px;

      background: #fafbfe;
    }

    .word-content {
      display: flex;

      flex-direction: column;

      gap: 4px;
    }

    .phonemes {
      font-weight: 700;
    }

    .english {
      color: #6b7280;

      font-size: 12px;
    }

    .word-status {
      color: #9ca3af;

      font-size: 12px;

      white-space: nowrap;
    }

    .word.found {
      border-color: #86efac;

      background: #f0fdf4;
    }

    .word.found .word-status {
      color: #15803d;

      font-weight: 700;
    }

    .complete {
      margin-top: 15px;

      padding: 14px;

      border-radius: 9px;

      background: #ecfdf5;

      color: #166534;

      text-align: center;
    }

    .complete strong,
    .complete span {
      display: block;
    }

    .complete span {
      margin-top: 4px;

      font-size: 13px;
    }

    @media (max-width: 600px) {
      body {
        padding: 10px;
      }

      .game-panel {
        padding: 15px;
      }

      .header h1 {
        font-size: 23px;
      }

      .grid {
        max-width: 100%;
      }

      .word {
        align-items: flex-start;

        flex-direction: column;
      }
    }
  </style>
</head>

<body>

  <div class="container">

    <header class="header">
      <h1>
        Phoneme Word Search
      </h1>

      <p>
        Find the hidden phoneme-based words.
      </p>
    </header>

    <main class="game-panel">

      <div class="status">

        <span class="difficulty">
          Difficulty:
          ${difficultyData.replace(
            /^"|"$/g,
            ""
          )}
        </span>

        <span
          class="progress"
          id="progress"
        >
          0 / ${WORDS.length} found
        </span>

      </div>

      <div
        class="grid"
        id="grid"
      ></div>

      <div
        class="hint-box"
        id="hintBox"
        style="display: none;"
      >
        <div class="hint-title">
          Selected phonemes
        </div>

        <div
          class="hint-list"
          id="hintList"
        ></div>
      </div>

      <div
        class="message"
        id="message"
        role="status"
        aria-live="polite"
      ></div>

      <div class="controls">

        <button
          class="control clear"
          id="clearButton"
        >
          Clear Selection
        </button>

        <button
          class="control check"
          id="checkButton"
        >
          Check Selection
        </button>

        <button
          class="control new-puzzle"
          onclick="location.reload()"
        >
          New Puzzle
        </button>

      </div>

      <section class="word-list">

        <h2>
          Find these words
        </h2>

        <div id="wordList"></div>

      </section>

    </main>

  </div>

  <script>
    const gridData = ${gridData};
    const wordsData = ${wordsData};
    const positionsData = ${positionsData};

    const hintsEnabled = ${hintsData};
    const phonemeHints = ${phonemeHintsData};

    const gridElement =
      document.getElementById("grid");

    const messageElement =
      document.getElementById("message");

    const progressElement =
      document.getElementById("progress");

    const wordListElement =
      document.getElementById("wordList");

    const hintBox =
      document.getElementById("hintBox");

    const hintList =
      document.getElementById("hintList");

    const clearButton =
      document.getElementById("clearButton");

    const checkButton =
      document.getElementById("checkButton");

    let selectedCells = [];
    let foundWords = [];

    function cellKey(row, col) {
      return row + "-" + col;
    }

    function isSelected(row, col) {
      return selectedCells.some(
        function(cell) {
          return (
            cell.row === row &&
            cell.col === col
          );
        }
      );
    }

    function isFound(row, col) {
      return foundWords.some(
        function(word) {
          const cells =
            positionsData[word] || [];

          return cells.some(
            function(cell) {
              return (
                cell.row === row &&
                cell.col === col
              );
            }
          );
        }
      );
    }

    function updateGrid() {
      gridElement.innerHTML = "";

      gridData.forEach(
        function(row, rowIndex) {

          row.forEach(
            function(phoneme, colIndex) {

              const button =
                document.createElement("button");

              button.className = "cell";

              button.textContent = phoneme;

              button.type = "button";

              if (
                isSelected(
                  rowIndex,
                  colIndex
                )
              ) {
                button.classList.add(
                  "selected"
                );
              }

              if (
                isFound(
                  rowIndex,
                  colIndex
                )
              ) {
                button.classList.add(
                  "found"
                );
              }

              if (hintsEnabled) {
                button.title =
                  phoneme +
                  " — " +
                  (
                    phonemeHints[phoneme] ||
                    "Phoneme hint unavailable"
                  );
              }

              button.addEventListener(
                "click",
                function() {
                  handleCellClick(
                    rowIndex,
                    colIndex
                  );
                }
              );

              gridElement.appendChild(
                button
              );
            }
          );
        }
      );
    }

    function updateHints() {
      if (
        !hintsEnabled ||
        selectedCells.length === 0
      ) {
        hintBox.style.display = "none";

        hintList.innerHTML = "";

        return;
      }

      hintBox.style.display = "block";

      hintList.innerHTML = "";

      selectedCells.forEach(
        function(cell) {

          const phoneme =
            gridData[cell.row][cell.col];

          const item =
            document.createElement("span");

          item.className =
            "hint-item";

          const phonemeElement =
            document.createElement("strong");

          phonemeElement.textContent =
            phoneme;

          const hintElement =
            document.createElement("span");

          hintElement.textContent =
            phonemeHints[phoneme] ||
            "Hint unavailable";

          item.appendChild(
            phonemeElement
          );

          item.appendChild(
            hintElement
          );

          hintList.appendChild(
            item
          );
        }
      );
    }

    function updateWordList() {
      wordListElement.innerHTML = "";

      wordsData.forEach(
        function(word) {

          const container =
            document.createElement("div");

          container.className = "word";

          if (
            foundWords.includes(
              word.english
            )
          ) {
            container.classList.add(
              "found"
            );
          }

          const content =
            document.createElement("div");

          content.className =
            "word-content";

          const phonemes =
            document.createElement("strong");

          phonemes.className =
            "phonemes";

          phonemes.textContent =
            word.phonemes.join(" ");

          content.appendChild(
            phonemes
          );

          if (hintsEnabled) {
            const english =
              document.createElement("small");

            english.className =
              "english";

            english.textContent =
              "English equivalent: " +
              word.english;

            content.appendChild(
              english
            );
          }

          const status =
            document.createElement("span");

          status.className =
            "word-status";

          status.textContent =
            foundWords.includes(
              word.english
            )
              ? "✓ Found"
              : "Not found";

          container.appendChild(
            content
          );

          container.appendChild(
            status
          );

          wordListElement.appendChild(
            container
          );
        }
      );
    }

    function updateProgress() {
      progressElement.textContent =
        foundWords.length +
        " / " +
        wordsData.length +
        " found";

      if (
        foundWords.length ===
        wordsData.length
      ) {
        messageElement.textContent =
          "Activity complete! You found all five phoneme words.";
      }
    }

    function handleCellClick(row, col) {
      const key =
        cellKey(row, col);

      const existingIndex =
        selectedCells.findIndex(
          function(cell) {
            return cell.key === key;
          }
        );

      if (
        existingIndex !== -1
      ) {
        selectedCells =
          selectedCells.filter(
            function(_, index) {
              return (
                index !==
                existingIndex
              );
            }
          );
      } else {
        selectedCells.push({
          row: row,
          col: col,
          key: key
        });
      }

      messageElement.textContent = "";

      updateGrid();
      updateHints();
    }

    function checkSelection() {
      if (
        selectedCells.length < 2
      ) {
        messageElement.textContent =
          "Select at least two phonemes.";

        return;
      }

      const selectedSet =
        selectedCells
          .map(
            function(cell) {
              return cellKey(
                cell.row,
                cell.col
              );
            }
          )
          .sort()
          .join("|");

      let matchedWord = null;

      Object.entries(
        positionsData
      ).forEach(
        function(entry) {

          const english =
            entry[0];

          const cells =
            entry[1];

          const wordSet =
            cells
              .map(
                function(cell) {
                  return cellKey(
                    cell.row,
                    cell.col
                  );
                }
              )
              .sort()
              .join("|");

          if (
            wordSet === selectedSet
          ) {
            matchedWord =
              english;
          }
        }
      );

      if (matchedWord) {

        if (
          !foundWords.includes(
            matchedWord
          )
        ) {
          foundWords.push(
            matchedWord
          );

          messageElement.textContent =
            "Found " +
            matchedWord +
            "!";

        } else {
          messageElement.textContent =
            matchedWord +
            " has already been found.";
        }

        selectedCells = [];

        updateGrid();
        updateHints();
        updateWordList();
        updateProgress();

        return;
      }

      messageElement.textContent =
        "That selection does not match a word. Try again.";

      selectedCells = [];

      updateGrid();
      updateHints();
    }

    clearButton.addEventListener(
      "click",
      function() {
        selectedCells = [];

        messageElement.textContent = "";

        updateGrid();
        updateHints();
      }
    );

    checkButton.addEventListener(
      "click",
      checkSelection
    );

    updateGrid();
    updateHints();
    updateWordList();
    updateProgress();
  </script>

</body>
</html>`;

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
      "phonoplay-word-search.html";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <div className="word-page">

      <section className="page-header">

        <span className="section-label-heading">
          ACTIVITY BUILDER
        </span>

        <h1>
          Phoneme Word Search
        </h1>

        <p>
          Create a phoneme-based word search
          activity for classroom use.
        </p>

      </section>

      <div className="builder-layout">

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
                Configure your word search.
              </p>

            </div>

          </div>

          <div className="form-group">

            <label>
              Word list
            </label>

            <div className="word-list">

              {WORDS.map((word) => (

                <div
                  className="word-list-item"
                  key={word.english}
                >

                  <span>
                    {word.phonemes.join(" ")}
                  </span>

                  <strong>
                    {word.english}
                  </strong>

                </div>

              ))}

            </div>

            <span className="form-help">
              Assessment 1 uses a fixed
              five-word phoneme list.
            </span>

          </div>

          <div className="form-group">

            <label>
              Difficulty
            </label>

            <div className="radio-group">

              {[
                "easy",
                "medium",
                "hard",
              ].map((level) => (

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

              ))}

            </div>

          </div>

          <div className="form-group">

            <label>
              Hints
            </label>

            <label className="checkbox-option">

              <input
                type="checkbox"
                checked={
                  hintsEnabled
                }
                onChange={(event) =>
                  setHintsEnabled(
                    event.target.checked
                  )
                }
              />

              <span>
                Show English equivalents
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
              onClick={
                regeneratePuzzle
              }
            >
              Generate New Puzzle
            </button>

          </div>

        </section>

        <section className="preview-panel">

          <div className="preview-header">

            <div>

              <span className="section-label">
                LIVE PREVIEW
              </span>

              <h2>
                Phoneme Word Search
              </h2>

            </div>

            <span className="preview-status">
              {foundWords.length} /{" "}
              {WORDS.length} found
            </span>

          </div>

          <div className="word-search-preview">

            <div
              className="search-grid"
              style={{
                gridTemplateColumns:
                  `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              }}
            >

              {puzzle.grid.map(
                (row, rowIndex) =>
                  row.map(
                    (phoneme, colIndex) => (

                      <button
                        key={`${rowIndex}-${colIndex}`}
                        className={`search-cell ${
                          isSelected(
                            rowIndex,
                            colIndex
                          )
                            ? "selected"
                            : ""
                        } ${
                          foundWords.some(
                            (word) =>
                              phonemePositions[
                                word
                              ]?.some(
                                (cell) =>
                                  cell.row ===
                                    rowIndex &&
                                  cell.col ===
                                    colIndex
                              )
                          )
                            ? "found"
                            : ""
                        }`}
                        onClick={() =>
                          handleCellClick(
                            rowIndex,
                            colIndex
                          )
                        }
                        title={
                          hintsEnabled
                            ? `${phoneme} — ${
                                PHONEME_HINTS[
                                  phoneme
                                ] ||
                                "Phoneme hint unavailable"
                              }`
                            : undefined
                        }
                      >
                        {phoneme}
                      </button>

                    )
                  )
              )}

            </div>

            {selectedCells.length > 0 &&
              hintsEnabled && (

                <div className="phoneme-hint">

                  <strong>
                    Selected phonemes:
                  </strong>

                  <div className="phoneme-hint-list">

                    {selectedCells.map(
                      (cell) => {

                        const phoneme =
                          puzzle.grid[
                            cell.row
                          ][cell.col];

                        return (
                          <span
                            key={cell.key}
                            className="phoneme-hint-item"
                          >

                            <strong>
                              {phoneme}
                            </strong>

                            <span>
                              {PHONEME_HINTS[
                                phoneme
                              ] ||
                                "Hint unavailable"}
                            </span>

                          </span>
                        );
                      }
                    )}

                  </div>

                </div>

              )}

            {message && (

              <div
                className="search-message"
                role="status"
                aria-live="polite"
              >
                {message}
              </div>

            )}

            <div className="search-controls">

              <button
                className="keyboard-delete"
                onClick={() => {
                  setSelectedCells([]);
                  setMessage("");
                }}
              >
                Clear Selection
              </button>

              <button
                className="keyboard-submit"
                onClick={checkSelection}
              >
                Check Selection
              </button>

            </div>

          </div>

          <div className="search-word-list">

            <div className="keyboard-heading">

              <div>

                <span className="section-label">
                  WORD LIST
                </span>

                <h3>
                  Find these words
                </h3>

              </div>

            </div>

            <div className="search-words">

              {WORDS.map((word) => {

                const found =
                  foundWords.includes(
                    word.english
                  );

                return (

                  <div
                    key={word.english}
                    className={`search-word ${
                      found
                        ? "search-word-found"
                        : ""
                    }`}
                  >

                    <div>

                      <strong>
                        {word.phonemes.join(
                          " "
                        )}
                      </strong>

                      {hintsEnabled && (
                        <small>
                          English equivalent:{" "}
                          {word.english}
                        </small>
                      )}

                    </div>

                    <span>
                      {found
                        ? "✓ Found"
                        : "Not found"}
                    </span>

                  </div>

                );
              })}

            </div>

            {foundWords.length ===
              WORDS.length && (

              <div className="complete-message">

                <strong>
                  Activity complete!
                </strong>

                <span>
                  You found all five
                  phoneme words.
                </span>

              </div>

            )}

          </div>

        </section>

      </div>

    </div>
  );
}