import { getAllFilms, getFilmByTitle } from "../services/films_service.js";

export function filmController(app) {
    app.get('/films', (req,res) => {
        getAllFilms().then(films => res.send(JSON.stringify(films)));
    })
    app.get('/film', (req, res) => {
        getFilmByTitle(req.query).then(films => {
            res.status(200)
            res.send(films)
        }).catch(err => {
            res.status(400)
            res.send(err)
        })
    })
   
}