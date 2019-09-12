export const getMovieLocations = movieTitle => fetch(`/api/movie?title=${movieTitle}`).then(response => response.json());

export const getAutocomplete = searchTitle => fetch(`/api/autocomplete?search=${searchTitle}`).then(response => response.json());
