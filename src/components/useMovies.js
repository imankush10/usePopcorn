import { useEffect, useRef, useState } from "react";

const API_KEY = "efb985aa";
const tempMovieData = [
    {
      imdbID: "tt1375666",
      Title: "Inception",
      Year: "2010",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    },
    {
      imdbID: "tt0133093",
      Title: "The Matrix",
      Year: "1999",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    },
    {
      imdbID: "tt6751668",
      Title: "Parasite",
      Year: "2019",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
    },
    {
      imdbID: "tt0816692",
      Title: "Interstellar",
      Year: "2014",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    },
    {
      imdbID: "tt1630029",
      Title: "Avatar: The Way of Water",
      Year: "2022",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_SX300.jpg",
    },
  ];

export function useMovies(query){

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [movies, setMovies] = useState();


const debounceTimeoutRef = useRef(null);
const abortControllerRef = useRef(null);

    useEffect(() => {
        async function fetchMovie() {
          setError("");
          if (query.length < 3) {
            setMovies(tempMovieData);
            setLoading(false);
            return;
          }
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
          abortControllerRef.current = new AbortController();
          const signal = abortControllerRef.current.signal;
    
          setLoading(true);
    
          try {
            const res = await fetch(
              `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
              { signal }
            );
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            console.log(data.Search);
            setMovies(data.Search || []);
            setLoading(false);
          } catch (e) {
            if (e.name !== "AbortError") {
              console.log(e.message);
              setError(e.message);
            }
          } finally {
            setLoading(false);
          }
        }
    
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
          fetchMovie();
        }, 500);
    
        return () => {
          clearTimeout(debounceTimeoutRef.current);
          if (abortControllerRef.current) abortControllerRef.current.abort();
        };
      }, [query]);

      return {movies, error, loading};
}