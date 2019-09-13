import { getAutocomplete, getMovieLocations } from './api';
import 'awesomplete/awesomplete.css';
import 'awesomplete';

const debounce = (func, wait) => {
	let timeout;
	return () => {
		clearTimeout(timeout);
		timeout = setTimeout(func, wait);
	}
}

const input = document.getElementById('autocomplete-input');
const awesomplete = new Awesomplete(input, { minChars: 1 });

input.addEventListener('input', debounce(async () => {
  awesomplete.list = await getAutocomplete(input.value);
}, 500));

input.addEventListener('awesomplete-selectcomplete', async (e) => {
  const moviesLocations = await getMovieLocations(e.text.value);
  const event = new CustomEvent('changeMovieLocations', { detail: moviesLocations });
	document.getElementById('map').dispatchEvent(event);
	const selectedMovieTitle = document.createTextNode(e.text.value);
	const selectedMovie = document.getElementById('selected-movie');
	if (selectedMovie.firstChild) {
		selectedMovie.removeChild(selectedMovie.firstChild);
	}
	selectedMovie.appendChild(selectedMovieTitle);
});
