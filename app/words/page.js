"use client";

import { useEffect, useState } from "react";

export default function WordsPage() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [english, setEnglish] = useState("");
  const [phonemes, setPhonemes] = useState("");
  const [activityId, setActivityId] = useState("");
  const [message, setMessage] = useState("");

  const [editingWordId, setEditingWordId] = useState(null);
  const [editEnglish, setEditEnglish] = useState("");
  const [editPhonemes, setEditPhonemes] = useState("");

  useEffect(() => {
    loadWords();
  }, []);

  async function loadWords() {
    try {
      const response = await fetch("/api/words");

      if (!response.ok) {
        throw new Error("Failed to load words");
      }

      const data = await response.json();
      setWords(data.words || data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function createWord(event) {
  event.preventDefault();

  setMessage("");

  try {
    const response = await fetch("/api/words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        english,
        phonemes,
        activityId: Number(activityId),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Create word API response:", data);

        throw new Error(
            data.message ||
            data.error ||
            `Request failed with status ${response.status}`
        );
        }

    setWords((currentWords) => [data.word, ...currentWords]);

    setEnglish("");
    setPhonemes("");
    setActivityId("");
    setMessage("Word created successfully.");
  } catch (error) {
    setMessage(error.message);
  }
}

async function updateWord(wordId) {
  setMessage("");

  try {
    const response = await fetch(`/api/words/${wordId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        english: editEnglish,
        phonemes: editPhonemes,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        data.error ||
        "Failed to update word"
      );
    }

    setWords((currentWords) =>
      currentWords.map((word) =>
        word.id === wordId ? data.word : word
      )
    );

    setEditingWordId(null);
    setEditEnglish("");
    setEditPhonemes("");
    setMessage("Word updated successfully.");
  } catch (error) {
    setMessage(error.message);
  }
}

async function deleteWord(wordId) {
  setMessage("");

  try {
    const response = await fetch(`/api/words/${wordId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        data.error ||
        "Failed to delete word"
      );
    }

    setWords((currentWords) =>
      currentWords.filter((word) => word.id !== wordId)
    );

    setMessage("Word deleted successfully.");
  } catch (error) {
    setMessage(error.message);
  }
}

  return (
    <main className="page-container">
      <h1>Word Management</h1>

      <p>
        Create, view, edit, and delete words used by your activities.
      </p>

      <form onSubmit={createWord}>
  <div className="form-group">
    <label htmlFor="english-word">
      English word
    </label>

    <input
      id="english-word"
      type="text"
      value={english}
      onChange={(event) => setEnglish(event.target.value)}
      placeholder="e.g. DOG"
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="phonemes">
      Phonemes
    </label>

    <input
      id="phonemes"
      type="text"
      value={phonemes}
      onChange={(event) => setPhonemes(event.target.value)}
      placeholder="e.g. /d/ /ɒ/ /g/"
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="activity-id">
      Activity ID
    </label>

    <input
      id="activity-id"
      type="number"
      min="1"
      value={activityId}
      onChange={(event) => setActivityId(event.target.value)}
      placeholder="e.g. 1"
      required
    />
  </div>

  <button type="submit">
    Create Word
  </button>

  {message && <p>{message}</p>}
</form>

      {loading ? (
        <p>Loading words...</p>
      ) : words.length === 0 ? (
        <p>No words found.</p>
      ) : (
        <div>
          {words.map((word) => (
  <div key={word.id}>
    {editingWordId === word.id ? (
      <div>
        <input
          type="text"
          value={editEnglish}
          onChange={(event) =>
            setEditEnglish(event.target.value)
          }
        />

        <input
          type="text"
          value={editPhonemes}
          onChange={(event) =>
            setEditPhonemes(event.target.value)
          }
        />

        <button
          type="button"
          onClick={() => updateWord(word.id)}
        >
          Save
        </button>

        <button
          type="button"
          onClick={() => {
            setEditingWordId(null);
            setEditEnglish("");
            setEditPhonemes("");
          }}
        >
          Cancel
        </button>
      </div>
    ) : (
      <div>
        <strong>{word.english}</strong>
        <span> — {word.phonemes}</span>

        <button
          type="button"
          onClick={() => {
            setEditingWordId(word.id);
            setEditEnglish(word.english);
            setEditPhonemes(word.phonemes);
          }}
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => deleteWord(word.id)}
        >
          ❌
        </button>
      </div>
    )}
  </div>
))}
        </div>
      )}
    </main>
  );
}