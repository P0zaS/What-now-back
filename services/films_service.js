import { getAll, findByFilmTitle } from "../repositories/films_repository.js";

export function getAllFilms() {
  return getAll();
}
export function getFilmByTitle(film) {
  return new Promise((res, rej) => {
    if (film.title == "") rej("Not found");

    findByFilmTitle(film.title)
      .then((films) => {
        films ? res(films) : rej("Not found");
      })
      .catch((err) => {
        rej("Not found");
      });
  });
}

