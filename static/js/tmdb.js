const API_KEY = "55a6a5ca3cdfe2fea08ca6f270dde6a2";

function load_details(api_key, title) {

    if (!title || title.trim() === "") {
        alert("Please enter a movie name.");
        return;
    }

    $("#loader").fadeIn();

    $.ajax({

        type: "GET",

        url:
            "https://api.themoviedb.org/3/search/movie?api_key=" +
            api_key +
            "&query=" +
            encodeURIComponent(title),

        async: false,

        success: function (movie) {

            if (movie.results.length < 1) {

                $("#loader").fadeOut();

                alert("Movie not found.");

                return;

            }

            if (movie.results.length === 1) {

                get_movie_details(
                    movie.results[0].id,
                    api_key,
                    movie.results[0].title,
                    movie.results[0].original_title
                );

                return;

            }

            let close_match = {};

            let movie_id = "";

            let movie_title = "";

            let movie_title_org = "";

            let exact_found = false;

            for (let i = 0; i < movie.results.length; i++) {

                if (
                    title.toLowerCase() ===
                    movie.results[i].original_title.toLowerCase()
                ) {

                    exact_found = true;

                    movie_id = movie.results[i].id;

                    movie_title = movie.results[i].title;

                    movie_title_org = movie.results[i].original_title;

                    break;

                }

                close_match[movie.results[i].title] =
                    similarity(title, movie.results[i].title);

            }

            if (!exact_found) {

                movie_title = Object.keys(close_match).reduce(function (a, b) {

                    return close_match[a] > close_match[b] ? a : b;

                });

                const index = Object.keys(close_match).indexOf(movie_title);

                movie_id = movie.results[index].id;

                movie_title_org = movie.results[index].original_title;

            }

            get_movie_details(
                movie_id,
                api_key,
                movie_title,
                movie_title_org
            );

        },

        error: function (error) {

            $("#loader").fadeOut();

            alert("TMDB API Error");

            console.log(error);

        }

    });

}



function similarity(s1, s2) {

    let longer = s1;

    let shorter = s2;

    if (s1.length < s2.length) {

        longer = s2;

        shorter = s1;

    }

    let longerLength = longer.length;

    if (longerLength === 0)

        return 1.0;

    return (

        longerLength -

        editDistance(longer, shorter)

    ) / parseFloat(longerLength);

}



function editDistance(s1, s2) {

    s1 = s1.toLowerCase();

    s2 = s2.toLowerCase();

    let costs = [];

    for (let i = 0; i <= s1.length; i++) {

        let lastValue = i;

        for (let j = 0; j <= s2.length; j++) {

            if (i === 0)

                costs[j] = j;

            else {

                if (j > 0) {

                    let newValue = costs[j - 1];

                    if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {

                        newValue = Math.min(

                            Math.min(newValue, lastValue),

                            costs[j]

                        ) + 1;

                    }

                    costs[j - 1] = lastValue;

                    lastValue = newValue;

                }

            }

        }

        if (i > 0)

            costs[s2.length] = lastValue;

    }

    return costs[s2.length];

}

function get_movie_details(movie_id, api_key, movie_title, movie_title_org) {

    $.ajax({

        type: "GET",

        url:
            "https://api.themoviedb.org/3/movie/" +
            movie_id +
            "?api_key=" +
            api_key,

        success: function (movie_details) {

            show_details(
                movie_details,
                movie_title,
                api_key,
                movie_id,
                movie_title_org
            );

        },

        error: function (error) {

            $("#loader").fadeOut();

            console.log(error);

            alert("Unable to fetch movie details.");

        }

    });

}



function show_details(
    movie_details,
    movie_title,
    api_key,
    movie_id,
    movie_title_org
) {

    let imdb_id = movie_details.imdb_id;

    let poster = movie_details.poster_path
        ? "https://image.tmdb.org/t/p/original" + movie_details.poster_path
        : "/static/default.jpg";

    let overview = movie_details.overview;

    let genres = movie_details.genres;

    let rating = movie_details.vote_average;

    let vote_count = movie_details.vote_count;

    let release_date = movie_details.release_date;

    let runtime = parseInt(movie_details.runtime);

    let status = movie_details.status;

    let genre_list = [];

    genres.forEach(function (g) {

        genre_list.push(g.name);

    });

    let my_genre = genre_list.join(", ");

    if (runtime % 60 === 0) {

        runtime = Math.floor(runtime / 60) + " hour(s)";

    }
    else {

        runtime =
            Math.floor(runtime / 60) +
            " hour(s) " +
            (runtime % 60) +
            " min(s)";

    }


    const movie_cast = get_movie_cast(movie_id, api_key);

    const ind_cast = get_individual_cast(movie_cast, api_key);

    const recommendations = get_recommendations(movie_id, api_key);


    const details = {

        title: movie_title,

        cast_ids: JSON.stringify(movie_cast.cast_ids),

        cast_names: JSON.stringify(movie_cast.cast_names),

        cast_chars: JSON.stringify(movie_cast.cast_chars),

        cast_profiles: JSON.stringify(movie_cast.cast_profiles),

        cast_bdays: JSON.stringify(ind_cast.cast_bdays),

        cast_bios: JSON.stringify(ind_cast.cast_bios),

        cast_places: JSON.stringify(ind_cast.cast_places),

        imdb_id: imdb_id,

        poster: poster,

        genres: my_genre,

        overview: overview,

        rating: rating,

        vote_count: vote_count.toLocaleString(),

        rel_date: release_date,

        release_date: new Date(release_date)
            .toDateString()
            .split(" ")
            .slice(1)
            .join(" "),

        runtime: runtime,

        status: status,

        rec_movies: JSON.stringify(recommendations.rec_movies),

        rec_posters: JSON.stringify(recommendations.rec_posters),

        rec_movies_org: JSON.stringify(recommendations.rec_movies_org),

        rec_year: JSON.stringify(recommendations.rec_year),

        rec_vote: JSON.stringify(recommendations.rec_vote)

    };
        $.ajax({

        type: "POST",

        url: "/recommend",

        data: details,

        dataType: "html",

        success: function (response) {

            document.open();

            document.write(response);

            document.close();

            window.scrollTo(0, 0);

        },

        error: function (xhr, status, error) {

            console.error(error);

            alert("Unable to load recommendation page.");

        },

        complete: function () {

            $("#loader").fadeOut();

        }

    });

}

function get_individual_cast(movie_cast, api_key) {

    let cast_bdays = [];
    let cast_bios = [];
    let cast_places = [];

    for (let i = 0; i < movie_cast.cast_ids.length; i++) {

        $.ajax({

            type: "GET",

            url:
                "https://api.themoviedb.org/3/person/" +
                movie_cast.cast_ids[i] +
                "?api_key=" +
                api_key,

            async: false,

            success: function (cast_details) {

                if (cast_details.birthday) {

                    cast_bdays.push(
                        new Date(cast_details.birthday)
                            .toDateString()
                            .split(" ")
                            .slice(1)
                            .join(" ")
                    );

                } else {

                    cast_bdays.push("Not Available");

                }

                cast_bios.push(
                    cast_details.biography || "Not Available"
                );

                cast_places.push(
                    cast_details.place_of_birth || "Not Available"
                );

            }

        });

    }

    return {

        cast_bdays: cast_bdays,
        cast_bios: cast_bios,
        cast_places: cast_places

    };

}



function get_movie_cast(movie_id, api_key) {

    let cast_ids = [];
    let cast_names = [];
    let cast_chars = [];
    let cast_profiles = [];

    $.ajax({

        type: "GET",

        url:
            "https://api.themoviedb.org/3/movie/" +
            movie_id +
            "/credits?api_key=" +
            api_key,

        async: false,

        success: function (movie) {

            let limit = Math.min(10, movie.cast.length);

            for (let i = 0; i < limit; i++) {

                cast_ids.push(movie.cast[i].id);

                cast_names.push(movie.cast[i].name);

                cast_chars.push(movie.cast[i].character);

                if (movie.cast[i].profile_path) {

                    cast_profiles.push(
                        "https://image.tmdb.org/t/p/original" +
                        movie.cast[i].profile_path
                    );

                } else {

                    cast_profiles.push("/static/default.jpg");

                }

            }

        },

        error: function () {

            console.log("Unable to fetch cast.");

        }

    });

    return {

        cast_ids: cast_ids,
        cast_names: cast_names,
        cast_chars: cast_chars,
        cast_profiles: cast_profiles

    };

}



function get_recommendations(movie_id, api_key) {

    let rec_movies = [];
    let rec_movies_org = [];
    let rec_posters = [];
    let rec_year = [];
    let rec_vote = [];

    $.ajax({

        type: "GET",

        url:
            "https://api.themoviedb.org/3/movie/" +
            movie_id +
            "/recommendations?api_key=" +
            api_key,

        async: false,

        success: function (recommend) {

            recommend.results.forEach(function (movie) {

                rec_movies.push(movie.title);

                rec_movies_org.push(movie.original_title);

                rec_year.push(
                    movie.release_date
                        ? new Date(movie.release_date).getFullYear()
                        : ""
                );

                rec_vote.push(movie.vote_average);

                if (movie.poster_path) {

                    rec_posters.push(
                        "https://image.tmdb.org/t/p/original" +
                        movie.poster_path
                    );

                } else {

                    rec_posters.push("/static/default.jpg");

                }

            });

        },

        error: function () {

            console.log("Unable to fetch recommendations.");

        }

    });

    return {

        rec_movies: rec_movies,
        rec_movies_org: rec_movies_org,
        rec_posters: rec_posters,
        rec_year: rec_year,
        rec_vote: rec_vote

    };

}