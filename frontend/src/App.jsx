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

  function handleDelete(key){
    const newKeywords = keywordArray.filter(keyword=> keyword !== key);
    setKeywordArray(newKeywords);
  }
  
  return (
    <>
      <div className="flex flex-col items-center gap-6 p-8">
        <h1>LinkedIn Job Scraper</h1>
        <form onSubmit={handleKeywordButton} className="flex items-center gap-3">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setkeyword(e.target.value)}
            className="scraper-input"
          />
          <button className="input-btn" type="submit">
            Add
          </button>
        </form>
        <div className="flex flex-wrap gap-2 justify-center max-w-3xl">
          {keywordArray.length > 0 &&
            keywordArray.map((keyword) => (
              <KeywordChip key={keyword} keyword={keyword} handleDelete={handleDelete}/>
            ))}
        </div>

        <button className="input-btn" onClick={handleSearchButton}>
          Search jobs
        </button>
      </div>
    </>
  );
}
