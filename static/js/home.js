
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const GENRES = {
    "All": null,
    "Action": 28,
    "Adventure": 12,
    "Animation": 16,
    "Comedy": 35,
    "Crime": 80,
    "Documentary": 99,
    "Drama": 18,
    "Family": 10751,
    "Fantasy": 14,
    "History": 36,
    "Horror": 27,
    "Music": 10402,
    "Mystery": 9648,
    "Romance": 10749,
    "Science Fiction": 878,
    "TV Movie": 10770,
    "Thriller": 53,
    "War": 10752,
    "Western": 37
};

const movieGrid = document.getElementById("movie-grid");
const loader = document.getElementById("loader");
const genreSelect = document.getElementById("genre-select");
const sectionTitle = document.getElementById("section-title");

document.addEventListener("DOMContentLoaded", function () {

    initialiseSearch();

    loadPopularMovies();

    genreSelect.addEventListener("change", function () {

        if (this.value === "All") {

            sectionTitle.innerText = "Popular Movies";

            loadPopularMovies();

        } else {

            sectionTitle.innerText = this.value + " Movies";

            loadGenreMovies(this.value);

        }

    });

});

function showLoader() {

    loader.style.display = "flex";

}

function hideLoader() {

    loader.style.display = "none";

}

async function loadPopularMovies() {

    showLoader();

    try {

        const response = await fetch(

            `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`

        );

        const data = await response.json();

        renderMovies(data.results);

    }

    catch (err) {

        console.log(err);

    }

    hideLoader();

}

async function loadGenreMovies(genreName) {

    showLoader();

    const genreId = GENRES[genreName];

    try {

        const response = await fetch(

            `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`

        );

        const data = await response.json();

        renderMovies(data.results);

    }

    catch (err) {

        console.log(err);

    }

    hideLoader();

}
function renderMovies(movies) {

    movieGrid.innerHTML = "";

    if (!movies || movies.length === 0) {

        movieGrid.innerHTML =
            "<h2 style='text-align:center;width:100%;color:white;'>No Movies Found</h2>";

        return;
    }

    movies.forEach(function (movie) {

        const card = createMovieCard(movie);

        movieGrid.appendChild(card);

    });

}


function createMovieCard(movie) {

    const template = document
        .getElementById("movie-card-template")
        .content
        .cloneNode(true);

    const poster = template.querySelector(".movie-poster");
    const title = template.querySelector(".movie-title");
    const year = template.querySelector(".movie-year");
    const genre = template.querySelector(".movie-genre");
    const rating = template.querySelector(".movie-rating span");
    const card = template.querySelector(".movie-card");

    if (movie.poster_path) {

        poster.src = IMAGE_URL + movie.poster_path;

    }
    else {

        poster.src = "/static/images/default.jpg";

    }

    poster.loading = "lazy";

    title.innerText = movie.title;

    if (movie.release_date && movie.release_date.length >= 4) {

        year.innerText = movie.release_date.substring(0, 4);

    }
    else {

        year.innerText = "N/A";

    }

    rating.innerText = movie.vote_average
        ? Number(movie.vote_average).toFixed(1)
        : "N/A";

    if (movie.genre_ids && movie.genre_ids.length > 0) {

        genre.innerText = convertGenreIds(movie.genre_ids);

    }
    else {

        genre.innerText = "";

    }

    card.setAttribute("title", movie.title);

    card.onclick = function () {

        searchMovie(movie.title);

    };

    return template;

}


function convertGenreIds(ids) {

    const reverseGenre = {

        28: "Action",
        12: "Adventure",
        16: "Animation",
        35: "Comedy",
        80: "Crime",
        99: "Documentary",
        18: "Drama",
        10751: "Family",
        14: "Fantasy",
        36: "History",
        27: "Horror",
        10402: "Music",
        9648: "Mystery",
        10749: "Romance",
        878: "Sci-Fi",
        10770: "TV Movie",
        53: "Thriller",
        10752: "War",
        37: "Western"

    };

    let names = [];

    ids.forEach(function (id) {

        if (reverseGenre[id]) {

            names.push(reverseGenre[id]);

        }

    });

    if (names.length === 0) {

        return "";

    }

    return names.slice(0, 2).join(" • ");

}
function searchMovie(movieTitle) {

    const movieInput = document.getElementById("movie-search");

    movieInput.value = movieTitle;

    showLoader();

    if (typeof load_details === "function") {

        load_details(API_KEY, movieTitle);

    }
    else {

        hideLoader();

        alert("recommend.js is not loaded.");

    }

}


function initialiseSearch() {

    const input = document.getElementById("movie-search");

    const suggestionBox = document.getElementById("suggestions");

    input.addEventListener("input", function () {

        const value = this.value.trim().toLowerCase();

        suggestionBox.innerHTML = "";

        if (value.length === 0) {

            suggestionBox.style.display = "none";

            return;

        }

        const filtered = suggestions
            .filter(movie =>
                movie.toLowerCase().startsWith(value)
            )
            .slice(0, 8);

        if (filtered.length === 0) {

            suggestionBox.style.display = "none";

            return;

        }

        suggestionBox.style.display = "block";

        filtered.forEach(function (movie) {

            const div = document.createElement("div");

            div.className = "suggestion-item";

            div.innerText = movie;

            div.onclick = function () {

                input.value = movie;

                suggestionBox.innerHTML = "";

                suggestionBox.style.display = "none";

                searchMovie(movie);

            };

            suggestionBox.appendChild(div);

        });

    });


    document.addEventListener("click", function (e) {

        if (!e.target.closest(".search-container")) {

            suggestionBox.style.display = "none";

        }

    });


    document
        .getElementById("search-form")
        .addEventListener("submit", function (e) {

            e.preventDefault();

            const movie = input.value.trim();

            if (movie === "") {

                alert("Please enter a movie name.");

                return;

            }

            searchMovie(movie);

        });


    input.addEventListener("keypress", function (e) {

        if (e.key === "Enter") {

            e.preventDefault();

            const movie = input.value.trim();

            if (movie !== "") {

                searchMovie(movie);

            }

        }

    });

}
/* ===========================
   PART 4
   Utilities & UI Enhancements
=========================== */

window.addEventListener("load", function () {

    hideLoader();

});


window.addEventListener("error", function () {

    hideLoader();

});


document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        document.getElementById("suggestions").style.display = "none";

    }

});


movieGrid.addEventListener("mouseover", function (e) {

    const card = e.target.closest(".movie-card");

    if (!card) return;

    card.style.transform = "translateY(-8px)";

    card.style.transition = "0.3s";

});


movieGrid.addEventListener("mouseout", function (e) {

    const card = e.target.closest(".movie-card");

    if (!card) return;

    card.style.transform = "translateY(0px)";

});


function clearMovies() {

    movieGrid.innerHTML = "";

}


function shuffleMovies(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];

    }

    return array;

}


function randomSubset(movies, count = 20) {

    if (!movies) return [];

    let copy = [...movies];

    shuffleMovies(copy);

    return copy.slice(0, count);

}


function showError(message) {

    movieGrid.innerHTML = `

        <div style="width:100%;
                    text-align:center;
                    padding:60px;
                    color:white;
                    font-size:22px;">

            ${message}

        </div>

    `;

}


window.scrollToTop = function () {

    window.scroll({

        top: 0,

        behavior: "smooth"

    });

};


window.addEventListener("scroll", function () {

    if (window.scrollY > 300) {

        document.body.classList.add("scrolled");

    }

    else {

        document.body.classList.remove("scrolled");

    }

});


console.log("Movie Recommendation Home Loaded Successfully");