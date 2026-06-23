import { useState } from "react";
import { KeywordChip } from "./components/KeywordChip";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [keywordArray, setKeywordArray] = useState([]);
  const [keyword, setkeyword] = useState("");
  const [error, setError] = useState("");

  function handleKeywordButton(e) {
    e.preventDefault();
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) return; // prevent empty keywords

    if (keywordArray.includes(trimmedKeyword)) {
      // return a alert
      setError("Already added.");
      setkeyword("");
      return;
    }
    setKeywordArray((prev) => [...prev, trimmedKeyword]);
    setkeyword("");
  }
  function handleSearchButton() {
    if (!API_URL) {
      console.error("VITE_API_URL is not defined");
      return;
    }
    console.log("Sending request to:", `${API_URL}/search-jobs`);
    fetch(`${API_URL}/search-jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keywords: keywordArray
      })
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }

  function handleDelete(key) {
    const newKeywords = keywordArray.filter((keyword) => keyword !== key);
    setKeywordArray(newKeywords);
  }

  return (
    <>
      <div className="flex flex-col items-center gap-6 p-8">
        <h1>LinkedIn Job Scraper</h1>
        <div className="relative">
          <form
            onSubmit={handleKeywordButton}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={keyword}
              placeholder="Enter job role keywords..."
              onChange={(e) => {
                setkeyword(e.target.value);
                setError("");
              }}
              className="scraper-input"
            />
            <button className="input-btn" type="submit">
              Add
            </button>
          </form>
          {error && (
            <div className="absolute top-full left-0 mt-3 z-10 px-3 py-2 rounded-md text-sm bg-[var(--bg)] text-[var(--text-h)] border border-[var(--accent-border)] shadow-[var(--shadow)]">
              <div className="absolute -top-2 left-6 w-3 h-3 rotate-45 bg-[var(--bg)] border-l border-t border-[var(--accent-border)]"></div>
              {error}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 justify-center max-w-3xl">
          {keywordArray.length > 0 &&
            keywordArray.map((keyword) => (
              <KeywordChip
                key={keyword}
                keyword={keyword}
                handleDelete={handleDelete}
              />
            ))}
        </div>

        <button className="input-btn" onClick={handleSearchButton}>
          Search jobs
        </button>
      </div>
    </>
  );
}
