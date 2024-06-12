import React, { useEffect, useState } from "react";
import StarRating from "./StarRating";
import toast, { Toaster } from "react-hot-toast";
const API_KEY = "efb985aa";

const MovieDetails = ({ id, handleCloseMovie, watched, setWatched }) => {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState("");

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    imdbID,
  } = movie;

  function handleMovieAdd() {
    if (!rating) {
      toast.error("Rate the movie first!", {
        style: {
          background: "#343a40",
          color: "white",
          padding: "1.2rem",
          fontSize: "1.65rem",
        },
        duration: 1500,
      });
      return;
    }
    const newWatchedMovie = {
      imdbID,
      poster,
      title,
      imdbRating: Number(imdbRating),
      userRating: rating,
      runtime: Number(runtime.split(" ")[0]),
    };
    setWatched((prev) => [...prev, newWatchedMovie]);
    handleCloseMovie();
  }

  useEffect(() => {
    async function fetchMovie() {
      setIsLoading(true);
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
      );
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    fetchMovie();
  }, [id]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return () => (document.title = "usePopcorn");
  }, [title]);

  const watchedMovie = watched.find((elm) => elm.imdbID === imdbID);

  return (
    <div className="details">
      <Toaster />
      {isLoading ? (
        <p className="loader">LOADING...</p>
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie.title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!watchedMovie ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setRating}
                  />
                  <button
                    className="btn-add"
                    onClick={() => handleMovieAdd(movie)}
                  >
                    Add to list
                  </button>
                </>
              ) : (
                <p>
                  You have already added this movie {watchedMovie.userRating} ⭐
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
};

export default MovieDetails;
