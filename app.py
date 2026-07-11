import numpy as np
import pandas as pd
from flask import Flask, render_template, request, redirect, url_for
import urllib.request
import bs4 as bs
import pickle

from datetime import date, datetime


app = Flask(__name__)


# -------------------------------------------------------
# Load NLP Model
# -------------------------------------------------------

clf = pickle.load(open("nlp_model.pkl", "rb"))
vectorizer = pickle.load(open("tranform.pkl", "rb"))


# -------------------------------------------------------
# Utility Functions
# -------------------------------------------------------

def convert_to_list(my_list):

    my_list = my_list.split('","')
    my_list[0] = my_list[0].replace('["', '')
    my_list[-1] = my_list[-1].replace('"]', '')

    return my_list


def convert_to_list_num(my_list):

    my_list = my_list.split(',')

    my_list[0] = my_list[0].replace("[", "")

    my_list[-1] = my_list[-1].replace("]", "")

    return my_list


def get_suggestions():

    data = pd.read_csv("main_data.csv")

    return list(data["movie_title"].str.capitalize())


# -------------------------------------------------------
# Home
# -------------------------------------------------------

@app.route("/")
@app.route("/home")
def home():

    suggestions = get_suggestions()

    return render_template(
        "home.html",
        suggestions=suggestions
    )


# -------------------------------------------------------
# Recommendation Page
# -------------------------------------------------------

@app.route("/recommend", methods=["POST"])
def recommend():

    movie = request.form.get("title")

    cast_ids = request.form["cast_ids"]
    cast_names = request.form["cast_names"]
    cast_chars = request.form["cast_chars"]
    cast_bdays = request.form["cast_bdays"]
    cast_bios = request.form["cast_bios"]
    cast_places = request.form["cast_places"]
    cast_profiles = request.form["cast_profiles"]

    imdb_id = request.form["imdb_id"]

    poster = request.form["poster"]

    genres = request.form["genres"]

    overview = request.form["overview"]

    vote_average = request.form["rating"]

    vote_count = request.form["vote_count"]

    rel_date = request.form["rel_date"]

    release_date = request.form["release_date"]

    runtime = request.form["runtime"]

    status = request.form["status"]

    rec_movies = request.form["rec_movies"]

    rec_posters = request.form["rec_posters"]

    rec_movies_org = request.form["rec_movies_org"]

    rec_year = request.form["rec_year"]

    rec_vote = request.form["rec_vote"]


    suggestions = get_suggestions()


    rec_movies_org = convert_to_list(rec_movies_org)

    rec_movies = convert_to_list(rec_movies)

    rec_posters = convert_to_list(rec_posters)

    cast_names = convert_to_list(cast_names)

    cast_chars = convert_to_list(cast_chars)

    cast_profiles = convert_to_list(cast_profiles)

    cast_bdays = convert_to_list(cast_bdays)

    cast_bios = convert_to_list(cast_bios)

    cast_places = convert_to_list(cast_places)


    cast_ids = convert_to_list_num(cast_ids)

    rec_vote = convert_to_list_num(rec_vote)

    rec_year = convert_to_list_num(rec_year)


    for i in range(len(cast_bios)):

        cast_bios[i] = cast_bios[i].replace(
            r"\n",
            "\n"
        ).replace(
            r"\"",
            "\""
        )


    for i in range(len(cast_chars)):

        cast_chars[i] = cast_chars[i].replace(
            r"\n",
            "\n"
        ).replace(
            r"\"",
            "\""
        )


    movie_cards = {

        rec_posters[i]: [

            rec_movies[i],

            rec_movies_org[i],

            rec_vote[i],

            rec_year[i]

        ]

        for i in range(len(rec_posters))

    }


    casts = {

        cast_names[i]: [

            cast_ids[i],

            cast_chars[i],

            cast_profiles[i]

        ]

        for i in range(len(cast_profiles))

    }


    cast_details = {

        cast_names[i]: [

            cast_ids[i],

            cast_profiles[i],

            cast_bdays[i],

            cast_places[i],

            cast_bios[i]

        ]

        for i in range(len(cast_places))

    }
        # -------------------------------------------------------
    # Scrape IMDb Reviews
    # -------------------------------------------------------

    reviews_list = []
    reviews_status = []

    try:

        sauce = urllib.request.urlopen(
            "https://www.imdb.com/title/{}/reviews?ref_=tt_ov_rt".format(imdb_id)
        ).read()

        soup = bs.BeautifulSoup(sauce, "lxml")

        soup_result = soup.find_all(
            "div",
            {
                "class": "text show-more__control"
            }
        )

        for review in soup_result:

            if review.string:

                reviews_list.append(review.string)

                movie_review = np.array([review.string])

                movie_vector = vectorizer.transform(movie_review)

                pred = clf.predict(movie_vector)

                if pred:

                    reviews_status.append("Positive")

                else:

                    reviews_status.append("Negative")

    except:

        pass


    movie_reviews = {

        reviews_list[i]: reviews_status[i]

        for i in range(len(reviews_list))

    }


    # -------------------------------------------------------
    # Release Date
    # -------------------------------------------------------

    movie_rel_date = ""

    curr_date = ""

    if rel_date:

        today = str(date.today())

        curr_date = datetime.strptime(
            today,
            "%Y-%m-%d"
        )

        movie_rel_date = datetime.strptime(
            rel_date,
            "%Y-%m-%d"
        )


    # -------------------------------------------------------
    # Render Recommendation Page
    # -------------------------------------------------------

    return render_template(

        "recommend.html",

        title=movie,

        poster=poster,

        overview=overview,

        vote_average=vote_average,

        vote_count=vote_count,

        release_date=release_date,

        movie_rel_date=movie_rel_date,

        curr_date=curr_date,

        runtime=runtime,

        status=status,

        genres=genres,

        movie_cards=movie_cards,

        reviews=movie_reviews,

        casts=casts,

        cast_details=cast_details,

        suggestions=suggestions

    )


# -------------------------------------------------------
# Redirect
# -------------------------------------------------------

@app.route("/movie/<movie_name>")
def movie_page(movie_name):

    return redirect(

        url_for(

            "recommend",

            movie=movie_name

        )

    )


# -------------------------------------------------------
# Run
# -------------------------------------------------------

if __name__ == "__main__":

    app.run(debug=True)