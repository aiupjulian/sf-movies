export const getMovieLocations = (movieTitle) => fetch(`/api/movie?title=${movieTitle}`).then(response => response.json());
