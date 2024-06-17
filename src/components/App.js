import { useState } from "react";
import { Navbar, SearchBar, NumResult } from "./Navbar";
import { Box } from "./Box";
import { MoviesList } from "./MoviesList";
import { Summary, WatchedMovieList } from "./Summary";
import MovieDetails from "./MovieDetails";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";




export default function App() {
  
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const {movies, error, loading} = useMovies(query);
  const [watched, setWatched] = useLocalStorageState();

  function onSelecting(id) {
    setSelected((selected) => (selected === id ? null : id));
  }
  function handleCloseMovie() {
    setSelected(null);
  }
  function handleDeleteWatchMovie(movie) {
    setWatched((prev) => prev.filter((elm) => elm.imdbID !== movie.imdbID));
  }

  return (
    <>
      <Navbar>
        <SearchBar query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {error && <p className="error">{error}</p>}
          {loading && <p className="loader">LOADING...</p>}
          {!loading && !error && (
            <MoviesList movies={movies} onSelecting={onSelecting} />
          )}
        </Box>
        <Box>
          {selected ? (
            <MovieDetails
              id={selected}
              handleCloseMovie={handleCloseMovie}
              watched={watched}
              setWatched={setWatched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDelete={handleDeleteWatchMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
