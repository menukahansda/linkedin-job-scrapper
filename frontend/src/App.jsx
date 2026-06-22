import { useState } from "react";
import { KeywordChip } from "./components/KeywordChip";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [keywordArray, setKeywordArray] = useState([]);
  const [keyword, setkeyword] = useState("");

  function handleKeywordButton(e) {
    e.preventDefault();
    if (!keyword.trim()) return; // prevent empty keywords

    setKeywordArray((prev) => [...prev, keyword.trim()]);
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
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }

  return (
    <>
      <div>
        <form onSubmit={handleKeywordButton}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setkeyword(e.target.value)}
          />
          <button className="input-btn" type="submit">
            Add
          </button>
        </form>
        <div className="flex flex-wrap gap-2 mt-6">
          {keywordArray.length > 0 &&
            keywordArray.map((keyword) => (
              <KeywordChip key={keyword} keyword={keyword} />
            ))}
        </div>

        <button className="input-btn" onClick={handleSearchButton}>
          Search jobs
        </button>
      </div>
    </>
  );
}
