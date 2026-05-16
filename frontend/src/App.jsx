import "./App.css";
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  function handleClick() {
    if (!API_URL) {
      console.error("VITE_API_URL is not defined");
      return;
    }

    fetch(`${API_URL}/search-jobs`)
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }

  return (
    <>
      <button className="search-job-button" onClick={handleClick}>
        Search jobs
      </button>
    </>
  );
}

export default App;
