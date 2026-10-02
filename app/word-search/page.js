"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

function createEmptyGrid(size) {
  return Array.from(
    { length: size },
    () => Array.from({ length: size }, () => "")
  );
}

function canPlaceWord(grid, word, row, col, direction) {
  for (let i = 0; i < word.length; i++) {
    const currentRow = row + direction.row * i;
    const currentCol = col + direction.col * i;

    if (
      currentRow < 0 ||
      currentRow >= grid.length ||
      currentCol < 0 ||
      currentCol >= grid.length
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

function generatePuzzle(words, size) {
  const grid = createEmptyGrid(size);
  const placements = [];

  words.forEach((word) => {
    let placed = false;

    for (let attempt = 0; attempt < 500; attempt++) {
      const direction =
        DIRECTIONS[
          Math.floor(Math.random() * DIRECTIONS.length)
        ];

      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);

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

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
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
  
    const pageStartTime = useRef(Date.now());

  useEffect(() => {
    fetch("/api/usage-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventType: "ACTIVITY_VIEWED",
        activityType: "WORD_SEARCH",
        success: true,
        details: "Word Search builder viewed",
      }),
    }).catch((error) => {
      console.error(
        "Failed to record activity view:",
        error
      );
    });

    return () => {
      const durationMs =
        Date.now() - pageStartTime.current;

      fetch("/api/usage-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        keepalive: true,
        body: JSON.stringify({
          eventType: "TIME_ON_PAGE",
          activityType: "WORD_SEARCH",
          durationMs,
          success: true,
          details: "Time spent on Word Search builder",
        }),
      }).catch((error) => {
        console.error(
          "Failed to record time on page:",
          error
        );
      });
    };
  }, []);

  const [hintsEnabled, setHintsEnabled] =
    useState(true);

  const [foundWords, setFoundWords] =
    useState([]);

  const [selectedCells, setSelectedCells] =
    useState([]);

  const [puzzle, setPuzzle] =
  useState(() => ({
    grid: createEmptyGrid(GRID_SIZE),
    placements: [],
  }));

  const [message, setMessage] = useState("");

  const [activityTitle, setActivityTitle] = useState(
  "My Word Search Activity"
  );

  const [maxGuesses, setMaxGuesses] = useState(6);

  const [gridSize, setGridSize] = useState(GRID_SIZE);

  const [outputFilename, setOutputFilename] = useState(
    "phonoplay-word-search.html"
  );

  const [savedActivityId, setSavedActivityId] = useState(null);

  const [saveMessage, setSaveMessage] = useState("");

  const [saving, setSaving] = useState(false);

  const [activityIdToLoad, setActivityIdToLoad] = useState("");

  const [loadingActivity, setLoadingActivity] = useState(false);

  const [activityWords, setActivityWords] = useState(WORDS);

  useEffect(() => {
    setPuzzle(generatePuzzle(WORDS, GRID_SIZE));
  }, []);

  const regeneratePuzzle = () => {
    setPuzzle(generatePuzzle(activityWords, gridSize));
    setFoundWords([]);
    setSelectedCells([]);
    setMessage("");
  };

  async function saveActivity() {
  setSaving(true);
  setSaveMessage("");

  try {
    const response = await fetch("/api/activities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: activityTitle,
        type: "WORD_SEARCH",
        difficulty,
        hintsEnabled,
        gridSize: gridSize,
        maxGuesses,
        outputFilename,
        words: activityWords.map((word) => ({
          english: word.english,
          phonemes: word.phonemes.join(" "),
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to save activity."
      );
    }

    setSavedActivityId(data.activity.id);
    setActivityIdToLoad(String(data.activity.id));
    setSaveMessage(
      `Activity saved successfully! Activity ID: ${data.activity.id}`
    );
  } catch (error) {
    console.error(
      "Failed to save activity:",
      error
    );

    setSaveMessage(
      error.message ||
        "Failed to save activity."
    );
  } finally {
    setSaving(false);
  }
}

async function loadActivity() {
  if (!activityIdToLoad) {
    setSaveMessage(
      "Please enter an activity ID."
    );
    return;
  }

  setLoadingActivity(true);
  setSaveMessage("");

  try {
    const response = await fetch(
      `/api/activities/${activityIdToLoad}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to load activity."
      );
    }

    const activity = data.activity;

    setSavedActivityId(activity.id);
    setActivityTitle(activity.title);
    setDifficulty(activity.difficulty);
    setHintsEnabled(activity.hintsEnabled);

    setMaxGuesses(activity.maxGuesses);

    setOutputFilename(
      activity.outputFilename ||
        "phonoplay-word-search.html"
    );

    setGridSize(activity.gridSize);

    if (
      activity.words &&
      activity.words.length > 0
    ) {
      const loadedWords =
        activity.words.map((word) => ({
          english: word.english,
          phonemes: word.phonemes
            .trim()
            .split(/\s+/),
        }));

      setActivityWords(loadedWords);

      setPuzzle(
        generatePuzzle(loadedWords, activity.gridSize)
      );
    }

    setFoundWords([]);
    setSelectedCells([]);
    setMessage("");

    setSaveMessage(
      "Activity loaded successfully!"
    );
  } catch (error) {
    console.error(
      "Failed to load activity:",
      error
    );

    setSaveMessage(
      error.message ||
        "Failed to load activity."
    );
  } finally {
    setLoadingActivity(false);
  }
}

async function updateActivity() {
  if (!savedActivityId) {
    setSaveMessage(
      "Please load or save an activity before updating it."
    );
    return;
  }

  setSaving(true);
  setSaveMessage("");

  try {
    const response = await fetch(
      `/api/activities/${savedActivityId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: activityTitle,
          type: "WORD_SEARCH",
          difficulty,
          hintsEnabled,
          gridSize: gridSize,
          maxGuesses,
          outputFilename,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to update activity."
      );
    }

    setSaveMessage(
      "Activity updated successfully!"
    );
  } catch (error) {
    console.error(
      "Failed to update activity:",
      error
    );

    setSaveMessage(
      error.message ||
        "Failed to update activity."
    );
  } finally {
    setSaving(false);
  }
}

async function deleteActivity() {
  if (!savedActivityId) {
    setSaveMessage(
      "Please load an activity before deleting it."
    );
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to delete this activity?"
  );

  if (!confirmed) {
    return;
  }

  setSaving(true);
  setSaveMessage("");

  try {
    const response = await fetch(
      `/api/activities/${savedActivityId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to delete activity."
      );
    }

    setSavedActivityId(null);
    setActivityIdToLoad("");
    setActivityWords(WORDS);

    setPuzzle(generatePuzzle(WORDS, GRID_SIZE));

    setFoundWords([]);
    setSelectedCells([]);
    setMessage("");

    setSaveMessage(
      "Activity deleted successfully!"
    );
  } catch (error) {
    console.error(
      "Failed to delete activity:",
      error
    );

    setSaveMessage(
      error.message ||
        "Failed to delete activity."
    );
  } finally {
    setSaving(false);
  }
}

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

  async function generateHTML() {
    const themeCookie =
      document.cookie
        .split("; ")
        .find((row) =>
          row.startsWith("phonoplay-theme=")
        )
        ?.split("=")[1];

    const selectedTheme =
      themeCookie === "dark" ||
      themeCookie === "system"
        ? themeCookie
        : "light";

  // Generate a fresh puzzle using the same word-placement
  // logic as the live preview. 
    const generatedPuzzle =
      generatePuzzle(activityWords, gridSize);

    const generatedPositions = {};

    generatedPuzzle.placements.forEach(
      (placement) => {
        const cells = [];

        placement.word.phonemes.forEach(
          (_, index) => {
            cells.push({
              row:
                placement.row +
                placement.direction.row * index,

              col:
                placement.col +
                placement.direction.col * index,
            });
          }
        );

        generatedPositions[
          placement.word.english
        ] = cells;
      }
    );

    const gridData =
      JSON.stringify(generatedPuzzle.grid);

    const gridSizeData =
      JSON.stringify(
        generatedPuzzle.grid[0]?.length || 10
      );

    const wordsData =
      JSON.stringify(activityWords);

    const positionsData =
      JSON.stringify(generatedPositions);

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
        repeat(${gridSizeData}, minmax(0, 1fr));

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

      /* Generated dark theme */
    ${selectedTheme === "dark" ? `
    body {
      background: #111827;
      color: #f3f4f6;
    }

    .header h1 {
      color: #f9fafb;
    }

    .header p {
      color: #9ca3af;
    }

    .game-panel {
      background: #1f2937;
      color: #f3f4f6;
      border-color: #374151;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
    }

    .difficulty {
      color: #9ca3af;
    }

    .progress {
      color: #a5b4fc;
    }

    .grid {
      border-color: #4b5563;
    }

    .cell {
      background: #374151;
      color: #f9fafb;
      border-color: #4b5563;
    }

    .cell:hover {
      background: #312e81;
      color: #a5b4fc;
    }

    .cell.selected {
      background: #4f46e5;
      color: white;
    }

    .cell.found {
      background: #166534;
      color: #dcfce7;
    }

    .message {
      color: #d1d5db;
    }

    .hint-box {
      background: #111827;
      border-color: #374151;
    }

    .hint-title {
      color: #f9fafb;
    }

    .hint-item {
      background: #374151;
      border-color: #4b5563;
      color: #f3f4f6;
    }

    .hint-item strong {
      color: #a5b4fc;
    }

    .clear {
      background: #374151;
      color: #f9fafb;
    }

    .clear:hover {
      background: #4b5563;
    }

    .check {
      background: #635bff;
      color: white;
    }

    .new-puzzle {
      background: #111827;
      color: white;
    }

    .word-list h2 {
      color: #f9fafb;
    }

    .word {
      background: #374151;
      border-color: #4b5563;
      color: #f3f4f6;
    }

    .english {
      color: #9ca3af;
    }

    .word-status {
      color: #9ca3af;
    }

    .word.found {
      background: #14532d;
      border-color: #22c55e;
    }

    .word.found .word-status {
      color: #86efac;
    }

    .complete {
      background: #064e3b;
      color: #d1fae5;
    }
    ` : ""}

    /* Generated system theme */
    ${selectedTheme === "system" ? `
    @media (prefers-color-scheme: dark) {
      body {
        background: #111827;
        color: #f3f4f6;
      }

      .header h1 {
        color: #f9fafb;
      }

      .header p {
        color: #9ca3af;
      }

      .game-panel {
        background: #1f2937;
        color: #f3f4f6;
        border-color: #374151;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
      }

      .difficulty {
        color: #9ca3af;
      }

      .progress {
        color: #a5b4fc;
      }

      .grid {
        border-color: #4b5563;
      }

      .cell {
        background: #374151;
        color: #f9fafb;
        border-color: #4b5563;
      }

      .cell:hover {
        background: #312e81;
        color: #a5b4fc;
      }

      .cell.selected {
        background: #4f46e5;
        color: white;
      }

      .cell.found {
        background: #166534;
        color: #dcfce7;
      }

      .message {
        color: #d1d5db;
      }

      .hint-box {
        background: #111827;
        border-color: #374151;
      }

      .hint-title {
        color: #f9fafb;
      }

      .hint-item {
        background: #374151;
        border-color: #4b5563;
        color: #f3f4f6;
      }

      .hint-item strong {
        color: #a5b4fc;
      }

      .clear {
        background: #374151;
        color: #f9fafb;
      }

      .clear:hover {
        background: #4b5563;
      }

      .check {
        background: #635bff;
        color: white;
      }

      .new-puzzle {
        background: #111827;
        color: white;
      }

      .word-list h2 {
        color: #f9fafb;
      }

      .word {
        background: #374151;
        border-color: #4b5563;
        color: #f3f4f6;
      }

      .english {
        color: #9ca3af;
      }

      .word-status {
        color: #9ca3af;
      }

      .word.found {
        background: #14532d;
        border-color: #22c55e;
      }

      .word.found .word-status {
        color: #86efac;
      }

      .complete {
        background: #064e3b;
        color: #d1fae5;
      }
    }
    ` : ""}
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
          0 / ${activityWords.length} found
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

        try {
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
        outputFilename;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      await fetch("/api/usage-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventType: "GENERATION_SUCCESS",
          activityId: savedActivityId,
          activityType: "WORD_SEARCH",
          success: true,
          details:
            `Generated Word Search HTML: ${outputFilename}`,
        }),
      });
    } catch (error) {
      console.error(
        "Failed to generate Word Search HTML:",
        error
      );

      try {
        await fetch("/api/usage-events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventType: "GENERATION_FAILED",
            activityId: savedActivityId,
            activityType: "WORD_SEARCH",
            success: false,
            details:
              error.message ||
              "Unknown Word Search generation error",
          }),
        });
      } catch (loggingError) {
        console.error(
          "Failed to record generation failure:",
          loggingError
        );
      }
    }
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

              {activityWords.map((word) => (

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

          <div className="form-group">

            <label htmlFor="grid-size">
              Grid size
            </label>

            <input
              id="grid-size"
              type="number"
              min="5"
              max="20"
              value={gridSize}
              onChange={(event) => {
                const newSize = Number(event.target.value);

                if (newSize >= 5 && newSize <= 20) {
                  setGridSize(newSize);
                }
              }}
            />

            <span className="form-help">
              Choose the size of the word search grid (5–20).
            </span>

          </div>

          <div className="form-group">
            <label htmlFor="activity-id">
              Activity ID
            </label>

            <input
              id="activity-id"
              type="number"
              min="1"
              value={activityIdToLoad}
              onChange={(event) =>
                setActivityIdToLoad(event.target.value)
              }
              placeholder="Enter activity ID"
            />

            <button
              className="generate-button"
              type="button"
              onClick={loadActivity}
              disabled={loadingActivity}
            >
              {loadingActivity
                ? "Loading..."
                : "Load Activity"}
            </button>

          </div>

          <div className="form-group">
            <label htmlFor="output-filename">
              Output filename
            </label>

            <input
              id="output-filename"
              type="text"
              value={outputFilename}
              onChange={(event) =>
                setOutputFilename(event.target.value)
              }
              placeholder="phonoplay-word-search.html"
            />

            <span className="form-help">
              Choose the filename for the generated HTML file.
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="activity-title">
              Activity title
            </label>

            <input
              id="activity-title"
              type="text"
              value={activityTitle}
              onChange={(event) =>
                setActivityTitle(event.target.value)
              }
              placeholder="My Word Search Activity"
            />

            <span className="form-help">
              Give your activity a name.
            </span>
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

            <button
              className="generate-button"
              onClick={saveActivity}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Activity"}
            </button>

            <button
              className="generate-button"
              onClick={updateActivity}
              disabled={saving || !savedActivityId}
            >
              {saving ? "Updating..." : "Update Activity"}
            </button>

            <button
              className="reset-button"
              onClick={deleteActivity}
              disabled={saving || !savedActivityId}
            >
              {saving ? "Deleting..." : "Delete Activity"}
            </button>

            {saveMessage && (
              <p className="form-help">
                {saveMessage}
              </p>
            )}

            

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
              {activityWords.length} found
            </span>

          </div>

          <div className="word-search-preview">

            <div
              className="search-grid"
              style={{
                gridTemplateColumns:
                  `repeat(${puzzle.grid[0]?.length || 10}, minmax(0, 1fr))`,
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

              {activityWords.map((word) => {

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
              activityWords.length && (

              <div className="complete-message">

                <strong>
                  Activity complete!
                </strong>

                <span>
                  You found all {activityWords.length} 
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